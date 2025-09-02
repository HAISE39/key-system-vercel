import pool from '../../utils/database';

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).end();
  
  const result = await pool.query(
    'SELECT * FROM keys ORDER BY created_at DESC'
  );

  res.status(200).json(result.rows);
}
