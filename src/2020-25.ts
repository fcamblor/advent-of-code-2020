import {reduceTimes} from "./utils";


const primes = [
    /*2,3,5,*/7/*,11,
    13, 17,19,23,29,
    31,37,41,43,47,
    53,59,61,67,71,
    73,79,83,89,97,*/
];

export function transformSubjectNumber(subjectNumber: number, loopSize: number) {
    return reduceTimes(loopSize, (value, _) => (subjectNumber*value)%20201227, 1);
}

type MatchingPrimeResult = {matchingPrime: number, matches:[{subjectNumber: number, loopSize: number },{subjectNumber: number, loopSize: number }] };
export function lookForPrimePowersMatching(lookedForNumbers: number[]): MatchingPrimeResult|undefined {
    for(let i=0; i<primes.length; i++){
        const prime = primes[i];

        let powerOfPrime = { val: prime, power: 1};
        let numbersFounds = [] as {subjectNumber: number, loopSize: number }[];
        while(numbersFounds.length < 2 && powerOfPrime.power < 10000000000) {
            if(lookedForNumbers.includes(powerOfPrime.val)) {
                numbersFounds.push({ loopSize: powerOfPrime.power, subjectNumber: powerOfPrime.val });
            }
            powerOfPrime = { val: (powerOfPrime.val * prime)%20201227, power: powerOfPrime.power+1 };
        }

        if(numbersFounds.length === 2) {
            return { matchingPrime: prime, matches: numbersFounds as [{subjectNumber: number, loopSize: number },{subjectNumber: number, loopSize: number }] };
            break;
        }
    }

    return undefined;
}
