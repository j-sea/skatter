import React from 'react';
import Axios from 'axios';
import { Button } from "reactstrap";
import { Link, withRouter } from "react-router-dom";
import Header from '../../Header'
import SquareButton from '../../buttonSquare';
import Banner from '../../Banner'
// import ModalAdd from '../../ModalAddPerson';
// import ModalDropPin from '../../ModalDropPin';
import APIURL from '../../../utils/APIURL';
import '../style.css';

class ViewGroupPage extends React.Component {
    state = {
        //set initial state of page
        group_name: '',
        description: '',
        existingPeople: [],
        // alarms: "",
        // members: "",
        // pointsOfInterest: ""
        //TODO:uncomment once Groups schema updated
    }

    //on page load...
    componentDidMount() {
        console.log(this.props);
        //create const variable that allows to switch from localhost to heroku
        const viewSpecificGroupUrl = APIURL(`/api/group/${this.props.match.params.uuid}`);
        //axios call to DB to get specific group (passes session through cookie)
        Axios.get(viewSpecificGroupUrl, { withCredentials: true })
            .then(res => {
                return res.data
            })
            //convert to json and set state with spread operator
            .then(json => this.setState({ ...json }))
            //on error, go back to group-management page
            .catch(error => {
                this.props.history.push('/group-management');
            });
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
                    <h5 className="ind-group-title">Group name:</h5>
                    <h3>{this.state.group_name}</h3>
                    <br />
                    <h5 className="ind-group-title">Description:</h5>
                    <h3>{this.state.description}</h3>
                </div>

                <Banner bannerTitle="Members" />
                <div className="add-person-container">
                    {
                        this.state.existingPeople.map((person, index) => (
                            <Button key={index} className="add-person-button">{person.name}
                            </Button>
                        ))
                    }
                </div>

                <div></div>
                <br></br>
                <br></br>
                <Banner bannerTitle="Points of Interest" />
                <div></div>

                <div className="pin-container">
                    {/* <------where existing Points of Int will go-------> */}
                </div>

                <br />

                <div className="bottom-container-test">
                    <div className="bottom-btn-container1">
                        {/* This button should take you back to the group management page */}
                        <Link to='/group-management'>
                            <SquareButton buttonTitle="Back" />
                        </Link>
                    </div>

                    <div className="bottom-btn-container2">
                        {/* This button takes you to the related group map page */}
                        <Link to={'/map/' + this.props.match.params.uuid}>
                            <SquareButton buttonTitle="Go to the Map!" />
                        </Link>
                    </div>
                </div>
            </div >
        );
    }
}

export default withRouter(ViewGroupPage);
