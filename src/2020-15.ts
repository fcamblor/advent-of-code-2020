import {extractColumnBasedValues, reduceRange, reduceTimes, rotateMatrix} from "./utils";

export function q15Read(str: string) { return str.split(",").map(Number); }

export function findNumbersAfter(startingNumbers: number[], requestedTurn: number) {
    const { perNumberLastSpokenIndex, listOfSpokenNumbers } = startingNumbers.reduce(({ perNumberLastSpokenIndex, listOfSpokenNumbers }, num, index) => {
        perNumberLastSpokenIndex[num] = index+1;
        return { perNumberLastSpokenIndex, listOfSpokenNumbers: listOfSpokenNumbers.concat([ num ]) };
    }, { perNumberLastSpokenIndex: {} as Record<number,number>, listOfSpokenNumbers: [] as number[] })

    const { lastSpokenNumber, listOfSpokenNumbers: _ } = reduceRange(startingNumbers.length + 1, requestedTurn, ({ perNumberLastSpokenIndex, perNumberAnteLastSpokenIndex, lastSpokenNumber, listOfSpokenNumbers }, turn) => {
        let numberToSay;
        if(!perNumberAnteLastSpokenIndex[lastSpokenNumber]) {
            numberToSay = 0;
        } else {
            numberToSay = perNumberLastSpokenIndex[lastSpokenNumber] - perNumberAnteLastSpokenIndex[lastSpokenNumber];
        }

        if(perNumberLastSpokenIndex[numberToSay]) {
            perNumberAnteLastSpokenIndex[numberToSay] = perNumberLastSpokenIndex[numberToSay];
        }
        perNumberLastSpokenIndex[numberToSay] = turn;

        return { perNumberLastSpokenIndex, perNumberAnteLastSpokenIndex, lastSpokenNumber: numberToSay, listOfSpokenNumbers: listOfSpokenNumbers.concat([ numberToSay ]) };
    }, { perNumberLastSpokenIndex, perNumberAnteLastSpokenIndex: {} as Record<number,number>, lastSpokenNumber: startingNumbers[startingNumbers.length-1], listOfSpokenNumbers });

    return { lastSpokenNumber, listOfSpokenNumbers };
}

function SHOW_Q1_LIST_OF_SPOKEN_NUMBERS(list: string) {
    return rotateMatrix([ findNumbersAfter(q15Read(list), 2020).listOfSpokenNumbers ]);
}
