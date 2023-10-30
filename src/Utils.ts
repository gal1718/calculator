//parentheses are vaild only if they arent exist on queue
export const parenthesesValidationCheck = (newQueue: string[]) => {
  return !(newQueue.includes(")") || newQueue.includes("("))
};

export const getReorderStackAndQueue = (newOperator: string, stack: string[], queue: string[]) => {
  console.log("reorderByPrecedence called");
  console.log("new operator: " + newOperator);
  let higherOperators = [];
  if (["+", "-"].includes(newOperator)) higherOperators = ["+", "-", "*", "/"];
  else higherOperators = ["*", "/"];
  let syncQueue = [...queue];
  let syncStack = [...stack];
  //move operators with higer or equal precedence to stack
  while (
    higherOperators.includes(syncQueue[syncQueue.length - 1]) &&
    syncQueue[syncQueue.length - 1] != "("
  ) {
    const op = syncQueue.pop()
    if(op) {
    syncStack = [...syncStack, op];
    }
  }
  //after moving higher/equal precedence operators to stack - add the new operator to queue
  syncQueue = [...syncQueue, newOperator];
  const updatedArrs = { syncStack, syncQueue };
  return updatedArrs;
};

export const applyInnerCalc = (operator: string, operand1: number, operand2:  number) => {
  switch (operator) {
    case "+":
      return operand1 + operand2;
    case "-":
      return operand1 - operand2;
    case "*":
      return operand1 * operand2;
    case "/":
      return operand1 / operand2;
    default:
      return 0
  }
};

export const findFirstOperatorIndex = (newStack: string[]) => {
  //find the first operator. the first operator will always have 2 operands before him.
  for (let i = 0; i < newStack.length; i++) {
    if (/[+\-*/]/.test(newStack[i]) && newStack[i].length == 1) {
      return i;
    }
  }
  return newStack.length - 1
};

export const calcResult = (updatedStack: string[], updatedQueue: string[]) => {
  console.log("calcResult called");
  try {
    let newStack = [...updatedStack];
    let newQueue = [...updatedQueue];
    let operator;
    let operand1;
    let operand2;
    let operatorIndex = -1;
    let innerCalcResult = 0;

    //push left operators from queue to stack
    while (newQueue.length > 0) {
      const op = newQueue.pop();
      if(op)
        newStack.push(op);
    }
    //as long as newStack has more then one character ( the final result ) keep calculate
    while (newStack.length > 1) {
      operatorIndex = findFirstOperatorIndex(newStack);
      operator = newStack[operatorIndex];
      //define the two operands that comed before the operator
      operand1 = Number(newStack[operatorIndex - 2]);
      operand2 = Number(newStack[operatorIndex - 1]);
      //calc inner result
      innerCalcResult = applyInnerCalc(operator, operand1, operand2);
      //replace the three operator and operands with the innerCalcResult
      newStack.splice(operatorIndex - 2, 3, innerCalcResult.toString());
    }
    //setResult(newStack[0]);
    return Number(newStack[0]);
  } catch (err) {
    console.log(err);
    return 0
  }
  //??
  //   if (expression[expression.length - 1] != ")")
  //     lastInputType.current = "number";
};

