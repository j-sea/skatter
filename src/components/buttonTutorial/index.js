import React from 'react';
import { Button } from 'reactstrap';
import './style.css'


function Tutorial(props) {
    const handleSubmit = submitEvent => {
        submitEvent.preventDefault();
        props.handleTutorial();
    };
    return (
        <div>
            <Button className="external-modal-button" onClick={handleSubmit}>Tutorial</Button>
        </div>
    )
}

export default Tutorial;
