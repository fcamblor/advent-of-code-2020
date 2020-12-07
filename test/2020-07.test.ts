import {countBagsContainingShinyBag} from "../src/2020-07";


test('should bags containing shiny gold bag computation matches Q1 sample expectations', () => {
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
        [1, 1+ 1*(1+ 1*(0+ 1*(1+ 3*1 + 4*1) + 2*(1+ 5*1 + 6*1))) + 2*(1+ 2*(0+ 1*(1+ 3*1 + 4*1) + 2*(1+ 5*1 + 6*1)) + 9*1)],
        [1, 1+ 3*(1+ 1*(0+ 1*(1+ 3*1 + 4*1) + 2*(1+ 5*1 + 6*1))) + 4*(1+ 2*(0+ 1*(1+ 3*1 + 4*1) + 2*(1+ 5*1 + 6*1)) + 9*1)],
        [1, 1+ 1*(0+ 1*(1+ 3*1 + 4*1) + 2*(1+ 5*1 + 6*1))],
        [1, 1+ 2*(0+ 1*(1+ 3*1 + 4*1) + 2*(1+ 5*1 + 6*1)) + 9*1],
        [0, 0+ 1*(1+ 3*1 + 4*1) + 2*(1+ 5*1 + 6*1)],
        [0, 1+ 3*1 + 4*1],
        [0, 1+ 5*1 + 6*1],
        [0, 1],
        [0, 1]
    ]);
})

test('should bags containing shiny gold bag computation matches Q2 sample expectations', () => {
    const startingBagsCells = [
        [ "shiny gold" ],
        [ "dark red" ],
        [ "dark orange" ],
        [ "dark yellow" ],
        [ "dark green" ],
        [ "dark blue" ],
        [ "dark violet" ],
    ];
    const containingBags = [
        [ "2", "dark red"    ],
        [ "2", "dark orange" ],
        [ "2", "dark yellow" ],
        [ "2", "dark green"  ],
        [ "2", "dark blue"   ],
        [ "2", "dark violet" ],
        [ "" , "" ],
    ];
    expect(countBagsContainingShinyBag(startingBagsCells, containingBags)).toEqual([
        [0, 0+ 2*(1+ 2*(1+ 2*(1+ 2*(1+ 2*(1+ 2*1)))))],
        [0, 1+ 2*(1+ 2*(1+ 2*(1+ 2*(1+ 2*1))))],
        [0, 1+ 2*(1+ 2*(1+ 2*(1+ 2*1)))],
        [0, 1+ 2*(1+ 2*(1+ 2*1))],
        [0, 1+ 2*(1+ 2*1)],
        [0, 1+ 2*1],
        [0, 1]
    ]);
})
