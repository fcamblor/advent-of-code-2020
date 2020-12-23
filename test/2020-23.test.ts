import {D23Puzzle} from "../src/2020-23";


test("Q1 sample", () => {
    let puzzle = new D23Puzzle("389125467");
    expect(puzzle.moveTimes(10).currentCode()).toEqual("92658374");
    // puzzle.logger.print();
    expect(puzzle.moveTimes(90).currentCode()).toEqual("67384529");
})

test("Q1 INPUT", () => {
    let puzzle = new D23Puzzle("739862541");
    expect(puzzle.moveTimes(100).currentCode()).toEqual("94238657");
})