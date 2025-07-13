import { Module } from '@nestjs/common';
import { TodoListsModule } from './todo_lists/todo_lists.module';
import { ListItemsModule } from './list_items/list_items.module';
import { WebsocketsModule } from './websockets/websockets.module';

@Module({
  imports: [TodoListsModule, ListItemsModule, WebsocketsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
