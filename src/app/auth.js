const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Path to users.json
const usersFilePath = path.join(__dirname, 'users.json');

// Helper function to read users from the JSON file
const readUsers = () => {
  try {
    const data = fs.readFileSync(usersFilePath, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Error reading users.json:', err);
    return []; // Return an empty array if the file is missing or invalid
  }
};

// Helper function to write users to the JSON file
const writeUsers = (users) => {
  try {
    fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));
  } catch (err) {
    console.error('Error writing to users.json:', err);
  }
};

// Login endpoint
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;

  // Read users from the JSON file
  const users = readUsers();

  // Find user by email
  const user = users.find((u) => u.email === email);
  if (!user) {
    return res.status(400).json({ message: 'User not found.' });
  }

  // Check password
  const isPasswordValid = bcrypt.compareSync(password, user.password);
  if (!isPasswordValid) {
    return res.status(400).json({ message: 'Invalid password.' });
  }

  // Generate JWT token
  const token = jwt.sign({ id: user.id, role: user.role }, 'your_jwt_secret_key', {
    expiresIn: '1h', // Token expires in 1 hour
  });

  res.json({ token });
});

// Register endpoint (optional)
app.post('/api/auth/register', (req, res) => {
  const { email, password, role } = req.body;

  // Read users from the JSON file
  const users = readUsers();

  // Check if user already exists
  const existingUser = users.find((u) => u.email === email);
  if (existingUser) {
    return res.status(400).json({ message: 'User already exists.' });
  }

  // Hash the password
  const hashedPassword = bcrypt.hashSync(password, 8);

  // Create new user
  const newUser = {
    id: users.length + 1,
    email,
    password: hashedPassword,
    role: role || 'user', // Default role is 'user'
  };

  // Add the new user to the JSON file
  users.push(newUser);
  writeUsers(users);

  res.status(201).json({ message: 'User registered successfully.' });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});