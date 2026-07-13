import { Router } from 'express';
import { env } from '../config/env';
import authRoutes from './authRoutes';
import userRoutes from './userRoutes';
import noteRoutes from './noteRoutes';
import folderRoutes from './folderRoutes';
import tagRoutes from './tagRoutes';
import dashboardRoutes from './dashboardRoutes';
import commentRoutes from './commentRoutes';
import versionRoutes from './versionRoutes';
import reminderRoutes from './reminderRoutes';
import notificationRoutes from './notificationRoutes';
import attachmentRoutes from './attachmentRoutes';
import sharingRoutes from './sharingRoutes';
import adminRoutes from './adminRoutes';
import aiRoutes from './aiRoutes';
import exportImportRoutes from './exportImportRoutes';

const router = Router();

router.get('/health', (_req, res) => {
  res.json({ success: true, message: 'API is healthy', data: { timestamp: new Date().toISOString() } });
});

router.get('/config', (_req, res) => {
  res.json({
    success: true,
    message: 'Public config',
    data: {
      googleOAuthEnabled: env.googleOAuthConfigured,
      aiEnabled: env.openAiConfigured,
      emailEnabled: env.smtpConfigured,
    },
  });
});

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/notes', noteRoutes);
router.use('/folders', folderRoutes);
router.use('/tags', tagRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/comments', commentRoutes);
router.use('/versions', versionRoutes);
router.use('/reminders', reminderRoutes);
router.use('/notifications', notificationRoutes);
router.use('/attachments', attachmentRoutes);
router.use('/sharing', sharingRoutes);
router.use('/admin', adminRoutes);
router.use('/ai', aiRoutes);
router.use('/export', exportImportRoutes);

export default router;
