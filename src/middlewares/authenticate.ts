import { NextFunction, Request, Response } from "express";
import  Session  from "../entities/Sessions";
import jwt from "jsonwebtoken"
import { getRepository } from "typeorm";

export default async function authenticate(req:Request,res:Response,next:NextFunction){
    const authorization = req.headers["authorization"];
    const token = authorization.split("Bearer ")[1];
    const chaveSecreta = process.env.JWT_SECRET;
    try {
        const data:any = jwt.verify(token, chaveSecreta);
        const session = await getRepository(Session).findOne({where:{id:data.id},relations:['user']})
        res.locals.user = session.user;
        next();
    } catch {
        return res.sendStatus(401)
    }
}