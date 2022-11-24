import React from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.css';
import {
  Example,
  Default,
  MessageWall,
  Modules,
  Calendar,
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
        <Route path="/modules" element={(<Modules />)} />
        <Route path="/calendar" element={(<Calendar />)} />
      </Routes>
    </div>
  );
}

export default App;
