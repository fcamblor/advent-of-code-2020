import {bitsToNumber, cartesian, combine, numberToBits, padLeft} from "./utils";


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

export abstract class D14Mask extends D14Command {
    constructor(public readonly values: MASK_VALUE[]) {
        super();
    }

    runOn(state: D14State): D14State {
        return {...state, mask: this};
    }

    abstract applyOn(value: number, memoryOffset: number, state: D14State): D14State;
}

export abstract class D14Mem extends D14Command {
    constructor(public readonly offset: number, public readonly bitValues: BIT_VALUE[], public readonly value: number) {
        super();
    }
}

export class D14Q1Mask extends D14Mask {
    constructor(public readonly values: MASK_VALUE[]) {
        super(values);
    }
    applyOn(value: number, memoryOffset: number, state: D14State): D14State {
        const bitValues = padLeft(numberToBits(value), MASK_SIZE, "0");
        const maskedValue = bitsToNumber(combine(this.values, bitValues).map(([ maskValue, bitValue ]) => {
            return maskValue==="X"?bitValue:maskValue;
        }));
        return {...state, memory: {...state.memory, [memoryOffset]: maskedValue } };
    }
}

export class D14Q2Mask extends D14Mask {
    constructor(public readonly values: MASK_VALUE[]) {
        super(values);
    }
    applyOn(value: number, memoryOffset: number, state: D14State): D14State {
        const memoryOffsetAsBits = padLeft(numberToBits(memoryOffset), MASK_SIZE, "0");

        const { floatingOffsets, maskedMemoryOffset } = combine(this.values, memoryOffsetAsBits)
            .reduce(({ floatingOffsets, maskedMemoryOffset }, [ maskValue, bitValue ], index) => {
                return {
                    floatingOffsets: floatingOffsets.concat(maskValue==="X"?[index]:[]),
                    maskedMemoryOffset: maskedMemoryOffset.concat((["X","1"].includes(maskValue)?maskValue:bitValue) as MASK_VALUE)
                };
            }, { floatingOffsets: [] as number[], maskedMemoryOffset: [] as MASK_VALUE[] });

        const memoryOffsetCombinations: {memoryOffset: number, value: BIT_VALUE}[][] = floatingOffsets.map(memoryOffset => [{ memoryOffset, value: "0" }, { memoryOffset, value: "1" }]);
        const possibleMemoryOffsets = cartesian(...memoryOffsetCombinations).map((memoryOffsetCombinations: {memoryOffset: number, value: BIT_VALUE}[]) => {
            const possibleMemoryOffset = memoryOffsetCombinations.reduce((buildingBits: MASK_VALUE[], memoryOffsetCombination) => {
                buildingBits[memoryOffsetCombination.memoryOffset] = memoryOffsetCombination.value;
                return buildingBits;
            }, [...maskedMemoryOffset]);
            return possibleMemoryOffset as BIT_VALUE[];
        });

        possibleMemoryOffsets.forEach(possibleMemoryOffset => {
            state.memory[bitsToNumber(possibleMemoryOffset)] = value;
        });

        return state;
    }
}

export class D14MQ1Mem extends D14Mem {
    constructor(offset: number, bitValues: BIT_VALUE[]|undefined, value: number|undefined) {
        super(
            offset,
            bitValues || padLeft(numberToBits(value!), MASK_SIZE, "0"),
            value===undefined?bitsToNumber(bitValues!):value
        );
    }

    runOn(state: D14State): D14State {
        if(state.mask === undefined) {
            throw new Error("No mask defined !");
        }

        return state.mask.applyOn(this.value, this.offset, state);
    }
}


export function q14Read(
    str: string, memType: "bits"|"number",
    maskConstruct: (maskValues: MASK_VALUE[]) => D14Mask = (values) => new D14Q1Mask(values),
    memConstruct: (offset: number, bitValues: BIT_VALUE[]|undefined, value: number|undefined) => D14MQ1Mem = (offset, bitValues, value) => new D14MQ1Mem(offset, bitValues, value)
): D14Command[] {
    return str.split("\n").map(line => {
        if(line.substr(0, "mask".length) === "mask") {
            return maskConstruct(line.match(/^mask = ([01X]{36})$/)![1].split("") as MASK_VALUE[]);
        } else if(memType==="bits" && line.substr(0, "mem".length) === "mem") {
            return memConstruct(Number(line.match(/^mem\[([0-9]+)\].+$/)![1]),
                line.match(/^mem\[[0-9]+\] = ([01]+)$/)![1].split("") as BIT_VALUE[], undefined);
        } else if(memType==="number" && line.substr(0, "mem".length) === "mem") {
            return memConstruct(Number(line.match(/^mem\[([0-9]+)\].+$/)![1]),
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