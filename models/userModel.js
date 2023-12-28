const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

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
      photo : String,
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

userSchema.methods.correctPassword = async function(candidatePass , userPass) {
    return await bcrypt.compare(candidatePass , userPass);
};

const User = mongoose.model('User' , userSchema);

module.exports = User;