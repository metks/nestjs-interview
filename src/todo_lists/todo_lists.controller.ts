import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { CreateTodoListDto } from './dtos/create-todo_list';
import { UpdateTodoListDto } from './dtos/update-todo_list';
import { TodoList } from '../interfaces/todo_list.interface';
import { TodoListsService } from './todo_lists.service';

@Controller('api/todolists')
export class TodoListsController {
  constructor(private todoListsService: TodoListsService) {}

  @Get()
  index(): TodoList[] {
    return this.todoListsService.all();
  }

  @Get('/:todoListId')
  show(@Param() param: { todoListId: number }): TodoList {
    return this.todoListsService.get(param.todoListId);
  }

  @Post()
  create(@Body() dto: CreateTodoListDto): TodoList {
    return this.todoListsService.create(dto);
  }

  @Put('/:todoListId')
  update(
    @Param() param: { todoListId: number },
    @Body() dto: UpdateTodoListDto,
  ): TodoList {
    return this.todoListsService.update(param.todoListId, dto);
  }

  @Delete('/:todoListId')
  delete(@Param() param: { todoListId: number }): void {
    this.todoListsService.delete(param.todoListId);
  }

  // Nuevos endpoints para manejo de items específicos
  @Put('/:todoListId/items/:itemId/toggle')
  toggleItem(@Param() param: { todoListId: number; itemId: string }): TodoList {
    return this.todoListsService.toggleTodoItem(param.todoListId, param.itemId);
  }

  @Post('/:todoListId/items')
  addItem(
    @Param() param: { todoListId: number },
    @Body() itemData: { id: string; name: string; completed?: boolean },
  ): TodoList {
    return this.todoListsService.addTodoItem(param.todoListId, itemData);
  }

  @Delete('/:todoListId/items/:itemId')
  removeItem(@Param() param: { todoListId: number; itemId: string }): TodoList {
    return this.todoListsService.removeTodoItem(param.todoListId, param.itemId);
  }
}
