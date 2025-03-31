"use client";
import { HTTP_BACKEND_URL } from "@/config";
import axios from "axios";
import { useRouter } from "next/navigation"; 
import { useEffect, useState } from "react";

interface Room {
  id: number;
  slug: string;
}

export const Alluserrooms = ({ slug }: { slug: string }) => {
    const router=useRouter()
  const [rooms, setRooms] = useState<Room[]>([]);

  useEffect(() => {
    if (!slug) return;

    const getRooms = async () => {
      try {
        const response = await axios.get(`${HTTP_BACKEND_URL}/all-rooms`);
        const room = response.data.room;
        setRooms([{ id: room.id, slug: room.slug }]);
      } catch (error) {
        console.error("Error fetching rooms:", error);
      }
    };

    getRooms();
  }, [slug]);

  return <div>
      {rooms.length > 0 ? (
        rooms.map((x) => (
          <div
            key={x.id}
            onClick={() => (router.push( `room/${x.id}`))} 
            className="px-2 py-1 border bg-blue-200 text-black rounded-lg cursor-pointer"
          >
            {x.slug}
          </div>
        ))
      ) : (
        <p>Loading rooms...</p>
      )}
    </div>
  ;
};
