

type D20Card = number;

export class D22Player {
    constructor(public readonly name: string, public readonly deck: D20Card[]) {
    }

    deckNotEmpty(){ return !this.deckIsEmpty(); }
    deckIsEmpty(){ return this.deck.length===0; }
    playNextCard() { return this.deck.shift()!; }
    addCardsToDeck([c1, c2]: [ D20Card, D20Card ]) {
        this.deck.push(...[c1, c2])
    }
    score() {
        return this.deck.reduce((score, card, index) => {
            return score + card*(this.deck.length-index);
        }, 0)
    }

    cloneWithDeckSizeOf(deckSize: number) {
        return new ClonedD22Player(this.name, [...this.deck.slice(0, deckSize)], this);
    }
}

export class ClonedD22Player extends D22Player {
    constructor(name: string, deck: D20Card[], public readonly clonedPlayer: D22Player) {
        super(name, deck)
    }
}

export class D22CombatGame {

    static play(player1: D22Player, player2: D22Player) {
        const outputs = [] as string[];
        let currentGame = { player1: player1, player2: player2, gameId: 1, card1: -1, card2: -1, round: 1 }
        while(currentGame.player1.deckNotEmpty() && currentGame.player2.deckNotEmpty()) {
            outputs.push(`-- Round ${currentGame.round} --`);
            outputs.push(`${currentGame.player1.name}'s deck: ${currentGame.player1.deck.join(", ")}`);
            outputs.push(`${currentGame.player2.name}'s deck: ${currentGame.player2.deck.join(", ")}`);

            currentGame.card1 = currentGame.player1.playNextCard();
            currentGame.card2 = currentGame.player2.playNextCard();

            outputs.push(`${currentGame.player1.name} plays: ${currentGame.card1}`);
            outputs.push(`${currentGame.player2.name} plays: ${currentGame.card2}`);

            if(currentGame.card1 > currentGame.card2) {
                currentGame.player1.addCardsToDeck([ currentGame.card1, currentGame.card2 ]);
                outputs.push(`${currentGame.player1.name} wins the round!`);
            } else {
                currentGame.player2.addCardsToDeck([ currentGame.card2, currentGame.card1 ]);
                outputs.push(`${currentGame.player2.name} wins the round!`);
            }

            currentGame.round++;
            outputs.push(``);
        }

        outputs.push(``)
        outputs.push(`== Post-game results ==`)
        outputs.push(`${currentGame.player1.name}'s deck: ${currentGame.player1.deck.join(", ")}`)
        outputs.push(`${currentGame.player2.name}'s deck: ${currentGame.player2.deck.join(", ")}`)

        const winner = currentGame.player1.deckNotEmpty()?currentGame.player1:currentGame.player2;
        return { winner, outputs };
    }
}

type D22RecursiveCombatGame = {player1:D22Player, player2:D22Player, gameId: number, round: number, card1: number, card2: number, uniqueRoundPrevention: Set<string>};
type D22RecursiveCombatGameState = { gamesStack: D22RecursiveCombatGame[], nextGameId: number, latestGame: D22RecursiveCombatGame|undefined };
export class D22RecursiveCombat {

    static stackNewGame(state: D22RecursiveCombatGameState, gameInfos: Omit<D22RecursiveCombatGame, "gameId"|"card1"|"card2"|"uniqueRoundPrevention">): D22RecursiveCombatGame  {
        let newGame: D22RecursiveCombatGame = {...gameInfos, gameId: state.nextGameId, card1: -1, card2: -1, uniqueRoundPrevention: new Set<string>() };
        state.gamesStack.push(newGame);
        state.nextGameId++;
        return newGame;
    }

    static play(player1: D22Player, player2: D22Player) {
        // For debug purposes, change this value to a specific value to look for infinite loops
        const MAX_NUMBER_OF_OVERALL_ROUNDS = Infinity;
        let overallRound = 1;

        const outputs = [];
        const recursiveGameState: D22RecursiveCombatGameState = { gamesStack: [], nextGameId: 1, latestGame: undefined };
        let currentGame: D22RecursiveCombatGame|undefined = D22RecursiveCombat.stackNewGame(recursiveGameState, { player1, player2, round: 1 });

        outputs.push(`=== Game ${currentGame.gameId} ===`)
        outputs.push(``)

        while(currentGame !== undefined && overallRound<MAX_NUMBER_OF_OVERALL_ROUNDS) {
            let gameChecksum = `g:${currentGame.gameId};p1:${currentGame.player1.deck.join(",")};p2:${currentGame.player2.deck.join(",")}`
            while(currentGame !== undefined && currentGame.uniqueRoundPrevention.has(gameChecksum)) {
                const gameWinner = currentGame.player1;
                currentGame = D22RecursiveCombat.declareGameWinner(gameWinner, currentGame, recursiveGameState, outputs);
                if (currentGame !== undefined) {
                    gameChecksum = `g:${currentGame.gameId};p1:${currentGame.player1.deck.join(",")};p2:${currentGame.player2.deck.join(",")}`
                }
            }
            if(currentGame === undefined) {
                break;
            }
            currentGame.uniqueRoundPrevention.add(gameChecksum);

            outputs.push(`-- Round ${currentGame.round} (Game ${currentGame.gameId}) --`);
            outputs.push(`${currentGame.player1.name}'s deck: ${currentGame.player1.deck.join(", ")}`);
            outputs.push(`${currentGame.player2.name}'s deck: ${currentGame.player2.deck.join(", ")}`);

            currentGame.card1 = currentGame.player1.playNextCard();
            currentGame.card2 = currentGame.player2.playNextCard();

            outputs.push(`${currentGame.player1.name} plays: ${currentGame.card1}`);
            outputs.push(`${currentGame.player2.name} plays: ${currentGame.card2}`);

            if(currentGame.card1 <= currentGame.player1.deck.length && currentGame.card2 <= currentGame.player2.deck.length) {
                currentGame = D22RecursiveCombat.stackNewGame(recursiveGameState, {
                    player1: currentGame.player1.cloneWithDeckSizeOf(currentGame.card1),
                    player2: currentGame.player2.cloneWithDeckSizeOf(currentGame.card2),
                    round: 0,
                });

                outputs.push("Playing a sub-game to determine the winner...");

                outputs.push(``)
                outputs.push(`=== Game ${currentGame.gameId} ===`)
            } else {
                let roundWinner;
                if(currentGame.card1 > currentGame.card2) {
                    currentGame.player1.addCardsToDeck([ currentGame.card1, currentGame.card2 ]);
                    roundWinner = currentGame.player1;
                } else {
                    currentGame.player2.addCardsToDeck([ currentGame.card2, currentGame.card1 ]);
                    roundWinner = currentGame.player2;
                }
                outputs.push(`${roundWinner.name} wins round ${currentGame.round} of game ${currentGame.gameId}!`);

                while(currentGame !== undefined && (currentGame.player1.deckIsEmpty() || currentGame.player2.deckIsEmpty())) {
                    const gameWinner = currentGame.player1.deckIsEmpty()?currentGame.player2:currentGame.player1;
                    currentGame = D22RecursiveCombat.declareGameWinner(gameWinner, currentGame, recursiveGameState, outputs);
                }

                if(currentGame === undefined) {
                    break;
                }
            }

            currentGame.round++;
            overallRound++;

            outputs.push(``);
        }

        return D22RecursiveCombat.endOfGame(recursiveGameState.latestGame, outputs);
    }

    private static declareGameWinner(gameWinner: D22Player, currentGame: D22RecursiveCombatGame, recursiveGameState: D22RecursiveCombatGameState, outputs: string[]) {
        // toLowerCase() here shows that test is not really taking into account true player name here unfortunately !
        outputs.push(`The winner of game ${currentGame.gameId} is ${gameWinner.name.toLowerCase()}!`)
        outputs.push(``)

        recursiveGameState.latestGame = recursiveGameState.gamesStack.pop();
        const previouslyStackedGame = recursiveGameState.gamesStack.length===0?undefined:recursiveGameState.gamesStack[recursiveGameState.gamesStack.length-1];
        if(previouslyStackedGame !== undefined) {
            const clonedGameWinner = gameWinner as ClonedD22Player;
            outputs.push(`...anyway, back to game ${previouslyStackedGame.gameId}.`)
            outputs.push(`${gameWinner.name} wins round ${previouslyStackedGame.round} of game ${previouslyStackedGame.gameId}!`);

            // Not sure if the problem statement is very clear on this...
            // clonedGameWinner.clonedPlayer.addCardsToDeck([ Math.min(...[previouslyStackedGame.card1, previouslyStackedGame.card2]), Math.max(...[previouslyStackedGame.card1, previouslyStackedGame.card2]) ]);
            if(clonedGameWinner.clonedPlayer.name === "Player 1") {
                clonedGameWinner.clonedPlayer.addCardsToDeck([ previouslyStackedGame.card1, previouslyStackedGame.card2 ]);
            } else {
                clonedGameWinner.clonedPlayer.addCardsToDeck([ previouslyStackedGame.card2, previouslyStackedGame.card1 ]);
            }
        }
        return previouslyStackedGame;
    }

    private static endOfGame(game: D22RecursiveCombatGame|undefined, outputs: string[], forcedWinner: D22Player|undefined = undefined) {
        let winner = undefined;
        if(game !== undefined){
            outputs.push(``)
            outputs.push(`== Post-game results ==`)
            outputs.push(`${game.player1.name}'s deck: ${game.player1.deck.join(", ")}`)
            outputs.push(`${game.player2.name}'s deck: ${game.player2.deck.join(", ")}`)

            if(forcedWinner === undefined) {
                winner = game.player1.deckNotEmpty()?game.player1:game.player2;
            } else {
                winner = forcedWinner;
            }
        }
        return { winner, outputs: outputs };
    }
}

export function d22play(str: string, game: (player1: D22Player, player2: D22Player) => {winner:D22Player|undefined, outputs: string[]}): {winner:D22Player|undefined, outputs: string[]} {
    const [ player1, player2 ] = str.split("\n\n").map(str => str.trim()).map(playerStr => {
        const [ name, ...cards ] = playerStr.split("\n");
        return new D22Player(name.split(":")[0], cards.map(Number));
    })

    return game(player1, player2);
}
