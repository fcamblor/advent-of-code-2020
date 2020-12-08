import {extractColumnBasedValues} from "./utils";

type Command = "acc"|"jmp"|"nop";
type Status = "ONGOING"|"INFINITE_LOOP_DETECTED";
type State = { accumulator: number; currentLine: number; };

type CommandDefinition = {
    [command in Command]: (state: State, context: { param: number; }) => State;
}

const COMMAND_DEFINITIONS: CommandDefinition = {
    acc: (state, context) => ({
        ...state,
        accumulator: state.accumulator + context.param,
        currentLine: state.currentLine + 1
    }),
    jmp: (state, context) => ({
        ...state,
        currentLine: state.currentLine + context.param
    }),
    nop: (state, context) => ({
        ...state,
        currentLine: state.currentLine + 1
    })
};

type Instruction = {
    param: number;
    command: Command;
}

export class InstructionExecutor {
    constructor(private instructions: Instruction[]) {
    }

    public execute(): { status: Status, state: State } {
        let state: State = { accumulator: 0, currentLine: 0 };
        let programStatus: Status = "ONGOING";

        const executedLines: number[] = [];
        while(programStatus === "ONGOING") {
            executedLines.push(state.currentLine);

            const instr = this.instructions[state.currentLine];
            state = COMMAND_DEFINITIONS[instr.command].call(null, state, { param: instr.param });

            programStatus = (executedLines.indexOf(state.currentLine) !== -1)?"INFINITE_LOOP_DETECTED":"ONGOING";
        }

        return { state, status: programStatus };
    }

    static createFrom(rawInstructions: string[][]) {
        const instructions: Instruction[] = rawInstructions.map(([command, paramStr]) => {
            return { command: command as Command, param: Number(paramStr) };
        })
        return new InstructionExecutor(instructions);
    }
}


function EXECUTE_D8_PROGRAM(instructions: GSheetCells) {
    return InstructionExecutor.createFrom(instructions).execute().state.accumulator;
}

