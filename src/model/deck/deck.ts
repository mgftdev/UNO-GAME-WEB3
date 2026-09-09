import { Shuffler } from '../../utils/random_utils'
import { Card, CardMemento } from '../cards/card'

/**
 * A pile of cards. The same abstraction serves the full deck, the draw pile
 * and the discard pile: index 0 is always the top of the pile.
 */
export interface Deck {
  readonly size: number

  shuffle(shuffler: Shuffler<Card>): void

  /** Removes and returns the top card, or undefined if the pile is empty. */
  deal(): Card | undefined

  /** The top card, without removing it. */
  peek(): Card | undefined

  /** The visible top card of the pile. Same card as peek(). */
  top(): Card | undefined

  addOnTop(card: Card): void

  addAll(cards: readonly Card[]): void

  /** Removes every card except the top one and returns them. */
  removeAllButTop(): Card[]

  /** A new pile holding only the cards satisfying the predicate. */
  filter(predicate: (card: Card) => boolean): Deck

  toMemento(): CardMemento[]
}