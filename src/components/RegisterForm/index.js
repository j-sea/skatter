import React from 'react';
import './style.css';

class RegisterForm extends React.Component {
	state = {
		email: '',
		phone: '',
		password: '',
	};

	handleRegister = (submitEvent) => {
		submitEvent.preventDefault();

		const RegisterData = {
			email: this.state.email, 
			phone: this.state.phone,
			password: this.state.password,
		};

		const registerUrl = (window.location.hostname === 'localhost')
		                 ? 'http://localhost:8080/auth/register'
		                 : 'https://bailfire.herokuapp.com/auth/register';
		Axios.post(registerUrl, registerData, {withCredentials: true})
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
			<form onSubmit={this.handleRegister}>
				<h2>Sign In</h2>
				<input name="email" type="email" placeholder="E-mail Address" onChange={this.handleFormChange} /> or
				<input name="phone" type="phone" placeholder="Phone Number (SMS)" onChange={this.handleFormChange} /> <br />
				<input name="password" type="password" placeholder="Password" onChange={this.handleFormChange} /> <br />
				<button type="submit">Register</button>
			</form>
		);
	}
}

export default RegisterForm;