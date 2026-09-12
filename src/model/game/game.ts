import { RoundMemento, StandardRound } from "../round/standard-round";

export type GameMemento = {
    players: string[];
    targetScore: number;
    scores: number[];
    cardsPerPlayer: number;
    currentRound?: RoundMemento;
};

/** A series of rounds, played until someone reaches the target score. */
export interface Game {
    readonly playerCount: number;
    readonly targetScore: number;

    player(index: number): string;
    score(index: number): number;

    /** The player who has reached the target score, if any. */
    winner(): number | undefined;

    /** The round being played, or undefined once the game has been won. */
    currentRound(): StandardRound | undefined;

    toMemento(): GameMemento;
}