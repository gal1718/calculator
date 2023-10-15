import "./App.css";
import { useState, useRef } from "react";
import "../src/Common/Common.style";
import {
  ColumnContainer,
  RowContainer,
  GridContainr,
} from "../src/Common/Common.style";

function App() {
  const [stack, setStack] = useState([]);
  const [queues, setQueues] = useState([]);
  const [expression, setExpression] = useState("");
  const [result, setResult] = useState(0);
  const operators = ["*", ".", "-", "+", "/", "(", ")"];
  const numbersArr = new Array(10).fill().map((_, index) => index);
  const lastInputType = useRef("number");
  let newStack = [];
  let newQueues = [];
  let tempResult;
  let operator;
  let operand1;
  let operand2;
  let operatorIndex;

  const handleOperatorAdd = (newOperator) => {
    const preOpearor = queues[queues.length - 1];
    let tempQueues = queues;
    console.log("new operator " + newOperator);
    if (!preOpearor) setQueues([...queues, newOperator]);
    else {
      switch (newOperator) {
        case "-":
        case "+":
          switch (preOpearor) {
            case "(":
              setQueues([...queues, newOperator]);
              break;

            default:
              console.log("hereeeeee");

              setStack([...stack, preOpearor]);
              //const tst = [...(tempQueues.splice(0, -1))]
              //console.log("tsttttt " + JSON.stringify(tst));
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
              console.log("here");
              setQueues([...queues, newOperator]);
              break;
            default:
              setStack([...stack, preOpearor]);
              setQueues([...tempQueues.slice(0, -1), newOperator]);
              break;
          }
          break;
        case ")":
          newQueues = queues;
          newStack = stack;
          while (newQueues[newQueues.length - 1] != "(") {
            newStack = [...newStack, newQueues[newQueues.length - 1]];
            newQueues = newQueues.slice(0, -1);
            console.log("newQueues " + JSON.stringify(newQueues));
            console.log("newStack " + JSON.stringify(newStack));
          }
          newQueues = newQueues.slice(0, -1); // remove open parenthesis
          setStack(newStack);
          setQueues(newQueues);
          break;
        default:
          //open par
          setQueues([...queues, newOperator]);
          break;
      }
    }
  };

  const calcResult = (finalExpression) => {
    try {
      newStack = stack;
      newQueues = queues;

      while (newQueues.length > 0) {
        console.log("newQueues : " + JSON.stringify(newQueues));
        newStack.push(newQueues.pop());
      }
      console.log("newStack : " + JSON.stringify(newStack));
      console.log("newQueues : " + JSON.stringify(newQueues));

      while (newStack.length > 1) {
        for (let i = 0; i < newStack.length; i++) {
          if (/[+\-*/]/.test(newStack[i]) && newStack[i].length == 1) {
            operatorIndex = i;
            break;
          }
        }
        operator = newStack[operatorIndex];
        console.log("operator " + operator);
        if (newStack[operatorIndex - 2].includes("unary")) {
          newStack[operatorIndex - 2] = newStack[operatorIndex - 2].replace(
            "unary",
            ""
          );
        }
        console.log("op1 before removing " + newStack[operatorIndex - 1]);
        console.log("type " + typeof newStack[operatorIndex - 1]);
        if (newStack[operatorIndex - 1].includes("unary")) {
          newStack[operatorIndex - 1] = newStack[operatorIndex - 1].replace(
            "unary",
            ""
          );
        }
        console.log("op1 after removing " + newStack[operatorIndex - 1]);
        operand1 = Number(newStack[operatorIndex - 2]);
        operand2 = Number(newStack[operatorIndex - 1]);
        
        console.log("operand1 " + operand1);
        console.log("operand2 " + operand2);
        switch (operator) {
          case "+":
            tempResult = operand1 + operand2;
            break;
          case "-":
            tempResult = operand1 - operand2;
            break;
          case "*":
            tempResult = operand1 * operand2;
            break;
          case "/":
            tempResult = operand1 / operand2;
            break;
          default:
            throw new Error("Invalid operator");
        }
        newStack.splice(operatorIndex - 2, 3, tempResult.toString());

        console.log("newStack end " + JSON.stringify(newStack));
      }
      setResult(newStack[0]);
      setStack([newStack[0]]);
      newStack = [];
      newQueues = [];
      tempResult = null;
      operator = null;
      operand1 = null;
      operand2 = null;
      operatorIndex = null;
      console.log("result " + result);

      setQueues([]);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <ColumnContainer>
      Result is : {result} <br />
      expression: {expression} <br />
      <RowContainer>
        <GridContainr>
          {numbersArr.map((el, index) => {
            return (
              <button
                key={index}
                className={`item-${el}`}
                value={el}
                onClick={(event) => {
                  let stackCopy = stack;
                  console.log("lastInputType.current " + lastInputType.current);
                  if (lastInputType.current == "number") {
                    console.log("lastInputType.current == num if");
                    const lastElement = stackCopy.pop();
                    if (lastElement)
                      setStack([
                        ...stackCopy,
                        lastElement + event.target.value,
                      ]);
                    else setStack([event.target.value]);
                  } else {
                    console.log("lastInputType.current == opera if");
                    setStack([...stack, event.target.value]);
                  }
                  setExpression([...expression, event.target.value]);
                  lastInputType.current = "number";
                }}
              >
                {el}
              </button>
            );
          })}
          {operators.map((el, index) => {
            return (
              <button
                key={index}
                className={`item-${el}`}
                value={el}
                onClick={(event) => {
                  try {
                    handleOperatorAdd(event.target.value);
                    setExpression([...expression, event.target.value]);
                    lastInputType.current = "operator";
                  } catch (err) {
                    console.log(err);
                  }
                }}
              >
                {el}
              </button>
            );
          })}
          <button
            className={`unary-minus`}
            value="unary-"
            onClick={(event) => {
              setStack([...stack, event.target.value]);
              setExpression([...expression, "-"]);
              lastInputType.current = "number";
            }}
          >
            -/+
          </button>
          <button className={`item-=`} onClick={() => calcResult(expression)}>
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
