import { getEntriesForSection } from './content'
import type { SiteLink, SiteSection } from './types'

export type { ContentItem, SiteLink, SiteSection } from './types'

export const profile = {
  name: 'Kislaya',
  headline: 'Software engineer, builder, and careful generalist.',
  intro:
    'I like small tools, clear interfaces, dependable systems, and writing that makes software work easier to reason about.',
  links: [
    { label: 'Email', href: 'mailto:hello@example.com' },
    { label: 'GitHub', href: 'https://github.com/' },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/' },
  ],
} satisfies {
  name: string
  headline: string
  intro: string
  links: SiteLink[]
}

// Section metadata stays here. Add actual pages as Markdown files in src/content/<section-id>/.
export const siteSections: SiteSection[] = [
  {
    id: 'blog',
    navLabel: 'Blog',
    heading: 'Writing',
    intro:
      'Essays, field notes, and working drafts about engineering craft, product judgment, and building useful software.',
    entries: getEntriesForSection('blog'),
  },
  {
    id: 'projects',
    navLabel: 'Projects',
    heading: 'Projects',
    intro:
      'Selected products, prototypes, tools, and experiments. Keep the list short and bias toward work with a clear story.',
    entries: getEntriesForSection('projects'),
  },
  {
    id: 'reading',
    navLabel: 'Reading',
    heading: 'Reading list',
    intro:
      'Books, papers, articles, and talks worth revisiting. Use status labels to track what is next, active, or finished.',
    entries: getEntriesForSection('reading'),
  },
  {
    id: 'notes',
    navLabel: 'Notes',
    heading: 'Notes and interests',
    intro:
      'A loose place for interests that do not need a full essay yet: cities, design, games, music, football, and systems in daily life.',
    entries: getEntriesForSection('notes'),
  },
  {
    id: 'contact',
    navLabel: 'Contact',
    heading: 'Contact',
    intro:
      'Reach out for collaboration, engineering conversations, or a pointer to something worth reading.',
    links: profile.links,
  },
]
