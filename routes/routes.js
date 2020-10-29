'use strict';

const express = require('express');
const {User, Course } = require('../models');
const { asyncHandler } = require('../middleware/async-handler');
const { authenticateUser } = require('../middleware/auth-user');
const router = express.Router();

router.get('/users', authenticateUser, asyncHandler (async (req, res) => {
  const user = req.currentUser;

  res.json({
    id: user.id,
    username: user.emailAddress,
    firstName: user.firstName,
    lastName: user.lastName
  });
}));

router.post('/users', asyncHandler(async (req, res) => {
  try {
    console.log(req.body);
    await User.create(req.body);
    res.status(201).location('/').end();
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
  const courses = await Course.findAll({
    attributes: ['id', 'title', 'description', 'estimatedTime', 'materialsNeeded'],
    include: [{
      model: User,
      as: 'owner',
      attributes: ['id', 'firstName', 'lastName', 'emailAddress']
    }]
  });
  res.json(courses);
});

router.get('/courses/:id', async (req, res) => {
  const courses = await Course.findOne({
    where: {id: req.params.id},
    attributes: ['id', 'title', 'description', 'estimatedTime', 'materialsNeeded'],
    include: [{
      model: User,
      as: 'owner',
      attributes: ['id', 'firstName', 'lastName', 'emailAddress']
    }]
  });
  res.json(courses);
});

module.exports = router;