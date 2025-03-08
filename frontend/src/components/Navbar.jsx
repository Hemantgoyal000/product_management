import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/authContext';

const Navbar = () => {
  const { isAuthenticated, logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">E-Commerce App</Link>
      </div>
      <div className="navbar-menu">
        {isAuthenticated ? (
          <>
            <span className="welcome-text">Welcome, {user?.username}</span>
            <Link to="/products" className="navbar-item">Products</Link>
            <button onClick={handleLogout} className="logout-button">
              Logout
            </button>
          </>
        ) : (
          <Link to="/login" className="navbar-item">Login</Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;