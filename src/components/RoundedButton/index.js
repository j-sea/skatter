import React from 'react';
import './style.css';

function RoundedButton(props) {
    return (
    <button type="button" className="btn btn-primary skatter-btn-rnd" onClick={props.onClick}>{props.buttonTitle}</button>
    )
}

export default RoundedButton;