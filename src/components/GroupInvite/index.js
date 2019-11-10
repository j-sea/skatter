import React from 'react';
import { withRouter, Redirect } from 'react-router-dom';
import Axios from 'axios';
import APIURL from '../../utils/APIURL'; 
import './style.css';

class GroupInvite extends React.Component {
	state = {
		redirectUrl: false,
	};

	updateInvite = (user_id, user_uuid, accepted) => {
		// Update the group invite with our new guest account
		Axios.put(APIURL('/api/group-invite'), {
			invite_uuid: this.props.match.params.uuid,
			guest_user_uuid: user_uuid,
			user_id: user_id,
			accepted: accepted,
			rejected: !accepted,
		}, { withCredentials: true })
		.then(inviteResponse => {
			// If we accepted the invite
			if (accepted) {
				// Redirect to the guest login page
				this.setState({
					redirectUrl: '/guest/' + inviteResponse.data.invite_uuid
				});
			}
			// If we rejected the invite
			else {
				// Redirect to the group invite rejection page
				this.setState({
					redirectUrl: '/group-invite/rejection-confirmation'
				});
			}
		})
		.catch(error => {
			console.error(error);
		});
	}

	acceptInvite = () => {
		console.log('Accepting invite...');

		if (this.props.loggedInUser) {
			this.updateInvite(this.props.loggedInUser.id, this.props.loggedInUser.user_uuid, true);
		}
		else {
			// Create a new guest user
			Axios.post(APIURL('/auth/guest/register'), {},
				{ withCredentials: true })
			.then(userResponse => {
				this.updateInvite(userResponse.data.id, userResponse.data.user_uuid, true);
			})
			.catch(error => {
				console.error(error);
			});
		}
	};

	rejectInvite = () => {
		console.log('Rejecting invite...');

		this.updateInvite(null, false);
	};

	componentDidMount () {
		if (this.props.accepted) {
			this.acceptInvite();
		}
		else {
			this.rejectInvite();
		}
	}

	render () {
		return (this.state.redirectUrl)
		? <Redirect to={this.state.redirectUrl} />
		: <div />;
	}
}

export default withRouter(GroupInvite);