import {D20Puzzle, D20Tile} from "../src/2020-20";
import {D20_INPUT, D20_Q1_SAMPLE} from "./2020-20.inputs";


test("Q1 sample", () => {
    let d20Puzzle = D20Puzzle.createFrom(D20_Q1_SAMPLE);

    expect(d20Puzzle.computeBorderTilesMultiplication()).toEqual(20899048083289);
})
test("Q1 INPUT", () => {
    let d20Puzzle = D20Puzzle.createFrom(D20_INPUT);

    expect(d20Puzzle.computeBorderTilesMultiplication()).toEqual(28057939502729);
})

test("Matrix manipulation test", () => {
    let tile = D20Tile.createFrom(`
Tile 42:
..##.
##..#
#...#
####.
##.##
    `.trim());

    expect(tile.rotateClockwise().toString()).toEqual(`
####.
##.#.
.#..#
##..#
#.##.
    `.trim())

    expect(tile.flipY().toString()).toEqual(`
.##..
#..##
#...#
.####
##.##
    `.trim())
    expect(tile.flipX().toString()).toEqual(`
##.##
####.
#...#
##..#
..##.
    `.trim())
    expect(tile.flipXY().toString()).toEqual(`
##.##
.####
#...#
#..##
.##..
    `.trim())
})
