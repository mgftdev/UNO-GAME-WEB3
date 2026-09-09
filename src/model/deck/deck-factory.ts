import { Card, CardMemento, cardFromMemento } from '../cards/card'
import { colors } from '../cards/color'
import { cardNumbers, numberedCard } from '../cards/numbered-card'
import { actionCard, actionTypes } from '../cards/action-card'
import { wildCard, wildDrawCard } from '../cards/wild-card'
import { Deck } from './deck'
import { StandardDeck } from './standard-deck'

const WILDS_PER_KIND = 4

/**
 * The 108 cards of a standard UNO deck: per colour one 0, two each of 1-9 and
 * two each of skip, reverse and draw, plus four wild and four wild draw cards.
 */
export function fullDeckCards(): Card[] {
  const cards: Card[] = []
  for (const color of colors) {
    for (const number of cardNumbers) {
      cards.push(numberedCard(color, number))
      if (number !== 0) cards.push(numberedCard(color, number))
    }
    for (const type of actionTypes) {
      cards.push(actionCard(type, color))
      cards.push(actionCard(type, color))
    }
  }
  for (let i = 0; i < WILDS_PER_KIND; i++) cards.push(wildCard())
  for (let i = 0; i < WILDS_PER_KIND; i++) cards.push(wildDrawCard())
  return cards
}

export function createInitialDeck(): Deck {
  return new StandardDeck(fullDeckCards())
}

export function createDeckFromMemento(cards: readonly CardMemento[]): Deck {
  return new StandardDeck(cards.map(cardFromMemento))
}

export function deckOf(cards: readonly Card[]): Deck {
  return new StandardDeck(cards)
}