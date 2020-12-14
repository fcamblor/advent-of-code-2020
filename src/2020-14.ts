import {bitToNumber, numberToBits, padLeft} from "./utils";


const OVERWRITE_WITH_1 = "1";
const OVERWRITE_WITH_0 = "0";
const KEEP = "X";

const MASK_SIZE = 36;

export type MASK_VALUE = (typeof OVERWRITE_WITH_0)|(typeof OVERWRITE_WITH_1)|(typeof KEEP);
export type BIT_VALUE = "0"|"1";

type D14State = {
    mask: D14Mask|undefined;
    memory: Record<number, number>;
};

abstract class D14Command {
    abstract runOn(state: D14State): D14State;
}

export class D14Mask extends D14Command {
    constructor(public readonly values: MASK_VALUE[]) {
        super();
    }
    runOn(state: D14State): D14State {
        return {...state, mask: this };
    }
    applyOn(bitValues: BIT_VALUE[]): number {
        return bitValues.reverse().reduce((sum, bitValue, index) => {
            let bit: 0|1;
            if(this.values[MASK_SIZE - 1 - index] === "X") {
                bit = Number(bitValue) as 0|1;
            } else {
                bit = Number(this.values[MASK_SIZE - 1 - index]) as 0|1;
            }
            const val = (bit===0)?0:Math.pow(2, index);
            return sum + val;
        }, 0);
    }
}
export class D14Mem extends D14Command {
    public readonly value: number;
    public readonly bitValues: BIT_VALUE[];
    constructor(public readonly offset: number, bitValues: BIT_VALUE[]|undefined, value: number|undefined) {
        super();
        this.bitValues = bitValues || padLeft(numberToBits(value!), MASK_SIZE, "0");
        this.value = value===undefined?bitToNumber(bitValues!):value;
    }

    runOn(state: D14State): D14State {
        if(state.mask === undefined) {
            throw new Error("No mask defined !");
        }

        const maskedValue = state.mask.applyOn(this.bitValues);
        return {...state, memory: {...state.memory, [this.offset]: maskedValue } };
    }
}


export function q14Read(str: string, memType: "bits"|"number"): D14Command[] {
    return str.split("\n").map(line => {
        if(line.substr(0, "mask".length) === "mask") {
            return new D14Mask(line.match(/^mask = ([01X]{36})$/)![1].split("") as MASK_VALUE[])
        } else if(memType==="bits" && line.substr(0, "mem".length) === "mem") {
            return new D14Mem(Number(line.match(/^mem\[([0-9]+)\].+$/)![1]),
                line.match(/^mem\[[0-9]+\] = ([01]+)$/)![1].split("") as BIT_VALUE[], undefined);
        } else if(memType==="number" && line.substr(0, "mem".length) === "mem") {
            return new D14Mem(Number(line.match(/^mem\[([0-9]+)\].+$/)![1]),
                undefined, Number(line.match(/^mem\[[0-9]+\] = ([0-9]+)$/)![1]))
        } else {
            throw new Error(`Not able to parse input : ${line}`);
        }
    });
}

export function totalMemoryOf(state: D14State) {
    return Object.values(state.memory).reduce((sum, value) => sum+value, 0);
}

export function q14Solve(commands: D14Command[]) {
    return commands.reduce((state, command) => {
        return command.runOn(state);
    }, { mask: undefined, memory: {} } as D14State)
}