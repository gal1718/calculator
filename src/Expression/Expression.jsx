import * as React from 'react';
import { styled } from '@mui/material/styles';

const Div = styled('div')(({ theme }) => ({
  ...theme.typography.button,
  backgroundColor: theme.palette.background.paper,
  padding: theme.spacing(1),
}));



const Expression = ({expression}) => {

    return (
        <div className="Expression">
            <Div>expression: {expression}</Div>
        </div>
    );
}

export default Expression;