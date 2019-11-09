import React, { Component } from 'react';
import { Route, Redirect } from 'react-router-dom';

class ProtectedRoute extends Component {
    render() {
        const { component: Component, loggedInUser, ...props } = this.props

        return (
            <Route 
                {...props} 
                render = {
                    () => (
                        loggedInUser ?
                        <Component {...props} /> :
                        <Redirect to='/' />
                    )
                }
            />
        )
    }
}

export default ProtectedRoute;