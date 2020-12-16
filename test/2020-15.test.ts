import {
    findNumbersAfter,
    findNumbersAfter_withListOfSpkenNumber,
    findNumbersAfter_withObjectLiterals,
    q15Read
} from "../src/2020-15";

const FUNCTIONS_TO_TEST = [
    { name: "findNumbersAfter", impl: findNumbersAfter },
    // { name: "findNumbersAfter_withListOfSpkenNumber", impl: findNumbersAfter_withListOfSpkenNumber },
    { name: "findNumbersAfter_withObjectLiterals", impl: findNumbersAfter_withObjectLiterals }

];

FUNCTIONS_TO_TEST.forEach(functionUnderTest => {
    test(`Q1 samples with ${functionUnderTest.name}`, () => {
        expect(functionUnderTest.impl(q15Read("1,3,2"), 2020).lastSpokenNumber).toEqual(1);
        expect(functionUnderTest.impl(q15Read("0,3,6"), 2020).lastSpokenNumber).toEqual(436);
        expect(functionUnderTest.impl(q15Read("2,1,3"), 2020).lastSpokenNumber).toEqual(10);
        expect(functionUnderTest.impl(q15Read("1,2,3"), 2020).lastSpokenNumber).toEqual(27);
        expect(functionUnderTest.impl(q15Read("2,3,1"), 2020).lastSpokenNumber).toEqual(78);
        expect(functionUnderTest.impl(q15Read("3,2,1"), 2020).lastSpokenNumber).toEqual(438);
        expect(functionUnderTest.impl(q15Read("3,1,2"), 2020).lastSpokenNumber).toEqual(1836);
    })

    test(`Q1 with ${functionUnderTest.name}`, () => {
        let start = Date.now();
        expect(functionUnderTest.impl(q15Read("19,0,5,1,10,13"), 2020).lastSpokenNumber).toEqual(1015);
        console.log(`Result in ${Date.now() - start}ms`);
    })

    test(`Q2 samples with ${functionUnderTest.name}`, () => {
        // let start = Date.now();
        // expect(functionUnderTest.impl(q15Read("0,3,6"), 1000000).lastSpokenNumber).toEqual(130);
        // console.log(`Result in ${Date.now() - start}ms`);
        // expect(functionUnderTest.impl(q15Read("1,3,2"), 1000000).lastSpokenNumber).toEqual(21460);
        // expect(functionUnderTest.impl(q15Read("2,1,3"), 1000000).lastSpokenNumber).toEqual(344876);
        // expect(functionUnderTest.impl(q15Read("1,2,3"), 1000000).lastSpokenNumber).toEqual(7);
        // expect(functionUnderTest.impl(q15Read("2,3,1"), 1000000).lastSpokenNumber).toEqual(44);
        // expect(functionUnderTest.impl(q15Read("3,2,1"), 1000000).lastSpokenNumber).toEqual(838);
        // expect(functionUnderTest.impl(q15Read("3,1,2"), 1000000).lastSpokenNumber).toEqual(8);

        functionUnderTest.impl(q15Read("3,1,2"), 30000000);
    })

    test(`Q2 with ${functionUnderTest.name}`, () => {
        // let start = Date.now();
        // expect(functionUnderTest.impl(q15Read("19,0,5,1,10,13"), 1000000).lastSpokenNumber).toEqual(195);
        // console.log(`Result in ${Date.now() - start}ms`);

        functionUnderTest.impl(q15Read("19,0,5,1,10,13"), 30000000);
    })

});


test("Perf usage of JS Obj literal vs Array vs Map", () => {
    const MAX = 10000000, testsDurations = [];
    const myObjLiteral: Record<number,string> = {}, myMap = new Map(), myArr = Array(MAX);

    var i;
    try {
        for(i=0; i<MAX; i=i+2) { // Using i+2 here to simulate "holes" in objects/arrays
            myObjLiteral[i] = "blah"; myArr[i] = "blah"; myMap.set(i, "blah");
        }
    }catch(e) { console.error(`at ${i}: ${e}`); }

    function testLoop(testName: string, max: number, callback: (i: number) => void) {
        let start = Date.now();
        for(i=0; i<max; i++) {
            callback(i);
        }

        let duration = Date.now() - start;
        console.log(`${testName} : ${duration}ms`);
        return { testName, duration: duration };
    }

    console.log("================================== SEQUENTIAL ACCESSES ====================================")
    testsDurations.push(testLoop(`SEQ Obj literal has()`, MAX, (i) => myObjLiteral[i])); // 56ms
    testsDurations.push(testLoop(`SEQ Array has()`, MAX, (i) => myArr[i])); // 57ms
    testsDurations.push(testLoop(`SEQ Map has()`, MAX, (i) =>  myMap.has(i))); // 1392ms

    testsDurations.push(testLoop(`SEQ Obj literal get()`, MAX, (i) => myObjLiteral[i])); // 71ms
    testsDurations.push(testLoop(`SEQ Array get()`, MAX, (i) => myArr[i])); // 61ms
    testsDurations.push(testLoop(`SEQ Map get()`, MAX, (i) =>  myMap.get(i))); // 1632ms

    testsDurations.push(testLoop(`SEQ Obj literal set()`, MAX/2, (i) => { myObjLiteral[i*2] = "bleh"; })); // 41ms
    testsDurations.push(testLoop(`SEQ Array set()`, MAX/2, (i) => { myArr[i*2] = "bleh"; })); // 33ms
    testsDurations.push(testLoop(`SEQ Map set()`, MAX/2, (i) => { myMap.set(i*2, "bleh"); })); // 969ms

    console.log("================================== RANDOM ACCESSES ====================================")
    testsDurations.push(testLoop(`RDM Obj literal has()`, MAX, (i) => myObjLiteral[Math.random()*(MAX-1)])); // 10349ms
    testsDurations.push(testLoop(`RDM Array has()`, MAX, (i) => myArr[Math.random()*(MAX-1)])); // 12107ms
    testsDurations.push(testLoop(`RDM Map has()`, MAX, (i) =>  myMap.has(Math.random()*(MAX-1)))); // 4977ms

    testsDurations.push(testLoop(`RDM Obj literal get()`, MAX, (i) => myObjLiteral[Math.random()*(MAX-1)])); // 10321ms
    testsDurations.push(testLoop(`RDM Array get()`, MAX, (i) => myArr[Math.random()*(MAX-1)])); // 13151ms
    testsDurations.push(testLoop(`RDM Map get()`, MAX, (i) =>  myMap.get(Math.random()*(MAX-1)))); // 4922ms

    testsDurations.push(testLoop(`RDM Obj literal set()`, MAX/2, (i) => { myObjLiteral[Math.random()*(MAX-1)] = "bleh"; })); // 7598ms
    testsDurations.push(testLoop(`RDM Array set()`, MAX/2, (i) => { myArr[Math.random()*(MAX-1)] = "bleh"; })); // 7715ms
    testsDurations.push(testLoop(`RDM Map set()`, MAX/2, (i) => { myMap.set(Math.random()*(MAX-1), "bleh"); })); // 15905ms

    console.table(testsDurations);
})