const express = require('express');
const viewsController = require('./../controllers/viewsController');
const authController = require('../controllers/authController');
//const bookingController = require('../controllers/bookingController');  -- add it to first router

const router = express.Router();

//ROUTES
router.get('/' , authController.isLoggedIn ,viewsController.getOverview);
router.get('/tour/:slug' , authController.isLoggedIn ,viewsController.getTour);
router.get('/login' , authController.isLoggedIn ,viewsController.getLoginForm);
router.get('/me', authController.protect ,viewsController.getAccount);
router.get('/register' , viewsController.getRegisterForm);
router.get('/my-tours', authController.protect , viewsController.getMyTours);

//router.post('/submit-user-data' , authController.protect ,viewsController.updateUserData);

module.exports = router;
