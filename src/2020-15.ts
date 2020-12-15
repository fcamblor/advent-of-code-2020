import {extractColumnBasedValues, reduceRange, reduceTimes, rotateMatrix} from "./utils";

export function q15Read(str: string) { return str.split(",").map(Number); }

export function findNumbersAfter(startingNumbers: number[], requestedTurn: number) {
    const { perNumberLastSpokenIndex } = startingNumbers.reduce(({ perNumberLastSpokenIndex }, num, index) => {
        perNumberLastSpokenIndex.set(num, index+1);
        return { perNumberLastSpokenIndex };
    }, { perNumberLastSpokenIndex: new Map() as Map<number,number> })

    const { lastSpokenNumber } = reduceRange(startingNumbers.length + 1, requestedTurn, ({ perNumberLastSpokenIndex, perNumberAnteLastSpokenIndex, lastSpokenNumber }, turn) => {
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
