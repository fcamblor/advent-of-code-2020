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
            const matchResult = ticketNums.reduce(({numbersMatching, numbersNotMatching}, num) => {
                for(let i=0; i<this.constraints.length; i++) {
                    if(this.constraints[i].matches(num)) {
                        return { numbersMatching: numbersMatching.concat({ num, matchesWith: this.constraints[i] }), numbersNotMatching };
                    }
                }
                return {numbersMatching, numbersNotMatching: numbersNotMatching.concat(num)};
             }, { numbersMatching: [] as { num: number, matchesWith: D16Constraint }[], numbersNotMatching: [] as number[] });
             return { ticketNums, matchResult };
        });
    }

    public sumOfInvalidNumbers(ticketsStr: string) {
        const result = this.checkTickets(ticketsStr);
        return result.reduce((sumOfInvalidNumbers, checkResult) => {
            return sumOfInvalidNumbers + checkResult.matchResult.numbersNotMatching.reduce((sum, num) => sum+num, 0);
        }, 0);
    }
}
