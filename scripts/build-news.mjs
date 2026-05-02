import fs from 'node:fs/promises';
import path from 'node:path';
import matter from 'gray-matter';
import MarkdownIt from 'markdown-it';

const ROOT = process.cwd();
const CONTENT_DIR = path.join(ROOT, 'content', 'news');
const TEMPLATE_PATH = path.join(ROOT, 'templates', 'news-post.html');
const OUT_FRAGMENT_PATH = path.join(ROOT, 'includes', 'news-section.html');
const INDEX_PATH = path.join(ROOT, 'index.html');

const NEWS_START = '<!-- NEWS_SECTION_START -->';
const NEWS_END = '<!-- NEWS_SECTION_END -->';

function formatDisplayDate(isoDate) {
  // Expect YYYY-MM-DD; output DD/MM/YYYY
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(isoDate);
  if (!m) return isoDate;
  const [, yyyy, mm, dd] = m;
  return `${dd}/${mm}/${yyyy}`;
}

function compareDescDate(a, b) {
  // ISO dates compare lexicographically
  return (b.date || '').localeCompare(a.date || '');
}

function renderTemplate(tpl, data) {
  return tpl.replaceAll('{{date}}', data.date ?? '')
    .replaceAll('{{title_block}}', data.title_block ?? '')
    .replaceAll('{{body}}', data.body ?? '');
}

async function ensureDir(dir) {
  await fs.mkdir(dir, { recursive: true });
}

async function readMarkdownPosts() {
  let entries;
  try {
    entries = await fs.readdir(CONTENT_DIR, { withFileTypes: true });
  } catch {
    return [];
  }
  const mdFiles = entries
    .filter((e) => e.isFile() && e.name.toLowerCase().endsWith('.md'))
    .map((e) => e.name);

  const md = new MarkdownIt({ html: true, linkify: true, breaks: false });

  const posts = [];
  for (const file of mdFiles) {
    const fullPath = path.join(CONTENT_DIR, file);
    const raw = await fs.readFile(fullPath, 'utf8');
    const parsed = matter(raw);
    const front = parsed.data ?? {};
    const bodyMd = parsed.content ?? '';

    const dateRaw = front.date;
    const date =
      dateRaw instanceof Date
        ? dateRaw.toISOString().slice(0, 10)
        : String(dateRaw ?? '').trim();
    if (!date) {
      throw new Error(`Missing required front matter "date" in ${path.relative(ROOT, fullPath)}`);
    }

    const title = typeof front.title === 'string' ? front.title.trim() : '';
    const bodyHtml = md.render(bodyMd).trim();

    posts.push({
      file,
      date,
      date_display: formatDisplayDate(date),
      title,
      body_html: bodyHtml,
    });
  }

  posts.sort(compareDescDate);
  return posts;
}

async function buildFragment(posts) {
  const tpl = await fs.readFile(TEMPLATE_PATH, 'utf8');

  const renderedPosts = posts.map((p) => {
    const titleBlock = p.title ? `<h4 class="news_title">${p.title}</h4>` : '';
    return renderTemplate(tpl, {
      date: p.date_display,
      title_block: titleBlock,
      body: p.body_html,
    });
  });

  // Match existing page structure: post + <div class="hl"></div> separators
  return renderedPosts
    .map((html, idx) => {
      const sep = idx === renderedPosts.length - 1 ? '' : '\n\n<div class="hl"></div>\n';
      return `${html}${sep}`;
    })
    .join('\n');
}

function spliceBetweenMarkers(full, replacement) {
  const startIdx = full.indexOf(NEWS_START);
  const endIdx = full.indexOf(NEWS_END);
  if (startIdx === -1 || endIdx === -1 || endIdx < startIdx) {
    throw new Error(`Missing news markers in index.html. Expected ${NEWS_START} and ${NEWS_END}.`);
  }
  const before = full.slice(0, startIdx + NEWS_START.length);
  const after = full.slice(endIdx);
  return `${before}\n${replacement}\n${after}`;
}

async function main() {
  const posts = await readMarkdownPosts();
  const fragment = await buildFragment(posts);

  await ensureDir(path.dirname(OUT_FRAGMENT_PATH));
  await fs.writeFile(OUT_FRAGMENT_PATH, fragment + '\n', 'utf8');

  const indexHtml = await fs.readFile(INDEX_PATH, 'utf8');
  const nextIndex = spliceBetweenMarkers(indexHtml, fragment);
  await fs.writeFile(INDEX_PATH, nextIndex, 'utf8');

  // Basic signal for CI/logs
  console.log(`Built ${posts.length} post(s). Updated includes/news-section.html and index.html.`);
}

main().catch((err) => {
  console.error(err?.stack || String(err));
  process.exit(1);
});

