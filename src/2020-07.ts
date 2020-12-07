import {combine, extractColumnBasedValues, rotateMatrix} from "./utils";

type BagDependency = {
    quantity: number;
    bagName: string;
};

class BagConstraint {
    private static MAX_NUMBER_OF_DEPENDENCIES = 4;
    public static SHINY_GOLD_NAME = "shiny gold";

    constructor(public readonly bagName: string, public readonly dependencies: BagDependency[]) {
    }

    static createFrom(startingBags: string[], containingBags: string[][]): BagConstraint[] {
        const bagConstraints: BagConstraint[] = combine(startingBags, containingBags).map(([startingBag, rawDependencies]) => {
            const dependencies: BagDependency[] = [];
            for(var i=0; i<BagConstraint.MAX_NUMBER_OF_DEPENDENCIES; i++) {
                if(rawDependencies[i*2]) {
                    dependencies.push({ quantity: Number(rawDependencies[i*2]), bagName: rawDependencies[i*2 + 1] });
                }
            }
            return new BagConstraint(startingBag,dependencies);
        });

        return bagConstraints;
    }
}

type ResolvableBagConstraintsEntry = {
    bagConstraint: BagConstraint;
} & ({ resolved: false, containsShinyBag: undefined, containedBags: undefined }
   | { resolved: true,  containsShinyBag: boolean,  containedBags: number });
type ResolvableBagConstraintsRecord = {
    [bagName: string]: ResolvableBagConstraintsEntry
};

class ResolvableBagConstraints {
    private remainingResolutions: number;
    constructor(private attrs: ResolvableBagConstraintsRecord) {
        this.remainingResolutions = Object.keys(attrs).map(k => attrs[k]).filter(record => !record.resolved).length;
    }

    public someResolutionsRemain() {
        return this.remainingResolutions !== 0;
    }

    public containsShinyBag(bagName: string): boolean|undefined {
        return !!this.attrs[bagName].containsShinyBag;
    }

    public toStringifiedJSON(bagName: string) {
        return JSON.stringify(this.attrs[bagName]);
    }

    public pickAndResolveFirstResolvableContraint(): boolean|undefined {
        const resolvableConstraint = this.pickFirstResolvableConstraint();
        const containsShinyBag: boolean|undefined = resolvableConstraint.bagConstraint.dependencies.reduce((containsShinyBag, dependency) => {
            if(this.attrs[dependency.bagName].containsShinyBag === undefined) {
                return undefined;
            }
            return containsShinyBag || !!this.attrs[dependency.bagName].containsShinyBag || (dependency.bagName === BagConstraint.SHINY_GOLD_NAME);
        }, false as boolean|undefined);

        this.attrs[resolvableConstraint.bagConstraint.bagName].resolved = true;
        this.attrs[resolvableConstraint.bagConstraint.bagName].containsShinyBag = containsShinyBag;

        this.remainingResolutions--;

        return containsShinyBag;
    }

    private pickFirstResolvableConstraint(): ResolvableBagConstraintsEntry {
        for(const key in this.attrs) {
            const record = this.attrs[key];
            if(!record.resolved && this.allDependenciesResolvedFor(record)) {
                return record;
            }
        }

        throw new Error(`No resolvable constraint found with remaining resolutions = ${this.remainingResolutions}`);
    }

    public allDependenciesResolvedFor(entry: ResolvableBagConstraintsEntry) {
        return entry.bagConstraint.dependencies.reduce((allDepsResolved, dependency) => {
            return allDepsResolved && this.attrs[dependency.bagName].resolved;
        }, true);
    }

    public static createFrom(bagConstraints: BagConstraint[]) {
        const attrs = bagConstraints.reduce((resolvableBagConstraints, bagConstraint) => {
            resolvableBagConstraints[bagConstraint.bagName] = { resolved: false, bagConstraint, containsShinyBag: undefined };
            return resolvableBagConstraints;
        }, {} as ResolvableBagConstraintsRecord);

        return new ResolvableBagConstraints(attrs);
    }
}

function COUNT_BAGS_CONTAINING_SHINY_BAG(startingBagsCells: GSheetCells, containingBags: GSheetCells) {
    const [ startingBags ] = extractColumnBasedValues<string>(startingBagsCells);

    const bagConstraints: BagConstraint[] = BagConstraint.createFrom(startingBags, containingBags);

    const resolvableBagConstraints = ResolvableBagConstraints.createFrom(bagConstraints);
    while(resolvableBagConstraints.someResolutionsRemain()) {
        const numberOfShinyBags = resolvableBagConstraints.pickAndResolveFirstResolvableContraint();
    }

    return bagConstraints.map(bagConstraint => [ resolvableBagConstraints.containsShinyBag(bagConstraint.bagName)?1:0 ]);
}

export const countBagsContainingShinyBag = COUNT_BAGS_CONTAINING_SHINY_BAG;
