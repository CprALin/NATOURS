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

exports.getTour = catchAsync(async (req , res, next) => {
    //get data from collection
    const tour = await Tour.findOne({slug : req.params.slug}).populate({
        path : 'reviews',
        fields : 'review rating user'
    });
    //build  tamplate

    //render using tour data

    res.status(200)
    .set(
        'Content-Security-Policy',
        "default-src 'self' https://*.mapbox.com ;base-uri 'self';block-all-mixed-content;font-src 'self' https: data:;frame-ancestors 'self';img-src 'self' data:;object-src 'none';script-src https://cdnjs.cloudflare.com https://api.mapbox.com 'self' blob: ;script-src-attr 'none';style-src 'self' https: 'unsafe-inline';upgrade-insecure-requests;"
    ).render('tour' , {
        title : `${tour.name} Tour`,
        tour
    });
});

exports.getLoginForm = (req, res) => {
    res.status(200).set(
        'Content-Security-Policy', 
        "script-src 'self' https://cdnjs.cloudflare.com https://cdn.jsdelivr.net;"
    ).render('login', {
        title : 'Log into your account'
    });
}
