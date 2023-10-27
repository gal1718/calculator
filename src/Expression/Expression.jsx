import * as React from "react";
import { styled } from "@mui/material/styles";

const Div = styled("div")(({ theme }) => ({
  ...theme.typography.button,
  padding: theme.spacing(1),
}));

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
}) => {
  //console.log("expressionm " + JSON.stringify(expression));
  const handleKeyDown = (e) => {
    console.log("e.key is" + e.key);
    if (e.key === "Enter") {
      handleEqualClick();
      console.log("enter");
    } else if (/[\d]/.test(e.key)) {
      // Handle numeric keys 
      handleNumberClick(e.key);
      handleExpression(e.key);
    } else if (/[+\-*/]/.test(e.key)) {
      // Handle operators and parentheses
      //onOperatorClick(e.key);
      handleOperatorClick(e.key);
      handleExpression(e.key);
    } else if (e.key === "(") {
      handleOpenPar();
    } else if (e.key === ")") {
      handleClosePar();
    } else if (e.key === ".") {
      handleDotClick();
    } else if (
      e.key === "Delete" ||
      e.code === "Delete" ||
      e.key == "Backspace"
    ) {
      console.log("deleter called");
      handleDELClick();
    }
  };

  const handleExpression = (char) => {
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
          handleKeyDown(event);
        }}
      ></input>
    </div>
  );
};

export default Expression;
