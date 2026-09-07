/**
 * A full game of UNO: a series of rounds played until a player reaches the
 * target score.
 */

import { Card } from './deck'
import { Round, RoundMemento } from './round'
import { Randomizer, Shuffler, standardRandomizer, standardShuffler } from '../utils/random_utils'

export type GameMemento = {
  players: string[]
  targetScore: number
  scores: number[]
  cardsPerPlayer: number
  /** Absent once the game has been won. */
  currentRound?: RoundMemento
}

export type GameConfig = {
  players: string[]
  targetScore: number
  randomizer: Randomizer
  shuffler: Shuffler<Card>
  cardsPerPlayer: number
}

export interface Game {
  readonly playerCount: number
  readonly targetScore: number

  player(index: number): string
  score(index: number): number
  /** Index of the winning player, or `undefined` while the game runs. */
  winner(): number | undefined
  /** The round being played, or `undefined` once the game has been won. */
  currentRound(): Round | undefined

  toMemento(): GameMemento
}

export class UnoGame implements Game {
  // TODO: fields (players, targetScore, scores, cardsPerPlayer, currentRound,
  // randomizer, shuffler)

  get playerCount(): number {
    // TODO
    throw new Error('not implemented')
  }

  get targetScore(): number {
    // TODO
    throw new Error('not implemented')
  }

  player(index: number): string {
    // TODO
    throw new Error('not implemented')
  }

  score(index: number): number {
    // TODO
    throw new Error('not implemented')
  }

  winner(): number | undefined {
    // TODO
    throw new Error('not implemented')
  }

  currentRound(): Round | undefined {
    // TODO
    throw new Error('not implemented')
  }

  toMemento(): GameMemento {
    // TODO
    throw new Error('not implemented')
  }
}

/** Defaults: players `['A', 'B']`, target score 500, 7 cards per player. */
export function createGame(config: Partial<GameConfig>): Game {
  // TODO: pick the first dealer with the randomizer, start the first round and
  // subscribe to its end to update the scores and start the next round.
  throw new Error('not implemented')
}

export function createGameFromMemento(
  memento: GameMemento,
  randomizer: Randomizer = standardRandomizer,
  shuffler: Shuffler<Card> = standardShuffler
): Game {
  // TODO: validate (>= 2 players, target score > 0, no negative scores, one
  // score per player, at most one player at or above the target score, a
  // current round iff the game is unfinished).
  throw new Error('not implemented')
}
