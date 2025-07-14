import { Injectable, OnModuleInit } from '@nestjs/common';
import { Server } from 'socket.io';
import { createServer } from 'http';

@Injectable()
export class WebSocketManager implements OnModuleInit {
  private io: Server;
  private clientRooms = new Map<string, string>();

  async onModuleInit() {
    console.log('🔧 Initializing WebSocket Manager...');

    const httpServer = createServer();

    this.io = new Server(httpServer, {
      cors: {
        origin: 'http://localhost:5173',
        credentials: false,
        methods: ['GET', 'POST'],
      },
      transports: ['websocket', 'polling'],
    });

    this.io.on('connection', (socket) => {
      console.log(`✅ Client connected: ${socket.id}`);

      socket.on('join-list', (data: { listId: number }) => {
        const roomName = `list-${data.listId}`;
        const previousRoom = this.clientRooms.get(socket.id);

        if (previousRoom) {
          socket.leave(previousRoom);
        }

        socket.join(roomName);
        this.clientRooms.set(socket.id, roomName);
        console.log(`📥 Client ${socket.id} joined room ${roomName}`);
      });

      socket.on('leave-list', (data: { listId: number }) => {
        const roomName = `list-${data.listId}`;
        socket.leave(roomName);
        this.clientRooms.delete(socket.id);
        console.log(`📤 Client ${socket.id} left room ${roomName}`);
      });

      socket.on('disconnect', () => {
        const room = this.clientRooms.get(socket.id);
        if (room) {
          socket.leave(room);
          this.clientRooms.delete(socket.id);
        }
        console.log(`❌ Client disconnected: ${socket.id}`);
      });
    });

    httpServer.listen(3002, () => {
      console.log('🚀 WebSocket server listening on port 3002');
    });
  }

  notifyTodoItemUpdate(listId: number, data: any) {
    if (!this.io) {
      console.warn('⚠️ WebSocket server not available');
      return;
    }

    const roomName = `list-${listId}`;
    console.log(`📤 Sending item update to room ${roomName}:`, data);

    this.io.to(roomName).emit('todo-item-updated', {
      listId,
      timestamp: new Date().toISOString(),
      ...data,
    });
  }

  notifyTodoListUpdate(listId: number, data: any) {
    if (!this.io) {
      console.warn('⚠️ WebSocket server not available');
      return;
    }

    const roomName = `list-${listId}`;
    console.log(`📤 Sending list update to room ${roomName}:`, data);

    this.io.to(roomName).emit('todo-list-updated', {
      listId,
      timestamp: new Date().toISOString(),
      ...data,
    });
  }

  getConnectedClients(): number {
    return this.io ? this.io.sockets.sockets.size : 0;
  }
}
