import {
    bitsToNumber,
    cartesian, countLetterOccurencesInString,
    fill2DMatrix, fillAroundMatrix,
    findMapped,
    mapCreateIfAbsent, matrixToStr,
    reduceRange,
    reduceTimes, Squarred2DMatrix, Squarred2DMatrixEntry
} from "./utils";


type D20TileValue = "#"|"."
type D20TileEntry = {x:number, y:number, v: D20TileValue};
type D20Checksum = { cs: number, for: string, hint: string };
type D20ChecksumConstraint = { north?: number[]|undefined, south?: number[]|undefined, west?: number[]|undefined, east?: number[]|undefined };

export class D20Tile {
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

    constructor(public readonly id: number, public readonly squarredMatrix: Squarred2DMatrix<D20TileValue>) {
        this.checksums = {
            firstRow: D20Tile.checksumFor("firstRow", this.squarredMatrix.extractRow(0)),
            lastRow: D20Tile.checksumFor("lastRow", this.squarredMatrix.extractRow(this.squarredMatrix.size-1)),
            firstRowReversed: D20Tile.checksumFor("firstRowReversed", this.squarredMatrix.extractRow(0).reverse()),
            lastRowReversed: D20Tile.checksumFor("lastRowReversed", this.squarredMatrix.extractRow(this.squarredMatrix.size-1).reverse()),
            firstCol: D20Tile.checksumFor("firstCol", this.squarredMatrix.extractCol(0)),
            lastCol: D20Tile.checksumFor("lastCol", this.squarredMatrix.extractCol(this.squarredMatrix.size-1)),
            firstColReversed: D20Tile.checksumFor("firstColReversed", this.squarredMatrix.extractCol(0).reverse()),
            lastColReversed: D20Tile.checksumFor("lastColReversed", this.squarredMatrix.extractCol(this.squarredMatrix.size-1).reverse()),
        };
    }

    public static createFrom(str: string) {
        const lines = str.split("\n");
        const tileId = Number(lines.shift()!.replace(/^Tile (\d+):$/g, "$1"));
        return new D20Tile(tileId, new Squarred2DMatrix<D20TileValue>(lines.map((row, y) => row.split("").map((cell, x) => ({x,y, v: cell as D20TileValue}))).flat()));
    }

    public rotateClockwise(): D20Tile {
        return this.flipMajorDiagonal().flipY();
    }

    public flipX() {
        return new D20Tile(this.id, this.squarredMatrix.flipX());
    }

    public flipY() {
        return new D20Tile(this.id, this.squarredMatrix.flipY());
    }

    public flipXY() {
        return this.flipX().flipY();
    }

    public flipMajorDiagonal() {
        return new D20Tile(this.id, this.squarredMatrix.flipMajorDiagonal());
    }

    public subtractBorders() {
        return new D20Tile(this.id, this.squarredMatrix.subtractBorders());
    }

    public entryAt({x,y}: {x:number, y:number}): D20TileEntry|undefined {
        return this.squarredMatrix.entryAt({x,y});
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
        // console.log(`Looking for transformation to match: ${JSON.stringify(checksumConstraints)}`)
        // console.log("Starting point candidate : ")
        // console.log(candidateTile.toString(true));
        while(!candidateTile.matchesWith(checksumConstraints).matches && i<D20Tile.TRANSFORMATIONS_TO_APPLY.length) {
            candidateTile = D20Tile.TRANSFORMATIONS_TO_APPLY[i](candidateTile);
            // console.log(`After transf[${i}] : ${D20Tile.TRANSFORMATIONS_TO_APPLY[i].toString()}`);
            // console.log(candidateTile.toString(true));
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

    public matchesWith(checksumConstraints: D20ChecksumConstraint): { matches: boolean } {
        if(checksumConstraints.north !== undefined && !checksumConstraints.north.includes(this.checksums.firstRow.cs)) {
            return {matches: false};
        }
        if(checksumConstraints.south !== undefined && !checksumConstraints.south.includes(this.checksums.lastRow.cs)) {
            return {matches: false};
        }
        if(checksumConstraints.west !== undefined && !checksumConstraints.west.includes(this.checksums.firstCol.cs)) {
            return {matches: false };
        }
        if(checksumConstraints.east !== undefined && !checksumConstraints.east.includes(this.checksums.lastCol.cs)) {
            return {matches: false };
        }

        return {  matches: true };
    }

    public toDisplayableMatrix(): string[][] {
        const result = [] as string[][];
        for(var y=0; y<this.squarredMatrix.size; y++) {
            const row = [] as string[];
            for(var x=0; x<this.squarredMatrix.size; x++) {
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

    public static checksumFor(hint: string, sortedTileEntries: D20TileEntry[]) {
        return { hint, cs: bitsToNumber(sortedTileEntries.map(e => e.v==="#"?"1":"0")), for: sortedTileEntries.map(e => e.v).join("") };
    }
}

type ChecksumEntry = { checksum: D20Checksum, tile: D20Tile, hint: string };
type PerTileIdBorderChecksums = Map<number, BorderTileWithChecksum>;
type BorderTileWithChecksum = { tile: D20Tile, isCorner: boolean, borderChecksums: { checksum: D20Checksum, hint: string }[] };
type PuzzleResolutionOutcome = { status: "failure" }|{ status: "success", coordinatedTiles: Map<string, CoordinatedTile> };
export class D20Puzzle {
    public readonly size: number;
    public readonly tilesPerChecksum: Map<number, ChecksumEntry[]>;
    private readonly tilesById: Map<number, D20Tile>;

    constructor(public readonly tiles: D20Tile[]) {
        this.tilesPerChecksum = tiles.reduce((tilesPerChecksum, tile) => {
            Object.values(tile.checksums).forEach(checksum => {
                mapCreateIfAbsent(tilesPerChecksum, checksum.cs, []).push({ checksum, tile, hint: checksum.hint });
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
        if(cornerTileIds.length !== 4) {
            throw new Error("Ouch, we have not found exactly 4 corner tile candidates ! (having more than 4 candidates may happen, but it would complicate things a lot and I didn't handled it !...)");
        }

        const borderTilesChecksumEntriesPerTileId = borderTileIds.reduce((perTileBorderChecksumEntries, tileId) => {
            perTileBorderChecksumEntries.set(tileId, {
                tile: this.tilesById.get(tileId)!,
                isCorner: cornerTileIds.indexOf(tileId) !== -1,
                borderChecksums: perTileIdChecksumEntries.get(tileId)!.map(ce => ({ hint: ce.hint, checksum: ce.checksum }))
            });
            return perTileBorderChecksumEntries;
        }, new Map() as PerTileIdBorderChecksums);


        return borderTilesChecksumEntriesPerTileId;
    }

    public solvePuzzle(): D20SolvedPuzzle {
        let borderTilesChecksumEntriesPerTileId = this.findBorderTiles();

        const cornerTilesWithChecksums = Array.from(borderTilesChecksumEntriesPerTileId.values()).filter(bc => bc.isCorner);
        console.log(`Following corner tiles identified : ${cornerTilesWithChecksums.map(ct => ct.tile.id).join(", ")}`)

        // Based on tests, it appears that every corner tiles cannot be placed at the nort-west corner
        // (by picking a tile randomly, it happens that we don't find any solution...)
        // That's why we're going to iterate over potentially the 4 tiles options and see if one of them
        // succeeds to solve the puzzle resolution
        // If not, then we'll try with the next corner tile candidate for north-west corner
        let puzzleSolutionOutcome: PuzzleResolutionOutcome = { status:'failure' };
        for(let i=0; i<cornerTilesWithChecksums.length; i++) {
            const northWestTileCandidateWithChecksums = cornerTilesWithChecksums[i]!;

            console.log(`Trying with corner tile ${northWestTileCandidateWithChecksums.tile.id} in the north-west position...`)
            puzzleSolutionOutcome = this.tryToSolvePuzzleStartingWithNorthWestTile(northWestTileCandidateWithChecksums, borderTilesChecksumEntriesPerTileId);
            console.log(`North-West Corner tile ${northWestTileCandidateWithChecksums.tile.id} puzzle resolution : ${puzzleSolutionOutcome.status} !`);
            if(puzzleSolutionOutcome.status === 'success') {
                break;
            }
        }

        if(puzzleSolutionOutcome.status === 'failure') {
            throw new Error("Something went wrong : we didn't found any solution for the puzzle ! :(");
        }

        console.log("First found puzzle solution :")
        D20Puzzle.printCoordinatedTiles(puzzleSolutionOutcome.coordinatedTiles, Array.from(puzzleSolutionOutcome.coordinatedTiles.values())[0].tile.squarredMatrix.size);

        const subtractedTiles = Array.from(puzzleSolutionOutcome.coordinatedTiles!.entries()).reduce((subtractedTiles, [key, coordinatedTile]) => {
            subtractedTiles.set(key, {...coordinatedTile, tile: coordinatedTile.tile.subtractBorders()});
            return subtractedTiles;
        }, new Map<string, CoordinatedTile>());

        console.log("Tiles with subtracted borders :")
        D20Puzzle.printCoordinatedTiles(subtractedTiles, Array.from(subtractedTiles.values())[0].tile.squarredMatrix.size);
        return new D20SolvedPuzzle(subtractedTiles);
    }

    private tryToSolvePuzzleStartingWithNorthWestTile(northWestTileCandidateWithChecksums: BorderTileWithChecksum, perTileIdBorderChecksums: PerTileIdBorderChecksums): PuzzleResolutionOutcome {
        // Let's make some choices for corner tiles as we have a lot of possibilities dependending on flips/rotates
        // Let's stick to only 1 configuration and solve the puzzle based on it

        const firstTile = northWestTileCandidateWithChecksums.tile;

        // trying all 4 possibilities to put it in NortWest position
        let northWestChecksumCandidates = cartesian(northWestTileCandidateWithChecksums.borderChecksums.map(ce => ce.checksum.cs), northWestTileCandidateWithChecksums.borderChecksums.map(ce => ce.checksum.cs)).filter(([cs1, cs2]) => cs1 !== cs2);
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

        // console.log("Transformed tile :")
        // console.log(northWestTileCandidateWithChecksums.borderChecksums.find(ce => ce.checksum.cs === northChecksum)!.hint+" went to the north");
        // console.log(northWestTileCandidateWithChecksums.borderChecksums.find(ce => ce.checksum.cs === westChecksum)!.hint+" went to the west");
        // console.log(northWestTile.toString(true));

        const buildingCoordinatedTiles = new Map<string, CoordinatedTile>([ [ D20Puzzle.coordsToKey({x:0,y:0}), { x:0, y:0, tile: northWestTile } ] ]);

        try {
            const {coordinatedTiles } = reduceRange(0, this.size - 1, ({ coordinatedTiles}, rowNum, rowLoopInfos) => {
                return reduceRange(0, this.size - 1, ({ coordinatedTiles, rowNum }, colNum, colLoopInfos) => {
                    // Special case : we alreay have north-west tile set (see init)
                    if(rowNum === 0 && colNum === 0) {
                        return { coordinatedTiles, rowNum };
                    }

                    let currentTile: D20Tile;
                    if(colLoopInfos.isFirst) {
                        const northTile = coordinatedTiles.get(D20Puzzle.coordsToKey({x:colNum,y:rowNum-1}))!.tile;
                        const tilesCandidates = this.tilesPerChecksum.get(northTile.checksums.lastRow.cs)!.filter(ce => ce.tile.id !== northTile.id);
                        if(tilesCandidates.length !== 1) {
                            throw Error(`Wow.. we didn't found exactly 1 candidate for checksum ${northTile.checksums.lastRow.cs} ! (${tilesCandidates.length} candidate found)`)
                        }
                        currentTile = tilesCandidates[0].tile;
                    } else {
                        const westTile = coordinatedTiles.get(D20Puzzle.coordsToKey({x:colNum-1,y:rowNum}))!.tile;
                        const tilesCandidates = this.tilesPerChecksum.get(westTile.checksums.lastCol.cs)!.filter(ce => ce.tile.id !== westTile.id);
                        if(tilesCandidates.length !== 1) {
                            throw Error(`Wow.. we didn't found exactly 1 candidate for checksum ${westTile.checksums.lastCol.cs} ! (${tilesCandidates.length} candidate found)`)
                        }
                        currentTile = tilesCandidates[0].tile;
                    }

                    const checksumConstraints: D20ChecksumConstraint = {};
                    // Determining rules for NORTH constraints
                    if(rowLoopInfos.isFirst) { // we should always have a north tile here
                        checksumConstraints.north = perTileIdBorderChecksums.get(currentTile.id)!.borderChecksums.map(cs => cs.checksum.cs);
                    } else {
                        const northTile = coordinatedTiles.get(D20Puzzle.coordsToKey({x:colNum,y:rowNum-1}))!.tile;
                        checksumConstraints.north = [ northTile.checksums.lastRow.cs ];
                    }
                    // Determining rules for WEST constraints
                    if(colLoopInfos.isFirst) {
                        checksumConstraints.west = perTileIdBorderChecksums.get(currentTile.id)!.borderChecksums.map(cs => cs.checksum.cs);
                    } else {
                        const westTile = coordinatedTiles.get(D20Puzzle.coordsToKey({x:colNum-1,y:rowNum}))!.tile;
                        checksumConstraints.west = [ westTile.checksums.lastCol.cs ];
                    }

                    // console.log(`Before transforming tile : \n${currentTile.toString(true)}`);
                    currentTile = currentTile.transformToMatch(checksumConstraints, true)!;
                    // console.log(`After transforming tile : \n${currentTile.toString(true)}`);
                    coordinatedTiles.set(D20Puzzle.coordsToKey({x: colNum, y: rowNum}), { x: colNum, y: rowNum, tile: currentTile });

                    // D20Puzzle.printCoordinatedTiles(coordinatedTiles, Array.from(coordinatedTiles.values())[0].tile.squarredMatrix.size);

                    return { coordinatedTiles, rowNum };
                }, { coordinatedTiles, rowNum });

                return { coordinatedTiles };
            }, { coordinatedTiles: buildingCoordinatedTiles })
            return { coordinatedTiles, status: 'success' };
        } catch(e) {
            // If at some point we encountered some exceptions, it means that we reached a dead end and we should consider puzzle resolution as a failure
            return { status: 'failure' };
        }
    }

    public computeBorderTilesMultiplication() {
        const borderTilesChecksumEntriesPerTileId = this.findBorderTiles();
        return Array.from(borderTilesChecksumEntriesPerTileId.values()).filter(bc => bc.isCorner).reduce((result, borderTileWithChecksum) => {
            return result * borderTileWithChecksum.tile.id;
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
                    matrix = new Map(coordinatedTiles.get(D20Puzzle.coordsToKey({x,y}))!.tile.squarredMatrix.valByCoord);
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

        console.log(matrixToStr(matrixToPrint));
    }

}

type CoordinatedTile = { tile: D20Tile, x: number, y: number };
export class D20SolvedPuzzle {
    static readonly MONSTER_REGEX = (lineLength: number) => new RegExp(`([\.#]{18})#([\.#].{${lineLength-19}})#([\.#]{4})##([\.#]{4})##([\.#]{4})###(.{${lineLength-19}}[\.#])#([\.#]{2})#([\.#]{2})#([\.#]{2})#([\.#]{2})#([\.#]{2})#([\.#]{3})`, "gs");
    static readonly MONSTER_REGEX_REPLACEMENT = "$1O$2O$3OO$4OO$5OOO$6O$7O$8O$9O$10O$11O$12";

    static readonly TRANSFORMATIONS_TO_APPLY_TO_FIND_MONSTER: ( (matrix: Squarred2DMatrix<string>) => Squarred2DMatrix<string> )[] = [
        (matrix) => matrix.rotateClockwise(),
        (matrix) => matrix.rotateClockwise(),
        (matrix) => matrix.rotateClockwise(),
        (matrix) => matrix.rotateClockwise(),
        (matrix) => matrix.flipX(),
        (matrix) => matrix.rotateClockwise(),
        (matrix) => matrix.rotateClockwise(),
        (matrix) => matrix.rotateClockwise(),
        (matrix) => matrix.rotateClockwise(),
        (matrix) => matrix.flipX().flipY(), // Re-flippingX reinitializes state
        (matrix) => matrix.rotateClockwise(),
        (matrix) => matrix.rotateClockwise(),
        (matrix) => matrix.rotateClockwise(),
        (matrix) => matrix.rotateClockwise(),
        (matrix) => matrix.flipX(),
        (matrix) => matrix.rotateClockwise(),
        (matrix) => matrix.rotateClockwise(),
        (matrix) => matrix.rotateClockwise(),
    ];

    private printableTiles: Squarred2DMatrix<string>;
    constructor(private readonly tiles: Map<string, CoordinatedTile>) {
        this.printableTiles = new Squarred2DMatrix<string>(D20SolvedPuzzle.toPrintableMatrix(this.tiles));
    }

    public rotateAndFlipUntilFindingAMonster() {
        let candidatePrintableTiles = this.printableTiles;
        let i=0;
        while(!D20SolvedPuzzle.monsterFound(candidatePrintableTiles) && i<D20SolvedPuzzle.TRANSFORMATIONS_TO_APPLY_TO_FIND_MONSTER.length) {
            candidatePrintableTiles = D20SolvedPuzzle.TRANSFORMATIONS_TO_APPLY_TO_FIND_MONSTER[i](candidatePrintableTiles);
            i++;
        }
        if(!D20SolvedPuzzle.monsterFound(candidatePrintableTiles)) {
            throw new Error(`I guess there is a problem ... we were not able to find any monster !`);
        }

        this.printableTiles = candidatePrintableTiles;

        console.log("Solved puzzle flipped/rotated so that we can see monster in it :")
        console.log(this.printableTiles.toString());

        return this;
    }

    public fillMonstersThenCountX() {
        let str = this.printableTiles.toString();
        const lineSize = str.split("\n")[0].length;
        let regex = D20SolvedPuzzle.MONSTER_REGEX(lineSize);
        while(str.match(regex)) {
            str = str.replace(regex, D20SolvedPuzzle.MONSTER_REGEX_REPLACEMENT);
        }

        console.log("Puzzle with monster inside :")
        console.log(str);

        return countLetterOccurencesInString("#", str);
    }

    public static monsterFound(printableTiles: Squarred2DMatrix<string>): boolean {
        const str = printableTiles.toString();
        return D20SolvedPuzzle.findMonsterStartingAt(str);
    }

    public static findMonsterStartingAt(str: string) {
        const lineSize = str.split("\n")[0].length;
        let regex = D20SolvedPuzzle.MONSTER_REGEX(lineSize);
        return !!str.match(regex);
    }

    public static toPrintableMatrix(coordinatedTiles: Map<string, CoordinatedTile>) {
        const maxTileY = Math.max(...Array.from(coordinatedTiles.values()).map(t => t.y)) + 1;
        const maxTileX = Math.max(...Array.from(coordinatedTiles.values()).map(t => t.x)) + 1;

        if(maxTileX !== maxTileY) {
            throw new Error(`Unexpected sizes : ${maxTileX} !== ${maxTileY}`);
        }

        const tilesSize = maxTileX;

        const maxX = Math.max(...Array.from(coordinatedTiles.values())[0].tile.squarredMatrix.values.map(t => t.x)) + 1;
        const maxY = Math.max(...Array.from(coordinatedTiles.values())[0].tile.squarredMatrix.values.map(t => t.y)) + 1;

        if(maxX !== maxY) {
            throw new Error(`Unexpected sizes : ${maxX} !== ${maxY}`);
        }

        const size = maxX;

        const matrixToPrint = [] as Squarred2DMatrixEntry<string>[];

        for(let tileY=0; tileY<tilesSize; tileY++) {
            for(let tileX=0; tileX<tilesSize; tileX++) {
                let tileMatrix = coordinatedTiles.get(D20Puzzle.coordsToKey({x: tileX,y: tileY}))!.tile.squarredMatrix.values;
                tileMatrix.reduce((overallMatrix, entry) => {
                    overallMatrix.push({ x:tileX*size + entry.x, y:tileY*size + entry.y, v: entry.v  });
                    return overallMatrix;
                }, matrixToPrint);
            }
        }

        return matrixToPrint;
    }
}