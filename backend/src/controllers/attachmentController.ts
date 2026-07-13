import { asyncHandler } from '../utils/asyncHandler';
import { ApiResponse, ApiError } from '../utils/apiResponse';
import { attachmentService } from '../services/attachmentService';
import { AuthRequest } from '../middlewares/authenticate';

export const listAttachments = asyncHandler(async (req: AuthRequest, res) => {
  const attachments = await attachmentService.list(req.params.noteId, req.userId!);
  return ApiResponse.success(res, attachments, 'Attachments fetched');
});

export const uploadAttachment = asyncHandler(async (req: AuthRequest, res) => {
  if (!req.file) throw ApiError.badRequest('No file uploaded');
  const attachment = await attachmentService.upload(req.params.noteId, req.userId!, req.file);
  return ApiResponse.created(res, attachment, 'File uploaded');
});

export const deleteAttachment = asyncHandler(async (req: AuthRequest, res) => {
  await attachmentService.remove(req.params.id, req.userId!);
  return ApiResponse.noContent(res, 'Attachment deleted');
});
