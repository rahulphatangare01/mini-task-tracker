import { sanitizeRichText, stripRichText, truncateText } from './richText'

describe('richText utilities', () => {
  it('removes unsafe markup while preserving supported formatting', () => {
    const result = sanitizeRichText(
      '<p>Hello <strong>team</strong></p><script>alert(1)</script>',
    )

    expect(result).toContain('<p>Hello <strong>team</strong></p>')
    expect(result).not.toContain('<script>')
  })

  it('converts plain text into paragraph markup', () => {
    expect(sanitizeRichText('Line one\nLine two')).toBe(
      '<p>Line one<br />Line two</p>',
    )
  })

  it('strips markup and truncates table previews', () => {
    expect(stripRichText('<p>Hello <em>world</em></p>')).toBe('Hello world')
    expect(truncateText('<p>abcdefghijklmnopqrstuvwxyz</p>', 10)).toBe(
      'abcdefghij...',
    )
  })
})
