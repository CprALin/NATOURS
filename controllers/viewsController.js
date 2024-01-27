const Tour = require('./../models/tourModel');
const catchAsync = require('./../utils/catchAsync');

exports.getOverview = catchAsync(async (req , res) => {

    // get data from collection
    const tours = await Tour.find();


    //build tamplate 

    //render tamplate using tour data

    res.status(200).render('overview' , {
        title : 'All Tours',
        tours
    });
});

exports.getTour = catchAsync(async (req , res) => {
    //get data from collection
    const tour = await Tour.findOne({slug : req.params.slug}).populate({
        path : 'reviews',
        fields : 'review rating user'
    });
    //build  tamplate

    //render using tour data

    res.status(200).render('tour' , {
        title : 'The Forest Hiker Tour',
        tour
    });
});