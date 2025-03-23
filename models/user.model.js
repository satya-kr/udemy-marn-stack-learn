const mongoose = require("mongoose");
const validator = require('validator');
const bcrypt = require('bcryptjs');

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

const User = mongoose.model('User', userSchema);

module.exports = User;