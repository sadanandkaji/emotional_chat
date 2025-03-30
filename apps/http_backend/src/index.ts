import express from "express"
import cors from "cors"
import {createuserschema,roomschema,signinschema} from "@repo/common/types"
import {client} from "@repo/db/client"
import jwt from "jsonwebtoken"
import {JWT_SECRET} from "@repo/backend_common/secret"
import { usermiddleware } from "./middleware/usermiddleware"

const app=express()
app.use(express.json())
app.use(cors())

app.post("/signup" ,async (req,res)=>{
    const parseddata=createuserschema.safeParse(req.body)
    if(!parseddata.success){
        res.json({
            message:"icorrect inputs"
        })
        return;
    }
    try{

        const user=await client.user.create({
            data:{
                email:parseddata.data.username,
                username:parseddata.data.name,
                password:parseddata.data.password
            }
        })
        res.json({
            message:"user created"
        })
    }catch(e){
        res.json({
            message:"user already exits"
        })
    }

})

app.post("/signin",async (req,res)=>{
    const parseddata=signinschema.safeParse(req.body)

    if(!parseddata.success){
        res.json({
            message:"incorrect inputs"
        })
    }

        const user=await client.user.findFirst({
            where:{
                email:parseddata.data?.username,
                password:parseddata.data?.password
            }
        })

    const token=jwt.sign({
        id:user?.id
    },JWT_SECRET)

    res.json({
        token:token
    })
})

app.post("/create-room",usermiddleware,async (req,res)=>{
    const parseddata=roomschema.safeParse(req.body)
    if(!parseddata.success){
        res.json({
            message:"incorrect inputs"
        })
        return
    }
     const userid=(req as any ).id
    try{
       const  room =await client.rooms.create({
        data:{
            slug:parseddata.data?.roomname,
            userid:userid
        }
       })
       res.json({
        room: room.id
       })
    }catch{
        res.json({
            message:"room name already exists"
        })
    }
})
app.get("/chats/:roomid",usermiddleware,async (req,res)=>{
    const roomid= Number (req.params.roomid )
    
    try{
        const chats=client.chat.findMany({
            where:{
                roomid:roomid

            },orderBy:{
                id:"desc"
            },take:30

        })
        res.json({
            chats:chats
        })
    }catch{
        res.json({
            chats:[]
        })
    }
})

app.get("/room/:slug",(req,res)=>{
    try{
        const slug=req.params.slug
        const room =client.rooms.findFirst({
            where:{
                slug:slug
            }

        })
        res.json({
            room:room
        })
    }catch{
        res.json({
            message:"no room exists"
        })
    }

})
app.listen(3001)