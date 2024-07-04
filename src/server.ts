import './config/config'
import express,{Application} from 'express';
import authRoutes from './routes/user_auth';
import userRoutes from './routes/user';
import entryRoutes from './routes/entries';
import attachmentRoutes from './routes/attachments';
import { sequelize } from './config/db';
import path from 'path';

const dotenv = require('dotenv');

dotenv.config();

var bodyParser = require('body-parser');


const app:Application = express();
const PORT = process.env.LOCAL_PORT

//Middleware
app.use(express.json());
app.use(express.urlencoded({extended:true}));

//Serve static files from the 'uploads' directory
app.use('/uploads',express.static(path.join(__dirname,'..','uploads')));

//parse incoming requests
app.use(bodyParser.json());

//Routes
app.use('/auth',authRoutes);
app.use('/user',userRoutes);
app.use('/entry',entryRoutes);
app.use('/attachment',attachmentRoutes);

app.listen(PORT, async () => {
    console.log(`Console is running on port: ${PORT}`);
    try {
        await sequelize.authenticate();
        console.log("Connected Successfully to database");
    } catch (error) {
        console.log(error);
    }
})