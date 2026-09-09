import { Shuffler } from '../../utils/random_utils'
import { Card, CardMemento, cardToMemento } from '../cards/card'
import { Deck } from './deck'

export class StandardDeck implements Deck {
  private readonly cards: Card[]

  constructor(cards: readonly Card[] = []) {
    this.cards = [...cards]
  }

  get size(): number {
    return this.cards.length
  }

  shuffle(shuffler: Shuffler<Card>): void {
    shuffler(this.cards)
  }

  deal(): Card | undefined {
    return this.cards.shift()
  }

  peek(): Card | undefined {
    return this.cards[0]
  }

  top(): Card | undefined {
    return this.peek()
  }

  addOnTop(card: Card): void {
    this.cards.unshift(card)
  }

  addAll(cards: readonly Card[]): void {
    this.cards.push(...cards)
  }

  removeAllButTop(): Card[] {
    return this.cards.splice(1)
  }

  filter(predicate: (card: Card) => boolean): Deck {
    return new StandardDeck(this.cards.filter(predicate))
  }

  toMemento(): CardMemento[] {
    return this.cards.map(cardToMemento)
  }
}