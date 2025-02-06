import { Server, Socket } from "socket.io";
let io: Server;

export const setUpSocket = (httpServer: any) => {
    console.log("sdf");
    
    io = new Server(httpServer);
    io.on("connection", (socket: Socket) => {
        console.log("New socket connection: ", socket.id);
        socket.on("join", (data: any) => {
            socket.join(data.email);
        });

    })
}

export const emitNotificationOfCheckList = (sharedUser: string, getSharedUser: string, data: any, isShare: boolean) => {
    if (io) {
        if (!!isShare) {
            io.to(getSharedUser).emit("shared-checkList", {
                sharedUser: sharedUser,
                data: data
            });
        } else {
            io.to(getSharedUser).emit("unshared-checkList", {
                sharedUser: sharedUser,
                data: data
            });
        }
    }
}

export const emitNotificationOfVault = (sharedUser: string, getSharedUser: string, data: any, isShare: boolean) => {
    if (io) {
        if (!!isShare) {
            io.to(getSharedUser).emit("shared-vault", {
                sharedUser: sharedUser,
                data: data
            });
        } else {
            io.to(getSharedUser).emit("unshared-vault", {
                sharedUser: sharedUser,
                data: data
            });
        }


    }
}