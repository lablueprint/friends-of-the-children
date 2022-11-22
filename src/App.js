import React from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.css';
import {
  Example,
  Default,
  Login,
  MessageWall,
<<<<<<< HEAD
  Signup,
=======
  Modules,
>>>>>>> main
} from './pages';

import NavBar from './components/NavBar';

function App() {
  return (

    <div className="App">
      <NavBar />
      <Routes>
        <Route path="/message-wall" element={(<MessageWall />)} />
        <Route path="/example" element={(<Example />)} />
        <Route path="/" element={(<Default />)} />
<<<<<<< HEAD
        <Route path="/login" element={(<Login />)} />
        <Route path="/signup" element={(<Signup />)} />
=======
        <Route path="/modules" element={(<Modules />)} />
>>>>>>> main
      </Routes>
    </div>
  );
}

export default App;
