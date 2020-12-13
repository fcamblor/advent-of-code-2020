import {findEarliestTimestampFor} from "../src/2020-13";
import {Q13_INPUT, Q2_SAMPLES} from "./2020-13.inputs";


test("Q2 samples", () => {
    Q2_SAMPLES.forEach(testSample => {
        expect(findEarliestTimestampFor(testSample.sample)).toEqual(testSample.expected);
    })
})