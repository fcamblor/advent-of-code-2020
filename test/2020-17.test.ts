import {D17_3DMatrix, D17_4DMatrix, PocketDimension} from "../src/2020-17";
import {D17_INPUT, D17_Q1Sample} from "./2020-17.inputs";


test("Q1 sample", () => {
    expect(new PocketDimension(new D17_3DMatrix())
        .initializeWith2D(D17_Q1Sample)
        .performCycles(6)
        .activeCubesCount()
    ).toEqual(112);
})

test("Q1", () => {
    expect(new PocketDimension(new D17_3DMatrix())
        .initializeWith2D(D17_INPUT)
        .performCycles(6)
        .activeCubesCount()
    ).toEqual(380);
})

test("Q2 sample", () => {
    expect(new PocketDimension(new D17_4DMatrix())
        .initializeWith2D(D17_Q1Sample)
        .performCycles(6)
        .activeCubesCount()
    ).toEqual(848);
})

test("Q2", () => {
    expect(new PocketDimension(new D17_4DMatrix())
        .initializeWith2D(D17_INPUT)
        .performCycles(6)
        .activeCubesCount()
    ).toEqual(2332);
})

