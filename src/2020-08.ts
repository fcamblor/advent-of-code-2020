import {extractColumnBasedValues} from "./utils";

type Command = "acc"|"jmp"|"nop";
type Status = "ONGOING"|"INFINITE_LOOP_DETECTED"|"ENDED";
type State = { accumulator: number; currentLine: number; };

const COMMAND_DEFINITIONS: Record<Command, (state: State, context: { param: number; }) => State> = {
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

type ExecutionStatus = {
    status: Status;
    state: State;
};

export class InstructionExecutor {
    private static COMMAND_REPLACEMENTS: Record<Command, Command|undefined> = {
        "nop": "jmp",
        "jmp": "nop",
        "acc": undefined
    };

    private instructions: Instruction[];
    constructor(private readonly initialInstructions: Instruction[]) {
        this.instructions = [ ...initialInstructions ];
    }

    public execute(): ExecutionStatus {
        let state: State = { accumulator: 0, currentLine: 0 };
        let programStatus: Status = "ONGOING";

        const executedLines: number[] = [];
        while(programStatus === "ONGOING") {
            executedLines.push(state.currentLine);

            const instr = this.instructions[state.currentLine];
            state = COMMAND_DEFINITIONS[instr.command].call(null, state, { param: instr.param });

            if(executedLines.indexOf(state.currentLine) !== -1) {
                programStatus = "INFINITE_LOOP_DETECTED";
            } else if(state.currentLine === this.instructions.length) {
                programStatus = "ENDED";
            } else {
                programStatus = "ONGOING";
            }
        }

        return { state, status: programStatus };
    }

    static createFrom(rawInstructions: string[][]) {
        const instructions: Instruction[] = rawInstructions.map(([command, paramStr]) => {
            return { command: command as Command, param: Number(paramStr) };
        })
        return new InstructionExecutor(instructions);
    }

    private changeInstructionAt(lineNumber: number): boolean {
        this.instructions = [ ...this.initialInstructions ];
        const instr = this.instructions[lineNumber];

        const replacement = InstructionExecutor.COMMAND_REPLACEMENTS[instr.command];
        if(replacement) {
            this.instructions[lineNumber] = { ...this.instructions[lineNumber], command: replacement };
            return true;
        } else {
            return false;
        }
    }

    tryExecuteByFixingInstructions(): ExecutionStatus {
        for (let i = 0; i < this.initialInstructions.length; i++) {
            if(this.changeInstructionAt(i)) {
                let result = this.execute();
                if(result.status === "ENDED") {
                    return result;
                }
            }
        }

        throw new Error("We were unable to fix the program !");
    }
}


function EXECUTE_D8_PROGRAM(instructions: GSheetCells) {
    return InstructionExecutor.createFrom(instructions).execute().state.accumulator;
}

function FIX_THEN_EXECUTE_D8_PROGRAM(initialInstructions: GSheetCells) {
    return InstructionExecutor.createFrom(initialInstructions).tryExecuteByFixingInstructions().state.accumulator;
}