import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import './CourseDetail.css';

const CourseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [showLessonForm, setShowLessonForm] = useState(false);
  const [lessonForm, setLessonForm] = useState({
    title: '',
    content: '',
    videoUrl: '',
    orderIndex: 0,
  });

  useEffect(() => {
    fetchCourse();
    fetchLessons();
    checkEnrollment();
  }, [id]);

  const fetchCourse = async () => {
    try {
      const response = await api.get(`/courses/${id}`);
      setCourse(response.data);
    } catch (error) {
      console.error('Error fetching course:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchLessons = async () => {
    try {
      const response = await api.get(`/lessons?courseId=${id}`);
      setLessons(response.data);
    } catch (error) {
      console.error('Error fetching lessons:', error);
    }
  };

  const checkEnrollment = async () => {
    if (user?.role === 'STUDENT') {
      try {
        const response = await api.get('/enrollments/my-enrollments');
        const enrolled = response.data.some(
          (enrollment) => enrollment.course.id === parseInt(id)
        );
        setIsEnrolled(enrolled);
      } catch (error) {
        console.error('Error checking enrollment:', error);
      }
    }
  };

  const handleEnroll = async () => {
    try {
      await api.post('/enrollments', { courseId: parseInt(id) });
      setIsEnrolled(true);
      alert('Kursa başarıyla kayıt oldunuz!');
    } catch (error) {
      alert(error.response?.data?.message || 'Kayıt olunamadı');
    }
  };

  const handleAddLesson = async (e) => {
    e.preventDefault();
    try {
      await api.post('/lessons', {
        ...lessonForm,
        courseId: parseInt(id),
      });
      setLessonForm({ title: '', content: '', videoUrl: '', orderIndex: 0 });
      setShowLessonForm(false);
      fetchLessons();
      alert('Ders başarıyla eklendi!');
    } catch (error) {
      alert(error.response?.data?.message || 'Ders eklenemedi');
    }
  };

  const handleDeleteLesson = async (lessonId) => {
    if (window.confirm('Bu dersi silmek istediğinize emin misiniz?')) {
      try {
        await api.delete(`/lessons/${lessonId}`);
        fetchLessons();
        alert('Ders başarıyla silindi!');
      } catch (error) {
        alert(error.response?.data?.message || 'Ders silinemedi');
      }
    }
  };

  if (loading) {
    return <div className="loading">Kurs yükleniyor...</div>;
  }

  if (!course) {
    return <div className="error">Kurs bulunamadı</div>;
  }

  const isInstructor = user?.role === 'INSTRUCTOR' && course.instructorId === user.id;
  const canViewLessons = isEnrolled || isInstructor;

  return (
    <div className="course-detail-page">
      <div className="course-header">
        {course.imageUrl && (
          <img src={course.imageUrl} alt={course.title} className="course-header-image" />
        )}
        <div className="course-header-content">
          <h1>{course.title}</h1>
          <p className="course-instructor">
            Eğitmen: {course.instructor?.firstName} {course.instructor?.lastName}
          </p>
          {course.description && <p className="course-description">{course.description}</p>}
          {user?.role === 'STUDENT' && !isEnrolled && (
            <button onClick={handleEnroll} className="btn-enroll">
              Kursa Kayıt Ol
            </button>
          )}
        </div>
      </div>

      {isInstructor && (
        <div className="instructor-actions">
          <button
            onClick={() => setShowLessonForm(!showLessonForm)}
            className="btn-add-lesson"
          >
            {showLessonForm ? 'İptal' : 'Ders Ekle'}
          </button>
        </div>
      )}

      {showLessonForm && (
        <div className="lesson-form-card">
          <h3>Yeni Ders Ekle</h3>
          <form onSubmit={handleAddLesson}>
            <div className="form-group">
              <label>Başlık *</label>
              <input
                type="text"
                value={lessonForm.title}
                onChange={(e) =>
                  setLessonForm({ ...lessonForm, title: e.target.value })
                }
                required
              />
            </div>
            <div className="form-group">
              <label>İçerik</label>
              <textarea
                value={lessonForm.content}
                onChange={(e) =>
                  setLessonForm({ ...lessonForm, content: e.target.value })
                }
                rows="5"
              />
            </div>
            <div className="form-group">
              <label>Video URL</label>
              <input
                type="url"
                value={lessonForm.videoUrl}
                onChange={(e) =>
                  setLessonForm({ ...lessonForm, videoUrl: e.target.value })
                }
              />
            </div>
            <div className="form-group">
              <label>Sıra Numarası</label>
              <input
                type="number"
                value={lessonForm.orderIndex}
                onChange={(e) =>
                  setLessonForm({ ...lessonForm, orderIndex: parseInt(e.target.value) })
                }
              />
            </div>
            <button type="submit" className="btn-primary">
              Ders Ekle
            </button>
          </form>
        </div>
      )}

      <div className="lessons-section">
        <h2>Dersler</h2>
        {!canViewLessons ? (
          <div className="lessons-locked">
            Dersleri görüntülemek için bu kursa kayıt olun
          </div>
        ) : lessons.length === 0 ? (
          <div className="no-lessons">Henüz ders bulunmamaktadır</div>
        ) : (
          <div className="lessons-list">
            {lessons.map((lesson) => (
              <div key={lesson.id} className="lesson-card">
                <div className="lesson-content">
                  <h3>{lesson.title}</h3>
                  {lesson.content && <p>{lesson.content}</p>}
                  {lesson.videoUrl && (
                    <a
                      href={lesson.videoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="lesson-video-link"
                    >
                      Videoyu İzle
                    </a>
                  )}
                </div>
                {isInstructor && (
                  <button
                    onClick={() => handleDeleteLesson(lesson.id)}
                    className="btn-delete"
                  >
                    Sil
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseDetail;

