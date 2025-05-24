import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db from '../db.js';

const router = express.Router();

// Register a new user enpoint /auth/register
router.post('/register', (req, res) => {
  const { username, password } = req.body;
  // hash the user's password
  const hashPassword = bcrypt.hashSync(password, 8);

  // register the new user into the database
  try {
    const insertUser = db.prepare(
      `INSERT INTO users (username, password) VALUES (?, ?)`,
    );
    const result = insertUser.run(username, hashPassword);
    const userID = result.lastInsertRowid;

    // give the new user a default todo
    const defaultTodo = `Hello ${username} :) Add your first todo`;
    const insertTodo = db.prepare(
      `INSERT INTO todos (user_id, task) VALUES (?, ?)`,
    );

    insertTodo.run(userID, defaultTodo);

    // create a token
    const token = jwt.sign({ id: userID }, process.env.JWT_SECRET, {
      expiresIn: '24h',
    });
    res.json({ token });
  } catch (err) {
    console.log(err.message);
    res.sendStatus(503);
  }
});

router.post('/login', (req, res) => {
  const { username, password } = req.body;
  try {
    const getUser = db.prepare('SELECT * FROM users WHERE username = ?');
    const user = getUser.get(username);
    if (!user) {
      return res.status(404).send({ message: 'User not Found' });
    }
    const isPasswordValid = bcrypt.compareSync(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).send({ message: 'Incorrect Password!' });
    }
    console.log(user);
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: '24h',
    });
    res.json({ token });
  } catch (err) {
    console.log(err);
    res.sendStatus(503);
  }
});

export default router;
