import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import Logo from './Logo';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/dashboard" className="navbar-brand">
          <Logo />
        </Link>
        {user && (
          <div className="navbar-menu">
            <Link to="/dashboard" className="navbar-link">
              Ana Sayfa
            </Link>
            {user.role === 'STUDENT' ? (
              <>
                <Link to="/courses" className="navbar-link">
                  Tüm Kurslar
                </Link>
                <Link to="/my-courses" className="navbar-link">
                  Kurslarım
                </Link>
              </>
            ) : (
              <>
                <Link to="/my-courses" className="navbar-link">
                  Kurslarım
                </Link>
                <Link to="/create-course" className="navbar-link">
                  Kurs Oluştur
                </Link>
              </>
            )}
            <span className="navbar-user">
              {user.firstName} {user.lastName} ({user.role === 'STUDENT' ? 'Öğrenci' : 'Eğitmen'})
            </span>
            <button onClick={handleLogout} className="navbar-button">
              Çıkış Yap
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

