const RATE_LIMIT_WINDOW = 5 * 60 * 1000;
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

async function kvGet(path) {
  const url = process.env.KV_REST_API_URL;
  const token = process.env.KV_REST_API_TOKEN;
  const res = await fetch(`${url}/${path}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.json();
}

async function kvPost(path, body) {
  const url = process.env.KV_REST_API_URL;
  const token = process.env.KV_REST_API_TOKEN;
  const res = await fetch(`${url}/${path}`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
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

  // POST: submit feedback (public) or mark as read (secret required)
  if (req.method === 'POST') {
    const { action } = req.query;

    // Mark as read
    if (action === 'read') {
      const { secret, id } = req.query;
      if (!process.env.FEEDBACK_SECRET || secret !== process.env.FEEDBACK_SECRET) {
        return res.status(401).json({ error: 'unauthorized' });
      }
      if (!id) return res.status(400).json({ error: 'id required' });
      await kvGet(`sadd/ethskills:feedback:read/${encodeURIComponent(id)}`);
      return res.status(200).json({ ok: true });
    }

    // Submit feedback
    const ip = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || 'unknown';
    if (!rateLimit(ip)) {
      return res.status(429).json({ error: 'Too many requests. Please wait 5 minutes.' });
    }

    const { kind, problem, skill, context, agent } = req.body || {};
    if (!problem || typeof problem !== 'string' || problem.trim().length < 10) {
      return res.status(400).json({ error: 'problem is required (min 10 chars)' });
    }
    const normalizedKind = kind === 'praise' ? 'praise' : 'issue';

    const entry = JSON.stringify({
      id: Date.now().toString(),
      ts: new Date().toISOString(),
      kind: normalizedKind,
      problem: problem.trim().slice(0, 2000),
      skill: skill ? String(skill).trim().slice(0, 100) : null,
      context: context ? String(context).trim().slice(0, 2000) : null,
      agent: agent ? String(agent).trim().slice(0, 100) : null,
    });

    const parsed = JSON.parse(entry);
    await kvGet(`lpush/ethskills:feedback/${encodeURIComponent(entry)}`);
    return res.status(200).json({ ok: true, id: parsed.id });
  }

  // GET: read feedback (secret required)
  if (req.method === 'GET') {
    const { secret } = req.query;
    if (!process.env.FEEDBACK_SECRET || secret !== process.env.FEEDBACK_SECRET) {
      return res.status(401).json({ error: 'unauthorized' });
    }

    const [listResult, readResult] = await Promise.all([
      kvGet('lrange/ethskills:feedback/0/199'),
      kvGet('smembers/ethskills:feedback:read'),
    ]);

    const readIds = new Set(readResult.result || []);
    const entries = (listResult.result || []).map(e => {
      const parsed = typeof e === 'string' ? JSON.parse(e) : e;
      return { ...parsed, read: readIds.has(parsed.id) };
    });

    return res.status(200).json({ count: entries.length, entries });
  }

  return res.status(405).json({ error: 'method not allowed' });
}
