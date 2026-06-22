import { useEffect, useMemo, useRef, useState } from 'react'
import { DayPicker } from 'react-day-picker'
import 'react-day-picker/dist/style.css'

type DatePickerProps = {
  label?: string
  value: string | null
  error?: string
  onChange: (value: string | null) => void
}

const toDate = (value: string | null) => {
  return value ? new Date(value) : undefined
}

const getToday = () => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  return today
}

const formatDisplayValue = (value: string | null) => {
  if (!value) {
    return 'Select due date'
  }

  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(value))
}

export function DatePicker({
  label,
  value,
  error,
  onChange,
}: DatePickerProps) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement | null>(null)
  const today = useMemo(() => getToday(), [])

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

  const selectedDate = useMemo(() => toDate(value), [value])

  return (
    <div className="field field--calendar" ref={rootRef}>
      {label ? <span className="field__label">{label}</span> : null}
      <div className="dropdown">
        <button
          type="button"
          className={`field__control dropdown__trigger ${open ? 'dropdown__trigger--open' : ''}`}
          onClick={() => setOpen((current) => !current)}
        >
          <span>{formatDisplayValue(value)}</span>
          <span className="dropdown__caret" aria-hidden="true">
            v
          </span>
        </button>
        {open ? (
          <div className="calendar-popover calendar-popover--above">
            <DayPicker
              mode="single"
              selected={selectedDate}
              disabled={{ before: today }}
              onSelect={(date) => {
                onChange(date ? date.toISOString().slice(0, 10) : null)
                setOpen(false)
              }}
              showOutsideDays
            />
            <div className="calendar-popover__footer">
              <button
                type="button"
                className="calendar-popover__action"
                onClick={() => onChange(null)}
              >
                Clear
              </button>
              <button
                type="button"
                className="calendar-popover__action"
                onClick={() => {
                  onChange(new Date().toISOString().slice(0, 10))
                  setOpen(false)
                }}
              >
                Today
              </button>
            </div>
          </div>
        ) : null}
      </div>
      {error ? <span className="field__error">{error}</span> : null}
    </div>
  )
}
