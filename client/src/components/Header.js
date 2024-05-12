import React, { Fragment } from "react";
import { NavLink } from "react-router-dom";

const Header = () => {
    return (
    <Fragment>
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
            <a className="navbar-brand text-light">MyExpenses</a>
            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
                <div className="navbar-nav">
                  <NavLink className="nav-link" exact to="/">Home <span className="sr-only">(current)</span></NavLink>
                  <NavLink className="nav-link" to="/CreateExpenses">Create Record</NavLink>
                  <NavLink className="nav-link" to="/LoginPage">Login</NavLink>
                  <NavLink className="nav-link" to="/SigninPage">SignIn</NavLink>
                  <NavLink className="nav-link" to="/History">History</NavLink>
                  <NavLink className="nav-link" to="/Dashboard">Dashboard</NavLink>
                  <a className="nav-link">LogOut</a>
                </div>
            </div>
        </nav>
    </Fragment>
    )
}

export default Header;
