"use client"
import { HTTP_BACKEND_URL, WS_BACKEND_URL } from "@/config"
import {Button} from "@repo/ui/button"
import {Inputelement} from "@repo/ui/inputelement"
import axios from "axios"
import { useRef } from "react"
import { signinschema } from "@repo/common"
import { useRouter } from "next/navigation"

export default  function signin(){
    const emailref=useRef<HTMLInputElement>(null)
    const passwordref=useRef<HTMLInputElement>(null)
    const router=useRouter()

    const handlesignin=async ()=>{
    const parseddata=signinschema.safeParse({
        username:emailref.current?.value,
        password:passwordref.current?.value
    })
    if(!parseddata.success){
        alert("incorrect inputs")
    }else{     
        try{
            
            const response= await axios.post(`${HTTP_BACKEND_URL}/signin`,{
                username:parseddata.data.username,
                password:parseddata.data.password
            }
        )
        const token=response.data.token;
        localStorage.setItem("token",token)
        router.push("/")

        console.log("token:" ,response.data.token)
        
    }catch(e){
        console.error("signin failed",e)
    }
}
}

    

    return<div className="w-screen h-screen flex justify-center items-center bg-black" >
       
            <div className="h-80 w-80 bg-gray-800 rounded-lg  ">
            <div className="text-2xl flex justify-center pb-4 pt-4 shadow-xl text-blue-400  " >signin</div>
        <div >
            <div className=" flex justify-center pt-8 pb-3"><Inputelement reference={emailref} variant="primary"className="bg-gray-800 text-white  shadow-xl" placeholder="email" type="text" size="sm" ></Inputelement> </div>
           <div  className="flex justify-center "><Inputelement reference={passwordref} className="bg-gray-800   text-white shadow-xl" variant="primary" type="password" placeholder="password"  size="sm"></Inputelement></div>
            <div className="flex justify-center pt-6 ">
            <Button onClick={handlesignin} variant="send" children={"signin"} className="bg-blue-600 text-lg text-white px-8 py-2  border border-gray-600 shadow-2xl cursor-pointer hover:bg-blue-800" size="sm"></Button>
            </div>
                
        </div>
        <div className="flex justify-center">

                <div className="text-gray-300 border-b border-white pt-2 cursor-pointer hover:text-red-600 hover:border-red-600 "
                onClick={()=>{
                    router.push("/signup")
                }}>
                create account
                </div>
        </div>
               
            </div>
         <div>
       
        </div>
        

    </div>
}