import {D14_INPUT, D14_Q1_SAMPLE} from "./2020-14.inputs";
import {D14Q2Mask, q14Read, q14Solve, totalMemoryOf} from "../src/2020-14";


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

test("Q2 sample", () => {
    const input = q14Read(`
mask = 000000000000000000000000000000X1001X
mem[42] = 100
mask = 00000000000000000000000000000000X0XX
mem[26] = 1
    `.trim(), "number", (maskValues) => new D14Q2Mask(maskValues));
    let state = q14Solve(input);
    expect(totalMemoryOf(state)).toEqual(208);
})

test("Q2 input", () => {
    const input = q14Read(D14_INPUT.in, "number", (maskValues) => new D14Q2Mask(maskValues));
    let state = q14Solve(input);
    expect(totalMemoryOf(state)).toEqual(4832039794082);
})

