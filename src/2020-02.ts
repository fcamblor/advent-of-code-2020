import {combine, countLetterOccurencesInString, ensureArraysHaveSameLength, extractColumnBasedValues} from "./utils";

function POSITIONS_CONTAINS(lettersCells, passwordCells, positions1Cells, positions2Cells) {
    const [ letters, passwords, positions1, positions2 ] = extractColumnBasedValues(lettersCells, passwordCells, positions1Cells, positions2Cells);
    ensureArraysHaveSameLength([ letters, passwords, positions1, positions2 ]);

    return combine(letters, passwords, positions1, positions2).map(([letter, password, position1, position2]) => {
        const position1Matches = password[position1-1] === letter;
        const position2Matches = password[position2-1] === letter;
        return [
            position1Matches?1:0,
            position2Matches?1:0,
            ((position1Matches?1:0)+(position2Matches?1:0) === 1)?1:0
        ];
    });
}

function OCCURENCES_BETWEEN(lettersCells, passwordCells, minsCells, maxsCells) {
    const [ letters, passwords, mins, maxs ] = extractColumnBasedValues(lettersCells, passwordCells, minsCells, maxsCells);

    return combine(letters, passwords, mins, maxs).map(([letter, password, min, max]) => {
        const occurences = countLetterOccurencesInString(letter, password);
        return [
            occurences,
            (occurences >= Number(min) && occurences <= Number(max))?1:0
        ];
    });
}
