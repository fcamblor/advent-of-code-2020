import {D18Maths} from "../src/2020-18";
import {D18_INPUT} from "./2020-18.inputs";


test("Q1 samples", () => {
    expect(D18Maths.evaluate("2 * 3 + (4 * 5)")).toEqual(26);
    expect(D18Maths.evaluate("5 + (8 * 3 + 9 + 3 * 4 * 3)")).toEqual(437);
    expect(D18Maths.evaluate("5 * 9 * (7 * 3 * 3 + 9 * 3 + (8 + 6 * 4))")).toEqual(12240);
    expect(D18Maths.evaluate("((2 + 4 * 9) * (6 + 9 * 8 + 6) + 6) + 2 + 4 * 2")).toEqual(13632);
})

test("Q1", () => {
    expect(D18Maths.sumAll(D18_INPUT)).toEqual(21022630974613);
})