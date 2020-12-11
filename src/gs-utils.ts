import {extractColumnBasedValues, readLineGroups, rotateMatrix} from "./utils";

function SPLIT_EMPTY_LINES_VERTICALLY(value: string) {
    return rotateMatrix([ readLineGroups(value) ]);
}

function JS_SPLIT(cells: GSheetCells, regexParam1: string, regexParam2?: string) {
    const [ values ] = extractColumnBasedValues<string>(cells);
    return values.map(v => v.split(new RegExp(regexParam1, regexParam2)));
}
