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
  const operators = ["*", "-", "+", "/"];
  const numbersArr = new Array(10).fill().map((_, index) => index);
  const lastInputType = useRef("number");
  const [isDELClicked, setIsDELClicked] = useState(false);

  useEffect(() => {
    if (!isDELClicked) {
      console.log("new state saved to history");
      setStateHistory((prevHistory) => [
        ...prevHistory,
        {
          stack,
          queues,
          expression,
          result,
          lastInputType: lastInputType.current,
        },
      ]);
    } else {
      setIsDELClicked(false); // Reset the flag
    }
  }, [expression]);

  // Use a useEffect hook to call calcResult after the stack updated.
  useEffect(() => {
    if (
      stack.length >= 2 &&
      (lastInputType.current == "number" ||
        expression[expression.length - 1] == ")") &&
      parenthesesValidationCheck()
    ) {
      console.log("calcres useaffect called");
      calcResult();
    }
  }, [stack]);

  //parentheses are vaild only if they arent exist on queue
  const parenthesesValidationCheck = () => {
    if (queues.includes(")") || queues.includes("(")) {
      console.log("parenthesesValidationCheck returning false");
      return false;
    }
    console.log("parenthesesValidationCheck returning true");
    return true;
  };

  const handleDotClick = () => {
    //last input is closing parentheses
    if (expression[expression.length - 1] == ")") {
      const updatedArrs = getReorderStackAndQueue("*");
      setQueues([...updatedArrs.syncQueue]);
      setStack([...updatedArrs.syncStack, "0."]);
      setExpression([...expression, "*", "0", "."]);
    }
    //last input is operator or none
    else if (stack.length == 0 || lastInputType.current == "operator") {
      setStack([...stack, "0."]);
      setExpression([...expression, "0", "."]);
      //last input is a number - concate last number with the dot
    } else {
      let stackCopy = [...stack];
      const lastElement = stackCopy.pop();
      setStack([...stackCopy, lastElement + "."]);
      setExpression([...expression, "."]);
    }
    lastInputType.current = "number";
  };

  const handleDELClick = () => {
    let previousState;
    if (stateHistory.length > 1) {
      console.log("handledelClicked called");
      previousState = stateHistory[stateHistory.length - 2];
      setStateHistory(stateHistory.slice(0, -1));

      setStack(previousState.stack);
      setQueues(previousState.queues);
      setExpression(previousState.expression);
      setResult(previousState.result);
      lastInputType.current = previousState.lastInputType;
    }
  };

  const handleEqualClick = () => {
    console.log("handleEqualClick called");
    const strResult = result.toString();
    setStack([strResult]);
    setQueues([]);
    setExpression([strResult]);
  };

  const handleOpenPar = async () => {
    console.log("handleOpenPar called");
    const digitPattern = /^\d$/;
    //if the last charecter is a number or closing parenthesws add * before
    if (
      digitPattern.test(expression[expression.length - 1]) ||
      expression[expression.length - 1] == ")"
    ) {
      lastInputType.current = "operator";
      const updatedArrs = getReorderStackAndQueue("*");
      setQueues([...updatedArrs.syncQueue, "("]);
      setStack([...updatedArrs.syncStack]);
      setExpression([...expression, "*", "("]);
    } else {
      setQueues([...queues, "("]);
      setExpression([...expression, "("]);
    }
    lastInputType.current = "operator";
  };

  const getReorderStackAndQueue = (newOperator) => {
    console.log("reorderByPrecedence called");
    console.log("new operator: " + newOperator);
    let higherOperators = [];
    if (["+", "-"].includes(newOperator))
      higherOperators = ["+", "-", "*", "/"];
    else higherOperators = ["*", "/"];
    let syncQueue = [...queues];
    let syncStack = [...stack];
    // console.log("syncStack before" + syncStack);
    // console.log("syncQueue before" + syncQueue);
    //move operators with higer or equal precedence to stack
    while (
      higherOperators.includes(syncQueue[syncQueue.length - 1]) &&
      syncQueue[syncQueue.length - 1] != "("
    ) {
      syncStack = [...syncStack, syncQueue.pop()];
    }
    //after moving higher/equal precedence operators to stack - add the new operator to queue
    syncQueue = [...syncQueue, newOperator];
    // console.log("syncStack " + syncStack);
    // console.log("syncQueue " + syncQueue);
    const updatedArrs = { syncStack, syncQueue };
    return updatedArrs;
  };

  const handleClosePar = () => {
    console.log("handleClosePar called");
    //check if queses include open parentesis//need to check the number of open and close par
    if (!queues.includes("(") || queues.length == 0) {
      alert("closing parentheses cannot comes without open Parenthesis");
      return;
    }
    //if parentheses content is null put 0 inside and return - put 0 in stack , remove open parentheses and return
    if (expression[expression.length - 1] == "(") {
      setExpression([...expression, "0", ")"]);
      setStack([...stack, "0"]);
      let copyQueues = [...queues];
      setQueues([...copyQueues.slice(0, -1)]);
      lastInputType.current = "operator";
      return;
    }
    //move elements, between parentheses,from queue to stack
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
    console.log(
      "handleNumberClick called last user input is : " + lastInputType.current
    );
    //first userInput
    if (stack.length == 0) {
      setStack([operand]);
    }
    //last userInput is a number - concatenate the new digit
    else if (lastInputType.current == "number") {
      let stackCopy = [...stack];
      const lastElement = stackCopy.pop();
      setStack([...stackCopy, lastElement + operand]);
      //last user input is operator - insert operand to stack as a new element
    } else {
      //add multipication in case that last input is closing parentheses
      if (expression[expression.length - 1] == ")") {
        setQueues([...queues, "*"]);
        setStack([...stack, operand]);
        lastInputType.current = "number";
        return;
      }
      setStack([...stack, operand]);
    }
    lastInputType.current = "number";
  };

  const handleOperatorClick = (newOperator) => {
    console.log("handleOperatorClick called");
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
    } else if (
      newOperator == "-" &&
      (operatorPattern.test(expression[expression.length - 1]) ||
        stack.length == 0)
    ) {
      lastInputType.current = "number";
      setStack([...stack, newOperator]);
      return;
      //preOperator.s exists
      //not unary(-)
    } else {
      const updatedArrs = getReorderStackAndQueue(newOperator);
      setQueues([...updatedArrs.syncQueue]);
      setStack([...updatedArrs.syncStack]);
    }
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
    try {
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
      setResult(newStack[0]);
    } catch (err) {
      console.log(err);
    }
    //??
    if (expression[expression.length - 1] != ")")
      lastInputType.current = "number";
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
          handleOpenPar = {handleOpenPar}
          handleClosePar = {handleClosePar}
          handleDotClick = {handleDotClick}
          handleDELClick={handleDELClick}
          handleEqualClick = {handleEqualClick}
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
                  handleNumberClick(event.target.value);
                  if (expression[expression.length - 1] == ")")
                    setExpression([...expression, "*" + event.target.value]);
                  else setExpression([...expression, event.target.value]);
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
                  //prevent sequent of operators
                  if (
                    (lastInputType.current == "operator" &&
                      expression[expression.length - 1] != ")" &&
                      event.target.value != "-") ||
                    (expression[expression.length - 1] == "-" &&
                      expression[expression.length - 2] == "-")
                  ) {
                    return;
                  } else {
                    handleOperatorClick(event.target.value);
                    setExpression([...expression, event.target.value]);
                  }
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
              setQueues([]);
            }}
          >
            C
          </button>
          <button
            className={`item-DEL`}
            onClick={() => {
              setIsDELClicked(true);
              handleDELClick();
            }}
          >
            DEL
          </button>
        </GridContainr>
      </RowContainer>
    </ColumnContainer>
  );
}

export default App;
