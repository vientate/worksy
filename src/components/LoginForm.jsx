// components/LoginForm.jsx
import { useState } from 'react';
import { useAuth } from '../authentication/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const result = await login(email, password);
    setIsLoading(false);

    if (result.success) {
      navigate('/welcome'); // ← здесь перенаправляем на страницу приветствия
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="auth-page-center">
      <h1 className="app-name">Worksy</h1>

      <div className="auth-card">
        <h2>Вход</h2>
        {error && <div className="error-box">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-field">
            <label>Email</label>
            <input
              type="email"
              placeholder="example@mail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-field">
            <label>Пароль</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="auth-submit" disabled={isLoading}>
            {isLoading ? 'Вход...' : 'Войти'}
          </button>
        </form>

        <p className="link-text">
          Ещё нет аккаунта? <Link to="/register" className="unstyled-link">Зарегистрируйтесь</Link>
        </p>
      </div>
    </div>
  );
}
