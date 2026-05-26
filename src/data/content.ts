import type { ContentItem, SiteLink } from './types'

type Frontmatter = Record<string, string>

const markdownFiles = import.meta.glob('../content/**/*.md', {
  eager: true,
  import: 'default',
  query: '?raw',
}) as Record<string, string>

export function getEntriesForSection(sectionId: string) {
  return Object.entries(markdownFiles)
    .filter(([path]) => path.includes(`/content/${sectionId}/`))
    .filter(([path]) => !path.split('/').at(-1)?.startsWith('_'))
    .map(([path, raw]) => parseMarkdownEntry(path, raw))
    .sort((left, right) => left.order - right.order || left.title.localeCompare(right.title))
}

function parseMarkdownEntry(path: string, raw: string): ContentItem & { order: number } {
  const { body, frontmatter } = parseFrontmatter(raw)
  const slug = slugFromPath(path)
  const title = frontmatter.title || titleFromSlug(slug)
  const subtitle = frontmatter.subtitle || frontmatter.summary || ''

  return {
    slug,
    title,
    subtitle,
    summary: frontmatter.summary || subtitle,
    body: body.trim(),
    eyebrow: frontmatter.eyebrow,
    date: frontmatter.date,
    status: frontmatter.status,
    tags: parseList(frontmatter.tags),
    links: parseLinks(frontmatter.links),
    order: Number(frontmatter.order || Number.MAX_SAFE_INTEGER),
  }
}

function parseFrontmatter(raw: string) {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/)

  if (!match) {
    return {
      body: raw,
      frontmatter: {} as Frontmatter,
    }
  }

  const frontmatter = match[1].split(/\r?\n/).reduce<Frontmatter>((metadata, line) => {
    const field = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/)

    if (field) {
      metadata[field[1]] = stripQuotes(field[2])
    }

    return metadata
  }, {})

  return {
    body: raw.slice(match[0].length),
    frontmatter,
  }
}

function parseList(value?: string) {
  return value
    ?.split(',')
    .map((item) => item.trim())
    .filter(Boolean)
}

function parseLinks(value?: string): SiteLink[] | undefined {
  const links = value
    ?.split(',')
    .map((item) => item.trim())
    .filter(Boolean)
    .map((item) => {
      const [label, href] = item.split('|').map((part) => part.trim())

      return label && href ? { label, href } : undefined
    })
    .filter((link): link is SiteLink => Boolean(link))

  return links && links.length > 0 ? links : undefined
}

function slugFromPath(path: string) {
  const filename = path.split('/').at(-1) ?? ''

  return filename.replace(/\.md$/, '').replace(/^\d+-/, '')
}

function titleFromSlug(slug: string) {
  return slug
    .split('-')
    .filter(Boolean)
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(' ')
}

function stripQuotes(value: string) {
  return value.trim().replace(/^['"]|['"]$/g, '')
}
