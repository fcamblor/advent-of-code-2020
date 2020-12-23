import {AoCLogger, reduceTimes} from "./utils";

export class D23Puzzle {
    public crabValue: number
    public cups: number[];
    private maxCupValue: number;
    private moveCount: number;
    public logger: AoCLogger;

    constructor(str: string) {
        this.cups = str.split("").map(Number);
        this.crabValue = this.cups[0];
        this.maxCupValue = Math.max(...this.cups);
        this.moveCount = 0;
        this.logger = new AoCLogger();
    }

    move(): this {
        this.moveCount++;

        this.logger.append(`-- move ${this.moveCount} --`)
        this.logger.append(`cups: (${this.cups[0]}) ${this.cups.slice(1).join(" ")}`)

        const splicedCups = this.cups.splice(1, 3);
        this.logger.append(`pick up: ${splicedCups.join(", ")}`);

        let destinationCup = (this.crabValue + (this.maxCupValue+1) -1)%(this.maxCupValue+1);
        while(this.cups.indexOf(destinationCup) === -1) {
            destinationCup = (destinationCup + (this.maxCupValue+1) -1)%(this.maxCupValue+1);
        }
        this.logger.append(`destination: ${destinationCup}`);
        this.logger.newLine();

        let destinationCupIndex = this.cups.indexOf(destinationCup);
        this.cups.splice(destinationCupIndex+1, 0, ...splicedCups);

        this.crabValue = this.cups[1];
        this.cups = this.rollCupsToHaveValueAtStartingIndex(this.crabValue);
        return this;
    }

    moveTimes(times: number): this {
        reduceTimes(times, () => this.move(), undefined);
        return this;
    }

    currentCode(): string {
        const cups = this.rollCupsToHaveValueAtStartingIndex(1);
        cups.shift();
        return cups.join("");
    }

    private rollCupsToHaveValueAtStartingIndex(value: number) {
        const valueIndex = this.cups.indexOf(value);
        const valuesBefore = this.cups.slice(0, valueIndex);
        const valuesAfter = this.cups.slice(valueIndex+1);
        return [ value, ...valuesAfter, ...valuesBefore ];
    }
}
