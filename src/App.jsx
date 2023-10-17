import "./App.css";
import { useState, useRef, useEffect } from "react";
import "./Common/Common.style";
import {
  ColumnContainer,
  RowContainer,
  GridContainr,
} from "./Common/Common.style";
import Result from "./Result/Result";
import Expression from "./Expression/Expression";

function App() {
  const [stack, setStack] = useState([]);
  const [queues, setQueues] = useState([]);
  const [expression, setExpression] = useState([]);
  const [stateHistory, setStateHistory] = useState([]);
  const [result, setResult] = useState(0);
  const operators = ["*", ".", "-", "+", "/"];
  const numbersArr = new Array(10).fill().map((_, index) => index);
  const lastInputType = useRef("number");
  const [history, setHistory] = useState([]);

  ////////////////////////////////////////////////V1//////////////////////////////////////////////////////////////////////
  // Use a useEffect hook to call calcResult after the expression state updates.
  useEffect(() => {
    // Calculate the result only if the stack has at least 2 characters
    console.log("useeffect of state called stack is " + JSON.stringify(stack));
    if (
      stack.length >= 2 &&
      ((lastInputType.current == "number" &&
        expression[expression.length - 1] != "-") ||
        expression[expression.length - 1] == ")")
    ) {
      calcResult();
    }
  }, [stack]);

  const handleOpenPar = () => {
    const digitPattern = /^\d$/;
    //if the last charecter is number add *
    if (digitPattern.test(expression[expression.length - 1])) {
      setQueues([...queues, "*", "("]);
      setExpression([...expression, "("]);
    } else {
      setQueues([...queues, "("]);
      setExpression([...expression, "("]);
    }
    lastInputType.current = "operator";
  };

  const handleClosePar = () => {
    //check if queses include open parentesis
    if (!queues.includes("(") || queues.length == 0) {
      alert("closing parentheses cannot comes without open Parenthesis");
      return;
    }
    //move elements between par-  from queue to stack
    let newQueues = [...queues];
    let newStack = [...stack];
    while (newQueues[newQueues.length - 1] != "(") {
      newStack = [...newStack, newQueues[newQueues.length - 1]];
      newQueues = newQueues.slice(0, -1);
    }
    newQueues = newQueues.slice(0, -1); // remove open parenthesis
    setStack(newStack);
    setQueues(newQueues);
    setExpression([...expression, ")"]);
    lastInputType.current = "operator";
  };

  const handleNumberClick = (operand) => {
    //first userInput
    if (stack.length == 0) {
      setStack([operand]);
    }
    //last userInput is a number - concatenate the next number
    else if (lastInputType.current == "number") {
      console.log("if lastInputType.current == number");
      let stackCopy = stack;
      const lastElement = stackCopy.pop();

      setStack([...stackCopy, lastElement + operand]);
      //last user input is operator - insert operand to stack as a new element
    } else {
      //add multipication in case that last input is closing parentheses
      if (expression[expression.length - 1] == ")") setQueues([...queues, "*"]);
      console.log("lastInput is operator stack is: " + JSON.stringify(stack));
      setStack([...stack, operand]);
    }
    setExpression([...expression, operand]);
    lastInputType.current = "number";
  };

  const handleOperatorClick = (newOperator) => {
    if (stack.length == 0 && newOperator != "-") {
      alert("expression cannot start with an operation");
      return;
    }
    const preOpearor = queues[queues.length - 1];
    const operatorPattern = /^[+\-*/]$/;
    // no pre operator. insert new operator to queue. except (-) that can be unary and should go to the stack
    if (!preOpearor && newOperator != "-") {
      setQueues([...queues, newOperator]);

      //preOperator.s exists
      //unary(-)
      //new operator is minus and last input is an operator or stack empty (-) is unary
    } else if (
      newOperator == "-" &&
      (operatorPattern.test(expression[expression.length - 1]) ||
        stack.length == 0)
    ) {
      console.log("unary minus");
      lastInputType.current = "number";
      setStack([...stack, newOperator]);
      setExpression([...expression, newOperator]);
      return;
      //preOperator.s exists
      //not unary(-)
    } else {
      let higherOperators = [];
      if (["+", "-"].includes(newOperator))
        higherOperators = ["+", "-", "*", "/"];
      else higherOperators = ["*", "/"];
      let asyncQueue = [...queues];
      let asyncStack = [...stack];

      //move operators with higer or equal precedence to stack
      while (
        higherOperators.includes(asyncQueue[asyncQueue.length - 1]) &&
        asyncQueue[asyncQueue.length - 1] != "("
      ) {
        asyncStack = [...asyncStack, asyncQueue.pop()];
        console.log("asyncStack " + asyncStack);
        console.log("asyncQueue " + asyncQueue);
      }
      //put the new operator in queue
      setStack([...asyncStack]);
      setQueues([...asyncQueue, newOperator]);
    }

    setExpression([...expression, newOperator]);
    lastInputType.current = "operator";
  };

  const applyInnerCalc = (operator, operand1, operand2) => {
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
        throw new Error("Invalid operator");
    }
  };

  const findFirstOperatorIndex = (newStack) => {
    //find the first operator. the first operator will always have 2 operands before him.
    for (let i = 0; i < newStack.length; i++) {
      if (/[+\-*/]/.test(newStack[i]) && newStack[i].length == 1) {
        return i;
      }
    }
  };

  const calcResult = () => {
    console.log("calcResult called");
    console.log("0 " + JSON.stringify(stack));
    try {
      //let newStack = stack;
      let newStack = [...stack];
      let newQueues = [...queues];
      let operator;
      let operand1;
      let operand2;
      let operatorIndex;
      let innerCalcResult = 0;

      //push left operators from queue to stack
      while (newQueues.length > 0) {
        newStack.push(newQueues.pop());
      }
      console.log("1 " + JSON.stringify(stack));
      // console.log("newStack : " + JSON.stringify(newStack));
      // console.log("newQueues : " + JSON.stringify(newQueues));

      //as long as newStack has more then one character ( the final result ) keep calculate
      while (newStack.length > 1) {
        operatorIndex = findFirstOperatorIndex(newStack);
        operator = newStack[operatorIndex];

        //define the two operands that comed before the operator
        operand1 = Number(newStack[operatorIndex - 2]);
        operand2 = Number(newStack[operatorIndex - 1]);

        //calc inner result
        console.log(
          "operator " +
            operator +
            " operand1 " +
            operand1 +
            " operand2" +
            operand2
        );
        innerCalcResult = applyInnerCalc(operator, operand1, operand2);

        //replace the three operator and operands with the innerCalcResult
        newStack.splice(operatorIndex - 2, 3, innerCalcResult.toString());
      }
      console.log("2 " + JSON.stringify(stack));
      setResult(newStack[0]);
      //setStack([newStack[0]]);
      //setExpression(newStack[0].toString());
      //setQueues([]);
    } catch (err) {
      console.log(err);
    }
    lastInputType.current = "number";
  };

  return (
    <ColumnContainer>
      <Result result={result} />
      <Expression expression={expression} />

      <RowContainer>
        <GridContainr>
          {numbersArr.map((el, index) => {
            return (
              <button
                key={index}
                className={`item-${el}`}
                value={el}
                onClick={(event) => {
                  handleNumberClick(event.target.value);
                }}
              >
                {el}
              </button>
            );
          })}
          <button
            key="("
            className={"item-("}
            value="("
            onClick={() => handleOpenPar()}
          >
            {"("}
          </button>
          <button
            key=")"
            className={"item-)"}
            value="("
            onClick={() => handleClosePar()}
          >
            {")"}
          </button>
          {operators.map((el, index) => {
            return (
              <button
                key={index}
                className={`item-${el}`}
                value={el}
                onClick={(event) => {
                  handleOperatorClick(event.target.value);
                }}
              >
                {el}
              </button>
            );
          })}

          <button className={`item-=`} onClick={() => calcResult()}>
            =
          </button>
          <button
            className={`item-C`}
            onClick={() => {
              setExpression("");
              setResult(0);
              setStack([]);
              setQueues([]);
            }}
          >
            C
          </button>
          <button
            className={`item-DEL`}
            onClick={() => setExpression(expression.slice(0, -1))}
          >
            DEL
          </button>
        </GridContainr>
      </RowContainer>
    </ColumnContainer>
  );
}

export default App;
