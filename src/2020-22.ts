

type D20Card = number;

export class D22Player {
    constructor(public readonly name: string, public readonly deck: D20Card[]) {
    }

    deckNotEmpty(){ return !!this.deck.length; }
    playNextCard() { return this.deck.shift()!; }
    addCardsToDeck([c1, c2]: [ D20Card, D20Card ]) {
        this.deck.push(...[c1, c2])
    }
    score() {
        return this.deck.reduce((score, card, index) => {
            return score + card*(this.deck.length-index);
        }, 0)
    }
}

export class D22CombatGame {
    constructor(private readonly player1: D22Player, private readonly player2: D22Player) {
    }


    play() {
        let round = 1;
        while(this.player1.deckNotEmpty() && this.player2.deckNotEmpty()) {
            const card1 = this.player1.playNextCard();
            const card2 = this.player2.playNextCard();

            if(card1 > card2) {
                this.player1.addCardsToDeck([ card1, card2 ]);
            } else {
                this.player2.addCardsToDeck([ card2, card1 ]);
            }

            turn++;
        }

        return this;
    }


    winnerScore() {
        const winner = this.player1.canPlay()?this.player1:this.player2;
        return winner.score();
    }

    static createFrom(str: string) {
        const [ player1, player2 ] = str.split("\n\n").map(str => str.trim()).map(playerStr => {
            const [ name, ...cards ] = playerStr.split("\n");
            return new D22Player(name.split(":")[0], cards.map(Number));
        })

        return new D22CombatGame(player1, player2);
    }
}