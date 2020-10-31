'use strict';

const express = require('express');
const {User, Course } = require('../models');
const { asyncHandler } = require('../middleware/async-handler');
const { authenticateUser } = require('../middleware/auth-user');
const router = express.Router();

/**
 * GET user based on the credentials of the currently logged in user
 */
router.get('/users', authenticateUser, asyncHandler (async (req, res) => {
  const user = req.currentUser;
  res.json({
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    emailAddress: user.emailAddress,
  });
}));

/**
 * POST users creates a new user
 */
router.post('/users', asyncHandler(async (req, res) => {
  try {
    //NOTE: password is hashed within the user Sequelize model
    await User.create(req.body);
    res.status(201).set('Location', `/`).end();
  } catch (err) {
    if (err.name === 'SequelizeValidationError' || err.name === 'SequelizeUniqueConstraintError') {
      const errors = err.errors.map(err => err.message);
      res.status(400).json({ errors });   
    } else {
      throw error;
    }
  }
}));

/**
 * GET courses returns all courses and associated owner (user that created the course)
 * only returns required data
 */
router.get('/courses', asyncHandler(async (req, res) => {
  const courses = await Course.findAll({
    attributes: ['id', 'title', 'description', 'estimatedTime', 'materialsNeeded'],
    include: [{
      model: User,
      as: 'owner',
      attributes: ['id', 'firstName', 'lastName', 'emailAddress']
    }]
  });
  res.json(courses);
}));

/**
 * POST creates a new course and links it to the authenticated user
 */
router.post('/courses', authenticateUser, asyncHandler(async (req, res) => {
  try {
    const user = req.currentUser;
    req.body.userId = user.id;

    const course = await Course.create(req.body);
    res.status(201).set('Location', `/courses/${course.id}`).end();
  } catch (err) {
    if (err.name === 'SequelizeValidationError' || err.name === 'SequelizeUniqueConstraintError') {
      const errors = err.errors.map(err => err.message);
      res.status(400).json({ errors });   
    } else {
      throw error;
    }
  }
}));

/**
 * GET specific course based on ID returns all courses and associated owner (user that created the course)
 * only returns required data
 */
router.get('/courses/:id', asyncHandler(async (req, res) => {
  const course = await Course.findOne({
    where: {id: req.params.id},
    attributes: ['id', 'title', 'description', 'estimatedTime', 'materialsNeeded'],
    include: [{
      model: User,
      as: 'owner',
      attributes: ['id', 'firstName', 'lastName', 'emailAddress']
    }]
  });

  //Checks if the course was found
  if(course) {
    res.json(course);
  } else {
    res.status(404).json({message: "Course not found"});
  }
}));

/**
 * PUT updates a course ONLY if the course is found
 * AND if the course is owned by the authenticated user
 */
router.put('/courses/:id', authenticateUser, asyncHandler(async (req, res) => {
  const user = req.currentUser;
  const course = await Course.findByPk(req.params.id);
  const errors = [];

  if(course) { //Checks if course exists
    if(course.userId === user.id){ //Checks the course being edited was created by the same user
      if(req.body.title) { //checks that the request contains a title
        course.title = req.body.title;
      } else {
        errors.push('Please provide a value for "title"');
      }
    
      if(req.body.description) { //checks that the request contains a description
        course.description = req.body.description;
      } else {
        errors.push('Please provide a value for "description"');
      }
  
      if(req.body.estimatedTime) {
        course.estimatedTime = req.body.estimatedTime;
      }
  
      if(req.body.materialsNeeded) {
        course.materialsNeeded = req.body.materialsNeeded;
      }
  
      //if there was no title or description then this runs and displays the errors
      if(errors.length > 0) {
        res.status(400).json({errors});
      } else {
        await course.save();
        res.status(204).end();
      }
    } else { //if the course being updated is not created by same user then send 403
      res.status(403).json({message: 'You do not own this course and cannot update it'});
    }
  } else { //if course doesn't exist then return 404
    res.status(404).json({message: 'Course not found'});
  }
}));

/**
 * DELETE course removes a course ONLY if the course is found
 * AND the course is owned by a authenticated user
 */
router.delete('/courses/:id', authenticateUser, asyncHandler(async(req, res) => {
  const user = req.currentUser;
  const course = await Course.findByPk(req.params.id);

  if(course) {//Checks if course exists
    if(course.userId === user.id){ //Checks the course being deleted was created by the same user
      await course.destroy();
      res.status(204).end();
    } else {//if the course being deleted is not created by same user then send 403
      res.status(403).json({message: 'You do not own this course and cannot delete it'});
    }
  } else {//if course doesn't exist then return 404
    res.status(404).json({message: 'Course not found'});
  }
}));

module.exports = router;