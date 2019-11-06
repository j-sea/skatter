import React, { useState } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import './style.css'

const ModalDelete = (props) => {
  const {
    buttonLabel,
    className
  } = props;

  const [modal, setModal] = useState(false);

  const toggle = () => setModal(!modal);

  return (
    <div>
      <Button className="external-delete-button" onClick={toggle}>X</Button>
      <Modal isOpen={modal} toggle={toggle} className={className}>
        <ModalHeader className="modal-background" toggle={toggle}>Confirm Delete</ModalHeader>
        <ModalBody className="modal-background">
            Are you sure you want to delete this?
        </ModalBody>
        <ModalFooter className="modal-background">
          <Button className="confirm-delete-button" onClick={toggle}>Yes</Button>{' '}
          <Button className="cancel-delete-button" onClick={toggle}>No</Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}

export default ModalDelete;