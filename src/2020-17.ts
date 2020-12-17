import {cartesian} from "./utils";


type D17Coord = {x:number,y:number,z:number};
type D17CubeState = "active"|"inactive";
type D17VisibleCubeState = "#"|".";

export class PocketDimension {
    private activeCubes = new Map<string, D17Coord>();
    constructor() {
    }

    initializeWith2D(rawStr: string) {
        rawStr.split("\n").forEach((line, y) => {
            (line.split("") as D17VisibleCubeState[]).forEach((cell, x) => {
                if(cell === "#") {
                    PocketDimension.setState(this.activeCubes, {x,y,z:0}, "active");
                }
            })
        })
    }

    performNewCycle() {
        const buildingMap = new Map(this.activeCubes);

        const { neighborCoords, uniqueNeighbors } = PocketDimension.buildNeighborCoordsAround(this.activeCubes);

        // Active => Inactive state
        neighborCoords.forEach((entry, activeCoord) => {
            const activeNeighbors = entry.neighbors.filter(coord => this.activeCubes.has(PocketDimension.coordToMapKey(coord))).length;
            if(activeNeighbors!==2 && activeNeighbors!==3) {
                PocketDimension.setState(buildingMap, entry.coord, "inactive");
            }
        })
        // Inactive => Active state
        uniqueNeighbors.forEach((neighborEntry, neighborKey) => {
            const activeNeighborsAround = neighborEntry.activeNeighbors.length;
            if(activeNeighborsAround === 3) {
                PocketDimension.setState(buildingMap, neighborEntry.coord, "active");
            }
        })

        this.activeCubes = buildingMap;
    }

    activeCubesCount() {
        return this.activeCubes.size;
    }

    static buildNeighborCoordsAround(activeCubes: Map<string, D17Coord>) {
        const neighborCoords = new Map<string, {coord: D17Coord, neighbors: D17Coord[]}>();
        const uniqueNeighbors = new Map<string, { coord: D17Coord, activeNeighbors: D17Coord[]}>();
        activeCubes.forEach((activeCoord, activeCoordKey) => {
            const currentActiveCoordNeighbors = [] as D17Coord[];
            cartesian([-1,0,1],[-1,0,1],[-1,0,1]).map(([xStep,yStep,zStep]) => {
                if(xStep!==0 || yStep!==0 || zStep!==0) {
                    let neighborCoord = { x: activeCoord.x+xStep, y: activeCoord.y+yStep, z: activeCoord.z+zStep };
                    currentActiveCoordNeighbors.push(neighborCoord);

                    let neighborCoordKey = PocketDimension.coordToMapKey(neighborCoord);
                    const uniqueNeighborEntry = (uniqueNeighbors.get(neighborCoordKey) || { coord: neighborCoord, activeNeighbors: [] }) as {coord: D17Coord, activeNeighbors: D17Coord[]};
                    uniqueNeighborEntry.activeNeighbors.push(activeCoord);
                    uniqueNeighbors.set(neighborCoordKey, uniqueNeighborEntry);
                }
            })
            neighborCoords.set(activeCoordKey, { coord: activeCoord, neighbors: currentActiveCoordNeighbors });
        });
        return { neighborCoords, uniqueNeighbors };
    }

    static setState(activeCubesMap: Map<string, D17Coord>, coord: D17Coord, cubeState: D17CubeState) {
        if(cubeState==="active") {
            activeCubesMap.set(PocketDimension.coordToMapKey(coord), coord);
        } else if(cubeState==="inactive") {
            activeCubesMap.delete(PocketDimension.coordToMapKey(coord));
        } else {
            throw new Error(`Unexpected cube state ; ${cubeState}`);
        }
    }

    static coordToMapKey(coord: D17Coord) {
        return `${coord.x}_${coord.y}_${coord.z}`;
    }
}
