"use client"
import{ Addroom }from "@/components/addroom";
import Joinroom from "@/components/joinroom";
import { Button } from "@repo/ui/button";
import { useState } from "react";
import axios from "axios";

export default function ChatApp(){
    const [addroom,setaddroom]=useState(false)
    const [joinroom ,setjoinroom]=useState(false)
    
    function showroomon(){
      setaddroom(true) 
    }
    function joinroomon(){
      setjoinroom(true)
    }

  
      return<div className={`h-screen w-screen bg-gray-600 flex fixed  `} >
    <Addroom onopen={addroom } onclose={()=>{setaddroom(false)}}  ></Addroom>
    <Joinroom onopen={ joinroom} onclose={()=>{setjoinroom(false)}}></Joinroom>
       <div className="flex">

            <div className="w-80 h-screen bg-black">
               <div className="h-15 border-b text-4xl flex items-center pl-10">
                 chatai
               </div>
               <div className="pt-6 pl-8" >
                <div className="pb-3">
               <Button variant="primary" onClick={showroomon} className="text-lg  animate-in fade-in slide-in-from-bottom-6 duration-100 delay-50 border  px-8 py-1 border-white hover:bg-gray-500" size="lg" children="add-room" ></Button>
                </div>

               <Button variant="primary" onClick={joinroomon} className="text-lg  animate-in fade-in slide-in-from-bottom-6 duration-100 delay-50 border px-8 py-1 border-white hover:bg-gray-500" size="lg" children="join-room" ></Button>
            </div>
               </div>

           <div className="" >
            <div className="h-15 w-310  bg-black border"> </div>

            </div>
       </div>
           </div>
         
           
}