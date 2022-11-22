import React from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.css';
import {
  Example,
  Default,
} from './pages';

import NavBar from './components/NavBar';

function App() {
  return (

    <div className="App">
      <NavBar />
      <Routes>
        <Route path="/example" element={(<Example />)} />
        <Route path="/" element={(<Default />)} />
      </Routes>
    </div>
  );
}

export default App;
