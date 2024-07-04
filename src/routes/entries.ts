import express,{Request,Response} from 'express';
import { JournalEntry} from '../models/JournalEntry';
import { verifyToken } from '../middleware/auth';
import { error } from 'console';

const router = express.Router();

//Add a new entry
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

//Edit entry
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

//Delete entry
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

//Retrieve entries
router.get('/',verifyToken,async(req:Request,res:Response) => {
    try {
        const entries = await JournalEntry.findAll({where: {userId: req.userId}});

        res.json(entries);
    } catch (error:any) {
        res.status(400).json({error: error.message});
    }
});

export default router;