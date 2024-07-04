import React, { Fragment, useContext } from "react";
import { NavLink } from "react-router-dom";
import Swal from 'sweetalert2';

import AppContext from "../AppContext";

const Header = () => {

    const { isAuthenticated } = useContext(AppContext);
    const { setIsAuthenticated } = useContext(AppContext);
    const {userName} = useContext(AppContext)
    const {setUsername} = useContext(AppContext)

    const logoutHandler = (e) => {
        e.preventDefault();
        setUsername("");
        localStorage.removeItem("token");
        setIsAuthenticated(false);
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "Logged out successfully",
          showConfirmButton: false,
          timer: 1500
        });
    }

    return (
        <Fragment>
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
          <NavLink to="/" className="navbar-brand text-light">MyExpenses!!</NavLink>
          <div className="d-flex align-items-center ml-auto">
            <span className="text-light mr-3">{userName}</span>
            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
              <span className="navbar-toggler-icon"></span>
            </button>
          </div>
          <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
            <div className="navbar-nav">
              <NavLink className="nav-link" exact to="/">Home <span className="sr-only">(current)</span></NavLink>
              {!isAuthenticated && <NavLink className="nav-link" to="/LoginPage">Login</NavLink>}
              {!isAuthenticated && <NavLink className="nav-link" to="/SigninPage">SignIn</NavLink>}
              {isAuthenticated && <NavLink className="nav-link" to="/CreateExpenses">Create Record</NavLink>}
              {isAuthenticated && <NavLink className="nav-link" to="/History">History</NavLink>}
              {isAuthenticated && <NavLink className="nav-link" to="/Dashboard">Dashboard</NavLink>}
              {isAuthenticated && <NavLink className="nav-link" to="/Advance">Advance</NavLink>}
              {isAuthenticated && <a onClick={e => logoutHandler(e)} className="nav-link">Logout</a>}
            </div>
          </div>
        </nav>
      </Fragment>
    )
}

export default Header;
