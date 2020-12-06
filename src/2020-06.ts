import {combine, countLetterOccurencesInString, extractColumnBasedValues, rotateMatrix} from "./utils";


function QUESTIONS_ANSWERED_BY_EVERYONE(lettersCells: GSheetCells, groupsAnswersCells: GSheetCells) {
    const [ letters, groupsAnswers ] = extractColumnBasedValues<string,string>(rotateMatrix(lettersCells), groupsAnswersCells);

    return groupsAnswers
        .map(groupAnswers =>
                letters
                    .map(letter => (countLetterOccurencesInString(letter, groupAnswers) >= countLetterOccurencesInString("\n", groupAnswers)+1?1:0)));
}
