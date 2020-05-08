export class IdeaModel {
  id: number;
  idea: string;
  descripion: string;
  createdAt: Date;

  constructor(fields: Partial<IdeaModel>) {
    if (fields) {
      Object.assign(this, fields);
    }
  }
}