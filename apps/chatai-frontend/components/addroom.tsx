"use client";

import { Button } from "@repo/ui/button";
import { Inputelement } from "@repo/ui/inputelement";
import { useRef } from "react";
import { X } from "lucide-react";
import axios from "axios";
import { HTTP_BACKEND_URL } from "@/config";
import { roomschema } from "@repo/common";

interface AddRoomProps {
  onopen: boolean;
  onclose: () => void;
}

export const Addroom = ({ onopen, onclose }: AddRoomProps) => {
  const roomref = useRef<HTMLInputElement>(null);

  async function createhandleroom() {
  const roomname = roomref.current?.value || "";
  const parsed = roomschema.safeParse({ roomname });

  if (!parsed.success) {
    alert("Room name must be between 5 and 20 characters.");
    return;
  }

  const token = localStorage.getItem("token"); // or however you store it

  if (!token) {
    alert("User not authenticated");
    return;
  }

  try {
    const res = await axios.post(
      `${HTTP_BACKEND_URL}/create-room`,
      { roomname: parsed.data.roomname },
      {
        headers: {
          Authorization:`${token}`,
        },
      }
    );

    if (res.data.room) {
      console.log("Room created with ID:", res.data.room);
      onclose(); // close modal
    } else {
      alert(res.data.message || "Failed to create room.");
    }
  } catch (e: any) {
    alert(e?.response?.data?.message || "Server error");
    console.error("Create room error:", e);
  }
}


  return (
    <>
      {onopen && (
        <>
          <div className="fixed inset-0 bg-black opacity-60 z-40" />
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="bg-gray-800 rounded-xl shadow-xl p-6 w-96 text-white">
              <div className="flex justify-between items-center border-b pb-3 mb-4">
                <h2 className="text-2xl font-bold">Create Room</h2>
                <button onClick={onclose}>
                  <X className="w-6 h-6 hover:text-red-400" />
                </button>
              </div>

              <Inputelement
                reference={roomref}
                placeholder="Room name"
                type="text"
                variant="primary"
                size="lg"
                className="w-full mb-4 p-2 bg-gray-700 rounded"
              />

              <Button
                onClick={createhandleroom}
                variant="primary"
                size="lg"
                className="w-full border border-white bg-gray-600 hover:bg-gray-500"
              >
                Create Room
              </Button>
            </div>
          </div>
        </>
      )}
    </>
  );
};
