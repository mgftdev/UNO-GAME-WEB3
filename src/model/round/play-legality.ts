import { Card } from '../cards/card'
import { Color } from '../cards/color'
import { hasColor } from '../cards/predicates'

/**
 * Whether a card may be laid on the pile: same colour as the colour in play, or
 * the same number for numbered cards, or the same kind for skip/reverse/draw.
 * Wild cards always match; the extra restriction on wild draw four is handled
 * by isLegalPlay, since it depends on the rest of the hand.
 */
export function matchesPile(card: Card, topCard: Card, currentColor: Color): boolean {
  if (card.type === 'WILD' || card.type === 'WILD DRAW') return true
  if (card.color === currentColor) return true
  if (card.type === 'NUMBERED') {
    return topCard.type === 'NUMBERED' && topCard.number === card.number
  }
  return card.type === topCard.type
}

/** Whether the hand holds any card of the colour currently in play. */
export function holdsCurrentColor(hand: readonly Card[], currentColor: Color): boolean {
  return hand.some(card => hasColor(card, currentColor))
}

/**
 * Whether the card at the given index of the hand may be played. A wild draw
 * four is only legal when the hand holds no card of the colour in play — a card
 * matching merely by number or kind does not block it.
 */
export function isLegalPlay(
  hand: readonly Card[],
  cardIndex: number,
  topCard: Card,
  currentColor: Color
): boolean {
  const card = hand[cardIndex]
  if (card === undefined) return false
  if (card.type === 'WILD DRAW') return !holdsCurrentColor(hand, currentColor)
  return matchesPile(card, topCard, currentColor)
}