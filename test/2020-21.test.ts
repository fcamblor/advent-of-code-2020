import {D21ListOfFoods} from "../src/2020-21";
import {D21_INPUT, D21_SAMPLE} from "./2020-21.inputs";


test("Q1 sample", () => {
    let listOfFoods = D21ListOfFoods.createFrom(D21_SAMPLE);
    expect(listOfFoods.determineIngredientsThatCantPossiblyContainAnyAllergens()).toEqual(new Set([
        "kfcds", "nhms", "sbzzf", "trh"
    ]));
    expect(listOfFoods.countIngredientOccurencesHavingNoAllergen()).toEqual(5);
})


test("Q1 INPUT", () => {
    let listOfFoods = D21ListOfFoods.createFrom(D21_INPUT);
    expect(listOfFoods.countIngredientOccurencesHavingNoAllergen()).toEqual(2315);
})