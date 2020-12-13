

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
        expectedSimplifiedBusLinesConstraints: [
            {line: 7,  timeOffsetConstraint:0 },
            {line: 13, timeOffsetConstraint:1 },
            {line: 59, timeOffsetConstraint:4 },
            {line: 31, timeOffsetConstraint:6 },
            {line: 19, timeOffsetConstraint:7 },
        ],
        perTimeOffsetSteps: [{
            step: 19 * 7, timeOffset: 7, constraints: [
                {line: 19, timeOffsetConstraint: 7},
                {line: 7,  timeOffsetConstraint:0 },
            ]
        }, {
            step: 59, timeOffset: 4, constraints: [
                {line: 59, timeOffsetConstraint:4 },
            ]
        }, {
            step: 31, timeOffset: 6, constraints: [
                {line: 31, timeOffsetConstraint:6 },
            ]
        }, {
            step: 13, timeOffset: 1, constraints: [
                {line: 13, timeOffsetConstraint: 1},
            ]
        }, {
            step: 7, timeOffset: 0, constraints: [
                {line: 7,  timeOffsetConstraint:0 },
            ]
        }],
        expectedTimestamp: 1068781
    },
    {
        sample: "17,x,13,19",
        expectedConstraints: [
            {line: 17, timeOffsetConstraint:0 },
            {line: 13, timeOffsetConstraint:2 },
            {line: 19, timeOffsetConstraint:3 },
        ],
        expectedSimplifiedBusLinesConstraints: [
            {line: 17, timeOffsetConstraint:0 },
            {line: 13, timeOffsetConstraint:2 },
            {line: 19, timeOffsetConstraint:3 },
        ],
        perTimeOffsetSteps: [{
            step: 19, timeOffset: 3, constraints: [
                {line: 19, timeOffsetConstraint: 3},
            ]
        }, {
            step: 17, timeOffset: 0, constraints: [
                {line: 17, timeOffsetConstraint:0 },
            ]
        }, {
            step: 13, timeOffset: 2, constraints: [
                {line: 13, timeOffsetConstraint:2 },
            ]
        }],
        expectedTimestamp: 3417
    },
    {
        sample: "67,7,59,61",
        expectedConstraints: [
            {line: 67, timeOffsetConstraint:0 },
            {line: 7,  timeOffsetConstraint:1 },
            {line: 59, timeOffsetConstraint:2 },
            {line: 61, timeOffsetConstraint:3 },
        ],
        expectedSimplifiedBusLinesConstraints: [
            {line: 67, timeOffsetConstraint:0 },
            {line: 7,  timeOffsetConstraint:1 },
            {line: 59, timeOffsetConstraint:2 },
            {line: 61, timeOffsetConstraint:3 },
        ],
        perTimeOffsetSteps: [{
            step: 67, timeOffset: 0, constraints: [
                {line: 67, timeOffsetConstraint: 0},
            ]
        }, {
            step: 61, timeOffset: 3, constraints: [
                {line: 61, timeOffsetConstraint:3 },
            ]
        }, {
            step: 59, timeOffset: 2, constraints: [
                {line: 59, timeOffsetConstraint:2 },
            ]
        }, {
            step: 7, timeOffset: 1, constraints: [
                {line: 7,  timeOffsetConstraint:1 },
            ]
        }],
        expectedTimestamp: 754018
    },
    {
        sample: "67,x,7,59,61",
        expectedConstraints: [
            {line: 67, timeOffsetConstraint:0 },
            {line: 7,  timeOffsetConstraint:2 },
            {line: 59, timeOffsetConstraint:3 },
            {line: 61, timeOffsetConstraint:4 },
        ],
        expectedSimplifiedBusLinesConstraints: [
            {line: 67, timeOffsetConstraint:0 },
            {line: 7,  timeOffsetConstraint:2 },
            {line: 59, timeOffsetConstraint:3 },
            {line: 61, timeOffsetConstraint:4 },
        ],
        perTimeOffsetSteps: [{
            step: 67, timeOffset: 0, constraints: [
                {line: 67, timeOffsetConstraint: 0},
            ]
        }, {
            step: 61, timeOffset: 4, constraints: [
                {line: 61, timeOffsetConstraint:4 },
            ]
        }, {
            step: 59, timeOffset: 3, constraints: [
                {line: 59, timeOffsetConstraint:3 },
            ]
        }, {
            step: 7, timeOffset: 2, constraints: [
                {line: 7,  timeOffsetConstraint:2 },
            ]
        }],
        expectedTimestamp: 779210
    },
    {
        sample: "67,7,x,59,61",
        expectedConstraints: [
            {line: 67, timeOffsetConstraint:0 },
            {line: 7,  timeOffsetConstraint:1 },
            {line: 59, timeOffsetConstraint:3 },
            {line: 61, timeOffsetConstraint:4 },
        ],
        expectedSimplifiedBusLinesConstraints: [
            {line: 67, timeOffsetConstraint:0 },
            {line: 7,  timeOffsetConstraint:1 },
            {line: 59, timeOffsetConstraint:3 },
            {line: 61, timeOffsetConstraint:4 },
        ],
        perTimeOffsetSteps: [{
            step: 67, timeOffset: 0, constraints: [
                {line: 67, timeOffsetConstraint: 0},
            ]
        }, {
            step: 61, timeOffset: 4, constraints: [
                {line: 61, timeOffsetConstraint:4 },
            ]
        }, {
            step: 59, timeOffset: 3, constraints: [
                {line: 59, timeOffsetConstraint:3 },
            ]
        }, {
            step: 7, timeOffset: 1, constraints: [
                {line: 7,  timeOffsetConstraint:1 },
            ]
        }],
        expectedTimestamp: 1261476
    },
    {
        sample: "1789,37,47,1889",
        expectedConstraints: [
            {line: 1789, timeOffsetConstraint:0 },
            {line: 37,   timeOffsetConstraint:1 },
            {line: 47,   timeOffsetConstraint:2 },
            {line: 1889, timeOffsetConstraint:3 },
        ],
        expectedSimplifiedBusLinesConstraints: [
            {line: 1789, timeOffsetConstraint:0 },
            {line: 37,   timeOffsetConstraint:1 },
            {line: 47,   timeOffsetConstraint:2 },
            {line: 1889, timeOffsetConstraint:3 },
        ],
        perTimeOffsetSteps: [{
            step: 1889, timeOffset: 3, constraints: [
                {line: 1889, timeOffsetConstraint: 3},
            ]
        }, {
            step: 1789, timeOffset: 0, constraints: [
                {line: 1789, timeOffsetConstraint:0 },
            ]
        }, {
            step: 47, timeOffset: 2, constraints: [
                {line: 47,   timeOffsetConstraint:2 },
            ]
        }, {
            step: 37, timeOffset: 1, constraints: [
                {line: 37,   timeOffsetConstraint:1 },
            ]
        }],
        expectedTimestamp: 1202161486
    },
];

export const Q13_INPUT = {
    sample: `17,x,x,x,x,x,x,x,x,x,x,37,x,x,x,x,x,571,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,13,x,x,x,x,23,x,x,x,x,x,29,x,401,x,x,x,x,x,x,x,x,x,41,x,x,x,x,x,x,x,x,19`,
    expectedConstraints: [
        {line: 17,  timeOffsetConstraint:0 },
        {line: 37,  timeOffsetConstraint:11 },
        {line: 571, timeOffsetConstraint:17 },
        {line: 13,  timeOffsetConstraint:35 },
        {line: 23,  timeOffsetConstraint:40 },
        {line: 29,  timeOffsetConstraint:46 },
        {line: 401, timeOffsetConstraint:48 },
        {line: 41,  timeOffsetConstraint:58 },
        {line: 19,  timeOffsetConstraint:67 },
    ],
    expectedSimplifiedBusLinesConstraints: [
        {line: 17,  timeOffsetConstraint:0 },
        {line: 37,  timeOffsetConstraint:11 },
        {line: 571, timeOffsetConstraint:17 },
        {line: 13,  timeOffsetConstraint:9 },
        {line: 23,  timeOffsetConstraint:17 },
        {line: 29,  timeOffsetConstraint:17 },
        {line: 401, timeOffsetConstraint:48 },
        {line: 41,  timeOffsetConstraint:17 },
        {line: 19,  timeOffsetConstraint:10 },
    ],
    perTimeOffsetSteps: [{
        step: 571 * 23 * 29 * 41 * 17, timeOffset: 17, constraints: [
            {line: 571, timeOffsetConstraint: 17},
            {line: 23, timeOffsetConstraint: 17},
            {line: 29, timeOffsetConstraint: 17},
            {line: 41, timeOffsetConstraint: 17},
            {line: 17, timeOffsetConstraint: 0},
        ]
    }, {
        step: 401 * 37 * 13 * 19, timeOffset: 48, constraints: [
            {line: 401, timeOffsetConstraint:48 },
            {line: 37,  timeOffsetConstraint:11 },
            {line: 13,  timeOffsetConstraint:9 },
            {line: 19,  timeOffsetConstraint:10 },
        ]
    }, {
        step: 37, timeOffset: 11, constraints: [
            {line: 37,  timeOffsetConstraint:11 },
        ]
    }, {
        step: 19, timeOffset: 10, constraints: [
            {line: 19,  timeOffsetConstraint:10 },
        ]
    }, {
        step: 17, timeOffset: 0, constraints: [
            {line: 17,  timeOffsetConstraint:0 },
        ]
    }, {
        step: 13, timeOffset: 9, constraints: [
            {line: 13,  timeOffsetConstraint:9 },
        ]
    }],
    expectedTimestamp: 226845233210288
};

