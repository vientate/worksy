// src/authentication/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';


const AuthContext = createContext();

async function fetchUser(){
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
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));

  useEffect(() => {
    if (token) {
      // TODO: Реальный fetch на /auth/profile
      /*setUser({ name: 'Наталья', role: 'admin', id: 'user-1' }); // временно*/




      setUser({name: 'user', role:'' ,id: 'user-1'})
    } else {
      setUser(null);
    }
  }, [token]);

  async function login(email, password) {
    // Проверка на null/undefined/пустую строку
    if (!email || !password || email.trim() === '' || password.trim() === '') {
      return { 
        success: false, 
        message: 'Email и пароль обязательны' 
      };
    }

    try {
      console.log('Отправка данных на сервер:', { email, password }); // Логирование

      const res = await fetch('http://localhost:3000/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
        email: String(email), 
        password: String(password),  // Явное преобразование
        
        }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem('token', data.token);
        setToken(data.token);
        const userData = await fetchUser(); // Получаем данные пользователя
        setUser(userData);
        setUser({name: userData.nickname, role:userData.role ,id: 'user-1'})
        // setUser({ name: user.name, role: user.role || '', id: 'user-1' }); // временно
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

  async function register(email, password, name)
{
  if (!email || !password || email.trim() === '' || password.trim() === '' || name.trim() === '' || !name) {
      return { 
        success: false, 
        message: 'Email и пароль обязательны' 
      };
    }

    try {
      console.log('Отправка данных на сервер:', { email, password }); // Логирование

      const res = await fetch('http://localhost:3000/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
        email: String(email), 
        password: String(password),  // Явное преобразование
        nickname: String(name)
        }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem('token', data.token);
        setToken(data.token);
        setUser({ name: name, role: 'participant', id: 'user-1' }); // временно
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

  function logout() {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
  }

  return (
    <AuthContext.Provider value={{ user, token, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
}
 


export function useAuth() {
  return useContext(AuthContext);
}