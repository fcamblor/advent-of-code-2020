
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


type Waypoint = { stepX: number, stepY: number };
type State2 = { coord: ShipCoord, waypoint: Waypoint };
const RUNNER2: Record<Action, {move: (num: number, state: State2) => State2}> = {
    N: { move: (num, state) => ({ ...state, waypoint: { stepY: state.waypoint.stepY + num, stepX: state.waypoint.stepX } }) },
    S: { move: (num, state) => ({ ...state, waypoint: { stepY: state.waypoint.stepY - num, stepX: state.waypoint.stepX } }) },
    W: { move: (num, state) => ({ ...state, waypoint: { stepY: state.waypoint.stepY, stepX: state.waypoint.stepX - num } }) },
    E: { move: (num, state) => ({ ...state, waypoint: { stepY: state.waypoint.stepY, stepX: state.waypoint.stepX + num } }) },
    F: { move: (num, state) => ({ ...state, coord: { x: state.coord.x + num*state.waypoint.stepX, y: state.coord.y + num*state.waypoint.stepY} }) },
    R: { move: (num, state) => ({ ...state, waypoint: applyRotation(state.waypoint, "CLOCKWISE", num/90) }) },
    L: { move: (num, state) => ({ ...state, waypoint: applyRotation(state.waypoint, "COUNTER_CLOCKWISE", num/90) }) }
};

type RotationType = "CLOCKWISE"|"COUNTER_CLOCKWISE";
const ROTATIONS_TRANSFORMS: Record<RotationType, (waypoint: Waypoint) => Waypoint> = {
    CLOCKWISE: (waypoint: Waypoint) => ({ stepX: waypoint.stepY, stepY: -waypoint.stepX }),
    COUNTER_CLOCKWISE: (waypoint: Waypoint) => ({ stepX: -waypoint.stepY, stepY: waypoint.stepX }),
}
const applyRotation = (waypoint: Waypoint, rotationType: RotationType, times: number) => {
    let result: Waypoint = waypoint;
    for(var i=0; i<times; i++) {
        result = ROTATIONS_TRANSFORMS[rotationType](result);
    }
    return result;
}
export class D11Ship2 {
    private state: State2 = {
        coord: {x:0, y:0},
        waypoint: {stepX: 10, stepY: 1}
    };
    constructor() {
    }

    move(command: string): State2 {
        const match = command.match(/^([A-Z])([0-9]+)$/);
        const [ action, num ] = [ match![1] as Action, Number(match![2]) ];
        this.state = RUNNER2[action].move(num, this.state);
        return this.currentState();
    }

    manhattanDistance() {
        return Math.abs(this.state.coord.x)+Math.abs(this.state.coord.y);
    }

    currentState() {
        return {...this.state};
    }
}
