const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Tour = require('./../models/tourModel');
const catchAsync = require('./../utils/catchAsync');
const Booking = require('../models/bookingModel');   


exports.getCheckoutSession = catchAsync(async (req , res , next) => {
    // get the currently booked tour
    const tour = await Tour.findById(req.params.tourId);
    
    //add product to stripe
    const product = await stripe.products.create({
        name : `${tour.name}`,
        description : tour.summary,
        images : [`https://www.natours.dev/img/tours/${tour.imageCover}`]
    });

    // create price
    const price = await stripe.prices.create({
        product : product.id,
        unit_amount : tour.price * 100,
        currency : 'usd'
    });
    
    // create checkout session
    const session = await stripe.checkout.sessions.create({
        line_items : [
            {
                price : price.id,
                quantity : 1
            }
        ],
        mode : 'payment',
        success_url : `${req.protocol}://${req.get('host')}/?tour=${req.params.tourId}&user=${req.user.id}&price=${tour.price}`,
        cancel_url : `${req.protocol}://${req.get('host')}/tour/${tour.slug}`
    }); 
    // create session as response 
    res.status(200).json({
        status : 'success',
        session
    });
});


exports.createBookingCheckout = catchAsync(async(req , res , next) => {
     //TEMP SOLUTION - UNSECURE
        const { tour , user , price } = req.query;

        if(!tour && !user && !price) return next();

        await Booking.create({ tour , user , price });

        res.redirect(req.originalUrl.split('?')[0]);
});