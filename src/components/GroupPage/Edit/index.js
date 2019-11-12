import React from 'react';
import Axios from 'axios';
import Header from '../../Header'
import SquareButton from '../../buttonSquare';
import Banner from '../../Banner'
import ModalAdd from '../../ModalAddPerson';
import ModalDropPin from '../../ModalDropPin'
import APIURL from '../../../utils/APIURL';
import { Link, withRouter } from "react-router-dom";
import '../style.css';
import { Button } from "reactstrap";

class EditGroupPage extends React.Component {
    state = {
        //set initial state of page
        group_name: "",
        description: "",
        addedPeople: [],
        removedPeople: [],

        // alarms: "",
        // members: "",
        // pointsOfInterest: ""
        //TODO:uncomment once Groups schema updated
    };

    startingPeople = [];

    //on page load...
    componentDidMount() {
        //pulling specific group uuid from params (possible bc server route reconfig'd to allow optional uuid)
        const group_uuid = this.props.match.params.uuid;

        // // grab all of the existing group invites related to this group
        // Axios.get(APIURL(`/api/group/${group_uuid}/invites`), { withCredentials: true })
        // .then();

        //create const variable that allows to switch from localhost to heroku
        const viewGroupToEditUrl = APIURL(`/api/group/${group_uuid}`);
        //axios call to DB to get specific group (passes session through cookie)
        Axios.get(
            viewGroupToEditUrl, { withCredentials: true })
            .then(res => {
                return res.data
            })
            //convert to json and set state with spread operator
            .then(json => this.setState({ ...json }));
    }

    handleEditSubmit = () => {
        const group_uuid = this.props.match.params.uuid;
        const newData = {
            //grab new info from form 
            group_name: this.state.group_name,
            description: this.state.description,
            // alarms: this.state.alarms,
            // members: this.state.members,
            // pointsOfInterest: this.state.pointsOfInterest
            //TODO:uncomment once Groups schema updated

        }
        //update info for specific group - passing in uuid, new info, & session
        Axios.put(APIURL(`/api/group/${group_uuid}`), newData, { withCredentials: true }).then(data => {
            console.log(data);
            this.props.history.push('/group-management');
        }).catch(error => console.log(error))
    };

    handleInputChange = event => {
        // console.log(event.target.name)
        // console.log(event.target.value)
        const value = event.target.value
        const name = event.target.name
        this.setState(
            {
                [name]: value
            }
        )
    }

    addEmailPhone = (email, phone) => {
        if (email !== '') {
            this.setState({
                addedPeople: [
                    ...this.state.addedPeople,
                    {
                        type: 'email',
                        value: email,
                    }
                ]
            });
        }
        else if (phone !== '') {
            this.setState({
                addedPeople: [
                    ...this.state.addedPeople,
                    {
                        type: 'phone',
                        value: phone,
                    }
                ]
            });
        }
    }

    removePerson = (person) => {
        let newPeople;
        const personIndex = this.state.addedPeople.indexOf(person);
        if (personIndex !== -1) {
            newPeople = [
                ...this.state.addedPeople,
            ];
            newPeople.splice(personIndex, 1);
            this.setState(newPeople);
        }
    }

    render() {
        return (
            <div>
                <br />
                <br />

                <div className="add-person-container">
                </div>

                <br />

                <div className="content-box-style2">
                    {/* <p className="description-title">Group Description :</p> */}
                    <form>
                        <div className="form-group">
                            <label htmlFor="formGroupExampleInput2"></label>
                            <input onChange={this.handleInputChange} name="group_name" type="text" className="form-test2" id="" value={this.state.group_name} placeholder="Group name" data-length="20" />
                            <br></br>
                            <br></br>
                            <div className="form-group">
                                <label htmlFor="exampleFormControlTextarea1"></label>
                                <textarea onChange={this.handleInputChange} className="form-test2" id="" rows="3" value={this.state.description} name="description" placeholder="Group Description"></textarea>
                            </div>

                            <input type="submit" style={{ position: 'absolute', left: -1000, top: -1000, visibility: 'hidden' }} />
                        </div>
                    </form>
                </div>

                <Banner bannerTitle="Members" />

                <div className="add-person-container">
                    {
                        this.state.addedPeople.map(person => (
                            <Button key={person.name} className="add-person-button">{person.name}
                            </Button>
                        ))
                    }
                    {/* This button when clicked should prompt add person modal. When person added, new icon on group page should populate. */}
                    <ModalAdd addEmailPhone={this.addEmailPhone} />
                </div>
                <br></br>
                <Banner bannerTitle="Points of Interest" />

                {/* This button when clicked should prompt drop pin modal. When pin added, new icon on group page should populate. */}
                <div className="pin-container">
                    <ModalDropPin />

                </div>


                <div className="bottom-container-test">
                    <div className="bottom-btn-container1">
                        {/* This button should take you back to the group management page */}
                        <Link to='/group-management'>
                            <SquareButton buttonTitle="Cancel" />
                        </Link>
                    </div>

                    <div className="bottom-btn-container2">

                        <SquareButton type="submit" buttonTitle="Update" onClick={this.handleEditSubmit} />

                    </div>
                </div>
            </div>
        );
    }
}

export default withRouter(EditGroupPage);
