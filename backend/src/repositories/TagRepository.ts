import { BaseRepository } from './BaseRepository';
import { Tag, ITag } from '../models/Tag';

class TagRepository extends BaseRepository<ITag> {
  constructor() {
    super(Tag);
  }

  async findByOwner(owner: string) {
    return this.model.find({ owner }).sort({ name: 1 }).exec();
  }

  async findOrCreateMany(owner: string, names: string[]) {
    const normalized = Array.from(new Set(names.map((n) => n.trim().toLowerCase()).filter(Boolean)));
    const tags = await Promise.all(
      normalized.map((name) =>
        this.model.findOneAndUpdate(
          { owner, name },
          { $setOnInsert: { owner, name } },
          { upsert: true, new: true }
        )
      )
    );
    return tags;
  }
}

export const tagRepository = new TagRepository();
