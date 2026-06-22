import Placeholder from '@tiptap/extension-placeholder'
import Underline from '@tiptap/extension-underline'
import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { useEffect } from 'react'
import { sanitizeRichText, stripRichText } from '../../utils/richText'

type RichTextEditorProps = {
  label?: string
  value: string
  error?: string
  placeholder?: string
  onChange: (value: string) => void
}

type ToolbarAction = {
  label: string
  isActive: () => boolean
  onClick: () => void
}

const normalizeEditorHtml = (value: string) => {
  const sanitized = sanitizeRichText(value)

  if (!stripRichText(sanitized)) {
    return ''
  }

  return sanitized
}

export function RichTextEditor({
  label,
  value,
  error,
  placeholder = 'Enter task description',
  onChange,
}: RichTextEditorProps) {
  const editor = useEditor({
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: 'rich-text__editor',
      },
    },
    extensions: [
      StarterKit.configure({
        heading: false,
        codeBlock: false,
        horizontalRule: false,
      }),
      Underline,
      Placeholder.configure({
        placeholder,
      }),
    ],
    content: normalizeEditorHtml(value),
    onUpdate: ({ editor: nextEditor }) => {
      onChange(normalizeEditorHtml(nextEditor.getHTML()))
    },
  })

  useEffect(() => {
    if (!editor) {
      return
    }

    const nextContent = normalizeEditorHtml(value)
    const currentContent = normalizeEditorHtml(editor.getHTML())

    if (nextContent !== currentContent) {
      editor.commands.setContent(nextContent, { emitUpdate: false })
    }
  }, [editor, value])

  const actions: ToolbarAction[] = editor
    ? [
        {
          label: 'B',
          isActive: () => editor.isActive('bold'),
          onClick: () => editor.chain().focus().toggleBold().run(),
        },
        {
          label: 'I',
          isActive: () => editor.isActive('italic'),
          onClick: () => editor.chain().focus().toggleItalic().run(),
        },
        {
          label: 'U',
          isActive: () => editor.isActive('underline'),
          onClick: () => editor.chain().focus().toggleUnderline().run(),
        },
        {
          label: 'Bullet',
          isActive: () => editor.isActive('bulletList'),
          onClick: () => editor.chain().focus().toggleBulletList().run(),
        },
        {
          label: 'Number',
          isActive: () => editor.isActive('orderedList'),
          onClick: () => editor.chain().focus().toggleOrderedList().run(),
        },
      ]
    : []

  return (
    <label className="field">
      {label ? <span className="field__label">{label}</span> : null}
      <div className={`rich-text ${error ? 'rich-text--error' : ''}`.trim()}>
        <div className="rich-text__toolbar" role="toolbar" aria-label="Text formatting">
          {actions.map((action) => (
            <button
              key={action.label}
              type="button"
              className={`rich-text__tool ${action.isActive() ? 'rich-text__tool--active' : ''}`.trim()}
              onMouseDown={(event) => event.preventDefault()}
              onClick={action.onClick}
            >
              {action.label}
            </button>
          ))}
        </div>
        <EditorContent editor={editor} />
      </div>
      {error ? <span className="field__error">{error}</span> : null}
    </label>
  )
}
