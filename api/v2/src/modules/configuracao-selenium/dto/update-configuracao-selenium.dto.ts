import { PartialType } from '@nestjs/swagger';
import { CreateConfiguracaoSeleniumDto } from './create-configuracao-selenium.dto';

export class UpdateConfiguracaoSeleniumDto extends PartialType(
  CreateConfiguracaoSeleniumDto,
) {}
