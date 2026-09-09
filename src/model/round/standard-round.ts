import { Card } from "../cards/card";
import { Color } from "../cards/color";
import { isLegalPlay } from "./play-legality";

export type Direction = "clockwise" | "counterclockwise";

export type RoundMemento = {
	players: string[];
	hands: Card[][];
	drawPile: Card[];
	discardPile: Card[];
	currentColor: Color;
	currentDirection: Direction;
	dealer: number;
	playerInTurn: number;
};

export class StandardRound {
	readonly playerNames: readonly string[];
	readonly dealer: number;
	private readonly hands: Card[][];
	private readonly drawPileStack: Card[];
	private readonly discardPileStack: Card[];
	private currentColor: Color;
	private currentDirection: Direction;
	private playerInTurnIndex: number;

	constructor(
		players: string[],
		dealer: number,
		hands: Card[][],
		drawPile: Card[],
		discardPile: Card[],
		currentColor: Color,
		currentDirection: Direction,
		playerInTurn: number,
	) {
		this.playerNames = players;
		this.dealer = dealer;
		this.hands = hands;
		this.drawPileStack = drawPile;
		this.discardPileStack = discardPile;
		this.currentColor = currentColor;
		this.currentDirection = currentDirection;
		this.playerInTurnIndex = playerInTurn;
	}

	get playerCount(): number {
		return this.playerNames.length;
	}

	player(index: number): string {
		// validate index and return player
		throw new Error("not implemented yet");
	}

	playerHand(index: number): readonly Card[] {
		// validate index and return player's hand
		throw new Error("not implemented yet");
	}

	discardPile(): { top(): Card; size: number; push(card: Card): void } {
		return {
			top: () => this.discardPileStack[this.discardPileStack.length - 1],
			size: this.discardPileStack.length,
			push: (card: Card) => this.discardPileStack.push(card),
		};
	}

	drawPile(): { deal(): Card; peek(): Card; size: number } {
		return {
			deal: () => this.drawPileStack.pop() as Card,
			peek: () => this.drawPileStack[this.drawPileStack.length - 1],
			size: this.drawPileStack.length,
		};
	}

	playerInTurn(): number {
		return this.playerInTurnIndex;
	}

	canPlay(playerIndex: number): boolean {
		// check if card is legal against current top card/currentColor
		throw new Error("not implemented yet");
	}

	canPlayAny(): boolean {
		// loop through current player's hand and return true if any card is legal
		throw new Error("not implemented yet");
	}

	play(cardIndex: number, chosenColor?: Color): Card {
		const player = this.playerInTurn();
		const hand = this.playerHand(player);

		if (cardIndex < 0 || cardIndex >= hand.length) {
			throw new Error("Card index out of bounds");
		}

		const card = hand[cardIndex];

		// validate wild color requirements
		// validate legality with isLegalPlay(...)
		// remove card from hand
		// add card to discard pile
		// update currentColor
		// update direction / skip / draw / next turn
		// return the card

		throw new Error("not implemented yet");
	}

	draw(): Card {
		// draw top of draw pile
		// add to current player hand
		// if playable, keep turn else advance turn
		throw new Error("not implemented yet");
	}

	winner(): number | undefined {
		// return player index if no cards left
		throw new Error("not implemented yet");
	}

	toMemento(): RoundMemento {
		// convert current state to serializable data
		throw new Error("not implemented yet");
	}
}
