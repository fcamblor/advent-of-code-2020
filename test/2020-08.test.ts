import {InstructionExecutor} from "../src/2020-08";


test('should Q1 execution perform correctly', () => {
    const instructions = [
        ["nop", "+0" ],
        ["acc", "+1" ],
        ["jmp", "+4" ],
        ["acc", "+3" ],
        ["jmp", "-3" ],
        ["acc", "-99" ],
        ["acc", "+1" ],
        ["jmp", "-4" ],
        ["acc", "+6" ],
    ];
    expect(InstructionExecutor.createFrom(instructions).execute().state.accumulator).toEqual(5);
})
