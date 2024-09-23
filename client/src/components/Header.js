import React, { Fragment, useContext, useState } from "react";
import { NavLink } from "react-router-dom";
import AppContext from "../AppContext";

const Header = () => {
  const { isAuthenticated } = useContext(AppContext);
  const { setIsAuthenticated } = useContext(AppContext);
  const { userName } = useContext(AppContext);
  const { setUsername } = useContext(AppContext);
  const { isTodayRecordExists, setIsTodayRecordExists } = useContext(AppContext); // Add setIsTodayRecordExists to context

  // State for toggling the notification text
  const [showNotificationText, setShowNotificationText] = useState(false);

  // Function to hide the navbar after clicking a link
  const collapseNavbar = () => {
    const navbarCollapse = document.getElementById("navbarNavAltMarkup");
    const bsCollapse = new window.bootstrap.Collapse(navbarCollapse, { toggle: false });
    bsCollapse.hide();
  };

  const logoutHandler = (e) => {
    e.preventDefault();
    setUsername("");
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    collapseNavbar(); // Collapse the navbar on logout
  };

  // Function to toggle notification text visibility
  const toggleNotificationText = () => {
    if (!showNotificationText) {
      // If notification text is currently not shown, show it
      setShowNotificationText(true);
    } else {
      // If notification text is currently shown, hide it and set isTodayRecordExists to false
      setShowNotificationText(false);
      setIsTodayRecordExists(false); // Set to false to remove the notification icon
    }
  };

  return (
    <Fragment>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <NavLink to="/" className="navbar-brand text-light">MyExpenses</NavLink>
        <div className="d-flex align-items-center ml-auto">
          {/* {isAuthenticated && (
            <div style={{ position: "relative", cursor: "pointer" }} onClick={toggleNotificationText}>
              <i
                className={`fas fa-bell ${isTodayRecordExists ? "text-danger" : "text-light"} mr-2`}
                style={{ fontSize: "1.5rem" }}
              ></i>
              {isTodayRecordExists && (
                <>
                  <span
                    style={{
                      position: "absolute",
                      top: "-5px",
                      right: "-10px",
                      backgroundColor: "red",
                      color: "white",
                      borderRadius: "50%",
                      padding: "2px 6px",
                      fontSize: "0.8rem"
                    }}
                  >
                    1
                  </span>
                  {showNotificationText && (
                    <div
                      style={{
                        position: "absolute",
                        top: "30px", // Position it below the icon
                        right: "-580%", // Align it horizontally
                        backgroundColor: "white",
                        border: "1px solid #ccc",
                        width: "300px",
                        borderRadius: "4px",
                        padding: "10px",
                        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
                        fontSize: "0.9rem",
                        zIndex: 1000
                      }}
                    >
                      Looks like you haven't added a record today. Don't miss it!
                    </div>
                  )}
                </>
              )}
            </div>
          )} */}
          <span className="text-light mr-3">{userName}</span>
          <button
            className="navbar-toggler"
            type="button"
            data-toggle="collapse"
            data-target="#navbarNavAltMarkup"
            aria-controls="navbarNavAltMarkup"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
        </div>
        <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
          <div className="navbar-nav">
            <NavLink className="nav-link" exact to="/" onClick={collapseNavbar}>
              Home <span className="sr-only">(current)</span>
            </NavLink>
            {!isAuthenticated && <NavLink className="nav-link" to="/LoginPage" onClick={collapseNavbar}>Login</NavLink>}
            {!isAuthenticated && <NavLink className="nav-link" to="/SigninPage" onClick={collapseNavbar}>SignIn</NavLink>}
            {isAuthenticated && <NavLink className="nav-link" to="/CreateExpenses" onClick={collapseNavbar}>Create Record</NavLink>}
            {isAuthenticated && <NavLink className="nav-link" to="/History" onClick={collapseNavbar}>History</NavLink>}
            {isAuthenticated && <NavLink className="nav-link" to="/Dashboard" onClick={collapseNavbar}>Dashboard</NavLink>}
            {isAuthenticated && <NavLink className="nav-link" to="/Advance" onClick={collapseNavbar}>Advance</NavLink>}
            {isAuthenticated && <a onClick={e => logoutHandler(e)} className="nav-link">Logout</a>}
          </div>
        </div>
      </nav>
    </Fragment>
  );
}

export default Header;
