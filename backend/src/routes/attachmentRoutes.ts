import { Router } from 'express';
import { param } from 'express-validator';
import * as attachmentController from '../controllers/attachmentController';
import { authenticate } from '../middlewares/authenticate';
import { validate } from '../middlewares/validate';
import { upload } from '../config/multer';

const router = Router();
router.use(authenticate);

router.get('/note/:noteId', param('noteId').isMongoId(), validate, attachmentController.listAttachments);
router.post(
  '/note/:noteId',
  param('noteId').isMongoId(),
  validate,
  upload.single('file'),
  attachmentController.uploadAttachment
);
router.delete('/:id', param('id').isMongoId(), validate, attachmentController.deleteAttachment);

export default router;
