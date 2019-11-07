import './App.css';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import APIURL from './utils/APIURL';
import Axios from 'axios';
import CreateGroupPage from './components/CreateGroupPage';
import Footer from './components/Footer';
import GroupMap from './components/GroupMap';
import GroupMgmtPage from './components/GroupMgmtPage';
import LandingPage from './components/LandingPage';
import Layout from './components/Layout'
import LoginForm from './components/LoginForm';
import Logo from './components/Logo'
import ModalAdd from './components/ModalAddPerson';
import ModalDelete from './components/ModalDelete'
import ModalLogin from './components/ModalLogin';
import ModalSignUp from './components/ModalSignUp';
import React from 'react';


class App extends React.Component {

	state = {
		loggedInUser: false,
	};

	// receive back response.data

	handleLogIn = (email, phone, password) => {
		console.log('logging in');

		const loginData = {
			email,
			phone,
			password,
		};

		const loginUrl = APIURL('/auth/login');
		Axios.post(loginUrl, loginData, { withCredentials: true })
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
					<Route exact path="/">
						{
							(this.state.loggedInUser)
								? <div>
									<Link to="/map">Group Map</Link>
									<LandingPage handleLogOut={this.handleLogOut} />
								</div>
								: <>
									<Logo />
									<ModalAdd />
									<ModalLogin handleLogIn={this.handleLogIn} />
								</>
						}
					</Route>
					<Route exact path="/map">
						<GroupMap />
						{/*
							(this.state.loggedInUser)
							? <GroupMap />
							: <div>Not Logged In</div>
						*/}
					</Route>
					<Route exact path="/group-management">
						<GroupMgmtPage />
					</Route>
					<Route exact path="/create-group">
						<CreateGroupPage />
					</Route>

				</Router>
				<Footer />
			</div>
		);
	}
}

export default App;
