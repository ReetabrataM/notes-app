import { FilterQuery } from 'mongoose';
import { BaseRepository } from './BaseRepository';
import { Note, INote } from '../models/Note';

export interface NoteQueryOptions {
  owner: string;
  search?: string;
  folder?: string;
  tags?: string[];
  priority?: string;
  color?: string;
  isPinned?: boolean;
  isArchived?: boolean;
  isFavorite?: boolean;
  isDeleted?: boolean;
  page?: number;
  limit?: number;
}

class NoteRepository extends BaseRepository<INote> {
  constructor() {
    super(Note);
  }

  buildFilter(opts: NoteQueryOptions): FilterQuery<INote> {
    const filter: FilterQuery<INote> = { owner: opts.owner };

    filter.isDeleted = opts.isDeleted ?? false;
    if (opts.isArchived !== undefined) filter.isArchived = opts.isArchived;
    else filter.isArchived = false;

    if (opts.isPinned !== undefined) filter.isPinned = opts.isPinned;
    if (opts.isFavorite !== undefined) filter.isFavorite = opts.isFavorite;
    if (opts.folder) filter.folder = opts.folder;
    if (opts.priority) filter.priority = opts.priority;
    if (opts.color) filter.color = opts.color;
    if (opts.tags && opts.tags.length) filter.tags = { $in: opts.tags };
    if (opts.search) {
      filter.$text = { $search: opts.search };
    }
    return filter;
  }

  async paginate(opts: NoteQueryOptions) {
    const page = Math.max(1, opts.page || 1);
    const limit = Math.min(100, Math.max(1, opts.limit || 20));
    const filter = this.buildFilter(opts);

    const [items, total] = await Promise.all([
      this.model
        .find(filter)
        .sort({ isPinned: -1, updatedAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .populate('folder', 'name color icon')
        .populate('tags', 'name color')
        .exec(),
      this.model.countDocuments(filter),
    ]);

    return {
      items,
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }
}

export const noteRepository = new NoteRepository();
