import React from 'react';
import './style.css';
import { Link } from "react-router-dom";
import Header from '../Header'
import Footer from '../Footer'
import SquareButton from '../buttonSquare';
import RoundedButton from '../buttonRounded';
// import ModalDelete from '../ModalDelete';
import Banner from '../Banner'
import Axios from 'axios';
import APIURL from '../../utils/APIURL';
import { Button } from 'reactstrap'

class GroupMgmtPage extends React.Component {
    // handleSubmit = submitEvent => {
    // 	submitEvent.preventDefault();
    // 	this.props.handleLogOut();
    // };

    //set initial state of page 
    state = {
        existingGroups: []
    }

    //on page load, axios call to DB, then convert to json, then update state
    componentDidMount() {
        //made const variable that allows to switch from localhost to heroku
        const viewExistingGroupsUrl = APIURL(`/api/user/group`);
        Axios.get(
            //withCredentials specifies to axios to send cookies along with request since request is not coming from browser
            viewExistingGroupsUrl, { withCredentials: true })
            .then(res => {
                return res.data
            })
            .then(json => this.setState({ existingGroups: json }));
    }


    handleDeleteGroup = (group_uuid) => {
        const deleteGroupUrl = APIURL(`/api/group/${group_uuid}`);
        Axios.delete(deleteGroupUrl, { withCredentials: true })
            .then(response => {
                console.log(response);
                this.setState({
                    existingGroups: this.state.existingGroups.filter((fartponies) => {
                        return fartponies.group_uuid !== group_uuid
                    })
                })
            })
    }

    render() {
        return (
            <div>
                <Header />
                <br />
                <Link to='/create-group'>

                    <SquareButton buttonTitle="Create Group" />
                </Link>
                <br /> <br />
                <Banner bannerTitle="Existing Groups" />
                <div className="content-box-style">
                    {this.state.existingGroups.map(fartponies => {
                        return <div className="level1-btns" key=
                            //"key" needed to identify order of objects. Also, to prevent the annoying react warning that Joe talked about
                            {fartponies.id}>
                            <RoundedButton buttonTitle=
                                //fartponies = group
                                {fartponies.group_name} />
                            <div>
                                <Button className="external-delete-button" onClick={() => {
                                    this.handleDeleteGroup(fartponies.group_uuid)
                                }}>X</Button>
                            </div>
                        </div>
                    })}
                </div>
                <Footer />
            </div>
        );
    }
}

export default GroupMgmtPage;