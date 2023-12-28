const { promisify } = require('util');
const AppError = require('./../utils/appError');
const jwt = require('jsonwebtoken');
const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');

const singToken = id => {
    return jwt.sign({ id } , process.env.JWT_SECRET , {
        expiresIn : process.env.JWT_EXPIRES_IN
    });
}

exports.singup = catchAsync(async (req , res , next) => {
    const newUser = await User.create({
        name : req.body.name,
        email : req.body.email,
        password : req.body.password,
        passwordConfirm : req.body.passwordConfirm
    });

    const token = singToken( newUser._id );


    res.status(201).json({
        status : 'success',
        token,
        data : {
            user : newUser
        }
    });
}); 

exports.login = catchAsync(async (req , res , next) => {
    const { email , password } = req.body;

    // 1) Check if email and pass exist
    if(!email || !password)
    {
       return next(new AppError('Please provide email and password !' , 400));
    }
    // 2) Check if user exist && password is correct
    const user = await User.findOne({ email }).select('+password');

    //console.log(user);

    if(!user || !(await user.correctPassword(password , user.password)))
    {
        return next(new AppError('Incorect email or password !' , 401));
    }

    // 3) If everything ok , sent token to client
    const token = singToken(user._id);

    res.status(200).json({
        status : 'success',
        token
    });
   
});

exports.protect = catchAsync( async (req , res , next) => {
    let token;
    // 1) get token and check if exist
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer'))
    {
       token = req.headers.authorization.split(' ')[1];
    }

    //console.log(token);

    if(!token)
    {
        return next(new AppError('You are not logged in ! Please login to get access . ' , 401));
    }
    
    // 2) validate token
    // promisify function to return a promise
    const decoded = await promisify(jwt.verify)(token , process.env.JWT_SECRET);
    //console.log(decoded);

    // 3) check if user still exists
    const currentUser = await User.findById(decoded.id);

    if(!currentUser)
    {
        return next(new AppError('The user belonging to this token does no longer exist .', 401));
    }
    
    // 4) check if user changed password after the token was issued
    //currentUser.changedPasswordAfter(decoded.iat)
    if(currentUser.changedPasswordAfter(decoded.iat))
    {
        return next(new AppError('User recently changed password ! Please login again . ' , 401));
    }

    //grant access to protected route  
    req.user = currentUser;
    next();
});