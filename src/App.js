import React from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.css';
import {
  Example,
  Default,
  Login,
  Signup,
} from './pages';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/example" element={(<Example />)} />
        <Route path="/" element={(<Default />)} />
        <Route path="/login" element={(<Login />)} />
        <Route path="/signup" element={(<Signup />)} />
      </Routes>
    </div>
  );
}

export default App;
