## Build: News (Markdown → HTML)

News posts live in `content/news/*.md` (one file per post) with YAML front matter:

- `date`: `YYYY-MM-DD` (required)
- `title`: optional

To regenerate the News section in `index.html`:

```bash
npm install
npm run build:news
```

This writes `includes/news-section.html` and splices the generated HTML into `index.html` between the `NEWS_SECTION_*`
markers.

## Build: Portfolio (Markdown → HTML)

Portfolio entries live in `content/portfolio/<section>/*.md` where `<section>` is one of:
`research`, `publications`, `software`, `courseworks`.

Each file uses YAML front matter:

- `title`: required
- `order`: optional number (controls ordering within the section)
- `links`: optional list (types: `github`, `link`, `arxiv`)

To regenerate the Portfolio section in `index.html`:

```bash
npm run build:portfolio
```

Or rebuild everything:

```bash
npm run build
```

