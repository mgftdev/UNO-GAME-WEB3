export type Type = 'NUMBERED' | 'SKIP' | 'REVERSE' | 'DRAW' | 'WILD' | 'WILD DRAW'

export const types: readonly Type[] = ['NUMBERED', 'SKIP', 'REVERSE', 'DRAW', 'WILD', 'WILD DRAW']

export function isType(value: unknown): value is Type {
  return typeof value === 'string' && (types as readonly string[]).includes(value)
}