import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

async function fetchUser() {
  try {
    const res = await fetch('http://localhost:3000/auth/profile', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });

    if (!res.ok) throw new Error('Failed to fetch user');

    const data = await res.json();
    return data.user;
  } catch (error) {
    console.error('Fetch user error:', error);
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUserState] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));

  useEffect(() => {
    if (token) {
      fetchUser().then(userData => {
        if (userData) {
          const storedCompanyId = localStorage.getItem('selectedCompanyId');
          const initialCompanyId = storedCompanyId || (userData.companies?.[0]?.id ?? null);

          const user = {
            name: userData.nickname,
            email: userData.email,
            role: userData.role,
            id: userData.id,
            avatar: userData.avatar,
            companies: userData.companies || [],
            selectedCompanyId: initialCompanyId
          };

          setUser(user);
        } else {
          setUser(null);
        }
      });
    } else {
      setUser(null);
    }
  }, [token]);

  function setUser(newUser) {
    setUserState(newUser);
    if (newUser?.selectedCompanyId) {
      localStorage.setItem('selectedCompanyId', newUser.selectedCompanyId);
    }
  }

  async function login(email, password) {
    if (!email || !password || email.trim() === '' || password.trim() === '') {
      return {
        success: false,
        message: 'Email и пароль обязательны'
      };
    }

    try {
      const res = await fetch('http://localhost:3000/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem('token', data.token);
        setToken(data.token);

        const userData = await fetchUser();

        if (userData) {
          const selectedCompanyId = userData.companies?.[0]?.id ?? null;
          localStorage.setItem('selectedCompanyId', selectedCompanyId);

          setUser({
            name: userData.nickname,
            email: userData.email,
            role: userData.role,
            id: userData.id,
            avatar: userData.avatar,
            companies: userData.companies || [],
            selectedCompanyId
          });
        }

        return { success: true };
      } else {
        return {
          success: false,
          message: data.message || 'Ошибка авторизации'
        };
      }
    } catch (e) {
      console.error('Ошибка при входе:', e);
      return {
        success: false,
        message: 'Сервер недоступен. Проверьте подключение.'
      };
    }
  }

  async function register(email, password, name, avatar = '') {
    if (!email || !password || !name) {
      return {
        success: false,
        message: 'Email, имя и пароль обязательны'
      };
    }

    try {
      const res = await fetch('http://localhost:3000/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          password,
          nickname: name,
          avatar
        })
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem('token', data.token);
        setToken(data.token);

        const selectedCompanyId = data.user.companies?.[0]?.id ?? null;
        localStorage.setItem('selectedCompanyId', selectedCompanyId);

        setUser({
          name: data.user.nickname,
          email: data.user.email,
          role: data.user.role,
          id: data.user.id,
          avatar: data.user.avatar,
          companies: data.user.companies || [],
          selectedCompanyId
        });

        return { success: true };
      } else {
        return {
          success: false,
          message: data.message || 'Ошибка регистрации'
        };
      }
    } catch (e) {
      console.error('Ошибка при регистрации:', e);
      return {
        success: false,
        message: 'Сервер недоступен. Проверьте подключение.'
      };
    }
  }

  function logout() {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('selectedCompanyId');
  }

  return (
    <AuthContext.Provider value={{ user, token, login, logout, register, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
