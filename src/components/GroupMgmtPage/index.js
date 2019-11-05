import React from 'react';
import './style.css';
import Header from '../Header'
import Footer from '../Footer'
import SquareButton from '../SquareButton';
import RoundedButton from '../RoundedButton';
import ModalDelete from '../ModalDelete';

class GroupMgmtPage extends React.Component {
    // handleSubmit = submitEvent => {
    // 	submitEvent.preventDefault();
    // 	this.props.handleLogOut();
    // };

    render() {
        return (
            <div>
                <Header />
                <br />
                <SquareButton />
                <br /> <br />
                <div className="content-box-style">
                    <div className="level1-btns">
                        <RoundedButton />
                        <ModalDelete />
                    </div>
                    <div className="level1-btns">
                        <RoundedButton />
                        <ModalDelete />
                    </div>
                    <div className="level1-btns">
                        <RoundedButton />
                        <ModalDelete />
                    </div>
                    <div className="level1-btns">
                        <RoundedButton />
                        <ModalDelete />
                    </div>
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