import {D22CombatGame} from "../src/2020-22";
import {D22_INPUT, D22_Q1_SAMPLE} from "./2020-22.inputs";


test("Q1 sample", () => {
    expect(D22CombatGame.createFrom(D22_Q1_SAMPLE).play().winnerScore()).toEqual(306);
})

test("Q1 INPUT", () => {
    expect(D22CombatGame.createFrom(D22_INPUT).play().winnerScore()).toEqual(32598);
})
