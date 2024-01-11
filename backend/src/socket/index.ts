import { Server, Socket } from "socket.io";
import { Message } from "../types";
import { Server as HttpServer } from "http";
export const initSocket = (server: HttpServer) => {
  const io = new Server(server, {
    cors: {
      origin: ["http://localhost:5173", "http://10.222.245.188:5173"],
      methods: ["GET", "POST", "PUT"],
    },

    connectionStateRecovery: {},
  });


  io.on("connection", (socket) => {
    console.log("a user connected");
  
    socket.on("reconnect", () => {
      console.log("reconnecting");
    });

    socket.on("chat message", (msg) => {
      io.emit("chat message", msg);
      console.log("message: " + msg);
    });
  
    socket.on("disconnect", (msg) => {
      console.log("disconnected: " + msg);
    });

    socket.on("create", (partyID ) => {
      socket.join(partyID);
  
    });
    socket.on("join", (partyID, user ) => {
      socket.join(partyID);
      console.log(`${user} joined party ${partyID}`);
    });
  
    socket.on("leave", (partyID, user) => {
      socket.leave(partyID);
      io.to(partyID).emit("switch_host");
      console.log(`${user} left party ${partyID}`);
    });
  
    socket.on("play", (partyID) => {
      io.to(partyID).emit("play");
    });
  
    socket.on("pause", (partyID) => {
      io.to(partyID).emit("pause");
    });
  
    socket.on("search", (partyID, youtubeID) => {
      io.to(partyID).emit("search", youtubeID);
    });
  
    socket.on("duration", (partyID, seconds) => {
      io.to(partyID).emit("duration", seconds);
    });
  
    socket.on("assign_host", (partyID, newHost) => {
      io.to(partyID).emit("assign_host", newHost);
    });
    socket.on("chat",(partyID,message:Message)=>{
        socket.broadcast.to(partyID).emit("chat",message)
    })
  });
};

function joinParty(partyID: string, user: string, socket: Socket) {
  socket.join(partyID);
  console.log(`${user} joined party ${partyID}`);
}

const leaveParty = (
  partyID: string,
  user: string,
  socket: Socket,
  io: Server
) => {
  socket.leave(partyID);
  io.to(partyID).emit("switch_host");
  console.log(`${user} left party ${partyID}`);
};

const createParty = (partyID: string, socket: Socket) => {
  socket.join(partyID);
};
const assignHost = (partyID: string, newHost: string, io: Server) => {
  io.to(partyID).emit("assign_host", newHost);
};

const playVideo = (partyID: string, io: Server) => {
  io.to(partyID).emit("play");
};
const pauseVideo = (partyID: string, io: Server) => {
  io.to(partyID).emit("pause");
};
const searchVideo = (partyID: string, youtubeID: string, io: Server) => {
  io.to(partyID).emit("search", youtubeID);
};
const forwardVideo = (partyID: string, seconds: string, io: Server) => {
  io.to(partyID).emit("duration", seconds);
};
const sendChat = (partyID: string, message: Message, io: Server) => {
  io.to(partyID).emit("chat", message);
};
const disconnectParty = (msg: string) => {
  console.log("disconnected: " + msg);
};
