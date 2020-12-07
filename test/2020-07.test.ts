import {countBagsContainingShinyBag} from "../src/2020-07";


test('should bags containing shiny gold bag computation matches sample expectations', () => {
    const startingBagsCells = [
        [ "light red" ],
        [ "dark orange" ],
        [ "bright white" ],
        [ "muted yellow" ],
        [ "shiny gold" ],
        [ "dark olive" ],
        [ "vibrant plum" ],
        [ "faded blue" ],
        [ "dotted black" ],
    ];
    const containingBags = [
        [ "1", "bright white"	, "2", "muted yellow" ],
        [ "3", "bright white"	, "4", "muted yellow" ],
        [ "1", "shiny gold"     ,  "", ""             ],
        [ "2", "shiny gold"	    , "9", "faded blue"   ],
        [ "1", "dark olive"	    , "2", "vibrant plum" ],
        [ "3", "faded blue"	    , "4", "dotted black" ],
        [ "5", "faded blue"	    , "6", "dotted black" ],
        [ "" , ""        	    , "" , ""             ],
        [ "" , ""        	    , "" , ""             ],
    ];
    expect(countBagsContainingShinyBag(startingBagsCells, containingBags)).toEqual([
        [1],
        [1],
        [1],
        [1],
        [0],
        [0],
        [0],
        [0],
        [0]
    ]);
})
