import {mapCreateIfAbsent} from "./utils";


export class D21Food {
    constructor(public readonly ingredients: string[], public readonly allergens: string[]) {
    }

    static createFrom(str: string) {
        const [ incredientsStr, allergensStr ] = str.split(" (contains ");
        const ingredients = incredientsStr.split(" ");
        const allergens = allergensStr.split(", ");
        allergens[allergens.length-1] = allergens[allergens.length-1].substr(0, allergens[allergens.length-1].length-1);
        return new D21Food(ingredients, allergens);
    }
}

export class D21ListOfFoods {
    private foodsByIngredient: Map<string, D21Food[]>;
    private foodsByAllergen: Map<string, D21Food[]>;
    private uniqueIngredients: Set<string>;
    constructor(public readonly foods: D21Food[]) {
        const { foodsByIngredient, foodsByAllergen } = this.foods.reduce(({ foodsByIngredient, foodsByAllergen }, food) => {
            food.ingredients.forEach(ingredient => mapCreateIfAbsent(foodsByIngredient, ingredient, []).push(food));
            food.allergens.forEach(allergen => mapCreateIfAbsent(foodsByAllergen, allergen, []).push(food));
            return { foodsByIngredient, foodsByAllergen };
        }, { foodsByIngredient: new Map<string, D21Food[]>(), foodsByAllergen: new Map<string, D21Food[]>() })
        this.foodsByIngredient = foodsByIngredient;
        this.foodsByAllergen = foodsByAllergen;

        this.uniqueIngredients = this.foods.reduce((uniqueIngredients, food) => {
            return food.ingredients.reduce((uniqueIngredients, ingredient) => {
                uniqueIngredients.add(ingredient);
                return uniqueIngredients;
            }, uniqueIngredients);
        }, new Set<string>())
    }

    determineIngredientsThatCantPossiblyContainAnyAllergens() {
        type PerIngredientCounts = Map<string, {count: number}>;
        type PerAllergenEntry = { allergenOccurences: number, perIngredientCounts: PerIngredientCounts };
        type AllergenIngredientPairOccurence = { allergen: string, ingredient: string, count: number };
        let { perAllergenStatistics, allergenIngredientPairOccurences } = this.foods.reduce(({ perAllergenStatistics, allergenIngredientPairOccurences }, food) => {
            food.allergens.forEach(allergen => {
                const allergenEntry = mapCreateIfAbsent(perAllergenStatistics, allergen, { allergenOccurences: 0, perIngredientCounts: new Map<string, {count: number}>() });
                allergenEntry.allergenOccurences++;

                food.ingredients.forEach(ingredient => {
                    let ingredientEntry = mapCreateIfAbsent(allergenEntry.perIngredientCounts, ingredient, {count: 0});
                    if(ingredientEntry.count === 0) {
                        allergenIngredientPairOccurences.push({ allergen, ingredient, count: 0 });
                    }

                    ingredientEntry.count++;
                    allergenIngredientPairOccurences.find(occ => occ.ingredient === ingredient && occ.allergen === allergen)!.count++;
                })
            });
            return { perAllergenStatistics, allergenIngredientPairOccurences };
        }, { perAllergenStatistics: new Map<string, PerAllergenEntry>(), allergenIngredientPairOccurences: [] as AllergenIngredientPairOccurence[] })

        const ingredientsConcernedByAllergens = [] as {allergen: string, ingredient: string }[];
        const ingredientsWithoutAllergen = new Set(this.uniqueIngredients);
        while(allergenIngredientPairOccurences.length) {
            const guessableIngredientAllergenAssociations = allergenIngredientPairOccurences.filter(occ => occ.count === perAllergenStatistics.get(occ.allergen)!.allergenOccurences);
            if(guessableIngredientAllergenAssociations.length === 0) {
                throw new Error("Ouch ! We didn't found any guessable ingredient !");
            }

            const perAllergenOptionsCounts = guessableIngredientAllergenAssociations.reduce((perAllergenOptionsCounts, ingAllAssoc) => {
                const entry = mapCreateIfAbsent(perAllergenOptionsCounts, ingAllAssoc.allergen, {allergen: ingAllAssoc.allergen, count:0, ingredients: []});

                entry.count++;
                entry.ingredients.push(ingAllAssoc.ingredient);

                return perAllergenOptionsCounts;
            }, new Map<string, {count: number, allergen: string, ingredients: string[]}>());

            let sortedPerAllergenOptionCounts = Array.from(perAllergenOptionsCounts.values()).sort((c1, c2) => c1.count-c2.count);

            const bestOptionWithLessCandidates = sortedPerAllergenOptionCounts[0];
            if(bestOptionWithLessCandidates.ingredients.length !== 1) {
                console.warn("Multiple candidates found... crossing fingers the first one taken will be taken !...");
            }
            const allergenToEvict = bestOptionWithLessCandidates.allergen;
            const ingredientToEvict = bestOptionWithLessCandidates.ingredients[0];

            ingredientsConcernedByAllergens.push({ allergen: allergenToEvict, ingredient: ingredientToEvict });
            allergenIngredientPairOccurences = allergenIngredientPairOccurences.filter(occ =>
                    occ.allergen !== allergenToEvict && occ.ingredient !== ingredientToEvict
            );
            ingredientsWithoutAllergen.delete(ingredientToEvict)
        }

        return { ingredientsWithoutAllergen, ingredientsConcernedByAllergens };
    }

    countIngredientOccurencesHavingNoAllergen() {
        let { ingredientsWithoutAllergen } = this.determineIngredientsThatCantPossiblyContainAnyAllergens();
        return Array.from(ingredientsWithoutAllergen).reduce((count, ingredient) => count + this.foodsByIngredient.get(ingredient)!.length, 0);
    }

    canonicalIngredientList() {
        let { ingredientsConcernedByAllergens } = this.determineIngredientsThatCantPossiblyContainAnyAllergens();
        ingredientsConcernedByAllergens.sort((ing1, ing2) => ing1.allergen.localeCompare(ing2.allergen));
        return ingredientsConcernedByAllergens.map(ing => ing.ingredient).join(",");
    }


    static createFrom(str: string) {
        let foods = str.split("\n").map(D21Food.createFrom);
        return new D21ListOfFoods(foods);
    }
}