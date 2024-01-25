const express = require('express');
const reviewController = require('../controllers/reviewController');
const authController = require('../controllers/authController');

const router = express.Router();

router
    .route('/getReviews')
    .get(reviewController.getAllReviews);

router
    .route('/createReview')
    .post(authController.protect , authController.restrictTo('user'),reviewController.createReview);    

module.exports = router;