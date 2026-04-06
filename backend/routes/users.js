const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { authMiddleware } = require('../middleware/auth');

router.get('/profile/:id', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .populate('enrolledCourses')
      .populate('completedCourses')
      .select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.put('/profile/:id', authMiddleware, async (req, res) => {
  try {
    const { fullName, bio, interests, profilePicture } = req.body;
    
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { fullName, bio, interests, profilePicture },
      { new: true }
    ).select('-password');

    res.json({ message: 'Profile updated', user });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.post('/enroll/:courseId', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    const Course = require('../models/Course');
    const course = await Course.findById(req.params.courseId);

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    if (user.enrolledCourses.includes(req.params.courseId)) {
      return res.status(400).json({ message: 'Already enrolled' });
    }

    user.enrolledCourses.push(req.params.courseId);
    course.studentsEnrolled += 1;

    await user.save();
    await course.save();

    res.json({ message: 'Enrolled successfully', user });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.post('/complete/:courseId', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    const Course = require('../models/Course');
    const course = await Course.findById(req.params.courseId);

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    if (user.completedCourses.includes(req.params.courseId)) {
      return res.status(400).json({ message: 'Course already completed' });
    }

    // Move from enrolled to completed if it exists in enrolled
    user.enrolledCourses = user.enrolledCourses.filter(cid => cid.toString() !== req.params.courseId);
    user.completedCourses.push(req.params.courseId);

    // Add certificate record
    const certificate = {
      courseId: course._id,
      courseName: course.title,
      completedDate: new Date(),
    };
    user.certificates.push(certificate);

    await user.save();
    res.json({ message: 'Course completed and certificate issued', user });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.post('/progress', authMiddleware, async (req, res) => {
  try {
    const { hours } = req.body;
    const user = await User.findById(req.userId);
    
    if (hours) {
      user.learningHours += parseFloat(hours);
      await user.save();
    }

    res.json({ message: 'Progress updated', learningHours: user.learningHours });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
