import pool from '../../utils/database';

export default async function handler(req, res) {
  const { key } = req.query;
  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

  // Cek key di database
  const result = await pool.query(
    `SELECT * FROM keys 
     WHERE key_value = $1 
     AND is_used = FALSE 
     AND expires_at > NOW()`,
    [key]
  );

  if (result.rows.length === 0) {
    await pool.query(
      'INSERT INTO key_logs (key_id, user_ip, status) VALUES (NULL, $1, $2)',
      [ip, 'invalid']
    );
    return res.status(404).send('Key tidak valid');
  }

  // Tandai sebagai digunakan
  await pool.query(
    'UPDATE keys SET is_used = TRUE, user_ip = $1, used_at = NOW() WHERE key_value = $2',
    [ip, key]
  );

  // Log akses valid
  await pool.query(
    'INSERT INTO key_logs (key_id, user_ip, status) VALUES ($1, $2, $3)',
    [result.rows[0].id, ip, 'valid']
  );

  res.setHeader('Content-Type', 'text/plain');
  res.send(key);
}
