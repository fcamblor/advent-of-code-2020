import {readLines} from "../src/utils";
import {INPUT, Q1_SAMPLE} from "./2020-12.inputs";
import {D11ShipQ1, D11ShipQ2} from "../src/2020-12";


test('Q1 sample', () => {
    let ship = new D11ShipQ1();
    readLines(Q1_SAMPLE).forEach(command => {
        ship.move(command);
    })
    expect(ship.manhattanDistance()).toBe(25);
})

test('Q1', () => {
    let ship = new D11ShipQ1();
    readLines(INPUT).forEach(command => {
        ship.move(command);
    })
    expect(ship.manhattanDistance()).toBe(2270);
})


test('Q2 rotates', () => {
    let ship = new D11ShipQ2();
    expect(ship.currentState().waypoint).toEqual({stepX:10, stepY: 1});
    expect(ship.currentState().coord).toEqual({x:0, y: 0});

    ship.move("F10");
    expect(ship.currentState().waypoint).toEqual({stepX:10, stepY: 1});
    expect(ship.currentState().coord).toEqual({x:100, y: 10});

    ship.move("N3");
    expect(ship.currentState().waypoint).toEqual({stepX:10, stepY: 4});
    expect(ship.currentState().coord).toEqual({x:100, y: 10});

    ship.move("F7");
    expect(ship.currentState().waypoint).toEqual({stepX:10, stepY: 4});
    expect(ship.currentState().coord).toEqual({x:170, y: 38});

    ship.move("R90");
    expect(ship.currentState().waypoint).toEqual({stepX:4, stepY: -10});
    expect(ship.currentState().coord).toEqual({x:170, y: 38});

    ship.move("R90");
    expect(ship.currentState().waypoint).toEqual({stepX: -10, stepY: -4});
    expect(ship.currentState().coord).toEqual({x:170, y: 38});

    ship.move("R90");
    expect(ship.currentState().waypoint).toEqual({stepX: -4, stepY: 10});
    expect(ship.currentState().coord).toEqual({x:170, y: 38});

    ship.move("L90");
    expect(ship.currentState().waypoint).toEqual({stepX: -10, stepY: -4});
    expect(ship.currentState().coord).toEqual({x:170, y: 38});

    ship.move("L90");
    expect(ship.currentState().waypoint).toEqual({stepX: 4, stepY: -10});
    expect(ship.currentState().coord).toEqual({x:170, y: 38});

    ship.move("L90");
    expect(ship.currentState().waypoint).toEqual({stepX: 10, stepY: 4});
    expect(ship.currentState().coord).toEqual({x:170, y: 38});

})

test('Q2 sample', () => {
    let ship = new D11ShipQ2();
    expect(ship.currentState().waypoint).toEqual({stepX:10, stepY: 1});
    expect(ship.currentState().coord).toEqual({x:0, y: 0});

    ship.move("F10");
    expect(ship.currentState().waypoint).toEqual({stepX:10, stepY: 1});
    expect(ship.currentState().coord).toEqual({x:100, y: 10});

    ship.move("N3");
    expect(ship.currentState().waypoint).toEqual({stepX:10, stepY: 4});
    expect(ship.currentState().coord).toEqual({x:100, y: 10});

    ship.move("F7");
    expect(ship.currentState().waypoint).toEqual({stepX:10, stepY: 4});
    expect(ship.currentState().coord).toEqual({x:170, y: 38});

    ship.move("R90");
    expect(ship.currentState().waypoint).toEqual({stepX:4, stepY: -10});
    expect(ship.currentState().coord).toEqual({x:170, y: 38});

    ship.move("F11");
    expect(ship.currentState().waypoint).toEqual({stepX:4, stepY: -10});
    expect(ship.currentState().coord).toEqual({x:214, y: -72});
})

test('Q2', () => {
    let ship = new D11ShipQ2();
    readLines(INPUT).forEach(command => {
        ship.move(command);
    })
    expect(ship.manhattanDistance()).toBe(138669);
})
