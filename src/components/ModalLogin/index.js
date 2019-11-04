/* eslint react/no-multi-comp: 0, react/prop-types: 0 */

import React, { useState } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Form, Input, Label } from 'reactstrap';
import './style.css'

// class ModalLogin extends React.Component {
// 	state = {
// 		email: '',
// 		phone: '',
// 		password: '',
// 	};

// 	handleSubmit = submitEvent => {
// 		submitEvent.preventDefault();
// 		this.props.handleLogIn(this.state.email, this.state.phone, this.state.password);
// 	};

// 	handleFormChange = changeEvent => {
// 		const {name, value} = changeEvent.target;

// 		this.setState({
// 			[name]: value,
// 		})
//     };


const ModalLogin = (props) => {
  const {
    buttonLabel,
    className
  } = props;

  const [modal, setModal] = useState(false);

  const toggle = () => setModal(!modal);

  return (
    <div>
      <Button className="external-modal-button" onClick={toggle}>{buttonLabel}Login</Button>
      <Modal isOpen={modal} toggle={toggle} className={className}>
        <ModalHeader className="modal-background" toggle={toggle}>Login</ModalHeader>
        <ModalBody className="modal-background">
          <Form>
          <div className="form-group">
          <Label for="formGroupExampleInput2"></Label>
          {/* <Input type="email" className="form-control form-border" id="formGroupExampleInput2" placeholder="Email (ex: username@example.com)" onChange={this.handleFormChange}/> */}

          <Input type="email" className="form-control form-border" id="formGroupExampleInput2" placeholder="Email (ex: username@example.com)"/>
          
          Or
          <Label for="formGroupExampleInput2"></Label>
          {/* <Input type="phone" className="form-control form-border" id="formGroupExampleInput2" placeholder="Phone # [sms] (ex: *** ###-####)" onChange={this.handleFormChange}/> */}

          <Input type="phone" className="form-control form-border" id="formGroupExampleInput2" placeholder="Phone # [sms] (ex: *** ###-####)"/>

         
          <Label for="formGroupExampleInput2"></Label>
          {/* <Input type="password" className="form-control form-border" id="formGroupExampleInput2" placeholder="Password" onChange={this.handleFormChange}/> */}

          <Input type="password" className="form-control form-border" id="formGroupExampleInput2" placeholder="Password"/>
            
            
            </div>
        </Form>
        </ModalBody>
        <ModalFooter className="modal-background">
          <Button className="internal-modal-button" onClick={toggle}>Submit</Button>{' '}
          <Button className="internal-modal-button" onClick={toggle}>Cancel</Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}

// }

export default ModalLogin;