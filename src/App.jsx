// src/App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider } from './authentication/AuthContext';
import { PrivateRoute } from './authentication/PrivateRoute';
import WelcomePage from './pages/WelcomePage';
import CalendarPage from './pages/CalendarPage';
import TasksPage from './pages/TasksPage';
import ProfilePage from './pages/ProfilePage';
import ProjectsPage from './pages/ProjectsPage'; // 👈 добавлено
import LoginForm from './components/LoginForm';
import RegisterPage from './pages/RegisterPage';
import Sidebar from './components/Sidebar';
import './styles.css';

function AppContent() {
  const location = useLocation();
  const hideSidebar = location.pathname === '/login' || location.pathname === '/register';

  return (
    <div style={{ display: 'flex' }}>
      {!hideSidebar && <Sidebar />}
      <div style={{ flex: 1 }}>
        <Routes>
          {/* Публичные маршруты */}
          <Route path="/login" element={<LoginForm />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Редирект с "/" на "/welcome" */}
          <Route path="/" element={<Navigate to="/welcome" replace />} />

          {/* Приватные маршруты */}
          <Route
            path="/welcome"
            element={
              <PrivateRoute>
                <WelcomePage />
              </PrivateRoute>
            }
          />
          <Route
            path="/calendar"
            element={
              <PrivateRoute>
                <CalendarPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/tasks"
            element={
              <PrivateRoute>
                <TasksPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <ProfilePage />
              </PrivateRoute>
            }
          />
          <Route
            path="/projects" // 👈 добавлен маршрут
            element={
              <PrivateRoute>
                <ProjectsPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <PrivateRoute roles={['admin']}>
                <div style={{ padding: '20px' }}>
                  <h1>Admin Dashboard</h1>
                  <p>This is only visible to admins</p>
                </div>
              </PrivateRoute>
            }
          />
        </Routes>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;
