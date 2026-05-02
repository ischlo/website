import fs from 'node:fs/promises';
import path from 'node:path';
import matter from 'gray-matter';
import MarkdownIt from 'markdown-it';

const ROOT = process.cwd();
const INDEX_PATH = path.join(ROOT, 'index.html');

const SECTIONS = [
  { key: 'research', markerStart: '<!-- PORTFOLIO_RESEARCH_START -->', markerEnd: '<!-- PORTFOLIO_RESEARCH_END -->' },
  {
    key: 'publications',
    markerStart: '<!-- PORTFOLIO_PUBLICATIONS_START -->',
    markerEnd: '<!-- PORTFOLIO_PUBLICATIONS_END -->',
  },
  { key: 'software', markerStart: '<!-- PORTFOLIO_SOFTWARE_START -->', markerEnd: '<!-- PORTFOLIO_SOFTWARE_END -->' },
  {
    key: 'courseworks',
    markerStart: '<!-- PORTFOLIO_COURSEWORKS_START -->',
    markerEnd: '<!-- PORTFOLIO_COURSEWORKS_END -->',
  },
];

const CONTENT_ROOT = path.join(ROOT, 'content', 'portfolio');
const OUT_DIR = path.join(ROOT, 'includes');

function spliceBetweenMarkers(full, startMarker, endMarker, replacement) {
  const startIdx = full.indexOf(startMarker);
  const endIdx = full.indexOf(endMarker);
  if (startIdx === -1 || endIdx === -1 || endIdx < startIdx) {
    throw new Error(`Missing portfolio markers in index.html. Expected ${startMarker} and ${endMarker}.`);
  }
  const before = full.slice(0, startIdx + startMarker.length);
  const after = full.slice(endIdx);
  return `${before}\n${replacement}\n${after}`;
}

function escapeHtml(s) {
  return String(s)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function renderLinks(links) {
  if (!Array.isArray(links) || links.length === 0) return '';

  const parts = links.map((l) => {
    const type = String(l?.type ?? '').toLowerCase();
    const href = String(l?.href ?? '').trim();
    const label = String(l?.label ?? '').trim();
    const target = l?.target ? String(l.target) : '_blank';
    const rel = String(l?.rel ?? 'noopener noreferrer').trim();
    const cls = String(l?.class ?? '').trim();

    if (!href) return '';

    if (type === 'github') {
      return `<a href="${escapeHtml(href)}" target="${escapeHtml(target)}" rel="${escapeHtml(rel)}"><i class="bi bi-github"></i></a>`;
    }
    if (type === 'link') {
      return `<a href="${escapeHtml(href)}" target="${escapeHtml(target)}" rel="${escapeHtml(rel)}"><i class="bi bi-link-45deg"></i></a>`;
    }
    if (type === 'arxiv') {
      const text = label || 'arXiv';
      return `<a href="${escapeHtml(href)}" target="${escapeHtml(target)}" rel="${escapeHtml(rel)}" class="arxive ${escapeHtml(cls)}">${escapeHtml(text)}</a>`;
    }

    // fallback: plain link icon
    return `<a href="${escapeHtml(href)}" target="${escapeHtml(target)}" rel="${escapeHtml(rel)}"><i class="bi bi-link-45deg"></i></a>`;
  }).filter(Boolean);

  return parts.join('\n                                |\n                                ');
}

async function ensureDir(dir) {
  await fs.mkdir(dir, { recursive: true });
}

async function readSectionPosts(sectionKey) {
  const dir = path.join(CONTENT_ROOT, sectionKey);
  let entries;
  try {
    entries = await fs.readdir(dir, { withFileTypes: true });
  } catch {
    return [];
  }

  const files = entries
    .filter((e) => e.isFile() && e.name.toLowerCase().endsWith('.md'))
    .map((e) => e.name)
    .sort((a, b) => a.localeCompare(b)); // stable ordering by filename

  const md = new MarkdownIt({ html: true, linkify: true, breaks: false });

  const posts = [];
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const raw = await fs.readFile(fullPath, 'utf8');
    const parsed = matter(raw);
    const front = parsed.data ?? {};
    const bodyMd = parsed.content ?? '';

    const title = typeof front.title === 'string' ? front.title.trim() : '';
    if (!title) {
      throw new Error(`Missing required front matter "title" in ${path.relative(ROOT, fullPath)}`);
    }

    const orderRaw = front.order;
    const order = typeof orderRaw === 'number' ? orderRaw : Number.isFinite(Number(orderRaw)) ? Number(orderRaw) : 0;

    const bodyHtml = md.render(bodyMd).trim();
    const linksHtml = renderLinks(front.links);

    posts.push({ file, title, order, bodyHtml, linksHtml });
  }

  posts.sort((a, b) => (a.order - b.order) || a.file.localeCompare(b.file));
  return posts;
}

function renderPost(p) {
  // Match existing structure in index.html so appearance stays the same.
  const bodyBlock = p.bodyHtml
    ? `\n                            ${p.bodyHtml.replaceAll('\n', '\n                            ')}\n                        `
    : '\n                            <p></p>\n                        ';
  const linksBlock = p.linksHtml
    ? `\n                                ${p.linksHtml}\n                            `
    : '';

  return `<div class="portfolio_post">
                            <h6>${escapeHtml(p.title)}</h6>
                            ${bodyBlock}
                            <div class="post_image">

                            </div>
                            <div class="portfolio_links">${linksBlock}
                            </div>
                        </div>`;
}

async function buildSection(sectionKey) {
  const posts = await readSectionPosts(sectionKey);
  return posts.map(renderPost).join('\n                        ');
}

async function main() {
  let indexHtml = await fs.readFile(INDEX_PATH, 'utf8');

  for (const s of SECTIONS) {
    const fragment = await buildSection(s.key);
    const outPath = path.join(OUT_DIR, `portfolio-${s.key}.html`);
    await ensureDir(path.dirname(outPath));
    await fs.writeFile(outPath, fragment + '\n', 'utf8');

    indexHtml = spliceBetweenMarkers(indexHtml, s.markerStart, s.markerEnd, fragment);
  }

  await fs.writeFile(INDEX_PATH, indexHtml, 'utf8');
  console.log(`Built portfolio sections: ${SECTIONS.map((s) => s.key).join(', ')}. Updated index.html.`);
}

main().catch((err) => {
  console.error(err?.stack || String(err));
  process.exit(1);
});

