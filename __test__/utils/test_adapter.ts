import { Randomizer, Shuffler, standardRandomizer, standardShuffler } from '../../src/utils/random_utils'
import {
  Card,
  Deck,
  DeckMemento,
  createDeckFromMemento as deckFromMemento,
  createInitialDeck as initialDeck,
} from '../../src/model/deck'
import {
  Round,
  RoundMemento,
  createRound as newRound,
  createRoundFromMemento as roundFromMemento,
} from '../../src/model/round'
import {
  Game,
  GameMemento,
  createGame as newGame,
  createGameFromMemento as gameFromMemento,
} from '../../src/model/uno'

export function createInitialDeck(): Deck {
  return initialDeck()
}

export function createDeckFromMemento(cards: Record<string, string | number>[]): Deck {
  return deckFromMemento(cards as DeckMemento)
}

export type HandConfig = {
  players: string[]
  dealer: number
  shuffler?: Shuffler<Card>
  cardsPerPlayer?: number
}

export function createRound({
  players,
  dealer,
  shuffler = standardShuffler,
  cardsPerPlayer = 7,
}: HandConfig): Round {
  return newRound({ players, dealer, shuffler, cardsPerPlayer })
}

export function createRoundFromMemento(memento: any, shuffler: Shuffler<Card> = standardShuffler): Round {
  return roundFromMemento(memento as RoundMemento, shuffler)
}

export type GameConfig = {
  players: string[]
  targetScore: number
  randomizer: Randomizer
  shuffler: Shuffler<Card>
  cardsPerPlayer: number
}

export function createGame(props: Partial<GameConfig>): Game {
  return newGame(props)
}

export function createGameFromMemento(
  memento: any,
  randomizer: Randomizer = standardRandomizer,
  shuffler: Shuffler<Card> = standardShuffler
): Game {
  return gameFromMemento(memento as GameMemento, randomizer, shuffler)
}
