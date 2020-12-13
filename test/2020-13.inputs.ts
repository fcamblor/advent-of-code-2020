

export const Q2_SAMPLES = [
    {
        sample: "7,13,x,x,59,x,31,19",
        expectedConstraints: [
            {line: 7,  timeOffsetConstraint:0 },
            {line: 13, timeOffsetConstraint:1 },
            {line: 59, timeOffsetConstraint:4 },
            {line: 31, timeOffsetConstraint:6 },
            {line: 19, timeOffsetConstraint:7 },
        ],
        expected: 1068781
    },
    {
        sample: "17,x,13,19",
        expectedConstraints: [
            {line: 17, timeOffsetConstraint:0 },
            {line: 13, timeOffsetConstraint:2 },
            {line: 19, timeOffsetConstraint:3 },
        ],
        expected: 3417
    },
    {
        sample: "67,7,59,61",
        expectedConstraints: [
            {line: 67, timeOffsetConstraint:0 },
            {line: 7,  timeOffsetConstraint:1 },
            {line: 59, timeOffsetConstraint:2 },
            {line: 61, timeOffsetConstraint:3 },
        ],
        expected: 754018
    },
    {
        sample: "67,x,7,59,61",
        expectedConstraints: [
            {line: 67, timeOffsetConstraint:0 },
            {line: 7,  timeOffsetConstraint:2 },
            {line: 59, timeOffsetConstraint:3 },
            {line: 61, timeOffsetConstraint:4 },
        ],
        expected: 779210
    },
    {
        sample: "67,7,x,59,61",
        expectedConstraints: [
            {line: 67, timeOffsetConstraint:0 },
            {line: 7,  timeOffsetConstraint:1 },
            {line: 59, timeOffsetConstraint:3 },
            {line: 61, timeOffsetConstraint:4 },
        ],
        expected: 1261476
    },
    {
        sample: "1789,37,47,1889",
        expectedConstraints: [
            {line: 1789, timeOffsetConstraint:0 },
            {line: 37,   timeOffsetConstraint:1 },
            {line: 47,   timeOffsetConstraint:2 },
            {line: 1889, timeOffsetConstraint:3 },
        ],
        expected: 1202161486
    },
];

export const Q13_INPUT = `
17,x,x,x,x,x,x,x,x,x,x,37,x,x,x,x,x,571,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,13,x,x,x,x,23,x,x,x,x,x,29,x,401,x,x,x,x,x,x,x,x,x,41,x,x,x,x,x,x,x,x,19
`.trim();