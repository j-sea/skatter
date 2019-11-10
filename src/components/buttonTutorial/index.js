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
                    Lorem ipsum dolor amet forage etsy vexillologist kale chips tofu. Chicharrones stumptown tote bag live-edge mlkshk tattooed, knausgaard hella distillery. Normcore af hexagon pickled man bun schlitz squid narwhal yr helvetica chambray lyft. Quinoa microdosing gluten-free copper mug.

                    Meditation butcher selfies sriracha pok pok green juice man braid vegan yr tilde whatever banh mi. Echo park health goth godard gastropub 90's DIY occupy. Thundercats copper mug green juice man braid hashtag vexillologist. Kombucha schlitz VHS, asymmetrical skateboard dreamcatcher migas chillwave offal kitsch small batch four loko. Meggings cliche normcore, seitan actually coloring book tousled distillery. Pop-up vegan XOXO man bun vape palo santo meditation single-origin coffee mustache selfies wayfarers iceland cliche.
            </ModalBody>
                <ModalFooter className="modal-background">
                    <Button className="skip-button" onClick={toggle}>Close</Button>{' '}
                </ModalFooter>
            </Modal>
        </div >
    )
}
// }

export default Tutorial;
