
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

    performDailyChanges(numberOfDays: number) {
        for(let i=0; i<numberOfDays; i++) {
            this.performDailyChange();
        }
        return this;
    }

    performDailyChange() {
        const newBlackTilesGrid = new Map(this.blackTiles);
        const {blackTileKeysToRemove, uniqueWhiteTileKeysAroundBlackTiles} = Array.from(this.blackTiles.values()).reduce(({blackTileKeysToRemove, uniqueWhiteTileKeysAroundBlackTiles}, tile) => {
            let adjacentTiles = this.tilesAround(tile);
            const adjacentBlackTiles = adjacentTiles.filter(t => t.v==="black");
            if(adjacentBlackTiles.length === 0 || adjacentBlackTiles.length > 2) {
                blackTileKeysToRemove.push(D24Grid.extractTileCoordsKey(tile));
            }
            adjacentTiles.filter(t => t.v==="white").forEach(t => {
                uniqueWhiteTileKeysAroundBlackTiles.add(D24Grid.extractTileCoordsKey(t));
            })

            return {blackTileKeysToRemove, uniqueWhiteTileKeysAroundBlackTiles};
        }, {blackTileKeysToRemove: [], uniqueWhiteTileKeysAroundBlackTiles: new Set<string>()} as {blackTileKeysToRemove: string[], uniqueWhiteTileKeysAroundBlackTiles: Set<string>})

        blackTileKeysToRemove.forEach(k => newBlackTilesGrid.delete(k));
        uniqueWhiteTileKeysAroundBlackTiles.forEach(k => {
            const [x,y,z] = k.split("_").map(Number);
            let adjacentTiles = this.tilesAround({x,y,z});
            if(adjacentTiles.filter(t => t.v==="black").length === 2) {
                newBlackTilesGrid.set(k, {x,y,z,v:"black"});
            }
        })

        this.blackTiles = newBlackTilesGrid;

        return this;
    }

    tilesAround({x,y,z}:{x:number, y:number, z:number}): D24Tile[] {
        return [
            {x: x, y: y-1, z: z+1},
            {x: x, y: y+1, z: z-1},
            {x: x+1, y: y-1, z: z},
            {x: x-1, y: y+1, z: z},
            {x: x-1, y: y, z: z+1},
            {x: x+1, y: y, z: z-1},
        ].map(coord => ({...coord, v: this.blackTiles.has(D24Grid.extractTileCoordsKey(coord))?"black":"white"}));
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

