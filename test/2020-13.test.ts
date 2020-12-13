import {
    extractPerTimeOffsetStepsFrom,
    findEarliestTimestampFor
} from "../src/2020-13";
import {Q13_INPUT, Q2_SAMPLES} from "./2020-13.inputs";


Q2_SAMPLES.forEach((testSample, idx) => {
    test(`Q2 sample #${idx}`, () => {
        let result = findEarliestTimestampFor(testSample.sample);
        expect(result.busLinesConstraints).toEqual(testSample.expectedConstraints);
        expect(result.simplifiedBusLinesConstraints).toEqual(testSample.expectedSimplifiedBusLinesConstraints);
        expect(result.perTimeOffsetSteps).toEqual(testSample.perTimeOffsetSteps);
        expect(result.timestamp).toEqual(testSample.expectedTimestamp);
    })
})

test("test extractPerTimeOffsetStepFrom()", () => {
    let perTimeOffsetSteps = extractPerTimeOffsetStepsFrom([
        {line: 17, timeOffsetConstraint: 0},
        {line: 37, timeOffsetConstraint: 10},
        {line: 571, timeOffsetConstraint: 17},
        {line: 13, timeOffsetConstraint: 9},
        {line: 23, timeOffsetConstraint: 17},
        {line: 29, timeOffsetConstraint: 17},
        {line: 401, timeOffsetConstraint: 48},
        {line: 41, timeOffsetConstraint: 17},
        {line: 19, timeOffsetConstraint: 10},
    ]);

    expect(perTimeOffsetSteps.length).toBe(5);
    expect(perTimeOffsetSteps[0]).toEqual({
        step: 571 * 23 * 29 * 41 * 17, timeOffset: 17, constraints: [
            {line: 571, timeOffsetConstraint: 17},
            {line: 23, timeOffsetConstraint: 17},
            {line: 29, timeOffsetConstraint: 17},
            {line: 41, timeOffsetConstraint: 17},
            {line: 17, timeOffsetConstraint: 0},
        ]
    });
    expect(perTimeOffsetSteps[1]).toEqual({
        step: 401 * 13 * 19, timeOffset: 48, constraints: [
            {line: 401, timeOffsetConstraint: 48},
            {line: 13, timeOffsetConstraint: 9},
            {line: 19, timeOffsetConstraint: 10},
        ]
    });
    expect(perTimeOffsetSteps[2]).toEqual({
        step: 37 * 19, timeOffset: 10, constraints: [
            {line: 37, timeOffsetConstraint: 10},
            {line: 19, timeOffsetConstraint: 10},
        ]
    });
    expect(perTimeOffsetSteps[3]).toEqual({
        step: 17, timeOffset: 0, constraints: [
            {line: 17, timeOffsetConstraint: 0},
        ]
    });
    expect(perTimeOffsetSteps[4]).toEqual({
        step: 13, timeOffset: 9, constraints: [
            {line: 13, timeOffsetConstraint: 9},
        ]
    });
})


test("Q2 input", () => {
    var start = Date.now();
    let result = findEarliestTimestampFor(Q13_INPUT.sample);
    console.log(`Elapsed : ${Date.now() - start}ms`)
    expect(result.busLinesConstraints).toEqual(Q13_INPUT.expectedConstraints);
    expect(result.simplifiedBusLinesConstraints).toEqual(Q13_INPUT.expectedSimplifiedBusLinesConstraints);
    expect(result.perTimeOffsetSteps).toEqual(Q13_INPUT.perTimeOffsetSteps);
    expect(result.timestamp).toEqual(Q13_INPUT.expectedTimestamp);
})
