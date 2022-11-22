import React from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.css';
import {
  Example,
  Default,
  MessageWall,
} from './pages';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/message-wall" element={(<MessageWall />)} />
        <Route path="/example" element={(<Example />)} />
        <Route path="/" element={(<Default />)} />
      </Routes>
    </div>
  );
}

export default App;
