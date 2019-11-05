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
      <Button className="test" onClick={toggle}>{buttonLabel}X</Button>
      <Modal isOpen={modal} toggle={toggle} className={className}>
        <ModalHeader className="modal-background" toggle={toggle}>Confirm Delete</ModalHeader>
        <ModalBody className="modal-background">
            Are you sure you want to delete this?
        </ModalBody>
        <ModalFooter className="modal-background">
          <Button className="internal-modal-button" onClick={toggle}>Yes</Button>{' '}
          <Button className="delete-button" onClick={toggle}>No</Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}

export default ModalDelete;