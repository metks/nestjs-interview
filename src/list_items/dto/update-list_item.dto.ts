import { PartialType } from '@nestjs/mapped-types';
import { CreateListItemDto } from './create-list_item.dto';

export class UpdateListItemDto extends PartialType(CreateListItemDto) {}
