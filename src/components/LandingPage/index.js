import React from 'react';
import './style.css';

class LandingPage extends React.Component {
	handleSubmit = submitEvent => {
		submitEvent.preventDefault();
		this.props.handleLogOut();
	};

	render () {
		return (
			<div>
				<h2>Logged in!</h2>
				<form onSubmit={this.handleSubmit}>
					<button type="submit">Log Out</button>
				</form>
			</div>
		);
	}
}

export default LandingPage;