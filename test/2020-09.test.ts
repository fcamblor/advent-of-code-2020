import {XMasCipher} from "../src/2020-09";


test('should finding first invalid number works', () => {
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
})
