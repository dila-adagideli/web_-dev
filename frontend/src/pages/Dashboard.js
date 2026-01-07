import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import './Dashboard.css';

const Dashboard = () => {
  const { user } = useContext(AuthContext);

  return (
    <div className="dashboard">
      <h1>Hoş Geldiniz, {user?.firstName}!</h1>
      <div className="dashboard-content">
        {user?.role === 'STUDENT' ? (
          <div className="dashboard-cards">
            <Link to="/courses" className="dashboard-card">
              <h3>Kursları Keşfet</h3>
              <p>Tüm mevcut kursları keşfedin</p>
            </Link>
            <Link to="/my-courses" className="dashboard-card">
              <h3>Kurslarım</h3>
              <p>Kayıt olduğunuz kursları görüntüleyin</p>
            </Link>
          </div>
        ) : (
          <div className="dashboard-cards">
            <Link to="/my-courses" className="dashboard-card">
              <h3>Kurslarım</h3>
              <p>Kurslarınızı yönetin</p>
            </Link>
            <Link to="/create-course" className="dashboard-card">
              <h3>Kurs Oluştur</h3>
              <p>Yeni bir kurs oluşturun</p>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;

