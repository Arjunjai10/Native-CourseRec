const express = require('express');
const router = express.Router();
const Course = require('../models/Course');
const { authMiddleware } = require('../middleware/auth');

// GET /api/courses - get courses with pagination and search
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 20, search = '', category = 'All' } = req.query;
    const query = {};

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    if (category !== 'All') {
      query.category = category;
    }

    const courses = await Course.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Course.countDocuments(query);

    res.json({
      courses,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      totalCourses: total
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// GET /api/courses/categories - get all unique categories
router.get('/categories', async (req, res) => {
  try {
    const categories = await Course.distinct('category');
    res.json(categories.filter(c => c && c !== ''));
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// GET /api/courses/recommendations/:userId
// IMPORTANT: This MUST come BEFORE /:id or Express matches "recommendations" as an id
router.get('/recommendations/:userId', authMiddleware, async (req, res) => {
  try {
    const User = require('../models/User');
    const user = await User.findById(req.params.userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const interestCategoryMap = {
      'development': ['Programming', 'Web Development', 'Mobile Development'],
      'data-science': ['Data Science', 'Database'],
      'ai': ['AI & LLMs', 'Data Science'],
      'design': ['Design'],
      'business': ['Business', 'Soft Skills'],
      'finance': ['Finance & Fintech'],
      'engineering': ['Programming', 'Cloud & DevOps', 'Security'],
      'math': ['Mathematics', 'Data Science'],
    };

    // Map stored interest IDs to category names
    const targetCategories = (user.interests || []).flatMap(id => interestCategoryMap[id] || [id]);

    let recommendations;
    if (targetCategories.length > 0) {
      recommendations = await Course.find({
        $or: [
          { category: { $in: targetCategories } },
          { tags: { $in: user.interests } }
        ]
      }).limit(15);
    } else {
      recommendations = await Course.find().limit(15);
    }

    res.json(recommendations);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// GET /api/courses/:id - get single course by ID
router.get('/:id', async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    res.json(course);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// POST /api/courses/:id/review
router.post('/:id/review', authMiddleware, async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    const User = require('../models/User');
    const user = await User.findById(req.userId);

    course.reviews.push({
      userId: req.userId,
      userName: user.fullName,
      rating,
      comment,
    });

    const totalRating = course.reviews.reduce((acc, review) => acc + review.rating, 0);
    course.rating = totalRating / course.reviews.length;
    course.reviewsCount = course.reviews.length;

    await course.save();
    res.json({ message: 'Review added', course });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
