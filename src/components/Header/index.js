import React from 'react';
import './style.css';
import ModalLogOut from '../ModalLogOut'

function Header(props) {
    return (
        <header>
            <nav className="navbar-light custom-hd row">
                <div className="col-6">
                    <img className="header-logo" src="/images/p3-logo3.png" alt="scatter" />
                </div>
                <div className="header-div col-3 test1">
                    <i className="material-icons">person</i>
                </div>
                <div className="header-div col-3">
                    {/* <button type="button" className="btn btn-primary btn-sm header-test" > <i className="material-icons">dehaze</i></button> */}
                    <ModalLogOut handleLogOut={props.handleLogOut} />
                </div>
            </nav>
        </header>
    )
}

export default Header;