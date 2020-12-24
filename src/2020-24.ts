
type D24TileValue = "black"|"white"
export type D24Tile = { x: number, y: number, z: number; v: D24TileValue; }

export class D24Grid {
    private blackTiles: Map<string, D24Tile>;
    constructor(coords: {x:number, y:number, z:number}[]) {
        this.blackTiles = coords.reduce((blackTilesMap, coord) => {
            let key = D24Grid.extractTileCoordsKey(coord);
            if(blackTilesMap.has(key)) {
                blackTilesMap.delete(key);
            } else {
                blackTilesMap.set(key, {...coord, v: 'white' as D24TileValue});
            }
            return blackTilesMap;
        }, new Map<string, D24Tile>())
    }

    countBlacks() {
        return this.blackTiles.size;
    }

    static extractTileCoordsKey({x,y,z}:{x:number, y:number, z:number}) {
        return `${x}_${y}_${z}`
    }

    static createFrom(str: string) {
        const tilePlacementRegex = new RegExp("(se|sw|ne|nw|e|w)", "g");
        const coords = str.split("\n").map(line => {
            const placements = line.split(tilePlacementRegex).filter(s => s !== "");
            const coord = placements.reduce((coord, placement) => {
                switch(placement) {
                    case "w": coord.x--; coord.y++; break;
                    case "e": coord.x++; coord.y--; break;
                    case "ne": coord.x++; coord.z--; break;
                    case "sw": coord.x--; coord.z++; break;
                    case "se": coord.z++; coord.y--; break;
                    case "nw": coord.z--; coord.y++; break;
                    default: new Error(`Unexpected placement : ${placement}`)
                }
                return coord;
            }, {x:0,y:0,z:0});

            return coord;
        });
        return new D24Grid(coords)
    }
}

