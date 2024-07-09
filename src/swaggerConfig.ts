import { OpenAPIV3 } from 'openapi-types';

const swaggerDefinition: OpenAPIV3.Document = {
    openapi: '3.0.0',
    info: {
        title: 'Thrive Journal API',
        version: '1.0.0',
        description: 'API documentation for the Thrive Journal application',
    },
    servers: [
        {
            url: 'http://localhost:25234',
            description: 'Development server',
        },
    ],
    components:{
        securitySchemes:{
            bearerAuth:{
                type:'http',
                scheme: 'bearer',
                bearerFormat: 'JWT'
            },
        },
    },
    security:[
        {
            beararAuth: []
        }
    ],
    paths:{}
};

const options = {
    swaggerDefinition,
    apis: ['./src/routes/*.ts'], // Path to the API docs
};

export default options;
