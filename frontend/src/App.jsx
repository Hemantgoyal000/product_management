import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '../context/authContext';
import Login from './components/Login';
import Products from './components/Products';
import Navbar from './components/Navbar';
import ProtectedRoutes from "./components/ProtectedRoutes";
import './index.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <div className="container">
          <Routes>
            <Route path="/login" element={<Login/>} />
            <Route 
              path="/products" 
              element={
                <ProtectedRoutes>
                  <Products/>
                </ProtectedRoutes>
              } 
            />
            <Route path="/" element={<Navigate to="/login" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;