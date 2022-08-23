const express = require('express')
const User = require('../models/User')
const router = express.Router()
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const fetchuser = require('../middleware/fetchuser');

//Getting JSON WebToken Secret 
const JWT_SECRET = process.env.JWT_SECRET



//Route 1 - Create a user using: POST "/api/auth/createuser" No login required


router.post('/createuser', [
    body('email', "Enter a valid email").isEmail(),
    body('password', "Password should be at least 6 characters").isLength({ min: 6 }),
    body('name', "Name should be at least 2 characters").isLength({ min: 2 })
], async (req,res) => {

    const errors = validationResult(req);
    let success = false;

    if (!errors.isEmpty()) {
      return res.status(400).json({success, errors: errors.array() });
    }


    //Check whether user with same email already exists
    try{
        let user = await User.findOne({email: req.body.email})
        /* console.log(user) */

        if(user){


            return res.status(400).json({success, error: "Sorry, a user with this email already exists"})
        }

        const salt = await bcrypt.genSalt(10) //Generating salt for the password
        secPass = await bcrypt.hash(req.body.password, salt) //Making hash with password and salt

        user = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: secPass,
        })

        
        
        const data = {
            user:{
              id: user.id
            }
          }


        const authtoken = jwt.sign(data, JWT_SECRET)
        /* console.log(jwtData) */
    
        res.json({success: true, authtoken})

    }
    catch(error){

        console.error(error.message)
        res.status(500).send("Internal server error occurred")
    }
    

    
})





//Route 2 - Authenticate a user using POST /api/auth/login - No login required


router.post('/login', [
    body('email', "Enter a valid email").isEmail(),
    body('password', "Password cannot be blank").exists()
], async (req,res) => {

    
    const errors = validationResult(req);
    let success = false;

    if (!errors.isEmpty()) {
      return res.status(400).json({success: success, errors: errors.array() });
    }

    const {email, password} = req.body

    try{
        let user = await User.findOne({email})
        if(!user){

            return res.status(400).json({success: success, error: "This user does not exist"})
        }

        const passwordCompare = await bcrypt.compare(password, user.password)

        if(!passwordCompare){

            return res.status(400).json({success: success, error: "The password is incorrect"})
        }

        const data = {
            user:{
              id: user.id
            }
          }


        const authtoken = jwt.sign(data, JWT_SECRET)
        res.json({success: true,authtoken})
    }
    catch(error){

        console.error(error.message)
        res.status(500).send("Internal server error occurred")
    }

})


//Route 3 - Get logged in user details : POST "/api/auth/getuser" login required


router.post('/getuser', fetchuser, async (req,res) => {
    
    
    try {
        
        let userid = req.user.id
        
        const user = await User.findById(userid).select("-password")
        res.send(user)
        
    } catch (error) {

        console.error(error.message)
        res.status(500).send("Internal server error occurred")
        
    }
})

module.exports = router