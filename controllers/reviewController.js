const Review = require('../models/reviewModel');
//const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');


exports.getAllReviews = factory.getAll(Review);

/* catchAsync(async (req , res , next) =>{
    
    const reviews = await Review.find(filter);

    res.status(200).json({
        status : 'success',
        requestedAt : req.requestTime,
        results : reviews.length ,
        data : {
            reviews
        } 
    });
}); */

exports.setTourUserIds = (req , res, next) => {

     //allow nested routes
     if(!req.body.tour) req.body.tour = req.params.tourId;
     if(!req.body.user) req.body.user = req.user.id;

    next();
};

exports.getReview = factory.getOne(Review);
exports.createReview = factory.createOne(Review);
exports.updateReview = factory.updateOne(Review);
exports.deleteReview = factory.deleteOne(Review);