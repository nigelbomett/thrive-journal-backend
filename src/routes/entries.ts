import express,{Request,Response} from 'express';
import { JournalEntry} from '../models/JournalEntry';
import { verifyToken } from '../middleware/auth';
import { error } from 'console';
import { Op } from 'sequelize';

const router = express.Router();


/**
 * @swagger
 * components:
 *   schemas:
 *     JournalEntry:
 *       type: object
 *       required:
 *         - title
 *         - content
 *         - category
 *         - date
 *       properties:
 *         id:
 *           type: number
 *           description: The auto-generated id of the entry
 *         title:
 *           type: string
 *           description: The title of the entry
 *         content:
 *           type: string
 *           description: The content of the entry
 *         category:
 *           type: string
 *           description: The category of the entry
 *         date:
 *           type: string
 *           format: date
 *           description: The date of the entry
 *       example:
 *         id: 1
 *         title: My Journal Entry
 *         content: This is the content of my journal entry.
 *         category: Personal
 *         date: 2024-07-03
 */

/**
 * @swagger
 * /entry:
 *   post:
 *     summary: Create a new entry
 *     tags: [Journal Entries]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/JournalEntry'
 *     responses:
 *       201:
 *         description: The entry was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/JournalEntry'
 *       400:
 *         description: Bad request
 */
router.post('/',verifyToken,async (req: Request,res: Response) => {
    try {
        const {title,content,category} = req.body;
        
        //Check if there is required content missing
        if (!title || !content || !category) {
            return res.status(400).json({ error: `Please provide all the required details` });
        }

        const entry = await JournalEntry.create({userId: req.userId as number,title,content,category,date: new Date()});

        //Successfully added entry
        res.status(201).json(entry);
    } catch (error:any) {
        res.status(400).json({error: error.message});
    }
});


/**
 * @swagger
 * /entry/{id}:
 *   put:
 *     summary: Update an entry by ID
 *     tags: [Journal Entries]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The entry ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/JournalEntry'
 *     responses:
 *       200:
 *         description: The entry was successfully updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/JournalEntry'
 *       404:
 *         description: The entry was not found
 *       400:
 *         description: Bad request
 */
router.put('/:id', verifyToken,async(req: Request,res: Response) => {
    try {
        const {id} = req.params;
  
        const {title,content,category} = req.body;

        //Find the entry to be updated
        const entry = await JournalEntry.findOne({ where: {id, userId:req.userId}});

        if(!entry){
            return res.status(404).json({error: 'Journal Entry not found'});
        }

        
        if(title) entry.title = title;
        if(content) entry.content = content;
        if(category) entry.category = category;
        

        await entry.save();
        res.json(entry);
    } catch (error : any) {
        res.status(400).json({error:error.message});
    }
});



/**
 * @swagger
 * /entry/{id}:
 *   delete:
 *     summary: Delete an entry by ID
 *     tags: [Journal Entries]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The entry ID
 *     responses:
 *       200:
 *         description: The entry was successfully deleted
 *       404:
 *         description: The entry was not found
 */
router.delete('/:id',verifyToken, async(req:Request, res: Response) => {
    try {
        const {id} = req.params;

        //Confirm if Journal entry is there
        const entry = await JournalEntry.findOne({where: {id,userId: req.userId}});

        if(!entry){
            return res.status(404).json({error: 'Entry not found'});
        }

        await entry.destroy();
        res.json({message: 'Journal Entry Deleted'});

    } catch (error: any) {
        res.status(400).json({error: error.message});
    }
});


/**
 * @swagger
 * /entry:
 *   get:
 *     summary: Get all entries for the authenticated user
 *     tags: [Journal Entries]
 *     responses:
 *       200:
 *         description: List of entries
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/JournalEntry'
 *       400:
 *         description: Bad request
 */
router.get('/',verifyToken,async(req:Request,res:Response) => {
    try {
        const entries = await JournalEntry.findAll({where: {userId: req.userId}});

        res.json(entries);
    } catch (error:any) {
        res.status(400).json({error: error.message});
    }
});

router.get('/summary',verifyToken, async(req:Request,res:Response) => {
    try {
        const {period, date} = req.query;
        const userId = req.userId;
        const startDate = new Date(date as string);
        let endDate: Date;

        switch(period) {
            case 'daily':
                endDate = new Date(startDate);
                endDate.setDate(endDate.getDate() + 1);
                break;
            case 'weekly':
                endDate = new Date(startDate);
                endDate.setDate(endDate.getDate() + 7);
                break;
            case 'monthly':
                endDate = new Date(startDate);
                endDate.setDate(endDate.getMonth() + 1);
                break;
            default:
                return res.status(400).json({error: 'Invalid period'});
        }

        const entries = await JournalEntry.findAll({
            where: {
                userId: req.userId, date: {
                    [Op.between]: [startDate, endDate],
                }},
            
        });

        const totalEntries = entries.length;

        res.json({totalEntries,entries});
    } catch (error: any) {
        res.status(400).json({error: error.message});
    }
})

export default router;