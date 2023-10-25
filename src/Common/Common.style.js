import { styled } from "@mui/material";

const ColumnContainer = styled("div")({
  display: "flex",
  alignItems: "center",
  flexDirection: "column",
  margin: "10px",
  marginRight: "25%",
  marginLeft: "25%",
});

const RowContainer = styled("div")({
  display: "flex",
  flexDirection: "flex-reverse",
  alignItems: "end",
  flexWrap: "wrap",
  gap: "1em",
  marginRight: "25%",
  marginLeft: "25%",
});

const GridContainr = styled("div")({
        display: "grid",
        gridTemplateColumns:  "repeat(4, 100px)",
        gridTemplateRows:  "repeat(5, 100px)",
        gap: "5px",
        gridAutoRows: "100px",

   
})

export { ColumnContainer, RowContainer, GridContainr };
