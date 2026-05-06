const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Course = require('../models/Course');
const SystemConfig = require('../models/SystemConfig');
const { authMiddleware } = require('../middleware/auth');

// Admin Middleware: ensure user has admin role
const adminMiddleware = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied: Super Admin privileges required.' });
    }
    next();
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

router.use(authMiddleware, adminMiddleware);

// ==========================================
// USER MANAGEMENT
// ==========================================

router.get('/users', async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch users', error: error.message });
  }
});

router.put('/users/:id', async (req, res) => {
  try {
    const { role, status, fullName, email } = req.body;

    // Enforce "Only One Admin" rule
    if (role === 'admin') {
      const existingAdmin = await User.findOne({ role: 'admin', _id: { $ne: req.params.id } });
      if (existingAdmin) {
        return res.status(403).json({ message: 'System restricted: Only one Super Admin is allowed.' });
      }
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role, status, fullName, email },
      { new: true }
    ).select('-password');
    res.json({ message: 'User updated successfully', user });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update user', error: error.message });
  }
});

router.delete('/users/:id', async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete user', error: error.message });
  }
});

// ==========================================
// COURSE & CONTENT MANAGEMENT
// ==========================================

router.post('/courses', async (req, res) => {
  try {
    const course = new Course(req.body);
    await course.save();
    res.json({ message: 'Course created successfully', course });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create course', error: error.message });
  }
});

router.put('/courses/:id', async (req, res) => {
  try {
    const course = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ message: 'Course updated successfully', course });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update course', error: error.message });
  }
});

router.delete('/courses/:id', async (req, res) => {
  try {
    await Course.findByIdAndDelete(req.params.id);
    res.json({ message: 'Course deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete course', error: error.message });
  }
});

// ==========================================
// ANALYTICS & REPORTS
// ==========================================

router.get('/analytics', async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ status: 'active' });
    const totalCourses = await Course.countDocuments();
    
    // REAL Total Enrollments (Sum of all users' enrolledCourses)
    const allUsers = await User.find().select('enrolledCourses createdAt');
    const totalEnrollments = allUsers.reduce((acc, u) => acc + (u.enrolledCourses?.length || 0), 0);
    


    // Growth Data (Last 7 days)
    const last7Days = [...Array(7)].map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - i);
      return d.toISOString().split('T')[0];
    }).reverse();

    const growthData = await Promise.all(last7Days.map(async (date) => {
      const count = await User.countDocuments({
        createdAt: {
          $gte: new Date(date),
          $lt: new Date(new Date(date).getTime() + 24 * 60 * 60 * 1000)
        }
      });
      return { date, count };
    }));

    // Category Distribution
    const categories = await Course.aggregate([
      { $group: { _id: "$category", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);

    res.json({
      totalUsers,
      activeUsers,
      totalCourses,
      totalEnrollments,
      growthData,
      categoryDistribution: categories.map(c => ({ name: c._id || 'Other', value: c.count }))
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch analytics', error: error.message });
  }
});

// ==========================================
// UI / SETTINGS MANAGEMENT
// ==========================================

router.get('/settings', async (req, res) => {
  try {
    const settings = await SystemConfig.find();
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch settings', error: error.message });
  }
});

router.post('/settings', async (req, res) => {
  try {
    const { key, value } = req.body;
    const setting = await SystemConfig.findOneAndUpdate(
      { key },
      { value, updatedAt: Date.now() },
      { new: true, upsert: true }
    );
    res.json({ message: 'Setting saved successfully', setting });
  } catch (error) {
    res.status(500).json({ message: 'Failed to save setting', error: error.message });
  }
});

router.delete('/settings/:id', async (req, res) => {
  try {
    await SystemConfig.findByIdAndDelete(req.params.id);
    res.json({ message: 'Setting deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete setting', error: error.message });
  }
});

module.exports = router;
