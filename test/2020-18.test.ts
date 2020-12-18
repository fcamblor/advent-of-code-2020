import {D18Maths} from "../src/2020-18";
import {D18_INPUT} from "./2020-18.inputs";


test("Q1 samples", () => {
    expect(D18Maths.parseAndEvaluateLeftToRight("2 * 3 + (4 * 5)")).toEqual(26);
    expect(D18Maths.parseAndEvaluateLeftToRight("5 + (8 * 3 + 9 + 3 * 4 * 3)")).toEqual(437);
    expect(D18Maths.parseAndEvaluateLeftToRight("5 * 9 * (7 * 3 * 3 + 9 * 3 + (8 + 6 * 4))")).toEqual(12240);
    expect(D18Maths.parseAndEvaluateLeftToRight("((2 + 4 * 9) * (6 + 9 * 8 + 6) + 6) + 2 + 4 * 2")).toEqual(13632);
})

test("Q1", () => {
    expect(D18Maths.sumAll(D18_INPUT)).toEqual(21022630974613);
})

test("addParenthesisForPlusPrecedence() on samples", () => {
    expect(D18Maths.addParenthesisForPlusPrecedence("1 + (2 * 3) + (4 * (5 + 6))").join("")).toEqual("((1+(2*3))+(4*((5+6))))");
    expect(D18Maths.addParenthesisForPlusPrecedence("2 * 3 + (4 * 5)").join("")).toEqual("2*(3+(4*5))");
    expect(D18Maths.addParenthesisForPlusPrecedence("5 + (8 * 3 + 9 + 3 * 4 * 3)").join("")).toEqual("(5+(8*((3+9)+3)*4*3))");
    expect(D18Maths.addParenthesisForPlusPrecedence("5 * 9 * (7 * 3 * 3 + 9 * 3 + (8 + 6 * 4))").join("")).toEqual("5*9*(7*3*(3+9)*(3+((8+6)*4)))");
    expect(D18Maths.addParenthesisForPlusPrecedence("((2 + 4 * 9) * (6 + 9 * 8 + 6) + 6) + 2 + 4 * 2").join("")).toEqual("(((((2+4)*9)*(((6+9)*(8+6))+6))+2)+4)*2");
})

test("Q2 samples", () => {
    expect(D18Maths.parseAndEvaluateWithPlusPrecedence("1 + (2 * 3) + (4 * (5 + 6))")).toEqual(51);
    expect(D18Maths.parseAndEvaluateWithPlusPrecedence("2 * 3 + (4 * 5)")).toEqual(46);
    expect(D18Maths.parseAndEvaluateWithPlusPrecedence("5 + (8 * 3 + 9 + 3 * 4 * 3)")).toEqual(1445);
    expect(D18Maths.parseAndEvaluateWithPlusPrecedence("5 * 9 * (7 * 3 * 3 + 9 * 3 + (8 + 6 * 4))")).toEqual(669060);
    expect(D18Maths.parseAndEvaluateWithPlusPrecedence("((2 + 4 * 9) * (6 + 9 * 8 + 6) + 6) + 2 + 4 * 2")).toEqual(23340);
})

test("Q2", () => {
    expect(D18Maths.sumAll(D18_INPUT, D18Maths.parseAndEvaluateWithPlusPrecedence)).toEqual(169899524778212);
})