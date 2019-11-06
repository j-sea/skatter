import React from 'react';
import {BrowserRouter as Router, Route, Link} from 'react-router-dom';
import Axios from 'axios';
import LandingPage from './components/LandingPage';
import LoginForm from './components/LoginForm';
import Footer from './components/Footer';
import GroupMap from './components/GroupMap';
import './App.css';
import ModalLogin from './components/ModalLogin';
import Logo from './components/Logo'
import Layout from './components/Layout'
import ModalDelete from './components/ModalDelete'
import GroupMgmtPage from './components/GroupMgmtPage';


class App extends React.Component {

	state = {
		loggedInUser: false,
	};

	handleLogIn = (email, phone, password) => {
		console.log('logging in');

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
				loggedInUser: false,
			});
		})
		.catch(error => {
			console.log(error);
		});
	};

	render () {
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
									<Logo/>
									<ModalLogin handleLogIn={this.handleLogIn}/>
								</>
						}
					</Route>
					<Route exact path="/map">
						{
							(this.state.loggedInUser)
							? <GroupMap />
							: <div>Not Logged In</div>
						}
					</Route>
					<Route exact path="/group">
						<GroupMgmtPage handleLogOut={this.handleLogOut}/>
					</Route>
					
				</Router>
				<Footer/>
			</div>
		);
	}
}

export default App;
