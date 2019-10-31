import React from 'react';
import {BrowserRouter as Router, Route} from 'react-router-dom';
import ApiUrl from './utils/ApiUrlResolver';
import Axios from 'axios';
import LandingPage from './components/LandingPage';
import LoginForm from './components/LoginForm';
import './App.css';


class App extends React.Component {

	state = {
		isAuthorized: false,
		authorizationError: false,
	};

	handleLogIn = (email, phone, password) => {

		const loginData = {
			email,
			phone,
			password,
		};

		const loginUrl = ApiUrl + '/auth/login';
		console.log(loginUrl);
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

	handleLogOut = () => {

		const logoutUrl = ApiUrl + '/auth/logout';

		Axios.post(logoutUrl, {}, {withCredentials: true})
		.then(response => {
			console.log(response);

			this.setState({
				isAuthorized: false,
				authorizationError: false,
			});
		})
		.catch(error => {
			this.setState({
				isAuthorized: this.state.isAuthorized,
				authorizationError: true,
			});
		});
	};

	getView = () => {
		if (this.state.isAuthorized) {
			return <LandingPage handleLogOut={this.handleLogOut} />;
		}
		else {
			return <LoginForm handleLogIn={this.handleLogIn} />;
		}
	};

	render () {
		return (
			<div className="App">
				<Router>
					
					<Route exact path="/">
						{this.getView()}
					</Route>
				</Router>
			</div>
		);
	}
}

export default App;
