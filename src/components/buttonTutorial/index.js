import React, { useState } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import './style.css'


// function Tutorial(props) {
//     const handleSubmit = submitEvent => {
//         submitEvent.preventDefault();
//         // props.handleTutorial();
//     };

const Tutorial = (props) => {
    const {
        // buttonLabel,
        className
    } = props;


    const [modal, setModal] = useState(false);

    const toggle = () => setModal(!modal);

    return (
        <div>
            <Button className="external-modal-button" onClick={toggle}>Tutorial</Button>
            <Modal isOpen={modal} toggle={toggle} className={className} >
                <ModalHeader className="modal-background" toggle={toggle}>ScATTeR Tutorial</ModalHeader>
                <ModalBody className="modal-background">
                    <h5> <strong>Using ScATTeR</strong></h5>
                       <br/>

                        <h6><em><b>Create an account/Login</b></em></h6>
                        <p>When you click the <em><b>Create an account</b></em> button, you’ll be prompted to create a ScATTeR account. This will allow you to log back in at any time without losing any groups you’ve created.
                        <br/>
                        <em><b>Login</b></em> allows you to simply use the account you’ve created for repeated use.</p>

                        <br/>

                        <h6><em><b>Quick Start</b></em></h6>
                        <p>If you’re in a hurry and want to throw a group together, go ahead and use the <em><b>Quick Start button</b></em>. Using this option just click and in you go. You’ll be reminded to bookmark the page, so you don’t lose your unique login.
                        <br/>
                        While this is a nice feature, remember, once you’ve left the group or maybe forget to bookmark the page, you can’t get back. Thankfully, creating an account doesn’t take that long.</p>

                        <br/>

                        <h6><em><b>Bonus</b></em></h6>
                        <p>One great thing about ScATTeR is the people you invite don’t need a login. They get sent their own unique login.</p>
                        
                        <br/>
                        
                        <h6><em><b>Creating a Group</b></em></h6>
                        Once you’re in, click the <em><b>Create Group button</b></em>. You’ll be redirected to a new page where you can enter the Group name and description. Below you’ll see the button to add members to your group. You can do this via email or phone number. Once you’ve added all your members, hit <em><b>Create My Group</b></em>.
                        You now have your group made! Feel free to edit it and add points of interest for your group or click into your group. From there you can activate the map and you and your friends can locate each other.
     
                   
                </ModalBody>
                <ModalFooter className="modal-background">
                    <Button className="close-button" onClick={toggle}>Close</Button>{' '}
                </ModalFooter>
            </Modal>
        </div >
    )
}


export default Tutorial;
