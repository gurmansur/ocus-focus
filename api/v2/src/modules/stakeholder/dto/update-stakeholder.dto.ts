/**
 * @deprecated This module is deprecated. Please use the 'usuario' module instead.
 */
import { PartialType } from '@nestjs/mapped-types';
import { CreateStakeholderDto } from './create-stakeholder.dto';

export class UpdateStakeholderDto extends PartialType(CreateStakeholderDto) {}
