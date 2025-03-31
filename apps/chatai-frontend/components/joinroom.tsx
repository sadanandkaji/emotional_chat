"use client"
import { Button } from "@repo/ui/button";
import { Inputelement } from "@repo/ui/inputelement";
import { useState } from "react";
import { X } from "lucide-react";
import axios from "axios";

interface JoinRoomProps {
    onopen: boolean;
    onclose: () => void;
  }
  
export default function Joinroom({onopen ,onclose} :JoinRoomProps  ){
    
  
  
        return<div>
{ onopen && <div>
    <div  className="h-screen w-screen bg-slate-900 fixed top-0 left-0 opacity-60 flex justify-center">

    </div>
 <div  className="h-screen  w-screen fixed top-0 left-0  opacity-90  flex justify-center items-center   ">
        <div className="flex justify-center items-center">

        <div className="h-60 w-80 bg-gray-600 rounded-lg ">
          <div>
            <div className="border-b flex justify-center items-center">
            <div className="text-3xl pr-4 ">join rooms</div>
            <div className="text-lg flex items-center border-1 rounded-lg">
                <button onClick={onclose} ><X/></button>
            </div>
            </div>
            <div className="flex justify-center items-center pt-10">
            <Inputelement  variant="primary"  size="lg" placeholder="roomname" type="text" className="px-2 py-1 bg-gray-500 flex justify-center"></Inputelement>
            </div >
           <div className="flex justify-center items-center pt-10">
            <Button onClick={onclose} variant="primary" className="text-lg  animate-in fade-in slide-in-from-bottom-6 duration-100 delay-50 border  px-8 py-1 border-white hover:bg-gray-500" size="lg" children="join room"></Button>
           </div>

          </div>
        </div>

        </div>

    </div>
    </div>
     }
       
        </div>
   
    
   
}