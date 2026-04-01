import { neon } from '@neondatabase/serverless';
import { NextRequest, NextResponse } from 'next/server';

const RATE_LIMIT_HOURS = 1;

// Lazy initialization to avoid build-time env var error
function getSql() {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL environment variable is not set');
  }
  return neon(process.env.DATABASE_URL);
}

export async function POST(req: NextRequest) {
  // Auth
  const apiKey = req.headers.get('Authorization')?.replace('Bearer ', '');
  if (apiKey !== process.env.REPORTS_API_KEY) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Parse body
  let body: { agent_id?: string; error_type?: string; message?: string; context?: Record<string, unknown> };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const { agent_id, error_type, message, context } = body;

  if (!agent_id || typeof agent_id !== 'string' || agent_id.trim() === '') {
    return NextResponse.json({ error: 'agent_id is required' }, { status: 400 });
  }
  if (!error_type || typeof error_type !== 'string' || error_type.trim() === '') {
    return NextResponse.json({ error: 'error_type is required' }, { status: 400 });
  }
  if (!message || typeof message !== 'string' || message.trim() === '') {
    return NextResponse.json({ error: 'message is required' }, { status: 400 });
  }

  const sql = getSql();
  const cutoff = new Date(Date.now() - RATE_LIMIT_HOURS * 60 * 60 * 1000).toISOString();

  // Rate limit check
  const existing = await sql`
    SELECT id FROM reports.reports
    WHERE agent_id = ${agent_id.trim()}
      AND created_at > ${cutoff}
    LIMIT 1
  `;

  if (existing.length > 0) {
    const retryAfter = RATE_LIMIT_HOURS * 3600;
    return NextResponse.json(
      {
        error: 'Rate limited',
        message: `One report per agent per ${RATE_LIMIT_HOURS} hour. Please wait.`,
        retry_after_seconds: retryAfter,
      },
      { status: 429, headers: { 'Retry-After': String(retryAfter) } }
    );
  }

  // Insert
  const inserted = await sql`
    INSERT INTO reports.reports (agent_id, error_type, message, context)
    VALUES (${agent_id.trim()}, ${error_type.trim()}, ${message.trim()}, ${JSON.stringify(context ?? {})})
    RETURNING id, agent_id, error_type, message, created_at
  `;

  return NextResponse.json(
    {
      success: true,
      report: inserted[0],
      message: 'Report received. Thank you for helping improve ethskills.',
    },
    { status: 201 }
  );
}

// GET returns usage docs
export async function GET() {
  return NextResponse.json(
    {
      usage: 'POST to this endpoint to report an issue',
      auth: 'Bearer <REPORTS_API_KEY>',
      body: {
        agent_id: 'string — identifier for your agent (e.g. "clawdheart", "larvai")',
        error_type:
          'string — category: "wrong_info" | "broken_link" | "missing_data" | "api_error" | "other"',
        message: 'string — description of the problem',
        context:
          'object (optional) — additional context: { skill?: string, url?: string, details?: any }',
      },
      rate_limit: `1 report per agent per ${RATE_LIMIT_HOURS} hour`,
      example: {
        method: 'POST',
        headers: { Authorization: 'Bearer <key>', 'Content-Type': 'application/json' },
        body: {
          agent_id: 'my-agent',
          error_type: 'wrong_info',
          message: 'The gas price for Base was listed as 0.05 gwei but my agent saw 50 gwei.',
          context: { skill: 'gas', url: 'https://ethskills.com/gas/SKILL.md' },
        },
      },
    },
    { status: 200 }
  );
}
