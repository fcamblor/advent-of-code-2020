

type Operator = "+"|"*";

export class D18Maths {
    public static sumAll(str: string, parseAndEvaluator: (line: string) => number = D18Maths.parseAndEvaluate) {
        return str.split("\n").reduce((result, line) => result + parseAndEvaluator(line), 0);
    }

    public static parseAndEvaluate(line: string): number {
        let operatorsAndOperands = D18Maths.extractOperatorsAndOperandsFrom(line);
        return D18Maths.evaluate(operatorsAndOperands);
    }

    public static evaluate(operatorsAndOperands: string[]) {
        return operatorsAndOperands.reduce(({ stack }, operatorOrOperand) => {
            if(operatorOrOperand === "+" || operatorOrOperand === "*") {
                stack[stack.length-1].latestOperator = operatorOrOperand;
            } else if(operatorOrOperand === "(") {
                stack.push({ accumulator: undefined, latestOperator: undefined });
            } else {
                let num;
                if(operatorOrOperand === ")") {
                    num = stack.pop()!.accumulator;
                } else {
                    num = Number(operatorOrOperand);
                }

                if(stack[stack.length-1].accumulator !== undefined) {
                    if(stack[stack.length-1].latestOperator === '*') {
                        stack[stack.length-1].accumulator! *= num!;
                    } else if(stack[stack.length-1].latestOperator === '+') {
                        stack[stack.length-1].accumulator! += num!;
                    } else {
                        throw new Error("Unexpected latest operator : "+stack[stack.length-1].latestOperator);
                    }
                    stack[stack.length-1].latestOperator = undefined;
                } else {
                    stack[stack.length-1].accumulator = num;
                }
            }

            return { stack };
        }, { stack: [{ accumulator: undefined, latestOperator: undefined }] } as { stack: { accumulator: number|undefined, latestOperator: Operator|undefined }[] }).stack[0].accumulator!;
    }

    public static extractOperatorsAndOperandsFrom(line: string) {
        return line.replace(/\(/g, "( ").replace(/\)/g, " )").split(" ");
    }

    private static findAdditionnalParenthesisIndex(operatorsAndOperands: string[], startingIndex: number, opts: {
        step: number,
        incrementIntermediateParenthesisOn: "("|")",
        decrementIntermediateParenthesisOn: "("|")",
    }): number {
        let indexCandidate = startingIndex + opts.step, additionnalParenthesisInsertionIndex = undefined, intermediateParenthesisCount = 0;
        while(additionnalParenthesisInsertionIndex === undefined && indexCandidate >= 0 && indexCandidate < operatorsAndOperands.length) {
            let value = operatorsAndOperands[indexCandidate];
            if(value === opts.incrementIntermediateParenthesisOn) {
                intermediateParenthesisCount++;
            } else if(value === opts.decrementIntermediateParenthesisOn) {
                intermediateParenthesisCount--;
                if(intermediateParenthesisCount === 0) {
                    additionnalParenthesisInsertionIndex = indexCandidate;
                }
            } else if(["*","+"].includes(value)) {
                // Do nothing
            } else { // We're on a number
                if(intermediateParenthesisCount === 0) {
                    additionnalParenthesisInsertionIndex = indexCandidate;
                }
            }
            indexCandidate += opts.step;
        }
        if(additionnalParenthesisInsertionIndex === undefined) {
            additionnalParenthesisInsertionIndex = indexCandidate - opts.step;
        }

        return additionnalParenthesisInsertionIndex;
    }

    public static addParenthesisForPlusPrecedence(line: string): string[] {
        let operatorsAndOperands = D18Maths.extractOperatorsAndOperandsFrom(line);
        for(let i=0; i<operatorsAndOperands.length; i++) {
            if(operatorsAndOperands[i] === "+") {
                // Trying to locate previous index where to insert a "("
                const startParenthesisInsertionIndex = D18Maths.findAdditionnalParenthesisIndex(operatorsAndOperands, i, {
                    step: -1, incrementIntermediateParenthesisOn: ")", decrementIntermediateParenthesisOn: "("
                });
                operatorsAndOperands.splice(startParenthesisInsertionIndex, 0, "(");
                i++;

                // Same than previously, but to locate next index where to insert a ")"
                const endParenthesisInsertionIndex = D18Maths.findAdditionnalParenthesisIndex(operatorsAndOperands, i, {
                    step: 1, incrementIntermediateParenthesisOn: "(", decrementIntermediateParenthesisOn: ")"
                });
                operatorsAndOperands.splice(endParenthesisInsertionIndex+1, 0, ")");
                i++;
            }
        }
        return operatorsAndOperands;
    }

    public static parseAndEvaluate2(str: string): number {
        return D18Maths.evaluate(D18Maths.addParenthesisForPlusPrecedence(str));
    }


}