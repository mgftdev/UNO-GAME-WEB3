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
            throw new Error("Player index out of bounds");
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

    player(index: number): string {
        this.validatePlayerIndex(index);
        return this.playerNames[index];
    }

    playerHand(index: number): readonly Card[] {
        this.validatePlayerIndex(index);
        return this.hands[index];
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
        this.validatePlayerIndex(playerIndex);

        const hand = this.hands[playerIndex];
        const topCard = this.discardPileStack[this.discardPileStack.length - 1];

        return hand.some((_, cardIndex) => isLegalPlay(hand, cardIndex, topCard, this.currentColor));
    }

    canPlayAny(): boolean {
        return this.canPlay(this.playerInTurnIndex);
    }

    play(cardIndex: number, chosenColor?: Color): Card {
        const player = this.playerInTurn();
        const hand = this.hands[player];

        if (cardIndex < 0 || cardIndex >= hand.length) {
            throw new Error("Card index out of bounds");
        }

        const card = hand[cardIndex];
        const topCard = this.discardPileStack[this.discardPileStack.length - 1];

        if ((card.type === "WILD" || card.type === "WILD DRAW") && chosenColor === undefined) {
            throw new Error("Wild cards require a chosen color");
        }

        if (
            (card.type !== "WILD" && card.type !== "WILD DRAW") &&
            chosenColor !== undefined
        ) {
            throw new Error("Only wild cards may choose a color");
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

        // minimal action handling
        if (card.type === "REVERSE") {
            if (this.playerCount === 2) {
                // 2 player rule - reverse acts like skip
                this.advanceTurn(1);
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
            const nextPlayer = (this.playerInTurnIndex + 1) % this.playerCount;
            for (let i = 0; i < 2; i++) {
                const drawn = this.drawPileStack.pop();
                if (drawn) {
                    this.hands[nextPlayer].push(drawn);
                }
            }
            this.advanceTurn(2);
            return card;
        }

        if (card.type === "WILD DRAW") {
            const nextPlayer = (this.playerInTurnIndex + 1) % this.playerCount;
            for (let i = 0; i < 4; i++) {
                const drawn = this.drawPileStack.pop();
                if (drawn) {
                    this.hands[nextPlayer].push(drawn);
                }
            }
            this.advanceTurn(2);
            return card;
        }

        // normal card
        this.advanceTurn(1);
        return card;
    }

    draw(): Card {
        if (this.drawPileStack.length === 0) {
            const topCard = this.discardPileStack.pop();
            if (topCard === undefined) {
                throw new Error("Cannot draw from an empty draw pile");
            }

            const rest = this.discardPileStack.splice(0);
            this.discardPileStack.length = 0;
            this.discardPileStack.push(topCard);

            for (const card of rest) {
                this.drawPileStack.push(card);
            }
        }

        const drawn = this.drawPileStack.pop() as Card;
        const currentPlayer = this.playerInTurnIndex;
        this.hands[currentPlayer].push(drawn);

        const topCard = this.discardPileStack[this.discardPileStack.length - 1];
        if (!isLegalPlay(this.hands[currentPlayer], this.hands[currentPlayer].length - 1, topCard, this.currentColor)) {
            this.advanceTurn(1);
        }

        return drawn;
    }

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