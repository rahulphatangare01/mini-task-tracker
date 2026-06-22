import type { ReactNode } from 'react'

type ModalProps = {
  children: ReactNode
  open: boolean
  title: string
  description?: string
  onClose: () => void
  disableClose?: boolean
}

export function Modal({
  children,
  open,
  title,
  description,
  onClose,
  disableClose = false,
}: ModalProps) {
  if (!open) {
    return null
  }

  return (
    <div
      className="modal-backdrop"
      role="presentation"
      onClick={disableClose ? undefined : onClose}
    >
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="modal__header">
          <div>
            <h2 id="modal-title" className="modal__title">
              {title}
            </h2>
            {description ? (
              <p className="modal__description">{description}</p>
            ) : null}
          </div>
          <button
            className="modal__close"
            type="button"
            disabled={disableClose}
            onClick={onClose}
          >
            Close
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}
