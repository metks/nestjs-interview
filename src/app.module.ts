import { Module } from '@nestjs/common';
import { TodoListsModule } from './todo_lists/todo_lists.module';
import { ListItemsModule } from './list_items/list_items.module';

@Module({
  imports: [TodoListsModule, ListItemsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
