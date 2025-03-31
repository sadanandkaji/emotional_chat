"use client"
import { WS_BACKEND_URL } from "@/config"
import {Button} from "@repo/ui/button"
import {Inputelement} from "@repo/ui/inputelement"
import axios from "axios"
import { useRef } from "react"
import { signinschema } from "@repo/common/types"

export default async  function signin(){
    const emailref=useRef<HTMLInputElement>(null)
    const passwordref=useRef<HTMLInputElement>(null)

    const handlesignin=async ()=>{
    const parseddata=signinschema.safeParse({
        username:emailref.current?.value,
        password:passwordref.current?.value
    })
    if(!parseddata.success){
        alert("incorrect inputs")
    }else{     
        try{
            
            const response= await axios.post(`${WS_BACKEND_URL}/signin`,{
                email:parseddata.data.username,
                password:parseddata.data.password
            }
        )
        console.log(response)
        
    }catch(e){
        console.error("signin failed",e)
    }
}
}

    

    return<div className="w-screen h-screen flex justify-center items-center" >
       
            <div className="h-80 w-80 bg-gray-800 rounded-lg  ">
            <div className="text-2xl flex justify-center pb-4 pt-4 shadow-xl text-blue-400  " >signin</div>
        <div >
            <div className=" flex justify-center pt-8 pb-3"><Inputelement reference={emailref} variant="primary"className="bg-gray-800 shadow-xl" placeholder="email" type="text" size="sm" ></Inputelement> </div>
           <div  className="flex justify-center "><Inputelement reference={passwordref} className="bg-gray-800 shadow-xl" variant="primary" type="password" placeholder="password"  size="sm"></Inputelement></div>
            <div className="flex justify-center pt-6">
            <Button onClick={handlesignin} variant="send" children={"signin"} className="bg-blue-600 text-lg text-black px-8 py-2  border border-gray-600 shadow-2xl" size="sm"></Button>
            </div>
                
        </div>
       
        </div>
        

    </div>
}