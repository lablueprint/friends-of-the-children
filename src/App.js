import React from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.css';
import {
  Example,
  Default,
  Modules,
} from './pages';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/example" element={(<Example />)} />
        <Route path="/" element={(<Default />)} />
        <Route path="/modules" element={(<Modules />)} />
      </Routes>
    </div>
  );
}

export default App;
