import {extractColumnBasedValues, rotateMatrix} from "./utils";


type Combinations = {
    startingValue: number;
    results: number[];
};

export class ValidationWindow {
    private startingWindowOffset: number;
    private combinations: Combinations[];
    constructor(private readonly initValues: number[], private readonly windowSize: number) {
        this.startingWindowOffset = 0;
        const windowedValues = initValues.slice(this.startingWindowOffset, windowSize);

        this.combinations = [];
        for(let i=0; i<windowedValues.length; i++) {
            const results = [];
            for(let j=i+1; j<windowedValues.length; j++) {
                results.push(windowedValues[i] + windowedValues[j]);
            }
            this.combinations.push({ startingValue: windowedValues[i], results });
        }
    }

    resultsContains(searchedResult: number) {
        for(let i=0; i<this.combinations.length; i++) {
            if(this.combinations[i].results.indexOf(searchedResult) !== -1) {
                return true;
            }
        }
        return false;
    }

    shiftWindow() {
        if(this.startingWindowOffset + this.windowSize >= this.initValues.length) {
            throw new Error("Invalid operation exception : end of initial values reached !");
        }

        this.startingWindowOffset++;
        this.combinations.shift();

        const newValue = this.initValues[this.startingWindowOffset + this.windowSize - 1];
        for(let i=0; i<this.combinations.length; i++) {
            this.combinations[i].results.push(this.combinations[i].startingValue + newValue);
        }
        this.combinations.push({ startingValue: newValue, results: [] });
    }

}

export class XMasCipher {
    constructor(private readonly preambleSize: number, private readonly values: number[]) {
    }

    public findFirstInvalidNumber() {
        const cachedValidationWindow = new ValidationWindow(this.values, this.preambleSize)
        for(let i=this.preambleSize; i<this.values.length; i++) {
            const verificationValue = this.values[i];
            if(!cachedValidationWindow.resultsContains(verificationValue)) {
                return verificationValue;
            }

            cachedValidationWindow.shiftWindow();
        }

        return undefined;
    }

}

export function findContiguousSetSummingTo(cipherValues: number[], expectedSum: number): number[]|undefined {
    for(let contiguousSetStartingIndex = 0; contiguousSetStartingIndex<cipherValues.length; contiguousSetStartingIndex++) {
        var sum = cipherValues[contiguousSetStartingIndex];
        var contiguousSet = [ cipherValues[contiguousSetStartingIndex] ];
        for(let j = contiguousSetStartingIndex+1; j<cipherValues.length && sum+cipherValues[j] <= expectedSum; j++) {
            sum += cipherValues[j];
            contiguousSet.push(cipherValues[j]);
        }

        if(sum === expectedSum) {
            return contiguousSet;
        }
    }

    return undefined;
}

function FIND_FIRST_INVALID_NUMBER_IN(cipherValuesCells: GSheetCells, preambleSize: number) {
    const [ cipherValuesStr ] = extractColumnBasedValues(cipherValuesCells);
    const cipherValues = cipherValuesStr.map(Number);
    return new XMasCipher(preambleSize, cipherValues).findFirstInvalidNumber();
}

function FIND_CONTIGUOUS_SET_SUMMING_TO(cipherValuesCells: GSheetCells, expectedSum: number) {
    const [cipherValuesStr] = extractColumnBasedValues(cipherValuesCells);
    const cipherValues = cipherValuesStr.map(Number);

    const result = findContiguousSetSummingTo(cipherValues, expectedSum);
    if(result) {
        return rotateMatrix([ result ]);
    }

    return "No value found !";
}
