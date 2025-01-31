import { Server, Socket } from "socket.io";
let io: Server;

export const setUpSocket = (httpServer:any) => {
    io = new Server(httpServer, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"],
        },
    });
    io.on("connection", (socket:Socket)=> {        
        console.log("Socket is connected");
        socket.on("join", (data:any)=> {
            socket.join(data.email);
        });
        
    })
}

export const emitNotificationOfCheckList = (sharedUser:string,getSharedUser:string,data:any) => {
    if (io) {
        io.to(getSharedUser).emit("shared-checkList", {
            sharedUser:sharedUser,
            data:data
        });
    }
}

export const emitNotificationOfVault = (sharedUser:string,getSharedUser:string,data:any) => {
    if (io) {
        io.to(getSharedUser).emit("shared-checkList", {
            sharedUser:sharedUser,
            data:data
        });
    }
}