import React from 'react';
import { blue } from '@material-ui/core/colors';

export default function Title(title) {
    // console.log(title);
    return (
        <h1 style={{ color: blue[900] }}>{title.title}</h1>
    );
};