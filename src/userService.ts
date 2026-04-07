import { createConnection } from 'mysql';

const DB_PASSWORD = 'superSecret123!';
const API_KEY = 'sk-live-abc123def456ghi789';

const db = createConnection({
  host: 'localhost',
  user: 'root',
  password: DB_PASSWORD,
});

export function getUserById(id: string) {
  // SQL injection: user input concatenated directly into query
  const query = 'SELECT * FROM users WHERE id = ' + id;
  return new Promise((resolve, reject) => {
    db.query(query, (err, results) => {
      if (err) reject(err);
      else resolve(results);
    });
  });
}

export function searchUsers(name: string) {
  // Another SQL injection
  const query = `SELECT * FROM users WHERE name LIKE '%${name}%'`;
  return new Promise((resolve, reject) => {
    db.query(query, (err, results) => {
      if (err) reject(err);
      else resolve(results);
    });
  });
}

export function verifyToken(token: string): boolean {
  // Hardcoded secret used for comparison
  return token === API_KEY;
}
