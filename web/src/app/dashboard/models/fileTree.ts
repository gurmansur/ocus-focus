import { CasoDeTeste } from './casoDeTeste';
import { SuiteDeTeste } from './suiteDeTeste';

export class FileTree {
  constructor(
    public suites: SuiteDeTeste[],

    public casos: CasoDeTeste[]
  ) {}
}
