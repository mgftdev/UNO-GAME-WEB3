export type Color = 'RED' | 'YELLOW' | 'GREEN' | 'BLUE'

export const colors: readonly Color[] = ['RED', 'YELLOW', 'GREEN', 'BLUE']

export function isColor(value: unknown): value is Color {
    return typeof value === 'string' && (colors as readonly string[]).includes(value) /* acts as a doorman if to the colors */
  }