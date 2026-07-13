import fs from 'fs';
import path from 'path';
import { attachmentRepository } from '../repositories/AttachmentRepository';
import { ApiError } from '../utils/apiResponse';
import { sharingService } from './sharingService';
import { env } from '../config/env';
import cloudinary from '../config/cloudinary';
import { logger } from '../utils/logger';

const UPLOAD_DIR = path.join(__dirname, '..', '..', 'uploads');
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });

class AttachmentService {
  async upload(noteId: string, owner: string, file: Express.Multer.File) {
    const level = await sharingService.getAccessLevel(noteId, owner);
    if (!level || level === 'read') throw ApiError.forbidden('You do not have permission to attach files here');

    // If Cloudinary credentials are configured, upload there and remove the local
    // temp copy multer already wrote to disk. Otherwise, keep serving from local disk.
    if (env.cloudinaryConfigured) {
      try {
        const result = await cloudinary.uploader.upload(file.path, {
          folder: 'marginalia-attachments',
          resource_type: 'auto',
        });

        // Local temp file is no longer needed once it's on Cloudinary
        fs.unlink(file.path, () => {});

        const attachment = await attachmentRepository.create({
          note: noteId as any,
          owner: owner as any,
          filename: result.public_id,
          originalName: file.originalname,
          mimeType: file.mimetype,
          size: file.size,
          url: result.secure_url,
          provider: 'cloudinary',
        });

        return attachment;
      } catch (error) {
        logger.error('Cloudinary upload failed, falling back to local storage', { error });
        // fall through to local storage below
      }
    }

    const attachment = await attachmentRepository.create({
      note: noteId as any,
      owner: owner as any,
      filename: file.filename,
      originalName: file.originalname,
      mimeType: file.mimetype,
      size: file.size,
      url: `/uploads/${file.filename}`,
      provider: 'local',
    });

    return attachment;
  }

  async list(noteId: string, userId: string) {
    const level = await sharingService.getAccessLevel(noteId, userId);
    if (!level) throw ApiError.notFound('Note not found');
    return attachmentRepository.findByNote(noteId);
  }

  async remove(attachmentId: string, userId: string) {
    const attachment = await attachmentRepository.findById(attachmentId);
    if (!attachment || attachment.owner.toString() !== userId) throw ApiError.notFound('Attachment not found');

    if (attachment.provider === 'local') {
      const filePath = path.join(UPLOAD_DIR, attachment.filename);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    } else if (attachment.provider === 'cloudinary' && env.cloudinaryConfigured) {
      try {
        await cloudinary.uploader.destroy(attachment.filename, { resource_type: 'auto' });
      } catch (error) {
        logger.error('Failed to delete Cloudinary asset', { error, filename: attachment.filename });
      }
    }

    return attachmentRepository.deleteById(attachmentId);
  }
}

export const attachmentService = new AttachmentService();
