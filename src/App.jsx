import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './authentication/AuthContext';
import { PrivateRoute } from './authentication/PrivateRoute';
import Navbar from './components/Navbar';
import DashboardPage from './pages/DashboardPage';
import LoginForm from './components/LoginForm';       // <-- сюда
import RegisterPage from './pages/RegisterPage';
import WelcomePage from './pages/WelcomePage';
import './styles.css';

function AppContent() {
  const location = useLocation();

  const hideNavbar = location.pathname === '/login' || location.pathname === '/register';

  return (
    <div className="App">
      {!hideNavbar && <Navbar />}
      <Routes>
        <Route path="/login" element={<LoginForm />} />   {/* Используем LoginForm */}
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/welcome" element={<WelcomePage />} />

        <Route
          path="/"
          element={
            <PrivateRoute>
              <DashboardPage />
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
