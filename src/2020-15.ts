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

export function findNumbersAfter_withListOfSpkenNumber(startingNumbers: number[], requestedTurn: number) {
    const { perNumberLastSpokenIndex, listOfSpokenNumbers } = startingNumbers.reduce(({ perNumberLastSpokenIndex, listOfSpokenNumbers }, num, index) => {
        perNumberLastSpokenIndex.set(num, index+1);
        return { perNumberLastSpokenIndex, listOfSpokenNumbers: listOfSpokenNumbers.concat([ num ]) };
    }, { perNumberLastSpokenIndex: new Map() as Map<number,number>, listOfSpokenNumbers: [] as number[] })

    // For debug purposes
    let logShown = false,
        start = Date.now(),
        tsPowerOfTenJumpsToShowLog = 3,
        tsJumpToShowLog = Math.pow(10, tsPowerOfTenJumpsToShowLog); // aka 10000000000

    const { lastSpokenNumber, listOfSpokenNumbers: _ } = reduceRange(startingNumbers.length + 1, requestedTurn, ({ perNumberLastSpokenIndex, perNumberAnteLastSpokenIndex, lastSpokenNumber, listOfSpokenNumbers }, turn) => {
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

        return { perNumberLastSpokenIndex, perNumberAnteLastSpokenIndex, lastSpokenNumber: numberToSay, listOfSpokenNumbers: listOfSpokenNumbers.concat([ numberToSay ]) };
    }, { perNumberLastSpokenIndex, perNumberAnteLastSpokenIndex: new Map() as Map<number,number>, lastSpokenNumber: startingNumbers[startingNumbers.length-1], listOfSpokenNumbers });

    return { lastSpokenNumber, listOfSpokenNumbers };
}

export function findNumbersAfter_withObjectLiterals(startingNumbers: number[], requestedTurn: number) {
    const { perNumberLastSpokenIndex } = startingNumbers.reduce(({ perNumberLastSpokenIndex }, num, index) => {
        perNumberLastSpokenIndex[num] = index+1;
        return { perNumberLastSpokenIndex };
    }, { perNumberLastSpokenIndex: {} as Record<number,number> })

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
        if(!perNumberAnteLastSpokenIndex[lastSpokenNumber]) {
            numberToSay = 0;
        } else {
            numberToSay = perNumberLastSpokenIndex[lastSpokenNumber]! - perNumberAnteLastSpokenIndex[lastSpokenNumber]!;
        }

        if(perNumberLastSpokenIndex[numberToSay]) {
            perNumberAnteLastSpokenIndex[numberToSay] = perNumberLastSpokenIndex[numberToSay]!;
        }
        perNumberLastSpokenIndex[numberToSay] = turn;

        return { perNumberLastSpokenIndex, perNumberAnteLastSpokenIndex, lastSpokenNumber: numberToSay };
    }, { perNumberLastSpokenIndex, perNumberAnteLastSpokenIndex: {} as Record<number,number>, lastSpokenNumber: startingNumbers[startingNumbers.length-1] });

    return { lastSpokenNumber };
}

function SHOW_Q1_LIST_OF_SPOKEN_NUMBERS(list: string) {
    return rotateMatrix([ findNumbersAfter_withListOfSpkenNumber(q15Read(list), 2020).listOfSpokenNumbers ]);
}
