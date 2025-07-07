import { TodoListItem } from '../../interfaces/list_item.interface';

export class UpdateTodoListDto {
  id: number;
  name: string;
  items: TodoListItem[];
}
