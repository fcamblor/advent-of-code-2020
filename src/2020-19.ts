import {cartesian} from "./utils";


type D19RuleId = number;

export class D19Rule {
    constructor(public readonly id: D19RuleId, private resolvedValues: Set<string>|undefined, private readonly possibleReferences1: D19RuleId[]|undefined, private readonly possibleReferences2: D19RuleId[]|undefined) {
    }

    isResolved() {
        return this.resolvedValues !== undefined;
    }

    requiredUniqueDependencies() {
        const ruleIds = new Set<D19RuleId>();
        this.mapPossibleReferences((possibleReferences => {
            possibleReferences.forEach(ruleId => {
                ruleIds.add(ruleId); // Set won't add if duplicated
            })
        }))
        return Array.from(ruleIds);
    }

    missinRequiredDependencies(rules: Map<D19RuleId, D19Rule>) {
        return this.requiredUniqueDependencies().reduce((missingRequiredDependencies, requiredDependencyId) => {
            return missingRequiredDependencies.concat(rules.get(requiredDependencyId)!.isResolved() ? [] : [ requiredDependencyId ] );
        }, [] as D19RuleId[]);
    }

    allRequiredDependenciesAreResolved(rules: Map<D19RuleId, D19Rule>) {
        return this.missinRequiredDependencies(rules).length === 0;
    }

    resolveWith(rules: Map<D19RuleId, D19Rule>) {
        if(!this.allRequiredDependenciesAreResolved(rules)) {
            throw new Error(`Trying to resolve a rule with unresolved dependencies ! (ruleId=${this.id}, unresolvedDeps=${this.missinRequiredDependencies(rules).join(" ")})`);
        }

        const perPossibleReferenceValues = this.mapPossibleReferences(possibleReferences => {
            return cartesian(...possibleReferences.map(ruleId => Array.from(rules.get(ruleId)!.resolvedValues!))).map(values => values.join(''));
        });

        const resolvedValues = new Set<string>();
        perPossibleReferenceValues.forEach(possibleValues => possibleValues.forEach(possibleValue => resolvedValues.add(possibleValue)))
        this.resolvedValues = resolvedValues;
    }

    matchesWith(candidate: string): boolean {
        if(!this.isResolved()) {
            throw new Error(`You shouldn't call matchesWith() on an unresolved rule (ruleId=${this.id})`);
        }

        return this.resolvedValues!.has(candidate);
    }

    stringified() {
        return JSON.stringify({
            id: this.id,
            resolvedValues: (this.resolvedValues!==undefined)?Array.from(this.resolvedValues):undefined,
            possibleReferences1: this.possibleReferences1,
            possibleReferences2: this.possibleReferences2,
        });
    }

    resolutionStatus(rules: Map<D19RuleId, D19Rule>) {
        const resolutions = this.isResolved()?Array.from(this.resolvedValues!):undefined;
        const possibleValues = this.mapPossibleReferences(possibleReferences => possibleReferences.map(ref => "" + ref + (rules.get(ref)!.isResolved()?"*":"")).join(" ")).join(" | ");

        return {id: this.id, resolutions, possibleValues };
    }

    private mapPossibleReferences<T>(mapper: (possibleReferences: D19RuleId[]) => T): T[] {
        return [this.possibleReferences1, this.possibleReferences2].filter(possibleReferences => !!possibleReferences).map(possibleRef => mapper(possibleRef!));
    }

    public static resolveRules(rules: Map<D19RuleId, D19Rule>) {
        let resolvableRules = Array.from(rules.values()).filter(rule => !rule.isResolved() && rule.missinRequiredDependencies(rules).length===0);
        let unresolvableRules = Array.from(rules.values()).filter(rule => rule.missinRequiredDependencies(rules).length!==0);

        while((unresolvableRules.length + resolvableRules.length) > 0) {
            // D19Rule.debug(rules);
            if(!resolvableRules.length) {
                throw new Error("No remaining resolvable rule found !");
            }

            const resolvableRule = resolvableRules.pop()!;
            resolvableRule.resolveWith(rules);

            const newResolvableRules = unresolvableRules.filter(rule => rule.missinRequiredDependencies(rules).length===0);
            unresolvableRules = unresolvableRules.filter(rule => rule.missinRequiredDependencies(rules).length !== 0);
            resolvableRules = resolvableRules.concat(newResolvableRules);
        }
    }

    public static createFromLine(line: string) {
        let match = line.match(/^([0-9]+): "([a-z]+)"$/);
        if(match) {
            return new D19Rule(Number(match[1]), new Set([ match[2] ]), undefined, undefined);
        }

        // Don't know why but it doesn't work...
        // match = line.match(/^([0-9]+):(?:\s([^\s]+))+$/g)
        match = line.match(/^([0-9]+): ([^|]+)$/)
        if(match) {
            const ruleIds = match[2].split(" ").map(Number) as D19RuleId[];
            return new D19Rule(Number(match[1]), undefined, ruleIds, undefined);
        }

        // Don't know why but it doesn't work...
        // match = line.match(/^([0-9]+): (.+) | (.+)$/)
        match = line.match(/^([0-9]+): (.+)$/)
        if(match) {
            const [ruleIds1Str, ruleIds2Str] = match[2].split("|").map(str => str.trim());
            const ruleIds1 = ruleIds1Str.split(" ").map(Number) as D19RuleId[];
            const ruleIds2 = ruleIds2Str.split(" ").map(Number) as D19RuleId[];
            return new D19Rule(Number(match[1]), undefined, ruleIds1, ruleIds2);
        }

        throw new Error(`Non parsable rule line : ${line}`);
    }

    public static createFromRaw(rawStr: string) {
        return rawStr.split("\n").map(D19Rule.createFromLine).reduce((rulesById, rule) => {
            rulesById.set(rule.id, rule);
            return rulesById;
        }, new Map<D19RuleId, D19Rule>());
    }

    public static debug(rules: Map<D19RuleId, D19Rule>) {
        const resolutionStatuses = Array.from(rules.values()).map(rule => rule.resolutionStatus(rules));
        console.log(resolutionStatuses);
    }
}

export function countMessagesMatchingRules(rawRules: string, rawMessages: string) {
    let rulesMap = D19Rule.createFromRaw(rawRules);
    D19Rule.resolveRules(rulesMap);
    const rule0 = rulesMap.get(0)!;
    return rawMessages.split("\n").reduce((count, line) => count + (rule0.matchesWith(line)?1:0), 0);
}