const RATE_LIMIT_WINDOW = 5 * 60 * 1000; // 5 minutes in ms
const recentIPs = new Map();

function rateLimit(ip) {
  const now = Date.now();
  const last = recentIPs.get(ip);
  if (last && now - last < RATE_LIMIT_WINDOW) return false;
  recentIPs.set(ip, now);
  if (recentIPs.size > 1000) {
    for (const [k, v] of recentIPs) {
      if (now - v > RATE_LIMIT_WINDOW) recentIPs.delete(k);
    }
  }
  return true;
}

async function kvCommand(...args) {
  const url = process.env.KV_REST_API_URL;
  const token = process.env.KV_REST_API_TOKEN;
  const res = await fetch(`${url}/${args.map(encodeURIComponent).join('/')}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.json();
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  if (!process.env.KV_REST_API_URL || !process.env.KV_REST_API_TOKEN) {
    return res.status(500).json({ error: 'storage not configured' });
  }

  // POST: submit feedback
  if (req.method === 'POST') {
    const ip = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || 'unknown';
    if (!rateLimit(ip)) {
      return res.status(429).json({ error: 'Too many requests. Please wait 5 minutes.' });
    }

    const { problem, skill, context, agent } = req.body || {};

    if (!problem || typeof problem !== 'string' || problem.trim().length < 10) {
      return res.status(400).json({ error: 'problem is required (min 10 chars)' });
    }

    const entry = JSON.stringify({
      id: Date.now().toString(),
      ts: new Date().toISOString(),
      problem: problem.trim().slice(0, 2000),
      skill: skill ? String(skill).trim().slice(0, 100) : null,
      context: context ? String(context).trim().slice(0, 2000) : null,
      agent: agent ? String(agent).trim().slice(0, 100) : null,
    });

    const parsed = JSON.parse(entry);
    await kvCommand('lpush', 'ethskills:feedback', entry);
    return res.status(200).json({ ok: true, id: parsed.id });
  }

  // GET: read feedback (requires secret)
  if (req.method === 'GET') {
    const { secret } = req.query;
    if (!process.env.FEEDBACK_SECRET || secret !== process.env.FEEDBACK_SECRET) {
      return res.status(401).json({ error: 'unauthorized' });
    }

    const result = await kvCommand('lrange', 'ethskills:feedback', '0', '199');
    const entries = (result.result || []).map(e => (typeof e === 'string' ? JSON.parse(e) : e));
    return res.status(200).json({ count: entries.length, entries });
  }

  return res.status(405).json({ error: 'method not allowed' });
}
