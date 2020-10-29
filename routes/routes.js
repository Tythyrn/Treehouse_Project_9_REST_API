'use strict';

const express = require('express');
const {User, Course } = require('../models');
const { asyncHandler } = require('../middleware/async-handler');
const { authenticateUser } = require('../middleware/auth-user');
const router = express.Router();

router.get('/users', authenticateUser, asyncHandler (async (req, res) => {
  const user = req.currentUser;

  res.json({
    username: user.emailAddress,
    firstName: user.firstName,
    lastName: user.lastName
  });
}));

router.post('/users', asyncHandler(async (req, res) => {
  try {
    console.log(req.body);
    await User.create(req.body);
    res.status(201).json({ "message": "Account successfully created!" });
  } catch (err) {
    if (err.name === 'SequelizeValidationError' || err.name === 'SequelizeUniqueConstraintError') {
      const errors = err.errors.map(err => err.message);
      res.status(400).json({ errors });   
    } else {
      throw error;
    }
  }
}));

router.get('/courses', async (req, res) => {
  const courses = await Course.findAll();
  res.json(courses);
});

module.exports = router;