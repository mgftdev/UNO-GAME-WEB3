import { Type } from './card-type'
import { isColor } from './color'
import { NumberedCard, isCardNumber, numberedCard } from './numbered-card'
import { ActionCard, actionCard } from './action-card'
import { AnyWildCard, wildCard, wildDrawCard } from './wild-card'

/** Every card that carries a colour of its own. */
export type ColoredCard = NumberedCard | ActionCard

/** Every legal UNO card, and nothing else. Blank cards are deliberately excluded. */
export type Card = ColoredCard | AnyWildCard

/** The subset of Card having the given type, e.g. TypedCard<'SKIP'> is SkipCard. */
export type TypedCard<T extends Type> = Extract<Card, { type: T }>

/** Serialised form of a single card, as stored in a memento. */
export type CardMemento = Record<string, string | number>

/** Points the holder of this card gives away when an opponent goes out. */
export function cardScore(card: Card): number {
  switch (card.type) {
    case 'NUMBERED':
      return card.number
    case 'SKIP':
    case 'REVERSE':
    case 'DRAW':
      return 20
    case 'WILD':
    case 'WILD DRAW':
      return 50
  }
}

export function cardToMemento(card: Card): CardMemento {
  switch (card.type) {
    case 'NUMBERED':
      return { type: card.type, color: card.color, number: card.number }
    case 'SKIP':
    case 'REVERSE':
    case 'DRAW':
      return { type: card.type, color: card.color }
    case 'WILD':
    case 'WILD DRAW':
      return { type: card.type }
  }
}

export function cardFromMemento(memento: CardMemento): Card {
  const type = memento['type']
  switch (type) {
    case 'NUMBERED': {
      const color = memento['color']
      const number = memento['number']
      if (!isColor(color)) throw new Error(`Numbered card needs a legal color, got ${String(color)}`)
      if (!isCardNumber(number)) throw new Error(`Numbered card needs a number 0-9, got ${String(number)}`)
      return numberedCard(color, number)
    }
    case 'SKIP':
    case 'REVERSE':
    case 'DRAW': {
      const color = memento['color']
      if (!isColor(color)) throw new Error(`${type} card needs a legal color, got ${String(color)}`)
      return actionCard(type, color)
    }
    case 'WILD':
      return wildCard()
    case 'WILD DRAW':
      return wildDrawCard()
    default:
      throw new Error(`Unknown card type: ${String(type)}`)
  }
}