import {combine, extractColumnBasedValues} from "./utils";

const TREE = "#";
const OPEN_AREA = ".";
const FOUND_TREE = "O";
const MISSED_TREE = "X";
type TreeMapCell = (typeof TREE)|(typeof OPEN_AREA)|(typeof FOUND_TREE)|(typeof MISSED_TREE);

class TreeMap {
    public readonly width: number;
    public readonly height: number;

    constructor(private cells: TreeMapCell[][]) {
        this.height = cells.length;
        this.width = cells[0].length;
    }

    public toGSheetCells(): GSheetCells {
        return this.cells.map(row => [ row.join('') ]);
    }

    public findAndFillTrees(stepsRight: number, stepsDown: number) {
        let position = {x:0, y:0};
        let treesCount = 0;
        while(position.y + stepsDown < this.height) {
            position = { x: position.x + stepsRight, y: position.y + stepsDown };
            if(this.cells[position.y][position.x] === TREE) {
                this.updateCell(position.x, position.y, FOUND_TREE);
                treesCount++;
            } else {
                this.updateCell(position.x, position.y, MISSED_TREE);
            }
        }

        return treesCount;
    }

    public updateCell(x: number, y: number, value: TreeMapCell) {
        this.cells[y][x] = value;
    }

    public static concatHorizontally(tm1: TreeMap, tm2: TreeMap): TreeMap {
        const concatenatedCells = combine(tm1.cells, tm2.cells).map(([tm1Row, tm2Row]) => tm1Row.concat(tm2Row));
        return new TreeMap(concatenatedCells);
    }
}

function CREATE_EXTENDED_MAP(cells: GSheetCells, stepsRight: number, stepsDown: number, format: "result"|"map") {
    const [ treeMapRows ] = extractColumnBasedValues<string>(cells);
    const treeMap = inputToMap(treeMapRows);
    const requiredWidth = Math.floor(treeMap.width * treeMap.height / stepsDown);

    let extendedTreeMap = treeMap;
    while(extendedTreeMap.width < requiredWidth) {
        extendedTreeMap = TreeMap.concatHorizontally(extendedTreeMap, treeMap);
    }

    const foundTrees = extendedTreeMap.findAndFillTrees(stepsRight, stepsDown);
    if(format === "result") {
        return foundTrees;
    } else if(format === "map") {
        return extendedTreeMap.toGSheetCells();
    } else {
        throw new Error("Unsupported format : "+format);
    }
}

function inputToMap(input: string[]): TreeMap {
    const cells = input.map(row => row.split('') as TreeMapCell[]);
    return new TreeMap(cells);
}