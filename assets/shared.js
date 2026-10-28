(() => {
  'use strict';
  const jsonCache = new Map();
  let toastTimer;

  async function loadJSON(path) {
    if (!jsonCache.has(path)) {
      jsonCache.set(path, fetch(path).then(response => {
        if (!response.ok) throw new Error(`Could not load ${path} (${response.status}).`);
        return response.json();
      }));
    }
    return jsonCache.get(path);
  }

  async function loadText(path) {
    const response = await fetch(path);
    if (!response.ok) throw new Error(`Could not load this page (${response.status}).`);
    return response.text();
  }

  function notify(message) {
    const toast = document.getElementById('toast');
    if (!toast) return;
    clearTimeout(toastTimer);
    toast.textContent = message;
    toastTimer = setTimeout(() => { toast.textContent = ''; }, 3200);
  }

  async function copyText(text) {
    const focused = document.activeElement;
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        const field = document.createElement('textarea');
        field.value = text;
        field.readOnly = true;
        field.style.position = 'fixed';
        field.style.opacity = '0';
        document.body.append(field);
        field.select();
        const copied = document.execCommand('copy');
        field.remove();
        focused?.focus();
        if (!copied) throw new Error('Clipboard unavailable.');
      }
      notify('Copied to clipboard.');
      return true;
    } catch {
      notify('Could not copy. Select and copy the text directly.');
      return false;
    }
  }

  function addCodeCopyButtons(container) {
    for (const pre of container.querySelectorAll('pre')) {
      const code = pre.querySelector('code');
      if (!code) continue;
      const button = document.createElement('button');
      button.className = 'code-copy';
      button.type = 'button';
      button.textContent = 'Copy';
      button.setAttribute('aria-label', 'Copy code block');
      button.addEventListener('click', async () => {
        if (await copyText(code.textContent)) {
          button.textContent = 'Copied';
          setTimeout(() => { button.textContent = 'Copy'; }, 1800);
        }
      });
      pre.append(button);
    }
  }

  async function renderMarkdown(container, source, sourcePath) {
    if (!window.marked || !window.DOMPurify) throw new Error('The Markdown reader could not load. Use the Markdown source link.');
    const [pages, skills] = await Promise.all([loadJSON('/docs/guide/navigation.json'), loadJSON('/assets/catalog.json')]);
    const markdown = source.replace(/^---\r?\n[\s\S]*?\r?\n---(?:\r?\n|$)/, '');
    container.innerHTML = DOMPurify.sanitize(marked.parse(markdown, { gfm: true }), { USE_PROFILES: { html: true } });
    const base = new URL(sourcePath, location.origin);
    for (const link of container.querySelectorAll('a[href]')) {
      const raw = link.getAttribute('href');
      if (!raw || raw.startsWith('#')) continue;
      const url = new URL(raw, base);
      if (url.origin === location.origin) {
        const guidePage = pages.find(page => `/docs/guide/${page.file}` === url.pathname);
        const skill = skills.find(item => `/${item.id}/SKILL.md` === url.pathname);
        if (guidePage) link.href = `/guide/?chapter=${guidePage.id}${url.hash}`;
        else if (skill) link.href = `/?skill=${skill.id}`;
        else link.href = url.href;
      } else {
        link.href = url.href;
        if (url.protocol === 'http:' || url.protocol === 'https:') {
          link.target = '_blank';
          link.rel = 'noopener noreferrer';
        }
      }
    }
    for (const image of container.querySelectorAll('img[src]')) image.src = new URL(image.getAttribute('src'), base).href;
    const usedIds = new Set();
    for (const heading of container.querySelectorAll('h1,h2,h3,h4')) {
      const slug = heading.textContent.toLowerCase().replace(/[^\p{L}\p{N}\s_-]/gu, '').trim().replace(/\s+/g, '-');
      let id = slug || 'section';
      let suffix = 1;
      while (usedIds.has(id)) id = `${slug}-${suffix++}`;
      usedIds.add(id);
      heading.id = id;
    }
    for (const table of container.querySelectorAll('table')) {
      const wrapper = document.createElement('div');
      wrapper.className = 'table-scroll';
      table.before(wrapper);
      wrapper.append(table);
    }
    addCodeCopyButtons(container);
  }

  function errorPanel(container, message, sourcePath) {
    container.replaceChildren();
    const panel = document.createElement('div');
    panel.className = 'error-panel';
    const heading = document.createElement('h1');
    heading.textContent = 'This page could not load.';
    const detail = document.createElement('p');
    detail.textContent = message;
    const link = document.createElement('a');
    link.href = sourcePath;
    link.textContent = 'Read the Markdown source →';
    panel.append(heading, detail, link);
    container.append(panel);
  }

  const menu = document.querySelector('.menu-toggle');
  const navigation = document.getElementById('site-nav');
  menu?.addEventListener('click', () => {
    const expanded = menu.getAttribute('aria-expanded') !== 'true';
    menu.setAttribute('aria-expanded', String(expanded));
    navigation.classList.toggle('is-open', expanded);
  });
  navigation?.addEventListener('click', event => {
    if (event.target.closest('a')) {
      navigation.classList.remove('is-open');
      menu?.setAttribute('aria-expanded', 'false');
    }
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && navigation?.classList.contains('is-open')) {
      navigation.classList.remove('is-open');
      menu.setAttribute('aria-expanded', 'false');
      menu.focus();
    }
  });
  window.Ethskills = { loadJSON, loadText, copyText, renderMarkdown, errorPanel };
})();
