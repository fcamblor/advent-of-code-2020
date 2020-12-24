import {D23Puzzle} from "../src/2020-23";

test("Q1 sample", () => {
    let puzzle = new D23Puzzle("389125467");
    expect(puzzle.moveTimes(10).currentCode()).toEqual("92658374");
    expect(new D23Puzzle("389125467").moveTimes(100).currentCode()).toEqual("67384529");
})

test("Q1 INPUT", () => {
    let puzzle = new D23Puzzle("739862541");
    expect(puzzle.moveTimes(100).currentCode()).toEqual("94238657");
})

test("Q2 sample", () => {
    let puzzle = new D23Puzzle("389125467", false).appendNumbersToCups(10, 1000000);
    puzzle.moveTimes(10000000);
    const cupAfter1 = puzzle.findCupAfter(1)!;
    const cupAfterAfter1 = puzzle.findCupAfter(cupAfter1)!;
    expect(cupAfter1).toEqual(934001)
    expect(cupAfterAfter1).toEqual(159792)
    expect(cupAfter1 * cupAfterAfter1).toEqual(149245887792);
})

test("Q2 INPUT", () => {
    let puzzle = new D23Puzzle("739862541", false).appendNumbersToCups(10, 1000000);
    puzzle.moveTimes(10000000);
    const cupAfter1 = puzzle.findCupAfter(1)!;
    const cupAfterAfter1 = puzzle.findCupAfter(cupAfter1)!;
    expect(cupAfter1 * cupAfterAfter1).toEqual(3072905352);
})
