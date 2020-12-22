import {cartesian} from "./utils";


type D19RuleId = number;

export abstract class D19Rule {
    constructor(public readonly id: D19RuleId) {
    }

    isResolved(): this is D19ResolvedRule {
        return this instanceof D19ResolvedRule;
    }
    isNotResolved(): this is D19UnresolvedRule {
        return !this.isResolved();
    }

    abstract resolutionStatus(rules: Map<D19RuleId, D19Rule>): object;

    public static resolveRules(rules: D19Rule[]) {
        const resolvedRules = rules.reduce((resolvedRulesById, rule) => {
            if(rule.isResolved()) {
                resolvedRulesById.set(rule.id, rule);
            }
            return resolvedRulesById;
        }, new Map<D19RuleId, D19ResolvedRule>())
        let resolvableRules = rules.filter(rule => rule.isNotResolved() && rule.missinRequiredDependencies(resolvedRules).length===0) as D19UnresolvedRule[];
        let unresolvableRules = rules.filter(rule => rule.isNotResolved() && rule.missinRequiredDependencies(resolvedRules).length!==0) as D19UnresolvedRule[];

        while((unresolvableRules.length + resolvableRules.length) > 0) {
            // D19Rule.debug(rules);
            if(!resolvableRules.length) {
                throw new Error("No remaining resolvable rule found !");
            }

            const resolvableRule = resolvableRules.pop()!;
            const resolvedRule = resolvableRule.resolveWith(resolvedRules);
            resolvedRules.set(resolvedRule.id, resolvedRule);

            const newResolvableRules = unresolvableRules.filter(rule => rule.missinRequiredDependencies(resolvedRules).length===0);
            unresolvableRules = unresolvableRules.filter(rule => rule.missinRequiredDependencies(resolvedRules).length !== 0);
            resolvableRules = resolvableRules.concat(newResolvableRules);
        }

        return { resolvedRules };
    }

    public static createFromLine(line: string) {
        let match = line.match(/^([0-9]+): "([a-z]+)"$/);
        if(match) {
            return new D19ResolvedRule(Number(match[1]), new Set([ match[2] ]));
        }

        // Don't know why but it doesn't work...
        // match = line.match(/^([0-9]+):(?:\s([^\s]+))+$/g)
        match = line.match(/^([0-9]+): ([^|]+)$/)
        if(match) {
            const ruleIds = match[2].split(" ").map(Number) as D19RuleId[];
            return new D19UnresolvedRule(Number(match[1]), ruleIds, undefined);
        }

        // Don't know why but it doesn't work...
        // match = line.match(/^([0-9]+): (.+) | (.+)$/)
        match = line.match(/^([0-9]+): (.+)$/)
        if(match) {
            const [ruleIds1Str, ruleIds2Str] = match[2].split("|").map(str => str.trim());
            const ruleIds1 = ruleIds1Str.split(" ").map(Number) as D19RuleId[];
            const ruleIds2 = ruleIds2Str.split(" ").map(Number) as D19RuleId[];
            return new D19UnresolvedRule(Number(match[1]), ruleIds1, ruleIds2);
        }

        throw new Error(`Non parsable rule line : ${line}`);
    }

    public static createFromRaw(rawStr: string) {
        return rawStr.split("\n").map(D19Rule.createFromLine).reduce((rules, rule) => rules.concat(rule), [] as D19Rule[]);
    }

    public static debug(rules: D19Rule[], resolvedRules: Map<D19RuleId, D19ResolvedRule>) {
        const resolutionStatuses = rules.map(rule => rule.resolutionStatus(resolvedRules));
        console.log(resolutionStatuses);
    }
}

export class D19UnresolvedRule extends D19Rule {
    constructor(id: D19RuleId, public readonly possibleReferences1: D19RuleId[], public readonly possibleReferences2: D19RuleId[]|undefined) {
        super(id);
    }

    resolutionStatus(rules: Map<D19RuleId, D19Rule>) {
        const possibleValues = this.mapPossibleReferences(possibleReferences => possibleReferences.map(ref => "" + ref + (rules.get(ref)!.isResolved()?"*":"")).join(" ")).join(" | ");

        return {id: this.id, resolutions: undefined, possibleValues };
    }

    private mapPossibleReferences<T>(mapper: (possibleReferences: D19RuleId[]) => T): T[] {
        return [this.possibleReferences1, this.possibleReferences2].filter(possibleReferences => !!possibleReferences).map(possibleRef => mapper(possibleRef!));
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

    missinRequiredDependencies(resolvedRules: Map<D19RuleId, D19ResolvedRule>) {
        return this.requiredUniqueDependencies().reduce((missingRequiredDependencies, requiredDependencyId) => {
            return missingRequiredDependencies.concat(resolvedRules.has(requiredDependencyId) ? [] : [ requiredDependencyId ] );
        }, [] as D19RuleId[]);
    }

    allRequiredDependenciesAreResolved(resolvedRules: Map<D19RuleId, D19ResolvedRule>) {
        return this.missinRequiredDependencies(resolvedRules).length === 0;
    }

    resolveWith(resolvedRules: Map<D19RuleId, D19ResolvedRule>) {
        if(!this.allRequiredDependenciesAreResolved(resolvedRules)) {
            throw new Error(`Trying to resolve a rule with unresolved dependencies ! (ruleId=${this.id}, unresolvedDeps=${this.missinRequiredDependencies(resolvedRules).join(" ")})`);
        }

        const perPossibleReferenceValues = this.mapPossibleReferences(possibleReferences => {
            return cartesian(...possibleReferences.map(ruleId => Array.from(resolvedRules.get(ruleId)!.resolvedValues!))).map(values => values.join(''));
        });

        const resolvedValues = new Set<string>();
        perPossibleReferenceValues.forEach(possibleValues => possibleValues.forEach(possibleValue => resolvedValues.add(possibleValue)))
        return new D19ResolvedRule(this.id, resolvedValues);
    }
}

export class D19ResolvedRule extends D19Rule {
    constructor(id: D19RuleId, public readonly resolvedValues: Set<string>) {
        super(id)
    }

    resolutionStatus(rules: Map<D19RuleId, D19Rule>) {
        const resolutions = this.isResolved()?Array.from(this.resolvedValues!):undefined;

        return {id: this.id, resolutions };
    }

    matchesWith(candidate: string): boolean {
        return this.resolvedValues!.has(candidate);
    }
}

export class D19SpecialRule {
    constructor(public readonly resolvedRules: Map<number, D19ResolvedRule>) {
    }

    matchesWith(candidate: string): boolean {
        cartesian()

        let regex42 = this.generateResolvedRuleRegex(42);
        let regex31 = this.generateResolvedRuleRegex(31);
        // given that input is maximum 96-97 chars long, and candidates for rules 42 and 31 are 8-chars long candidates,
        // it means that we need to balance regex42 and regex31 between 1 and 12 occurence, without overtaking a total
        // amount of 12 occurences with both regexes
        const matches = cartesian([1,2,3,4,5,6,7,8,9,10,11,12],[1,2,3,4,5,6,7,8,9,10,11,12])
            .filter(([s1,s2]) => s1+s2<=12)
            .reduce((matches, [s1, s2]) => {
                const rule8Regex = `(?:${regex42}){${s1}}`;
                const rule11Regex = `(?:(?:${regex42}){${s2}}(?:${regex31}){${s2}})`;
                let rule0Regex = `^(?:${rule8Regex}${rule11Regex})$`;
                return matches || !!candidate.match(rule0Regex);
            }, false);
        return matches;
    }

    generateResolvedRuleRegex(ruleId: number) {
        return Array.from(this.resolvedRules.get(ruleId)!.resolvedValues).map(rv => `${rv}`).join("|");
    }
}

export function messagesMatchingRules(rawRules: string, rawMessages: string) {
    let rules = D19Rule.createFromRaw(rawRules);
    const { resolvedRules } = D19Rule.resolveRules(rules);
    const rule0 = resolvedRules.get(0)!;
    return rawMessages.split("\n").filter(line => rule0.matchesWith(line));
}

export function messagesMatchingUpdatedRules(rawRules: string, rawMessages: string) {
    let rules = D19Rule.createFromRaw(rawRules);
    const { resolvedRules } = D19Rule.resolveRules(rules);
    const specialRule = new D19SpecialRule(resolvedRules);
    return rawMessages.split("\n").filter(line => specialRule.matchesWith(line));
}