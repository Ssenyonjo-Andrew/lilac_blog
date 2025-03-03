const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

const usersFilePath = path.join(__dirname, 'users.json');

const readUsers = () => {
  try {
    const data = fs.readFileSync(usersFilePath, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Error reading users.json:', err);
    return [];
  }
};

const writeUsers = (users) => {
  try {
    fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));
  } catch (err) {
    console.error('Error writing to users.json:', err);
  }
};

const users = readUsers();
users.forEach(user => {
  if (!user.password.startsWith('$2a$')) { // Check if the password is already hashed
    user.password = bcrypt.hashSync(user.password, 8);
  }
});
writeUsers(users);

console.log('Passwords hashed successfully.');