
export const D22_SAMPLE = {
    rawString: `
Player 1:
9
2
6
3
1

Player 2:
5
8
4
7
10
    `.trim(),
    expectedQ1Output: `
-- Round 1 --
Player 1's deck: 9, 2, 6, 3, 1
Player 2's deck: 5, 8, 4, 7, 10
Player 1 plays: 9
Player 2 plays: 5
Player 1 wins the round!

-- Round 2 --
Player 1's deck: 2, 6, 3, 1, 9, 5
Player 2's deck: 8, 4, 7, 10
Player 1 plays: 2
Player 2 plays: 8
Player 2 wins the round!

-- Round 3 --
Player 1's deck: 6, 3, 1, 9, 5
Player 2's deck: 4, 7, 10, 8, 2
Player 1 plays: 6
Player 2 plays: 4
Player 1 wins the round!

-- Round 4 --
Player 1's deck: 3, 1, 9, 5, 6, 4
Player 2's deck: 7, 10, 8, 2
Player 1 plays: 3
Player 2 plays: 7
Player 2 wins the round!

-- Round 5 --
Player 1's deck: 1, 9, 5, 6, 4
Player 2's deck: 10, 8, 2, 7, 3
Player 1 plays: 1
Player 2 plays: 10
Player 2 wins the round!

-- Round 6 --
Player 1's deck: 9, 5, 6, 4
Player 2's deck: 8, 2, 7, 3, 10, 1
Player 1 plays: 9
Player 2 plays: 8
Player 1 wins the round!

-- Round 7 --
Player 1's deck: 5, 6, 4, 9, 8
Player 2's deck: 2, 7, 3, 10, 1
Player 1 plays: 5
Player 2 plays: 2
Player 1 wins the round!

-- Round 8 --
Player 1's deck: 6, 4, 9, 8, 5, 2
Player 2's deck: 7, 3, 10, 1
Player 1 plays: 6
Player 2 plays: 7
Player 2 wins the round!

-- Round 9 --
Player 1's deck: 4, 9, 8, 5, 2
Player 2's deck: 3, 10, 1, 7, 6
Player 1 plays: 4
Player 2 plays: 3
Player 1 wins the round!

-- Round 10 --
Player 1's deck: 9, 8, 5, 2, 4, 3
Player 2's deck: 10, 1, 7, 6
Player 1 plays: 9
Player 2 plays: 10
Player 2 wins the round!

-- Round 11 --
Player 1's deck: 8, 5, 2, 4, 3
Player 2's deck: 1, 7, 6, 10, 9
Player 1 plays: 8
Player 2 plays: 1
Player 1 wins the round!

-- Round 12 --
Player 1's deck: 5, 2, 4, 3, 8, 1
Player 2's deck: 7, 6, 10, 9
Player 1 plays: 5
Player 2 plays: 7
Player 2 wins the round!

-- Round 13 --
Player 1's deck: 2, 4, 3, 8, 1
Player 2's deck: 6, 10, 9, 7, 5
Player 1 plays: 2
Player 2 plays: 6
Player 2 wins the round!

-- Round 14 --
Player 1's deck: 4, 3, 8, 1
Player 2's deck: 10, 9, 7, 5, 6, 2
Player 1 plays: 4
Player 2 plays: 10
Player 2 wins the round!

-- Round 15 --
Player 1's deck: 3, 8, 1
Player 2's deck: 9, 7, 5, 6, 2, 10, 4
Player 1 plays: 3
Player 2 plays: 9
Player 2 wins the round!

-- Round 16 --
Player 1's deck: 8, 1
Player 2's deck: 7, 5, 6, 2, 10, 4, 9, 3
Player 1 plays: 8
Player 2 plays: 7
Player 1 wins the round!

-- Round 17 --
Player 1's deck: 1, 8, 7
Player 2's deck: 5, 6, 2, 10, 4, 9, 3
Player 1 plays: 1
Player 2 plays: 5
Player 2 wins the round!

-- Round 18 --
Player 1's deck: 8, 7
Player 2's deck: 6, 2, 10, 4, 9, 3, 5, 1
Player 1 plays: 8
Player 2 plays: 6
Player 1 wins the round!

-- Round 19 --
Player 1's deck: 7, 8, 6
Player 2's deck: 2, 10, 4, 9, 3, 5, 1
Player 1 plays: 7
Player 2 plays: 2
Player 1 wins the round!

-- Round 20 --
Player 1's deck: 8, 6, 7, 2
Player 2's deck: 10, 4, 9, 3, 5, 1
Player 1 plays: 8
Player 2 plays: 10
Player 2 wins the round!

-- Round 21 --
Player 1's deck: 6, 7, 2
Player 2's deck: 4, 9, 3, 5, 1, 10, 8
Player 1 plays: 6
Player 2 plays: 4
Player 1 wins the round!

-- Round 22 --
Player 1's deck: 7, 2, 6, 4
Player 2's deck: 9, 3, 5, 1, 10, 8
Player 1 plays: 7
Player 2 plays: 9
Player 2 wins the round!

-- Round 23 --
Player 1's deck: 2, 6, 4
Player 2's deck: 3, 5, 1, 10, 8, 9, 7
Player 1 plays: 2
Player 2 plays: 3
Player 2 wins the round!

-- Round 24 --
Player 1's deck: 6, 4
Player 2's deck: 5, 1, 10, 8, 9, 7, 3, 2
Player 1 plays: 6
Player 2 plays: 5
Player 1 wins the round!

-- Round 25 --
Player 1's deck: 4, 6, 5
Player 2's deck: 1, 10, 8, 9, 7, 3, 2
Player 1 plays: 4
Player 2 plays: 1
Player 1 wins the round!

-- Round 26 --
Player 1's deck: 6, 5, 4, 1
Player 2's deck: 10, 8, 9, 7, 3, 2
Player 1 plays: 6
Player 2 plays: 10
Player 2 wins the round!

-- Round 27 --
Player 1's deck: 5, 4, 1
Player 2's deck: 8, 9, 7, 3, 2, 10, 6
Player 1 plays: 5
Player 2 plays: 8
Player 2 wins the round!

-- Round 28 --
Player 1's deck: 4, 1
Player 2's deck: 9, 7, 3, 2, 10, 6, 8, 5
Player 1 plays: 4
Player 2 plays: 9
Player 2 wins the round!

-- Round 29 --
Player 1's deck: 1
Player 2's deck: 7, 3, 2, 10, 6, 8, 5, 9, 4
Player 1 plays: 1
Player 2 plays: 7
Player 2 wins the round!


== Post-game results ==
Player 1's deck: 
Player 2's deck: 3, 2, 10, 6, 8, 5, 9, 4, 7, 1
    `.trim(),

    expectedQ2Output: `
=== Game 1 ===

-- Round 1 (Game 1) --
Player 1's deck: 9, 2, 6, 3, 1
Player 2's deck: 5, 8, 4, 7, 10
Player 1 plays: 9
Player 2 plays: 5
Player 1 wins round 1 of game 1!

-- Round 2 (Game 1) --
Player 1's deck: 2, 6, 3, 1, 9, 5
Player 2's deck: 8, 4, 7, 10
Player 1 plays: 2
Player 2 plays: 8
Player 2 wins round 2 of game 1!

-- Round 3 (Game 1) --
Player 1's deck: 6, 3, 1, 9, 5
Player 2's deck: 4, 7, 10, 8, 2
Player 1 plays: 6
Player 2 plays: 4
Player 1 wins round 3 of game 1!

-- Round 4 (Game 1) --
Player 1's deck: 3, 1, 9, 5, 6, 4
Player 2's deck: 7, 10, 8, 2
Player 1 plays: 3
Player 2 plays: 7
Player 2 wins round 4 of game 1!

-- Round 5 (Game 1) --
Player 1's deck: 1, 9, 5, 6, 4
Player 2's deck: 10, 8, 2, 7, 3
Player 1 plays: 1
Player 2 plays: 10
Player 2 wins round 5 of game 1!

-- Round 6 (Game 1) --
Player 1's deck: 9, 5, 6, 4
Player 2's deck: 8, 2, 7, 3, 10, 1
Player 1 plays: 9
Player 2 plays: 8
Player 1 wins round 6 of game 1!

-- Round 7 (Game 1) --
Player 1's deck: 5, 6, 4, 9, 8
Player 2's deck: 2, 7, 3, 10, 1
Player 1 plays: 5
Player 2 plays: 2
Player 1 wins round 7 of game 1!

-- Round 8 (Game 1) --
Player 1's deck: 6, 4, 9, 8, 5, 2
Player 2's deck: 7, 3, 10, 1
Player 1 plays: 6
Player 2 plays: 7
Player 2 wins round 8 of game 1!

-- Round 9 (Game 1) --
Player 1's deck: 4, 9, 8, 5, 2
Player 2's deck: 3, 10, 1, 7, 6
Player 1 plays: 4
Player 2 plays: 3
Playing a sub-game to determine the winner...

=== Game 2 ===

-- Round 1 (Game 2) --
Player 1's deck: 9, 8, 5, 2
Player 2's deck: 10, 1, 7
Player 1 plays: 9
Player 2 plays: 10
Player 2 wins round 1 of game 2!

-- Round 2 (Game 2) --
Player 1's deck: 8, 5, 2
Player 2's deck: 1, 7, 10, 9
Player 1 plays: 8
Player 2 plays: 1
Player 1 wins round 2 of game 2!

-- Round 3 (Game 2) --
Player 1's deck: 5, 2, 8, 1
Player 2's deck: 7, 10, 9
Player 1 plays: 5
Player 2 plays: 7
Player 2 wins round 3 of game 2!

-- Round 4 (Game 2) --
Player 1's deck: 2, 8, 1
Player 2's deck: 10, 9, 7, 5
Player 1 plays: 2
Player 2 plays: 10
Player 2 wins round 4 of game 2!

-- Round 5 (Game 2) --
Player 1's deck: 8, 1
Player 2's deck: 9, 7, 5, 10, 2
Player 1 plays: 8
Player 2 plays: 9
Player 2 wins round 5 of game 2!

-- Round 6 (Game 2) --
Player 1's deck: 1
Player 2's deck: 7, 5, 10, 2, 9, 8
Player 1 plays: 1
Player 2 plays: 7
Player 2 wins round 6 of game 2!
The winner of game 2 is player 2!

...anyway, back to game 1.
Player 2 wins round 9 of game 1!

-- Round 10 (Game 1) --
Player 1's deck: 9, 8, 5, 2
Player 2's deck: 10, 1, 7, 6, 3, 4
Player 1 plays: 9
Player 2 plays: 10
Player 2 wins round 10 of game 1!

-- Round 11 (Game 1) --
Player 1's deck: 8, 5, 2
Player 2's deck: 1, 7, 6, 3, 4, 10, 9
Player 1 plays: 8
Player 2 plays: 1
Player 1 wins round 11 of game 1!

-- Round 12 (Game 1) --
Player 1's deck: 5, 2, 8, 1
Player 2's deck: 7, 6, 3, 4, 10, 9
Player 1 plays: 5
Player 2 plays: 7
Player 2 wins round 12 of game 1!

-- Round 13 (Game 1) --
Player 1's deck: 2, 8, 1
Player 2's deck: 6, 3, 4, 10, 9, 7, 5
Player 1 plays: 2
Player 2 plays: 6
Playing a sub-game to determine the winner...

=== Game 3 ===

-- Round 1 (Game 3) --
Player 1's deck: 8, 1
Player 2's deck: 3, 4, 10, 9, 7, 5
Player 1 plays: 8
Player 2 plays: 3
Player 1 wins round 1 of game 3!

-- Round 2 (Game 3) --
Player 1's deck: 1, 8, 3
Player 2's deck: 4, 10, 9, 7, 5
Player 1 plays: 1
Player 2 plays: 4
Playing a sub-game to determine the winner...

=== Game 4 ===

-- Round 1 (Game 4) --
Player 1's deck: 8
Player 2's deck: 10, 9, 7, 5
Player 1 plays: 8
Player 2 plays: 10
Player 2 wins round 1 of game 4!
The winner of game 4 is player 2!

...anyway, back to game 3.
Player 2 wins round 2 of game 3!

-- Round 3 (Game 3) --
Player 1's deck: 8, 3
Player 2's deck: 10, 9, 7, 5, 4, 1
Player 1 plays: 8
Player 2 plays: 10
Player 2 wins round 3 of game 3!

-- Round 4 (Game 3) --
Player 1's deck: 3
Player 2's deck: 9, 7, 5, 4, 1, 10, 8
Player 1 plays: 3
Player 2 plays: 9
Player 2 wins round 4 of game 3!
The winner of game 3 is player 2!

...anyway, back to game 1.
Player 2 wins round 13 of game 1!

-- Round 14 (Game 1) --
Player 1's deck: 8, 1
Player 2's deck: 3, 4, 10, 9, 7, 5, 6, 2
Player 1 plays: 8
Player 2 plays: 3
Player 1 wins round 14 of game 1!

-- Round 15 (Game 1) --
Player 1's deck: 1, 8, 3
Player 2's deck: 4, 10, 9, 7, 5, 6, 2
Player 1 plays: 1
Player 2 plays: 4
Playing a sub-game to determine the winner...

=== Game 5 ===

-- Round 1 (Game 5) --
Player 1's deck: 8
Player 2's deck: 10, 9, 7, 5
Player 1 plays: 8
Player 2 plays: 10
Player 2 wins round 1 of game 5!
The winner of game 5 is player 2!

...anyway, back to game 1.
Player 2 wins round 15 of game 1!

-- Round 16 (Game 1) --
Player 1's deck: 8, 3
Player 2's deck: 10, 9, 7, 5, 6, 2, 4, 1
Player 1 plays: 8
Player 2 plays: 10
Player 2 wins round 16 of game 1!

-- Round 17 (Game 1) --
Player 1's deck: 3
Player 2's deck: 9, 7, 5, 6, 2, 4, 1, 10, 8
Player 1 plays: 3
Player 2 plays: 9
Player 2 wins round 17 of game 1!
The winner of game 1 is player 2!


== Post-game results ==
Player 1's deck: 
Player 2's deck: 7, 5, 6, 2, 4, 1, 10, 8, 9, 3
    `.trim()
};

export const D22_INFINITE_LOOP_SAMPLE = {
    rawString: `
Player 1:
43
19

Player 2:
2
29
14
    `.trim(),
    expectedOutput: `
=== Game 1 ===

-- Round 1 (Game 1) --
Player 1's deck: 43, 19
Player 2's deck: 2, 29, 14
Player 1 plays: 43
Player 2 plays: 2
Player 1 wins round 1 of game 1!

-- Round 2 (Game 1) --
Player 1's deck: 19, 43, 2
Player 2's deck: 29, 14
Player 1 plays: 19
Player 2 plays: 29
Player 2 wins round 2 of game 1!

-- Round 3 (Game 1) --
Player 1's deck: 43, 2
Player 2's deck: 14, 29, 19
Player 1 plays: 43
Player 2 plays: 14
Player 1 wins round 3 of game 1!

-- Round 4 (Game 1) --
Player 1's deck: 2, 43, 14
Player 2's deck: 29, 19
Player 1 plays: 2
Player 2 plays: 29
Player 2 wins round 4 of game 1!

-- Round 5 (Game 1) --
Player 1's deck: 43, 14
Player 2's deck: 19, 29, 2
Player 1 plays: 43
Player 2 plays: 19
Player 1 wins round 5 of game 1!

-- Round 6 (Game 1) --
Player 1's deck: 14, 43, 19
Player 2's deck: 29, 2
Player 1 plays: 14
Player 2 plays: 29
Player 2 wins round 6 of game 1!

Infinite loop detected on Game 1 Round 7 : considering Player 1 as a winner...
The winner of game 1 is player 1!


== Post-game results ==
Player 1's deck: 43, 19
Player 2's deck: 2, 29, 14
    `.trim()
};

export const D22_INPUT = `
Player 1:
44
24
36
6
27
46
33
45
47
41
15
23
40
38
43
42
25
5
30
35
34
13
29
1
50

Player 2:
32
28
4
12
9
21
48
18
31
39
20
16
3
37
49
7
17
22
8
26
2
14
11
19
10
`.trim()