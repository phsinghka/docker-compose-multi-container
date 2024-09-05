const express = require('express');
const mysql = require('mysql');
const app = express();

const db = mysql.createConnection({
  host: process.env.DB_HOST || 'db',
  user: process.env.DB_USER || 'user',
  password: process.env.DB_PASSWORD || 'userpass',
  database: process.env.DB_NAME || 'mydb'
});

const retryInterval = 5000;  // Time to wait before retrying connection

// Attempt to connect to the database with retry logic
const connectWithRetry = () => {
  console.log('Attempting to connect to the database...');
  db.connect(err => {
    if (err) {
      console.error('Error connecting to the database, retrying in 5 seconds...', err);
      setTimeout(connectWithRetry, retryInterval); // Retry after 5 seconds
    } else {
      console.log('Connected to MySQL database');
    }
  });
};

connectWithRetry();

// Basic route
app.get('/', (req, res) => {
  db.query('SELECT 1 + 1 AS solution', (err, result) => {
    if (err) {
      console.error('Query error:', err);
      res.status(500).send('Database query error');
    } else {
      res.send(`The solution is: ${result[0].solution}`);
    }
  });
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
