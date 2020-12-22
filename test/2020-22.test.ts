import {D22CombatGame, D22Game, d22play, D22RecursiveCombat} from "../src/2020-22";
import {D22_INFINITE_LOOP_SAMPLE, D22_INPUT, D22_SAMPLE} from "./2020-22.inputs";


test("Q1 sample", () => {
    let gameOutcome = D22Game.createFrom(D22_SAMPLE.rawString, (p1, p2) => new D22CombatGame(p1, p2)).play();
    // console.log(gameOutcome.outputs.join("\n"))
    expect(gameOutcome.logger.outputLines()).toEqual(D22_SAMPLE.expectedQ1Output.split("\n"));
    expect(gameOutcome.gameWinner!.score()).toEqual(306);
})

test("Q1 INPUT", () => {
    let gameOutcome = D22Game.createFrom(D22_INPUT, (p1, p2) => new D22CombatGame(p1, p2)).play();
    // console.log(gameOutcome.outputs.join("\n"))
    expect(gameOutcome.gameWinner!.score()).toEqual(32598);
})

test("Q2 sample", () => {
    let gameOutcome = d22play(D22_SAMPLE.rawString, D22RecursiveCombat.play);
    // console.log(gameOutcome.outputs.join("\n"))
    expect(gameOutcome.outputs).toEqual(D22_SAMPLE.expectedQ2Output.split("\n"));
    expect(gameOutcome.winner!.score()).toEqual(291);
})

test("Q2 game is not looping forever", () => {
    let gameOutcome = d22play(D22_INFINITE_LOOP_SAMPLE.rawString, D22RecursiveCombat.play);
    // console.log(gameOutcome.outputs.join("\n"))
    expect(gameOutcome.outputs).toEqual(D22_INFINITE_LOOP_SAMPLE.expectedOutput.split("\n"));
    expect(gameOutcome.winner!.score()).toEqual(105);
})

test("Q2 INPUT", () => {
    let gameOutcome = d22play(D22_INPUT, D22RecursiveCombat.play);
    expect(gameOutcome.winner!.score()).toEqual(35836);
})
