import {D17_3DMatrix, D17_4DMatrix, PocketDimension} from "../src/2020-17";
import {D17_INPUT, D17_Q1Sample} from "./2020-17.inputs";


test("Q1 sample", () => {
    const pocketDimension = new PocketDimension(new D17_3DMatrix());
    pocketDimension.initializeWith2D(D17_Q1Sample);

    for(var i=0; i<6; i++) {
        pocketDimension.performNewCycle();
    }

    expect(pocketDimension.activeCubesCount()).toEqual(112);
})

test("Q1", () => {
    const pocketDimension = new PocketDimension(new D17_3DMatrix());
    pocketDimension.initializeWith2D(D17_INPUT);

    for(var i=0; i<6; i++) {
        pocketDimension.performNewCycle();
    }

    expect(pocketDimension.activeCubesCount()).toEqual(380);
})

test("Q2 sample", () => {
    const pocketDimension = new PocketDimension(new D17_4DMatrix());
    pocketDimension.initializeWith2D(D17_Q1Sample);

    for(var i=0; i<6; i++) {
        pocketDimension.performNewCycle();
    }

    expect(pocketDimension.activeCubesCount()).toEqual(848);
})

test("Q2", () => {
    const pocketDimension = new PocketDimension(new D17_4DMatrix());
    pocketDimension.initializeWith2D(D17_INPUT);

    for(var i=0; i<6; i++) {
        pocketDimension.performNewCycle();
    }

    expect(pocketDimension.activeCubesCount()).toEqual(2332);
})

