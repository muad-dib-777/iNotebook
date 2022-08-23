var jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET

const fetchuser = (req,res,next) =>{

    const token = req.header('auth-token')
    
    if(!token){

        res.status(401).send({error:"Please authenticate using a valid token"})
    }

    try {

        const data = jwt.verify(token, JWT_SECRET)
        console.log(data)
        req.user = data.user
        next()
    } catch (error) {
        console.log(error)
        res.status(401).send({error:"Please authenticate"})
    }
}
module.exports = fetchuser