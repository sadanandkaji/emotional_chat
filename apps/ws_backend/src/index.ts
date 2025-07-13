import { WebSocketServer, WebSocket } from "ws";
import jwt from "jsonwebtoken";
import { client } from "@repo/db";

const JWT_SECRET = "1234"; // Replace with process.env.JWT_SECRET in production

interface User {
  ws: WebSocket;
  userid: string;
  room: string[];
}

const wss = new WebSocketServer({ port: 8080 });
const users: User[] = [];

function checkuser(token: string): string | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (typeof decoded === "string" || !decoded || !("id" in decoded)) {
      return null;
    }
    return (decoded as any).id;
  } catch (e) {
    console.error("JWT verification failed:", e);
    return null;
  }
}

wss.on("connection", function connection(ws, req) {
  const url = req.url;
  if (!url) {
    ws.close();
    return;
  }

  const queryparams = new URLSearchParams(url.split("?")[1]);
  const token = queryparams.get("token") as string;
  const userid = checkuser(token);

  if (!userid) {
    ws.close();
    return;
  }

  const user: User = { ws, userid, room: [] };
  users.push(user);
  console.log(`✅ User ${userid} connected`);

  ws.on("close", () => {
    const index = users.findIndex((u) => u.ws === ws);
    if (index !== -1) {
      users.splice(index, 1);
      console.log(`❌ User ${userid} disconnected`);
    }
  });

  ws.on("message", async (data) => {
    let parseddata;
    try {
      parseddata = JSON.parse(data.toString());
    } catch (err) {
      console.error("❌ Invalid JSON:", err);
      return;
    }

    if (parseddata.type === "join-room") {
      user.room.push(parseddata.roomid);
      console.log(`➕ User ${userid} joined room ${parseddata.roomid}`);
    } else if (parseddata.type === "leave-room") {
      user.room = user.room.filter((r) => r !== parseddata.roomid);
      console.log(`➖ User ${userid} left room ${parseddata.roomid}`);
    } else if (parseddata.type === "chat") {
      const { message, roomid } = parseddata;
      const now = new Date().toISOString();

      try {
        // Save message to DB
        await client.chat.create({
          data: {
            message,
            roomid: Number(roomid),
            userid,
          },
        });

        // Fetch username of sender
        const userRecord = await client.user.findUnique({
          where: { id: userid },
          select: { username: true },
        });

        const username = userRecord?.username || "Unknown";

        // Broadcast to all users in the room
        users.forEach((u) => {
          if (u.room.includes(roomid)) {
            u.ws.send(
              JSON.stringify({
                type: "chat",
                message,
                roomid,
                userid,
                username,
                timestamp: now,
              })
            );
          }
        });
      } catch (err) {
        console.error("❌ Failed to store message or fetch username:", err);
      }
    }
  });
});
