(() => {
  'use strict';
  const ethereumOrder = [
    'why', 'ship', 'crops', 'protocol', 'gas', 'wallets', 'l2s', 'standards',
    'building-blocks', 'addresses', 'security', 'testing', 'indexing', 'frontend-ux',
    'orchestration', 'frontend-playbook', 'qa', 'audit', 'noir', 'feedback', 'tools', 'concepts'
  ];
  const search = document.querySelector('#skill-search');
  const count = document.querySelector('#skill-count');
  const container = document.querySelector('#ethereum-skills');

  function makeRow(skill) {
    const row = document.createElement('article');
    row.className = 'skill-row';
    row.dataset.search = `${skill.id} ${skill.title} ${skill.description}`.toLowerCase();
    const title = document.createElement('a');
    title.className = 'skill-title';
    title.href = `/${skill.id}/SKILL.md`;
    title.textContent = skill.title;
    const description = document.createElement('p');
    description.textContent = skill.description;
    const url = document.createElement('a');
    url.className = 'skill-url';
    url.href = `/${skill.id}/SKILL.md`;
    url.textContent = `ethskills.com/${skill.id}/SKILL.md`;
    row.append(title, description, url);
    return row;
  }

  function render(catalog) {
    const term = search.value.trim().toLowerCase();
    const skills = ethereumOrder.map(id => catalog.find(item => item.id === id)).filter(Boolean);
    let visible = 0;
    container.replaceChildren();
    for (const skill of skills) {
      const row = makeRow(skill);
      row.hidden = Boolean(term) && !row.dataset.search.includes(term);
      if (!row.hidden) visible++;
      container.append(row);
    }
    container.closest('.skill-section').hidden = !visible;
    count.textContent = `${visible} of ${skills.length} topic skills`;
    document.querySelector('#empty-search').hidden = visible > 0;
  }

  fetch('/assets/catalog.json')
    .then(response => {
      if (!response.ok) throw new Error(`Catalog request failed (${response.status})`);
      return response.json();
    })
    .then(catalog => {
      render(catalog);
      search.addEventListener('input', () => render(catalog));
    })
    .catch(error => {
      count.textContent = error.message;
      container.textContent = 'Open the Markdown index to browse the skills.';
    });

})();
