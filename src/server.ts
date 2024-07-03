import express,{Application} from 'express';
const dotenv = require('dotenv');

dotenv.config();

const app:Application = express();
const PORT = process.env.LOCAL_PORT


app.listen(PORT, () => {
    console.log(`Console is running on port: ${PORT}`);
})