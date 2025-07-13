"use client";

import { HTTP_BACKEND_URL, WS_BACKEND_URL } from "@/config";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { Addroom } from "./addroom";
import Joinroom from "./joinroom";
import { Button } from "@repo/ui/button";
import { PlusIcon, Bot, ArrowLeft, Menu } from "lucide-react";

interface Room {
  id: number;
  slug: string;
  userid: string;
}

interface ChatMessage {
  id?: number;
  message: string;
  roomid: string;
  userid?: string;
  username?: string;
  type?: "chat";
  timestamp?: string;
}

interface JwtPayload {
  id: string;
  iat: number;
}

export const Alluserrooms = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [joinedRooms, setJoinedRooms] = useState<Room[]>([]);
  const [allRooms, setAllRooms] = useState<Room[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [addRoomOpen, setAddRoomOpen] = useState(false);
  const [joinRoomOpen, setJoinRoomOpen] = useState(false);
  const [roomId, setRoomId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [userId, setUserId] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const wsRef = useRef<WebSocket | null>(null);
  const tokenRef = useRef<string | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    tokenRef.current = token;
    if (token) {
      const decoded = jwtDecode<JwtPayload>(token);
      setUserId(decoded.id);
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const [userRes, allRes, joinedRes] = await Promise.all([
          axios.get(`${HTTP_BACKEND_URL}/user-rooms`, {
            headers: { Authorization: `${token}` },
          }),
          axios.get(`${HTTP_BACKEND_URL}/rooms`),
          axios.get(`${HTTP_BACKEND_URL}/joined-rooms`, {
            headers: { Authorization: `${token}` },
          }),
        ]);
        setRooms(userRes.data.rooms);
        setAllRooms(allRes.data.rooms);
        setJoinedRooms(joinedRes.data.rooms);
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (!selectedRoom) return;

    const fetchRoomIdAndMessages = async () => {
      try {
        const res = await axios.get(`${HTTP_BACKEND_URL}/room/${selectedRoom.slug}`, {
          headers: { Authorization: tokenRef.current || "" },
        });
        const room = res.data.room;
        const rid = room.id.toString();
        setRoomId(rid);

        const chatRes = await axios.get(`${HTTP_BACKEND_URL}/chats/${rid}`, {
          headers: { Authorization: tokenRef.current || "" },
        });

setMessages(chatRes.data.chats);
      } catch (err) {
        console.error("Failed to load room/messages:", err);
      }
    };

    fetchRoomIdAndMessages();
  }, [selectedRoom]);

  useEffect(() => {
    if (!roomId || !tokenRef.current) return;

    const ws = new WebSocket(`${WS_BACKEND_URL}?token=${tokenRef.current}`);
    wsRef.current = ws;

    ws.onopen = () => {
      ws.send(JSON.stringify({ type: "join-room", roomid: roomId }));
    };

    ws.onmessage = (event) => {
      const data: ChatMessage = JSON.parse(event.data);
      if (data.type === "chat") {
        setMessages((prev) => {
          if (
            data.message.toLowerCase().includes("joined the room") &&
            prev.some((msg) => msg.message === data.message)
          ) {
            return prev;
          }
          return [...prev, data];
        });
      }
    };

    return () => {
      ws.send(JSON.stringify({ type: "leave-room", roomid: roomId }));
      ws.close();
    };
  }, [roomId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (wsRef.current && roomId && input.trim() && userId) {
      const msg: ChatMessage = {
        type: "chat",
        roomid: roomId,
        message: input.trim(),
        
        timestamp: new Date().toISOString(),
      };
      wsRef.current.send(JSON.stringify(msg));
      setInput("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") sendMessage();
  };

  const formatTime = (iso?: string) => {
    if (!iso) return "";
    const date = new Date(iso);
    return new Intl.DateTimeFormat("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }).format(date);
  };

  return (
    <div className="flex h-screen bg-[#0d1117] text-white">
      <div className={`transition-all duration-300 border-r border-gray-700 overflow-y-auto bg-[#0d1117] ${sidebarOpen ? "w-1/4 p-5" : "w-0 p-0 overflow-hidden"}`}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Chat Rooms</h2>
          <button onClick={() => setSidebarOpen(false)} className="text-gray-400 hover:text-white">
            <ArrowLeft />
          </button>
        </div>

        <div className="mb-6">
          <h3 className="text-sm uppercase text-gray-400 mb-2">My Created Rooms</h3>
          {rooms.map((room) => (
            <div
              key={room.id}
              className={`p-2 mb-1 rounded text-sm bg-gray-800 text-white border border-gray-700`}
            >
              {room.slug}
            </div>
          ))}
        </div>

        <div className="mb-6">
          <h3 className="text-sm uppercase text-gray-400 mb-2">My Joined Rooms</h3>
          {joinedRooms.map((room) => (
            <div
              key={room.id}
              onClick={() => setSelectedRoom(room)}
              className={`p-2 mb-1 rounded cursor-pointer text-sm ${selectedRoom?.id === room.id ? "bg-yellow-400 text-black" : "bg-gray-800 hover:bg-gray-700"}`}
            >
              {room.slug}
            </div>
          ))}
        </div>

        <div>
          <h3 className="text-sm uppercase text-gray-400 mb-2">All Rooms</h3>
          {allRooms.map((room) => (
            <div
              key={room.id}
              className="p-2 mb-1 rounded text-sm bg-gray-900 text-white border border-gray-700 cursor-default"
            >
              {room.slug}
            </div>
          ))}
        </div>
      </div>

      {!sidebarOpen && (
        <button onClick={() => setSidebarOpen(true)} className="absolute top-4 left-4 z-10 bg-gray-800 text-white p-2 rounded-md hover:bg-gray-700">
          <Menu size={20} />
        </button>
      )}

      <div className="flex-1 p-6 flex flex-col transition-all duration-300">
        <div className="flex justify-between items-center mb-4">
          <div className="text-2xl font-semibold">
            {selectedRoom ? `Room: ${selectedRoom.slug}` : "Select a room to start chatting"}
          </div>
          <div className="flex gap-3">
            <Button onClick={() => setAddRoomOpen(true)} size="lg" variant="not">
              <PlusIcon className="mr-1" /> Add
            </Button>
            <Button onClick={() => setJoinRoomOpen(true)} size="lg" variant="not">
              <PlusIcon className="mr-1" /> Join
            </Button>
            <Button onClick={() => (window.location.href = "/aicompanion")} size="lg" variant="not">
              <Bot className="mr-1" /> Stero
            </Button>
          </div>
        </div>

        <Addroom onopen={addRoomOpen} onclose={() => setAddRoomOpen(false)} />
        <Joinroom
          onopen={joinRoomOpen}
          onclose={() => setJoinRoomOpen(false)}
          onRoomJoined={(room) => {
            if (!room || !room.id) return;
            setAllRooms((prev) => (prev.find((r) => r.id === room.id) ? prev : [room, ...prev]));
            setJoinedRooms((prev) => (prev.find((r) => r.id === room.id) ? prev : [room, ...prev]));
            setSelectedRoom(room);
          }}
        />

        {selectedRoom && (
          <>
            <div className="flex-1 overflow-y-auto flex flex-col space-y-2">
              {messages.map((msg, idx) => {
                const isRight = msg.userid === userId;
                const isSystemMsg = msg.message.toLowerCase().includes("joined the room");

                return (
                  <div key={idx} className={`flex ${isRight ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`max-w-[80%] px-4 py-2 text-sm rounded-xl shadow-sm ${
                        isSystemMsg
                          ? "bg-yellow-100 text-black mx-auto text-center"
                          : isRight
                          ? "bg-green-500 text-black rounded-br-none"
                          : "bg-gray-200 text-black rounded-bl-none"
                      }`}
                    >
                      {!isSystemMsg && msg.username && (
                        <div className="text-xs font-semibold mb-1 text-gray-700">
                          {msg.username}
                        </div>
                      )}
                      <div>{msg.message}</div>
                      {!isSystemMsg && (
                        <div className="text-[10px] text-right opacity-60 mt-1">
                          {formatTime(msg.timestamp)}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
              <div ref={bottomRef} />
            </div>

            <div className="mt-4 flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                className="flex-1 px-4 py-2 rounded-full border border-gray-700 bg-gray-800 text-white text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
                placeholder="Type a message"
              />
              <button
                onClick={sendMessage}
                disabled={!input.trim()}
                className="bg-green-500 hover:bg-green-600 text-black px-4 py-2 rounded-full text-sm font-medium transition disabled:opacity-40"
              >
                Send
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
