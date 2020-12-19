import {countMessagesMatchingRules, D19Rule} from "../src/2020-19";
import {D19_INPUT, D19_Q1_SAMPLE} from "./2020-19.inputs";


test("Q1 samples parsing", () => {
    let rulesMap = D19Rule.createFromRaw(D19_Q1_SAMPLE.rules);
    expect(rulesMap.get(0)!.stringified()).toEqual(JSON.stringify(
        {id: 0, resolvedValues: undefined, possibleReferences1: [4, 1, 5], possibleReferences2: undefined}
    ));
    expect(rulesMap.get(1)!.stringified()).toEqual(JSON.stringify(
        {id: 1, resolvedValues: undefined, possibleReferences1: [2, 3], possibleReferences2: [3, 2]}
    ));
    expect(rulesMap.get(2)!.stringified()).toEqual(JSON.stringify(
        {id: 2, resolvedValues: undefined, possibleReferences1: [4, 4], possibleReferences2: [5, 5]}
    ));
    expect(rulesMap.get(3)!.stringified()).toEqual(JSON.stringify(
        {id: 3, resolvedValues: undefined, possibleReferences1: [4, 5], possibleReferences2: [5, 4]}
    ));
    expect(rulesMap.get(4)!.stringified()).toEqual(JSON.stringify(
        {id: 4, resolvedValues: ["a"], possibleReferences1: undefined, possibleReferences2: undefined}
    ));
    expect(rulesMap.get(5)!.stringified()).toEqual(JSON.stringify(
        {id: 5, resolvedValues: ["b"], possibleReferences1: undefined, possibleReferences2: undefined}
    ));
})

test("INPUT parsing doesn't produce any error", () => {
    D19Rule.createFromRaw(D19_INPUT.rules);
})

test("Q1 sample", () => {
    expect(countMessagesMatchingRules(D19_Q1_SAMPLE.rules, D19_Q1_SAMPLE.receivedMessages)).toEqual(2);
})

test("Q1 INPUT", () => {
    expect(countMessagesMatchingRules(D19_INPUT.rules, D19_INPUT.receivedMessages)).toEqual(156);
})