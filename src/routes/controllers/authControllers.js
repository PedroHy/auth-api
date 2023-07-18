const User = require('../../models/User');

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

module.exports = { register };