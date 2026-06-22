import '@testing-library/jest-dom/vitest'

if (!document.elementFromPoint) {
  document.elementFromPoint = () => null
}
