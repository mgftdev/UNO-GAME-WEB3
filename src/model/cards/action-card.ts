import { Color } from './color'

export type ActionType = 'SKIP' | 'REVERSE' | 'DRAW'

export const actionTypes: readonly ActionType[] = ['SKIP', 'REVERSE', 'DRAW']

export interface SkipCard {
  readonly type: 'SKIP'
  readonly color: Color
}

export interface ReverseCard {
  readonly type: 'REVERSE'
  readonly color: Color
}

export interface DrawCard {
  readonly type: 'DRAW'
  readonly color: Color
}

export type ActionCard = SkipCard | ReverseCard | DrawCard

export function actionCard(type: ActionType, color: Color): ActionCard {
  return { type, color } as ActionCard
}

export function isActionType(value: unknown): value is ActionType {
  return typeof value === 'string' && (actionTypes as readonly string[]).includes(value)
}