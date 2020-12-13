import {findEarliestTimestampFor} from "../src/2020-13";
import {Q13_INPUT, Q2_SAMPLES} from "./2020-13.inputs";


test("Q2 samples", () => {
    Q2_SAMPLES.forEach(testSample => {
        let result = findEarliestTimestampFor(testSample.sample);
        expect(result.busLinesConstraints).toEqual(testSample.expectedConstraints);
        expect(result.simplifiedBusLinesConstraints).toEqual(testSample.expectedSimplifiedBusLinesConstraints);
        expect(result.highestPerTimeOffsetStep).toEqual(testSample.expectedHighestPerTimeOffsetStep);
        expect(result.timestamp).toEqual(testSample.expectedTimestamp);
    })
})

test("Q2 input", () => {
    var start = Date.now();
    let result = findEarliestTimestampFor(Q13_INPUT.sample);
    expect(result.busLinesConstraints).toEqual(Q13_INPUT.expectedConstraints);
    expect(result.simplifiedBusLinesConstraints).toEqual(Q13_INPUT.expectedSimplifiedBusLinesConstraints);
    expect(result.highestPerTimeOffsetStep).toEqual(Q13_INPUT.expectedHighestPerTimeOffsetStep);
    expect(result.timestamp).toEqual(Q13_INPUT.expectedTimestamp);
    console.log(`Elapsed : ${Date.now() - start}ms`)
})