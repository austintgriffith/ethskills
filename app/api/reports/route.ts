import { neon } from '@neondatabase/serverless';
import { NextRequest, NextResponse } from 'next/server';

function getSql() {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL environment variable is not set');
  }
  return neon(process.env.DATABASE_URL);
}

export async function GET(req: NextRequest) {
  const apiKey = req.headers.get('Authorization')?.replace('Bearer ', '');
  if (apiKey !== process.env.REPORTS_API_KEY) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const limit = Math.min(parseInt(searchParams.get('limit') ?? '50', 10), 200);
  const offset = parseInt(searchParams.get('offset') ?? '0', 10);
  const resolved = searchParams.get('resolved');
  const error_type = searchParams.get('error_type');
  const since = searchParams.get('since');

  const sql = getSql();

  const rows = await (async () => {
    if (resolved !== null && resolved !== undefined) {
      const resolvedVal = resolved === 'true';
      if (error_type && since) {
        return sql`SELECT id, agent_id, error_type, message, context, created_at, resolved FROM reports.reports WHERE resolved = ${resolvedVal} AND error_type = ${error_type} AND created_at > ${since} ORDER BY created_at DESC LIMIT ${limit} OFFSET ${offset}`;
      } else if (error_type) {
        return sql`SELECT id, agent_id, error_type, message, context, created_at, resolved FROM reports.reports WHERE resolved = ${resolvedVal} AND error_type = ${error_type} ORDER BY created_at DESC LIMIT ${limit} OFFSET ${offset}`;
      } else if (since) {
        return sql`SELECT id, agent_id, error_type, message, context, created_at, resolved FROM reports.reports WHERE resolved = ${resolvedVal} AND created_at > ${since} ORDER BY created_at DESC LIMIT ${limit} OFFSET ${offset}`;
      }
      return sql`SELECT id, agent_id, error_type, message, context, created_at, resolved FROM reports.reports WHERE resolved = ${resolvedVal} ORDER BY created_at DESC LIMIT ${limit} OFFSET ${offset}`;
    } else if (error_type) {
      if (since) {
        return sql`SELECT id, agent_id, error_type, message, context, created_at, resolved FROM reports.reports WHERE error_type = ${error_type} AND created_at > ${since} ORDER BY created_at DESC LIMIT ${limit} OFFSET ${offset}`;
      }
      return sql`SELECT id, agent_id, error_type, message, context, created_at, resolved FROM reports.reports WHERE error_type = ${error_type} ORDER BY created_at DESC LIMIT ${limit} OFFSET ${offset}`;
    } else if (since) {
      return sql`SELECT id, agent_id, error_type, message, context, created_at, resolved FROM reports.reports WHERE created_at > ${since} ORDER BY created_at DESC LIMIT ${limit} OFFSET ${offset}`;
    }
    return sql`SELECT id, agent_id, error_type, message, context, created_at, resolved FROM reports.reports ORDER BY created_at DESC LIMIT ${limit} OFFSET ${offset}`;
  })();

  const totalRows = await (async () => {
    if (resolved !== null && resolved !== undefined) {
      const resolvedVal = resolved === 'true';
      if (error_type && since) {
        return sql`SELECT COUNT(*) as total FROM reports.reports WHERE resolved = ${resolvedVal} AND error_type = ${error_type} AND created_at > ${since}`;
      } else if (error_type) {
        return sql`SELECT COUNT(*) as total FROM reports.reports WHERE resolved = ${resolvedVal} AND error_type = ${error_type}`;
      } else if (since) {
        return sql`SELECT COUNT(*) as total FROM reports.reports WHERE resolved = ${resolvedVal} AND created_at > ${since}`;
      }
      return sql`SELECT COUNT(*) as total FROM reports.reports WHERE resolved = ${resolvedVal}`;
    } else if (error_type) {
      if (since) {
        return sql`SELECT COUNT(*) as total FROM reports.reports WHERE error_type = ${error_type} AND created_at > ${since}`;
      }
      return sql`SELECT COUNT(*) as total FROM reports.reports WHERE error_type = ${error_type}`;
    } else if (since) {
      return sql`SELECT COUNT(*) as total FROM reports.reports WHERE created_at > ${since}`;
    }
    return sql`SELECT COUNT(*) as total FROM reports.reports`;
  })();

  return NextResponse.json({
    reports: rows,
    pagination: { limit, offset, total: Number(totalRows[0]?.total ?? 0) },
  });
}
