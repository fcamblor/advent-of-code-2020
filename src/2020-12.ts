
type ShipCoord = {x: number, y: number};
// directions
const NORTH="N";
const SOUTH="S";
const EAST="E";
const WEST="W";
const FORWARD="F";

type Direction = (typeof NORTH)|(typeof WEST)|(typeof EAST)|(typeof SOUTH);
export const DIRECTIONS: Direction[] = [ NORTH, EAST, SOUTH, WEST ];
// actions
const TURN_RIGHT="R";
const TURN_LEFT="L";
const MOVE_NORTH="N";
const MOVE_SOUTH="S";
const MOVE_EAST="E";
const MOVE_WEST="W";

type Action = (typeof MOVE_NORTH)|(typeof MOVE_WEST)|(typeof MOVE_EAST)|(typeof MOVE_SOUTH)|(typeof FORWARD)|(typeof TURN_LEFT)|(typeof TURN_RIGHT);

type State = { coord: ShipCoord, direction: Direction };


const RUNNER: Record<Action, {move: (num: number, state: State) => State}> = {
    N: { move: (num, state) => ({ ...state, coord: { x: state.coord.x, y: state.coord.y+num } }) },
    S: { move: (num, state) => ({ ...state, coord: { x: state.coord.x, y: state.coord.y-num } }) },
    W: { move: (num, state) => ({ ...state, coord: { x: state.coord.x-num, y: state.coord.y } }) },
    E: { move: (num, state) => ({ ...state, coord: { x: state.coord.x+num, y: state.coord.y } }) },
    R: { move: (num, state) => ({ ...state, direction: DIRECTIONS[ (DIRECTIONS.indexOf(state.direction) + (num/90) + DIRECTIONS.length)%DIRECTIONS.length ] }) },
    L: { move: (num, state) => ({ ...state, direction: DIRECTIONS[ (DIRECTIONS.indexOf(state.direction) - (num/90) + DIRECTIONS.length)%DIRECTIONS.length ] }) },
    F: { move: (num, state) => RUNNER[state.direction].move(num, state) },
};


export class D11Ship {
    private state: State = {
        coord: {x:0, y:0},
        direction: EAST
    };
    constructor() {
    }

    move(command: string): State {
        const match = command.match(/^([A-Z])([0-9]+)$/);
        const [ action, num ] = [ match![1] as Action, Number(match![2]) ];
        this.state = RUNNER[action].move(num, this.state);
        return this.currentState();
    }

    manhattanDistance() {
        return Math.abs(this.state.coord.x)+Math.abs(this.state.coord.y);
    }

    currentState() {
        return {...this.state};
    }
}
