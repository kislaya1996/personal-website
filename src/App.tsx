import { useEffect, useState, type ReactNode } from 'react'
import {
  profile,
  siteSections,
  type ContentItem,
  type SiteLink,
  type SiteSection,
} from './data/sections'
import { renderMarkdown } from './lib/markdown'

const defaultPreviewLimit = 3

function App() {
  const [sectionId, entrySlug] = usePathRoute()
  const activeSection = siteSections.find((section) => section.id === sectionId)
  const activeEntry = activeSection?.entries?.find((entry) => entry.slug === entrySlug)

  useEffect(() => {
    const pageTitle = activeEntry?.title ?? activeSection?.heading

    document.title = pageTitle ? `${pageTitle} | ${profile.name}` : `${profile.name} | Personal site`
    window.scrollTo({ top: 0 })
  }, [activeEntry?.title, activeSection?.heading])

  let page = <HomePage />

  if (sectionId && !activeSection) {
    page = <NotFoundPage />
  } else if (activeSection && entrySlug && !activeEntry) {
    page = <NotFoundPage section={activeSection} />
  } else if (activeSection && activeEntry) {
    page = <EntryPage entry={activeEntry} section={activeSection} />
  } else if (activeSection) {
    page = <SectionPage section={activeSection} />
  }

  return (
    <main className="site-shell">
      <SiteTopbar />
      {page}
      <footer className="site-footer">
        <span>Built with React and static content.</span>
        <a href="/">Home</a>
      </footer>
    </main>
  )
}

function usePathRoute() {
  const [segments, setSegments] = useState(getRouteSegments)

  useEffect(() => {
    const syncRoute = () => setSegments(getRouteSegments())

    window.addEventListener('popstate', syncRoute)
    return () => window.removeEventListener('popstate', syncRoute)
  }, [])

  return segments
}

function getRouteSegments() {
  return window.location.pathname
    .replace(/^\/+/, '')
    .split('/')
    .filter(Boolean)
}

function sectionPath(sectionId: string) {
  return `/${sectionId}`
}

function entryPath(sectionId: string, entrySlug: string) {
  return `/${sectionId}/${entrySlug}`
}

function SiteTopbar() {
  return (
    <header className="site-topbar">
      <a className="brand-link" href="/">
        {profile.name}
      </a>

      <nav aria-label="Primary navigation" className="site-nav">
        <a href="/">Home</a>
        {siteSections.map((section) => (
          <a href={sectionPath(section.id)} key={section.id}>
            {section.navLabel}
          </a>
        ))}
      </nav>
    </header>
  )
}

function HomePage() {
  return (
    <>
      <header className="home-hero">
        <p className="kicker">Personal site</p>
        <div className="intro-grid">
          <div>
            <h1>{profile.name}</h1>
            <p className="headline">{profile.headline}</p>
          </div>
          <p className="intro-copy">{profile.intro}</p>
        </div>
      </header>

      <div className="section-stack">
        {siteSections.map((section) => (
          <SectionPreview key={section.id} section={section} />
        ))}
      </div>
    </>
  )
}

function SectionPreview({ section }: { section: SiteSection }) {
  const previewLimit = section.previewLimit ?? defaultPreviewLimit
  const previewEntries = section.entries?.slice(0, previewLimit)
  const hasMore = Boolean(section.entries && section.entries.length > previewLimit)

  return (
    <ContentSection
      actions={
        section.entries ? (
          <a className="button-link" href={sectionPath(section.id)}>
            {hasMore ? `Read more ${section.navLabel.toLowerCase()}` : `View ${section.navLabel.toLowerCase()}`}
          </a>
        ) : undefined
      }
      entries={previewEntries}
      section={section}
    />
  )
}

function SectionPage({ section }: { section: SiteSection }) {
  return (
    <div className="page-view">
      <a className="breadcrumb" href="/">
        Home
      </a>
      <ContentSection entries={section.entries} section={section} variant="full" />
    </div>
  )
}

function ContentSection({
  actions,
  entries,
  section,
  variant = 'preview',
}: {
  actions?: ReactNode
  entries?: ContentItem[]
  section: SiteSection
  variant?: 'preview' | 'full'
}) {
  const hasEntries = section.entries && section.entries.length > 0
  const hasLinks = section.links && section.links.length > 0

  return (
    <section className={`content-section ${variant === 'full' ? 'content-section-full' : ''}`}>
      <header className="section-header">
        <p className="section-number">{section.navLabel}</p>
        <div>
          <h2>{section.heading}</h2>
          <p>{section.intro}</p>
        </div>
      </header>

      {hasEntries ? (
        <div className="entry-list">
          {entries?.map((entry) => (
            <EntryCard entry={entry} key={entry.slug} sectionId={section.id} />
          ))}
        </div>
      ) : null}

      {hasLinks ? (
        <div className="link-list" aria-label={`${section.navLabel} links`}>
          {section.links?.map((link) => (
            <TextLink key={link.href} link={link} />
          ))}
        </div>
      ) : null}

      {!hasEntries && !hasLinks ? (
        <p className="empty-section">Add entries or links for this section in src/data/sections.ts.</p>
      ) : null}

      {actions ? <div className="section-actions">{actions}</div> : null}
    </section>
  )
}

function EntryCard({ entry, sectionId }: { entry: ContentItem; sectionId: string }) {
  return (
    <article className="entry-card">
      <div className="entry-meta" aria-label="Entry metadata">
        {entry.eyebrow ? <span>{entry.eyebrow}</span> : null}
        {entry.date ? <span>{entry.date}</span> : null}
        {entry.status ? <span>{entry.status}</span> : null}
      </div>

      <div className="entry-body">
        <h3>
          <a href={entryPath(sectionId, entry.slug)}>{entry.title}</a>
        </h3>
        <p>{entry.summary}</p>
      </div>

      {entry.tags && entry.tags.length > 0 ? (
        <ul className="tag-list" aria-label={`${entry.title} tags`}>
          {entry.tags.map((tag) => (
            <li key={tag}>{tag}</li>
          ))}
        </ul>
      ) : null}

      <div className="entry-links">
        <a href={entryPath(sectionId, entry.slug)}>Read write-up</a>
      </div>
    </article>
  )
}

function EntryPage({ entry, section }: { entry: ContentItem; section: SiteSection }) {
  return (
    <article className="article-page">
      <div className="article-kicker">
        <a className="breadcrumb" href={sectionPath(section.id)}>
          {section.navLabel}
        </a>
        <div className="entry-meta" aria-label="Entry metadata">
          {entry.eyebrow ? <span>{entry.eyebrow}</span> : null}
          {entry.date ? <span>{entry.date}</span> : null}
          {entry.status ? <span>{entry.status}</span> : null}
        </div>
      </div>

      <header className="article-header">
        <h1>{entry.title}</h1>
        <p>{entry.subtitle || entry.summary}</p>
      </header>

      {entry.tags && entry.tags.length > 0 ? (
        <ul className="tag-list article-tags" aria-label={`${entry.title} tags`}>
          {entry.tags.map((tag) => (
            <li key={tag}>{tag}</li>
          ))}
        </ul>
      ) : null}

      <div
        className="article-content"
        dangerouslySetInnerHTML={{ __html: renderMarkdown(entry.body) }}
      />

      {entry.links && entry.links.length > 0 ? (
        <aside className="article-links" aria-label="Related links">
          <p>Related links</p>
          <div className="link-list">
            {entry.links.map((link) => (
              <TextLink key={link.href} link={link} />
            ))}
          </div>
        </aside>
      ) : null}
    </article>
  )
}

function NotFoundPage({ section }: { section?: SiteSection }) {
  return (
    <section className="not-found">
      <p className="kicker">Not found</p>
      <h1>That page does not exist.</h1>
      <p>
        {section
          ? `Go back to ${section.navLabel.toLowerCase()} and choose another item.`
          : 'Go back home and choose a section.'}
      </p>
      <a className="button-link" href={section ? sectionPath(section.id) : '/'}>
        {section ? `Back to ${section.navLabel}` : 'Back home'}
      </a>
    </section>
  )
}

function TextLink({ link }: { link: SiteLink }) {
  const external = link.href.startsWith('http')

  return (
    <a
      href={link.href}
      rel={external ? 'noreferrer' : undefined}
      target={external ? '_blank' : undefined}
    >
      {link.label}
    </a>
  )
}

export default App
