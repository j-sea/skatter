import React from 'react';
import { withRouter } from 'react-router-dom';
import Axios from 'axios';
import APIURL from '../../utils/APIURL';
import './style.css';

class GuestLoginPage extends React.Component {
	handleSubmit = submitEvent => {
		submitEvent.preventDefault();

		// If the user is logged in already
		if (this.props.loggedInUser) {
			// Redirect to the group management page
			this.props.history.push('/group-management');
		}
		// If the user is not logged in
		else {
			// Log the user in
			Axios.post(APIURL('/auth/login/guest'), {
				invite_uuid: this.props.match.params.uuid
			}, { withCredentials: true })
				.then(response => {
					// Update the logged in user in the app
					this.props.updateLoggedInUser(response.data.user);

					// Redirect to the group management page
					this.props.history.push('/group-management');
				})
				.catch(function (err) {
					console.error(err);
				})
		}
	};

	render() {
		return (
			<container className='main-page-container'>
				<div className='guest-login-pg'>
					<h2>Welcome to your Guest account</h2>
					<br></br>
					<p>Please make sure to <strong>bookmark</strong> this page!</p>
					<p>If you lose this page after you log out, <strong>you will lose access to any groups you've created or joined</strong> and you will need to create a new account at that point!</p>
					<form onSubmit={this.handleSubmit}>
						<button type="submit">I understand I need to bookmark this page</button>
					</form>
				</div>
			</container>
		);
	}
}

export default withRouter(GuestLoginPage);