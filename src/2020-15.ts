import {extractColumnBasedValues, rotateMatrix} from "./utils";

export function q15Read(str: string) { return str.split(",").map(Number); }

export function findNumbersAfter(startingNumbers: number[], numberOfNumbers: number) {
    const { perNumberLastSpokenIndexes, listOfSpokenNumbers } = startingNumbers.reduce(({ perNumberLastSpokenIndexes, listOfSpokenNumbers }, num, index) => {
        perNumberLastSpokenIndexes[num] = [ index+1 ];
        return { perNumberLastSpokenIndexes, listOfSpokenNumbers: listOfSpokenNumbers.concat([ num ]) }
    }, { perNumberLastSpokenIndexes: {}, listOfSpokenNumbers: [] } as { perNumberLastSpokenIndexes: Record<number,number[]>, listOfSpokenNumbers: number[] })

    let turn = startingNumbers.length + 1;
    let lastSpokenNumber = startingNumbers[startingNumbers.length-1];
    while(turn <= numberOfNumbers) {
        let spokenNumber;
        if(perNumberLastSpokenIndexes[lastSpokenNumber] && perNumberLastSpokenIndexes[lastSpokenNumber].length === 1) {
            spokenNumber = 0;
        } else {
            const timesSpoken: number = perNumberLastSpokenIndexes[lastSpokenNumber].length;
            spokenNumber = perNumberLastSpokenIndexes[lastSpokenNumber][timesSpoken-1] - perNumberLastSpokenIndexes[lastSpokenNumber][timesSpoken-2];
        }

        perNumberLastSpokenIndexes[spokenNumber] = perNumberLastSpokenIndexes[spokenNumber] || [];
        perNumberLastSpokenIndexes[spokenNumber].push(turn);

        listOfSpokenNumbers.push(spokenNumber);
        lastSpokenNumber = spokenNumber;
        turn++;
    }

    return { lastSpokenNumber, listOfSpokenNumbers };
}

function SHOW_Q1_LIST_OF_SPOKEN_NUMBERS(list: string) {
    return rotateMatrix([ findNumbersAfter(q15Read(list), 2020).listOfSpokenNumbers ]);
}