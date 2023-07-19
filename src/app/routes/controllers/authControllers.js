//modules
const User = require('../../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const mailer = require('../../../modules/mailer');

//config file
const authConfig = require('../../../config/auth.json');


function generateToken(params = {}) {
    return jwt.sign(params, authConfig.secret, {
        expiresIn: 86400,
    })
}


//controllers
const register = async (req, res) => {
    const { email } = req.body;
    try {
        if (await User.findOne({ email })) {
            return res.status(400).send(`Error: User already Exists`);
        }
        const user = await User.create(req.body);
        user.password = undefined;
        return res.send({ user, token: generateToken({ id: user._id }) })
    } catch (err) {
        res.status(400).send(`Error: Registration Failed`);
    }
}

const authenticate = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email }).select('+password');

        //handling errors
        if (!user) {
            return res.status(400).send('Error: User not found');
        }
        if (!await bcrypt.compare(password, user.password)) {
            return res.status(400).send('Error: Invalid password');
        }

        user.password = undefined;

        res.send({ user, token: generateToken({ id: user._id }) });
    } catch {
        res.status(400).send('Error: Can`t authenticate')
    }

}

const forgotPassword = async(req, res)=>{
    const {email} = req.body;
    try{
        const user = await User.findOne({email})
        if(!user){
            return res.status(400).send({error: 'User not found'})
        }

        const token = crypto.randomBytes(20).toString('hex');
        const now = new Date()
        now.setHours(now.getHours() + 1);

        await User.findByIdAndUpdate(user.id, {
            '$set':{
                passwordResetToken: token,
                passwordResetExpires: now
            }
        })

        mailer.sendMail({
            to: email,
            from: 'pedrohrda093@gmail.com',
            template: 'auth/forgot_password',
            context: { token }
        }, (err)=>{
            if(err){
                console.log(err)
                res.status(400).send({error: 'Error on send forgot email'})
            }

            return res.send()
        })

    }catch{
        res.status(400).send({error: 'Error on forgot password try again'})
    }
}

const resetPassword = async(req, res)=>{
    const { email, token, password } = req.body;

    try{
        const user = await User.findOne({email}).select('+passwordResetToken passwordResetExpires');

        if(!user){
            return res.status(400).send({error: 'User not found'})
        }

        if(user.passwordResetToken !== token){
            return res.status(400).send({error: 'Wrong token'})
        }

        const now = new Date()

        if(now.getHours() > user.passwordResetExpires){
            return res.status(400).send({error: 'Token expired'})
        }

        user.password = password;

        await user.save();
        res.send()
    }catch{
        return res.status(400).send({error: 'Can´t reset password, try again'})
    }
}

module.exports = { register, authenticate, forgotPassword, resetPassword };