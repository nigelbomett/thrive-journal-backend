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


/**
 * @swagger
 * components:
 *   schemas:
 *     Attachment:
 *       type: object
 *       required:
 *         - filePath
 *         - fileName
 *       properties:
 *         id:
 *           type: number
 *           description: The auto-generated id of the attachment
 *         journalEntryId:
 *           type: number
 *           description: The id linking the attachment to a journal entry
 *         filePath:
 *           type: string
 *           description: The path of where the attachment is located
 *         fileName:
 *           type: string
 *           description: The name of the attachment
 *       example:
 *         filePath: C:\Users\Public\Pictures
 *         fileName: shamiri.png
 */


/**
 * @swagger
 * /attachment/upload:
 *   post:
 *     summary: Add an attachment
 *     tags: [Attachment]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *                 entryId:
 *                   type: integer
 *                   description: The ID of the journal entry to attach the file to
 *                 file:
 *                   type: string
 *                   format: binary
 *                   description: The file to upload 
 *     responses:
 *       201:
 *         description: The attachment was successfully added
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Attachment'
 *       400:
 *         description: Bad request
 */
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



/**
 * @swagger
 * /attachment/{id}:
 *   get:
 *     summary: Get an attachment by the Journal Entry ID
 *     tags: [Attachment]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The journal entry ID
 *     security:
 *          - bearerAuth: []
 *     responses:
 *       200:
 *         description: The attachment details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Attachment'
 *       404:
 *         description: The attachment was not found
 */
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



/**
 * @swagger
 * /attachment/{id}:
 *   delete:
 *     summary: Delete an attachment by ID
 *     tags: [Attachment]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The attachment ID
 *     security:
 *          - bearerAuth: []
 *     responses:
 *       200:
 *         description: The attachment was successfully deleted
 *       404:
 *         description: The attachment was not found
 */
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