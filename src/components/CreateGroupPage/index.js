import React from 'react';
import './style.css';
import {Link} from "react-router-dom";
import Header from '../Header'
import Footer from '../Footer'
import SquareButton from '../SquareButton';
import Banner from '../Banner'
import ModalAdd from '../ModalAddPerson';
import ModalDropPin from '../ModalDropPin';
import Axios from 'axios';
import APIURL from '../../utils/APIURL';

class CreateGroupPage extends React.Component {
    state = {
        groupName: "",
        groupDescription: ""
    }

    handleSubmit = submitEvent => {
        // in order to post data we first need to create object for data to post

        const groupData = {
            group_name: this.state.groupName,
            description: this.state.description
        }

        Axios.post(APIURL("/api/group"), groupData, { withCredentials: true }).then(data => console.log(data)).catch(error => console.log(error))
    };

    handleInputChange = event => {
        console.log(event.target.name)
        console.log(event.target.value)
        const value = event.target.value
        const name = event.target.name
        this.setState(
            {
                [name]: value
            }
        )
    }



    render() {
        return (
            <div>
                <Header />
                <br />
                <br />

                <div className="add-person-container">
                    {/* This button when clicked should prompt add person modal. When person added, new icon on group page should populate. */}
                    <ModalAdd />
                </div>

                <br />

                <div className="content-box-style2">
                    <p className="description-title">Group Description :</p>
                    <form>
                        <div className="form-group">
                            <label htmlFor="formGroupExampleInput2"></label>
                            <input onChange={this.handleInputChange} name="groupName" type="text" className="form-test2" id="" placeholder="Group name" data-length="20" />

                            <div class="form-group">
                                <label for="exampleFormControlTextarea1"></label>
                                <textarea onChange={this.handleInputChange} class="form-test2" id="" rows="3" name="groupDescription" placeholder="Description"></textarea>
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
                    <SquareButton buttonTitle="Back to Groups" />
                </Link>
                    </div>

                    <div className="bottom-btn-container2">
                        {/* This button should create the group and populate a new button/icon on the group management page */}
                        <SquareButton type="submit" buttonTitle="DONE" onClick={this.handleSubmit} />
                    </div>
                </div>

                <form onSubmit={this.handleSubmit}>
                    <button type="submit">Log Out</button>
                </form>
                <Footer />
            </div>
        );
    }
}

export default CreateGroupPage;