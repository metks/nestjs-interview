import { Module } from '@nestjs/common';
import { ListItemsService } from './list_items.service';
import { ListItemsController } from './list_items.controller';

@Module({
  controllers: [ListItemsController],
  providers: [ListItemsService],
})
export class ListItemsModule {}
