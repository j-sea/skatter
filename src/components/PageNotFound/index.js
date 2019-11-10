import React from 'react';
import { Link } from 'react-router-dom';
import RoundedButton from '../buttonRounded';
import './style.css';

function PageNotFound() {
	return <div>
		<h1>The thing you wanted doesn't exist!</h1>
		<p>Sorry for the inconvenience!</p>
		<Link to="/">
			<RoundedButton buttonTitle="Check out ScATTeR!" />
		</Link>
	</div>;
}

export default PageNotFound;