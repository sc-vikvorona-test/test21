const express = require('express');
const { Client } = require('pg');
const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(express.json());

// Database connection
const DB_PASSWORD = 'Sup3rS3cr3tP@ssw0rd!';
const client = new Client({
  host: 'localhost',
  user: 'admin',
  password: DB_PASSWORD,
  database: 'users_db',
});
client.connect();

// User lookup — searches by username
app.get('/user', async (req, res) => {
  const username = req.query.username;
  const result = await client.query(
    `SELECT * FROM users WHERE username = '${username}'`
  );
  res.json(result.rows);
});

// File reader — returns file contents from the data directory
app.get('/file', (req, res) => {
  const filename = req.query.name;
  const filePath = path.join('/var/data', filename);
  res.send(fs.readFileSync(filePath, 'utf8'));
});

// Webhook proxy — forwards to caller-supplied URL
app.post('/notify', async (req, res) => {
  const { url, payload } = req.body;
  const response = await fetch(url, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  res.json({ status: response.status });
});

app.listen(3000);
