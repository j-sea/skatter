import React, { useState } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import './style.css'

const ModalLogOut = (props) => {
    const {
        buttonLabel,
        className
    } = props;

    const [modal, setModal] = useState(false);

    const toggle = () => setModal(!modal);

    return (
        <div>
            <Button className="external-log-out-button" onClick={toggle}>X</Button>
            <Modal isOpen={modal} toggle={toggle} className={className}>
                <ModalHeader className="modal-background" toggle={toggle}>Confirm Log Out</ModalHeader>
                <ModalBody className="modal-background">
                    Are you sure you want to log out?
        </ModalBody>
                <ModalFooter className="modal-background">
                    <Button className="confirm-log-out-button" onClick={toggle}>Yes</Button>{' '}
                    <Button className="cancel-log-out-button" onClick={toggle}>No</Button>
                </ModalFooter>
            </Modal>
        </div>
    );
}

export default ModalLogOut;