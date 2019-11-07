import React, { useState } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Form, Input, Label } from 'reactstrap';
import './style.css'

function ModalSignUp(props) {
    const {
        buttonLabel,
        className
    } = props;

    const [modal, setModal] = useState(false);
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');

    const toggle = () => setModal(!modal);

    const handleSubmit = submitEvent => {
        submitEvent.preventDefault();
        props.handleLogIn(email, phone, password);
    };

    return (
        <div>
            <Button className="external-modal-button" onClick={toggle}>{buttonLabel}Create an account</Button>
            <Modal isOpen={modal} toggle={toggle} className={className}>
                <ModalHeader className="modal-background" toggle={toggle}>Create an account</ModalHeader>
                <ModalBody id="SignUpForm" className="modal-background">
                    <Form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <Label htmlFor="formGroupExampleInput2"></Label>
                            <Input type="email" className="form-control form-border" id="formGroupExampleInput2" placeholder="Email (ex: username@example.com)" onChange={e => setEmail(e.target.value)} />
                            Or
              <Label htmlFor="formGroupExampleInput2"></Label>
                            <Input type="phone" className="form-control form-border" id="formGroupExampleInput2" placeholder="Phone # [sms] (ex: ### ###-####)" onChange={e => setPhone(e.target.value)} />

                            <Label htmlFor="formGroupExampleInput2"></Label>
                            <Input type="password" className="form-control form-border" id="formGroupExampleInput2" placeholder="Password" onChange={e => setPassword(e.target.value)} />

                            <Input type="submit" style={{ position: 'absolute', left: -1000, top: -1000, visibility: 'hidden' }} />
                        </div>
                    </Form>
                </ModalBody>
                <ModalFooter className="modal-background">
                    <Button className="internal-modal-button" onClick={handleSubmit}>Submit</Button>{' '}
                    <Button className="internal-modal-button" onClick={toggle}>Cancel</Button>
                </ModalFooter>
            </Modal>
        </div>
    );
}

export default ModalSignUp;
