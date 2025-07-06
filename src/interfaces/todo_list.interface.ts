import { TodoListItem } from './list_item.interface';

export interface TodoList {
  id: number;
  name: string;
  items: TodoListItem[];
}
