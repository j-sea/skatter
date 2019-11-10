import './App.css';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import APIURL from './utils/APIURL';
import Axios from 'axios';
import CreateGroupPage from './components/CreateGroupPage';
import EditGroupPage from './components/EditGroupPage';
import Footer from './components/Footer';
import GroupMap from './components/GroupMap';
import GroupMgmtPage from './components/GroupMgmtPage';
import Logo from './components/Logo'
import ModalLogin from './components/ModalLogin';
import ModalSignUp from './components/ModalSignUp';
import Quickstart from './components/buttonQuickStart'
import React from 'react';
import Tutorial from './components/buttonTutorial'
import ViewGroupPage from './components/ViewGroupPage';
import GuestLoginPage from './components/GuestLoginPage';

class App extends React.Component {

	state = {
		loggedInUser: false,
		attemptedRecover: false,
	};

	guestLoginUUID = false;

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

	handleQuickstartSignUp = () => {
		console.log('Starting Quick Start session');

		// Register a new quickstart account
		const quickStartUrl = APIURL('/auth/quickstart/register');
		Axios.post(quickStartUrl, {}, { withCredentials: true })
			.then(response => {
				// Set a flag to go to the guest user login page
				this.guestLoginUUID = response.data.invite.invite_uuid;

				// Update our logged in user with our new guest user
				this.setState({
					loggedInUser: response.data.user
				});
			}).catch(error => {
				console.log(error);

				// Set our user as logged out
				this.setState({
					loggedInUser: false,
				});
			});
	};

	updateLoggedInUser = (user) => {
		console.log('Updating logged in user...');

		// Update our logged in user
		this.setState({
			loggedInUser: user,
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
		console.log('Handling user log out...');

		const logoutUrl = APIURL('/auth/logout');
		Axios.post(logoutUrl, {}, { withCredentials: true })
			.then(response => {
				this.setState({
					loggedInUser: false,
				});
			})
			.catch(error => {
				console.log(error);
			});
	};

	recoverSessionLogin = () => {
		console.log('Recovering session login...');

		const recoverSessionUrl = APIURL('/auth/recover-session');
		Axios.get(recoverSessionUrl, { withCredentials: true })
			.then(response => {
				this.setState({
					loggedInUser: response.data,
					attemptedRecover: true,
				})
			})
			.catch(error => {
				this.setState({
					loggedInUser: false,
					attemptedRecover: true,
				})
			});
	};

	componentDidMount() {
		this.recoverSessionLogin();
	}

	render() {
		return (
			(!this.state.attemptedRecover)
			? <div />
			: <div className="App">
				<Router>
					<Switch>
						<Route exact path="/">
						{
							(!this.state.loggedInUser)
								? <>
									<Logo />
									<Quickstart handleQuickstartSignUp={this.handleQuickstartSignUp} />
									<ModalSignUp handleSignUp={this.handleSignUp} />
									<ModalLogin handleLogIn={this.handleLogIn} />
									<Tutorial />
								</>
								: (this.guestLoginUUID)
									? () => {
										const inviteUUID = this.guestLoginUUID;
										this.guestLoginUUID = false;
										return <Redirect to={'/guest/' + inviteUUID} />
									}
									: <Redirect to="/group-management" />
						}
						</Route>
						<Route exact path="/guest/:uuid" render={props => (
							<GuestLoginPage loggedInUser={this.state.loggedInUser} updateLoggedInUser={this.updateLoggedInUser} {...props} />
						)} />
						<Route exact path="/group-management">
						{
							(!this.state.loggedInUser)
								? <Redirect to="/" />
								: <GroupMgmtPage handleLogOut={this.handleLogOut} />
						}
						</Route>
						<Route exact path="/edit-group/:uuid" render={
							(props) =>{
								if (!this.state.loggedInUser) {
									return <Redirect to="/" />;
								}
								else {
									return <EditGroupPage handleLogOut={this.handleLogOut} {...props} />;
								}
							}
						} />
						<Route exact path="/view-group/:uuid" render={
							(props) =>{
								if (!this.state.loggedInUser) {
									return <Redirect to="/" />;
								}
								else {
									return <ViewGroupPage handleLogOut={this.handleLogOut} {...props} />;
								}
							}
						} />
						<Route exact path="/create-group">
						{
							(!this.state.loggedInUser)
								? <Redirect to="/" />
								: <CreateGroupPage handleLogOut={this.handleLogOut} />
						}
						</Route>
						<Route exact path="/map">
						{
							(!this.state.loggedInUser)
								? <Redirect to="/" />
								: <GroupMap />
						}
						</Route>
					</Switch>
				</Router>
				<Footer />
			</div>
		);
	}
}

export default App;
