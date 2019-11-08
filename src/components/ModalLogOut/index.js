import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import APIURL from '../../utils/APIURL';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import './style.css'

const ModalLogOut = (props) => {
    const [modal, setModal] = useState(false);

    // function name() { }
    // const name = () => { }
    // const name = function () { }

    const {
        buttonLabel,
        className
    } = props;

    const toggle = () => {
        setModal(!modal);
    }


    // const logoutConfirm = () => {
    //     //made const variable that allows to switch from localhost to heroku
    //     const viewExistingGroupsUrl = APIURL(`/auth/logout`);
    //     Axios.post(
    //         //withCredentials specifies to axios to send cookies along with request since request is not coming from browser
    //         viewExistingGroupsUrl, { withCredentials: true })
    //         .then(res => {
    //           toggle ()
    //         })
    // }

    return (
        <div>
            <Button className="external-log-out-button" onClick={toggle}>Logout</Button>
            <Modal isOpen={modal} toggle={toggle} className={className}>
                <ModalHeader className="modal-background" toggle={toggle}>Confirm Logout</ModalHeader>
                <ModalBody className="modal-background">
                    Are you sure you want to log out?
        </ModalBody>
                <ModalFooter className="modal-background">
                    <Button className="confirm-log-out-button" onClick={props.handleLogOut}>Yes</Button>
                    <Button className="cancel-log-out-button" onClick={toggle}>No</Button>
                </ModalFooter>
            </Modal>
        </div>
    );
}

export default ModalLogOut;