import express,{Request,Response} from 'express';
import { User } from '../models/User';


var bcrypt = require('bcryptjs');

var jwt = require('jsonwebtoken');

//create router object to handle requests
const router = express.Router();

const isValidEmail = (email:string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

//add new user
router.post('/register',async(req:Request,res:Response) => {
    try {
        const {username,email,password} = req.body;

        //check for missing fields
        if(!username || !email || !password){
            return res.status(400).json({error: `Please provide all the required details`});
        }

        //validate email
        if(!isValidEmail(email)){
            return res.status(400).json({error: 'Invalid email format'});
        }

        //check if user already exists
        const existingUser = await User.findOne({where: {email: email}});

        if(existingUser){
            return res.status(400).json({error: 'User already exists'});
        }

        //const password_hash = await bcrypt.hash(password,10);

        const user = await User.create({username,email,password_hash:password});
        res.status(201).json(user);
    } catch (error:any) {
        res.status(400).json({error: error.message});
    }
});

//login route
router.post('/login',async (req:Request,res:Response) => {
    const {email,password} = req.body;

    if(!email || !password){
        return res.status(400).json({error: 'Please provide all the required details'});
    }

    //validate email
    if (!isValidEmail(email)) {
        return res.status(400).json({ error: 'Invalid email format' });
    }

    //check if user is in the database 
    const user = await User.findOne({where: {email:email}});

    if (!user) {
        return res.status(400).send('Invalid email or password');
    }

    //compare the password with the stored hash
    const isMatch = await bcrypt.compare(password, user?.password_hash);

    if(!isMatch){
        return res.status(400).send('Invalid email or password');   
    }

    //Generate a JWT token
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {expiresIn: '12h'});
    res.json({token});
});



export default router;