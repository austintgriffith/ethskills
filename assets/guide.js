(async () => {
  'use strict';
  const { loadJSON, loadText, renderMarkdown, errorPanel } = window.Ethskills;
  const article = document.getElementById('guide-content');
  const chapterLinks = document.getElementById('guide-chapters');
  const search = document.getElementById('guide-search');
  const results = document.getElementById('guide-search-results');
  const sidebar = document.getElementById('guide-sidebar');
  const toggle = document.querySelector('.chapters-toggle');
  const query = new URL(location.href).searchParams;
  const chapterId = query.get('chapter') || 'start';
  const textCache = new Map();
  let pages = [];

  toggle.addEventListener('click', () => {
    const expanded = toggle.getAttribute('aria-expanded') !== 'true';
    toggle.setAttribute('aria-expanded', String(expanded));
    sidebar.classList.toggle('is-open', expanded);
  });

  async function chapterText(page) {
    if (!textCache.has(page.id)) textCache.set(page.id, loadText(`/docs/guide/${page.file}`));
    return textCache.get(page.id);
  }

  async function searchGuide() {
    const term = search.value.trim().toLowerCase();
    results.hidden = !term;
    document.getElementById('guide-navigation').hidden = Boolean(term);
    results.replaceChildren();
    if (!term) return;
    const loading = document.createElement('p');
    loading.textContent = 'Searching chapters…';
    loading.className = 'meta';
    results.append(loading);
    const texts = await Promise.allSettled(pages.map(chapterText));
    if (term !== search.value.trim().toLowerCase()) return;
    results.replaceChildren();
    let found = 0;
    pages.forEach((page, index) => {
      const text = texts[index].status === 'fulfilled' ? texts[index].value : '';
      if (!`${page.title} ${page.description} ${text}`.toLowerCase().includes(term)) return;
      const link = document.createElement('a');
      link.href = `/guide/?chapter=${page.id}`;
      link.textContent = page.title;
      const detail = document.createElement('small');
      detail.textContent = page.description;
      link.append(detail);
      results.append(link);
      found++;
    });
    if (!found) {
      const empty = document.createElement('p');
      empty.className = 'meta';
      empty.textContent = texts.some(item => item.status === 'rejected') ? 'Some chapters could not be searched. Try again or browse the chapter list.' : 'No chapters match. Try another term.';
      results.append(empty);
    }
  }
  search.addEventListener('input', searchGuide);

  try {
    pages = await loadJSON('/docs/guide/navigation.json');
    const page = pages.find(item => item.id === chapterId);
    chapterLinks.replaceChildren();
    pages.forEach((item, index) => {
      const link = document.createElement('a');
      link.href = `/guide/?chapter=${item.id}`;
      const number = document.createElement('span');
      number.textContent = item.id === 'reference' ? '↳' : index === 0 ? '↳' : String(index).padStart(2, '0');
      link.append(number, document.createTextNode(item.title));
      if (item.id === chapterId) link.setAttribute('aria-current', 'page');
      chapterLinks.append(link);
    });
    if (!page) throw new Error('That chapter is not in the guide. Choose a chapter from the navigation.');
    document.title = `${page.title} | ethskills guide`;
    document.querySelector('meta[name="description"]').content = page.description;
    document.getElementById('breadcrumb-current').textContent = page.id;
    const index = pages.indexOf(page);
    document.getElementById('chapter-meta').textContent = index === 0 ? 'ETHSKILLS PILOT GUIDE' : index < 11 ? `CHAPTER ${String(index).padStart(2, '0')} / 10` : 'CAPABILITY REFERENCE';
    const markdown = await chapterText(page);
    await renderMarkdown(article, markdown, `/docs/guide/${page.file}`);
    const toc = document.getElementById('chapter-toc');
    for (const heading of article.querySelectorAll('h2,h3')) {
      const link = document.createElement('a');
      link.href = `#${heading.id}`;
      link.textContent = heading.textContent;
      if (heading.tagName === 'H3') link.className = 'subheading';
      toc.append(link);
    }
    const pagination = document.getElementById('chapter-pagination');
    for (const [target, label, className] of [[pages[index - 1], '← Previous', 'previous'], [pages[index + 1], 'Next →', 'next']]) {
      if (!target) continue;
      const link = document.createElement('a');
      link.href = `/guide/?chapter=${target.id}`;
      link.className = className;
      const direction = document.createElement('span');
      direction.textContent = label;
      link.append(direction, document.createTextNode(target.title));
      pagination.append(link);
    }
    document.getElementById('chapter-github').href = `https://github.com/austintgriffith/ethskills/blob/master/docs/guide/${page.file}`;
    document.getElementById('chapter-markdown').href = `/docs/guide/${page.file}`;
    document.getElementById('chapter-source').hidden = false;
    if (location.hash) document.getElementById(decodeURIComponent(location.hash.slice(1)))?.scrollIntoView();
  } catch (error) {
    errorPanel(article, error.message, '/docs/guide/README.md');
  } finally {
    article.setAttribute('aria-busy', 'false');
  }
})();
