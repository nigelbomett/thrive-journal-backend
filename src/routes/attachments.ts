import express, { Request, Response } from 'express';
import { Attachment } from '../models/Attachment';
import { verifyToken } from '../middleware/auth';
import path from 'path';

const multer = require('multer');
const router = express.Router();


//configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req:any,file:any,cb:any) => {
        cb(null, path.join(__dirname, '..', '..', 'uploads'));
    },
    filename:(req:any,file:any,cb:any) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null,uniqueSuffix + '-' + file.originalname)
    }
});

const upload = multer({storage:storage});

//Upload an attachment
router.post('/upload', verifyToken, upload.single('file'), async (req: Request, res: Response) => {

    try {
        const { entryId } = req.body;

        if(!req.file){
            return res.status(400).send('No file Uploaded');
        }

        const attachment = await Attachment.create({ 
            journalEntryId:entryId as number, 
            fileName: req.file.originalname,
            filePath: req.file.path, 
        });

        //Successfully uploaded attachment
        res.status(201).json(attachment);
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
});

//Get attachments
router.get('/:entryId',verifyToken, async (req:Request,res:Response) => {
    try {
        const {entryId} = req.params;
        const attachments = await Attachment.findAll({where: {journalEntryId: entryId}});
        res.json(attachments);
    } catch (error: any) {
        res.status(400).json({error:error.message});
    }
});

//Download attachment
router.get('/download/:id',verifyToken,async(req:Request,res:Response) => {
    try {
        const {id} = req.params;
        const attachment = await Attachment.findByPk(id);

        if(!attachment){
            return res.status(404).send('Attachment not found');
        }
        res.download(attachment.filePath,attachment.fileName);
    } catch (error: any) {
        res.status(400).json({error: error.message});
    }
});

//Delete attachment
router.delete('/:id', verifyToken, async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const attachment = await Attachment.findByPk(id);

        if (!attachment) {
            return res.status(404).json({ error: 'Attachment not found' });
        }

        await attachment.destroy();
        res.json({ message: 'Attachment deleted' });

    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
});


export default router;