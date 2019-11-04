import React from 'react';
import {BrowserRouter as Router, Route} from 'react-router-dom';
import Axios from 'axios';
import LandingPage from './components/LandingPage';
import LoginForm from './components/LoginForm';
import Footer from './components/Footer';
import './App.css';
import ModalLogin from './components/ModalLogin';
import Logo from './components/Logo'


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

	// getView = () => {
	// 	if (this.state.isAuthorized) {
	// 		return <LandingPage handleLogOut={this.handleLogOut} />;
	// 	}
	// 	else {
	// 		return <LoginForm handleLogIn={this.handleLogIn} />;
	// 	}
	// };

	render () {
		return (
			<div className="App">
				<Router>
					
					<Route exact path="/">
						{/* {this.getView()} */}
						<Logo/>
						<ModalLogin/>
						{/* <ModalLogin handleLogIn={this.handleLogIn}/> */}
					</Route>
					
				</Router>
				<Footer/>
			</div>
		);
	}
}

export default App;
