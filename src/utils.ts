// google spreadsheet returns 2D values. this function aims at "flattening" 1-column 2D array
// extractColumnBasedValues([ ["a"], ["b"], ["c"] ], [ [1], [2], [3] ]) => [ ["a","b","c"], [1,2,3] ]
// Note that if 3 consecutive empty cells are found, cells are ignored (that's useful when we don't want to specifically target last row in cells selector)
// extractColumnBasedValues([ [""], ["a"], [""], ["b"], ["c"], [""], [""], [""], [""] ]) => [ ["","a","","b","c"] ]
export function extractColumnBasedValues(...valuesArray) {
    return valuesArray.map(cells =>
        // Considering that we should ignore rows once we reach 3 consecutive empty cells
        cells.filter((row, idx) => ((row[0] !== undefined && row[0] !== "") || (cells[idx+1] !== undefined && cells[idx+1][0] !== "") || (cells[idx+2] !== undefined && cells[idx+2][0] !== "")))
            .map(row => row[0])
    );
}

// ensureArraysHaveSameLength([ [1,2,3], [4,5,6] ]) => true
// ensureArraysHaveSameLength([ [1,2,3], [1,2] ]) => throws exception
export function ensureArraysHaveSameLength(arrays) {
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
export function countLetterOccurencesInString(letter, str) {
    return str.split('').filter(l => l === letter).length;
}

// combine([1,2,3], ["a","b","c"]) => [[1,"a"], [2, "b"], [3, "c"]]
export function combine(...arrays) {
    ensureArraysHaveSameLength(arrays);

    return arrays[0].map((_, idx) => {
        return arrays.map(arr => arr[idx]);
    });
}
