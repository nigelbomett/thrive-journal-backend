import { NextFunction, Request, Response } from 'express';
import {createClient} from 'redis';
//import { JwtPayload } from 'jsonwebtoken';

/* const redisClient =  createClient()
    .on('error', err => console.log('Redis Client Error',err))
    .connect(); */

var jwt = require('jsonwebtoken');


interface JwTPayload{
    id:number;
}

declare global {
    namespace Express {
        interface Request {
            userId?: number;
            user?: string 
        }
    }
}

/* const isBlacklisted = async (token:string): Promise<boolean> => {
    const result = await redisClient.get(token);
    return result === 'blacklisted';
}; */

export const verifyToken = async (req:Request,res:Response,next: NextFunction) => {
    //retrieve token from request header
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];
    //const token = req.headers['x-access-token'] as string;

    //If no token returned error 401:unauthorized
    if(!token){
        return res.status(401).json({error: 'No token provided'});
    }

    /* if(await isBlacklisted(token)){
        return res.status(403).json('Expired token');
    } */

    //verify token by comparing with secret
    jwt.verify(token,process.env.JWT_SECRET,(err:any,user:any) => {
        if(err){
            return res.status(500).json({error: 'Failed to authenticate token'});
        }
        
        req.user = user;
        req.userId = (user as JwTPayload).id;
        
        next(); //go to the next step in the route end-point
    });
};


export const blacklistToken = async (token: string): Promise<void> => {
    /* await redisClient.set(token, 'blacklisted', {
        EX: 3600,
    }); */
};



