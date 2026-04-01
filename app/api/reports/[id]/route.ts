import { neon } from '@neondatabase/serverless';
import { NextRequest, NextResponse } from 'next/server';

function getSql() {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL environment variable is not set');
  }
  return neon(process.env.DATABASE_URL);
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const apiKey = req.headers.get('Authorization')?.replace('Bearer ', '');
  if (apiKey !== process.env.REPORTS_API_KEY) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;

  let body: { resolved?: boolean };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  if (typeof body.resolved !== 'boolean') {
    return NextResponse.json({ error: 'resolved (boolean) is required' }, { status: 400 });
  }

  const sql = getSql();
  const updated = await sql`
    UPDATE reports.reports
    SET resolved = ${body.resolved}
    WHERE id = ${id}
    RETURNING id, agent_id, error_type, message, context, created_at, resolved
  `;

  if (updated.length === 0) {
    return NextResponse.json({ error: 'Report not found' }, { status: 404 });
  }

  return NextResponse.json({ success: true, report: updated[0] });
}
