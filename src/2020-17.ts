import {cartesian, reduceRange, reduceTimes} from "./utils";


type D17CubeState = "active"|"inactive";
type D17VisibleCubeState = "#"|".";

export abstract class D17Matrix<COORDS> {
    constructor(private readonly opts: {
        dimensions: number,
        initializationCoordKeyExtractor: (partialCoords: {x:number,y:number}) => COORDS,
        coordsKeyExtractor: (coord: COORDS) => string,
        applyStepsToCoord: (coord: COORDS, perDimensionSteps: number[]) => COORDS,
        createNew: (activeCubes: Map<string, COORDS>) => D17Matrix<COORDS>,
    }, private readonly activeCubes: Map<string, COORDS> = new Map<string, COORDS>()) {
    }

    initializeWith2D(rawStr: string) {
        rawStr.split("\n").forEach((line, y) => {
            (line.split("") as D17VisibleCubeState[]).forEach((cell, x) => {
                if(cell === "#") {
                    this.setState(this.opts.initializationCoordKeyExtractor({x,y}), "active");
                }
            })
        })
    }

    setState(coord: COORDS, cubeState: D17CubeState) {
        if(cubeState==="active") {
            this.activeCubes.set(this.opts.coordsKeyExtractor(coord), coord);
        } else if(cubeState==="inactive") {
            this.activeCubes.delete(this.opts.coordsKeyExtractor(coord));
        } else {
            throw new Error(`Unexpected cube state ; ${cubeState}`);
        }
    }

    buildNeighborCoordsAround() {
        const neighborCoords = new Map<string, {coord: COORDS, neighbors: COORDS[]}>();
        const uniqueNeighbors = new Map<string, { coord: COORDS, activeNeighbors: COORDS[]}>();
        this.activeCubes.forEach((activeCoord, activeCoordKey) => {
            const currentActiveCoordNeighbors = [] as COORDS[];

            cartesian(...this.buildDimensionsNeighborsSteps()).map((perDimensionSteps: number[]) => {
                let allStepsAre0 = true;
                for(var i=0; i<perDimensionSteps.length; i++) {
                    if(perDimensionSteps[i]!==0){
                        allStepsAre0=false;
                        break;
                    }
                }
                if(!allStepsAre0) {
                    let neighborCoord = this.opts.applyStepsToCoord(activeCoord, perDimensionSteps);
                    currentActiveCoordNeighbors.push(neighborCoord);

                    let neighborCoordKey = this.opts.coordsKeyExtractor(neighborCoord);
                    const uniqueNeighborEntry = (uniqueNeighbors.get(neighborCoordKey) || { coord: neighborCoord, activeNeighbors: [] }) as {coord: COORDS, activeNeighbors: COORDS[]};
                    uniqueNeighborEntry.activeNeighbors.push(activeCoord);
                    uniqueNeighbors.set(neighborCoordKey, uniqueNeighborEntry);
                }
            })
            neighborCoords.set(activeCoordKey, { coord: activeCoord, neighbors: currentActiveCoordNeighbors });
        });
        return { neighborCoords, uniqueNeighbors };
    }

    buildDimensionsNeighborsSteps(): [-1,0,1][] {
        return reduceTimes(this.opts.dimensions, (dimensionSteps) => {
            return dimensionSteps.concat([ [-1,0,1] ]);
        }, [] as [-1,0,1][]);
    }

    isActive(coord: COORDS) {
        return this.activeCubes.has(this.opts.coordsKeyExtractor(coord));
    }

    activeCubesCount() {
        return this.activeCubes.size;
    }

    clone(): D17Matrix<COORDS> {
        // Creating defensive copy of current map is important here !.. otherwise we may have bad surprises...
        return this.opts.createNew(new Map(this.activeCubes));
    }
}

type D17_3DCoord = {x:number,y:number,z:number};
export class D17_3DMatrix extends D17Matrix<D17_3DCoord> {
    constructor(activeCubes: Map<string, D17_3DCoord> = new Map<string, D17_3DCoord>()) {
        super({
            dimensions: 3,
            initializationCoordKeyExtractor: (({x,y}) => ({x,y,z:0})),
            coordsKeyExtractor: (coord) => `${coord.x}_${coord.y}_${coord.z}`,
            applyStepsToCoord: (coord, perDimensionSteps: number[]) => ({ x: coord.x+perDimensionSteps[0], y: coord.y+perDimensionSteps[1], z: coord.z+perDimensionSteps[2] }),
            createNew: (activeCubes => new D17_3DMatrix(activeCubes))
        });
    }
}

type D17_4DCoord = {x:number,y:number,z:number,w:number};
export class D17_4DMatrix extends D17Matrix<D17_4DCoord> {
    constructor(activeCubes: Map<string, D17_4DCoord> = new Map<string, D17_4DCoord>()) {
        super({
            dimensions: 4,
            initializationCoordKeyExtractor: (({x,y}) => ({x,y,z:0,w:0})),
            coordsKeyExtractor: (coord) => `${coord.x}_${coord.y}_${coord.z}_${coord.w}`,
            applyStepsToCoord: (coord, perDimensionSteps: number[]) => ({ x: coord.x+perDimensionSteps[0], y: coord.y+perDimensionSteps[1], z: coord.z+perDimensionSteps[2], w: coord.w+perDimensionSteps[3] }),
            createNew: (activeCubes => new D17_4DMatrix(activeCubes))
        });
    }
}

export class PocketDimension {
    constructor(private matrix: D17Matrix<any>) {
    }

    initializeWith2D(rawStr: string) {
        this.matrix.initializeWith2D(rawStr);
    }

    performNewCycle() {
        const { neighborCoords, uniqueNeighbors } = this.matrix.buildNeighborCoordsAround();

        const buildingMatrix = this.matrix.clone();
        // Active => Inactive state
        neighborCoords.forEach((entry, activeCoord) => {
            const activeNeighbors = entry.neighbors.filter(coord => this.matrix.isActive(coord)).length;
            if(activeNeighbors!==2 && activeNeighbors!==3) {
                buildingMatrix.setState(entry.coord, "inactive");
            }
        })
        // Inactive => Active state
        uniqueNeighbors.forEach((neighborEntry, neighborKey) => {
            const activeNeighborsAround = neighborEntry.activeNeighbors.length;
            if(activeNeighborsAround === 3) {
                buildingMatrix.setState(neighborEntry.coord, "active");
            }
        })

        this.matrix = buildingMatrix;
    }

    activeCubesCount() {
        return this.matrix.activeCubesCount();
    }
}
//
// type D17_4DCoord = {x:number,y:number,z:number,w:number};
// export class Pocket4Dimension {
//     private activeCubes = new Map<string, D17_4DCoord>();
//     constructor() {
//     }
//
//     initializeWith2D(rawStr: string) {
//         rawStr.split("\n").forEach((line, y) => {
//             (line.split("") as D17VisibleCubeState[]).forEach((cell, x) => {
//                 if(cell === "#") {
//                     Pocket4Dimension.setState(this.activeCubes, {x,y,z:0,w:0}, "active");
//                 }
//             })
//         })
//     }
//
//     performNewCycle() {
//         const buildingMap = new Map(this.activeCubes);
//
//         const { neighborCoords, uniqueNeighbors } = Pocket4Dimension.buildNeighborCoordsAround(this.activeCubes);
//
//         // Active => Inactive state
//         neighborCoords.forEach((entry, activeCoord) => {
//             const activeNeighbors = entry.neighbors.filter(coord => this.activeCubes.has(Pocket4Dimension.coordToMapKey(coord))).length;
//             if(activeNeighbors!==2 && activeNeighbors!==3) {
//                 Pocket4Dimension.setState(buildingMap, entry.coord, "inactive");
//             }
//         })
//         // Inactive => Active state
//         uniqueNeighbors.forEach((neighborEntry, neighborKey) => {
//             const activeNeighborsAround = neighborEntry.activeNeighbors.length;
//             if(activeNeighborsAround === 3) {
//                 Pocket4Dimension.setState(buildingMap, neighborEntry.coord, "active");
//             }
//         })
//
//         this.activeCubes = buildingMap;
//     }
//
//     activeCubesCount() {
//         return this.activeCubes.size;
//     }
//
//     static buildNeighborCoordsAround(activeCubes: Map<string, D17_4DCoord>) {
//         const neighborCoords = new Map<string, {coord: D17_4DCoord, neighbors: D17_4DCoord[]}>();
//         const uniqueNeighbors = new Map<string, { coord: D17_4DCoord, activeNeighbors: D17_4DCoord[]}>();
//         activeCubes.forEach((activeCoord, activeCoordKey) => {
//             const currentActiveCoordNeighbors = [] as D17_4DCoord[];
//             cartesian([-1,0,1],[-1,0,1],[-1,0,1], [-1,0,1]).map(([xStep,yStep,zStep,wStep]) => {
//                 if(xStep!==0 || yStep!==0 || zStep!==0 || wStep!==0) {
//                     let neighborCoord = { x: activeCoord.x+xStep, y: activeCoord.y+yStep, z: activeCoord.z+zStep, w: activeCoord.w+wStep };
//                     currentActiveCoordNeighbors.push(neighborCoord);
//
//                     let neighborCoordKey = Pocket4Dimension.coordToMapKey(neighborCoord);
//                     const uniqueNeighborEntry = (uniqueNeighbors.get(neighborCoordKey) || { coord: neighborCoord, activeNeighbors: [] }) as {coord: D17_4DCoord, activeNeighbors: D17_4DCoord[]};
//                     uniqueNeighborEntry.activeNeighbors.push(activeCoord);
//                     uniqueNeighbors.set(neighborCoordKey, uniqueNeighborEntry);
//                 }
//             })
//             neighborCoords.set(activeCoordKey, { coord: activeCoord, neighbors: currentActiveCoordNeighbors });
//         });
//         return { neighborCoords, uniqueNeighbors };
//     }
//
//     static setState(activeCubesMap: Map<string, D17_4DCoord>, coord: D17_4DCoord, cubeState: D17CubeState) {
//         if(cubeState==="active") {
//             activeCubesMap.set(Pocket4Dimension.coordToMapKey(coord), coord);
//         } else if(cubeState==="inactive") {
//             activeCubesMap.delete(Pocket4Dimension.coordToMapKey(coord));
//         } else {
//             throw new Error(`Unexpected cube state ; ${cubeState}`);
//         }
//     }
//
//     static coordToMapKey(coord: D17_4DCoord) {
//         return `${coord.x}_${coord.y}_${coord.z}_${coord.w}`;
//     }
// }