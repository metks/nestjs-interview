import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: 'http://localhost:5173',
    credentials: false,
    methods: ['GET', 'POST'],
  },
  transports: ['websocket', 'polling'],
})
export class TodoGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private clientRooms = new Map<string, string>();

  constructor() {
    console.log('🔧 TodoGateway constructor called');
    // Dar tiempo para que NestJS inicialice completamente el servidor WebSocket
    setTimeout(() => {
      console.log('🔄 Checking WebSocket server after delay...', !!this.server);
    }, 2000);
  }

  afterInit(server: Server) {
    console.log('🔌 WebSocket Gateway initialized');
    console.log('🔌 Server object:', !!server);
    this.server = server;
  }

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
    // Aquí podrías manejar la lógica de conexión si es necesario
  }

  handleDisconnect(client: Socket) {
    const room = this.clientRooms.get(client.id);
    if (room) {
      client.leave(room);
      this.clientRooms.delete(client.id);
    }
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('join-list')
  handleJoinList(
    @MessageBody() data: { listId: number },
    @ConnectedSocket() client: Socket,
  ) {
    const roomName = `list-${data.listId}`;

    const previousRoom = this.clientRooms.get(client.id);
    if (previousRoom) {
      client.leave(previousRoom);
    }

    client.join(roomName);
    this.clientRooms.set(client.id, roomName);

    console.log(`Client ${client.id} joined room ${roomName}`);
  }

  @SubscribeMessage('leave-list')
  handleLeaveList(
    @MessageBody() data: { listId: number },
    @ConnectedSocket() client: Socket,
  ) {
    const roomName = `list-${data.listId}`;
    client.leave(roomName);
    this.clientRooms.delete(client.id);

    console.log(`Client ${client.id} left room ${roomName}`);
  }

  // Métodos para notificar desde servicios
  notifyTodoItemUpdate(listId: number, data: any) {
    console.log(
      `📤 Attempting to send item update notification to list-${listId}`,
    );

    // Verificar si el servidor está disponible de forma más robusta
    if (!this.server) {
      console.warn('⚠️ WebSocket server not available, notification skipped');
      console.log('📊 Available clients: 0 (server not initialized)');
      return;
    }

    const roomName = `list-${listId}`;
    try {
      const socketsInRoom = this.server.in(roomName).allSockets();
      socketsInRoom.then((sockets) => {
        console.log(`� Sending to ${sockets.size} clients in room ${roomName}`);
      });

      this.server.to(roomName).emit('todo-item-updated', {
        listId,
        timestamp: new Date().toISOString(),
        ...data,
      });
      console.log(`✅ Item notification sent successfully to room ${roomName}`);
    } catch (error) {
      console.error('❌ Error sending item notification:', error);
    }
  }

  notifyTodoListUpdate(listId: number, data: any) {
    console.log(
      `📤 Attempting to send list update notification to list-${listId}`,
    );

    // Verificar si el servidor está disponible de forma más robusta
    if (!this.server) {
      console.warn('⚠️ WebSocket server not available, notification skipped');
      console.log('📊 Available clients: 0 (server not initialized)');
      return;
    }

    const roomName = `list-${listId}`;
    try {
      const socketsInRoom = this.server.in(roomName).allSockets();
      socketsInRoom.then((sockets) => {
        console.log(`� Sending to ${sockets.size} clients in room ${roomName}`);
      });

      this.server.to(roomName).emit('todo-list-updated', {
        listId,
        timestamp: new Date().toISOString(),
        ...data,
      });
      console.log(`✅ List notification sent successfully to room ${roomName}`);
    } catch (error) {
      console.error('❌ Error sending list notification:', error);
    }
  }
}
