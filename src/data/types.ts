export type SiteLink = {
  label: string
  href: string
}

export type ContentItem = {
  slug: string
  title: string
  subtitle: string
  summary: string
  body: string
  eyebrow?: string
  date?: string
  status?: string
  tags?: string[]
  links?: SiteLink[]
}

export type SiteSection = {
  id: string
  navLabel: string
  heading: string
  intro: string
  previewLimit?: number
  entries?: ContentItem[]
  links?: SiteLink[]
}
