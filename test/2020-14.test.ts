import {D14_INPUT, D14_Q1_SAMPLE} from "./2020-14.inputs";
import {q14Read, q14Solve, totalMemoryOf} from "../src/2020-14";


test("Q1 samples", () => {
    const input = q14Read(D14_Q1_SAMPLE.in, "number");
    let state = q14Solve(input);
    expect(totalMemoryOf(state)).toEqual(D14_Q1_SAMPLE.expectedEndQ1State)
})

test("Q1 input", () => {
    const input = q14Read(D14_INPUT.in, "number");
    let state = q14Solve(input);
    expect(totalMemoryOf(state)).toEqual(8566770985168)
})

