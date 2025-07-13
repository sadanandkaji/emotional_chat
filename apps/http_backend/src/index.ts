import express, { Request, Response } from "express";
import cors from "cors";
import jwt from "jsonwebtoken";

import { createuserschema, roomschema, signinschema } from "@repo/common";
import { client } from "@repo/db";
import { usermiddleware } from "./middleware/usermiddleware";

const JWT_SECRET = "1234";
const app = express();
app.use(express.json());
app.use(cors());

interface AuthenticatedRequest extends Request {
  id: string;
}

// -------------------- Signup --------------------
app.post("/signup", async (req:any, res:any) => {
  const parsed = createuserschema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: "Incorrect inputs" });
  }

  try {
    await client.user.create({
      data: {
        email: parsed.data.username,
        username: parsed.data.name,
        password: parsed.data.password,
      },
    });
    return res.status(201).json({ message: "User created" });
  } catch (e) {
    return res.status(409).json({ message: "User already exists" });
  }
});

// -------------------- Signin --------------------
app.post("/signin", async (req:any, res:any) => {
  const parsed = signinschema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: "Incorrect inputs" });
  }

  const user = await client.user.findFirst({
    where: {
      email: parsed.data.username,
      password: parsed.data.password,
    },
  });

  if (!user) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = jwt.sign({ id: user.id }, JWT_SECRET);
  return res.status(200).json({ token });
});

// -------------------- Create Room --------------------
app.post("/create-room", usermiddleware, async (req: any, res:any) => {
  const parsed = roomschema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: "Invalid room name" });
  }

  try {
    const room = await client.rooms.create({
      data: {
        slug: parsed.data.roomname,
        userid: req.id,
      },
    });
    return res.status(201).json({ room: room.id });
  } catch (e) {
    return res.status(409).json({ message: "Room name already exists" });
  }
});

// -------------------- Join Room --------------------
app.post("/join-room", usermiddleware, async (req: any, res:any) => {
  const { roomname } = req.body;
  if (!roomname || roomname.length < 5 || roomname.length > 20) {
    return res.status(400).json({ message: "Invalid room name" });
  }

  const room = await client.rooms.findUnique({
    where: { slug: roomname },
    select: { id: true, slug: true, userid: true },
  });

  if (!room) {
    return res.status(404).json({ message: "Room not found" });
  }

  const user = await client.user.findUnique({ where: { id: req.id } });

  // Add to joinedRooms if not already joined
  await client.joinedRoom.upsert({
    where: { userId_roomId: { userId: req.id, roomId: room.id } },
    update: {},
    create: { userId: req.id, roomId: room.id },
  });

  await client.chat.create({
    data: {
      roomid: room.id,
      userid: req.id,
      message: `${user?.username || "Someone"} joined the room.`,
    },
  });

  return res.status(200).json({ success: true, roomId: room.id, room });
});

// -------------------- Get All Public Rooms --------------------
app.get("/rooms", async (_req, res) => {
  const rooms = await client.rooms.findMany({ orderBy: { id: "desc" } });
  res.status(200).json({ rooms });
});

// -------------------- Get Rooms Created by User --------------------
app.get("/user-rooms", usermiddleware, async (req: any, res:any) => {
  const rooms = await client.rooms.findMany({
    where: { userid: req.id },
    orderBy: { id: "desc" },
  });
  res.status(200).json({ rooms });
});

// -------------------- Get Rooms Joined by User --------------------
app.get("/joined-rooms", usermiddleware, async (req: any, res:any) => {
  try {
    const joined = await client.joinedRoom.findMany({
      where: { userId: req.id },
      include: { room: true },
      orderBy: { id: "desc" },
    });

    const rooms = joined.map((j) => j.room);
    res.status(200).json({ rooms });
  } catch (error) {
    res.status(500).json({ message: "Could not fetch joined rooms" });
  }
});

// -------------------- Get Room Details by Slug --------------------
app.get("/room/:slug", usermiddleware, async (req: any, res:any) => {
  const slug = req.params.slug;

  const room = await client.rooms.findFirst({
    where: { slug },
    select: { id: true, slug: true, userid: true },
  });

  if (!room) {
    return res.status(404).json({ message: "Room not found" });
  }

  res.status(200).json({ room });
});

// -------------------- Get Chats for Room --------------------
app.get("/chats/:roomid", usermiddleware, async (req: any, res:any) => {
  const roomid = Number(req.params.roomid);

  const chats = await client.chat.findMany({
    where: { roomid },
    orderBy: { id: "asc" },
    include: { user: { select: { username: true } } },
  });

  const formattedChats = chats.map((chat) => ({
    id: chat.id,
    message: chat.message,
    roomid: chat.roomid,
    userid: chat.userid,
    username: chat.user.username,
    timestamp: chat.createdAt.toISOString(),
    type: "chat",
  }));

  res.status(200).json({ chats: formattedChats });
});

// -------------------- Store AI Chat --------------------
app.post("/ai-chat", usermiddleware, async (req: any, res:any) => {
  const { message, response } = req.body;
  if (!message || !response) {
    return res.status(400).json({ message: "Message and response required" });
  }

  await client.aIChat.create({
    data: {
      userId: req.id,
      message,
      response,
    },
  });

  res.status(201).json({ message: "AI chat stored successfully" });
});

// -------------------- Get AI Chats --------------------
app.get("/ai-chats", usermiddleware, async (req: any, res:any) => {
  const chats = await client.aIChat.findMany({
    where: { userId: req.id },
    orderBy: { createdAt: "desc" },
  });

  res.status(200).json({ chats });
});

// -------------------- Start Server --------------------
app.listen(3001, () => {
  console.log("🚀 HTTP server running on http://localhost:3001");
});
