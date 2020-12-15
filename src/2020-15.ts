import {extractColumnBasedValues, reduceRange, reduceTimes, rotateMatrix} from "./utils";

export function q15Read(str: string) { return str.split(",").map(Number); }

export function findNumbersAfter(startingNumbers: number[], requestedTurn: number) {
    const { perNumberLastSpokenIndex } = startingNumbers.reduce(({ perNumberLastSpokenIndex }, num, index) => {
        perNumberLastSpokenIndex.set(num, index+1);
        return { perNumberLastSpokenIndex };
    }, { perNumberLastSpokenIndex: new Map() as Map<number,number> })

    // For debug purposes
    let logShown = false,
        start = Date.now(),
        tsPowerOfTenJumpsToShowLog = 3,
        tsJumpToShowLog = Math.pow(10, tsPowerOfTenJumpsToShowLog); // aka 10000000000

    const { lastSpokenNumber } = reduceRange(startingNumbers.length + 1, requestedTurn, ({ perNumberLastSpokenIndex, perNumberAnteLastSpokenIndex, lastSpokenNumber }, turn) => {
        if(!logShown && turn > tsJumpToShowLog) {
            console.log(`It took ${Date.now() - start}ms to reach 10^${tsPowerOfTenJumpsToShowLog}`);
            tsJumpToShowLog *= 10;
            tsPowerOfTenJumpsToShowLog++;
        }

        let numberToSay;
        if(!perNumberAnteLastSpokenIndex.has(lastSpokenNumber)) {
            numberToSay = 0;
        } else {
            numberToSay = perNumberLastSpokenIndex.get(lastSpokenNumber)! - perNumberAnteLastSpokenIndex.get(lastSpokenNumber)!;
        }

        if(perNumberLastSpokenIndex.has(numberToSay)) {
            perNumberAnteLastSpokenIndex.set(numberToSay, perNumberLastSpokenIndex.get(numberToSay)!);
        }
        perNumberLastSpokenIndex.set(numberToSay, turn);

        return { perNumberLastSpokenIndex, perNumberAnteLastSpokenIndex, lastSpokenNumber: numberToSay };
    }, { perNumberLastSpokenIndex, perNumberAnteLastSpokenIndex: new Map() as Map<number,number>, lastSpokenNumber: startingNumbers[startingNumbers.length-1] });

    return { lastSpokenNumber };
}

function SHOW_Q1_LIST_OF_SPOKEN_NUMBERS(list: string) {
    // return rotateMatrix([ findNumbersAfter(q15Read(list), 2020).listOfSpokenNumbers ]);
}
