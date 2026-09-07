/**
 * A single round ("hand" in the rule set) of UNO.
 *
 * A round owns the players' hands, the draw pile, the discard pile, the
 * current color, the direction of play and everything around saying "UNO!".
 */

import { Card, CardMemento, Color, Deck } from './deck'
import { Hand } from './hand'
import { Shuffler, standardShuffler } from '../utils/random_utils'

export type Direction = 'clockwise' | 'counterclockwise'

/** Event handed to `onEnd` listeners when the round is over. */
export type RoundEndEvent = { winner: number }

/** Accusation used by `catchUnoFailure`. */
export type UnoFailure = { accuser: number; accused: number }

/** Plain-JSON state of a round. Field names are fixed by the tests. */
export type RoundMemento = {
  players: string[]
  hands: CardMemento[][]
  drawPile: CardMemento[]
  discardPile: CardMemento[]
  currentColor: Color
  currentDirection: Direction
  dealer: number
  playerInTurn?: number
}

export type RoundConfig = {
  players: string[]
  dealer: number
  shuffler?: Shuffler<Card>
  cardsPerPlayer?: number
}

export interface Round {
  readonly playerCount: number
  readonly dealer: number

  /** Name of the player at `index`; throws if out of bounds. */
  player(index: number): string
  /** The (stable) hand object of the player at `index`. */
  playerHand(index: number): Hand
  /** Index of the player whose turn it is, or `undefined` if the round ended. */
  playerInTurn(): number | undefined

  drawPile(): Deck
  discardPile(): Deck

  /** True if the card at `index` in the current player's hand may be played. */
  canPlay(index: number): boolean
  /** True if the current player holds at least one playable card. */
  canPlayAny(): boolean

  /**
   * Plays the card at `index` from the current player's hand.
   * `color` must be given for wild cards and only for wild cards.
   * Throws on any illegal play. Returns the card played.
   */
  play(index: number, color?: Color): Card
  /** Draws a card for the current player; passes the turn if unplayable. */
  draw(): void

  /** The current player declares "UNO!". */
  sayUno(playerIndex: number): void
  /** Accuses a player of failing to say "UNO!". Returns whether it stuck. */
  catchUnoFailure(accusation: UnoFailure): boolean

  hasEnded(): boolean
  /** Index of the winner, or `undefined` while the round is running. */
  winner(): number | undefined
  /** Points won by the winner, or `undefined` while the round is running. */
  score(): number | undefined
  /** Registers a listener called once when the round ends. */
  onEnd(callback: (event: RoundEndEvent) => void): void

  toMemento(): RoundMemento
}

export class UnoRound implements Round {
  // TODO: fields (players, hands, draw/discard piles, currentColor,
  // currentDirection, playerInTurn, unoSaid flags, end listeners, ...)

  get playerCount(): number {
    // TODO
    throw new Error('not implemented')
  }

  get dealer(): number {
    // TODO
    throw new Error('not implemented')
  }

  player(index: number): string {
    // TODO
    throw new Error('not implemented')
  }

  playerHand(index: number): Hand {
    // TODO
    throw new Error('not implemented')
  }

  playerInTurn(): number | undefined {
    // TODO
    throw new Error('not implemented')
  }

  drawPile(): Deck {
    // TODO
    throw new Error('not implemented')
  }

  discardPile(): Deck {
    // TODO
    throw new Error('not implemented')
  }

  canPlay(index: number): boolean {
    // TODO
    throw new Error('not implemented')
  }

  canPlayAny(): boolean {
    // TODO
    throw new Error('not implemented')
  }

  play(index: number, color?: Color): Card {
    // TODO
    throw new Error('not implemented')
  }

  draw(): void {
    // TODO
    throw new Error('not implemented')
  }

  sayUno(playerIndex: number): void {
    // TODO
    throw new Error('not implemented')
  }

  catchUnoFailure(accusation: UnoFailure): boolean {
    // TODO
    throw new Error('not implemented')
  }

  hasEnded(): boolean {
    // TODO
    throw new Error('not implemented')
  }

  winner(): number | undefined {
    // TODO
    throw new Error('not implemented')
  }

  score(): number | undefined {
    // TODO
    throw new Error('not implemented')
  }

  onEnd(callback: (event: RoundEndEvent) => void): void {
    // TODO
    throw new Error('not implemented')
  }

  toMemento(): RoundMemento {
    // TODO
    throw new Error('not implemented')
  }
}

/**
 * Deals a new round: shuffles, deals `cardsPerPlayer` cards to each player,
 * turns the first card onto the discard pile (reshuffling while it is a wild
 * card) and applies its effect before the first turn.
 */
export function createRound({
  players,
  dealer,
  shuffler = standardShuffler,
  cardsPerPlayer = 7,
}: RoundConfig): Round {
  // TODO
  throw new Error('not implemented')
}

export function createRoundFromMemento(
  memento: RoundMemento,
  shuffler: Shuffler<Card> = standardShuffler
): Round {
  // TODO: validate the memento thoroughly (player count, hands vs players,
  // at most one winner, non-empty discard pile, legal & consistent
  // currentColor, dealer and playerInTurn in bounds, ...)
  throw new Error('not implemented')
}
