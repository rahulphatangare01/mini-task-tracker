import { useEffect, useRef, useState } from 'react'

type DropdownOption<T extends string> = {
  label: string
  value: T
}

type DropdownProps<T extends string> = {
  label?: string
  value: T
  options: DropdownOption<T>[]
  error?: string
  onChange: (value: T) => void
}

export function Dropdown<T extends string>({
  label,
  value,
  options,
  error,
  onChange,
}: DropdownProps<T>) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false)
      }
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleEscape)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [])

  const activeOption = options.find((option) => option.value === value)

  return (
    <div className="field" ref={rootRef}>
      {label ? <span className="field__label">{label}</span> : null}
      <div className="dropdown">
        <button
          type="button"
          className={`field__control dropdown__trigger ${open ? 'dropdown__trigger--open' : ''}`}
          onClick={() => setOpen((current) => !current)}
        >
          <span>{activeOption?.label ?? 'Select'}</span>
          <span className="dropdown__caret" aria-hidden="true">
            v
          </span>
        </button>
        {open ? (
          <div className="dropdown__menu" role="listbox">
            {options.map((option) => (
              <button
                key={option.value}
                type="button"
                className={`dropdown__option ${option.value === value ? 'dropdown__option--active' : ''}`}
                onClick={() => {
                  onChange(option.value)
                  setOpen(false)
                }}
              >
                <span>{option.label}</span>
                {option.value === value ? (
                  <span className="dropdown__option-indicator" aria-hidden="true">
                    Selected
                  </span>
                ) : null}
              </button>
            ))}
          </div>
        ) : null}
      </div>
      {error ? <span className="field__error">{error}</span> : null}
    </div>
  )
}
