import { Card, ColoredCard } from './card'
import { Color } from './color'
import { NumberedCard } from './numbered-card'
import { AnyWildCard } from './wild-card'

export function isColored(card: Card): card is ColoredCard {
  return card.type !== 'WILD' && card.type !== 'WILD DRAW' /*"does this card have a colour printed on it?" It answers by ruling out the two wild types*/ 
}

export function isWild(card: Card): card is AnyWildCard {
  return !isColored(card) /*opposite of isColored() */
}

export function isNumbered(card: Card): card is NumberedCard {
  return card.type === 'NUMBERED' /* is this one of the 0–9 cards? */
}

export function hasColor(card: Card, color: Color): card is ColoredCard {
  return isColored(card) && card.color === color /*is this card this particular colour? */
}

export function hasNumber(card: Card, number: number): card is NumberedCard {
  return isNumbered(card) && card.number === number /* same idea for numbers: is this card numbered, and is its number the one I'm asking about? */
}

export function colorOf(card: Card): Color | undefined {
  return isColored(card) ? card.color : undefined /*gives a card and it hands back the colour, or undefined if the card is a wild */
}