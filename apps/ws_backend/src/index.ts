import { WebSocketServer ,WebSocket} from "ws";
import {JWT_SECRET} from "@repo/backend_common/secret"
import jwt, { JwtPayload }  from "jsonwebtoken";
import {client} from "@repo/db/client"


const wss=new WebSocketServer({port:8080})


interface User{
    ws:WebSocket,
    userid:string,
    room:string[]

}

const users:User[]=[]

function checkuser(token:string): string | null{
try{

    const decoded=jwt.verify(token,JWT_SECRET)
    if(typeof decoded == "string"){
        return null
    }
    if(!decoded || !decoded.id){
        return null
    }
    return decoded.id
}catch(e){
    return null
}

}

wss.on("connection", function connection(ws,req){
    const url=req.url
    if(!url){
        return 
    }
    const queryparams=new URLSearchParams(url.split("?")[1])
    const token=queryparams.get("token")as string
     const userid=  checkuser(token)
     if(userid == null){
        ws.close()
        return null;
     }
     users.push({
        ws,
        userid,
        room:[]
     })

     ws.on("message",async function message(data){
        let parseddata
          if(typeof data !== "string"){
        parseddata=JSON.parse(data.toString())
          }else{
            parseddata=JSON.parse(data)
          }

          if(parseddata.type == "join-room" ){
            const user=users.find(x=>(x.ws == ws ))
            user?.room.push(parseddata.roomid)
          }
          if(parseddata.type == "leave-room"){
            const user=users.find(x=>(x.ws==ws))
            if(!user){
                return
            }
           user.room= user?.room.filter(x =>(x == parseddata.roomid))

          }

          if(parseddata.type == "chat"){
            const message=parseddata.message
            const roomid=parseddata.roomid
        await client.chat.create({
            data:{
                message,
                roomid:Number(roomid),
                userid
            }
        })
        users.forEach(user =>{
        if(user.room.includes(roomid)){
            user.ws.send(JSON.stringify({
                type:"chat",
                message:message,
                roomid:roomid
            }))
        }
        }
     )}
     })

})