import { Randomizer, Shuffler, standardRandomizer, standardShuffler } from '../../src/utils/random_utils'
import { Card, Deck, createInitialDeck as fullDeck, createDeckFromMemento as deckFromMemento } from '../../src/model/deck'
import { RoundMemento, StandardRound } from '../../src/model/round/standard-round'
import { GameMemento } from '../../src/model/game/game'
import { StandardGame } from '../../src/model/game/standard-game'

// Fix (or import) these types:
type Round = StandardRound
type Game = StandardGame

//Fill out the empty functions
export function createInitialDeck(): Deck {
  return fullDeck()
}

export function createDeckFromMemento(cards: Record<string, string | number>[]): Deck {
  return deckFromMemento(cards)
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
    cardsPerPlayer = 7
  }: HandConfig): Round {
  return StandardRound.create(players, dealer, shuffler, cardsPerPlayer)
}

export function createRoundFromMemento(memento: any, shuffler: Shuffler<Card> = standardShuffler): Round {
  return StandardRound.fromMemento(memento as RoundMemento, shuffler)
}

export type GameConfig = {
  players: string[]
  targetScore: number
  randomizer: Randomizer
  shuffler: Shuffler<Card>
  cardsPerPlayer: number
}

export function createGame(props: Partial<GameConfig>): Game {
  return StandardGame.create(props)
}

export function createGameFromMemento(memento: any, randomizer: Randomizer = standardRandomizer, shuffler: Shuffler<Card> = standardShuffler): Game {
  return StandardGame.fromMemento(memento as GameMemento, randomizer, shuffler)
}