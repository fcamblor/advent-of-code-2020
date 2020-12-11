import {extractColumnBasedValues, rotateMatrix} from "./utils";

export function findJoltDeltas(input: number[]) {
    const values = [...input].sort((a, b) => a-b);
    const { voltageDeltas, previousValue: _ } = values.reduce(({ voltageDeltas, previousValue}, val, idx) => {
        let delta = val - previousValue;
        voltageDeltas.push(delta);
        return { voltageDeltas, previousValue: val };
    }, { voltageDeltas: [] as number[], previousValue: 0});

    // We need to add an additionnal delta of 3 t reach max+3
    voltageDeltas.push(3);

    let delta1Count = voltageDeltas.filter(d => d === 1).length;
    let delta3Count = voltageDeltas.filter(d => d === 3).length;
    return {
        sortedValues: values,
        voltageDeltas,
        delta1: delta1Count,
        delta3: delta3Count,
        product: delta1Count * delta3Count,
    };
}

export function joltPermutationsCount(deltas: number[]) {
    let permutationsCount = 1;
    let successiveDeltas1 = 0;
    const perSuccessiveDeltasPermutationsMultiplicators: Record<number,number> = {
        // No delta1, no multiplicator :
        // input:[ x, x+3 ] (for example : [0, 3])
        // possible outputs: [ x, x+3 ]
        0: 1,
        // Only 1 delta1 in a row : number cannot be removed, so no multiplicator either here :
        // input:[ x, x+1, x+4 ] (for example: [ 0, 1, 4 ]
        // possible outputs: [ x, x+1, x+4 ]
        1: 1,
        // 2 delta1 in a row, we may have 2 permutations :
        // input:[ x, x+1, x+2, x+5 ] (for example:[ 0, 1, 2, 5 ])
        // possible outputs:
        // - size 4: [ x, x+1, x+2, x+5 ]
        // - size 3: [ x, x+2, x+5 ]
        2: 2,
        // 3 delta1 in a row, we may have 4 permutations :
        // input:[ x, x+1, x+2, x+3, x+6 ] (for example:[ 0, 1, 2, 3, 6 ])
        // possible outputs:
        // - size 5: [ x, x+1, x+2, x+3, x+6 ]
        // - size 4: [ x, x+1, x+3, x+6 ], [ x, x+2, x+3, x+6 ]
        // - size 3: [ x, x+3, x+6]
        3: 4,
        // 4 delta1 in a row, we may have 7 permutations :
        // input:[ x, x+1, x+2, x+3, x+4, x+7 ] (for example:[ 0, 1, 2, 3, 4, 7 ])
        // possible outputs:
        // - size 6: [ x, x+1, x+2, x+3, x+4, x+7 ],
        // - size 5: [ x, x+1, x+2, x+4, x+7 ], [ x, x+1, x+3, x+4, x+7 ], [ x, x+2, x+3, x+4, x+7]
        // - size 4: [ x, x+1, x+4, x+7 ], [ x, x+2, x+4, x+7 ], [ x, x+3, x+4, x+7 ]
        // - size 3: no possible output
        4: 7,
        // 5 delta1 in a row, we may have 21 permutations :
        // input:[ x, x+1, x+2, x+3, x+4, x+5, x+8 ] (for example: [ 0, 1, 2, 3, 4, 5, 8 ])
        // possible outputs :
        // - size 7: [ x, x+1, x+2, x+3, x+4, x+5, x+8 ]
        // - size 6: [ x, x+1, x+2, x+3, x+4, x+8 ], [ x, x+1, x+2, x+3, x+5, x+8 ], [ x, x+1, x+2, x+4, x+5, x+8 ],
        //           [ x, x+1, x+3, x+4, x+5, x+8 ], [ x, x+2, x+3, x+4, x+5, x+8 ]
        // - size 5: [ x, x+1, x+2, x+4, x+8 ], [ x, x+1, x+3, x+4, x+8 ], [ x, x+2, x+3, x+4, x+8 ],
        //           [ x, x+1, x+2, x+5, x+8 ], [ x, x+1, x+3, x+5, x+8 ], [ x, x+2, x+3, x+5, x+8 ],
        //           [ x, x+1, x+4, x+5, x+8 ], [ x, x+2, x+4, x+5, x+8 ], [ x, x+3, x+4, x+5, x+8 ]
        // - size 4: [ x, x+1, x+4, x+8 ], [ x, x+2, x+4, x+8 ], [ x, x+3, x+4, x+8 ], [ x, x+2, x+5, x+8 ],
        //           [ x, x+3, x+5, x+8 ], [ x, x+2, x+5, x+8 ]
        // BUT HOPEFULLY THIS DOESN'T HAPPEN as we never have more than 4 delta1-in-a-row...
        5: 21
    };
    for(var i=0; i<deltas.length; i++) {
        if(deltas[i] === 1) {
            successiveDeltas1++;
        } else if(deltas[i] === 3) {
            permutationsCount *= perSuccessiveDeltasPermutationsMultiplicators[successiveDeltas1];
            successiveDeltas1 = 0;
        }
    }

    return permutationsCount;
}

function JOLT_PERMUTATIONS_COUNTS(deltasCells: GSheetCells) {
    const [deltasStr] = extractColumnBasedValues(deltasCells);
    const deltas = deltasStr.map(Number);

    return joltPermutationsCount(deltas);
}