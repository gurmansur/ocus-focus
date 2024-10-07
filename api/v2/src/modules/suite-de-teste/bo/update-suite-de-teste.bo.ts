import { PartialType } from '@nestjs/swagger';
import { CreateSuiteDeTesteBo } from './create-suite-de-teste.bo';

export class UpdateSuiteDeTesteBo extends PartialType(CreateSuiteDeTesteBo) {}
