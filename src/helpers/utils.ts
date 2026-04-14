export function isPresent(value: unknown): boolean {
  return value !== undefined && value !== null && value !== '';
}

export function isTruthy(value: unknown): boolean {
  return value === true || value === 'true';
}
