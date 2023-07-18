const User = require('../../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const authConfig = require('../../config/auth.json');

const register = async(req, res) => {

    const { email } = req.body;

    try{
        if(await User.findOne({email})){
            return res.status(400).send(`Error: User already Exists`);
        }
        const user = await User.create(req.body);
        user.password = undefined;
        return res.send('Sucessfully: User Registered')
    }catch(err){
        res.status(400).send(`Error: Registration Failed`);
    }
}

const authenticate = async(req, res)=>{
    const { email, password } = req.body;

    try{
        const user = await User.findOne({ email }).select('+password');
        
        if(!user){
            return res.status(400).send('Error: User not found');
        }
        if(!await bcrypt.compare(password, user.password)){
            return res.status(400).send('Error: Invalid password');
        }

        user.password = undefined;

        const token = jwt.sign( {id: user._id}, authConfig.secret, {
            expiresIn: 86400,
        } )

        res.send({user, token});
    }catch{
        res.status(400).send('Error: Can`t authenticate')
    }

}

module.exports = { register, authenticate };