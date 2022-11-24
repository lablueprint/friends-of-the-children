import React from 'react';
import { Link } from 'react-router-dom';

function NavBar() {
  return (
    <div>
      {!loggedIn
        ? (
          <div className="login-buttons d-flex align-items-center justify-content-center gap-3 py-2">
            <Link to="/login" className="btn btn-primary" onClick={() => setLoggedIn(true)}> Log In </Link>
            <Link to="/signup" className="btn btn-primary" onClick={() => setLoggedIn(true)}> Sign Up </Link>
          </div>
        )
        : (
          <div className="login-buttons d-flex align-items-center justify-content-center gap-3 py-2">
            <Link to="/modules" className="btn btn-info"> Modules </Link>
            <Link to="/calendar" className="btn btn-info"> Calendar </Link>
            <Link to="/message-wall" className="btn btn-info"> Message Wall </Link>
            <Link to="/" className="btn btn-danger" onClick={() => setLoggedIn(false)}> Log Out </Link>
          </div>

        )}
    </div>
  );
}

export default NavBar;
