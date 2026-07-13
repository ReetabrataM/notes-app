import { asyncHandler } from '../utils/asyncHandler';
import { ApiResponse, ApiError } from '../utils/apiResponse';
import { folderRepository } from '../repositories/FolderRepository';
import { AuthRequest } from '../middlewares/authenticate';

export const listFolders = asyncHandler(async (req: AuthRequest, res) => {
  const folders = await folderRepository.findByOwner(req.userId!);
  return ApiResponse.success(res, folders, 'Folders fetched');
});

export const createFolder = asyncHandler(async (req: AuthRequest, res) => {
  const { name, parent, icon, color } = req.body;
  const folder = await folderRepository.create({
    name,
    parent: parent || null,
    icon,
    color,
    owner: req.userId as any,
  });
  return ApiResponse.created(res, folder, 'Folder created');
});

export const updateFolder = asyncHandler(async (req: AuthRequest, res) => {
  const existing = await folderRepository.findById(req.params.id);
  if (!existing || existing.owner.toString() !== req.userId) throw ApiError.notFound('Folder not found');
  const folder = await folderRepository.updateById(req.params.id, req.body);
  return ApiResponse.success(res, folder, 'Folder updated');
});

export const deleteFolder = asyncHandler(async (req: AuthRequest, res) => {
  const existing = await folderRepository.findById(req.params.id);
  if (!existing || existing.owner.toString() !== req.userId) throw ApiError.notFound('Folder not found');
  await folderRepository.deleteById(req.params.id);
  return ApiResponse.noContent(res, 'Folder deleted');
});
