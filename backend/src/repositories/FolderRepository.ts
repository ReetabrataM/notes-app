import { BaseRepository } from './BaseRepository';
import { Folder, IFolder } from '../models/Folder';

class FolderRepository extends BaseRepository<IFolder> {
  constructor() {
    super(Folder);
  }

  async findByOwner(owner: string) {
    return this.model.find({ owner }).sort({ name: 1 }).exec();
  }
}

export const folderRepository = new FolderRepository();
