import { Swimlane } from './swimlane';

export class Board {
  constructor(public nome: string = '', public swimlanes: Swimlane[] = []) {}
}
