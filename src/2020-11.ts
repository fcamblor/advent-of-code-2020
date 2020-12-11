import {
    inMatrixBound,
    iterateOverMatrix,
    MatrixCoord,
    matrixEquals,
    matrixGetOrUndefined, matrixSet
} from "./utils";


const FLOOR = ".";
const EMPTY_SEAT = "L";
const OCCUPIED_SEAT = "#";

export type SeatStatus = (typeof OCCUPIED_SEAT) | (typeof FLOOR) | (typeof EMPTY_SEAT);
export class PlaneGrid {
    private previousGridState: SeatStatus[][]|undefined = undefined;
    private currentGridState: SeatStatus[][];
    constructor(private readonly initialState: SeatStatus[][]) {
        this.currentGridState = PlaneGrid.copyGridState(this.initialState);
    }

    newRound(
        adjacentSeatStrategy: (matrix: SeatStatus[][], startingCoord: MatrixCoord, expectedSeatStatuses: SeatStatus[]) => number,
        minimumOccupiedSeatsAroundToBecomdEmpty: number
    ): boolean {
        const changingGrid = PlaneGrid.copyGridState(this.currentGridState);

        iterateOverMatrix(this.currentGridState, (coord, currentSeatStatus) => {
            if([EMPTY_SEAT, OCCUPIED_SEAT].includes(currentSeatStatus)) {
                const occupiedSeatsAround = adjacentSeatStrategy(this.currentGridState, coord, [OCCUPIED_SEAT]);
                if(currentSeatStatus === EMPTY_SEAT && occupiedSeatsAround === 0) {
                    matrixSet(changingGrid, coord, OCCUPIED_SEAT);
                }
                if(currentSeatStatus === OCCUPIED_SEAT && occupiedSeatsAround >= minimumOccupiedSeatsAroundToBecomdEmpty) {
                    matrixSet(changingGrid, coord, EMPTY_SEAT);
                }
            }
            return {continue: true};
        });

        this.previousGridState = PlaneGrid.copyGridState(this.currentGridState);
        this.currentGridState = PlaneGrid.copyGridState(changingGrid);

        const stabilityResult = matrixEquals(this.previousGridState, this.currentGridState);
        return stabilityResult.areEqual;
    }

    seats() {
        return PlaneGrid.copyGridState(this.currentGridState);
    }

    countOccupiedSeats() {
        return this.countSeatsHavingStatus([OCCUPIED_SEAT]);
    }

    countSeatsHavingStatus(expectedStatuses: SeatStatus[]) {
        return this.currentGridState.reduce(
            (count, row) => count + row.reduce(
                (count, s) => count += expectedStatuses.includes(s)?1:0,
            0),
        0);
    }

    public static countDirectlyAdjacentSeatsAround(matrix: SeatStatus[][], startingCoord: MatrixCoord): number {
        return PlaneGrid.countFirstSeatMatchingThoseRowConstraints(matrix, startingCoord, 1);
    }

    public static countFirstSeatInSightOnEachDirection(matrix: SeatStatus[][], startingCoord: MatrixCoord): number {
        return PlaneGrid.countFirstSeatMatchingThoseRowConstraints(matrix, startingCoord, Infinity);
    }

    public static wholeDirectionRowConstraintGenerator(matrix: SeatStatus[][], coord: MatrixCoord, maxNumberOfSteps: number = 1): { hint: string, coords: MatrixCoord[] }[] {
        const wholeDirectionRowConstraints = [
            { hint: "↖️", steps: [-1,-1] },
            { hint: "⬆️", steps: [-1,0] },
            { hint: "↗️", steps: [-1,1] },
            { hint: "⬅️", steps: [0,-1] },
            { hint: "➡️", steps: [0,1] },
            { hint: "↙️", steps: [1,-1] },
            { hint: "⬇️", steps: [1,0] },
            { hint: "↘️", steps: [1,1] },
        ].map((directionDefinition) => {
            const [yStep, xStep] = directionDefinition.steps;
            const directionRowConstraints = [];
            let candidate: MatrixCoord = { x: coord.x+xStep, y: coord.y+yStep };
            let stepsCount = 1;
            while(stepsCount <= maxNumberOfSteps && inMatrixBound(matrix, candidate)) {
                directionRowConstraints.push(candidate);
                candidate = { x: candidate.x + xStep, y: candidate.y + yStep }
                stepsCount++;
            }
            return { hint: directionDefinition.hint, coords: directionRowConstraints };
        });
        return wholeDirectionRowConstraints;
    }

    private static countFirstSeatMatchingThoseRowConstraints(matrix: SeatStatus[][], startingCoord: MatrixCoord, maxNumberOfSteps: number): number {
        let perDirectionRowConstraints = PlaneGrid.wholeDirectionRowConstraintGenerator(matrix, startingCoord, maxNumberOfSteps);

        const counts = perDirectionRowConstraints.map(directionRowConstraints => {
            let found: undefined|"NONE"|(typeof EMPTY_SEAT)|(typeof OCCUPIED_SEAT) = undefined;
            let i=0;
            while(i<directionRowConstraints.coords.length && found === undefined) {
                const coord = directionRowConstraints.coords[i];
                const possibleSeatStatus = matrixGetOrUndefined(matrix, coord);
                if(possibleSeatStatus === undefined) {
                    found = "NONE";
                } else if(possibleSeatStatus[0] === FLOOR) {
                    // Continue
                } else if(possibleSeatStatus[0] === OCCUPIED_SEAT) {
                    found = OCCUPIED_SEAT;
                } else if(possibleSeatStatus[0] === EMPTY_SEAT) {
                    found = EMPTY_SEAT;
                }

                i++;
            }

            if(found === undefined) {
                found = "NONE";
            }

            return { hint: directionRowConstraints.hint, found };
        });

        return counts.reduce((total, result) => total + (result.found===OCCUPIED_SEAT?1:0), 0 as number);
    }


    static copyGridState(gridState: SeatStatus[][]) {
        return gridState.map(row => [...row]);
    }
}

function COUNT_OCCUPIED_SEATS_AFTER_STABILIZATION_FOR_Q1(seats: GSheetCells) {
    const planeGrid = new PlaneGrid(seats as SeatStatus[][]);
    while(!planeGrid.newRound(PlaneGrid.countDirectlyAdjacentSeatsAround, 4)) {
    }
    return planeGrid.countSeatsHavingStatus([OCCUPIED_SEAT]);
}

function COUNT_OCCUPIED_SEATS_AFTER_STABILIZATION_FOR_Q2(seats: GSheetCells) {
    const planeGrid = new PlaneGrid(seats as SeatStatus[][]);
    while(!planeGrid.newRound(PlaneGrid.countFirstSeatInSightOnEachDirection, 5)) {
    }
    return planeGrid.countSeatsHavingStatus([OCCUPIED_SEAT]);
}