import express,{Request,Response} from 'express';
import { User } from '../models/User';
import { blacklistToken, verifyToken } from '../middleware/auth';
import { isValidEmail } from '../utils/validators';


var bcrypt = require('bcryptjs');

var jwt = require('jsonwebtoken');

//create router object to handle requests
const router = express.Router();

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

        if(String(username).length <2) return res.status(400).json({error: 'Username is too short'});

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
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {expiresIn: '1h'});
    res.json({token});
});

//logout route
router.post('/logout',verifyToken, (req: Request,res: Response) => {
    ( async () => {
    const token = req.headers.authorization?.split(' ')[1];

    //Add the token to the Redis blacklist
    if(token){
        await blacklistToken(token);
        res.status(200).send('User logged out successfully');
    }else {
        res.status(400).send('Token not provided');
    }
})().catch((err) => res.status(500).send('Internal Server Error'));
});


export default router;