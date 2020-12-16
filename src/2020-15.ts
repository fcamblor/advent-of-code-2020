import {extractColumnBasedValues, reduceRange, reduceTimes, rotateMatrix} from "./utils";

export function q15Read(str: string) { return str.split(",").map(Number); }

export function findNumbersAfter(startingNumbers: number[], requestedTurn: number) {
    const { perNumberLastSpokenIndex } = startingNumbers.reduce(({ perNumberLastSpokenIndex, listOfSpokenNumbers }, num, index) => {
        perNumberLastSpokenIndex.set(num, index+1);
        listOfSpokenNumbers.push(num);
        return { perNumberLastSpokenIndex, listOfSpokenNumbers };
    }, { perNumberLastSpokenIndex: new Map() as Map<number,number>, listOfSpokenNumbers: [] as number[] })

    const { listOfSpokenNumbers } = reduceRange(startingNumbers.length + 1, requestedTurn, ({ listOfSpokenNumbers, perNumberLastSpokenIndex, perNumberAnteLastSpokenIndex }, turn) => {
        const lastSpokenNumber = listOfSpokenNumbers[listOfSpokenNumbers.length-1];

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
        listOfSpokenNumbers.push(numberToSay);

        return { listOfSpokenNumbers, perNumberLastSpokenIndex, perNumberAnteLastSpokenIndex, lastSpokenNumber: numberToSay };
    }, { listOfSpokenNumbers: startingNumbers as number[], perNumberLastSpokenIndex, perNumberAnteLastSpokenIndex: new Map() as Map<number,number> });

    return { lastSpokenNumber: listOfSpokenNumbers[listOfSpokenNumbers.length-1], listOfSpokenNumbers };
}

function SHOW_Q1_LIST_OF_SPOKEN_NUMBERS(list: string) {
    return rotateMatrix([ findNumbersAfter(q15Read(list), 2020).listOfSpokenNumbers ]);
}
