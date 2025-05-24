import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db from '../db.js';

const router = express.Router();

// get all todos for logged-in user
router.get('/', (req, res) => {
  const getTodos = db.prepare('SELECT * FROM todos where user_id = ?');
  const todosList = getTodos.all(req.userId);
  res.json(todosList);
});

// create a new todo
router.post('/', (req, res) => {
  const { task } = req.body;
  const insertTodo = db.prepare(
    `INSERT INTO todos (user_id, task) VALUES (?, ?)`,
  );
  const result = insertTodo.run(req.userId, task);
  res.json({ id: result.lastInsertRowid, task, completed: 0 });
});

router.put('/:id', (req, res) => {
  const { completed } = req.body;
  const { id } = req.params;

  const updatedTodo = db.prepare('UPDATE todos SET completed = ? WHERE id = ?');
  updatedTodo.run(completed, id);
  res.json({ message: 'Todo completed' });
});

router.delete('/:id', (req, res) => {
  const { id } = req.params;
  const userId = req.userId;
  const deleteTodo = db.prepare(
    'DELETE FROM todos WHERE id = ? AND user_id = ?',
  );
  deleteTodo.run(id, userId);
  res.json({ message: 'Todo Deleted' });
});

export default router;
