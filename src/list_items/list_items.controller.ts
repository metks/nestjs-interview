import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ListItemsService } from './list_items.service';
import { CreateListItemDto } from './dto/create-list_item.dto';
import { UpdateListItemDto } from './dto/update-list_item.dto';

@Controller('list-items')
export class ListItemsController {
  constructor(private readonly listItemsService: ListItemsService) {}

  @Post()
  create(@Body() createListItemDto: CreateListItemDto) {
    return this.listItemsService.create(createListItemDto);
  }

  @Get()
  findAll() {
    return this.listItemsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.listItemsService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateListItemDto: UpdateListItemDto,
  ) {
    return this.listItemsService.update(+id, updateListItemDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.listItemsService.remove(+id);
  }
}
