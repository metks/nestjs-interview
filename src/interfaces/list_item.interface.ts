export interface TodoListItem {
  id: number;
  listId: number;
  name: string;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
  priority?: 'low' | 'medium' | 'high';
}
