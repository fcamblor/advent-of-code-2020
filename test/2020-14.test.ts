import {D14_INPUT, D14_Q1_SAMPLE} from "./2020-14.inputs";
import {BIT_VALUE, D14Q1Mask, MASK_VALUE, q14Read, q14Solve, totalMemoryOf} from "../src/2020-14";


test("Q1 samples", () => {
    expect(new D14Q1Mask("XXXXXXXXXXXXXXXXXXXXXXXXXXXXX1XXXX0X".split("") as MASK_VALUE[])
        .applyOn("000000000000000000000000000000001011".split("") as BIT_VALUE[])).toEqual(73);


    const input = q14Read(D14_Q1_SAMPLE.in, "number");
    let state = q14Solve(input);
    expect(totalMemoryOf(state)).toEqual(D14_Q1_SAMPLE.expectedEndQ1State)
})

test("Q1 input", () => {
    const input = q14Read(D14_INPUT.in, "number");
    let state = q14Solve(input);
    expect(totalMemoryOf(state)).toEqual(8566770985168)
})

