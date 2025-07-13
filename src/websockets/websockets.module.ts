import { Module } from '@nestjs/common';
import { TodoGateway } from './todo.gateway';
import { WebSocketManager } from './websocket-manager.service';

@Module({
  providers: [TodoGateway, WebSocketManager],
  exports: [TodoGateway, WebSocketManager],
})
export class WebsocketsModule {}
