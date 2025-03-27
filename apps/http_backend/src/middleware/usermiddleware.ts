import jwt, { JwtPayload } from "jsonwebtoken"
import { JWT_SECRET } from "@repo/backend_common/secret"
import { NextFunction, Request, response, Response } from "express"

export function usermiddleware(req:Request,res:Response,next:NextFunction){
    const token=req.headers["authorization"] as string
    
    const decoded=jwt.verify(token,JWT_SECRET) as JwtPayload

    if(decoded && typeof decoded.id === "string" ){
      (req as any ).id=decoded.id
        next()
    }else{
        res.json({
            message:"unauthorized"
        })
    }
    

}