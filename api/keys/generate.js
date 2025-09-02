import pool from '../../utils/database';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  
  const { count } = req.body;
  const keys = [];

  for (let i = 0; i < count; i++) {
    const key = 'VLX-' + Math.random().toString(36).substring(2, 10).toUpperCase();
    keys.push(key);
    await pool.query(
      'INSERT INTO keys (key_value) VALUES ($1)',
      [key]
    );
  }

  res.status(200).json({ keys });
}
