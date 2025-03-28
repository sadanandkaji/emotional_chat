import { Button } from "@repo/ui/button";

export default function ChatApp(){

    return<div>
        <div className="h-screen w-screen bg-gray-600 flex ">
            <div className="w-80 h-screen bg-black">
               <div className="h-15 border-b text-4xl flex items-center pl-10">
                 chatai
               </div>
               <div className="pt-6 pl-8" >
                <div className="pb-3">
               <Button variant="primary" className="text-lg  animate-in fade-in slide-in-from-bottom-6 duration-100 delay-50 border  px-8 py-1 border-white hover:bg-gray-500" size="lg" children="add-room" ></Button>
                </div>
               <Button variant="primary" className="text-lg  animate-in fade-in slide-in-from-bottom-6 duration-100 delay-50 border px-8 py-1 border-white hover:bg-gray-500" size="lg" children="join-room" ></Button>

               </div>
            </div>
           <div className="" >
            <div className="h-15 w-310  bg-black border">

            </div>
           </div>
           
            </div>

        </div>
   

}