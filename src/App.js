import './App.css';
import { BrowserRouter as Router, Route, Link, Switch, Redirect } from 'react-router-dom';
import APIURL from './utils/APIURL';
import Axios from 'axios';
import CreateGroupPage from './components/CreateGroupPage';
import EditGroupPage from './components/EditGroupPage';
import Footer from './components/Footer';
import GroupMap from './components/GroupMap';
import GroupMgmtPage from './components/GroupMgmtPage';
// import LandingPage from './components/LandingPage';
// import Layout from './components/Layout'
// import LoginForm from './components/LoginForm';
import Logo from './components/Logo'
// import ModalAdd from './components/ModalAddPerson';
// import ModalDelete from './components/ModalDelete'
import ModalLogin from './components/ModalLogin';
import ModalSignUp from './components/ModalSignUp';
import Quickstart from './components/buttonQuickStart'
import React from 'react';
import Tutorial from './components/buttonTutorial'
import ViewGroupPage from './components/ViewGroupPage';
import ProtectedRoute from './utils/ProtectedRoute';


class App extends React.Component {

	state = {
		loggedInUser: false,
	};



	handleTutorial = () => {
		console.log('Starting Tutorial');

		// const tutorialUrl = APIURL('/auth/register');
		// Axios.post({ withCredentials: true })
		// 	.then(response => {
		// 		console.log(response);
		// 		this.setState({
		// 			loggedInUser: response.data.user
		// 		});
		// 	}).catch(error => {
		// 		this.setState({
		// 			loggedInUser: false,
		// 		});
		// 	});
	};

	handleQuickstart = () => {
		console.log('Starting Quick Start session');

		const quickStartUrl = APIURL('/auth/register');
		Axios.post({ withCredentials: true })
			.then(response => {
				console.log(response);
				this.setState({
					loggedInUser: response.data.user
				});
			}).catch(error => {
				this.setState({
					loggedInUser: false,
				});
			});
	};

	handleSignUp = (email, phone, password) => {
		console.log('Attempting to sign up...');

		const signUpData = {
			email,
			phone,
			password
		}
		//hits 'register' route on backend
		const signUpUrl = APIURL('/auth/register');
		//posts new user info and sends any client side cookies with request
		Axios.post(signUpUrl, signUpData, { withCredentials: true })
			.then(response => {
				console.log(response);
				//sets initial state to any data passed back from backend
				this.setState({
					loggedInUser: response.data.user
				});
			}).catch(error => {
				this.setState({
					loggedInUser: false,
				});
			});
	};


	handleLogIn = (email, phone, password) => {
		console.log('Attempting to log in...');

		const loginData = {
			email,
			phone,
			password,
		};

		const loginUrl = APIURL('/auth/login');
		Axios.post(loginUrl, loginData, { withCredentials: true })
			.then(response => {
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
		const logoutUrl = APIURL('/auth/logout');
		Axios.post(logoutUrl, {}, { withCredentials: true })
			.then(response => {
				console.log(response);

				this.setState({
					loggedInUser: false,
				});
			})
			.catch(error => {
				console.log(error);
			});
	};

	recoverSessionLogin = () => {

		const recoverSessionUrl = APIURL('/auth/recover-session');
		Axios.get(recoverSessionUrl, { withCredentials: true })
			.then(response => {
				this.setState({
					loggedInUser: response.data,
				})
			})
			.catch(error => {
				this.setState({
					loggedInUser: false,
				})
			});
	};

	componentDidMount() {
		this.recoverSessionLogin();
	}

	render() {
		return (
			<div className="App">
				<Router>
					<Switch>
						<Route exact path="/">
							{
								(this.state.loggedInUser)
									? <Redirect to="/group-management" />
									: <>
										<Logo />
										<Quickstart handleQuickstart={this.handleQuickstart} />
										<ModalSignUp handleSignUp={this.handleSignUp} />
										<ModalLogin handleLogIn={this.handleLogIn} />
										<Tutorial />
									</>
							}
						</Route>

						<ProtectedRoute exact path="/group-management" component={GroupMgmtPage} loggedInUser={this.state.loggedInUser} handleLogOut={this.handleLogOut} />
						{/* <Route exact path="/group-management">
							<GroupMgmtPage handleLogOut={this.handleLogOut} />
						</Route> */}

						<ProtectedRoute exact path="/edit-group/:uuid" component={EditGroupPage} loggedInUser={this.state.loggedInUser} />
						{/* <Route exact path="/edit-group/:uuid" component={EditGroupPage} /> */}

						<ProtectedRoute exact path="/view-group/:uuid" component={ViewGroupPage} loggedInUser={this.state.loggedInUser} />
						{/* <Route exact path="/view-group/:uuid" component={ViewGroupPage} /> */}

						<ProtectedRoute exact path="/create-group" component={CreateGroupPage} loggedInUser={this.state.loggedInUser} />
						{/* <Route exact path="/create-group">
							<CreateGroupPage />
						</Route> */}

						<ProtectedRoute exact path="/map" component={GroupMap} loggedInUser={this.state.loggedInUser} />
						{/* <Route exact path="/map">
							<GroupMap />
						</Route> */}
					</Switch>
				</Router>
				<Footer />
			</div>
		);
	}
}

export default App;
