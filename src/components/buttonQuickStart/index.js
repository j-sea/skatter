import React from 'react';
import { Button } from 'reactstrap';
import './style.css'


function Quickstart(props) {
    const handleSubmit = submitEvent => {
        submitEvent.preventDefault();
        props.handleQuickstartSignUp();
    };
    return (
        <div>
            <Button className="external-modal-button" onClick={handleSubmit}>Quick Start</Button>
        </div>
    )
}

export default Quickstart;
