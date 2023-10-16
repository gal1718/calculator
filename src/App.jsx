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
  const [expression, setExpression] = useState("");
  const [stateHistory, setStateHistory] = useState([]);
  const [result, setResult] = useState(0);
  const operators = ["*", ".", "-", "+", "/"];
  const numbersArr = new Array(10).fill().map((_, index) => index);
  const lastInputType = useRef("number");
  const [history, setHistory] = useState([]);

  useEffect(() => {
    setHistory([...history, {stack}]);
  }, [stack]);

  useEffect(() => {

  }, [queues]);

  useEffect(() => {

  }, [expression]);

  useEffect(() => {

  }, [lastInputType]);

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
    let newQueues = queues;
    let newStack = stack;
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
    if (stack.length == 0) setStack([operand]);
    //last userInput is a number - concatenate the next number
    else if (lastInputType.current == "number") {
      let stackCopy = stack;
      const lastElement = stackCopy.pop();
      setStack([...stackCopy, lastElement + operand]);
      //last user input is operator - insert operand to stack as a new element
    } else {
      //add multipication in case that last input is closing parentheses
      if (expression[expression.length - 1] == ")") setQueues([...queues, "*"]);
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
    let tempQueues = queues;
    // no pre operator. insert new operator to queue
    if (!preOpearor && newOperator != "-") {
      setQueues([...queues, newOperator]);
    } else {
      const operatorPattern = /^[+\-*/]$/;
      switch (newOperator) {
        case "-":
          //unary(-)
          if (
            operatorPattern.test(expression[expression.length - 1]) ||
            stack.length == 0
          ) {
            lastInputType.current = "number";
            setStack([...stack, newOperator]);
            setExpression([...expression, newOperator]);
            return;
            //binary (-)
          } else {
            switch (preOpearor) {
              case "(":
                setQueues([...queues, newOperator]);
                break;
              default:
                console.log("C");
                if (preOpearor) setStack([...stack, preOpearor]);
                setQueues([...tempQueues.slice(0, -1), newOperator]);
                break;
            }
          }
          break;
        case "+":
          switch (preOpearor) {
            case "(":
              setQueues([...queues, newOperator]);
              break;

            default:
              setStack([...stack, preOpearor]);
              setQueues([...tempQueues.slice(0, -1), newOperator]);
              break;
          }
          break;
        case "*":
        case "/":
          switch (preOpearor) {
            case "(":
            case "+":
            case "-":
              setQueues([...queues, newOperator]);
              break;
            default:
              setStack([...stack, preOpearor]);
              setQueues([...tempQueues.slice(0, -1), newOperator]);
              break;
          }
          break;
      }
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
    try {
      let newStack = stack;
      let newQueues = queues;
      let operator;
      let operand1;
      let operand2;
      let operatorIndex;
      let innerCalcResult = 0;

      //push left operators from queue to stack
      while (newQueues.length > 0) {
        newStack.push(newQueues.pop());
      }
      console.log("newStack : " + JSON.stringify(newStack));
      console.log("newQueues : " + JSON.stringify(newQueues));

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
        console.log("newStack end " + JSON.stringify(newStack));
      }

      setResult(newStack[0]);
      setStack([newStack[0]]);
      setExpression(newStack[0].toString());
      setQueues([]);
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
                onClick={(event) => {handleNumberClick(event.target.value);calcResult()}}
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
                onClick={(event) => {handleOperatorClick(event.target.value);calcResult()}}
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
