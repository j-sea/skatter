import React from 'react';
import './style.css';
import { Link } from "react-router-dom";
import Header from '../Header'
import Footer from '../Footer'
import SquareButton from '../buttonSquare';
import Banner from '../Banner'
import ModalAdd from '../ModalAddPerson';
import ModalDropPin from '../ModalDropPin';
import Axios from 'axios';
import APIURL from '../../utils/APIURL';

class ViewGroupPage extends React.Component {
    state = {
        //set initial state of page
        groupName: "",
        groupDescription: "",
        alarms: "",
        members: "",
        pointsOfInterest: ""
    }

    //on page load...
    componentDidMount() {
    
        //create const variable that allows to switch from localhost to heroku
        const viewGroupToEditUrl = APIURL(`/api/group/${this.props.match.params.uuid}`);
        //axios call to DB to get specific group (passes session through cookie)
        Axios.get(
            viewGroupToEditUrl, { withCredentials: true })
            .then(res => {
                return res.data
            })
            //convert to json and set state
            .then(json => this.setState({ groupToEdit: json }));
    }
    //TODO: how to set each item individually? Or will it auto pop form with object?

    // TODO: how to display existing group in editable format?

    handleEditSubmit = (group_uuid) => {
        const newData = {
            //grab new info from form 
            group_name: this.state.groupName,
            groupDescription: this.state.description,
            alarms: this.state.alarms,
            members: this.state.members,
            pointsOfInterest: this.state.pointsOfInterest
        }
        //update info for specific group - passing in uuid, new info, & session
        Axios.post(APIURL(`/api/user/${group_uuid}`), newData, { withCredentials: true }).then(data => console.log(data)).catch(error => console.log(error))
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
                </div>

                <br />

                <div className="content-box-style2">
                    <p className="description-title">Group Description :</p>
                    <form>
                        <div className="form-group">
                            <label htmlFor="formGroupExampleInput2"></label>
                            <input onChange={this.handleInputChange} name="groupName" type="text" className="form-test2" id="" placeholder="Group name" data-length="20" />

                            <div className="form-group">
                                <label htmlFor="exampleFormControlTextarea1"></label>
                                <textarea onChange={this.handleInputChange} className="form-test2" id="" rows="3" name="groupDescription" placeholder="Description"></textarea>
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
                        <SquareButton type="submit" buttonTitle="Create My Group" onClick={this.handleEditSubmit} />
                    </div>
                </div>
                <Footer />
            </div>
        );
    }
}

export default ViewGroupPage;
