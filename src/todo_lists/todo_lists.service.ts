import { Injectable } from '@nestjs/common';
import { CreateTodoListDto } from './dtos/create-todo_list';
import { UpdateTodoListDto } from './dtos/update-todo_list';
import { TodoList } from '../interfaces/todo_list.interface';

@Injectable()
export class TodoListsService {
  private todolists: TodoList[] = [];

  constructor() {
    // Initialize with empty array - this will persist in memory as a singleton
  }

  all(): TodoList[] {
    return this.todolists;
  }

  get(id: number): TodoList {
    const todoList = this.todolists.find((x) => x.id === Number(id));

    if (!todoList) {
      throw new Error(`TodoList with id ${id} not found`);
    }

    return todoList;
  }

  create(dto: CreateTodoListDto): TodoList {
    const todoList: TodoList = {
      id: this.nextId(),
      name: dto.name,
      items: dto.items || [],
    };

    this.todolists.push(todoList);

    return todoList;
  }

  update(id: number, dto: UpdateTodoListDto): TodoList {
    const todolist = this.todolists.find((x) => x.id === Number(id));

    if (!todolist) {
      throw new Error(`TodoList with id ${id} not found`);
    }

    if (dto.name !== undefined) {
      todolist.name = dto.name;
    }
    if (dto.items !== undefined) {
      todolist.items = dto.items;
    }

    return todolist;
  }

  delete(id: number): void {
    const index = this.todolists.findIndex((x) => x.id === Number(id));

    if (index > -1) {
      this.todolists.splice(index, 1);
    }
  }

  private nextId(): number {
    const last = this.todolists
      .map((x) => x.id)
      .sort()
      .reverse()[0];

    return last ? last + 1 : 1;
  }
}
