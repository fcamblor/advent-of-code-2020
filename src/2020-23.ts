import {AoCLogger} from "./utils";

export class D23Puzzle {
    private moveCount: number;
    private crabCup: number;
    private maxCup: number;
    private nextCupByCupValue: Map<number, number>;

    private logger: AoCLogger;

    constructor(str: string, logEnabled: boolean = true) {
        this.nextCupByCupValue = new Map<number, number>();

        const cups = str.split("").map(Number);
        cups.forEach((cup, idx, cups) => {
            this.nextCupByCupValue.set(cup, cups[(idx+1)%cups.length]);
        })

        this.crabCup = cups[0];
        this.maxCup = Math.max(...cups);

        this.moveCount = 0;

        this.logger = new AoCLogger();
        if(!logEnabled) {
            this.logger.disable();
        }
    }

    move(): this {
        this.moveCount++;

        this.logger.appendIfEnabled(() => `-- move ${this.moveCount} --`)
        this.logger.appendIfEnabled(() => {
            const cups = this.listCupsFrom(this.crabCup);
            return `cups: (${cups[0]}) ${cups.slice(1).join(" ")}`
        })

        const firstPick = this.nextCupByCupValue.get(this.crabCup)!;
        const secondPick = this.nextCupByCupValue.get(firstPick)!;
        const thirdPick = this.nextCupByCupValue.get(secondPick)!;

        // This removes the 3 cups above by undirecting current crab cup to cup aimed by thirdPick
        this.nextCupByCupValue.set(this.crabCup, this.nextCupByCupValue.get(thirdPick)!);

        const removedCups = [ firstPick, secondPick, thirdPick ];

        this.logger.appendIfEnabled(() => `pick up: ${removedCups.join(", ")}`);

        let destinationCup = this.crabCup;
        do {
            destinationCup--;
            if(destinationCup === 0){
                destinationCup = this.maxCup;
            }
        }while(removedCups.includes(destinationCup));

        this.logger.appendIfEnabled(() => `destination: ${destinationCup}`);
        this.logger.newLine();

        const actualDestinationNextCup = this.nextCupByCupValue.get(destinationCup)!;

        // Re-integrating the 3 removed cups after destinationCup
        this.nextCupByCupValue.set(destinationCup, firstPick);
        this.nextCupByCupValue.set(thirdPick, actualDestinationNextCup);

        // Moving crabcup forward
        this.crabCup = this.nextCupByCupValue.get(this.crabCup)!;

        this.logger.printAndFlush();

        return this;
    }

    moveTimes(times: number): this {
        for(let i=0; i<times; i++) {
            this.move();
        }
        return this;
    }

    listCupsFrom(startingCup: number) {
        const cups = [ startingCup ];
        let currentCup = this.nextCupByCupValue.get(startingCup)!;
        while(currentCup !== startingCup) {
            cups.push(currentCup);
            currentCup = this.nextCupByCupValue.get(currentCup)!;
        }
        return cups;
    }

    currentCode(): string {
        const cups = this.listCupsFrom(1);
        cups.shift();
        return cups.join("");
    }

    appendNumbersToCups(from: number, to: number): this {
        const cups = this.listCupsFrom(this.crabCup);
        this.nextCupByCupValue.set(cups[cups.length-1], from);
        for(let i=from; i<to; i++) {
            this.nextCupByCupValue.set(i, i+1);
        }
        this.nextCupByCupValue.set(to, this.crabCup);
        this.maxCup = to;
        return this;
    }

    findCupAfter(cup: number) {
        return this.nextCupByCupValue.get(cup);
    }
}
