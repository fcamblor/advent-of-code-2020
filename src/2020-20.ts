import {bitsToNumber, mapCreateIfAbsent} from "./utils";


type D20TileValue = "#"|"."
type D20TileEntry = {x:number, y:number, v: D20TileValue};
type D20Checksum = { n: number, s: number, w: number, e: number };

export class D20Tile {
    static readonly SIZE = 10;

    private valByCoord: Map<string, D20TileEntry>;
    public readonly checksums: {
        firstRow: number,
        lastRow: number,
        firstRowReversed: number,
        lastRowReversed: number,
        firstCol: number,
        lastCol: number,
        firstColReversed: number,
        lastColReversed: number,
    };

    constructor(public readonly id: number, private readonly originalValues: D20TileEntry[]) {
        this.valByCoord = originalValues.reduce((valByCoord, val) => {
            valByCoord.set(D20Tile.coordsToKey(val), val);
            return valByCoord;
        }, new Map<string, D20TileEntry>());

        this.checksums = {
            firstRow: D20Tile.checksumFor(this.extractRow(0)),
            lastRow: D20Tile.checksumFor(this.extractRow(D20Tile.SIZE-1)),
            firstRowReversed: D20Tile.checksumFor(this.extractRow(0).reverse()),
            lastRowReversed: D20Tile.checksumFor(this.extractRow(D20Tile.SIZE-1).reverse()),
            firstCol: D20Tile.checksumFor(this.extractCol(0)),
            lastCol: D20Tile.checksumFor(this.extractCol(D20Tile.SIZE-1)),
            firstColReversed: D20Tile.checksumFor(this.extractCol(0).reverse()),
            lastColReversed: D20Tile.checksumFor(this.extractCol(D20Tile.SIZE-1).reverse()),
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
        return this.originalValues.filter(({y, ..._}) => y === rowNum).sort((e1, e2) => e2.x - e1.x);
    }
    private extractCol(colNum: number) {
        return this.originalValues.filter(({x, ..._}) => x === colNum).sort((e1, e2) => e2.y - e1.y);
    }

    public static createFrom(str: string) {
        const lines = str.split("\n");
        const tileId = Number(lines.shift()!.replace(/^Tile (\d+):$/g, "$1"));
        return new D20Tile(tileId, lines.map((row, y) => row.split("").map((cell, x) => ({x,y, v: cell as D20TileValue}))).flat());
    }

    public static coordsToKey({x,y}: {x: number, y: number}) {
        return `${x}_${y}`;
    }

    private static readonly POWERS_OF_2 = [0, 2, 4, 8, 16, 32, 64, 128, 256, 512, 1024];
    public static checksumFor(sortedTileEntries: D20TileEntry[]) {
        return bitsToNumber(sortedTileEntries.map(e => e.v==="#"?"1":"0"));
    }
}

type ChecksumEntry = { checksum: number, tile: D20Tile, hint: string };
export class D20Puzzle {
    public readonly tilesPerChecksum: Map<number, ChecksumEntry[]>;
    private readonly tilesById: Map<number, D20Tile>;

    constructor(public readonly tiles: D20Tile[]) {
        this.tilesPerChecksum = tiles.reduce((tilesPerChecksum, tile) => {
            tile.checksumEntries().forEach(ce => {
                mapCreateIfAbsent(tilesPerChecksum, ce.checksum, []).push({ checksum: ce.checksum, tile, hint: ce.name });
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

        return {
            cornerTiles: cornerTileIds.map(tileId => this.tilesById.get(tileId)!),
            borderButNotCornerTiles: borderTileIds.filter(tileId => !cornerTileIds.includes(tileId)).map(tileId => this.tilesById.get(tileId)!),
        };
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
}