import express,{Request,Response} from 'express';
import { User } from '../models/User';
import { blacklistToken, verifyToken } from '../middleware/auth';
import { isValidEmail } from '../utils/validators';
import { error } from 'console';


var bcrypt = require('bcryptjs');

var jwt = require('jsonwebtoken');

//create router object to handle requests
const router = express.Router();


/**
 * @swagger
 * components:
 *   schemas:
 *     Auth:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           description: The user's email
 *         password:
 *           type: string
 *           description: The users's password
 *       example:
 *         email: youremail@test.com
 *         password: yourPassword
 */

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login
 *     tags: [Login]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Auth'
 *     responses:
 *       200:
 *         description: User successfully logged in
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Auth'
 *       400:
 *         description: Bad request
 */
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
        return res.status(400).send({error: 'Invalid email or password'});
    }

    //compare the password with the stored hash
    const isMatch = await bcrypt.compare(password, user?.password_hash);

    if(!isMatch){
        return res.status(400).send({error: 'Invalid email or password'});   
    }

    //Generate a JWT token
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {expiresIn: '12h'});
    res.status(201).json({token});
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
        res.status(400).send({error:'Token not provided'});
    }
})().catch((err) => res.status(500).send({error:'Internal Server Error'}));
});


export default router;