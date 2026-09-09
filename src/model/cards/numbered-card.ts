import { Color } from './color'

export type CardNumber = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9

export const cardNumbers: readonly CardNumber[] = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]

export interface NumberedCard {
  readonly type: 'NUMBERED'
  readonly color: Color
  readonly number: CardNumber
}

export function numberedCard(color: Color, number: CardNumber): NumberedCard {
  return { type: 'NUMBERED', color, number }
}

export function isCardNumber(value: unknown): value is CardNumber {
  return typeof value === 'number' && Number.isInteger(value) && value >= 0 && value <= 9
}