import { PartialType } from '@nestjs/mapped-types';
import { SwimlaneDto } from './swimlane.dto';

export class UpdateSwimlaneDto extends PartialType(SwimlaneDto) {}
