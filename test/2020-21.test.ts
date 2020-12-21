import {D21ListOfFoods} from "../src/2020-21";
import {D21_INPUT, D21_SAMPLE} from "./2020-21.inputs";


test("Q1 sample", () => {
    let listOfFoods = D21ListOfFoods.createFrom(D21_SAMPLE);
    expect(listOfFoods.determineIngredientsThatCantPossiblyContainAnyAllergens().ingredientsWithoutAllergen).toEqual(new Set([
        "kfcds", "nhms", "sbzzf", "trh"
    ]));
    expect(listOfFoods.countIngredientOccurencesHavingNoAllergen()).toEqual(5);
})


test("Q1 INPUT", () => {
    let listOfFoods = D21ListOfFoods.createFrom(D21_INPUT);
    expect(listOfFoods.countIngredientOccurencesHavingNoAllergen()).toEqual(2315);
})

test("Q2 sample", () => {
    let listOfFoods = D21ListOfFoods.createFrom(D21_SAMPLE);
    expect(listOfFoods.canonicalIngredientList()).toEqual("mxmxvkd,sqjhc,fvjkl");
})

test("Q2 INPUT", () => {
    let listOfFoods = D21ListOfFoods.createFrom(D21_INPUT);
    expect(listOfFoods.canonicalIngredientList()).toEqual("cfzdnz,htxsjf,ttbrlvd,bbbl,lmds,cbmjz,cmbcm,dvnbh");
})