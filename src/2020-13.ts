

const TIME_OFFSET_CONSTRAINT = "x";
type Line = number;
type RAW_READ_INPUT = (typeof TIME_OFFSET_CONSTRAINT)|string;
type BusLineConstraint = {
    line: Line;
    timeOffsetConstraint: number;
};

/*
  "7,13,x,x,59,x,31,19"
  Gives : [
        {line: 7,  timeOffsetConstraint:0 },
        {line: 13, timeOffsetConstraint:1 },
        {line: 59, timeOffsetConstraint:4 },
        {line: 31, timeOffsetConstraint:6 },
        {line: 19, timeOffsetConstraint:7 },
  ]
 */
function readBusLinesConstraints(rawConstraint: string) {
    const readInputs: RAW_READ_INPUT[] = rawConstraint.split(",") as RAW_READ_INPUT[];
    return readInputs.reduce((busLinesConstraints, readInput, index) => {
        if(readInput === TIME_OFFSET_CONSTRAINT) {
            // Don't do anything
        } else {
            const line: Line = Number(readInput);
            busLinesConstraints.push({ line, timeOffsetConstraint: index });
        }

        return busLinesConstraints;
    }, [] as BusLineConstraint[]);
}

/*
  "Simplifies" (minimizes timeOffsetConstraint) based on following rule :
    following rule: { line: 19, timeOffsetConstraint: 67 }
    means that we need to find T so that "T+67 will be divisible by 19"
    .. this will be equivalent to T + (69%19) = T+10 will be divisible by 19 too.
    => we can replace/minimize 69 to 10 based on this rule
 */
function minimizeTimeOffsets(busLinesConstraints: BusLineConstraint[]) {
    return busLinesConstraints.map(c => ({...c, timeOffsetConstraint: (c.timeOffsetConstraint%c.line)  }));
}

type PerTimeOffsetStep = { timeOffset: number, constraints: BusLineConstraint[], step: number};

/*
  Looking at "common offsets" in bus lines constraints, as those common offsets will allow to increase timestamp shifts
  which will solve the problem quickier
  For example, let's have following business lines constraints : [
        {line: 17,  timeOffsetConstraint:0 },
        {line: 37,  timeOffsetConstraint:10 },
        {line: 571, timeOffsetConstraint:17 },
        {line: 13,  timeOffsetConstraint:9 },
        {line: 23,  timeOffsetConstraint:17 },
        {line: 29,  timeOffsetConstraint:17 },
        {line: 401, timeOffsetConstraint:48 },
        {line: 41,  timeOffsetConstraint:17 },
        {line: 19,  timeOffsetConstraint:10 },
    ]

    We can see we have "common" time offsets (17 and 10)
    It means that :
    - T+10 will have to be divisible by *both* 37 and 19
    - T+17 will have to be divisible by *both* 571, 23, 29 and 41
    Given that lines are prime numbers already, we can consider that :
    - T+10 will have to be a multiple of 37*39 = 1443
    - T+17 will have to be a multiple of 571*23*29*41 = 14 138 399

    Result for above input will be : [{
        step: 571 * 23 * 29 * 41, timeOffset: 17, constraints: [
            {line: 571, timeOffsetConstraint: 17},
            {line: 23, timeOffsetConstraint: 17},
            {line: 29, timeOffsetConstraint: 17},
            {line: 41, timeOffsetConstraint: 17},
        ]
    }, {
        step: 37 * 19, timeOffset: 10, constraints: [
            {line: 37, timeOffsetConstraint: 10},
            {line: 19, timeOffsetConstraint: 10},
        ]
    }, {
        step: 401, timeOffset: 48, constraints: [
            {line: 401, timeOffsetConstraint: 48},
        ]
    }, {
        step: 17, timeOffset: 0, constraints: [
            {line: 17, timeOffsetConstraint: 0},
        ]
    }, {
        step: 13, timeOffset: 9, constraints: [
            {line: 13, timeOffsetConstraint: 9},
        ]
    }]

    Latest case will be the most interesting one, as the solution will simply to check every multiples of 14 138 399
    and look for the first multiple which is dividable by other bus lines constraints
    This will be 14M times quickier than iterating over timestamps one by one :-)
 */
export function extractPerTimeOffsetStepsFrom(busLinesConstraints: BusLineConstraint[]) {
    return Object.values(busLinesConstraints.reduce((perTimeOffsetLines, busLineConstraint) => {
        perTimeOffsetLines[busLineConstraint.timeOffsetConstraint] = perTimeOffsetLines[busLineConstraint.timeOffsetConstraint] || { constraints: [], step: 1, timeOffset: busLineConstraint.timeOffsetConstraint };
        perTimeOffsetLines[busLineConstraint.timeOffsetConstraint].constraints.push(busLineConstraint);
        perTimeOffsetLines[busLineConstraint.timeOffsetConstraint].step *= busLineConstraint.line;
        return perTimeOffsetLines;
    }, {} as Record<number, PerTimeOffsetStep>)
    // for deterministic return (sorting desc by step field)
    ).sort((o1,o2) => o2.step - o1.step);
}

/*
  Returns { allMatched: true }
  if provided timestamp matches every provided busLinesConstraints, I mean :
    (timestamp + busLinesContraints.timeOffsetConstraint) % busLinesContraints.timeOffsetConstraint.line === 0
 */
function allBusLineConstraintsMatches(timestamp: number, busLinesConstraints: BusLineConstraint[]) {
    // console.log(`Testing timestamp=${timestamp}...`);
    for(let i=0; i<busLinesConstraints.length; i++) {
        if((timestamp + busLinesConstraints[i].timeOffsetConstraint)%busLinesConstraints[i].line !== 0) {
            return { allMatched: false, firstBusLineNotMatching: busLinesConstraints[i] };
        }
    }
    return { allMatched: true };
}

/*
  Looking for timestamp candidates, using highestPerTimeOffsetStep.step
  and allBusLineConstraintsMatches impl
 */
function findEarliestTimestampMatchingConstraints(busLinesConstraints: BusLineConstraint[], highestPerTimeOffsetStep: PerTimeOffsetStep) {

    const shiftedBusLinesConstraints = busLinesConstraints.map(blc => ({
        line: blc.line,
        timeOffsetConstraint: blc.timeOffsetConstraint - highestPerTimeOffsetStep.timeOffset
    }));

    // For debug purposes
    let logShown = false,
        start = Date.now(),
        tsPowerOfTenJumpsToShowLog = 10,
        tsJumpToShowLog = Math.pow(10, tsPowerOfTenJumpsToShowLog); // aka 10000000000

    // I tested 10^16 and they told me it was too high.. that's useful to avoid infinite loop due to bugs
    const MAX_TIMESTAMP = Math.pow(10, 16);

    let constraintsMatched = false,
        candidateTimestamp = highestPerTimeOffsetStep.step;
    while(!constraintsMatched && candidateTimestamp < MAX_TIMESTAMP) {
        if(!logShown && candidateTimestamp > tsJumpToShowLog) {
            console.log(`It took ${Date.now() - start}ms to reach 10^${tsPowerOfTenJumpsToShowLog}`);
            tsJumpToShowLog *= 10;
            tsPowerOfTenJumpsToShowLog++;
        }

        let constraintsMatch = allBusLineConstraintsMatches(candidateTimestamp, shiftedBusLinesConstraints);
        constraintsMatched = constraintsMatch.allMatched;

        candidateTimestamp += highestPerTimeOffsetStep.step;
    }

    if(candidateTimestamp >= MAX_TIMESTAMP) {
        return undefined;
    } else {
        return candidateTimestamp
            // Because we want to rollback last loop step increment
            - highestPerTimeOffsetStep.step
            // Because of shiftedBusLinesConstraints in the beginning : we tried finding a candidate timestamp
            // with a highestPerTimeOffsetStep.timeOffset shift
            // Once we found the solution, we should subtract this timeoffset shift
            - highestPerTimeOffsetStep.timeOffset;
    }
}

export function findEarliestTimestampFor(rawConstraint: string) {
    const busLinesConstraints = readBusLinesConstraints(rawConstraint);

    const simplifiedBusLinesConstraints = minimizeTimeOffsets(busLinesConstraints);

    const perTimeOffsetSteps = extractPerTimeOffsetStepsFrom(simplifiedBusLinesConstraints);

    return {
        busLinesConstraints,
        simplifiedBusLinesConstraints,
        perTimeOffsetSteps,
        timestamp: findEarliestTimestampMatchingConstraints(simplifiedBusLinesConstraints, perTimeOffsetSteps[0])
    };
}