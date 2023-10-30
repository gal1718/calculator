import "./App.css";
import { useState, useRef, useEffect } from "react";
import {
  ColumnContainer,
  RowContainer,
  GridContainr,
} from "./Common/Common.style";
import Result from "./Result/Result";
import Expression from "./Expression/Expression";
import {
  calcResult,
  parenthesesValidationCheck,
  getReorderStackAndQueue,
} from "./Utils";

const operators = ["*", "-", "+", "/"];
const numbersArr: number[] = new Array(10).fill('').map((_, index) => index);

function App() {
  const [stack, setStack] = useState <string[]>([]);
  const [queue, setQueue] = useState <string[]>([]);
  const [expression, setExpression] = useState<string[]>([]);
  const [result, setResult] = useState(0);
  const lastInputType = useRef("number");
  const [stateHistory, setStateHistory] = useState <{stack: string[], queue:string[], expression: string[], result: number, lastInputType: string }[]>([
    { stack, queue, expression, result, lastInputType: lastInputType.current },
  ]);

  const handleHistorySave = (newStates: {
    newStack : string[],
    newQueue: string[],
    newExpression: string[],
    newResult : number,
    newLastInputType: string}): void => {
    console.log("handleHistorySave called newStates: " + newStates);

    setStateHistory((prevHistory) => [
      ...prevHistory,
      {
        stack: newStates.newStack,
        queue: newStates.newQueue,
        expression: newStates.newExpression,
        result: newStates.newResult,
        lastInputType: newStates.newLastInputType,
      },
    ]);
  };

  const handleNumberClick = (operand: string): void => {
    console.log("handklenumber called");
    let newStack: string[] = stack;
    let newQueue: string[] = queue;
    const newExpression: string[] =
      expression[expression.length - 1] == ")"
        ? [...expression, "*", operand]
        : [...expression, operand];
    setExpression(newExpression);

    if (stack.length == 0) {
      newStack = [...stack, operand];
    }
    //last userInput is a number - concatenate the new digit
    else if (lastInputType.current == "number") {
      console.log("handklenumber called22");
      newStack = stack.map((el, index) => {
        if (index == stack.length - 1) return el + operand;
        else return el;
      });
      //last user input is operator - insert operand to stack as a new element
    } else {
      //add multipication in case that last input is closing parentheses
      console.log("handklenumber called44");
      if (expression[expression.length - 1] == ")") {
        newQueue = [...queue, "*"];
      }
      newStack = [...stack, operand];
    }

    setStack(newStack);
    setQueue(newQueue);

    console.log(
      "tsts ",

      newExpression[newExpression.length - 1] == ")"
    );
    lastInputType.current = "number";

    const newResult =
      newStack.length >= 2 && parenthesesValidationCheck(newQueue)
        ? calcResult(newStack, newQueue)
        : result;

    setResult(newResult);

    handleHistorySave({
      newExpression,
      newStack,
      newQueue,
      newResult,
      newLastInputType: lastInputType.current,
    });
  };

  const handleDotClick = (): void => {
    let newExpression: string[] = expression;
    let newStack: string[] = stack;
    let newQueue: string[] = queue;

    //last input is closing parentheses
    if (expression[expression.length - 1] == ")") {
      const updatedArrs = getReorderStackAndQueue("*", stack, queue);
      newQueue = updatedArrs.syncQueue;
      newStack = [...updatedArrs.syncStack, "0."];
      newExpression = [...expression, "*", "0", "."];
    }
    //last input is operator or none
    else if (stack.length == 0 || lastInputType.current == "operator") {
      newStack = [...stack, "0."];
      newExpression = [...expression, "0", "."];
      //last input is a number - concate last number with the dot
    } else {
      newStack = stack.map((el, index) => {
        if (index == stack.length - 1) return el + ".";
        else return el;
      });
      newExpression = [...expression, "."];
    }
    setQueue(newQueue);
    setStack(newStack);
    setExpression(newExpression);
    lastInputType.current = "number";

    handleHistorySave({
      newExpression,
      newStack,
      newQueue,
      newResult: result,
      newLastInputType: lastInputType.current,
    });
  };

  const handleDELClick = (): void => {
    let previousState: {stack: string[],queue: string[],expression: string[], result: number, lastInputType: string};
    if (stateHistory.length > 1) {
      console.log("handledelClicked called");
      previousState = stateHistory[stateHistory.length - 2];
      setStateHistory(stateHistory.slice(0, -1));

      setStack(previousState.stack);
      setQueue(previousState.queue);
      //no need to call handleSet expression cuz here no need to save an history state
      setExpression(previousState.expression);
      setResult(previousState.result);
      lastInputType.current = previousState.lastInputType;
    }
  };

  const handleEqualClick = (): void => {
    console.log("handleEqualClick called");
    const strResult: string = result.toString();
    setStack([strResult]);
    setQueue([]);
    setExpression([strResult]);
    lastInputType.current = "number";

    handleHistorySave({
      newExpression: [strResult],
      newStack: [strResult],
      newQueue: [],
      newResult: result,
      newLastInputType: lastInputType.current,
    });
  };

  const handleOpenPar = (): void => {
    let newExpression: string[] = expression;
    let newStack: string[] = stack;
    let newQueue: string[] = queue;
    console.log("handleOpenPar called");
    const digitPattern: RegExp = /^\d$/;
    //if the last charecter is a number or closing parenthesws add * before
    if (
      digitPattern.test(expression[expression.length - 1]) ||
      expression[expression.length - 1] == ")"
    ) {
      const updatedArrs = getReorderStackAndQueue("*", stack, queue);
      newQueue = [...updatedArrs.syncQueue, "("];
      newStack = [...updatedArrs.syncStack];
      newExpression = [...expression, "*", "("];
    } else {
      newQueue = [...queue, "("];
      newExpression = [...expression, "("];
    }
    setQueue(newQueue);
    setStack(newStack);
    setExpression(newExpression);
    lastInputType.current = "operator";

    handleHistorySave({
      newExpression,
      newStack,
      newQueue,
      newResult: result,
      newLastInputType: lastInputType.current,
    });
  };

  const handleClosePar = (): void => {
    console.log("handleClosePar called");
    let newExpression: string[] = expression;
    let newStack: string[] = stack;
    let newQueue: string[] = queue;
    //check if queses include open parentesis//need to check the number of open and close par
    if (!queue.includes("(") || queue.length == 0) {
      alert("closing parentheses cannot comes without open Parenthesis");
      return;
    }
    //if parentheses content is null put 0 inside and return - put 0 in stack and remove open parentheses
    if (expression[expression.length - 1] == "(") {
      newExpression = [...expression, "0", ")"];
      newStack = [...stack, "0"];
      newQueue = [...queue.slice(0, -1)];
    } else {
      //move elements, between parentheses,from queue to stack
      console.log("elseeeee newQueue before " + newQueue);
      while (newQueue[newQueue.length - 1] != "(") {
        newStack = [...newStack, newQueue[newQueue.length - 1]];
        newQueue = newQueue.slice(0, -1);
      }
      newQueue = newQueue.slice(0, -1); // remove open parenthesis
      console.log("elseeeee newQueue after " + newQueue);
    }

    console.log("closepar result newQueue ", newQueue);
    const newResult: number =
      newStack.length >= 2 && parenthesesValidationCheck(newQueue)
        ? calcResult(newStack, newQueue)
        : result;

    setResult(newResult);
    if (expression[expression.length - 1] !== "(")
      newExpression = [...expression, ")"];
    setExpression(newExpression);
    setStack(newStack);
    setQueue(newQueue);
    lastInputType.current = "operator";
    handleHistorySave({
      newExpression,
      newStack,
      newQueue,
      newResult: result,
      newLastInputType: lastInputType.current,
    });
  };

  const handleOperatorClick = (newOperator: string): void => {
    console.log("handleOperatorClick called");
    //prevent sequent of operators
    if (
      (lastInputType.current == "operator" &&
        expression[expression.length - 1] != ")" &&
        newOperator != "-") ||
      (expression[expression.length - 1] == "-" &&
        expression[expression.length - 2] == "-")
    )
      return;

       console.log("handleOperatorClick called22");
    if (stack.length == 0 && newOperator != "-") {
      alert("expression cannot start with an operation");
      return;
    }

    let newExpression: string[] = expression;
    let newStack: string[] = stack;
    let newQueue: string[] = queue;

    const preOpearor: string | null = queue.length ? queue[queue?.length - 1] : null;
    const operatorPattern: RegExp = /^[+\-*/]$/;
    // no pre operator. insert new operator to queue. except (-) that can be unary and should go to the stack
    if (!preOpearor && newOperator != "-") {
      newQueue = [...queue, newOperator];
      //preOperator.s exists
      //unary(-)
    } else if (
      newOperator == "-" &&
      (operatorPattern.test(expression[expression.length - 1]) ||
        stack.length == 0)
    ) {
      console.log("handleOperatorClick434 called unary -");
      lastInputType.current = "number";
      newStack = [...stack, newOperator];
      //preOperator.s exists
      //not unary(-)
    } else {

      const updatedArrs: {syncQueue: string[],syncStack: string[]} = getReorderStackAndQueue(newOperator, stack, queue);
      newQueue = [...updatedArrs.syncQueue];
      newStack = [...updatedArrs.syncStack];
      console.log("handleOperatorClick434 called notunary - newQueue " + JSON.stringify(newQueue) + " newStack " + JSON.stringify(newStack));
    }
    if (
      !(newOperator == "-" &&
      (operatorPattern.test(expression[expression.length - 1]) ||
        stack.length == 0))
    )
      lastInputType.current = "operator";
    newExpression = [...expression, newOperator];
    setQueue(newQueue);
    setStack(newStack);
    setExpression(newExpression);
    handleHistorySave({
      newExpression,
      newStack,
      newQueue,
      newResult: result,
      newLastInputType: lastInputType.current,
    });
  };

  return (
    <ColumnContainer>
      <ColumnContainer
        sx={{
          backgroundColor: "#e8e6e3",
          width: "410px",
          borderRadius: "5px",
          border: "white 2px solid",
          marginBottom: "10px",
          height: "100px",
          alignItems: "flex-start",
        }}
      >
        <Expression
          expression={expression}
          handleNumberClick={handleNumberClick}
          handleOperatorClick={handleOperatorClick}
          setExpression={setExpression}
          handleOpenPar={handleOpenPar}
          handleClosePar={handleClosePar}
          handleDotClick={handleDotClick}
          handleDELClick={handleDELClick}
          handleEqualClick={handleEqualClick}
        />
        <Result result={result} />
      </ColumnContainer>

      <RowContainer>
        <GridContainr>
          {numbersArr.map((el, index) => {
            return (
              <button
                key={index}
                className={`item-${el}`}
                value={el}
                onClick={(event) => {
                  handleNumberClick(`${el}`);
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
          <button
            className={`item-.`}
            value={"."}
            onClick={() => {
              handleDotClick();
            }}
          >
            .
          </button>
          {operators.map((el, index) => {
            return (
              <button
                key={index}
                className={`item-${el}`}
                value={el}
                onClick={(event) => {
                  handleOperatorClick(el);
                }}
              >
                {el}
              </button>
            );
          })}

          <button className={`item-=`} onClick={() => handleEqualClick()}>
            =
          </button>
          <button
            className={`item-C`}
            onClick={() => {
              setExpression([]);
              setResult(0);
              setStack([]);
              setQueue([]);
            }}
          >
            C
          </button>
          <button className={`item-DEL`} onClick={handleDELClick}>
            DEL
          </button>
        </GridContainr>
      </RowContainer>
    </ColumnContainer>
  );
}

export default App;
