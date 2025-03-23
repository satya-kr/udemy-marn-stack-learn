const mongoose = require("mongoose");
const validator = require('validator');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'User must have name!'],
        trim: true,
    },
    email: {
        type: String,
        unique: true,
        required: [true, 'User must have email!'],
        lowercase: true,
        validate: [ validator.isEmail, 'Please provide valid email' ]
    },
    photo: {
        type: String,
        // required: [true, 'User must have photo!'],
    },
    password: {
        type: String,
        required: [true, 'User must have password!'],
        minlength: 6,
        select: false, //it will not show now
    },
    role: {
        type: String,
        enum: [ 'user', 'guide', 'lead-guide', 'admin' ],
        default: 'user'
    },
    passwordConfirm: {
        type: String,
        required: [true, 'User must have cofirm password!'],
        validate: {
            // this valication only for Create or Insert(Save)
            validator: function(el) {
                return this.password === el // abc === abc 
            },
            message: 'Passwords do not match!'
        }
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
});

userSchema.pre('save', async function(next) {
    if(!this.isModified('password') &&  !this.isModified('passwordConfirm')) return next();
    
    this.password = await bcrypt.hash(this.password, 12);

    // now we can delete th passwordConfirm field 
    this.passwordConfirm = undefined;
    
    return next();
});

userSchema.methods.correctPassword = async function(candidatePassword, userPassword) {
    return await bcrypt.compare(candidatePassword, userPassword);
}

userSchema.methods.changedPasswordAfter = function(JWTTimestamp) {
    if (this.passwordChangedAt) {
        const changedTimestamp = parseInt(
            this.passwordChangedAt.getTime() / 1000,
            10
        );
        //  console.log(JWTTimestamp, changedTimestamp)
        //  console.log(JWTTimestamp < changedTimestamp)
  
        return JWTTimestamp < changedTimestamp; // 100 < 200 -> true
    }
  
    // False means NOT changed
    return false;
};

userSchema.methods.createPasswordResetToken = function() {
    const resetToken = crypto.randomBytes(32).toString('hex');

    this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

    console.log({ resetToken }, { passwordResetToken: this.passwordResetToken });

    return resetToken;
}

const User = mongoose.model('User', userSchema);

module.exports = User;