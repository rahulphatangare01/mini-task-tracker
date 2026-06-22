import type { InputHTMLAttributes } from 'react'

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string
  error?: string
}

export function Input({ label, error, className = '', ...props }: InputProps) {
  return (
    <label className="field">
      {label ? <span className="field__label">{label}</span> : null}
      <input {...props} className={`field__control ${className}`.trim()} />
      {error ? <span className="field__error">{error}</span> : null}
    </label>
  )
}
