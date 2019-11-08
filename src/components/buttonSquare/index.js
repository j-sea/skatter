import React from 'react';
import './style.css';

function SquareButton(props) {
    return (
    <button type="button" className="btn btn-primary skatter-btn-sq" onClick={props.onClick}>{props.buttonTitle}</button>
    )
}

export default SquareButton;