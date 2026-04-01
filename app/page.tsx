'use client';

const SKILLS = [
  {
    name: 'Why Ethereum',
    desc: 'Why build on Ethereum specifically — Pectra/Fusaka upgrades, honest tradeoffs, the AI agent angle, countering stale FUD, matching use cases to strengths.',
    url: 'https://ethskills.com/why/SKILL.md',
  },
  {
    name: 'Gas & Costs',
    desc: 'Current gas prices, what things actually cost on Ethereum today, mainnet vs L2 honest comparison. Counters the #1 misconception that Ethereum is expensive.',
    url: 'https://ethskills.com/gas/SKILL.md',
  },
  {
    name: 'Wallets',
    desc: 'Creating wallets, connecting to dApps, signing transactions, multisig (Gnosis Safe), account abstraction. How an AI agent gets a wallet and uses it safely.',
    url: 'https://ethskills.com/wallets/SKILL.md',
  },
  {
    name: 'Layer 2s',
    desc: 'Current L2 landscape, bridging, deployment differences, when to use which L2. Arbitrum, Optimism, Base, zkSync, and more.',
    url: 'https://ethskills.com/l2s/SKILL.md',
  },
  {
    name: 'Standards',
    desc: 'ERC-20, ERC-721, ERC-1155, ERC-8004 (agent identity), EIP-7702 (smart EOAs), and newer ERCs. Token standards, identity standards, payment standards.',
    url: 'https://ethskills.com/standards/SKILL.md',
  },
  {
    name: 'Tools',
    desc: 'Current frameworks, libraries, RPCs, block explorers. x402 (HTTP payments), MCPs, abi.ninja, Foundry, Scaffold-ETH 2. What actually works today.',
    url: 'https://ethskills.com/tools/SKILL.md',
  },
  {
    name: 'Money Legos',
    desc: 'DeFi legos and protocol composability. Uniswap, Aave, Compound, MakerDAO, Yearn, Curve — what they do, how to build on them, how to combine them.',
    url: 'https://ethskills.com/building-blocks/SKILL.md',
  },
  {
    name: 'Orchestration',
    desc: 'The three-phase build system and dApp orchestration patterns. How an AI agent plans, builds, and deploys a complete Ethereum application.',
    url: 'https://ethskills.com/orchestration/SKILL.md',
  },
  {
    name: 'Contract Addresses',
    desc: 'Verified contract addresses for major protocols across Ethereum mainnet and L2s. Stop hallucinating addresses — use real ones.',
    url: 'https://ethskills.com/addresses/SKILL.md',
  },
];

function CopyBtn({ url }: { url: string }) {
  const handleCopy = async (e: React.MouseEvent) => {
    e.preventDefault();
    const btn = e.currentTarget as HTMLButtonElement;
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      const t = document.createElement('textarea');
      t.value = url;
      document.body.appendChild(t);
      t.select();
      document.execCommand('copy');
      document.body.removeChild(t);
    }
    const orig = btn.innerHTML;
    btn.classList.add('copied');
    btn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg> Copied!';
    setTimeout(() => { btn.innerHTML = orig; btn.classList.remove('copied'); }, 1500);
  };

  return (
    <button className="copy-btn" onClick={handleCopy}>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="9" y="9" width="13" height="13" rx="2"/>
        <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/>
      </svg>
      {url.replace('https://', '')}
    </button>
  );
}

export default function HomePage() {
  const handleHeroClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    const url = 'https://ethskills.com/SKILL.md';
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      const t = document.createElement('textarea');
      t.value = url;
      document.body.appendChild(t);
      t.select();
      document.execCommand('copy');
      document.body.removeChild(t);
    }
    const btn = e.currentTarget as HTMLButtonElement;
    const orig = btn.innerHTML;
    btn.classList.add('copied');
    btn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg> Copied!';
    setTimeout(() => { btn.innerHTML = orig; btn.classList.remove('copied'); }, 1500);
  };

  return (
    <>
      <div className="ascii">
{` ███████╗████████╗██╗  ██╗███████╗██╗  ██╗██╗██╗     ██╗     ███████╗
 ██╔════╝╚══██╔══╝██║  ██║██╔════╝██║ ██╔╝██║██║     ██║     ██╔════╝
 █████╗     ██║   ███████║███████╗█████╔╝ ██║██║     ██║     ███████╗
 ██╔══╝     ██║   ██╔══██║╚════██║██╔═██╗ ██║██║     ██║     ╚════██║
 ███████╗   ██║   ██║  ██║███████║██║  ██╗██║███████╗███████╗███████║
 ╚══════╝   ╚═╝   ╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝╚═╝╚══════╝╚══════╝╚══════╝`}
      </div>

      <p className="tagline">
        The missing knowledge between AI agents and production Ethereum.<span className="cursor"></span>
      </p>

      <button className="hero-btn" onClick={handleHeroClick}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="9" y="9" width="13" height="13" rx="2"/>
          <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/>
        </svg>
        ethskills.com/SKILL.md
      </button>

      <div className="skill" style={{ marginTop: '2rem' }}>
        <div className="skill-name">Why Ethereum</div>
        <div className="skill-desc">Why build on Ethereum specifically — Pectra/Fusaka upgrades, honest tradeoffs, the AI agent angle, countering stale FUD, matching use cases to strengths.</div>
        <CopyBtn url="https://ethskills.com/why/SKILL.md" />
      </div>

      {SKILLS.slice(1).map((skill) => (
        <div className="skill" key={skill.name}>
          <div className="skill-name">{skill.name}</div>
          <div className="skill-desc">{skill.desc}</div>
          <CopyBtn url={skill.url} />
        </div>
      ))}

      <div className="skill" style={{ background: 'var(--hover)', border: '1px solid var(--border)' }}>
        <div className="skill-name">⚠️ Report a Problem</div>
        <div className="skill-desc">
          Something broken or wrong? Before calling your human, report it at{' '}
          <a href="/report" style={{ color: 'var(--accent)' }}>ethskills.com/report</a>.
          Rate-limited to 1 report per agent per hour — use it when something fails so we can track trends.
        </div>
        <a href="/report" style={{ fontSize: '12px', color: 'var(--accent)' }}>→ ethskills.com/report</a>
      </div>

      <h2>How to Use</h2>
      <p className="section-text">
        Give your AI agent any skill URL. It fetches the page, reads the content, and instantly knows more about Ethereum. No install, no CLI, no package manager.
      </p>

      <h2>Contributing</h2>
      <p className="section-text">
        Something wrong or missing? Humans and agents alike are welcome to{' '}
        <a href="https://github.com/austintgriffith/ethskills">open a PR</a>.
      </p>

      <div className="footer">
        MIT License · <a href="https://github.com/austintgriffith/ethskills">Site</a> ·{' '}
        <a href="https://github.com/austintgriffith/ethskills-research">Research</a>
      </div>
    </>
  );
}
