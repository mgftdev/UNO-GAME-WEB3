import { Randomizer, Shuffler, standardRandomizer, standardShuffler } from "../../utils/random_utils";
import { Card } from "../cards/card";
import { StandardRound } from "../round/standard-round";
import { Game, GameMemento } from "./game";

const MIN_PLAYERS = 2;
const DEFAULT_PLAYERS = ["A", "B"];
const DEFAULT_TARGET_SCORE = 500;
const DEFAULT_CARDS_PER_PLAYER = 7;

export type GameConfig = {
    players: string[];
    targetScore: number;
    randomizer: Randomizer;
    shuffler: Shuffler<Card>;
    cardsPerPlayer: number;
};

export class StandardGame implements Game {
    private readonly playerNames: string[];
    private readonly scores: number[];
    private readonly randomizer: Randomizer;
    private readonly shuffler: Shuffler<Card>;
    private readonly cardsPerPlayer: number;
    private round: StandardRound | undefined;

    readonly targetScore: number;

    private constructor(
        players: string[],
        targetScore: number,
        scores: number[],
        randomizer: Randomizer,
        shuffler: Shuffler<Card>,
        cardsPerPlayer: number,
    ) {
        this.playerNames = players;
        this.targetScore = targetScore;
        this.scores = scores;
        this.randomizer = randomizer;
        this.shuffler = shuffler;
        this.cardsPerPlayer = cardsPerPlayer;
    }

    static create(props: Partial<GameConfig> = {}): StandardGame {
        const players = props.players ?? [...DEFAULT_PLAYERS];
        const targetScore = props.targetScore ?? DEFAULT_TARGET_SCORE;
        const randomizer = props.randomizer ?? standardRandomizer;
        const shuffler = props.shuffler ?? standardShuffler;
        const cardsPerPlayer = props.cardsPerPlayer ?? DEFAULT_CARDS_PER_PLAYER;

        if (players.length < MIN_PLAYERS) throw new Error("a game needs at least 2 players");
        if (targetScore <= 0) throw new Error("the target score must be greater than 0");

        const game = new StandardGame(
            [...players],
            targetScore,
            players.map(() => 0),
            randomizer,
            shuffler,
            cardsPerPlayer,
        );
        game.startRound(randomizer(players.length));
        return game;
    }

    static fromMemento(
        memento: GameMemento,
        randomizer: Randomizer = standardRandomizer,
        shuffler: Shuffler<Card> = standardShuffler,
    ): StandardGame {
        const players = memento.players;
        if (!Array.isArray(players) || players.length < MIN_PLAYERS) {
            throw new Error("a game needs at least 2 players");
        }
        if (memento.targetScore <= 0) throw new Error("the target score must be greater than 0");

        const scores = memento.scores;
        if (!Array.isArray(scores) || scores.length !== players.length) {
            throw new Error("every player needs exactly one score");
        }
        if (scores.some((score) => score < 0)) throw new Error("scores cannot be negative");

        const winners = scores.filter((score) => score >= memento.targetScore).length;
        if (winners > 1) throw new Error("a game can have at most one winner");

        const game = new StandardGame(
            [...players],
            memento.targetScore,
            [...scores],
            randomizer,
            shuffler,
            memento.cardsPerPlayer ?? DEFAULT_CARDS_PER_PLAYER,
        );

        if (memento.currentRound !== undefined) {
            game.adoptRound(StandardRound.fromMemento(memento.currentRound, shuffler));
        } else if (winners === 0) {
            throw new Error("an unfinished game needs a current round");
        }
        return game;
    }

    get playerCount(): number {
        return this.playerNames.length;
    }

    player(index: number): string {
        this.validatePlayerIndex(index);
        return this.playerNames[index];
    }

    score(index: number): number {
        this.validatePlayerIndex(index);
        return this.scores[index];
    }

    winner(): number | undefined {
        const index = this.scores.findIndex((score) => score >= this.targetScore);
        return index < 0 ? undefined : index;
    }

    currentRound(): StandardRound | undefined {
        return this.round;
    }

    toMemento(): GameMemento {
        return {
            players: [...this.playerNames],
            targetScore: this.targetScore,
            scores: [...this.scores],
            cardsPerPlayer: this.cardsPerPlayer,
            currentRound: this.round?.toMemento(),
        };
    }

    private startRound(dealer: number): void {
        this.adoptRound(
            StandardRound.create([...this.playerNames], dealer, this.shuffler, this.cardsPerPlayer),
        );
    }

    /** Takes ownership of a round and listens for it to end. */
    private adoptRound(round: StandardRound): void {
        this.round = round;
        round.onEnd(({ winner }) => this.roundEnded(round, winner));
    }

    private roundEnded(round: StandardRound, winner: number): void {
        this.scores[winner] += round.score() ?? 0;

        if (this.winner() !== undefined) {
            this.round = undefined;
            return;
        }
        this.startRound((round.dealer + 1) % this.playerCount);
    }

    private validatePlayerIndex(index: number): void {
        if (index < 0 || index >= this.playerCount) {
            throw new Error("player index out of bounds");
        }
    }
}