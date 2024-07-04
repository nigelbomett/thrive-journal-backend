import express, {Request,Response} from 'express';
import { verifyToken } from '../middleware/auth';
import { isValidEmail } from '../utils/validators';
import { User } from '../models/User';



const router = express.Router();

var bcrypt = require('bcryptjs');

//Update user profile
router.put('/',verifyToken,async (req:Request, res:Response) => {
    try {
        const {username,email,password} = req.body;
        
        //confirm user is in the database
        const user = await User.findByPk(req.userId);

        if(!user){
            return res.status(404).json({error: 'User not found'});
        }

        //Check which property has been provided
        if (username !== undefined  && !(String(username).length < 2)){ 
            user.username = username
        }

        if(email !== undefined && isValidEmail(email)){
            user.email = email;
        }

        if (password !== undefined) user.password_hash = bcrypt.hashSync(password, 10);

        //update in database
        await user.save();
        res.json(user);
    } catch (error:any) {
        res.status(400).json({error:error.message});
    }
});

export default router;