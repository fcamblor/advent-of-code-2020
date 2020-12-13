

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
    console.log(`Testing timestamp=${timestamp}...`);
    return busLinesConstraints.reduce(({ allMatched: previousAllMatched, matchedBusLines, unmatchedBusLines }, busLineConstraint) => {
        let allMatched = previousAllMatched;
        if((timestamp + busLineConstraint.timeOffsetConstraint)%busLineConstraint.line === 0) {
            matchedBusLines.push(busLineConstraint.line);
        } else {
            unmatchedBusLines.push(busLineConstraint.line);
            allMatched = false;
        }

        return { allMatched, matchedBusLines, unmatchedBusLines };
    }, { allMatched: true, matchedBusLines: [] as Line[], unmatchedBusLines: [] as Line[] })
}

export function findEarliestTimestampMatchingConstraints(busLinesConstraints: BusLineConstraint[]) {
    const maxLine = Math.max(...busLinesConstraints.map(c => c.line));
    const highestBusLineConstraint = busLinesConstraints.find(blc => blc.line === maxLine)!;

    let constraintsMatched = false, timestamp = highestBusLineConstraint.line - highestBusLineConstraint.timeOffsetConstraint;
    while(!constraintsMatched) {
        let constraintsMatch = allBusLineConstraintsMatches(timestamp, busLinesConstraints);

        constraintsMatched = constraintsMatch.allMatched;
        timestamp += maxLine;
    }

    return timestamp - maxLine;
}

export function findEarliestTimestampFor(rawConstraint: string) {
    const busLinesConstraints = readBusLinesConstraints(rawConstraint);
    return findEarliestTimestampMatchingConstraints(busLinesConstraints);
}