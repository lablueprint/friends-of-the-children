import { React, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.css';
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
  const [profile, setProfile] = useState(null);

  // const { password: profilePassword, ...userProfile } = profile; // peform destruction to get profile w/o password

  // this functions props allow us to change the state in app.jsx from children components
  // Note: consider using "Context" for consistency throughout the app,
  // and might alse need cookies so that user stays logged after refreshing the page
  const updateProfile = (newProfile) => {
    setProfile(newProfile);
  };

  return (
    profile
      ? (
        <div className="App">
          <NavBar profile={profile} updateAppProfile={updateProfile} />
          <Routes>
            <Route path="/" element={(<Modules profile={profile} />)} />
            <Route path="/profile" element={(<UserProfile profile={profile} updateAppProfile={updateProfile} />)} />
            <Route path="/message-wall" element={(<MessageWall profile={profile} />)} />
            <Route path="/example" element={(<Example profile={profile} />)} />
            <Route path="/login" element={(<Login updateAppProfile={updateProfile} />)} />
            <Route path="/signup" element={(<Signup updateAppProfile={updateProfile} />)} />
            <Route path="/modules" element={(<Modules profile={profile} />)} />
            <Route path="/expanded-module" element={(<ExpandedModule profile={profile} />)} />
            <Route path="/calendar" element={(<Calendar profile={profile} />)} />
          </Routes>
        </div>
      )
      : (
        <div className="App">
          <NavBar profile={profile} updateAppProfile={updateProfile} />
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
