const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true,
        unique: true,
        lowercase: true
    }, 
    password:{
        type: String,
        require: true,
        select: false
    },
    passwordResetToken: {
        type: String,
        select: false
    },
    passwordResetExpires: {
        type: Date,
        select: false
    }
})

userSchema.pre('save', async function(next){
    const hash = await bcrypt.hash(this.password, 8);
    this.password = hash;

    next();
})

const User = mongoose.model('User', userSchema);

module.exports = User;