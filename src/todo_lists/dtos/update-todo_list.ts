import { TodoListItem } from '../../interfaces/list_item.interface';

export class UpdateTodoListDto {
  name?: string;
  items?: TodoListItem[];
}
