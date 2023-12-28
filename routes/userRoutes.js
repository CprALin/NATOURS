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
    .route('/')
    .get(userRouter.getAllUsers)
    .post(userRouter.createUser);
router
    .route('/:id')
    .get(userRouter.getUser)
    .patch(userRouter.updateUser)
    .delete(userRouter.deleteUser);   

module.exports = router;    