export const getCurrentIsoDate = (): string => {
  return new Date().toISOString()
}

export const normalizeDueDate = (dueDate: string | null): string | null => {
  if (!dueDate) {
    return null
  }

  return new Date(dueDate).toISOString()
}
