import React from 'react';
import {BrowserRouter as Router, Route} from 'react-router-dom';
import Axios from 'axios';
import LandingPage from './components/LandingPage';
import LoginForm from './components/LoginForm';
import Footer from './components/Footer';
import GroupMap from './components/GroupMap';
import './App.css';


class App extends React.Component {

	state = {
		loggedInUser: false,
	};

	handleLogIn = (email, phone, password) => {

		const loginData = {
			email,
			phone,
			password,
		};

		const loginUrl = (window.location.hostname === 'localhost')
		                 ? 'http://localhost:8080/auth/login'
		                 : 'https://bailfire.herokuapp.com/auth/login';
		Axios.post(loginUrl, loginData, {withCredentials: true})
		.then(response => {
			console.log(response);

			this.setState({
				loggedInUser: response.data.user,
			});
		})
		.catch(error => {
			this.setState({
				loggedInUser: false,
			});
		});
	};

	handleLogOut = () => {

		const logoutUrl = (window.location.hostname === 'localhost')
		                 ? 'http://localhost:8080/auth/logout'
										 : 'https://bailfire.herokuapp.com/auth/logout';

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

	render () {
		return (
			<div className="App">
				<Router>
					<Route exact path="/">
						{
							(this.state.loggedInUser)
							? <LandingPage handleLogOut={this.handleLogOut} />
							: <LoginForm handleLogIn={this.handleLogIn} />
						}
					</Route>
					<Route exact path="/map">
						{
							(this.state.loggedInUser)
							? <GroupMap />
							: <div>Not Logged In</div>
						}
					</Route>
				</Router>
				<Footer/>
			</div>
		);
	}
}

export default App;
