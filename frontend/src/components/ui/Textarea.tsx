import type { TextareaHTMLAttributes } from 'react'

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label?: string
  error?: string
}

export function Textarea({
  label,
  error,
  className = '',
  ...props
}: TextareaProps) {
  return (
    <label className="field">
      {label ? <span className="field__label">{label}</span> : null}
      <textarea
        {...props}
        className={`field__control field__control--textarea ${className}`.trim()}
      />
      {error ? <span className="field__error">{error}</span> : null}
    </label>
  )
}
