import { BaseRepository } from './BaseRepository';
import { Attachment, IAttachment } from '../models/Attachment';

class AttachmentRepository extends BaseRepository<IAttachment> {
  constructor() {
    super(Attachment);
  }

  async findByNote(noteId: string) {
    return this.model.find({ note: noteId }).sort({ createdAt: -1 }).exec();
  }
}

export const attachmentRepository = new AttachmentRepository();
