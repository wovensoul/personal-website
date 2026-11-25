// Small building blocks that turn SITE (content.js) into markup. See README.md.

// h('a', { href }, 'text', child, ...): makes an element; null/false attributes and children are skipped.
function h(tag, attrs = {}, ...children) {
  const el = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) if (v != null && v !== false) el.setAttribute(k, v);
  el.append(...children.flat().filter(c => c != null && c !== false));
  return el;
}

const ExternalLink = (text, href, attrs = {}) => h('a', { href, target: '_blank', rel: 'noopener', ...attrs }, text);

// "swe @ garner health ........ feb 2026 – present"
function ExperienceRow({ role, org, href, when }) {
  return h('div', { class: 'row hoverable' },
    h('div', {}, h('b', {}, role), ' @ ', href ? ExternalLink(org, href, { class: 'org' }) : org),
    h('span', { class: 'when' }, when));
}

// Name, one-line description, tags, and links (shown in the order given, labelled by their keys).
function ProjectRow({ name, about, tags = [], links = {} }) {
  const actions = Object.entries(links).filter(([, url]) => url);
  return h('article', { class: 'row hoverable' },
    h('h3', {}, name),
    h('p', {}, about),
    tags.length ? h('div', { class: 'tags' }, tags.join(' · ')) : null,
    actions.length ? h('div', { class: 'actions' }, actions.map(([label, url]) => ExternalLink(label, url))) : null);
}

function renderList(selector, items, component) {
  document.querySelector(selector).replaceChildren(...items.map(component));
}

renderList('#experience .facet', SITE.experience, ExperienceRow);
renderList('#projects .facet', SITE.projects, ProjectRow);
