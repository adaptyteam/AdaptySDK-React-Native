/**
 * Generates a short unique identifier.
 * Format: 12 lowercase alphanumeric characters
 */
export function generateId(): string {
  let id = '';
  while (id.length < 12) {
    id += Math.random().toString(36).slice(2);
  }
  return id.slice(0, 12);
}


