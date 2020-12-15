import {findNumbersAfter, q15Read} from "../src/2020-15";

test("Q1 samples", () => {
    expect(findNumbersAfter(q15Read("1,3,2"), 2020).lastSpokenNumber).toEqual(1);
    expect(findNumbersAfter(q15Read("0,3,6"), 2020).lastSpokenNumber).toEqual(436);
    expect(findNumbersAfter(q15Read("2,1,3"), 2020).lastSpokenNumber).toEqual(10);
    expect(findNumbersAfter(q15Read("1,2,3"), 2020).lastSpokenNumber).toEqual(27);
    expect(findNumbersAfter(q15Read("2,3,1"), 2020).lastSpokenNumber).toEqual(78);
    expect(findNumbersAfter(q15Read("3,2,1"), 2020).lastSpokenNumber).toEqual(438);
    expect(findNumbersAfter(q15Read("3,1,2"), 2020).lastSpokenNumber).toEqual(1836);
})

test("Q1", () => {
    expect(findNumbersAfter(q15Read("19,0,5,1,10,13"), 2020)).toEqual(1015);
})
