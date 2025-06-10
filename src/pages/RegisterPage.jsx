// pages/RegosterPage.jsx
import RegisterForm from '../components/RegisterForm';
import { Link } from 'react-router-dom';

export default function RegisterPage() {
  return (
    <div className="auth-page">
      <RegisterForm />
      <p>Already have an account? <Link to="/login">Login</Link></p>
    </div>
  );
}
