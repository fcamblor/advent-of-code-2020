

type Operator = "+"|"*";

export class D18Maths {
    public static sumAll(str: string) {
        return str.split("\n").reduce((result, line) => result + D18Maths.evaluate(line), 0);
    }

    public static evaluate(str: string): number {
        let operatorsAndOperands = str.replace(/\(/g, "( ").replace(/\)/g, " )").split(" ");
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


}