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

	render () {
		return (
			<div>
				<Header/>
                <br/>
                <SquareButton/>
                <br/> <br/>
                <RoundedButton/>
                <ModalDelete/>
                <RoundedButton/>
                <ModalDelete/>
                <RoundedButton/>
                <ModalDelete/>
                <RoundedButton/>
                <ModalDelete/>
				{/* <form onSubmit={this.handleSubmit}>
					<button type="submit">Log Out</button>
				</form> */}
                <Footer/>
			</div>
		);
	}
}

export default GroupMgmtPage;