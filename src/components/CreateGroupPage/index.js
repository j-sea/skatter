import React, { useState } from 'react';
import './style.css';
import { Link, useHistory } from "react-router-dom";
import Header from '../Header'
import Footer from '../Footer'
import SquareButton from '../buttonSquare';
import Banner from '../Banner'
import ModalAdd from '../ModalAddPerson';
import ModalDropPin from '../ModalDropPin';
import Axios from 'axios';
import APIURL from '../../utils/APIURL';

function CreateGroupPage (props) {
    const [groupName, setGroupName] = useState('');
    const [groupDescription, setGroupDescription] = useState('');
    const history = useHistory();

    const handleSubmit = submitEvent => {

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

    return (
        <div>
            <Header handleLogOut={props.handleLogOut} />

            <div className="content-box-style2">
                <p className="description-title">Group Description :</p>
                <form>
                    <div className="form-group">
                        <label htmlFor="formGroupExampleInput2"></label>
                        <input onChange={e => setGroupName(e.target.value)} name="groupName" type="text" className="form-test2" id="" placeholder="Group name" data-length="20" />

                        <div className="form-group">
                            <label htmlFor="exampleFormControlTextarea1"></label>
                            <textarea onChange={e => setGroupDescription(e.target.value)} className="form-test2" id="" rows="3" name="groupDescription" placeholder="Description"></textarea>
                        </div>
                        <div className="add-person-container">
                            {/* This button when clicked should prompt add person modal. When person added, new icon on group page should populate. */}
                            <ModalAdd />
                        </div>
                        <input type="submit" style={{ position: 'absolute', left: -1000, top: -1000, visibility: 'hidden' }} />
                    </div>
                </form>
            </div>

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
            <Footer />
        </div>
    );
}

export default CreateGroupPage;
