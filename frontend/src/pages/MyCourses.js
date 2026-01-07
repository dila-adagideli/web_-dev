import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import './MyCourses.css';

const MyCourses = () => {
  const { user } = useContext(AuthContext);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyCourses();
  }, []);

  const fetchMyCourses = async () => {
    try {
      if (user?.role === 'INSTRUCTOR') {
        const response = await api.get('/courses/my-courses');
        setCourses(response.data);
      } else {
        const response = await api.get('/enrollments/my-enrollments');
        setCourses(response.data.map((enrollment) => enrollment.course));
      }
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Kurslar yükleniyor...</div>;
  }

  return (
    <div className="my-courses-page">
      <h1>{user?.role === 'INSTRUCTOR' ? 'Oluşturduğum Kurslar' : 'Kayıt Olduğum Kurslar'}</h1>
      <div className="courses-grid">
        {courses.map((course) => (
          <div key={course.id} className="course-card">
            <div className="course-image">
              {course.imageUrl ? (
                <img src={course.imageUrl} alt={course.title} />
              ) : (
                <div className="course-image-placeholder">Resim Yok</div>
              )}
            </div>
            <div className="course-content">
              <h3>{course.title}</h3>
              <p className="course-description">
                {course.description || 'Açıklama mevcut değil'}
              </p>
              {user?.role === 'INSTRUCTOR' && (
                <div className="course-stats">
                  <span>Dersler: {course.lessons?.length || 0}</span>
                </div>
              )}
              <Link to={`/course/${course.id}`} className="btn-view">
                Kursu Görüntüle
              </Link>
            </div>
          </div>
        ))}
      </div>
      {courses.length === 0 && (
        <div className="no-courses">
          {user?.role === 'INSTRUCTOR'
            ? 'Henüz kurs oluşturmadınız'
            : 'Henüz hiçbir kursa kayıt olmadınız'}
        </div>
      )}
    </div>
  );
};

export default MyCourses;

