const express = require('express');
const authController = require('./../controllers/authController');
const reviewRouter = require('./../routes/reviewRoutes');
const tourController = require('./../controllers/tourController');

// ROUTES

const router = express.Router();

//router.param('id' , tourController.checkID);

router
    .route('/top-5-cheap')
    .get(tourController.aliasTopTours ,tourController.getAllTours);

router
    .route('/tour-stats')
    .get(tourController.getTourStats);    

router
    .route('/monthly-plan/:year')
    .get(tourController.getMounthlyPlan);    

router
    .route('/')
    .get(authController.protect , tourController.getAllTours)
    .post(tourController.createTour);
router
    .route('/:id')
    .get(tourController.getTour)
    .patch(tourController.updateTour)
    .delete(authController.protect , authController.restrictTo('admin' , 'lead-guide') , tourController.deleteTour);

/* router
    .route('/:tourId/reviews')
    .post(authController.protect , authController.restrictTo('user'), reviewController.createReview);
 */

router.use('/:tourId/reviews' , reviewRouter);

module.exports = router;    