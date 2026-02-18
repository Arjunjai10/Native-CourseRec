const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  userName: String,
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  comment: String,
  date: {
    type: Date,
    default: Date.now,
  },
});

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  instructor: {
    name: String,
    title: String,
    avatar: String,
    rating: Number,
    students: Number,
    courses: Number,
  },
  category: {
    type: String,
    required: true,
  },
  tags: [String],
  level: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced'],
    default: 'Beginner',
  },
  duration: {
    hours: Number,
    lectures: Number,
  },
  rating: {
    type: Number,
    default: 0,
  },
  reviewsCount: {
    type: Number,
    default: 0,
  },
  studentsEnrolled: {
    type: Number,
    default: 0,
  },
  thumbnail: String,
  videoUrl: String,
  syllabus: [{
    module: String,
    lectures: Number,
    duration: String,
    topics: [{
      title: String,
      duration: String,
      type: String,
    }],
  }],
  reviews: [reviewSchema],
  price: {
    type: Number,
    default: 0,
  },
  language: {
    type: String,
    default: 'English',
  },
  resources: {
    videos: Number,
    exercises: Number,
    downloadable: Number,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Course', courseSchema);
