import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../redux/sliceAuth';
import fotcLogo from '../assets/fotc_logo.svg';

function NavBar({ profile, updateAppProfile }) {
  // const [loggedIn, setLoggedIn] = useState(false);
  // console.log(profile);
  const dispatch = useDispatch();
  const handleLogout = () => {
    updateAppProfile(null);
    dispatch(logout(profile));
  };

  return (
    <div>
      {!profile
        ? (
          <div className="login-buttons d-flex align-items-center justify-content-left gap-3 py-2">
            {/* <Link to="/login" className="btn btn-primary" onClick={() => setLoggedIn(true)}> Log In </Link>
            <Link to="/signup" className="btn btn-primary" onClick={() => setLoggedIn(true)}> Sign Up </Link> */}
            <a href="/">
              <img
                style={{
                  position: 'absolute', width: '139px', height: '67px', left: '61px', top: '40px',
                }}
                src={fotcLogo}
                alt="fotc logo"
              />
            </a>
            {/* <Link to="/login" className="btn btn-primary"> Log In </Link>
            <Link to="/signup" className="btn btn-primary"> Sign Up </Link> */}
          </div>
        )
        : (
          <div className="login-buttons d-flex align-items-center justify-content-center gap-3 py-2">
            <Link to="/profile" className="btn btn-info"> Profile </Link>
            <Link to="/modules" className="btn btn-info"> Modules </Link>
            <Link to="/calendar" className="btn btn-info"> Calendar </Link>
            <Link to="/message-wall" className="btn btn-info"> Message Wall </Link>
            <Link to="/" className="btn btn-danger" onClick={handleLogout}> Log Out </Link>
            {/* <Link to="/" className="btn btn-danger"> Log Out </Link> */}
          </div>
        )}
    </div>
  );
}

NavBar.propTypes = {
  profile: PropTypes.shape({
    firstName: PropTypes.string.isRequired,
    lastName: PropTypes.string.isRequired,
    username: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    role: PropTypes.string.isRequired,
    serviceArea: PropTypes.string.isRequired,
  }).isRequired,
};

NavBar.propTypes = {
  updateAppProfile: PropTypes.func.isRequired,
};

export default NavBar;
