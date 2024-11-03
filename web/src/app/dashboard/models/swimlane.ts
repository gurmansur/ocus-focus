import { UserStory } from './userStory';

export class Swimlane {
  constructor(
    public nome: string,
    public vertical: number | boolean,
    public cor: string,
    public userStories: UserStory[],
    public id?: number
  ) {}
}
