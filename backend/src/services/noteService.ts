import { noteRepository, NoteQueryOptions } from '../repositories/NoteRepository';
import { tagRepository } from '../repositories/TagRepository';
import { Note } from '../models/Note';
import { ApiError } from '../utils/apiResponse';
import { sharingService } from './sharingService';
import { versionHistoryRepository } from '../repositories/VersionHistoryRepository';
import { activityLogRepository } from '../repositories/ActivityLogRepository';

export interface CreateNoteInput {
  title?: string;
  content?: string;
  plainText?: string;
  folder?: string | null;
  tagNames?: string[];
  color?: string;
  priority?: string;
}

export interface UpdateNoteInput extends Partial<CreateNoteInput> {}

class NoteService {
  private async assertOwnership(noteId: string, owner: string) {
    const note = await noteRepository.findById(noteId);
    if (!note || note.owner.toString() !== owner) {
      throw ApiError.notFound('Note not found');
    }
    return note;
  }

  /** Allows the owner or a collaborator with at least `minAccess` to proceed */
  private async assertAccess(noteId: string, userId: string, minAccess: 'read' | 'edit' = 'read') {
    const note = await noteRepository.findById(noteId);
    if (!note) throw ApiError.notFound('Note not found');

    const level = await sharingService.getAccessLevel(noteId, userId);
    if (!level) throw ApiError.notFound('Note not found');
    if (minAccess === 'edit' && level === 'read') {
      throw ApiError.forbidden('You only have read access to this note');
    }
    return note;
  }

  async list(query: NoteQueryOptions) {
    return noteRepository.paginate(query);
  }

  async getById(noteId: string, userId: string) {
    return this.assertAccess(noteId, userId, 'read');
  }

  async create(owner: string, input: CreateNoteInput) {
    let tagIds: string[] = [];
    if (input.tagNames?.length) {
      const tags = await tagRepository.findOrCreateMany(owner, input.tagNames);
      tagIds = tags.map((t) => t._id.toString());
    }

    const note = await noteRepository.create({
      owner: owner as any,
      title: input.title || 'Untitled Note',
      content: input.content || '',
      plainText: input.plainText || '',
      folder: (input.folder as any) || null,
      tags: tagIds as any,
      color: input.color || '#FFFFFF',
      priority: (input.priority as any) || 'none',
    });

    await activityLogRepository.log(owner, 'created a note', 'note', note._id.toString(), { title: note.title });
    return note;
  }

  async update(noteId: string, userId: string, input: UpdateNoteInput) {
    const existing = await this.assertAccess(noteId, userId, 'edit');

    // Snapshot the pre-update state into version history (skip trivial/empty snapshots)
    if (existing.title || existing.content) {
      await versionHistoryRepository.create({
        note: noteId as any,
        author: userId as any,
        title: existing.title,
        content: existing.content,
        plainText: existing.plainText,
      });
    }

    let tagIds: string[] | undefined;
    if (input.tagNames) {
      const tags = await tagRepository.findOrCreateMany(existing.owner.toString(), input.tagNames);
      tagIds = tags.map((t) => t._id.toString());
    }

    const update: any = { ...input };
    delete update.tagNames;
    if (tagIds) update.tags = tagIds;

    return noteRepository.updateById(noteId, update);
  }

  async softDelete(noteId: string, owner: string) {
    await this.assertOwnership(noteId, owner);
    return noteRepository.updateById(noteId, { isDeleted: true, deletedAt: new Date() } as any);
  }

  async restore(noteId: string, owner: string) {
    await this.assertOwnership(noteId, owner);
    return noteRepository.updateById(noteId, { isDeleted: false, deletedAt: null } as any);
  }

  async permanentDelete(noteId: string, owner: string) {
    await this.assertOwnership(noteId, owner);
    return noteRepository.deleteById(noteId);
  }

  async togglePin(noteId: string, owner: string) {
    const note = await this.assertOwnership(noteId, owner);
    return noteRepository.updateById(noteId, { isPinned: !note.isPinned } as any);
  }

  async toggleArchive(noteId: string, owner: string) {
    const note = await this.assertOwnership(noteId, owner);
    return noteRepository.updateById(noteId, { isArchived: !note.isArchived } as any);
  }

  async toggleFavorite(noteId: string, owner: string) {
    const note = await this.assertOwnership(noteId, owner);
    return noteRepository.updateById(noteId, { isFavorite: !note.isFavorite } as any);
  }

  async duplicate(noteId: string, owner: string) {
    const note = await this.assertOwnership(noteId, owner);
    const copy = await Note.create({
      owner,
      title: `${note.title} (Copy)`,
      content: note.content,
      plainText: note.plainText,
      folder: note.folder,
      tags: note.tags,
      color: note.color,
      priority: note.priority,
    });
    return copy;
  }

  async bulkSoftDelete(noteIds: string[], owner: string) {
    return Note.updateMany(
      { _id: { $in: noteIds }, owner },
      { isDeleted: true, deletedAt: new Date() }
    );
  }

  async bulkArchive(noteIds: string[], owner: string, isArchived: boolean) {
    return Note.updateMany({ _id: { $in: noteIds }, owner }, { isArchived });
  }

  async bulkAddTags(noteIds: string[], owner: string, tagNames: string[]) {
    const tags = await tagRepository.findOrCreateMany(owner, tagNames);
    const tagIds = tags.map((t) => t._id);
    return Note.updateMany({ _id: { $in: noteIds }, owner }, { $addToSet: { tags: { $each: tagIds } } });
  }
}

export const noteService = new NoteService();
