import { useState } from 'react';
import { useAuth } from '../authentication/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

export default function RegisterForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [avatarFile, setAvatarFile] = useState(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (password !== confirmPassword) {
      setError('Пароли не совпадают');
      setIsLoading(false);
      return;
    }

    let avatarBase64 = '';
    if (avatarFile) {
      const reader = new FileReader();
      avatarBase64 = await new Promise((resolve) => {
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(avatarFile);
      });
    }

    const result = await register(email, password, name, avatarBase64);
    setIsLoading(false);

    if (result.success) {
      navigate('/');
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="auth-page-center">
      <h1 className="app-name">Worksy</h1>

      <div className="auth-card">
        <h2>Регистрация</h2>
        {error && <div className="error-box">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-field">
            <label>Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>

          <div className="form-field">
            <label>Пароль</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>

          <div className="form-field">
            <label>Повторите пароль</label>
            <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
          </div>

          <div className="form-field">
            <label>Ник</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>

          <div className="form-field">
            <label>Аватар (изображение)</label>
            <input type="file" accept="image/*" onChange={(e) => setAvatarFile(e.target.files[0])} />
          </div>

          <button type="submit" className="auth-submit" disabled={isLoading}>
            {isLoading ? 'Регистрация...' : 'Зарегистрироваться'}
          </button>
        </form>

        <p className="link-text">
          Уже есть аккаунт? <Link to="/login" className="unstyled-link">Войти</Link>
        </p>
      </div>
    </div>
  );
}
