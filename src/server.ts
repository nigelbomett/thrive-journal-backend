import './config/config'
import express,{Application} from 'express';
import authRoutes from './routes/user_auth';
import userRoutes from './routes/user';
import entryRoutes from './routes/entries';
import { sequelize } from './config/db';

const dotenv = require('dotenv');

dotenv.config();

var bodyParser = require('body-parser');


const app:Application = express();
const PORT = process.env.LOCAL_PORT

//parse incoming requests
app.use(bodyParser.json());

//Routes
app.use('/auth',authRoutes);
app.use('/user',userRoutes);
app.use('/entry',entryRoutes);

app.listen(PORT, async () => {
    console.log(`Console is running on port: ${PORT}`);
    try {
        await sequelize.authenticate();
        console.log("Connected Successfully to database");
    } catch (error) {
        console.log(error);
    }
})