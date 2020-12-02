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
