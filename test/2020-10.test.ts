import {findJoltDeltas, joltPermutationsCount} from "../src/2020-10";
import {INPUTS, Q1_SAMPLE, Q2_SAMPLE} from "./2020-10.inputs";


test('result sample 1', () => {
    let joltDeltasResult = findJoltDeltas(Q1_SAMPLE.input);
    expect(joltDeltasResult.sortedValues).toEqual(Q1_SAMPLE.expectedSortedInput);
    expect(joltDeltasResult.voltageDeltas).toEqual(Q1_SAMPLE.expectedDeltas);
    expect(joltDeltasResult.delta1).toEqual(Q1_SAMPLE.expectedDeltas1);
    expect(joltDeltasResult.delta3).toEqual(Q1_SAMPLE.expectedDeltas3);
    expect(joltDeltasResult.product).toEqual(Q1_SAMPLE.expectedProduct);
});

test('result Q1', () => {
    let joltDeltasResult = findJoltDeltas(INPUTS.input);
    expect(joltDeltasResult.sortedValues).toEqual(INPUTS.expectedSortedInput);
    expect(joltDeltasResult.voltageDeltas).toEqual(INPUTS.expectedDeltas);
    expect(joltDeltasResult.delta1).toEqual(INPUTS.expectedDeltas1);
    expect(joltDeltasResult.delta3).toEqual(INPUTS.expectedDeltas3);
    expect(joltDeltasResult.product).toEqual(INPUTS.expectedProduct);
});

test('result sample 2', () => {
    let joltDeltasResult = findJoltDeltas(Q2_SAMPLE.input);
    expect(joltDeltasResult.sortedValues).toEqual(Q2_SAMPLE.expectedSortedInput);
    expect(joltDeltasResult.voltageDeltas).toEqual(Q2_SAMPLE.expectedDeltas);
    expect(joltDeltasResult.delta1).toEqual(Q2_SAMPLE.expectedDeltas1);
    expect(joltDeltasResult.delta3).toEqual(Q2_SAMPLE.expectedDeltas3);
    expect(joltDeltasResult.product).toEqual(Q2_SAMPLE.expectedProduct);

    expect(joltPermutationsCount(joltDeltasResult.voltageDeltas)).toEqual(19208);
});

test('result Q2', () => {
    let joltDeltasResult = findJoltDeltas(INPUTS.input);

    expect(joltPermutationsCount(joltDeltasResult.voltageDeltas)).toEqual(4628074479616);
});
