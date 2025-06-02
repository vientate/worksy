// controllers/authController.js

import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import pool from '../db.js';

// ✅ Регистрация
export const register = async (req, res) => {
  const { email, password, role = 'participant' } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const query = 'INSERT INTO users (email, password, role) VALUES ($1, $2, $3) RETURNING id, email, role';
    const values = [email, hashedPassword, role];
    const result = await pool.query(query, values);
    res.status(201).json({ user: result.rows[0] });
  } catch (error) {
    if (error.code === '23505') {
      return res.status(400).json({ message: 'Email already exists' });
    }
    console.error('❌ Ошибка в register():', error);
    res.status(500).json({ message: 'Server error', error_text: error });
  }
};
/*
// ✅ Логин
export const login = async (req, res) => {
  const { email, password: rawPassword } = req.body;
  const password = String(rawPassword || '');

  try {
    console.log('📥 Попытка входа:', email, password);

    if (!email || !password) {
      return res.status(400).json({ message: 'Email и пароль обязательны' });
    }

    const query = 'SELECT * FROM users WHERE email = $1';
    const result = await pool.query(query, [email]);

    if (result.rows.length === 0) {
      console.log('⚠️ Пользователь не найден');
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const user = result.rows[0];

    // ✅ Сравнение с хэшированным паролем
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      console.log('⚠️ Пароль не совпадает');
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    if (!process.env.JWT_SECRET) {
      console.error('❌ JWT_SECRET не задан в .env');
      return res.status(500).json({ message: 'JWT secret not configured' });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    console.log('✅ Успешный вход');
    res.json({ token });
  } catch (error) {
    console.error('❌ Ошибка в login():', error);
    res.status(500).json({ message: 'Server error' });
  }
};
*/
// ✅ Получение профиля
export const getProfile = async (req, res) => {
  try {
    const query = 'SELECT id, email, role, nickname FROM users WHERE id = $1';
    const result = await pool.query(query, [req.user.id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ user: result.rows[0] });
  } catch (error) {
    console.error('❌ Ошибка в getProfile():', error);
    res.status(500).json({ message: 'Server error' });
  }
};


// ✅ Логин с расширенной диагностикой
export const login = async (req, res) => {
  const { email, password: rawPassword } = req.body;
  const password = String(rawPassword || '');
  

  try {
    console.log('📥 Попытка входа:', { email, passwordLength: password.length });

    // Проверка входных данных
    if (!email || !password) {
      console.log('❌ Отсутствует email или пароль');
      return res.status(400).json({ 
        message: 'Email и пароль обязательны',
        received: { email, hasPassword: !!password }
      });
    }

    // Поиск пользователя
    const query = 'SELECT * FROM users WHERE email = $1';
    const result = await pool.query(query, [email]);
    console.log('🔍 Найдено пользователей:', result.rows.length);

    if (result.rows.length === 0) {
      console.log('⚠️ Пользователь не найден для email:', email);
      return res.status(401).json({ 
        message: 'Invalid credentials',
        suggestion: 'Проверьте email или зарегистрируйтесь'
      });
    }

    const user = result.rows[0];
    console.log('👤 Найден пользователь:', { 
      id: user.id, 
      email: user.email,
      passwordHash: user.password ? '***' : 'NULL'
    });

    // Сравнение паролей
    console.log('🔐 Сравнение паролей...');
    const isMatch = await bcrypt.compare(password, user.password);
    
    console.log("passwd: ", password);
    console.log("bdpswd: ", user.password);
    console.log('🔑 Результат сравнения:', isMatch);

    if (!isMatch) {
      console.log('⚠️ Неверный пароль для пользователя:', email);
      return res.status(401).json({ 
        message: 'Invalid credentials',
        suggestion: 'Проверьте правильность пароля'
      });
    }

    // Генерация токена
    if (!process.env.JWT_SECRET) {
      console.error('❌ Критическая ошибка: JWT_SECRET не задан');
      return res.status(500).json({ 
        message: 'Server configuration error',
        details: 'JWT secret not configured'
      });
    }

    const tokenPayload = { 
      id: user.id, 
      role: user.role,
      email: user.email
    };
    
    const token = jwt.sign(
      tokenPayload,
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    console.log('✅ Успешный вход для пользователя:', {
      id: user.id,
      email: user.email,
      tokenExpiresIn: '1h'
    });

    res.json({ 
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('❌ Критическая ошибка в login():', {
      message: error.message,
      stack: error.stack,
      fullError: JSON.stringify(error, Object.getOwnPropertyNames(error))
    });
    res.status(500).json({ 
      message: 'Server error',
      error: error.message,
      code: error.code
    });
  }
};