import { asyncHandler } from '../utils/asyncHandler';
import { ApiResponse } from '../utils/apiResponse';
import { aiService, AIAction } from '../services/aiService';

export const runAIAction = asyncHandler(async (req, res) => {
  const { action, text, targetLanguage } = req.body as { action: AIAction; text: string; targetLanguage?: string };
  const result = await aiService.run(action, text, { targetLanguage: targetLanguage || '' });
  return ApiResponse.success(res, { result }, 'AI response generated');
});
