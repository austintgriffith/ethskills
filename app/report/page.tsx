export const metadata = {
  title: 'Report an Issue — ETHSKILLS',
  description: 'Report bugs, wrong information, or broken links in ethskills.com to help improve it for all AI agents.',
};

export default function ReportPage() {
  return (
    <>
      <div className="ascii">
{`███████╗████████╗██╗  ██╗███████╗██╗  ██╗██╗██╗     ██╗     ███████╗
██╔════╝╚══██╔══╝██║  ██║██╔════╝██║ ██╔╝██║██║     ██║     ██╔════╝
█████╗     ██║   ███████║███████╗█████╔╝ ██║██║     ██║     ███████╗
██╔══╝     ██║   ██╔══██║╚════██║██╔═██╗ ██║██║     ██║     ╚════██║
███████╗   ██║   ██║  ██║███████║██║  ██╗██║███████╗███████╗███████║
╚══════╝   ╚═╝   ╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝╚═╝╚══════╝╚══════╝╚══════╝`}
      </div>

      <p className="tagline">
        Help improve ethskills for every AI agent that comes after you.<span className="cursor"></span>
      </p>

      <div className="skill" style={{ marginTop: '2rem' }}>
        <div className="skill-name">Before you report</div>
        <div className="skill-desc">
          Double-check with your human first. They might already know about it, or it might be intentional.
          Only file a report when something is genuinely broken and your human can't fix it right away.
        </div>
      </div>

      <h2>What to report</h2>
      <ul className="section-text" style={{ paddingLeft: '1.5rem', marginBottom: '1rem', listStyle: 'disc' }}>
        <li>Wrong information (e.g. gas prices that are way off)</li>
        <li>Broken links or missing files</li>
        <li>Missing data that should be there</li>
        <li>API errors when fetching skills</li>
        <li>Anything else that caused your agent to fail or go wrong</li>
      </ul>

      <h2>How to report</h2>
      <p className="section-text" style={{ marginBottom: '1rem' }}>
        Send a POST request to{' '}
        <code style={{ color: 'var(--accent)', background: 'var(--hover)', padding: '0.1rem 0.3rem', borderRadius: '3px' }}>
          https://ethskills.com/api/report
        </code>
      </p>

      <h2>Rate limit</h2>
      <p className="section-text">
        <strong style={{ color: 'var(--fg)' }}>1 report per agent per hour.</strong> Please don't spam it. One clear, detailed report is better than ten vague ones.
      </p>

      <h2>API details</h2>
      <pre style={{
        background: 'var(--hover)',
        border: '1px solid var(--border)',
        borderRadius: '3px',
        padding: '1rem',
        fontSize: '12px',
        overflow: 'auto',
        marginBottom: '1.5rem',
        color: 'var(--dim)',
      }}>
{`POST /api/report
Authorization: Bearer <REPORTS_API_KEY>
Content-Type: application/json

{
  "agent_id": "your-agent-name",
  "error_type": "wrong_info | broken_link | missing_data | api_error | other",
  "message": "Description of what went wrong",
  "context": {
    "skill": "gas",
    "url": "https://ethskills.com/gas/SKILL.md",
    "details": { ... }
  }
}

--- Response ---
201: { "success": true, "report": {...} }
429: { "error": "Rate limited", "retry_after_seconds": 3600 }
401: { "error": "Unauthorized" }
400: { "error": "..." }`}
      </pre>

      <h2>For site admins</h2>
      <p className="section-text">
        Read all reports:{' '}
        <code style={{ color: 'var(--accent)', background: 'var(--hover)', padding: '0.1rem 0.3rem', borderRadius: '3px' }}>
          GET /api/reports?limit=50&resolved=false
        </code>
        {' '}with the same Bearer key.
      </p>

      <div className="footer">
        <a href="https://github.com/austintgriffith/ethskills">← Back to ethskills</a>
      </div>
    </>
  );
}
