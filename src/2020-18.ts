

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

    public static addParenthesisForPlusPrecedence(line: string): string[] {
        let operatorsAndOperands = D18Maths.extractOperatorsAndOperandsFrom(line);
        for(var i=0; i<operatorsAndOperands.length; i++) {
            if(operatorsAndOperands[i] === "+") {
                // Trying to locate previous index where to insert a "("
                let startParenthesisInsertionIndexCandidate = i-1, startParenthesisInsertionIndex = undefined, endParenthesisCount = 0;
                while(startParenthesisInsertionIndex === undefined && startParenthesisInsertionIndexCandidate >= 0) {
                    let value = operatorsAndOperands[startParenthesisInsertionIndexCandidate];
                    if(value === ")") {
                        endParenthesisCount++;
                    } else if(value === "(") {
                        endParenthesisCount--;
                        if(endParenthesisCount === 0) {
                            startParenthesisInsertionIndex = startParenthesisInsertionIndexCandidate;
                        }
                    } else if(["*","+"].includes(value)) {
                        // Do nothing
                    } else { // We're on a number
                        if(endParenthesisCount === 0) {
                            startParenthesisInsertionIndex = startParenthesisInsertionIndexCandidate;
                        }
                    }
                    startParenthesisInsertionIndexCandidate--;
                }
                if(startParenthesisInsertionIndex === undefined) {
                    startParenthesisInsertionIndex = 0;
                }

                operatorsAndOperands.splice(startParenthesisInsertionIndex, 0, "(");
                i++;

                // Same than previously, but to locate next index where to insert a ")"
                let endParenthesisInsertionIndexCandidate = i+1, endParenthesisInsertionIndex = undefined, startParenthesisCount = 0;
                while(endParenthesisInsertionIndex === undefined && endParenthesisInsertionIndexCandidate < operatorsAndOperands.length) {
                    let value = operatorsAndOperands[endParenthesisInsertionIndexCandidate];
                    if(value === "(") {
                        startParenthesisCount++;
                    } else if(value === ")") {
                        startParenthesisCount--;
                        if(startParenthesisCount === 0) {
                            endParenthesisInsertionIndex = endParenthesisInsertionIndexCandidate;
                        }
                    } else if(["*","+"].includes(value)) {
                        // Do nothing
                    } else { // We're on a number
                        if(startParenthesisCount === 0) {
                            endParenthesisInsertionIndex = endParenthesisInsertionIndexCandidate;
                        }
                    }
                    endParenthesisInsertionIndexCandidate++;
                }
                if(endParenthesisInsertionIndex === undefined) {
                    endParenthesisInsertionIndex = operatorsAndOperands.length-1;
                }

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