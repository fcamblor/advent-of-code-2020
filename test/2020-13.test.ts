import {findEarliestTimestampFor, readBusLinesConstraints} from "../src/2020-13";
import {Q13_INPUT, Q2_SAMPLES} from "./2020-13.inputs";


test("Q2 samples", () => {
    Q2_SAMPLES.forEach(testSample => {
        expect(readBusLinesConstraints(testSample.sample)).toEqual(testSample.expectedConstraints);
        expect(findEarliestTimestampFor(testSample.sample)).toEqual(testSample.expected);
    })
})

test("Q2 input", () => {
    expect(findEarliestTimestampFor(Q13_INPUT, 100000000000000)).toEqual(0);
})