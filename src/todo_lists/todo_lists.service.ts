import { Injectable } from '@nestjs/common';
import { CreateTodoListDto } from './dtos/create-todo_list';
import { UpdateTodoListDto } from './dtos/update-todo_list';
import { TodoList } from '../interfaces/todo_list.interface';
import { WebSocketManager } from '../websockets/websocket-manager.service';

@Injectable()
export class TodoListsService {
  private todolists: TodoList[] = [];

  constructor(private readonly webSocketManager: WebSocketManager) {
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

    // Notificar a todos los clientes conectados sobre la nueva lista
    // Usando el método notifyTodoListUpdate para broadcast general
    this.webSocketManager.notifyTodoListUpdate(todoList.id, {
      type: 'list-created',
      data: todoList,
    });

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

    // Notificar a todos los clientes conectados a esta lista
    this.webSocketManager.notifyTodoListUpdate(id, {
      type: 'list-updated',
      data: todolist,
    });

    return todolist;
  }

  delete(id: number): void {
    const index = this.todolists.findIndex((x) => x.id === Number(id));

    if (index > -1) {
      this.todolists.splice(index, 1);

      // Notificar a todos los clientes sobre la eliminación
      // Usando notifyTodoListUpdate para mantener consistencia
      this.webSocketManager.notifyTodoListUpdate(id, {
        type: 'list-deleted',
        listId: id,
      });
    }
  }

  // Métodos adicionales para manejo de items con WebSocket notifications
  toggleTodoItem(listId: number, itemId: string): TodoList {
    const todoList = this.get(listId);
    const item = todoList.items.find((item) => item.id === itemId);

    if (!item) {
      throw new Error(`TodoItem with id ${itemId} not found in list ${listId}`);
    }

    item.completed = !item.completed;

    // Notificar específicamente sobre el cambio del item
    this.webSocketManager.notifyTodoItemUpdate(listId, {
      type: 'item-toggled',
      itemId,
      completed: item.completed,
      data: todoList,
    });

    return todoList;
  }

  addTodoItem(
    listId: number,
    itemData: { id: string; name: string; completed?: boolean },
  ): TodoList {
    const todoList = this.get(listId);

    const newItem = {
      id: itemData.id,
      listId: listId,
      name: itemData.name,
      completed: itemData.completed || false,
    };

    todoList.items.push(newItem);

    // Notificar sobre el nuevo item
    this.webSocketManager.notifyTodoItemUpdate(listId, {
      type: 'item-added',
      item: newItem,
      data: todoList,
    });

    return todoList;
  }

  removeTodoItem(listId: number, itemId: string): TodoList {
    const todoList = this.get(listId);
    const itemIndex = todoList.items.findIndex((item) => item.id === itemId);

    if (itemIndex === -1) {
      throw new Error(`TodoItem with id ${itemId} not found in list ${listId}`);
    }

    todoList.items.splice(itemIndex, 1);

    // Notificar sobre la eliminación del item
    this.webSocketManager.notifyTodoItemUpdate(listId, {
      type: 'item-removed',
      itemId,
      data: todoList,
    });

    return todoList;
  }

  private nextId(): number {
    const last = this.todolists
      .map((x) => x.id)
      .sort()
      .reverse()[0];

    return last ? last + 1 : 1;
  }
}
