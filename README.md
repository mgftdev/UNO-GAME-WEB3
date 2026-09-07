# UNO — WEB3 Assignment 1

Implementation of standard UNO rules in TypeScript, object-oriented, validated
against the teacher-provided Jest suite.

## Getting started

```bash
npm install
npm test          # run the suite
npm run test:watch
npm run typecheck # tsc --noEmit
```

## Project structure

```
src/
  model/
    deck.ts    Color, Type, Card union, TypedCard<T>, Deck + UnoDeck,
               createInitialDeck, createDeckFromMemento, card mementos
    hand.ts    Hand + UnoHand (a player's cards)
    round.ts   Round + UnoRound, createRound, createRoundFromMemento
    uno.ts     Game + UnoGame, createGame, createGameFromMemento
  utils/
    random_utils.ts   Randomizer / Shuffler (given, do not change)
__test__/
  model/     the 8 given test suites (unmodified)
  utils/     predicates.ts, shuffling.ts (given), test_adapter.ts (wired up)
docs/        assignment brief and the official rule set
```

The tests import from `src/model/deck`, `src/model/round` and `src/model/uno`,
so those three file names are fixed. `test_adapter.ts` is already filled in and
just delegates to the factory functions in those modules.

## Conventions the tests rely on

- A pile is ordered **top first**: index 0 of a `Deck`/memento array is the top
  card. `deal()` removes the top, `top()`/`peek()` only look.
- `round.playerHand(i)` must return the **same object** on every call.
- Mementos are plain JSON objects, and `toMemento()` must round-trip exactly
  the memento an object was created from (`createX(m).toMemento()` equals `m`).
- Card score: numbered = face value, SKIP/REVERSE/DRAW = 20, WILD/WILD DRAW = 50.

## Suggested order of work

1. `deck.ts` — types, `createInitialDeck` (108 cards), `UnoDeck`, mementos.
   Makes `deck.test.ts` pass.
2. `hand.ts` — trivial, but needed by the round.
3. `round.ts` dealing — `createRound`: shuffle, deal, flip the discard top,
   reshuffle while it is a wild, apply the top card's effect to pick the first
   player. Makes `round.start.test.ts` pass.
4. `round.ts` legality — `canPlay` / `canPlayAny`, including the WILD DRAW
   restriction (illegal while you hold a card of the current color; a matching
   *number* or a matching action type does not block it).
   Makes `round.legal.plays.test.ts` pass.
5. `round.ts` playing — `play`, `draw`, direction, skip/draw effects, the
   2-player reverse-as-skip rule, refilling the draw pile from the discard
   pile. Makes `round.playing.test.ts` pass.
6. `round.ts` mementos — `createRoundFromMemento` with full validation and
   `toMemento`. Makes `round.memento.test.ts` pass.
7. `round.ts` going out — `sayUno`, `catchUnoFailure`, `hasEnded`, `winner`,
   `score`, `onEnd`. Makes `round.going.out.test.ts` pass.
8. `uno.ts` — `Game`, scoring across rounds, starting the next round on
   `onEnd`, target score, mementos. Makes `uno.test.ts` and
   `uno.memento.test.ts` pass.
