import { Card, cardScore, ColoredCard } from "../cards/card";
import { Color } from "../cards/color";
import { isColored } from "../cards/predicates";
import { fullDeckCards } from "../deck/deck-factory";
import { Shuffler, standardShuffler } from "../../utils/random_utils";
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

export type RoundEndEvent = { winner: number };
export type RoundEndCallback = (event: RoundEndEvent) => void;

export class StandardRound {
    readonly playerNames: readonly string[];
    readonly dealer: number;
    private readonly hands: Card[][];
    private readonly drawPileStack: Card[];
    private readonly discardPileStack: Card[];
    private readonly shuffler: Shuffler<Card>;
    private readonly endCallbacks: RoundEndCallback[] = [];
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
        shuffler: Shuffler<Card> = standardShuffler,
    ) {
        this.playerNames = players;
        this.dealer = dealer;
        this.hands = hands;
        this.drawPileStack = drawPile;
        this.discardPileStack = discardPile;
        this.currentColor = currentColor;
        this.currentDirection = currentDirection;
        this.playerInTurnIndex = playerInTurn;
        this.shuffler = shuffler;
    }

    static create(
        players: string[],
        dealer: number,
        shuffler: Shuffler<Card> = standardShuffler,
        cardsPerPlayer: number = 7,
    ): StandardRound {
        if (players.length < 2) throw new Error("a round needs at least 2 players");
        if (players.length > 10) throw new Error("a round allows at most 10 players");

        const deck = fullDeckCards();
        shuffler(deck);

        const hands: Card[][] = [];
        for (let player = 0; player < players.length; player++) {
            hands.push(deck.splice(0, cardsPerPlayer));
        }

        let startingCard = deck.shift();
        while (startingCard !== undefined && !isColored(startingCard)) {
            deck.push(startingCard);
            shuffler(deck);
            startingCard = deck.shift();
        }
        if (startingCard === undefined) throw new Error("not enough cards to start the round");

        const round = new StandardRound(
            [...players],
            dealer,
            hands,
            deck,
            [startingCard],
            startingCard.color,
            "clockwise",
            (dealer + 1) % players.length,
            shuffler,
        );
        round.applyStartingCard(startingCard);
        return round;
    }

    static fromMemento(memento: RoundMemento, shuffler: Shuffler<Card> = standardShuffler): StandardRound {
        return new StandardRound(
            [...memento.players],
            memento.dealer,
            memento.hands.map((hand) => [...hand]),
            [...memento.drawPile],
            [...memento.discardPile],
            memento.currentColor,
            memento.currentDirection,
            memento.playerInTurn,
            shuffler,
        );
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

    	// nothing to recycle yet - the discard pile only holds the card in play
    	if (this.discardPileStack.length <= 1) return;

    	// keep discard top card, recycle rest into draw pile
    	const top = this.discardPileStack.shift() as Card;
    	const recycled = this.discardPileStack.splice(0);

    	this.shuffler(recycled);

    	this.drawPileStack.push(...recycled);
    	this.discardPileStack.push(top);
	}

	private drawOneCard(): Card {
    	this.rebuildDrawPileIfNeeded();
    	const card = this.drawPileStack.shift();
    	if (card === undefined) {
        	throw new Error("Cannot draw: no cards available");
    	}
    	// refill straight away, so the pile is never left empty
    	this.rebuildDrawPileIfNeeded();
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
				const card = round.discardPileStack[0];
				if (card === undefined) {
					throw new Error("Discard pile is empty");
				}
				return card;
			},
			get size() {
				return round.discardPileStack.length;
			},
			push: (card: Card) => round.discardPileStack.unshift(card),
		};
	}

	// a plain view on the pile - recycling only happens through the round's own draw
	drawPile(): { deal(): Card | undefined; peek(): Card | undefined; size: number } {
		const round = this;
		return {
			deal: () => round.drawPileStack.shift(),
			peek: () => round.drawPileStack[0],
			get size() {
				return round.drawPileStack.length;
			},
		};
	}

    playerInTurn(): number | undefined {
        return this.hasEnded() ? undefined : this.playerInTurnIndex;
    }

	 // true if the player in turn may legally play the card at this index
    canPlay(cardIndex: number): boolean {
        if (this.hasEnded()) return false;

        const hand = this.hands[this.playerInTurnIndex];
        if (cardIndex < 0 || cardIndex >= hand.length) return false;

        const topCard = this.discardPileStack[0];
        return isLegalPlay(hand, cardIndex, topCard, this.currentColor);
    }

	// true if the player in turn has at least one legal move
	canPlayAny(): boolean {
		if (this.hasEnded()) return false;
		return this.hands[this.playerInTurnIndex].some((_, cardIndex) => this.canPlay(cardIndex));
	}

    play(cardIndex: number, chosenColor?: Color): Card {
        if (this.hasEnded()) {
            throw new Error("the round has ended");
        }

        const player = this.playerInTurnIndex;
        const hand = this.hands[player];

        if (cardIndex < 0 || cardIndex >= hand.length) {
            throw new Error("card index out of bounds");
        }

        const card = hand[cardIndex];
        const topCard = this.discardPileStack[0];

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
        this.discardPileStack.unshift(card);

        // set current color
        if (card.type === "WILD" || card.type === "WILD DRAW") {
            this.currentColor = chosenColor as Color;
        } else {
            this.currentColor = card.color;
        }

        this.applyEffect(card);

        if (hand.length === 0) {
            this.endRound(player);
        }

        return card;
    }

    private applyEffect(card: Card): void {
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
			return;
		}

		if (card.type === "SKIP") {
			this.advanceTurn(2);
			return;
		}

		if (card.type === "DRAW") {
			const nextPlayer = this.nextIndex(this.playerInTurnIndex, 1);
			this.giveCards(nextPlayer, 2);
			this.advanceTurn(2);
			return;
		}

		if (card.type === "WILD DRAW") {
			const nextPlayer = this.nextIndex(this.playerInTurnIndex, 1);
			this.giveCards(nextPlayer, 4);
			this.advanceTurn(2);
			return;
		}

		// normal card - pass turn
		this.advanceTurn(1);
    }

    private applyStartingCard(card: ColoredCard): void {
        switch (card.type) {
            case "REVERSE":
                if (this.playerCount === 2) {
                    this.advanceTurn(1);
                } else {
                    this.currentDirection = "counterclockwise";
                    this.advanceTurn(2);
                }
                break;
            case "SKIP":
                this.advanceTurn(1);
                break;
            case "DRAW":
                this.giveCards(this.playerInTurnIndex, 2);
                this.advanceTurn(1);
                break;
            default:
                break;
        }
    }

    private endRound(winner: number): void {
        const event: RoundEndEvent = { winner };
        for (const callback of [...this.endCallbacks]) {
            callback(event);
        }
    }

	draw(): Card {
        if (this.hasEnded()) {
            throw new Error("the round has ended");
        }

		const currentPlayer = this.playerInTurnIndex;
		const drawn = this.drawOneCard();
		this.hands[currentPlayer].push(drawn);

		const topCard = this.discardPileStack[0];
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

    hasEnded(): boolean {
        return this.winner() !== undefined;
    }

    // points the winner collects from everyone else's remaining cards
    score(): number | undefined {
        const winner = this.winner();
        if (winner === undefined) return undefined;

        return this.hands.reduce(
            (total, hand, player) =>
                player === winner
                    ? total
                    : total + hand.reduce((sum, card) => sum + cardScore(card), 0),
            0,
        );
    }

    onEnd(callback: RoundEndCallback): void {
        this.endCallbacks.push(callback);
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