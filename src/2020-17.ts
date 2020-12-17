import {cartesian} from "./utils";


type D173DCoord = {x:number,y:number,z:number};
type D17CubeState = "active"|"inactive";
type D17VisibleCubeState = "#"|".";

export class Pocket3Dimension {
    private activeCubes = new Map<string, D173DCoord>();
    constructor() {
    }

    initializeWith2D(rawStr: string) {
        rawStr.split("\n").forEach((line, y) => {
            (line.split("") as D17VisibleCubeState[]).forEach((cell, x) => {
                if(cell === "#") {
                    Pocket3Dimension.setState(this.activeCubes, {x,y,z:0}, "active");
                }
            })
        })
    }

    performNewCycle() {
        const buildingMap = new Map(this.activeCubes);

        const { neighborCoords, uniqueNeighbors } = Pocket3Dimension.buildNeighborCoordsAround(this.activeCubes);

        // Active => Inactive state
        neighborCoords.forEach((entry, activeCoord) => {
            const activeNeighbors = entry.neighbors.filter(coord => this.activeCubes.has(Pocket3Dimension.coordToMapKey(coord))).length;
            if(activeNeighbors!==2 && activeNeighbors!==3) {
                Pocket3Dimension.setState(buildingMap, entry.coord, "inactive");
            }
        })
        // Inactive => Active state
        uniqueNeighbors.forEach((neighborEntry, neighborKey) => {
            const activeNeighborsAround = neighborEntry.activeNeighbors.length;
            if(activeNeighborsAround === 3) {
                Pocket3Dimension.setState(buildingMap, neighborEntry.coord, "active");
            }
        })

        this.activeCubes = buildingMap;
    }

    activeCubesCount() {
        return this.activeCubes.size;
    }

    static buildNeighborCoordsAround(activeCubes: Map<string, D173DCoord>) {
        const neighborCoords = new Map<string, {coord: D173DCoord, neighbors: D173DCoord[]}>();
        const uniqueNeighbors = new Map<string, { coord: D173DCoord, activeNeighbors: D173DCoord[]}>();
        activeCubes.forEach((activeCoord, activeCoordKey) => {
            const currentActiveCoordNeighbors = [] as D173DCoord[];
            cartesian([-1,0,1],[-1,0,1],[-1,0,1]).map(([xStep,yStep,zStep]) => {
                if(xStep!==0 || yStep!==0 || zStep!==0) {
                    let neighborCoord = { x: activeCoord.x+xStep, y: activeCoord.y+yStep, z: activeCoord.z+zStep };
                    currentActiveCoordNeighbors.push(neighborCoord);

                    let neighborCoordKey = Pocket3Dimension.coordToMapKey(neighborCoord);
                    const uniqueNeighborEntry = (uniqueNeighbors.get(neighborCoordKey) || { coord: neighborCoord, activeNeighbors: [] }) as {coord: D173DCoord, activeNeighbors: D173DCoord[]};
                    uniqueNeighborEntry.activeNeighbors.push(activeCoord);
                    uniqueNeighbors.set(neighborCoordKey, uniqueNeighborEntry);
                }
            })
            neighborCoords.set(activeCoordKey, { coord: activeCoord, neighbors: currentActiveCoordNeighbors });
        });
        return { neighborCoords, uniqueNeighbors };
    }

    static setState(activeCubesMap: Map<string, D173DCoord>, coord: D173DCoord, cubeState: D17CubeState) {
        if(cubeState==="active") {
            activeCubesMap.set(Pocket3Dimension.coordToMapKey(coord), coord);
        } else if(cubeState==="inactive") {
            activeCubesMap.delete(Pocket3Dimension.coordToMapKey(coord));
        } else {
            throw new Error(`Unexpected cube state ; ${cubeState}`);
        }
    }

    static coordToMapKey(coord: D173DCoord) {
        return `${coord.x}_${coord.y}_${coord.z}`;
    }
}

type D174DCoord = {x:number,y:number,z:number,w:number};
export class Pocket4Dimension {
    private activeCubes = new Map<string, D174DCoord>();
    constructor() {
    }

    initializeWith2D(rawStr: string) {
        rawStr.split("\n").forEach((line, y) => {
            (line.split("") as D17VisibleCubeState[]).forEach((cell, x) => {
                if(cell === "#") {
                    Pocket4Dimension.setState(this.activeCubes, {x,y,z:0,w:0}, "active");
                }
            })
        })
    }

    performNewCycle() {
        const buildingMap = new Map(this.activeCubes);

        const { neighborCoords, uniqueNeighbors } = Pocket4Dimension.buildNeighborCoordsAround(this.activeCubes);

        // Active => Inactive state
        neighborCoords.forEach((entry, activeCoord) => {
            const activeNeighbors = entry.neighbors.filter(coord => this.activeCubes.has(Pocket4Dimension.coordToMapKey(coord))).length;
            if(activeNeighbors!==2 && activeNeighbors!==3) {
                Pocket4Dimension.setState(buildingMap, entry.coord, "inactive");
            }
        })
        // Inactive => Active state
        uniqueNeighbors.forEach((neighborEntry, neighborKey) => {
            const activeNeighborsAround = neighborEntry.activeNeighbors.length;
            if(activeNeighborsAround === 3) {
                Pocket4Dimension.setState(buildingMap, neighborEntry.coord, "active");
            }
        })

        this.activeCubes = buildingMap;
    }

    activeCubesCount() {
        return this.activeCubes.size;
    }

    static buildNeighborCoordsAround(activeCubes: Map<string, D174DCoord>) {
        const neighborCoords = new Map<string, {coord: D174DCoord, neighbors: D174DCoord[]}>();
        const uniqueNeighbors = new Map<string, { coord: D174DCoord, activeNeighbors: D174DCoord[]}>();
        activeCubes.forEach((activeCoord, activeCoordKey) => {
            const currentActiveCoordNeighbors = [] as D174DCoord[];
            cartesian([-1,0,1],[-1,0,1],[-1,0,1], [-1,0,1]).map(([xStep,yStep,zStep,wStep]) => {
                if(xStep!==0 || yStep!==0 || zStep!==0 || wStep!==0) {
                    let neighborCoord = { x: activeCoord.x+xStep, y: activeCoord.y+yStep, z: activeCoord.z+zStep, w: activeCoord.w+wStep };
                    currentActiveCoordNeighbors.push(neighborCoord);

                    let neighborCoordKey = Pocket4Dimension.coordToMapKey(neighborCoord);
                    const uniqueNeighborEntry = (uniqueNeighbors.get(neighborCoordKey) || { coord: neighborCoord, activeNeighbors: [] }) as {coord: D174DCoord, activeNeighbors: D174DCoord[]};
                    uniqueNeighborEntry.activeNeighbors.push(activeCoord);
                    uniqueNeighbors.set(neighborCoordKey, uniqueNeighborEntry);
                }
            })
            neighborCoords.set(activeCoordKey, { coord: activeCoord, neighbors: currentActiveCoordNeighbors });
        });
        return { neighborCoords, uniqueNeighbors };
    }

    static setState(activeCubesMap: Map<string, D174DCoord>, coord: D174DCoord, cubeState: D17CubeState) {
        if(cubeState==="active") {
            activeCubesMap.set(Pocket4Dimension.coordToMapKey(coord), coord);
        } else if(cubeState==="inactive") {
            activeCubesMap.delete(Pocket4Dimension.coordToMapKey(coord));
        } else {
            throw new Error(`Unexpected cube state ; ${cubeState}`);
        }
    }

    static coordToMapKey(coord: D174DCoord) {
        return `${coord.x}_${coord.y}_${coord.z}_${coord.w}`;
    }
}