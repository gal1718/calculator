import * as React from "react";
import { styled } from "@mui/material/styles";

const Div = styled("div")(({ theme }) => ({
  ...theme.typography.button,
  padding: theme.spacing(1),
}));

type Props = {
  expression: string[],
  handleNumberClick: (operand: string)=> void,
  handleOperatorClick: (operator: string)=> void,
  setExpression:(char: string[]) => void,
  handleOpenPar: () => void,
  handleClosePar: () => void,
  handleDotClick: () => void,
  handleDELClick: () => void,
  handleEqualClick: () => void,
  
}

const buttons = {}

const Expression = ({
  expression,
  handleNumberClick,
  handleOperatorClick,
  setExpression,
  handleOpenPar,
  handleClosePar,
  handleDotClick,
  handleDELClick,
  handleEqualClick,
}: Props) => {
  //console.log("expressionm " + JSON.stringify(expression));
  const handleKeyDown = (key: string,code: string) =>{
  if (key === "Enter") {
    handleEqualClick();
    console.log("enter");
  
    } else if (/[\d]/.test(key)) {
      // Handle numeric keys 
      handleNumberClick(key);
      handleExpression(key);
    } else if (/[+\-*/]/.test(key)) {
      // Handle operators and parentheses
      //onOperatorClick(e.key);
      handleOperatorClick(key);
      handleExpression(key);
    } else if (key === "(") {
      handleOpenPar();
    } else if (key === ")") {
      handleClosePar();
    } else if (key === ".") {
      handleDotClick();
    } else if (
      key === "Delete" ||
      code === "Delete" ||
      key == "Backspace"
    ) {
      console.log("deleter called");
      handleDELClick();
    }
  };

  const handleExpression = (char: string) => {
    console.log("handleExpression " + char);

    setExpression([...expression, char]);
  };

  return (
    <div className="Expression">
      <input
        style={{
          fontSize: "large",
          outline: "none",
          border: "none",
          background: "none",
        }}
        value={expression?.join("")}
        onKeyDown={(event) => {
          handleKeyDown(event.key, event.code);
        }}
      ></input>
    </div>
  );
};

export default Expression;
