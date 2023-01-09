import React from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.css';
import {
  Example,
  Default,
  Login,
  MessageWall,
  Signup,
  Modules,
  Calendar,
  ExpandedModule,
} from './pages';

import NavBar from './components/NavBar';

function App() {
  const profile = {
    email: 'test@google.com',
    firstName: 'Bob',
    lastName: 'Smith',
    password: 'asdf',
    role: 'Caregiver',
    serviceArea: '',
    username: 'asdf',
  };

  return (
    profile
      ? (
        <div className="App">
          <NavBar />
          <Routes>
            <Route path="/" element={(<Default profile={profile} />)} />
            <Route path="/message-wall" element={(<MessageWall profile={profile} />)} />
            <Route path="/example" element={(<Example profile={profile} />)} />
            <Route path="/login" element={(<Login profile={profile} />)} />
            <Route path="/signup" element={(<Signup profile={profile} />)} />
            <Route path="/modules" element={(<Modules profile={profile} />)} />
            <Route path="/expanded-module" element={(<ExpandedModule profile={profile} />)} />
            <Route path="/calendar" element={(<Calendar profile={profile} />)} />
          </Routes>
        </div>
      )
      : (
        <div className="App">
          <NavBar />
          <Routes>
            <Route path="/" element={(<Default />)} />
            <Route path="/login" element={(<Login />)} />
            <Route path="/signup" element={(<Signup />)} />
          </Routes>
        </div>
      )

  );
}

export default App;
