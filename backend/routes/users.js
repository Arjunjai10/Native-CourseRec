const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { authMiddleware } = require('../middleware/auth');

// GET /api/users/profile/:id
router.get('/profile/:id', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .populate('enrolledCourses')
      .populate('completedCourses')
      .populate('savedCourses')
      .select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// PUT /api/users/profile/:id
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

// PUT /api/users/security/:id  — change password
router.put('/security/:id', authMiddleware, async (req, res) => {
  try {
    const { currentPass, newPass } = req.body;
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isMatch = await user.comparePassword(currentPass);
    if (!isMatch) {
      return res.status(401).json({ message: 'Current password is incorrect' });
    }

    user.password = newPass; // pre-save hook will bcrypt this
    await user.save();

    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// PUT /api/users/notifications/:id  — save notification preferences
router.put('/notifications/:id', authMiddleware, async (req, res) => {
  try {
    // Notification preferences could be stored in user document
    // For now we accept and return success (extend User model later)
    res.json({ message: 'Notification preferences saved' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// POST /api/users/support  — submit a support message
router.post('/support', authMiddleware, async (req, res) => {
  try {
    const { message, subject } = req.body;
    // In production this would send an email or create a ticket
    console.log(`[Support] User ${req.userId}: ${subject || 'No subject'} — ${message}`);
    res.json({ message: 'Support message received. We will respond within 24 hours.' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// POST /api/users/enroll/:courseId
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

// POST /api/users/complete/:courseId
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

    user.enrolledCourses = user.enrolledCourses.filter(
      cid => cid.toString() !== req.params.courseId
    );
    user.completedCourses.push(req.params.courseId);

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

// POST /api/users/progress
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

// POST /api/users/bookmark/:courseId
router.post('/bookmark/:courseId', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    const courseId = req.params.courseId;

    const isBookmarked = user.savedCourses.includes(courseId);
    
    if (isBookmarked) {
      user.savedCourses = user.savedCourses.filter(cid => cid.toString() !== courseId);
    } else {
      user.savedCourses.push(courseId);
    }

    await user.save();
    res.json({ 
      message: isBookmarked ? 'Removed from bookmarks' : 'Added to bookmarks', 
      savedCourses: user.savedCourses,
      isBookmarked: !isBookmarked
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
