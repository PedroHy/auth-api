const User = require('../../models/User');

const register = async(req, res) => {
    try{
        const user = await User.create(req.body);
        return res.send(user)
    }catch(err){
        res.status(400).send(`Error: Registration Failed`);
    }
}

module.exports = { register };