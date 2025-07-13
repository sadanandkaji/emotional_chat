"use client"
import {Button} from "@repo/ui/button"
import {Inputelement} from "@repo/ui/inputelement"
import { HTTP_BACKEND_URL } from "@/config"
import { useRef } from "react"
import axios from "axios"
import {createuserschema} from "@repo/common"
import { useRouter } from "next/navigation"


export default  function signup(){
    
    const emailref=useRef<HTMLInputElement>(null)
    const passwordref=useRef<HTMLInputElement>(null)
    const usernameref=useRef<HTMLInputElement>(null)
    const router=useRouter()

    const handleSignup = async () => {
        const parseddata=createuserschema.safeParse({
            username:emailref.current?.value,
            password:passwordref.current?.value,
            name:usernameref.current?.value
            
        })
        console.log(parseddata.data)
        if(!parseddata.success){
            alert("Invalid data")
           
            return;
        }else{
            try {
                const response = await axios.post(`${HTTP_BACKEND_URL}/signup`, {
                    username:parseddata.data.username,
                    name:parseddata.data.name,
                    password:parseddata.data.password
                });
                router.push("/signin")
    
                console.log(response.data);
            } catch (error) {
                console.error("Signup failed:", error);
                
            }}
        }
       
     
    

    return<div className="w-screen h-screen flex justify-center items-center bg-black" >
       
            <div className="h-80 w-80 bg-gray-800 rounded-lg  ">
            <div className="text-2xl flex justify-center pb-4 pt-4 shadow-xl text-blue-400  " >login</div>
        <div >
            <div className=" flex justify-center pt-3 pb-3"><Inputelement reference={emailref} variant="primary"className=" bg-gray-800  text-white shadow-xl px-3" placeholder="email" type="text" size="sm" ></Inputelement> </div>
           <div  className="flex justify-center pb-3"><Inputelement reference={usernameref} variant="primary" className="bg-gray-800  text-white shadow-xl" type="text" placeholder="username"  size="sm"></Inputelement></div>
           <div  className="flex justify-center "><Inputelement reference={passwordref} className="bg-gray-800  text-white shadow-xl" variant="primary" type="password" placeholder="password"  size="sm"></Inputelement></div>
            <div className="flex justify-center pt-3">
            <Button onClick={handleSignup} variant="send" children={"login"} className="bg-blue-600 text-lg text-white px-8 py-2  border border-gray-600 shadow-2xl cursor-pointer hover:bg-blue-800" size="sm"></Button>
            </div>
            <div className="flex justify-center">
            <div>
                <div className="text-gray-300 border-b border-white pt-2 cursor-pointer hover:text-red-600 hover:border-red-600 "
                onClick={()=>{
                    router.push("/signin")
                }}>
                already have account
                </div>
               
            </div>
            </div>
                
        </div>
        
       
        </div>
        

    </div>

}
