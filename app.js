const express = require('express');
const morgan = require('morgan');

const globalErr = require('./controllers/errorController');
const AppError = require('./utils/appError');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const errorController = require('./controllers/errorController');

const app = express();

// 1) MIDDLEWARES

if(process.env.NODE_ENV === 'development')
{
    app.use(morgan('dev'));
}

app.use(express.json());

app.use(express.static(`${__dirname}/public`));

//Middleware function
app.use((req, res , next) => {
    console.log('Hello from the middleware');
    next();
});

app.use((req , res , next) => {
    req.requestTime = new Date().toISOString();
    //console.log(req.headers);
    next();
});

//Mounting Routers
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);    

app.all('*' , (req , res , next) => {
    /* const err = new Error(`Cant find ${req.originalUrl} on this server!`);
    err.status = 'fail';
    err.statusCode = 404; */

    next(new AppError(`Cant find ${req.originalUrl} on this server!`,404));
});

//ERROR MIDDLEWARE
app.use(globalErr);

module.exports = app;
