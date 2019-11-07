import React, { useState } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Form, Input, Label, FormGroup } from 'reactstrap';
import './style.css'

const ModalDropPin = (props) => {
    const {
        buttonLabel,
        className
    } = props;

    const [modal, setModal] = useState(false);
    const [nestedModal, setNestedModal] = useState(false);
    const [closeAll, setCloseAll] = useState(false);

    const toggle = () => setModal(!modal);
    const toggleNested = () => {
        setNestedModal(!nestedModal);
        setCloseAll(false);
    }
    const toggleAll = () => {
        setNestedModal(!nestedModal);
        setCloseAll(true);
    }

    const handleSubmit = submitEvent => {
        submitEvent.preventDefault();
        // This will be calling the function to add a point of interest
    };

    return (
        <div>
            <Button className="pin-external-button" onClick={toggle}>{buttonLabel}+</Button>
            <Modal isOpen={modal} toggle={toggle} className={className}>
                <ModalHeader className="modal-background-pin" toggle={toggle}>Share a New Point of Interest!</ModalHeader>
                <ModalBody className="modal-background-pin">
                    <Form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <Label htmlFor="formGroupExampleInput2"></Label>
                            <Input type="text" className="form-control form-border" id="formGroupExampleInput2" placeholder="Label" />
                            <Label for="exampleText"></Label>
                            <Input type="textarea" name="text" id="exampleText" placeholder="Description" data-length="50" />

                            <Input type="submit" style={{ position: 'absolute', left: -1000, top: -1000, visibility: 'hidden' }} />
                        </div>
                    </Form>
                    <br />

                    {/* Start of Nested modal */}
                    <Button className="pin-external-button" onClick={toggleNested}>Add Alarm</Button>
                    <Modal isOpen={nestedModal} toggle={toggleNested} onClosed={closeAll ? toggle : undefined}>
                        <ModalHeader className="modal-background-pin">Set Alarm</ModalHeader>
                        <ModalBody className="modal-background-pin">
                            <Form onSubmit={handleSubmit}>
                                <div className="form-group">
                                    <Label htmlFor="formGroupExampleInput2">Time</Label>

                                    <Input className="form-control form-border" id="formGroupExampleInput2" placeholder="" type="time" id="" name="" min="09:00" max="18:00" />
                                    <br />
                                    <Input type="text" className="form-control form-border" id="formGroupExampleInput2" placeholder="Location" />

                                    <Input type="submit" style={{ position: 'absolute', left: -1000, top: -1000, visibility: 'hidden' }} />
                                </div>
                            </Form>
                        </ModalBody>
                        <ModalFooter className="modal-background-pin">
                            <Button type="submit" className="pin-external-button" onClick={toggleNested}>Done</Button>
                        </ModalFooter>
                    </Modal>
                    {/* End of Nested modal */}
                </ModalBody>

                {/* this is the footer for the primary modal */}
                <ModalFooter className="modal-background-pin">
                    <Button type="submit" className="pin-external-button" onClick={toggle}>Pin</Button>
                </ModalFooter>
            </Modal>
        </div>
    );
}

export default ModalDropPin;
