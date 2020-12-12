import {extractColumnBasedValues, readLines} from "./utils";
import {INPUT} from "../test/2020-12.inputs";

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
type Runners<S extends State> = Record<Action, (num: number, state: S) => S>;

type State = { coord: ShipCoord };
export abstract class D11Ship<S extends State> {
    constructor(private state: S, protected runners: Runners<S>) {
    }

    move(command: string): State {
        const match = command.match(/^([A-Z])([0-9]+)$/);
        const [ action, num ] = [ match![1] as Action, Number(match![2]) ];
        this.state = this.runners[action](num, this.state);

        return this.currentState();
    }

    manhattanDistance() {
        return Math.abs(this.state.coord.x)+Math.abs(this.state.coord.y);
    }

    currentState(): S {
        return {...this.state};
    }
}

type StateQ1 = { coord: ShipCoord, direction: Direction };
export class D11ShipQ1 extends D11Ship<StateQ1> {
    constructor() {
        super({
            coord: {x:0, y:0},
            direction: EAST
        }, {
            N: (num, state) => ({ ...state, coord: { x: state.coord.x, y: state.coord.y+num } }),
            S: (num, state) => ({ ...state, coord: { x: state.coord.x, y: state.coord.y-num } }),
            W: (num, state) => ({ ...state, coord: { x: state.coord.x-num, y: state.coord.y } }),
            E: (num, state) => ({ ...state, coord: { x: state.coord.x+num, y: state.coord.y } }),
            R: (num, state) => ({ ...state, direction: DIRECTIONS[ (DIRECTIONS.indexOf(state.direction) + (num/90) + DIRECTIONS.length)%DIRECTIONS.length ] }),
            L: (num, state) => ({ ...state, direction: DIRECTIONS[ (DIRECTIONS.indexOf(state.direction) - (num/90) + DIRECTIONS.length)%DIRECTIONS.length ] }),
            F: (num, state) => this.runners[state.direction](num, state),
        });
    }
}


type Waypoint = { stepX: number, stepY: number };
type StateQ2 = { coord: ShipCoord, waypoint: Waypoint };
type RotationType = "CLOCKWISE"|"COUNTER_CLOCKWISE";
const ROTATIONS_TRANSFORMS: Record<RotationType, (waypoint: Waypoint) => Waypoint> = {
    CLOCKWISE: (waypoint: Waypoint) => ({ stepX: waypoint.stepY, stepY: -waypoint.stepX }),
    COUNTER_CLOCKWISE: (waypoint: Waypoint) => ({ stepX: -waypoint.stepY, stepY: waypoint.stepX }),
}
export class D11ShipQ2 extends D11Ship<StateQ2>{
    constructor() {
        super({
            coord: {x:0, y:0},
            waypoint: {stepX: 10, stepY: 1}
        }, {
            N: (num, state) => ({ ...state, waypoint: { stepY: state.waypoint.stepY + num, stepX: state.waypoint.stepX } }),
            S: (num, state) => ({ ...state, waypoint: { stepY: state.waypoint.stepY - num, stepX: state.waypoint.stepX } }),
            W: (num, state) => ({ ...state, waypoint: { stepY: state.waypoint.stepY, stepX: state.waypoint.stepX - num } }),
            E: (num, state) => ({ ...state, waypoint: { stepY: state.waypoint.stepY, stepX: state.waypoint.stepX + num } }),
            F: (num, state) => ({ ...state, coord: { x: state.coord.x + num*state.waypoint.stepX, y: state.coord.y + num*state.waypoint.stepY} }),
            R: (num, state) => ({ ...state, waypoint: D11ShipQ2.applyRotation(state.waypoint, "CLOCKWISE", num/90) }),
            L: (num, state) => ({ ...state, waypoint: D11ShipQ2.applyRotation(state.waypoint, "COUNTER_CLOCKWISE", num/90) }),
        })
    }

    private static applyRotation(waypoint: Waypoint, rotationType: RotationType, times: number): Waypoint {
        let result: Waypoint = waypoint;
        for(var i=0; i<times; i++) {
            result = ROTATIONS_TRANSFORMS[rotationType](result);
        }
        return result;
    }
}
