const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    review : {
        type : String,
        require : [true , 'Review can not be empty !']
    },
    rating : {
        type : Number,
        min : 1,
        max : 5
    },
    createdAt : {
        type : Date,
        default : Date.now()
    },
    tour : {
            type : mongoose.Schema.ObjectId,
            ref : 'Tour',
            reguired : [true, 'Review must belog to a tour.']
    }
    ,
    user :{
            type : mongoose.Schema.ObjectId,
            ref : 'User',
            required : [true , 'Review must belog to a user.']
    }
},
{
    //field that is not saved in db but calculated used another values 
    toJSON : { virtuals : true },
    toObject : { virtuals : true }
});

const Review = mongoose.model('Review' , reviewSchema);

module.exports = Review;