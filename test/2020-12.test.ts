import {readLines} from "../src/utils";
import {INPUT, Q1_SAMPLE} from "./2020-12.inputs";
import {D11Ship, DIRECTIONS} from "../src/2020-12";


test('Q1 sample', () => {
    let ship = new D11Ship();
    readLines(Q1_SAMPLE).forEach(command => {
        ship.move(command);
    })
    expect(ship.manhattanDistance()).toBe(25);
})

test('Q1', () => {
    let ship = new D11Ship();
    readLines(INPUT).forEach(command => {
        ship.move(command);
    })
    expect(ship.manhattanDistance()).toBe(2270);
})