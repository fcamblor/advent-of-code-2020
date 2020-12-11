import {extractColumnBasedValues, iterateOverMatrix, matrixEquals, matrixGetOrUndefined} from "./utils";


export const FLOOR = ".";
export const EMPTY_SEAT = "L";
export const OCCUPIED_SEAT = "#";
export type SeatStatus = (typeof OCCUPIED_SEAT) | (typeof FLOOR) | (typeof EMPTY_SEAT);
export class PlaneGrid {
    private previousGridState: SeatStatus[][]|undefined = undefined;
    private currentGridState: SeatStatus[][];
    constructor(private readonly initialState: SeatStatus[][]) {
        this.currentGridState = PlaneGrid.copyGridState(this.initialState);
    }

    newRound(): boolean {
        const changingGrid = PlaneGrid.copyGridState(this.currentGridState);

        iterateOverMatrix(this.currentGridState, (i, j, currentSeatStatus) => {
            if([EMPTY_SEAT, OCCUPIED_SEAT].includes(currentSeatStatus)) {
                const occupiedSeatsAround = PlaneGrid.countDirectlyAdjacentSeatsAround(this.currentGridState, i, j, [OCCUPIED_SEAT]);
                if(currentSeatStatus === EMPTY_SEAT && occupiedSeatsAround === 0) {
                    changingGrid[i][j] = OCCUPIED_SEAT;
                }
                if(currentSeatStatus === OCCUPIED_SEAT && occupiedSeatsAround >= 4) {
                    changingGrid[i][j] = EMPTY_SEAT;
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

    countSeatsHavingStatus(expectedStatuses: SeatStatus[]) {
        return this.currentGridState.reduce(
            (count, row) => count + row.reduce(
                (count, s) => count += expectedStatuses.includes(s)?1:0,
            0),
        0);
    }

    public static countDirectlyAdjacentSeatsAround(matrix: SeatStatus[][], i: number, j: number, expectedSeatStatuses: SeatStatus[]): number {
        return PlaneGrid.countFirstSeatMatchingThoseRowConstraints(matrix, [
            [ [i-1, j-1] ],
            [ [i,j-1] ],
            [ [i+1,j-1] ],
            [ [i-1, j] ],
            [ [i+1,j] ],
            [ [i-1, j+1] ],
            [ [i,j+1] ],
            [ [i+1,j+1 ] ]
        ], expectedSeatStatuses);
    }

    private static countFirstSeatMatchingThoseRowConstraints(matrix: SeatStatus[][], perDirectionRowConstraints: [number, number][][], expectedSeatStatuses: SeatStatus[]): number {
        return perDirectionRowConstraints.reduce((count, directionRowConstraints) => {

            let found = false;
            for(var i=0; i<directionRowConstraints.length; i++) {
                const [ ci, cj ] = directionRowConstraints[i];
                const possibleSeatStatus = matrixGetOrUndefined(matrix, ci, cj);
                if((possibleSeatStatus !== undefined) && expectedSeatStatuses.includes(possibleSeatStatus)) {
                    found = true;
                    break;
                }
            }

            count += found?1:0;
            return count;
        }, 0);
    }


    static copyGridState(gridState: SeatStatus[][]) {
        return gridState.map(row => [...row]);;
    }
}

function COUNT_OCCUPIED_SEATS_AFTER_STABILIZATION(seats: GSheetCells) {
    const planeGrid = new PlaneGrid(seats as SeatStatus[][]);
    while(!planeGrid.newRound()) {
    }
    return planeGrid.countSeatsHavingStatus([OCCUPIED_SEAT]);
}