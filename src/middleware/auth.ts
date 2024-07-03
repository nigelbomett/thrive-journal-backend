import { NextFunction, Request, Response } from 'express';

var jwt = require('jsonwebtoken');

interface JwTPayload{
    id:number;
}

export const verifyToken = (req:Request,res:Response,next: NextFunction) => {
    //retrieve token from request header
    const token = req.headers['x-access-token'] as string;

    //If no token returned error 403:forbidden
    if(!token){
        return res.status(403).json({error: 'No token provided'});
    }

    //verify token by comparing with secret
    jwt.verify(token,process.env.JWT_SECRET,(err:any,decoded:any) => {
        if(err){
            return res.status(500).json({error: 'Failed to authenticate token'});
        }

        req.userId = (decoded as JwTPayload).id;
        next(); //go to the next step in the route end-point
    });
};

