import {findContiguousSetSummingTo, XMasCipher} from "../src/2020-09";


test('should finding first invalid number and contiguous set work', () => {
    const cipherValues = [
        35,
        20,
        15,
        25,
        47,
        40,
        62,
        55,
        65,
        95,
        102,
        117,
        150,
        182,
        127,
        219,
        299,
        277,
        309,
        576,
    ];
    expect(new XMasCipher(5, cipherValues).findFirstInvalidNumber()).toEqual(127);
    expect(findContiguousSetSummingTo(cipherValues, 127)).toEqual([ 15,25,47,40 ]);
})
