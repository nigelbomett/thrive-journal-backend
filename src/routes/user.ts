import express, {Request,Response} from 'express';
import { verifyToken } from '../middleware/auth';
import { isValidEmail } from '../utils/validators';
import { User } from '../models/User';



const router = express.Router();

var bcrypt = require('bcryptjs');

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - username
 *         - email
 *         - password
 *       properties:
 *         id:
 *           type: number
 *           description: The auto-generated id of the user
 *         username:
 *           type: string
 *           description: The username of the user
 *         email:
 *           type: string
 *           description: The user's email
 *         password:
 *           type: string
 *           description: The users's password
 *       example:
 *         username: mark
 *         email: markmywords@test.com
 *         password: password123
 */

/**
 * @swagger
 * /user:
 *   post:
 *     summary: Add a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       201:
 *         description: User successfully added
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Bad request
 */
router.post('/', async (req: Request, res: Response) => {
    try {
        const { username, email, password } = req.body;

        //check for missing fields
        if (!username || !email || !password) {
            return res.status(400).json({ error: `Please provide all the required details` });
        }

        //validate email
        if (!isValidEmail(email)) {
            return res.status(400).json({ error: 'Invalid email format' });
        }

        if (String(username).length < 2) return res.status(400).json({ error: 'Username is too short' });

        //check if user already exists
        const existingUser = await User.findOne({ where: { email: email } });

        if (existingUser) {
            return res.status(400).json({ error: 'User already exists' });
        }

        //const password_hash = await bcrypt.hash(password,10);

        const user = await User.create({ username, email, password_hash: password });
        res.status(201).json(user);
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
});

/**
 * @swagger
 * /user:
 *   get:
 *     summary: Get the authenticated users details
 *     tags: [Users]
 *     security:
 *          - bearerAuth: []
 *     responses:
 *       200:
 *         description: user's info
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       400:
 *         description: Bad request
 *       404:
 *         description: The user was not found
 */
router.get('/', verifyToken, async (req: Request, res: Response) => {
    try {

        //confirm user is in the database
        const user = await User.findByPk(req.userId);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json(user);
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
});


/**
 * @swagger
 * /user:
 *   put:
 *     summary: Update user's details
 *     tags: [Users]
 *     security:
 *          - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: User details successfully updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: The user was not found
 *       400:
 *         description: Bad request
 */
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