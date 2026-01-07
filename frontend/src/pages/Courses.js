import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import './Courses.css';

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await api.get('/courses');
      setCourses(response.data);
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
    <div className="courses-page">
      <h1>Tüm Kurslar</h1>
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
              <div className="course-meta">
                <span className="course-instructor">
                  Eğitmen: {course.instructor?.firstName} {course.instructor?.lastName}
                </span>
                {course.categories && course.categories.length > 0 && (
                  <div className="course-categories">
                    {course.categories.map((cat) => (
                      <span key={cat.id} className="category-tag">
                        {cat.name}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <Link to={`/course/${course.id}`} className="btn-view">
                Kursu Görüntüle
              </Link>
            </div>
          </div>
        ))}
      </div>
      {courses.length === 0 && (
        <div className="no-courses">Henüz kurs bulunmamaktadır</div>
      )}
    </div>
  );
};

export default Courses;

