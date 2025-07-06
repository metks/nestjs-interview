export class CreateListItemDto {
  id: number;
  listId: number;
  name: string;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
  priority?: 'low' | 'medium' | 'high';
}
