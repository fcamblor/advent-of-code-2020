import {
    bitsToNumber,
    cartesian,
    fill2DMatrix, fillAroundMatrix,
    findMapped,
    mapCreateIfAbsent, printMatrix,
    reduceRange,
    reduceTimes
} from "./utils";


type D20TileValue = "#"|"."
type D20TileEntry = {x:number, y:number, v: D20TileValue};
type D20Checksum = { cs: number, for: string };
type D20ChecksumConstraint = { north?: number[]|undefined, south?: number[]|undefined, west?: number[]|undefined, east?: number[]|undefined };

export class D20Tile {
    public readonly size: number;
    public readonly valByCoord: Map<string, D20TileEntry>;
    public readonly checksums: {
        firstRow: D20Checksum,
        lastRow: D20Checksum,
        firstRowReversed: D20Checksum,
        lastRowReversed: D20Checksum,
        firstCol: D20Checksum,
        lastCol: D20Checksum,
        firstColReversed: D20Checksum,
        lastColReversed: D20Checksum,
    };

    constructor(public readonly id: number, public readonly originalValues: D20TileEntry[]) {
        this.valByCoord = originalValues.reduce((valByCoord, val) => {
            valByCoord.set(D20Tile.coordsToKey(val), val);
            return valByCoord;
        }, new Map<string, D20TileEntry>());

        const maxX = Math.max(...this.originalValues.map(({x, ..._}) => x));
        const maxY = Math.max(...this.originalValues.map(({y, ..._}) => y));
        if(maxX !== maxY) {
            throw new Error(`Unexpected tiles values : this is not a square ! maxX=${maxX}, maxY=${maxY}`);
        }
        this.size = maxX + 1;

        this.checksums = {
            firstRow: D20Tile.checksumFor(this.extractRow(0)),
            lastRow: D20Tile.checksumFor(this.extractRow(this.size-1)),
            firstRowReversed: D20Tile.checksumFor(this.extractRow(0).reverse()),
            lastRowReversed: D20Tile.checksumFor(this.extractRow(this.size-1).reverse()),
            firstCol: D20Tile.checksumFor(this.extractCol(0)),
            lastCol: D20Tile.checksumFor(this.extractCol(this.size-1)),
            firstColReversed: D20Tile.checksumFor(this.extractCol(0).reverse()),
            lastColReversed: D20Tile.checksumFor(this.extractCol(this.size-1).reverse()),
        };
    }

    public checksumEntries() {
        return [
            {name: "firstRow", checksum: this.checksums.firstRow},
            {name: "lastRow", checksum: this.checksums.lastRow},
            {name: "firstRowReversed", checksum: this.checksums.firstRowReversed},
            {name: "lastRowReversed", checksum: this.checksums.lastRowReversed},
            {name: "firstCol", checksum: this.checksums.firstCol},
            {name: "lastCol", checksum: this.checksums.lastCol},
            {name: "firstColReversed", checksum: this.checksums.firstColReversed},
            {name: "lastColReversed", checksum: this.checksums.lastColReversed},
        ];
    }

    private extractRow(rowNum: number) {
        return this.originalValues.filter(({y, ..._}) => y === rowNum).sort((e1, e2) => e1.x - e2.x);
    }
    private extractCol(colNum: number) {
        return this.originalValues.filter(({x, ..._}) => x === colNum).sort((e1, e2) => e1.y - e2.y);
    }

    public static createFrom(str: string) {
        const lines = str.split("\n");
        const tileId = Number(lines.shift()!.replace(/^Tile (\d+):$/g, "$1"));
        return new D20Tile(tileId, lines.map((row, y) => row.split("").map((cell, x) => ({x,y, v: cell as D20TileValue}))).flat());
    }

    public rotateClockwise(): D20Tile {
        return this.flipMajorDiagonal().flipY();
    }

    public flipX() {
        const flippedEntries = [] as D20TileEntry[];
        for(let x=0; x<this.size; x++) {
            for(let y=0; y<this.size; y++) {
                let originalTileEntry = this.entryAt({x,y});
                flippedEntries.push({ x: x, y: this.size - y - 1, v: originalTileEntry!.v });
            }
        }
        return new D20Tile(this.id, flippedEntries);
    }

    public flipY() {
        const flippedEntries = [] as D20TileEntry[];
        for(let x=0; x<this.size; x++) {
            for(let y=0; y<this.size; y++) {
                let originalTileEntry = this.entryAt({x,y});
                flippedEntries.push({ x: this.size - x - 1, y: y, v: originalTileEntry!.v });
            }
        }
        return new D20Tile(this.id, flippedEntries);
    }

    public flipXY() {
        return this.flipX().flipY();
    }

    public flipMajorDiagonal() {
        const flippedEntries = [] as D20TileEntry[];
        for(let x=0; x<this.size; x++) {
            for(let y=0; y<this.size; y++) {
                let originalTileEntry = this.entryAt({x,y});
                flippedEntries.push({ x: y, y: x, v: originalTileEntry!.v });
            }
        }
        return new D20Tile(this.id, flippedEntries);
    }

    public entryAt({x,y}: {x:number, y:number}): D20TileEntry|undefined {
        return this.valByCoord.get(D20Tile.coordsToKey({x,y}));
    }

    static readonly TRANSFORMATIONS_TO_APPLY: ( (tile: D20Tile) => D20Tile )[] = [
        (tile) => tile.rotateClockwise(),
        (tile) => tile.rotateClockwise(),
        (tile) => tile.rotateClockwise(),
        (tile) => tile.rotateClockwise(),
        (tile) => tile.flipX(),
        (tile) => tile.rotateClockwise(),
        (tile) => tile.rotateClockwise(),
        (tile) => tile.rotateClockwise(),
        (tile) => tile.rotateClockwise(),
        (tile) => tile.flipX().flipY(), // Re-flippingX reinitializes state
        (tile) => tile.rotateClockwise(),
        (tile) => tile.rotateClockwise(),
        (tile) => tile.rotateClockwise(),
        (tile) => tile.rotateClockwise(),
        (tile) => tile.flipX(),
        (tile) => tile.rotateClockwise(),
        (tile) => tile.rotateClockwise(),
        (tile) => tile.rotateClockwise(),
    ];
    public transformToMatch(checksumConstraints: D20ChecksumConstraint, throwExceptionIfNotMatch = true) {
        // No optimization yet... brute forcing possibilities...
        let candidateTile: D20Tile = this;
        let i=0;
        console.log(`Looking for transformation to match: ${JSON.stringify(checksumConstraints)}`)
        while(!candidateTile.matchesWith(checksumConstraints).matches && i<D20Tile.TRANSFORMATIONS_TO_APPLY.length) {
            candidateTile = D20Tile.TRANSFORMATIONS_TO_APPLY[i](candidateTile);
            i++;
        }
        if(!candidateTile.matchesWith(checksumConstraints)) {
            if(throwExceptionIfNotMatch) {
                throw new Error(`I guess there is a problem ... we were not able to find a match for constraint: ${JSON.stringify(checksumConstraints)}`);
            } else {
                return undefined;
            }
        }

        return candidateTile;
    }

    public matchesWith(checksumConstraints: D20ChecksumConstraint): { matches: boolean, suggestedTransformationsToMatch: ((tile: D20Tile) => D20Tile)[] } {
        let suggestedTransformationsToMatch: ((tile: D20Tile) => D20Tile)[] = [];
        if((checksumConstraints.north !== undefined && !checksumConstraints.north.includes(this.checksums.firstRow.cs))
            || (checksumConstraints.south !== undefined && !checksumConstraints.south.includes(this.checksums.lastRow.cs))
            || (checksumConstraints.west !== undefined && !checksumConstraints.west.includes(this.checksums.firstCol.cs))
            || (checksumConstraints.east !== undefined && !checksumConstraints.east.includes(this.checksums.lastCol.cs))
        ) {
            if(
                (checksumConstraints.north !== undefined && checksumConstraints.north.includes(this.checksums.firstRowReversed.cs))
                || (checksumConstraints.south !== undefined && checksumConstraints.south.includes(this.checksums.lastRowReversed.cs))
                || (checksumConstraints.west !== undefined && checksumConstraints.west.includes(this.checksums.firstColReversed.cs))
                || (checksumConstraints.east !== undefined && checksumConstraints.east.includes(this.checksums.lastColReversed.cs))
            ){
                suggestedTransformationsToMatch.push((tile => tile.flipY()));
            } else if(
                (checksumConstraints.north !== undefined && checksumConstraints.north.includes(this.checksums.lastRow.cs))
                || (checksumConstraints.south !== undefined && checksumConstraints.south.includes(this.checksums.firstRow.cs))
                || (checksumConstraints.west !== undefined && checksumConstraints.west.includes(this.checksums.lastCol.cs))
                || (checksumConstraints.east !== undefined && checksumConstraints.east.includes(this.checksums.firstCol.cs))
            ){
                suggestedTransformationsToMatch.push((tile => tile.flipX()));
            }
            return { matches: false, suggestedTransformationsToMatch };
        }

        return { matches: true, suggestedTransformationsToMatch: suggestedTransformationsToMatch };
    }

    public toDisplayableMatrix(): string[][] {
        const result = [] as string[][];
        for(var y=0; y<this.size; y++) {
            const row = [] as string[];
            for(var x=0; x<this.size; x++) {
                let en = this.entryAt({x,y});
                row.push(en===undefined?"?":en.v);
            }
            result.push(row);
        }
        return result;
    }

    public toString(detailed: boolean) {
        if(detailed) {
            return `tile=${this.id}
${this.toDisplayableMatrix().map(row => row.join("")).join("\n")}
checksums: ${JSON.stringify(this.checksums)}`;
        } else {
            return this.toDisplayableMatrix().map(row => row.join("")).join("\n");
        }
    }

    public static coordsToKey({x,y}: {x: number, y: number}) {
        return `${x}_${y}`;
    }

    public static checksumFor(sortedTileEntries: D20TileEntry[]) {
        return { cs: bitsToNumber(sortedTileEntries.map(e => e.v==="#"?"1":"0")), for: sortedTileEntries.map(e => e.v).join("") };
    }
}

type ChecksumEntry = { checksum: D20Checksum, tile: D20Tile, hint: string };
type PerTileIdBorderChecksums = Map<number, { tile: D20Tile, borderChecksums: { checksum: D20Checksum, hint: string }[] }>;
export class D20Puzzle {
    public readonly size: number;
    public readonly tilesPerChecksum: Map<number, ChecksumEntry[]>;
    private readonly tilesById: Map<number, D20Tile>;

    constructor(public readonly tiles: D20Tile[]) {
        this.tilesPerChecksum = tiles.reduce((tilesPerChecksum, tile) => {
            tile.checksumEntries().forEach(ce => {
                mapCreateIfAbsent(tilesPerChecksum, ce.checksum.cs, []).push({ checksum: ce.checksum, tile, hint: ce.name });
            });
            return tilesPerChecksum;
        }, new Map<number, ChecksumEntry[]>())

        this.tilesById = tiles.reduce((tilesById, tile) => {
            tilesById.set(tile.id, tile);
            return tilesById;
        }, new Map<number, D20Tile>())

        // Testing if we may have multiple candidates for a same tile border
        let checksumMatchingMoreThan2Tiles = Array.from(this.tilesPerChecksum.values()).filter(tiles => tiles.length > 2);
        if(checksumMatchingMoreThan2Tiles.length) {
            throw new Error("Ouch ... the same tile can be combined with more than only one other tile.. it may happen but it would complicate things a lot and I didn't handled it !...");
        }

        this.size = Math.sqrt(tiles.length);
    }

    public findBorderTiles() {
        const potentiallyDuplicatedTilesWithAtLeastOneBorderNotMatchingAnyOtherTile = Array.from(this.tilesPerChecksum.values()).filter(tiles => tiles.length === 1).map(tiles => tiles[0]);
        // Removing duplicates
        const perTileIdChecksumEntries = potentiallyDuplicatedTilesWithAtLeastOneBorderNotMatchingAnyOtherTile.reduce((perTileIdChecksumEntries, checksumEntry) => {
            mapCreateIfAbsent(perTileIdChecksumEntries, checksumEntry.tile.id, []).push(checksumEntry);
            return perTileIdChecksumEntries;
        }, new Map<number, ChecksumEntry[]>());

        let borderTileIds = Array.from(perTileIdChecksumEntries.keys());
        // Looking for tiles that appear exactly 4 times : firstCol, firstColReversed, firstRow, firstRowReversed
        // Those ones are in the corner... and we expect to have only 4 of them !
        const cornerTileCandidates = Array.from(perTileIdChecksumEntries.entries()).reduce((cornerTileCandidates, [tileId, checkSumEntries]) => {
            if(checkSumEntries.length > 4) {
                throw new Error("Houston, we have a problem...");
            }
            if(checkSumEntries.length === 4) {
                cornerTileCandidates.set(tileId, checkSumEntries);
            }
            return cornerTileCandidates;
        }, new Map<number, ChecksumEntry[]>());

        let cornerTileIds = Array.from(cornerTileCandidates.keys());
        if(cornerTileIds.length > 4) {
            throw new Error("Ouch, we have more than 4 border tile candidates ! (it may happen, but it would complicate things a lot and I didn't handled it !...)");
        }

        const cornerTilesChecksumEntries = cornerTileIds.reduce((perTileBorderChecksumEntries, tileId) => {
            perTileBorderChecksumEntries.set(tileId, { tile: this.tilesById.get(tileId)!, borderChecksums: perTileIdChecksumEntries.get(tileId)!.map(ce => ({ hint: ce.hint, checksum: ce.checksum })) });
            return perTileBorderChecksumEntries;
        }, new Map() as PerTileIdBorderChecksums);
        const borderTilesChecksumEntriesPerTileId = borderTileIds.reduce((perTileBorderChecksumEntries, tileId) => {
            perTileBorderChecksumEntries.set(tileId, { tile: this.tilesById.get(tileId)!, borderChecksums: perTileIdChecksumEntries.get(tileId)!.map(ce => ({ hint: ce.hint, checksum: ce.checksum })) });
            return perTileBorderChecksumEntries;
        }, new Map() as PerTileIdBorderChecksums);


        return {
            cornerTiles: cornerTileIds.map(tileId => this.tilesById.get(tileId)!),
            cornerTilesChecksumEntries,
            borderTiles: borderTileIds.map(tileId => this.tilesById.get(tileId)!),
            borderTilesChecksumEntriesPerTileId,
        };
    }

    public solvePuzzle(): SolvedPuzzle {
        let borderTiles = this.findBorderTiles();

        // Let's make some choices for corner tiles as we have a lot of possibilities dependending on flips/rotates
        // Let's stick to only 1 configuration and solve the puzzle based on it

        const firstTileChecksumEntries = Array.from(borderTiles.cornerTilesChecksumEntries.values())[0]!;
        const firstTile = firstTileChecksumEntries.tile;

        console.log("first tile that needs to be transformed (maybe) : ")
        console.log(firstTile.toString(true));

        // trying all 4 possibilities to put it in NortWest position
        let northWestChecksumCandidates = cartesian(firstTileChecksumEntries.borderChecksums.map(ce => ce.checksum.cs), firstTileChecksumEntries.borderChecksums.map(ce => ce.checksum.cs)).filter(([cs1, cs2]) => cs1 !== cs2);
        const { northWestTile, northChecksum, westChecksum } = findMapped(northWestChecksumCandidates, ([ northChecksumCandidate, westChecksumCandidate ]) => {
            return {
                northWestTile: firstTile.transformToMatch({
                    north: [ northChecksumCandidate ],
                    west: [ westChecksumCandidate ]
                }, false),
                northChecksum: northChecksumCandidate,
                westChecksum: westChecksumCandidate
            };
        }, (value => !!value.northWestTile)) as { northWestTile: D20Tile, northChecksum: number, westChecksum: number };

        console.log("Transformed tile :")
        console.log(firstTileChecksumEntries.borderChecksums.find(ce => ce.checksum.cs === northChecksum)!.hint+" went to the north");
        console.log(firstTileChecksumEntries.borderChecksums.find(ce => ce.checksum.cs === westChecksum)!.hint+" went to the west");
        console.log(northWestTile.toString(true));

        const buildingCoordinatedTiles = new Map<string, CoordinatedTile>([ [ D20Puzzle.coordsToKey({x:0,y:0}), { x:0, y:0, tile: northWestTile } ] ]);

        const {coordinatedTiles } = reduceRange(0, this.size - 1, ({ coordinatedTiles}, rowNum, rowLoopInfos) => {
            return reduceRange(0, this.size - 1, ({ coordinatedTiles, rowNum }, colNum, colLoopInfos) => {
                // Special case : we alreay have north-west tile set (see init)
                if(rowNum === 0 && colNum === 0) {
                    return { coordinatedTiles, rowNum };
                }

                let currentTile: D20Tile;
                if(colLoopInfos.isFirst) {
                    const northTile = coordinatedTiles.get(D20Puzzle.coordsToKey({x:colNum,y:rowNum-1}))!.tile;
                    currentTile = this.tilesPerChecksum.get(northTile.checksums.lastRow.cs)!.find(ce => ce.tile.id !== northTile.id)!.tile;
                } else {
                    const eastTile = coordinatedTiles.get(D20Puzzle.coordsToKey({x:colNum-1,y:rowNum}))!.tile;
                    currentTile = this.tilesPerChecksum.get(eastTile.checksums.lastCol.cs)!.find(ce => ce.tile.id !== eastTile.id)!.tile;
                }

                const checksumConstraints: D20ChecksumConstraint = {};
                // Determining rules for NORTH constraints
                if(rowLoopInfos.isFirst) { // we should always have a north tile here
                    checksumConstraints.north = borderTiles.borderTilesChecksumEntriesPerTileId.get(currentTile.id)!.borderChecksums.map(cs => cs.checksum.cs);
                } else {
                    const northTile = coordinatedTiles.get(D20Puzzle.coordsToKey({x:colNum,y:rowNum-1}))!.tile;
                    checksumConstraints.north = [ northTile.checksums.lastRow.cs ];
                }
                // Determining rules for WEST constraints
                if(colLoopInfos.isFirst) {
                    checksumConstraints.west = borderTiles.borderTilesChecksumEntriesPerTileId.get(currentTile.id)!.borderChecksums.map(cs => cs.checksum.cs);
                } else {
                    const eastTile = coordinatedTiles.get(D20Puzzle.coordsToKey({x:colNum-1,y:rowNum}))!.tile;
                    checksumConstraints.west = [ eastTile.checksums.lastCol.cs ];
                }

                console.log(`Before transforming tile : \n${currentTile.toString(true)}`);
                currentTile = currentTile.transformToMatch(checksumConstraints, true)!;
                console.log(`After transforming tile : \n${currentTile.toString(true)}`);
                coordinatedTiles.set(D20Puzzle.coordsToKey({x: colNum, y: rowNum}), { x: colNum, y: rowNum, tile: currentTile });

                D20Puzzle.printCoordinatedTiles(coordinatedTiles, Array.from(coordinatedTiles.values())[0].tile.size);

                return { coordinatedTiles, rowNum };
            }, { coordinatedTiles, rowNum });

            return { coordinatedTiles };
        }, { coordinatedTiles: buildingCoordinatedTiles })

        return new SolvedPuzzle(coordinatedTiles);
    }

    public computeBorderTilesMultiplication() {
        const borderTiles = this.findBorderTiles();
        return borderTiles.cornerTiles.reduce((result, borderTile) => {
            return result * borderTile.id;
        }, 1);
    }

    public static createFrom(str: string) {
        const tiles = str.split("\n\n").map(D20Tile.createFrom);
        return new D20Puzzle(tiles);
    }

    public static coordsToKey({x,y}: {x: number, y: number}) {
        return `${x}_${y}`;
    }

    public static printCoordinatedTiles(coordinatedTiles: Map<string, CoordinatedTile>, tileSize: number) {
        const maxY = Math.max(...Array.from(coordinatedTiles.values()).map(t => t.y));
        const maxX = Math.max(...Array.from(coordinatedTiles.values()).map(t => t.x));

        const matrixToPrint = new Map<string, {x:number,y:number,v:string}>();

        for(let y=0; y<=maxY; y++) {
            for(let x=0; x<=maxX; x++) {
                let matrix: Map<string, {x:number,y:number,v:string}>;
                if(coordinatedTiles.has(D20Puzzle.coordsToKey({x,y}))) {
                    matrix = new Map(coordinatedTiles.get(D20Puzzle.coordsToKey({x,y}))!.tile.valByCoord);
                } else {
                    matrix = new Array(tileSize).fill("").reduce((map, _, y) => {
                        return new Array(tileSize).fill( "").reduce((map, _, x) => {
                            map.set(`${x}_${y}`, {x,y,v:" "});
                            return map;
                        }, map)
                    }, new Map<string, {x:number,y:number,v:string}>());
                }

                fillAroundMatrix(matrix, "|");
                fill2DMatrix(matrixToPrint, matrix, {x:x*(tileSize+2), y:y*(tileSize+2)});
            }
        }

        printMatrix(matrixToPrint);
    }

}

type CoordinatedTile = { tile: D20Tile, x: number, y: number };
export class SolvedPuzzle {
    constructor(public readonly tiles: Map<string, CoordinatedTile>) {
    }
}