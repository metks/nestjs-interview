import { TodoListItem } from '../../interfaces/list_item.interface';

export class CreateTodoListDto {
  id: number;
  name: string;
  items: TodoListItem[];
}
