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
  Signup,
  Modules,
  Calendar,
  ExpandedModule,
  NotFound,
  UserProfile,
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
            <NavBar profile={currUser} updateAppProfile={updateProfile} />
            <div className={styles.mainContent}>
              <Routes>
                <Route path="/" element={(<Modules profile={currUser} />)} />
                <Route path="/profile" element={(<UserProfile profile={currUser} updateAppProfile={updateProfile} />)} />
                <Route path="/message-wall" element={(<MessageWall profile={currUser} />)} />
                <Route path="/mentees" element={(<Mentees profile={currUser} updateAppProfile={updateProfile} />)} />
                <Route path="/mentees/*" element={(<ExpandedMentee profile={currUser} />)} />
                <Route path="/example" element={(<Example profile={currUser} />)} />
                <Route path="/login" element={(<Login updateAppProfile={updateProfile} />)} />
                <Route path="/signup" element={(<Signup updateAppProfile={updateProfile} />)} />
                <Route path="/modules" element={(<Modules profile={currUser} />)} />
                <Route path="/expanded-module" element={(<ExpandedModule profile={currUser} />)} />
                <Route path="/calendar" element={(<Calendar profile={currUser} />)} />
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
            <Route path="*" element={(<NotFound />)} />
          </Routes>
        </div>
      )

  );
}

export default App;
