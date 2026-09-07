/**
 * Cards and decks.
 *
 * This module holds the vocabulary of the whole domain: the card types, the
 * `Card` union itself and the `Deck` abstraction (used for the draw pile and
 * the discard pile as well as for the full 108-card deck).
 */

// ---------------------------------------------------------------------------
// Colors and types
// ---------------------------------------------------------------------------

export const colors = ['BLUE', 'GREEN', 'RED', 'YELLOW'] as const
export type Color = (typeof colors)[number]

export const types = ['NUMBERED', 'SKIP', 'REVERSE', 'DRAW', 'WILD', 'WILD DRAW'] as const
export type Type = (typeof types)[number]

/** The only legal numbers on a numbered card. */
export type CardNumber = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9

// ---------------------------------------------------------------------------
// Cards
// ---------------------------------------------------------------------------

export type NumberedCard = { readonly type: 'NUMBERED'; readonly color: Color; readonly number: CardNumber }
export type SkipCard = { readonly type: 'SKIP'; readonly color: Color }
export type ReverseCard = { readonly type: 'REVERSE'; readonly color: Color }
export type DrawCard = { readonly type: 'DRAW'; readonly color: Color }

/** Every card that carries a printed color. */
export type ColoredCard = NumberedCard | SkipCard | ReverseCard | DrawCard

export type WildCard = { readonly type: 'WILD' }
export type WildDrawCard = { readonly type: 'WILD DRAW' }

/** Every card without a printed color. */
export type Wild = WildCard | WildDrawCard

/** A UNO card: exactly the legal cards, nothing else. */
export type Card = ColoredCard | Wild

/** The subset of `Card` having the given type, e.g. `TypedCard<'SKIP'>`. */
export type TypedCard<T extends Type> = Extract<Card, { type: T }>

// ---------------------------------------------------------------------------
// Card predicates / helpers
// ---------------------------------------------------------------------------

/** True if `card` carries a printed color (i.e. is not a wild card). */
export function isColored(card: Card): card is ColoredCard {
  // TODO
  throw new Error('not implemented')
}

/** True if `card` has the given color. Always false for wild cards. */
export function hasColor(card: Card, color: Color): boolean {
  // TODO
  throw new Error('not implemented')
}

/** True if `card` is a numbered card with the given number. */
export function hasNumber(card: Card, number: number): boolean {
  // TODO
  throw new Error('not implemented')
}

/** Score value of a card: face value, 20 for action cards, 50 for wilds. */
export function cardScore(card: Card): number {
  // TODO
  throw new Error('not implemented')
}

// ---------------------------------------------------------------------------
// Mementos
// ---------------------------------------------------------------------------

/** Plain-JSON representation of a single card. */
export type CardMemento = Record<string, string | number>

/** Plain-JSON representation of a deck: the cards, top first. */
export type DeckMemento = CardMemento[]

/** Parses one card memento, throwing on anything that isn't a legal card. */
export function cardFromMemento(memento: CardMemento): Card {
  // TODO
  throw new Error('not implemented')
}

export function cardToMemento(card: Card): CardMemento {
  // TODO
  throw new Error('not implemented')
}

// ---------------------------------------------------------------------------
// Deck
// ---------------------------------------------------------------------------

import { Shuffler } from '../utils/random_utils'

/**
 * A pile of cards. Index 0 is the top of the pile: `deal` removes and returns
 * it, `top`/`peek` return it without removing.
 */
export interface Deck {
  /** Number of cards left in the deck. */
  readonly size: number
  /** Removes and returns the top card, or `undefined` if the deck is empty. */
  deal(): Card | undefined
  /** The top card without removing it, or `undefined` if the deck is empty. */
  top(): Card | undefined
  /** Alias of `top()`. */
  peek(): Card | undefined
  /** Shuffles the deck in place with the given shuffler. */
  shuffle(shuffler: Shuffler<Card>): void
  /** A new deck holding only the cards satisfying the predicate. */
  filter(predicate: (card: Card) => boolean): Deck
  /** Puts a card on top of the pile. */
  push(card: Card): void
  toMemento(): DeckMemento
}

export class UnoDeck implements Deck {
  private readonly cards: Card[]

  constructor(cards: Card[] = []) {
    this.cards = cards
  }

  get size(): number {
    // TODO
    throw new Error('not implemented')
  }

  deal(): Card | undefined {
    // TODO
    throw new Error('not implemented')
  }

  top(): Card | undefined {
    // TODO
    throw new Error('not implemented')
  }

  peek(): Card | undefined {
    return this.top()
  }

  shuffle(shuffler: Shuffler<Card>): void {
    // TODO
    throw new Error('not implemented')
  }

  filter(predicate: (card: Card) => boolean): Deck {
    // TODO
    throw new Error('not implemented')
  }

  push(card: Card): void {
    // TODO
    throw new Error('not implemented')
  }

  toMemento(): DeckMemento {
    // TODO
    throw new Error('not implemented')
  }
}

/** A full, unshuffled 108-card UNO deck (no blank cards). */
export function createInitialDeck(): Deck {
  // TODO: 19 numbered per color (one 0, two of 1..9), 2 skip / 2 reverse /
  // 2 draw per color, 4 wild, 4 wild draw four.
  throw new Error('not implemented')
}

export function createDeckFromMemento(memento: DeckMemento): Deck {
  // TODO
  throw new Error('not implemented')
}
