"use client"
import{ Addroom }from "@/components/addroom";
import Joinroom from "@/components/joinroom";
import { Button } from "@repo/ui/button";
import { useState } from "react";
import axios from "axios";
import { HTTP_BACKEND_URL } from "@/config";
import { Alluserrooms } from "@/components/userrooom";


async function getRoomId(slug:string) {
  const response = await axios.get(`${HTTP_BACKEND_URL}/room/${slug}`)
  console.log(response.data);
  return response.data.room.id;
}
export const Sidebar= ({slug}:{slug:string})=>{
     
   
//   const slug=(await params).slug
 

    const [addroom,setaddroom]=useState(false)
    const [joinroom ,setjoinroom]=useState(false)
    
    function showroomon(){
      setaddroom(true) 
    }
    function joinroomon(){
      setjoinroom(true)
    }

  
      return<div>
    <Addroom onopen={addroom } onclose={()=>{setaddroom(false)}}  ></Addroom>
    <Joinroom onopen={ joinroom} onclose={()=>{setjoinroom(false)}  }></Joinroom>
       <div className="flex">

            <div className="w-80 h-screen bg-black">
               <div className="h-15 border-b text-4xl flex items-center pl-10">
                 chatai
               </div>
               <div className="pt-6 pl-8" >
                <div className="pb-3">
               <Button variant="primary" onClick={showroomon} className="text-lg  animate-in fade-in slide-in-from-bottom-6 duration-100 delay-50 border  px-8 py-1 border-white hover:bg-gray-500" size="lg" children="add-room" ></Button>
                </div>
                <div className="border-b pb-2">
                 <Button variant="primary" onClick={joinroomon} className="text-lg  animate-in fade-in slide-in-from-bottom-6 duration-100 delay-50 border px-8 py-1 border-white hover:bg-gray-500" size="lg" children="join-room" ></Button>
                 </div>
                 <div className="pt-3">

                 <div className=" p-2 rounded-lg  pr-4 pl-5 ">
                 <div className="pl-8">USERS</div>
           <Alluserrooms slug={slug} ></Alluserrooms>
                 </div>
                 </div>
            </div>
               </div>

         
       </div>
           </div>
         
           
}