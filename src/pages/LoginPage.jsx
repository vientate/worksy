import { useNavigate } from 'react-router-dom';
import { useAuth } from '../authentication/AuthContext';
import { useState } from 'react';

export default function LoginPage() {
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
      navigate('/welcome');  // перенаправление сюда
    } else {
      setError(result.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* твоя форма */}
    </form>
  );
}
