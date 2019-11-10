import React from 'react';
import { Link } from 'react-router-dom';
import RoundedButton from '../buttonRounded';
import './style.css';

function GroupInviteRejection() {
	return <div>
		<h1>Invitation to the group has been successfully rejected!</h1>
		<p>Interested in setting up your <em>own</em> ScATTeR group?</p>
		<Link to="/">
			<RoundedButton buttonTitle="Check out ScATTeR!" />
		</Link>
	</div>;
}

export default GroupInviteRejection;