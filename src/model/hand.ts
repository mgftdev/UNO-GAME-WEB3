/**
 * A player's hand of cards.
 *
 * The tests treat a hand as an ordered, array-like read-only collection
 * (`length`, `at`, `forEach`) and require that `round.playerHand(i)` returns
 * the *same* object every time, so a hand is a long-lived mutable object
 * rather than a copied array.
 */

import { Card, CardMemento } from './deck'

export type HandMemento = CardMemento[]

export interface Hand {
  readonly length: number
  at(index: number): Card | undefined
  forEach(f: (card: Card, index: number) => void): void
  /** All cards, newest last. Read-only view. */
  readonly cards: readonly Card[]

  add(card: Card): void
  /** Removes and returns the card at `index`; throws if out of bounds. */
  remove(index: number): Card
  /** Sum of the score values of the cards in the hand. */
  score(): number

  toMemento(): HandMemento
}

export class UnoHand implements Hand {
  private readonly _cards: Card[]

  constructor(cards: Card[] = []) {
    this._cards = cards
  }

  get cards(): readonly Card[] {
    return this._cards
  }

  get length(): number {
    // TODO
    throw new Error('not implemented')
  }

  at(index: number): Card | undefined {
    // TODO
    throw new Error('not implemented')
  }

  forEach(f: (card: Card, index: number) => void): void {
    // TODO
    throw new Error('not implemented')
  }

  add(card: Card): void {
    // TODO
    throw new Error('not implemented')
  }

  remove(index: number): Card {
    // TODO
    throw new Error('not implemented')
  }

  score(): number {
    // TODO
    throw new Error('not implemented')
  }

  toMemento(): HandMemento {
    // TODO
    throw new Error('not implemented')
  }

  static fromMemento(memento: HandMemento): UnoHand {
    // TODO
    throw new Error('not implemented')
  }
}
