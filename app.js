const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSenetize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');

const globalErr = require('./controllers/errorController');
const AppError = require('./utils/appError');
const reviewRouter = require('./routes/reviewRoutes');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const errorController = require('./controllers/errorController');

const app = express();

// 1) MIDDLEWARES

//SET SECURITY HTTP
app.use(helmet());

//DEVELOPMENT LOGGING
if(process.env.NODE_ENV === 'development')
{
    app.use(morgan('dev'));
}

//Limit request for same API
// 100 req / h
const limiter = rateLimit({
    max : 100,
    windowMs : 60 * 60 * 1000,
    message : 'Too many requests from this IP , please try again in an hour!' 
});
// all routes starts with /api
app.use('/api' ,limiter);

//Reading data from the body into req.body
app.use(express.json({ limit : '10kb' }));

// Data sanitization against NoSql query injection
app.use(mongoSenetize());

//Data sintetization against XSS
app.use(xss());

//prevent parameter pollution 
app.use(hpp({ whitelist : ['duration' , 'maxGroupSize' , 'difficulty' , 'ratingsAvarege'] }));

//Serving static files
app.use(express.static(`${__dirname}/public`));

//Middleware function - test
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
app.use('/api/v1/reviews', reviewRouter);
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
