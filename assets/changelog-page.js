(() => {
  'use strict';
  const added = [
    'eth-pilot', 'eth-help', 'eth-discover', 'eth-how', 'eth-why', 'eth-teach',
    'eth-architect', 'eth-arena', 'eth-swarm', 'eth-tdd', 'eth-review', 'eth-verify',
    'eth-blast-radius', 'eth-correct', 'eth-reflect', 'eth-trace', 'eth-audit-swarm'
  ];
  const updated = [
    ['ethskills', 'Ethskills index', '/SKILL.md', 'Adds the Ethskills Pilot entry point and routes tasks through engineering workflows and relevant Ethereum guidance.'],
    ['audit', 'Contract audit', '/audit/SKILL.md', 'Selects reviewers by capability, reports missing coverage, and requires authorization before public disclosure.'],
    ['building-blocks', 'DeFi building blocks', '/building-blocks/SKILL.md', 'Adds checks for protocol controls, current administrators, and whether users retain a workable exit.'],
    ['feedback', 'Feedback', '/feedback/SKILL.md', 'Corrects the skill metadata name for consistent packaging.'],
    ['openclaw-skill', 'OpenClaw setup', '/openclaw-skill/SKILL.md', 'Uses Ethskills Pilot and Verify as the task entry points and clarifies local versus production skill sources.'],
    ['qa', 'dApp QA', '/qa/SKILL.md', 'Makes the checklist stack-aware and ties each result to browser or contract evidence.'],
    ['ship', 'Ship a dApp', '/ship/SKILL.md', 'Uses Ethskills Pilot for execution, scopes guidance to the detected stack, and removes automatic feedback submission.'],
    ['testing', 'Testing', '/testing/SKILL.md', 'Adds Foundry and Hardhat tool adapters and names unavailable test capabilities as coverage gaps.'],
    ['tools', 'Tools', '/tools/SKILL.md', 'Starts with installed project tools and versions instead of prescribing a fixed toolchain.']
  ];
  const addedList = document.querySelector('#added-skills');
  const updatedList = document.querySelector('#updated-skills');

  function row(title, description, href, label) {
    const item = document.createElement('article');
    item.className = 'change-row';
    const heading = document.createElement('h3');
    const kind = document.createElement('span');
    kind.className = 'change-kind';
    kind.textContent = label;
    const link = document.createElement('a');
    link.href = href;
    link.textContent = title;
    heading.append(kind, link);
    const text = document.createElement('p');
    text.textContent = description;
    item.append(heading, text);
    return item;
  }

  fetch('/assets/catalog.json').then(response => {
    if (!response.ok) throw new Error(`Catalog request failed (${response.status})`);
    return response.json();
  }).then(catalog => {
    const byId = new Map(catalog.map(skill => [skill.id, skill]));
    addedList.replaceChildren();
    updatedList.replaceChildren();
    for (const id of added) {
      const skill = byId.get(id);
      if (skill) addedList.append(row(skill.title, skill.description, `/${id}/SKILL.md`, 'Added'));
    }
    for (const [id, title, href, description] of updated) {
      updatedList.append(row(title, description, href, 'Updated'));
    }
  }).catch(error => {
    addedList.textContent = error.message;
  });
})();
