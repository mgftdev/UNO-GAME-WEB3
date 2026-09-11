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

    private validatePlayerIndex(index: number): void {
        if (index < 0 || index >= this.playerCount) {
            throw new Error("player index out of bounds");
        }
    }

    private advanceTurn(steps: number = 1): void {
        if (this.playerCount === 0) {
            return;
        }

        const direction = this.currentDirection === "clockwise" ? 1 : -1;

        for (let i = 0; i < steps; i++) {
            this.playerInTurnIndex =
                (this.playerInTurnIndex + direction + this.playerCount) % this.playerCount;
        }
    }

	private nextIndex(from: number, steps: number = 1): number {
    	const direction = this.currentDirection === "clockwise" ? 1 : -1;
    	return (from + direction * steps + this.playerCount * 10) % this.playerCount;
	}

	//if draw pile empty - rebuild
	private rebuildDrawPileIfNeeded(): void {
    	if (this.drawPileStack.length > 0) return;

    	if (this.discardPileStack.length <= 1) {
        	throw new Error("Cannot draw: no cards available");
    	}

    	// keep discard top card, recycle rest into draw pile
    	const top = this.discardPileStack.pop() as Card;
    	const recycled = this.discardPileStack.splice(0);

    	// shuffle
    	for (let i = recycled.length - 1; i > 0; i--) {
        	const j = Math.floor(Math.random() * (i + 1));
        	const temp = recycled[i];
        	recycled[i] = recycled[j];
        	recycled[j] = temp;
    	}

    	this.drawPileStack.push(...recycled);
    	this.discardPileStack.push(top);
	}

	private drawOneCard(): Card {
    	this.rebuildDrawPileIfNeeded();
    	const card = this.drawPileStack.pop();
    	if (card === undefined) {
        	throw new Error("Cannot draw: draw pile is empty");
    	}
    	return card;
	}

	// for draw and wild draw
	private giveCards(playerIndex: number, count: number): void {
		for (let i = 0; i < count; i++) {
			this.hands[playerIndex].push(this.drawOneCard());
		}
	}
	
    player(index: number): string {
        this.validatePlayerIndex(index);
        return this.playerNames[index];
    }

    playerHand(index: number): readonly Card[] {
        this.validatePlayerIndex(index);
        return this.hands[index];
    }

	discardPile(): { top(): Card; size: number; push(card: Card): void } {
		const round = this;
		return {
			top: () => {
				const card = round.discardPileStack[this.discardPileStack.length - 1];
				if (card === undefined) {
					throw new Error("Discard pile is empty");
				}
				return card;
			},
			get size() {
				return round.discardPileStack.length;
			},
			push: (card: Card) => round.discardPileStack.push(card),
		};
	}

	drawPile(): { deal(): Card; peek(): Card; size: number } {
		const round = this;
		return {
			deal: () => round.drawOneCard(),
			peek: () => {
				round.rebuildDrawPileIfNeeded();
				const card = round.drawPileStack[this.drawPileStack.length - 1];
				if (card === undefined) {
					throw new Error("Draw pile is empty");
				}
				return card;
			},
			get size() {
				return round.drawPileStack.length;
			},
		};
	}

    playerInTurn(): number {
        return this.playerInTurnIndex;
    }

	 // true if player has at least one legal move at the moment
    canPlay(playerIndex: number): boolean {
        this.validatePlayerIndex(playerIndex);

        const hand = this.hands[playerIndex];
        const topCard = this.discardPileStack[this.discardPileStack.length - 1];

        return hand.some((_, cardIndex) => isLegalPlay(hand, cardIndex, topCard, this.currentColor));
    }

	canPlayAny(): boolean {
		const current = this.playerInTurnIndex;
		if (current < 0 || current >= this.playerCount) return false;
		return this.canPlay(current);
	}

    play(cardIndex: number, chosenColor?: Color): Card {
        const player = this.playerInTurn();
        const hand = this.hands[player];

        if (cardIndex < 0 || cardIndex >= hand.length) {
            throw new Error("card index out of bounds");
        }

        const card = hand[cardIndex];
        const topCard = this.discardPileStack[this.discardPileStack.length - 1];

        if ((card.type === "WILD" || card.type === "WILD DRAW") && chosenColor === undefined) {
            throw new Error("wild cards need a chosen color");
        }

        if (
            (card.type !== "WILD" && card.type !== "WILD DRAW") &&
            chosenColor !== undefined
        ) {
            throw new Error("Only wild cards can choose a color");
        }

        if (!isLegalPlay(hand, cardIndex, topCard, this.currentColor)) {
            throw new Error("Illegal play");
        }

        // remove card from current player's hand
        hand.splice(cardIndex, 1);

        // add it to discard pile
        this.discardPileStack.push(card);

        // set current color
        if (card.type === "WILD" || card.type === "WILD DRAW") {
            this.currentColor = chosenColor as Color;
        } else {
            this.currentColor = card.color;
        }

        // action handling
		if (card.type === "REVERSE") {
			if (this.playerCount === 2) {
				// 2 player rule - reverse skips
				this.advanceTurn(2);
			} else {
				this.currentDirection =
					this.currentDirection === "clockwise" ? "counterclockwise" : "clockwise";
				this.advanceTurn(1);
			}
			return card;
		}

		if (card.type === "SKIP") {
			this.advanceTurn(2);
			return card;
		}

		if (card.type === "DRAW") {
			const nextPlayer = this.nextIndex(this.playerInTurnIndex, 1);
			this.giveCards(nextPlayer, 2);
			this.advanceTurn(2);
			return card;
		}

		if (card.type === "WILD DRAW") {
			const nextPlayer = this.nextIndex(this.playerInTurnIndex, 1);
			this.giveCards(nextPlayer, 4);
			this.advanceTurn(2);
			return card;
		}

		// normal card - pass turn
		this.advanceTurn(1);
		return card;
    }

	draw(): Card {
		const currentPlayer = this.playerInTurnIndex;
		const drawn = this.drawOneCard();
		this.hands[currentPlayer].push(drawn);

		const topCard = this.discardPileStack[this.discardPileStack.length - 1];
		if (!isLegalPlay(this.hands[currentPlayer], this.hands[currentPlayer].length - 1, topCard, this.currentColor)) {
			this.advanceTurn(1);
		}

		return drawn;
	}

	// winner when empty hand
    winner(): number | undefined {
        for (let i = 0; i < this.playerCount; i++) {
            if (this.hands[i].length === 0) {
                return i;
            }
        }
        return undefined;
    }

    toMemento(): RoundMemento {
        return {
            players: [...this.playerNames],
            hands: this.hands.map((hand) => [...hand]),
            drawPile: [...this.drawPileStack],
            discardPile: [...this.discardPileStack],
            currentColor: this.currentColor,
            currentDirection: this.currentDirection,
            dealer: this.dealer,
            playerInTurn: this.playerInTurnIndex,
        };
    }
}