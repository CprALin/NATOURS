const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
      name : {
          type : String,
          required : [true, 'Please tell us your name !']
      },
      email : {
           type : String,
           required : [true , 'Please provide your email !'],
           unique : true,
           lowercase : true,
           validate : [validator.isEmail, 'Please provide a valid email']
      },
      photo : {
        type : String,
        default : 'default.jpg'
      },
      role : {
        type : String,
        enum : ['user' , 'guide' , 'lead-guide' , 'admin'],
        default : 'user'
      },
      password : {
           type : String,
           required : [true , 'Please provide a password !'],
           minlength : 8,
           select : false
      },
      passwordConfirm : {
            type : String,
            required : [true , 'Please confirm your password !'],
            validate : {
                // This only works on CREATE and SAVE !!
                validator : function(el) {
                    return el === this.password;
                },
                message : 'Passwords are not the same ! '
            }
      },
      passwordChangedAt : Date,
      passwordResetToken : String,
      passwordResetExpires : Date,
      active : {
          type : Boolean,
          default : true,
          select : false
      }
});

//pre-save beatween the moments
userSchema.pre('save' , async function(next) {
    // Only run this function if password was actually modified
    if(!this.isModified('password'))
    {
        return next();
    }

    //hash password with cost of 12
    this.password = await bcrypt.hash(this.password , 12);

    // Delete passwordConfirm field
    this.passwordConfirm = undefined;
    next();
});

userSchema.pre('save' , function(next) {
    if(!this.isModified('password') || this.isNew)
    {
        return next();
    } 

    // ensure token has been created after the pass has been changed
    this.passwordChangedAt = Date.now() - 1000;
    next();
});

userSchema.pre(/^find/ , function(next) {
    // this point to the query
    this.find({ active : true });
    
    next();
})

userSchema.methods.correctPassword = async function(candidatePass , userPass) {
    return await bcrypt.compare(candidatePass , userPass);
};

userSchema.methods.createPasswordResetToken = function() {
    const resetToken = crypto.randomBytes(32).toString('hex');

    this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    // use {} - object to print the variable and his value
    console.log({resetToken}, this.passwordResetToken);

    // min * sec * milisec
    this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

    return resetToken;
}

userSchema.methods.changedPasswordAfter = function(JWTTimestamp){
    if(this.passwordChangedAt)
    {
        const changeTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000 , 10);
        //console.log(changeTimestamp , JWTTimestamp);
        return JWTTimestamp < changeTimestamp;
    }

    // not changed
    return false;
}

const User = mongoose.model('User' , userSchema);

module.exports = User;