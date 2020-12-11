export function extractColumnBasedValues<A1>(...arrays: [GSheetCells]): [ A1[] ];
export function extractColumnBasedValues<A1,A2>(...arrays: [GSheetCells,GSheetCells]): [ A1[], A2[] ];
export function extractColumnBasedValues<A1,A2,A3>(...arrays: [GSheetCells,GSheetCells,GSheetCells]): [ A1[], A2[], A3[] ];
export function extractColumnBasedValues<A1,A2,A3,A4>(...arrays: [GSheetCells,GSheetCells,GSheetCells,GSheetCells]): [ A1[], A2[], A3[], A4[] ];
export function extractColumnBasedValues<A1,A2,A3,A4,A5>(...arrays: [GSheetCells,GSheetCells,GSheetCells,GSheetCells,GSheetCells]): [ A1[], A2[], A3[], A4[], A5[] ];
export function extractColumnBasedValues<A1,A2,A3,A4,A5,A6>(...arrays: [GSheetCells,GSheetCells,GSheetCells,GSheetCells,GSheetCells,GSheetCells]): [ A1[], A2[], A3[], A4[], A5[], A6[] ];
// google spreadsheet returns 2D values. this function aims at "flattening" 1-column 2D array
// extractColumnBasedValues([ ["a"], ["b"], ["c"] ], [ [1], [2], [3] ]) => [ ["a","b","c"], [1,2,3] ]
// Note that if 3 consecutive empty cells are found, cells are ignored (that's useful when we don't want to specifically target last row in cells selector)
// extractColumnBasedValues([ [""], ["a"], [""], ["b"], ["c"], [""], [""], [""], [""] ]) => [ ["","a","","b","c"] ]
export function extractColumnBasedValues(...valuesArray: GSheetCells[]): any[][] {
    return valuesArray.map(cells =>
        // Considering that we should ignore rows once we reach 3 consecutive empty cells
        cells.filter((row, idx) => ((row[0] !== undefined && row[0] !== "") || (cells[idx+1] !== undefined && cells[idx+1][0] !== "") || (cells[idx+2] !== undefined && cells[idx+2][0] !== "")))
             .map(row => row[0])
    );
}

// ensureArraysHaveSameLength([ [1,2,3], [4,5,6] ]) => true
// ensureArraysHaveSameLength([ [1,2,3], [1,2] ]) => throws exception
export function ensureArraysHaveSameLength(arrays: any[]) {
    var arraysByLength = arrays.reduce((arraysByLength, arr, index) => {
        arraysByLength[""+arr.length] = arraysByLength[""+arr.length] || [];
        arraysByLength[""+arr.length].push({ index });
        return arraysByLength;
    }, {});

    if(Object.keys(arraysByLength).length !== 1) {
        throw new Error("Arrays with different lengths detected : "+JSON.stringify(arraysByLength));
    }

    return true;
}

// countLetterOccurencesInString("e", "frederic") => 2
export function countLetterOccurencesInString(letter: string[0], str: string) {
    return str.split('').filter(l => l === letter).length;
}

export function combine<A1,A2>(a1: A1[], a2: A2[]): [A1,A2][];
export function combine<A1,A2,A3>(a1: A1[], a2: A2[], a3: A3[]): [A1,A2,A3][];
export function combine<A1,A2,A3,A4>(a1: A1[], a2: A2[], a3: A3[], a4: A4[]): [A1,A2,A3,A4][];
export function combine<A1,A2,A3,A4,A5>(a1: A1[], a2: A2[], a3: A3[], a4: A4[], a5: A5[]): [A1,A2,A3,A4,A5][];
export function combine<A1,A2,A3,A4,A5,A6>(a1: A1[], a2: A2[], a3: A3[], a4: A4[], a5: A5[], a6: A6[]): [A1,A2,A3,A4,A5,A6][];
// combine([1,2,3], ["a","b","c"]) => [[1,"a"], [2, "b"], [3, "c"]]
export function combine(...arrays: any[]): any[][] {
    ensureArraysHaveSameLength(arrays);

    return arrays[0].map((_: any, idx: number) => arrays.map(arr => arr[idx]));
}

export function rotateMatrix<T>(m: T[][]): T[][] {
    if(!m.length){ return []; }
    const rotated = Array(m[0].length);
    for(var i=0; i<rotated.length; i++){
        rotated[i] = Array(m.length);
        for(var j=0; j<m.length; j++){
            rotated[i][j] = m[j][i];
        }
    }
    return rotated;
}

function JS_SPLIT(cells: GSheetCells, regexParam1: string, regexParam2?: string) {
    const [ values ] = extractColumnBasedValues<string>(cells);
    return values.map(v => v.split(new RegExp(regexParam1, regexParam2)));
}


export function fact(x: number) {
    let result = 1;
    for(var i=2;i<=x; i++) {
        result *= i;
    }
    return result;
}

export function cnp(n: number, p: number) {
    return fact(n)/(fact(p)*fact(n-p));
}

export function matrixEquals<T extends number|string>(m1: T[][], m2: T[][]): {areEqual: boolean, reason?: string} {
    if(m1.length === 0 && m2.length === 0) {
        return { areEqual: true };
    }
    if(m1.length !== m2.length) {
        return { areEqual: false, reason: "first dimension size differ" };
    }
    if(m1[0].length !== m2[0].length) {
        return {areEqual: false, reason: "second dimension size differ" };
    }
    for(let i=0; i<m1.length; i++) {
        for(let j=0; j<m1[i].length; j++) {
            if(m1[i][j] !== m2[i][j]) {
                return { areEqual: false, reason: `difference found at [${i}][${j}] (m1[${i}][${j}]=${m1[i][j]}, m2[${i}][${j}]=${m2[i][j]})` };
            }
        }
    }
    return {areEqual: true};
}

export function matrixGetOrUndefined<T>(matrix: T[][], i: number, j: number): T|undefined {
    if(i < 0 || i >= matrix.length || j < 0 || j >= matrix[i].length) {
        return undefined;
    }
    return matrix[i][j];
}

export function iterateOverMatrix<T, U>(matrix: T[][], callback: (i: number, j: number, value: T) => ({continue: false, returnedValue:U}|{ continue: true })): U|undefined {
    for(let i=0; i<matrix.length; i++) {
        for(let j=0; j<matrix[i].length; j++) {
            let result = callback(i, j, matrix[i][j]);
            if(!result.continue) {
                return result.returnedValue;
            }
        }
    }
    return undefined;
}


// Thanks to https://stackoverflow.com/a/42531964/476345
export function combinations(array: number[], uselessFillingValue = -1) {
    return new Array(1 << array.length).fill(uselessFillingValue).map(
        (_, i) => array.filter((e2, j) => i & 1 << j));
}
