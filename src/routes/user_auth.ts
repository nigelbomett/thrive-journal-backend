import express,{Request,Response} from 'express';
import { User } from '../models/User';

var bcrypt = require('bcryptjs');

//create router object to handle requests
const router = express.Router();

const isValidEmail = (email:string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

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

export default router;