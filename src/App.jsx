import { React } from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.css';
import { useSelector } from 'react-redux';
import {
  Example,
  Login,
  MessageWall,
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

  // const { password: profilePassword, ...userProfile } = profile; // peform destruction to get profile w/o password

  // this functions props allow us to change the state in app.jsx from children components
  // Note: consider using "Context" for consistency throughout the app,
  // and might alse need cookies so that user stays logged after refreshing the page
  const updateProfile = (newProfile) => {
    const profileData = JSON.stringify(newProfile);
    localStorage.setItem('user', profileData);
  };

  return (
    isLoggedIn
      ? (
        <div className="App">
          <NavBar profile={currUser} updateAppProfile={updateProfile} />
          <Routes>
            <Route path="/" element={(<Modules profile={currUser} />)} />
            <Route path="/profile" element={(<UserProfile profile={currUser} updateAppProfile={updateProfile} />)} />
            <Route path="/message-wall" element={(<MessageWall profile={currUser} />)} />
            <Route path="/example" element={(<Example profile={currUser} />)} />
            <Route path="/login" element={(<Login updateAppProfile={updateProfile} />)} />
            <Route path="/signup" element={(<Signup updateAppProfile={updateProfile} />)} />
            <Route path="/modules" element={(<Modules profile={currUser} />)} />
            <Route path="/expanded-module" element={(<ExpandedModule profile={currUser} />)} />
            <Route path="/calendar" element={(<Calendar profile={currUser} />)} />
          </Routes>
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
