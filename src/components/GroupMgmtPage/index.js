import React from 'react';
import './style.css';
import Header from '../Header'
import Footer from '../Footer'
import SquareButton from '../SquareButton';
import RoundedButton from '../RoundedButton';
import ModalDelete from '../ModalDelete';
import Banner from '../Banner'
import Axios from 'axios';

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
        Axios.get('http://localhost:8080/api/user/2/group')
            .then(res => {
                return res.data
            })
            .then(json => this.setState({ existingGroups: json }));
    }

    render() {
        return (
            <div>
                <Header />
                <br />
                <SquareButton buttonTitle="Create Group" />
                <br /> <br />
                <Banner bannerTitle="Existing Groups" />
                <div className="content-box-style">
                    {this.state.existingGroups.map(function (fartponies) {
                        return <div className="level1-btns" key=
                            //"key" needed to identify order of objects. Also, annoying react warning that Joe talked about
                            {fartponies.id}>
                            <RoundedButton buttonTitle=
                                //fartponies = group
                                {fartponies.group_name} />
                            <ModalDelete />
                        </div>
                    })}
                    {/* <div className="level1-btns">
                        <RoundedButton buttonTitle="Bite of Seattle" />
                        <ModalDelete />
                    </div>
                    <div className="level1-btns">
                        <RoundedButton buttonTitle="Taste of Tacoma" />
                        <ModalDelete />
                    </div>
                    <div className="level1-btns">
                        <RoundedButton buttonTitle="Saturday Movie" />
                        <ModalDelete />
                    </div>
                    <div className="level1-btns">
                        <RoundedButton buttonTitle="Fair Day!" />
                        <ModalDelete />
                    </div> */}
                </div>
                {/* <form onSubmit={this.handleSubmit}>
					<button type="submit">Log Out</button>
				</form> */}
                <Footer />
            </div>
        );
    }
}

export default GroupMgmtPage;