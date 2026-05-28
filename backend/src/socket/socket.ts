import { Server as HttpServer } from 'http';
import { Server, Socket } from 'socket.io';

let io: Server | null = null;

export const initSocket = (server: HttpServer): Server => {
  io = new Server(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST']
    }
  });

  io.on('connection', (socket: Socket) => {
    console.log(`Socket client connected: ${socket.id}`);

    socket.on('join-assignment', (assignmentId: string) => {
      socket.join(assignmentId);
      console.log(`Socket ${socket.id} joined room: ${assignmentId}`);
    });

    socket.on('leave-assignment', (assignmentId: string) => {
      socket.leave(assignmentId);
      console.log(`Socket ${socket.id} left room: ${assignmentId}`);
    });

    socket.on('disconnect', () => {
      console.log(`Socket client disconnected: ${socket.id}`);
    });
  });

  return io;
};

export const getIO = (): Server => {
  if (!io) {
    throw new Error('Socket.io is not initialized!');
  }
  return io;
};

export const emitToAssignmentRoom = (assignmentId: string, event: string, data: any) => {
  if (io) {
    io.to(assignmentId).emit(event, data);
  }
};

export const emitBroadcast = (event: string, data: any) => {
  if (io) {
    io.emit(event, data);
  }
};
