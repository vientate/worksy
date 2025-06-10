// controllers/authController.js
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import pool from '../db.js';

// ✅ Регистрация
export const register = async (req, res) => {
  const { email, password, nickname = '', role = 'participant', avatar = '' } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const query = 'INSERT INTO users (email, password, role, nickname, avatar) VALUES ($1, $2, $3, $4, $5) RETURNING id, email, role, nickname, avatar';
    const values = [email, hashedPassword, role, nickname, avatar];
    const result = await pool.query(query, values);

    const user = result.rows[0];

    if (!process.env.JWT_SECRET) {
      return res.status(500).json({ message: 'JWT secret not configured' });
    }

    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: '1h'
    });

    res.status(201).json({ token, user });
  } catch (error) {
    if (error.code === '23505') {
      return res.status(400).json({ message: 'Email already exists' });
    }
    console.error('❌ Ошибка в register():', error);
    res.status(500).json({ message: 'Server error', error_text: error });
  }
};

// ✅ Логин
export const login = async (req, res) => {
  const { email, password: rawPassword } = req.body;
  const password = String(rawPassword || '');

  try {
    if (!email || !password) {
      return res.status(400).json({
        message: 'Email и пароль обязательны',
        received: { email, hasPassword: !!password }
      });
    }

    const query = 'SELECT * FROM users WHERE email = $1';
    const result = await pool.query(query, [email]);

    if (result.rows.length === 0) {
      return res.status(401).json({
        message: 'Invalid credentials',
        suggestion: 'Проверьте email или зарегистрируйтесь'
      });
    }

    const user = result.rows[0];

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        message: 'Invalid credentials',
        suggestion: 'Проверьте правильность пароля'
      });
    }

    if (!process.env.JWT_SECRET) {
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

    const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, {
      expiresIn: '1h'
    });

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        nickname: user.nickname,
        avatar: user.avatar
      }
    });
  } catch (error) {
    console.error('❌ Критическая ошибка в login():', error);
    res.status(500).json({
      message: 'Server error',
      error: error.message
    });
  }
};

// ✅ Получение профиля
export const getProfile = async (req, res) => {
  try {
    const query = 'SELECT id, email, role, nickname, avatar FROM users WHERE id = $1';
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

// ✅ Обновление профиля
export const updateProfile = async (req, res) => {
  const { nickname, avatar } = req.body;

  try {
    const query =
      'UPDATE users SET nickname = $1, avatar = $2 WHERE id = $3 RETURNING id, email, role, nickname, avatar';
    const values = [nickname, avatar, req.user.id];
    const result = await pool.query(query, values);

    res.json({ user: result.rows[0] });
  } catch (error) {
    console.error('❌ Ошибка в updateProfile():', error);
    res.status(500).json({ message: 'Ошибка обновления профиля' });
  }
};
