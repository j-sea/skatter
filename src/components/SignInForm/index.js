import React from 'react';
import './style.css';

class SignInForm extends React.Component {
	state = {
		email: '',
		phone: '',
		password: '',
	};

	handleLogIn = (submitEvent) => {
		submitEvent.preventDefault();

		const loginData = {
			email: this.state.email, 
			phone: this.state.phone,
			password: this.state.password,
		};

		const loginUrl = (window.location.hostname === 'localhost')
		                 ? 'http://localhost:8080/auth/login'
		                 : 'https://bailfire.herokuapp.com/auth/login';
		Axios.post(loginUrl, loginData, {withCredentials: true})
		.then(response => {
			console.log(response);

			this.setState({
				isAuthorized: true,
				authorizationError: false,
			});
		})
		.catch(error => {
			this.setState({
				isAuthorized: false,
				authorizationError: true,
			});
		});
	};

	handleFormChange = changeEvent => {
		const {name, value} = changeEvent.target;

		this.setState({
			[name]: value,
		})
	};

	render () {
		return (
			<form onSubmit={this.handleLogIn}>
				<h2>Sign In</h2>
				<input name="email" type="email" placeholder="E-mail Address" onChange={this.handleFormChange} /> or
				<input name="phone" type="phone" placeholder="Phone Number (SMS)" onChange={this.handleFormChange} /> <br />
				<input name="password" type="password" placeholder="Password" onChange={this.handleFormChange} /> <br />
				<button type="submit">Sign In</button>
			</form>
		);
	}
}

export default SignInForm;