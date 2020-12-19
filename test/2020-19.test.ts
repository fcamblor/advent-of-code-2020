import {countMessagesMatchingRules, D19ResolvedRule, D19Rule, D19UnresolvedRule} from "../src/2020-19";
import {D19_INPUT, D19_Q1_SAMPLE} from "./2020-19.inputs";


test("Q1 samples parsing", () => {
    let rules = D19Rule.createFromRaw(D19_Q1_SAMPLE.rules);
    expect(rules[0]).toEqual(new D19UnresolvedRule(0, [4, 1, 5], undefined));
    expect(rules[1]).toEqual(new D19UnresolvedRule(1, [2, 3], [3, 2]));
    expect(rules[2]).toEqual(new D19UnresolvedRule(2, [4, 4], [5, 5]));
    expect(rules[4]).toEqual(new D19ResolvedRule(4, new Set("a")));
    expect(rules[5]).toEqual(new D19ResolvedRule(5, new Set("b")));
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