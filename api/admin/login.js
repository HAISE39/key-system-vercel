import bcrypt from 'bcryptjs';
import pool from '../../utils/database';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  const { username, password } = req.body;

  const result = await pool.query(
    'SELECT * FROM admins WHERE username = $1',
    [username]
  );

  if (result.rows.length === 0) {
    return res.status(401).json({ error: 'Admin tidak ditemukan' });
  }

  const valid = await bcrypt.compare(password, result.rows[0].password_hash);
  if (!valid) return res.status(401).json({ error: 'Password salah' });

  res.status(200).json({ message: 'Login berhasil' });
}
