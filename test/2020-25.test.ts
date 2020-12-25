import {lookForPrimePowersMatching, transformSubjectNumber} from "../src/2020-25";

test("test transformSubjectNumber() computation with 7", () => {
    expect(transformSubjectNumber(7, 8)).toEqual(5764801);
    expect(transformSubjectNumber(7, 11)).toEqual(17807724);
    expect(transformSubjectNumber(17807724, 8)).toEqual(14897079);
    expect(transformSubjectNumber(5764801, 11)).toEqual(14897079);
});

test("looking for prime power matching Q1 samples", () => {
    const result = lookForPrimePowersMatching([5764801, 17807724]);
    if(result === undefined) {
        fail("No prime power found !");
        return;
    }

    expect(transformSubjectNumber(result.matches[0].subjectNumber, result.matches[1].loopSize)).toEqual(14897079);
    expect(transformSubjectNumber(result.matches[1].subjectNumber, result.matches[0].loopSize)).toEqual(14897079);
});


test("looking for prime power matching Q1 INPUT", () => {
    const result = lookForPrimePowersMatching([2959251, 4542595]);
    if(result === undefined) {
        fail("No prime power found !");
        return;
    }

    console.log(`Prime number found : ${result.matchingPrime} (${JSON.stringify(result.matches)})`)

    let encryptionKey1 = transformSubjectNumber(result!.matches[0].subjectNumber, result!.matches[1].loopSize);
    let encryptionKey2 = transformSubjectNumber(result!.matches[1].subjectNumber, result!.matches[0].loopSize);

    expect(encryptionKey1 === encryptionKey2).toBe(true);
    expect(encryptionKey1).toEqual(3803729);
});
