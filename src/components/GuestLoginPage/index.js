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

	render () {
		return (
			// If the user is logged in, give them a warning and let them continue with confirmation
			(this.props.loggedInUser)
			? <div>
				<h2>This is your guest login page!</h2>
				<p>In order to be able to log back into this guest user account later, you'll need to <strong>bookmark</strong> this page!</p>
				<p>If you lose this page after you log out, <strong>you will lose access to any groups you've created or joined!</strong> You will need to create a new account at that point!</p>
				<form onSubmit={this.handleSubmit}>
					<button type="submit">I understand I need to bookmark this page!</button>
				</form>
			</div>
			// If the user is not logged in, let them log in and continue to their groups
			: <div>
				<h2>Welcome back!</h2>
				<p>If you lose this page after you log out, <strong>you will lose access to any groups you've created or joined!</strong> You will need to create a new account at that point!</p>
				<p>Consider converting your account into a full one using a password and e-mail / phone number. You'll also receive alarms straight to your e-mail or phone number for relevant group meet ups!</p>
				<form onSubmit={this.handleSubmit}>
					<button type="submit">Continue to your groups!</button>
				</form>
			</div>
		);
	}
}

export default withRouter(GuestLoginPage);