import {PlaneGrid, SeatStatus} from "../src/2020-11";
import {
    D11_INPUT,
    Q1_EXPECTED_ROUNDS,
    Q1_STARTING_SAMPLE,
    Q2_EXPECTED_ROUNDS,
    Q2_SEATS_COUNT_SAMPLES, Q2_STARTING_SAMPLE
} from "./2020-11.inputs";


function toSeatStatuses(str: string): SeatStatus[][] {
    return str.split("\n").map(r => r.split("") as SeatStatus[]);
}

test("Q1 sample rounds are valid", () => {
    const seats: SeatStatus[][] = toSeatStatuses(Q1_STARTING_SAMPLE);

    const planeGrid = new PlaneGrid(seats);
    Q1_EXPECTED_ROUNDS.forEach((expectedRoundDefinition, idx) => {
        const expectedRound = toSeatStatuses(expectedRoundDefinition.raw);

        const stabilized = planeGrid.newRound(PlaneGrid.countDirectlyAdjacentSeatsAround, 4);
        const newSeats = planeGrid.seats();

        // console.log(`Round definition[${idx}] : stabilized=${expectedRoundDefinition.stabilized}`);
        expect(newSeats).toEqual(expectedRound);
        expect(stabilized).toEqual(expectedRoundDefinition.stabilized);
    });
    expect(planeGrid.countOccupiedSeats()).toEqual(37);
})

test("Solution to Q1", () => {
    const planeGrid = new PlaneGrid(toSeatStatuses(D11_INPUT));
    let numberOfRounds = 1;
    while(!planeGrid.newRound(PlaneGrid.countDirectlyAdjacentSeatsAround, 4)) {
        numberOfRounds++;
        // console.log(`Next round => ${numberOfRounds}`);
    }
    // console.log(numberOfRounds);
    expect(planeGrid.countOccupiedSeats()).toEqual(2152);
})

test("wholeDirectionRowConstraintGenerator impl", () => {
    const matrix = Array(4).fill([]).map(row => Array(4).fill(0));

    let actual = PlaneGrid.wholeDirectionRowConstraintGenerator(matrix, {x:0,y:0}, Infinity);
    expect(actual).toEqual([
        { hint: "↖️", coords: [] },
        { hint: "⬆️", coords: [] },
        { hint: "↗️", coords: [] },
        { hint: "⬅️", coords: [] },
        { hint: "➡️", coords: [ {x:1,y:0}, {x:2,y:0}, {x:3,y:0} ] },
        { hint: "↙️", coords: [] },
        { hint: "⬇️", coords: [ {x:0,y:1}, {x:0,y:2}, {x:0,y:3} ] },
        { hint: "↘️", coords: [ {x:1,y:1}, {x:2,y:2}, {x:3,y:3} ] },
    ]);

    expect(PlaneGrid.wholeDirectionRowConstraintGenerator(matrix, {x:1,y:1}, Infinity)).toEqual([
        { hint: "↖️", coords: [ {x:0,y:0} ] },
        { hint: "⬆️", coords: [ {x:1,y:0} ] },
        { hint: "↗️", coords: [ {x:2,y:0} ] },
        { hint: "⬅️", coords: [ {x:0,y:1} ] },
        { hint: "➡️", coords: [ {x:2,y:1}, {x:3,y:1} ] },
        { hint: "↙️", coords: [ {x:0,y:2} ] },
        { hint: "⬇️", coords: [ {x:1,y:2}, {x:1,y:3} ] },
        { hint: "↘️", coords: [ {x:2,y:2}, {x:3,y:3} ] },
    ]);

});

test("count seats matching samples", () => {
    Q2_SEATS_COUNT_SAMPLES.forEach(testExpectation => {
        const seats = toSeatStatuses(testExpectation.rawSeats);

        expect(PlaneGrid.countFirstSeatInSightOnEachDirection(seats, {x:testExpectation.x, y:testExpectation.y}))
            .toEqual(testExpectation.expected);
    });
})

test("Q2 sample rounds are valid", () => {
    const seats: SeatStatus[][] = toSeatStatuses(Q2_STARTING_SAMPLE);

    const planeGrid = new PlaneGrid(seats);
    Q2_EXPECTED_ROUNDS.forEach((expectedRoundDefinition, idx) => {
        const expectedRound = toSeatStatuses(expectedRoundDefinition.raw);

        const stabilized = planeGrid.newRound(PlaneGrid.countFirstSeatInSightOnEachDirection, 5);
        const newSeats = planeGrid.seats();

        // console.log(`Round definition[${idx}] : stabilized=${expectedRoundDefinition.stabilized}`);
        expect(newSeats).toEqual(expectedRound);
        expect(stabilized).toEqual(expectedRoundDefinition.stabilized);
    });
    expect(planeGrid.countOccupiedSeats()).toEqual(26);
})

test("Solution to Q2", () => {
    const planeGrid = new PlaneGrid(toSeatStatuses(D11_INPUT));
    let numberOfRounds = 1;
    while(!planeGrid.newRound(PlaneGrid.countFirstSeatInSightOnEachDirection, 5)) {
        numberOfRounds++;
    }
    // console.log(numberOfRounds);
    expect(planeGrid.countOccupiedSeats()).toEqual(1937);
})
