"use client";
import { HTTP_BACKEND_URL } from "@/config";
import axios from "axios";
import { useRouter } from "next/navigation"; 
import { useEffect, useState } from "react";

interface Room {
  id: number,
  slug:string
}

export const Alluserrooms = ({ slug }: { slug: string }) => {
    const router=useRouter()
  const [rooms, setRooms] = useState<Room[]>([]);

 

   
  useEffect(() => {
    const getRooms = async () => {
      try {
        const response = await axios.get(`${HTTP_BACKEND_URL}/all-rooms`,{
          
        });
        const roomsData = response.data.rooms;
        setRooms(roomsData); 
        console.log("Fetched Rooms:", roomsData);
      } catch (error) {
        console.error("Error fetching rooms:", error);
      }
    };

    getRooms();
  }, []);

  return (
    <div>
      {rooms.length > 0 ? (
        rooms.map((x) => (
          <div  key={x.id} className="px-6 py-1 rounded-lg hover:bg-gray-700">
          <div
           
            onClick={() => router.push(`room/${x.id}`)}
            className="px-2 py-2 border bg-blue-200 text-black rounded-lg cursor-pointer"
          >
             {x.slug} 
          </div>
          </div>
        ))
      ) : (
        <p>Loading rooms...</p>
      )}
    </div>
  );
  
};
