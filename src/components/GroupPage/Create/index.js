import React, { useState } from 'react';
import Axios from 'axios';
import Header from '../../Header'
import SquareButton from '../../buttonSquare';
import Banner from '../../Banner'
import ModalAdd from '../../ModalAddPerson';
import ModalDropPin from '../../ModalDropPin';
import APIURL from '../../../utils/APIURL';
import { Link, useHistory } from "react-router-dom";
import { Button } from "reactstrap";
import '../style.css';

function CreateGroupPage(props) {
    const [groupName, setGroupName] = useState('');
    const [groupDescription, setGroupDescription] = useState('');
    const [addedPeople, setAddedPeople] = useState([]);
    const history = useHistory();

    const handleSubmit = (submitEvent) => {
        submitEvent.preventDefault();
        // in order to post data we first need to create object for data to post
        const groupData = {
            group_name: groupName,
            description: groupDescription,
            addedPeople: addedPeople,
        };

        Axios.post(APIURL("/api/group"), groupData, { withCredentials: true })
            .then(data => {
                console.log(data);
                history.push("/group-management");
            })
            .catch(error => {
                console.log(error);
            });
    };

    const addEmailPhone = (email, phone) => {
        if (email !== '') {
            setAddedPeople([
                ...addedPeople,
                {
                    type: 'email',
                    value: email,
                }
            ]);
        }
        else if (phone !== '') {
            setAddedPeople([
                ...addedPeople,
                {
                    type: 'phone',
                    value: phone,
                }
            ]);
        }
    }

    const removePerson = (person) => {
        let newPeople;
        const personIndex = addedPeople.indexOf(person);
        if (personIndex !== -1) {
            addedPeople.splice(personIndex, 1);
            newPeople = [
                ...addedPeople,
            ];
            setAddedPeople(newPeople);
        }
    }

    return (
        <div>
            <Header handleLogOut={props.handleLogOut} />

            <div className="2">
                <form>
                    <div className="form-group">
                        <label htmlFor="formGroupExampleInput2"></label>
                        <input onChange={e => setGroupName(e.target.value)} name="groupName" type="text" className="form-test2" id="" placeholder="Group name" data-length="20" />
                        <br></br>
                        <br></br>
                        <div className="form-group">
                            <label htmlFor="exampleFormControlTextarea1"></label>
                            <textarea onChange={e => setGroupDescription(e.target.value)} className="form-test2" id="" rows="3" name="groupDescription" placeholder="Description"></textarea>
                        </div>
                        <input type="submit" style={{ position: 'absolute', left: -1000, top: -1000, visibility: 'hidden' }} />
                    </div>
                </form>
            </div>
            <br></br>

            <Banner bannerTitle="Members" />
            <div className="add-person-container">
                {
                    addedPeople.map(person => (
                        <Button key={person.value} className="add-person-button" onClick={e => removePerson(person)}>{person.value} ✖</Button>
                    ))
                }
                {/* This button when clicked should prompt add person modal. When person added, new icon on group page should populate. */}
                <ModalAdd addEmailPhone = {addEmailPhone} />
            </div>

            <br />

            <div className="bottom-container-test">
                <div className="bottom-btn-container1">
                    {/* This button should take you back to the group management page */}
                    <Link to='group-management'>
                        <SquareButton buttonTitle="Cancel" />
                    </Link>
                </div>

                <div className="bottom-btn-container2">
                    {/* This button creates the group and populates a new button/icon on the group management page */}
                    <SquareButton type="submit" buttonTitle="Create My Group" onClick={handleSubmit} />
                </div>
            </div>
        </div>
    );
}

export default CreateGroupPage;
