import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { body } from 'express-validator';
import * as aiController from '../controllers/aiController';
import { authenticate } from '../middlewares/authenticate';
import { validate } from '../middlewares/validate';

const router = Router();
router.use(authenticate);

const aiLimiter = rateLimit({ windowMs: 60 * 1000, max: 15 });

router.post(
  '/run',
  aiLimiter,
  body('action').isIn([
    'summarize',
    'rewrite',
    'improve_grammar',
    'generate_title',
    'explain',
    'translate',
    'bullet_points',
    'flashcards',
    'quiz',
    'extract_key_points',
    'meeting_summary',
    'action_items',
  ]),
  body('text').isString(),
  validate,
  aiController.runAIAction
);

export default router;
