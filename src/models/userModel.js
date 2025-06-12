//models/userModel.js
const db = require('../db');

async function findUserByEmail(email) {
  const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);
  return result.rows[0];
}

async function createUser({ email, password, role, nickname }) {
  const result = await db.query(
    `INSERT INTO users (email, password, role, nickname)
     VALUES ($1, $2, $3, $4) RETURNING id, email, role, nickname`,
    [email, password, role, nickname]
  );
  return result.rows[0];
}

module.exports = {
  findUserByEmail,
  createUser,
};
