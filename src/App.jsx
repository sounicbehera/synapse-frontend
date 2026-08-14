import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingAuthPage from './pages/LandingAuthPage';
import ChatPage from './pages/ChatPage';

function App() {
  const isAuthenticated = () => {
    return localStorage.getItem("userInfo") !== null;
  };

  return (
    <Router>
      <Routes>
        {/* Gateways Entry Point */}
        <Route 
          path="/" 
          element={isAuthenticated() ? <Navigate to="/chats" /> : <LandingAuthPage />} 
        />
        {/* Core Chat Viewport */}
        <Route 
          path="/chats" 
          element={isAuthenticated() ? <ChatPage /> : <Navigate to="/" />} 
        />
      </Routes>
    </Router>
  );
}

export default App;
