import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './Screen/Login';
import ProfileScreen from './Screen/ProfileScreen';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/profile" element={<ProfileScreen />} />
     

      </Routes>
    </Router>
  );
}

export default App;
