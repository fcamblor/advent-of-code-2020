import {D24Grid} from "../src/2020-24";
import {D24_INPUT, D24_Q1_SAMPLE} from "./2020-24.inputs";


test("Q1 Sample", () => {
    const grid = D24Grid.createFrom(D24_Q1_SAMPLE);
    expect(grid.countBlacks()).toEqual(10);
})

test("Q1 INPUT", () => {
    const grid = D24Grid.createFrom(D24_INPUT);
    expect(grid.countBlacks()).toEqual(289);
})
