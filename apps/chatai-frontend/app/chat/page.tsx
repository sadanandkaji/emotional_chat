import{ Addroom }from "@/components/addroom";
import Joinroom from "@/components/joinroom";
import { Button } from "@repo/ui/button";
import { useState } from "react";
import axios from "axios";
import { HTTP_BACKEND_URL } from "@/config";
import { Alluserrooms } from "@/components/userrooom";
import { Sidebar } from "@/components/sidebar";


async function getRoomId(slug:string) {
  const response = await axios.get(`${HTTP_BACKEND_URL}/room/${slug}`)
  console.log(response.data);
  return response.data.room.id;
}
export default async function ChatApp({params}:{params:{slug:string}}){
     
   
  const slug=(await params).slug as string
  const roomid= getRoomId(slug)

      return<div className={``} >
       <div className="flex">
        <div  className={`h-screen w-screen bg-gray-600 flex fixed`} >
   <Sidebar slug={slug} ></Sidebar>

        </div>

           <div className="" >
            <div className="h-15 w-310  bg-black border"> </div>
hi
            </div>
       </div>
           </div>
         
           
}