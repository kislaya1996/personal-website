export function renderMarkdown(markdown: string) {
  const lines = markdown.replace(/\r\n/g, '\n').split('\n')
  const blocks: string[] = []
  let index = 0

  while (index < lines.length) {
    const line = lines[index]

    if (!line.trim()) {
      index += 1
      continue
    }

    if (line.startsWith('```')) {
      const code: string[] = []
      index += 1

      while (index < lines.length && !lines[index].startsWith('```')) {
        code.push(lines[index])
        index += 1
      }

      blocks.push(`<pre><code>${escapeHtml(code.join('\n'))}</code></pre>`)
      index += 1
      continue
    }

    const heading = line.match(/^(#{2,6})\s+(.+)$/)

    if (heading) {
      const level = heading[1].length
      blocks.push(`<h${level}>${renderInline(heading[2])}</h${level}>`)
      index += 1
      continue
    }

    if (line.startsWith('>')) {
      const quote: string[] = []

      while (index < lines.length && lines[index].startsWith('>')) {
        quote.push(lines[index].replace(/^>\s?/, ''))
        index += 1
      }

      blocks.push(`<blockquote>${renderParagraph(quote.join(' '))}</blockquote>`)
      continue
    }

    if (/^[-*]\s+/.test(line)) {
      const items: string[] = []

      while (index < lines.length && /^[-*]\s+/.test(lines[index])) {
        items.push(`<li>${renderInline(lines[index].replace(/^[-*]\s+/, ''))}</li>`)
        index += 1
      }

      blocks.push(`<ul>${items.join('')}</ul>`)
      continue
    }

    if (/^\d+\.\s+/.test(line)) {
      const items: string[] = []

      while (index < lines.length && /^\d+\.\s+/.test(lines[index])) {
        items.push(`<li>${renderInline(lines[index].replace(/^\d+\.\s+/, ''))}</li>`)
        index += 1
      }

      blocks.push(`<ol>${items.join('')}</ol>`)
      continue
    }

    const paragraph: string[] = []

    while (index < lines.length && lines[index].trim() && !isBlockStart(lines[index])) {
      paragraph.push(lines[index])
      index += 1
    }

    blocks.push(renderParagraph(paragraph.join(' ')))
  }

  return blocks.join('')
}

function isBlockStart(line: string) {
  return (
    line.startsWith('```') ||
    /^#{2,6}\s+/.test(line) ||
    line.startsWith('>') ||
    /^[-*]\s+/.test(line) ||
    /^\d+\.\s+/.test(line)
  )
}

function renderParagraph(text: string) {
  return `<p>${renderInline(text)}</p>`
}

function renderInline(text: string) {
  return escapeHtml(text)
    .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (_match, alt: string, src: string) => {
      return `<img alt="${escapeAttribute(alt)}" src="${escapeAttribute(src)}">`
    })
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_match, label: string, href: string) => {
      return `<a href="${escapeAttribute(href)}">${label}</a>`
    })
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/\*([^*]+)\*/g, '<em>$1</em>')
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

function escapeAttribute(value: string) {
  return value.replace(/"/g, '&quot;')
}
