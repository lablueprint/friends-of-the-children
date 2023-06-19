import { React } from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.css';
import { useDispatch, useSelector } from 'react-redux';
import styles from './styles/NavBar.module.css';
import { login } from './redux/sliceAuth';
import {
  Example,
  Login,
  MessageWall,
  Mentees,
  ExpandedMentee,
  Media,
  Signup,
  Resources,
  Calendar,
  ExpandedModule,
  NotFound,
  UserProfile,
  Requests,
  UserNotApproved,
} from './pages';
import NavBar from './components/NavBar';

function App() {
  const { user: currUser, isLoggedIn } = useSelector((state) => state.sliceAuth);
  const dispatch = useDispatch();
  // const { password: profilePassword, ...userProfile } = profile; // peform destruction to get profile w/o password

  // this functions props allow us to change the state in app.jsx from children components
  // Note: consider using "Context" for consistency throughout the app,
  // and might alse need cookies so that user stays logged after refreshing the page
  const updateProfile = (newProfile) => {
    dispatch(login(newProfile));
  };

  return (
    isLoggedIn
      ? (
        <div className="App">
          <div className={styles.wrapper}>
            {(currUser.role === 'Admin' || currUser.approved) && <NavBar profile={currUser} updateAppProfile={updateProfile} />}
            <div className={styles.mainContent}>
              <Routes>
                {currUser.role === 'Admin' || currUser.approved ? <Route path="/" element={(<Resources profile={currUser} />)} /> : <Route path="/" element={(<UserNotApproved updateAppProfile={updateProfile} profile={currUser} />)} />}
                <Route path="/profile" element={(<UserProfile profile={currUser} updateAppProfile={updateProfile} />)} />
                <Route path="/message-wall" element={(<MessageWall profile={currUser} />)} />
                <Route path="/mentees" element={(<Mentees profile={currUser} updateAppProfile={updateProfile} />)} />
                <Route path="/mentees/:menteeSlug" element={(<ExpandedMentee profile={currUser} />)} />
                <Route path="/mentees/:menteeSlug/:folderSlug" element={(<Media profile={currUser} />)} />
                <Route path="/example" element={(<Example profile={currUser} />)} />
                <Route path="/login" element={(<Login updateAppProfile={updateProfile} />)} />
                <Route path="/signup" element={(<Signup updateAppProfile={updateProfile} />)} />
                <Route path="/resources" element={(<Resources profile={currUser} />)} />
                <Route path="/expanded-module" element={(<ExpandedModule profile={currUser} />)} />
                <Route path="/calendar" element={(<Calendar profile={currUser} />)} />
                <Route path="/requests" element={(<Requests profile={currUser} />)} />
                <Route path="/unapproved" element={(<UserNotApproved updateAppProfile={updateProfile} profile={currUser} />)} />
              </Routes>
            </div>
          </div>
        </div>
      )
      : (
        <div className="App">
          <NavBar profile={currUser} updateAppProfile={updateProfile} />
          <Routes>
            <Route path="/" element={(<Login updateAppProfile={updateProfile} />)} />
            <Route path="/login" element={(<Login updateAppProfile={updateProfile} />)} />
            <Route path="/signup" element={(<Signup updateAppProfile={updateProfile} />)} />
            <Route path="/unapproved" element={(<UserNotApproved updateAppProfile={updateProfile} />)} />
            <Route path="*" element={(<NotFound />)} />
          </Routes>
        </div>
      )

  );
}

export default App;
