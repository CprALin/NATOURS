const express = require('express');
const userRouter = require('./../controllers/userController');
const userController = require('./../controllers/userController');
const authController = require('./../controllers/authController');
// ROUTES

const router = express.Router();

router
    .post('/singup' , authController.singup);
router
    .post('/login' , authController.login);
router
    .post('/forgotPassword' , authController.forgotPassword);
router
    .patch('/resetPassword/:token' , authController.resetPassword);    

router.use(authController.protect);    

router
    .patch('/updateMyPassword' , authController.updatePassword);
router    
    .get('/me' , userController.getMe , userController.getUser);
router 
    .patch('/updateMe' , userController.updateMe);  

router
    .delete('/deleteMe' , userController.deleteMe);    

router.use(authController.restrictTo('admin'));

router 
    .route('/')
    .get(userRouter.getAllUsers)
    .post(userRouter.createUser);
router
    .route('/:id')
    .get(userRouter.getUser)
    .patch(userRouter.updateUser)
    .delete(userRouter.deleteUser);   

module.exports = router;    