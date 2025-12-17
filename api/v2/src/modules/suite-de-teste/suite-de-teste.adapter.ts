import { CasoDeTesteBo } from '../caso-de-teste/bo/caso-de-teste.bo';
import { FileTreeBo } from './bo/file-tree.bo';
import { FileTreeDto } from './dto/file-tree.dto';
import { SuiteDeTeste } from './entities/suite-de-teste.entity';
import { SuiteDeTesteMapper } from './suite-de-teste.mapper';

export class SuiteDeTesteAdapter {
  static makeFileTreeBo(
    suitesBo: SuiteDeTeste[],
    casosBo?: CasoDeTesteBo[],
  ): FileTreeDto {
    const dto = new FileTreeBo();

    dto.suites = suitesBo.map((suite) => SuiteDeTesteMapper.entityToBo(suite));
    dto.casos = casosBo;

    return dto;
  }
}
