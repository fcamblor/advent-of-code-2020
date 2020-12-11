import {extractColumnBasedValues, rotateMatrix} from "./utils";


function FIND_FIRST_MATCHING_REGEX(cells: GSheetCells, regexPatternsCells: GSheetCells) {
    const [ regexPatterns ] = extractColumnBasedValues<string>(rotateMatrix(regexPatternsCells));
    return rotateMatrix(regexPatterns.map(regexPattern => {
        return cells.map(rowValues => {
            for(var i=0; i<rowValues.length; i++) {
                const regexMatches = rowValues[i].match(regexPattern);
                if(regexMatches) {
                    return regexMatches[1];
                }
            }
            return "";
        })
    }));
}