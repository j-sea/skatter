import React from 'react';
import './style.css';
import ModalLogOut from '../ModalLogOut'

function Header(props) {
    const showLogOutBtn = () => {
        // 	return { (this.state.loggedInUser) && <ModalLogOut />
        // }
        if (props.showLogOutBtn) {
            return (
                <ModalLogOut handleLogOut={props.handleLogOut} />
            )
        } else {
            return null;
        }
    };

    return (
        <header>
            <nav className="navbar-light custom-hd row">
                <div className="col-6">
                    <img className="header-logo" src="/images/p3-logo3.png" alt="ScATTeR" />
                </div>
                <div className="header-div col-3 test1">
                    <i className="material-icons">person</i>
                </div>
                <div className="header-div col-3">
                    {showLogOutBtn()}
                </div>
            </nav>
        </header>
    )
}

export default Header;

