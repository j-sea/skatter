import React from 'react';
import './style.css';
import Header from '../Header'
import Footer from '../Footer'
import SquareButton from '../SquareButton';
import RoundedButton from '../RoundedButton';
import ModalDelete from '../ModalDelete';
import Banner from '../Banner'

class GroupMgmtPage extends React.Component {
    handleSubmit = submitEvent => {
    	submitEvent.preventDefault();
    	this.props.handleLogOut();
    };

    render() {
        return (
            <div>
                <Header />
                <br />
                <SquareButton buttonTitle="Create Group"/>
                <br /> <br />
                <Banner bannerTitle="Existing Groups"/>
                <div className="content-box-style">
                    <div className="level1-btns">
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

export default GroupMgmtPage;