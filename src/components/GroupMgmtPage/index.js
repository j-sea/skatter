import React from 'react';
import './style.css';
import { Link } from "react-router-dom";
import Header from '../Header'
import SquareButton from '../buttonSquare';
import RoundedButton from '../buttonRounded';
import ModalDelete from '../ModalDelete';
import Banner from '../Banner'
import Axios from 'axios';
import APIURL from '../../utils/APIURL';
import { Button } from 'reactstrap'

class GroupMgmtPage extends React.Component {

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
                            <Link to={`/view-group/${fartponies.group_uuid}`}><RoundedButton buttonTitle={fartponies.group_name} /></Link>
                            {
                                (fartponies.UserId === this.props.loggedInUser.id)
                                    ? <>
                                        <Link to={`/edit-group/${fartponies.group_uuid}`}><RoundedButton buttonTitle="Edit" /></Link>
                                        <div>
                                            <ModalDelete onClick={() => {
                                                this.handleDeleteGroup(fartponies.group_uuid)
                                            }} />
                                        </div>
                                    </>
                                    : <div />
                            }
                        </div>
                    })}
                </div>
            </div >
        );
    }
}

export default GroupMgmtPage;
