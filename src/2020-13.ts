

const TIME_OFFSET_CONSTRAINT = "x";
type Line = number;
type RAW_READ_INPUT = (typeof TIME_OFFSET_CONSTRAINT)|string;
type BusLineConstraint = {
    line: Line;
    timeOffsetConstraint: number;
};

export function readBusLinesConstraints(rawConstraint: string) {
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

export function allBusLineConstraintsMatches(timestamp: number, busLinesConstraints: BusLineConstraint[]) {
    // console.log(`Testing timestamp=${timestamp}...`);
    for(let i=0; i<busLinesConstraints.length; i++) {
        if((timestamp + busLinesConstraints[i].timeOffsetConstraint)%busLinesConstraints[i].line !== 0) {
            return { allMatched: false, firstBusLineNotMatching: busLinesConstraints[i] };
        }
    }
    return { allMatched: true };
}

export function findEarliestTimestampMatchingConstraints(busLinesConstraints: BusLineConstraint[], starting: number) {
    const maxLine = Math.max(...busLinesConstraints.map(c => c.line));
    const highestBusLineConstraint = busLinesConstraints.find(blc => blc.line === maxLine)!;

    let startingTimestamp = starting;
    while((startingTimestamp % highestBusLineConstraint.line) !== 0) {
        startingTimestamp++;
    }

    let constraintsMatched = false, timestamp = startingTimestamp - highestBusLineConstraint.timeOffsetConstraint;
    while(!constraintsMatched) {
        let constraintsMatch = allBusLineConstraintsMatches(timestamp, busLinesConstraints);

        constraintsMatched = constraintsMatch.allMatched;
        timestamp += maxLine;
    }

    return timestamp - maxLine;
}

export function findEarliestTimestampFor(rawConstraint: string, starting: number = 0) {
    const busLinesConstraints = readBusLinesConstraints(rawConstraint);
    return findEarliestTimestampMatchingConstraints(busLinesConstraints, starting);
}