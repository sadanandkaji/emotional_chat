"use client";

import { Button } from "@repo/ui/button";
import { Inputelement } from "@repo/ui/inputelement";
import { useEffect, useRef, useState } from "react";
import { X, CheckCircle } from "lucide-react";
import axios from "axios";
import { HTTP_BACKEND_URL } from "@/config";

interface JoinRoomProps {
  onopen: boolean;
  onclose: () => void;
  onRoomJoined: (room: { id: number; slug: string; userid: string }) => void;
}

export default function Joinroom({ onopen, onclose, onRoomJoined }: JoinRoomProps) {
  const roomref = useRef<HTMLInputElement>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (onopen) {
      roomref.current?.focus();
    }
  }, [onopen]);

  async function handleJoinRoom() {
    const roomname = roomref.current?.value.trim() || "";

    if (!roomname || roomname.length < 5 || roomname.length > 20) {
      alert("Room name must be between 5 and 20 characters.");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      alert("You must be signed in.");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(
        `${HTTP_BACKEND_URL}/join-room`,
        { roomname },
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );

      if (res.data.success && res.data.room) {
        setSuccess(true);
        roomref.current!.value = "";
        onRoomJoined(res.data.room);

        setTimeout(() => {
          setSuccess(false);
          onclose();
        }, 2000);
      } else {
        alert(res.data.message || "Failed to join room.");
      }
    } catch (e: any) {
      alert(e?.response?.data?.message || "Server error");
      console.error("Join room error:", e);
    } finally {
      setLoading(false);
    }
  }

  return onopen ? (
    <>
      <div className="fixed inset-0 bg-black opacity-60 z-40" />
      <div className="fixed inset-0 flex justify-center items-center z-50">
        <div className="w-96 bg-gray-700 rounded-lg p-6 text-white shadow-xl relative">
          <div className="flex justify-between items-center border-b pb-3 mb-4">
            <h2 className="text-2xl font-semibold">Join Room</h2>
            <button onClick={onclose}>
              <X className="w-6 h-6 hover:text-red-400" />
            </button>
          </div>

          {!success ? (
            <>
              <Inputelement
                reference={roomref}
                variant="primary"
                size="lg"
                placeholder="Room name"
                type="text"
                className="w-full p-2 mb-4 bg-gray-600 rounded"
              />
              <Button
                onClick={handleJoinRoom}
                variant="primary"
                size="lg"
                disabled={loading}
                className="w-full bg-gray-600 hover:bg-gray-500 border border-white"
              >
                {loading ? "Joining..." : "Join Room"}
              </Button>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center p-10 text-green-400">
              <CheckCircle className="w-16 h-16 mb-4" />
              <p className="text-xl font-semibold">Joined Successfully!</p>
            </div>
          )}
        </div>
      </div>
    </>
  ) : null;
}
