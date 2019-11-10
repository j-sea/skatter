import React from 'react';
import { withRouter, Redirect } from 'react-router-dom';
import Axios from 'axios';
import APIURL from '../../utils/APIURL'; 
import './style.css';

class GroupInvite extends React.Component {
	state = {
		redirectUrl: false,
	};

	acceptInvite = () => {
		console.log('Accepting invite...');

		// Create a new guest user
		Axios.post(APIURL('/auth/guest/register'), {},
			{ withCredentials: true })
		.then(userResponse => {
			// Update the group invite with our new guest account
			Axios.put(APIURL('/api/group-invite'), {
				invite_uuid: this.props.match.params.uuid,
				guest_user_uuid: userResponse.data.user_uuid,
				accepted: true,
				rejected: false,
			}, { withCredentials: true })
			.then(inviteResponse => {
			// Redirect to the guest login page
				this.setState({
					redirectUrl: '/guest/' + inviteResponse.data.invite_uuid
				});
			})
			.catch(error => {
				console.error(error);
			});
		})
		.catch(error => {
			console.error(error);
		});
	};

	rejectInvite = () => {
		console.log('Accepting invite...');

		// Update the group invite with a rejection
		Axios.put(APIURL('/api/group-invite'), {
			invite_uuid: this.props.match.params.uuid,
			guest_user_uuid: null,
			accepted: false,
			rejected: true,
		}, { withCredentials: true })
		.then(inviteResponse => {
			// Redirect to the group invite rejection page
			this.setState({
				redirectUrl: '/group-invite/rejection-confirmation'
			});
		})
		.catch(error => {
			console.error(error);
		});
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