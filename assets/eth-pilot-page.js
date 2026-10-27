(() => {
  'use strict';
  const order = [
    'eth-pilot', 'eth-help', 'eth-discover', 'eth-how', 'eth-why', 'eth-teach',
    'eth-architect', 'eth-arena', 'eth-swarm', 'eth-tdd', 'eth-review', 'eth-verify',
    'eth-blast-radius', 'eth-correct', 'eth-reflect', 'eth-trace', 'eth-audit-swarm'
  ];
  const examplesBySkillId = {
    'eth-pilot': [
      'You have a dApp idea but are not sure which skills or steps it needs. Describe the goal and let Pilot choose the workflow.',
      'You want a change built and checked, but do not know whether to start with architecture, coding, review, or verification. Ask Pilot to work out the right path.'
    ],
    'eth-help': [
      'Find which skill fits a contract review and suggest a prompt.',
      'Explain what Ethskills can do without starting a task.'
    ],
    'eth-discover': [
      'Find an MCP server that can inspect this Solidity project.',
      'Compare external audit tools and check their source and freshness.'
    ],
    'eth-how': [
      'Trace how a button call reaches a contract and updates the UI.',
      'Explain where this project checks access permissions.'
    ],
    'eth-why': [
      'Find why the project chose this bridge or storage design.',
      'Trace which change introduced a regression and what evidence supports it.'
    ],
    'eth-teach': [
      'Teach me how token allowances work using this project’s code.',
      'Walk me through one transaction path as a beginner.'
    ],
    'eth-architect': [
      'Choose where withdrawal limits should live and who can change them.',
      'Compare custody designs before implementation begins.'
    ],
    'eth-arena': [
      'Compare two implementations against the same acceptance criteria.',
      'Try competing designs when the tradeoff is unclear from inspection.'
    ],
    'eth-swarm': [
      'Split an integration review into independent contract and client slices.',
      'Delegate separate features that can be changed and checked independently.'
    ],
    'eth-tdd': [
      'Reproduce a withdrawal bug with a failing behavior check before fixing it.',
      'Check that a claim cannot be submitted twice.'
    ],
    'eth-review': [
      'Look for reachable failure paths in a proposed contract change.',
      'Assess an engineering change for integration risks before release.'
    ],
    'eth-verify': [
      'Run the project’s contract checks and report what they cover.',
      'Click through the actual browser flow and capture evidence.'
    ],
    'eth-blast-radius': [
      'Trace which clients and indexers depend on a changed event.',
      'Find consumers affected by an ABI or storage layout change.'
    ],
    'eth-correct': [
      'Turn a repeated agent mistake into a lint rule or project check.',
      'Find a small guardrail for the same failure seen in several tasks.'
    ],
    'eth-reflect': [
      'Use evidence from a finished task to propose a skill improvement.',
      'Separate a supported lesson from a one-off failure.'
    ],
    'eth-trace': [
      'Keep decisions and checks visible during a long implementation.',
      'Leave a checked handoff so another session can continue later.'
    ],
    'eth-audit-swarm': [
      'Run relevant independent audit methods on a smart contract.',
      'Compare provider coverage and validate findings before reporting them.'
    ]
  };
  const list = document.querySelector('#pilot-skills');
  const error = document.querySelector('#pilot-skills-error');

  function makeCard(skill) {
    const card = document.createElement('article');
    card.className = 'pilot-skill-card';
    const title = document.createElement('a');
    title.className = 'skill-title';
    title.href = `/${skill.id}/SKILL.md`;
    title.textContent = skill.title;
    const description = document.createElement('p');
    description.textContent = skill.description;
    const url = document.createElement('span');
    url.className = 'skill-url';
    url.textContent = `/${skill.id}/SKILL.md`;
    const details = document.createElement('details');
    details.className = 'pilot-skill-examples';
    const summary = document.createElement('summary');
    summary.textContent = 'When to use it';
    const examples = document.createElement('ul');
    for (const example of examplesBySkillId[skill.id]) {
      const item = document.createElement('li');
      item.textContent = example;
      examples.append(item);
    }
    details.append(summary, examples);
    card.append(title, description, details, url);
    return card;
  }

  fetch('/assets/catalog.json')
    .then(response => {
      if (!response.ok) throw new Error(`Catalog request failed (${response.status})`);
      return response.json();
    })
    .then(catalog => {
      const byId = new Map(catalog.map(skill => [skill.id, skill]));
      const skills = order.map(id => byId.get(id)).filter(skill => skill?.group === 'engineering');
      if (skills.some(skill => examplesBySkillId[skill.id]?.length !== 2)) {
        throw new Error('Each Ethskills Pilot skill needs two usage examples');
      }
      list.replaceChildren(...skills.map(makeCard));
      if (skills.length !== order.length) throw new Error('Ethskills Pilot catalog is incomplete');
    })
    .catch(() => {
      list.hidden = true;
      error.hidden = false;
    });
})();
