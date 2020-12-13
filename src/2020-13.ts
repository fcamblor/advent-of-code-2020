

const TIME_OFFSET_CONSTRAINT = "x";
type Line = number;
type RAW_READ_INPUT = (typeof TIME_OFFSET_CONSTRAINT)|string;
type BusLineConstraint = {
    line: Line;
    timeOffset: number;
};

/*
  "7,13,x,x,59,x,31,19"
  Gives : [
        {line: 7,  timeOffset:0 },
        {line: 13, timeOffset:1 },
        {line: 59, timeOffset:4 },
        {line: 31, timeOffset:6 },
        {line: 19, timeOffset:7 },
  ]
 */
function readBusLinesConstraints(rawConstraint: string) {
    const readInputs: RAW_READ_INPUT[] = rawConstraint.split(",") as RAW_READ_INPUT[];
    return readInputs.reduce((busLinesConstraints, readInput, index) => {
        if(readInput === TIME_OFFSET_CONSTRAINT) {
            // Don't do anything
        } else {
            const line: Line = Number(readInput);
            busLinesConstraints.push({ line, timeOffset: index });
        }

        return busLinesConstraints;
    }, [] as BusLineConstraint[]);
}

/*
  "Simplifies" (minimizes timeOffset) based on following rule :
    given a bus constraint like: { line: 19, timeOffset: 67 }
    it means that we need to find T so that "T+67 will be divisible by 19"
    this will be equivalent to : T + (69%19) = T+10 should be divisible by 19 too
    => we can replace/minimize 69 to 10 based on this rule
    (you will understand on next step why this is something which is going to be a game changer)
 */
function minimizeTimeOffsets(busLinesConstraints: BusLineConstraint[]) {
    return busLinesConstraints.map(c => ({...c, timeOffset: (c.timeOffset % c.line)  }));
}

type PerTimeOffsetStep = { timeOffset: number, constraints: BusLineConstraint[], step: number};

/*
  Looking at "common offsets" in bus lines constraints, as those common offsets will allow to increase timestamp shifts
  which will solve the problem quicker.

  For example, let's have following business "simplified" (see previous function) lines constraints :
     [
        {line: 17,  timeOffset:0 },
        {line: 37,  timeOffset:10 },
        {line: 571, timeOffset:17 },
        {line: 13,  timeOffset:9 },
        {line: 23,  timeOffset:17 },
        {line: 29,  timeOffset:17 },
        {line: 401, timeOffset:48 },
        {line: 41,  timeOffset:17 },
        {line: 19,  timeOffset:10 },
    ]

    We can see we have "common" time offsets : 17 and 10
    It means :
    - T+10 will have to be divisible by *both* 37 and 19
    - T+17 will have to be divisible by *both* 571, 23, 29 and 41
    Given that lines are prime numbers already, we can consider that :
    - T+10 will have to be a multiple of 37x39 = 1443
    - T+17 will have to be a multiple of 571x23x29x41 = 14 138 399

    Also, we can see we may have additional optimizations :
    - bus line 50's timeOffset (=17) can be targetted by bus lane's 17 :  (line 17 timeOffset =>) 0 +  (found multiple =>) 1 x 17 = 17
    - bus line 401's timeOffset (=48) can be targetted by bus lane's 13 : (line 13 timeOffset =>) 9 +  (found multiple =>) 3 x 13 = 48
    - bus line 401's timeOffset (=48) can be targetted by bus lane's 19 : (line 19 timeOffset =>) 10 + (found multiple =>) 2 x 19 = 48
    This affects :
    - T+17 multiples : instead of 14 138 399 (see previously), it will be 571x23x29x41x17 = 265 457 329
    - T+48 multiples : instead of 401, it will be 401x13x19 = 99 047


    Result for above input will be : [{
        step: 571 * 23 * 29 * 41 * 17, timeOffset: 17, constraints: [
            {line: 571, timeOffset: 17},
            {line: 23, timeOffset: 17},
            {line: 29, timeOffset: 17},
            {line: 41, timeOffset: 17},
            {line: 17,  timeOffset:0 },
        ]
    }, {
        step: 401 * 13 * 19, timeOffset: 48, constraints: [
            {line: 401, timeOffset: 48},
            {line: 13,  timeOffset:9 },
            {line: 19,  timeOffset:10 },
        ]
    }, {
        step: 37 * 19, timeOffset: 10, constraints: [
            {line: 37, timeOffset: 10},
            {line: 19, timeOffset: 10},
        ]
    }, {
        step: 17, timeOffset: 0, constraints: [
            {line: 17, timeOffset: 0},
        ]
    }, {
        step: 13, timeOffset: 9, constraints: [
            {line: 13, timeOffset: 9},
        ]
    }]

    First result will be the most interesting one, as the algorithm will simply have to check every multiples of 265 457 329
    and look for the first multiple which is dividable by other bus lines' constraints
    This will be ~265M times quickier than iterating over timestamps one by one :-)
 */
export function extractPerTimeOffsetStepsFrom(busLinesConstraints: BusLineConstraint[]) {
    return Object.values(busLinesConstraints.reduce((perTimeOffsetLines, busLineConstraint) => {
        perTimeOffsetLines[busLineConstraint.timeOffset] = perTimeOffsetLines[busLineConstraint.timeOffset] || { constraints: [], step: 1, timeOffset: busLineConstraint.timeOffset };
        perTimeOffsetLines[busLineConstraint.timeOffset].constraints.push(busLineConstraint);
        perTimeOffsetLines[busLineConstraint.timeOffset].step *= busLineConstraint.line;
        return perTimeOffsetLines;
    }, {} as Record<number, PerTimeOffsetStep>)
    // Some additional optimization to increase the step multiplicator if (by chance) we have some bus lines which are
    // a multiple of the perTimeOffsetStep.timeOffset
    ).map(perTimeOffsetStep => {
        busLinesConstraints.forEach(blc => {
            if((blc.timeOffset !== perTimeOffsetStep.timeOffset)
                && (perTimeOffsetStep.timeOffset > blc.timeOffset)
                && ((perTimeOffsetStep.timeOffset - blc.timeOffset) % blc.line) === 0
            ) {
                perTimeOffsetStep.constraints.push(blc);
                perTimeOffsetStep.step *= blc.line;
            }
        });
        return perTimeOffsetStep;
    // for deterministic return (sorting desc by step field)
    }).sort((o1,o2) => o2.step - o1.step);
}

/*
  Returns { allMatched: true }
  if provided timestamp matches every provided busLinesConstraints, I mean :
    (timestamp + busLinesContraints.timeOffset) % busLinesContraints.timeOffset.line === 0
 */
function allBusLineConstraintsMatches(timestamp: number, busLinesConstraints: BusLineConstraint[]) {
    // console.log(`Testing timestamp=${timestamp}...`);
    for(let i=0; i<busLinesConstraints.length; i++) {
        if((timestamp + busLinesConstraints[i].timeOffset)%busLinesConstraints[i].line !== 0) {
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
        timeOffset: blc.timeOffset - highestPerTimeOffsetStep.timeOffset
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

function FIND_EARLIEST_TIMESTAMP_FOR(rawConstraint: string) {
    return findEarliestTimestampFor(rawConstraint).timestamp;
}