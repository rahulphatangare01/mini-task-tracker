import DOMPurify, { type Config } from 'dompurify'

const richTextTagPattern = /<\/?(p|br|strong|b|em|i|u|ul|ol|li|a|blockquote)[^>]*>/i

const sanitizeConfig: Config = {
  ALLOWED_TAGS: ['p', 'br', 'strong', 'b', 'em', 'i', 'u', 'ul', 'ol', 'li', 'a', 'blockquote'],
  ALLOWED_ATTR: ['href', 'target', 'rel'],
}

const escapeHtml = (value: string) =>
  value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')

export const stripRichText = (value: string | null | undefined) => {
  if (!value) {
    return ''
  }

  return DOMPurify.sanitize(value, {
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: [],
  })
    .replace(/\s+/g, ' ')
    .trim()
}

export const truncateText = (value: string | null | undefined, limit: number) => {
  const text = stripRichText(value)

  if (text.length <= limit) {
    return text
  }

  return `${text.slice(0, limit).trimEnd()}...`
}

export const sanitizeRichText = (value: string | null | undefined) => {
  if (!value) {
    return ''
  }

  if (richTextTagPattern.test(value)) {
    return DOMPurify.sanitize(value, sanitizeConfig).trim()
  }

  const escaped = escapeHtml(value.trim())

  if (!escaped) {
    return ''
  }

  return `<p>${escaped.replace(/\n/g, '<br />')}</p>`
}
