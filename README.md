# Personal Website

A minimal static personal site built with React, TypeScript, Vite, and Markdown content.

The site uses hash routes so it works on GitHub Pages without server rewrites:

- `#/` is the homepage.
- `#/blog`, `#/projects`, `#/reading`, and other section IDs are full section pages.
- `#/blog/post-slug` and similar routes are individual write-up pages.

## Add Content

Each section has its own folder:

- Blog posts: `src/content/blog/`
- Projects: `src/content/projects/`
- Reading list items: `src/content/reading/`
- Notes: `src/content/notes/`

To add a page:

1. Copy the `_template.md` file in the relevant folder.
2. Rename it to a URL-friendly filename, for example `my-new-post.md`.
3. Fill in the frontmatter and write the body in Markdown.

The filename becomes the route slug. For example:

```txt
src/content/blog/my-new-post.md
```

becomes:

```txt
#/blog/my-new-post
```

Numeric filename prefixes are ignored in routes, so `01-my-new-post.md` also becomes `#/blog/my-new-post`. Use `order` in frontmatter to control list order.

Files starting with `_` are ignored, so templates do not render on the site.

## Markdown Template

Each Markdown file supports a heading, sub-heading, summary, metadata, and a rich text body:

```md
---
order: 1
title: Page heading
subtitle: Page sub-heading shown on the write-up page.
summary: Short text shown on the homepage and section list.
eyebrow: Essay
date: 2026-01-01
status: Draft
tags: Engineering, Design
links: Source|https://example.com
---

Write the text section in Markdown.

Use **bold**, *italic*, [links](https://example.com), lists, quotes, code blocks, and images.

![Descriptive alt text](images/example.jpg)

## A body heading

- First point
- Second point

> A pull quote or highlighted idea.
```

Images should go in `public/images/` and be referenced as `images/file-name.jpg`.

## Configure Sections

Section metadata lives in `src/data/sections.ts`.

Use it to change:

- Profile text and social links.
- Section names and intro text.
- Section order.
- Homepage preview limits via `previewLimit`.

Actual entries are loaded automatically from Markdown files in `src/content/`.

## Local Development

```sh
pnpm install
pnpm dev
```

Build the static site:

```sh
pnpm build
```

## Deploy on GitHub Pages

This repo includes `.github/workflows/deploy.yml`. To use it:

1. Push the project to GitHub.
2. In the repository settings, open `Pages`.
3. Set the source to `GitHub Actions`.
4. Push to `main` or run the workflow manually.

Vite is configured with `base: './'`, so the built assets work from a user site, project site, or custom domain.
