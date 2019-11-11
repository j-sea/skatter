import React, { useState } from 'react';
import Axios from 'axios';
import Header from '../../Header'
import SquareButton from '../../buttonSquare';
import Banner from '../../Banner'
import ModalAdd from '../../ModalAddPerson';
import ModalDropPin from '../../ModalDropPin';
import APIURL from '../../../utils/APIURL';
import { Link, useHistory } from "react-router-dom";
import '../style.css';

function CreateGroupPage(props) {
    const [groupName, setGroupName] = useState('');
    const [groupDescription, setGroupDescription] = useState('');
    const history = useHistory();
    const [addedPeople, setAddedPeople] = useState([])

    const handleSubmit = (submitEvent) => {
        submitEvent.preventDefault();
        // in order to post data we first need to create object for data to post
        const groupData = {
            group_name: groupName,
            description: groupDescription
        }

        Axios.post(APIURL("/api/group"), groupData, { withCredentials: true })
            .then(data => {
                console.log(data)
                history.push("/group-management")
            })
            .catch(error => {
                console.log(error)
            })
    };
    //when function called
    const addEmailPhone = (email, phone) => {
        //make new array with same info as addedPeople
        setAddedPeople([...addedPeople, {
            //check to see if type is phone or email
            type: phone ? 'phone' : 'email',
            //assign phone value if avail, otherwise assign value to email
            value: phone ? phone : email
        }])
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
                {/* This button when clicked should prompt add person modal. When person added, new icon on group page should populate. */}
                <ModalAdd addEmailPhone={addEmailPhone} />
            </div>
            <br></br>
            <Banner bannerTitle="Points of Interest" />

            {/* This button when clicked should prompt drop pin modal. When pin added, new icon on group page should populate. */}
            <div className="pin-container">
                <ModalDropPin />

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
