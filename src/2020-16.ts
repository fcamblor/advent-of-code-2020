import {ensureArraysHaveSameLength, reduceRange} from "./utils";
import {D16_INPUTS} from "../test/2020-16.inputs";


type MinMaxConstraint = { min: number; max: number; };

export class D16Constraint {
    constructor(public readonly name: string, public readonly minMaxConstraints: MinMaxConstraint[]) {
    }

    public matches(num: number) {
        for(let i=0; i<this.minMaxConstraints.length; i++) {
            if(num >= this.minMaxConstraints[i].min && num <= this.minMaxConstraints[i].max) {
                return true;
            }
        }
        return false;
    }

    public static createFrom(str: string) {
        return str.split("\n").map(line => {
            const match = line.match(/^([a-zA-Z\s]+): ([0-9]+)-([0-9]+) or ([0-9]+)-([0-9]+)+$/);
            const [ _, name, min0, max0, min1, max1 ] = [...match!];
            return new D16Constraint(name, [{min: Number(min0), max: Number(max0)}, {min: Number(min1), max: Number(max1)}]);
        })
    }
}

export class D16TicketChecker {
    constructor(public readonly constraints: D16Constraint[]) {
    }

    public checkTickets(ticketsStr: string) {
        return ticketsStr.split("\n").map(ticketsStr => {
            let ticketNums = ticketsStr.split(",").map(Number);
            const matchResult = ticketNums.reduce(({numbersMatching, numbersNotMatching}, num, numIndex) => {
                const matchingConstraints = this.constraints.filter(constraint => constraint.matches(num));
                if(matchingConstraints.length) {
                    return { numbersMatching: numbersMatching.concat({ numIndex, num, matchesWith: matchingConstraints }), numbersNotMatching };
                } else {
                    return {numbersMatching, numbersNotMatching: numbersNotMatching.concat(num)};
                }
             }, { numbersMatching: [] as { numIndex: number, num: number, matchesWith: D16Constraint[] }[], numbersNotMatching: [] as number[] });
             return { ticketNums, matchResult };
        });
    }

    public filterValidTickets(ticketsStr: string) {
        return this.checkTickets(ticketsStr)
            .filter(result => result.matchResult.numbersNotMatching.length===0);
    }

    public guessConstraintsTicketIndexes(validTicketMatches: { ticketNums: number[], matchResult: { numbersMatching: { numIndex: number, num: number, matchesWith: D16Constraint[] }[], numbersNotMatching: number[] } }[]) {
        ensureArraysHaveSameLength(validTicketMatches.map(m => m.ticketNums));

        const perColIdxMatchingConstraints = validTicketMatches[0].ticketNums.map((_, numColIdx) => {
            const constraintsMatchingAllLines = this.constraints.filter(constraint => {
                for(let matchRowIdx=0; matchRowIdx<validTicketMatches.length; matchRowIdx++) {
                    if(!validTicketMatches[matchRowIdx].matchResult.numbersMatching.find(nm => nm.numIndex === numColIdx)!.matchesWith.map(c => c.name).includes(constraint.name)) {
                        return false;
                    }
                }
                return true;
            })
            return {numColIdx, constraintsMatchingAllLines};
        });

        perColIdxMatchingConstraints.sort((c1,c2) => c1.constraintsMatchingAllLines.length - c2.constraintsMatchingAllLines.length);

        for(let i=0; i<perColIdxMatchingConstraints.length; i++) {
            let perColIdxMatchingConstraint = perColIdxMatchingConstraints[i];
            if(perColIdxMatchingConstraint.constraintsMatchingAllLines.length > 1) {
                throw new Error("More than 1 possible constrsaint detected ! That's unexpected !");
            }

            // Removing all constraints
            for(var j=i+1; j<perColIdxMatchingConstraints.length; j++) {
                perColIdxMatchingConstraints[j].constraintsMatchingAllLines = perColIdxMatchingConstraints[j].constraintsMatchingAllLines.filter(c => c.name !== perColIdxMatchingConstraint.constraintsMatchingAllLines[0].name);
            }
        }

        return perColIdxMatchingConstraints.map(c => ({ numColIdx: c.numColIdx, constraint: c.constraintsMatchingAllLines[0] })).sort((c1, c2) => c1.numColIdx - c2.numColIdx);
    }

    public sumOfInvalidNumbers(ticketsStr: string) {
        const result = this.checkTickets(ticketsStr);
        return result.reduce((sumOfInvalidNumbers, checkResult) => {
            return sumOfInvalidNumbers + checkResult.matchResult.numbersNotMatching.reduce((sum, num) => sum+num, 0);
        }, 0);
    }
}

export class D16TicketValuesExtractor {
    constructor(public readonly constraintIndexes: {numColIdx: number, constraint: D16Constraint}[]) {}

    readRawTicket(rawTicket: string): Record<string, number> {
        let ticketNumbers = rawTicket.split(",").map(Number);
        return this.constraintIndexes.reduce((ticket, constraintIndex) => {
            ticket[constraintIndex.constraint.name] = ticketNumbers[constraintIndex.numColIdx];
            return ticket;
        }, {} as Record<string, number>);
    }
}

export function extractConstraintIndexes({rawConstraints, myRawTicket, rawNearbyTickets}: { rawConstraints: string, myRawTicket: string, rawNearbyTickets: string}) {
    let constraints = D16Constraint.createFrom(rawConstraints);
    let ticketChecker = new D16TicketChecker(constraints);
    const validTicketsMatches = ticketChecker.filterValidTickets(rawNearbyTickets+"\n"+myRawTicket);
    return ticketChecker.guessConstraintsTicketIndexes(validTicketsMatches);
}

export function calculateD16Q2(ticket: Record<string, number>, fieldNameFilter: string) {
    return Object.keys(ticket).filter(k => k.indexOf(fieldNameFilter) !== -1).reduce((result, key) => result * ticket[key], 1);
}