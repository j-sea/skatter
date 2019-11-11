import React, { useState } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Form, Input, Label } from 'reactstrap';
import './style.css'

const ModalAdd = (props) => {
  const {
    buttonLabel,
    className
  } = props;

  const [modal, setModal] = useState(false);
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  const toggle = () => setModal(!modal);

  const handleSubmit = submitEvent => {
    submitEvent.preventDefault();
    // This will be calling the function to add a person
    props.addEmailPhone(email, phone);
    setEmail('');
    setPhone('');
    toggle();
  };

  return (
    <div>
      <Button className="add-person-button" onClick={toggle}>+</Button>
      <Modal isOpen={modal} toggle={toggle} className={className}>
        <ModalHeader className="modal-background" toggle={toggle}>Add Person</ModalHeader>
        <ModalBody className="modal-background">
            
        <Form onSubmit={handleSubmit}>
            <div className="form-group">
              <Label htmlFor="formGroupExampleInput2"></Label>
              <Input type="email" className="form-control form-border" id="formGroupExampleInput2" placeholder="Email (ex: username@example.com)" onChange={e => setEmail(e.target.value)}/>
              Or
              <Label htmlFor="formGroupExampleInput2"></Label>
              <Input type="phone" className="form-control form-border" id="formGroupExampleInput2" placeholder="Phone # [sms] (ex: ### ###-####)" onChange={e => setPhone(e.target.value)}/>

              <Input type="submit" style={{position: 'absolute', left: -1000, top: -1000, visibility: 'hidden'}}/>
            </div>
          </Form>

        </ModalBody>
        <ModalFooter className="modal-background">
          <Button className="confirm-delete-button" onClick={handleSubmit}>Add</Button>{' '}
        </ModalFooter>
      </Modal>
    </div>
  );
}

export default ModalAdd;