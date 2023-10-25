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
}) => {
  console.log("expressionm " + JSON.stringify(expression))
  const handleKeyDown = (e) => {
    console.log("e.key is" + e.key);
    if (e.key === "Enter") {
      //   setIsEditing(false);
      console.log("enter");
    } else if (/[\d.]/.test(e.key)) {
      // Handle numeric keys and the decimal point
      //onNumberClick(e.key);
      handleNumberClick(e.key);
    } else if (/[+\-*/()]/.test(e.key)) {
      // Handle operators and parentheses
      //onOperatorClick(e.key);
      handleOperatorClick(e.key);
    }
  };

  const handleInputChange = (event) => {
    //const newExpression = event.target.value;
    //console.log("handleInputChange " + event.target.value[event.target.value.length -1 ]);
    const newExpressionChar = event.target.value[event.target.value.length - 1];
    setExpression([...expression, newExpressionChar]);
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
        onChange={handleInputChange}
        onKeyDown={(event) => {
          handleKeyDown(event);
        }}
      ></input>
    </div>
  );
};

export default Expression;
