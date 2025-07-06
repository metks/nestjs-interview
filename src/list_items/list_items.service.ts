import { Injectable } from '@nestjs/common';
import { CreateListItemDto } from './dto/create-list_item.dto';
import { UpdateListItemDto } from './dto/update-list_item.dto';

@Injectable()
export class ListItemsService {
  create(createListItemDto: CreateListItemDto) {
    return 'This action adds a new listItem';
  }

  findAll() {
    return `This action returns all listItems`;
  }

  findOne(id: number) {
    return `This action returns a #${id} listItem`;
  }

  update(id: number, updateListItemDto: UpdateListItemDto) {
    return `This action updates a #${id} listItem`;
  }

  remove(id: number) {
    return `This action removes a #${id} listItem`;
  }
}
