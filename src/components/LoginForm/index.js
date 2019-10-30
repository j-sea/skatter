import React from 'react';
import GeneralButton from '../GeneralButton';
import './style.css';

class LoginForm extends React.Component {
	state = {
		email: '',
		phone: '',
		password: '',
	};

	handleSubmit = submitEvent => {
		submitEvent.preventDefault();
		this.props.handleLogIn(this.state.email, this.state.phone, this.state.password);
	};

	handleFormChange = changeEvent => {
		const {name, value} = changeEvent.target;

		this.setState({
			[name]: value,
		})
	};

	render () {
		return (
			<>
			<GeneralButton/>
			<form onSubmit={this.handleSubmit}>
				<h2>Log In</h2>
				<input name="email" type="email" placeholder="E-mail Address" onChange={this.handleFormChange} /> or
				<input name="phone" type="phone" placeholder="Phone Number (SMS)" onChange={this.handleFormChange} /> <br />
				<input name="password" type="password" placeholder="Password" onChange={this.handleFormChange} /> <br />
				<button type="submit">Log In</button>
			</form>
			</>
		);
	}
}

export default LoginForm;