import axios from 'axios';
import { env } from '../config/env';
import { ApiError } from '../utils/apiResponse';

export type AIAction =
  | 'summarize'
  | 'rewrite'
  | 'improve_grammar'
  | 'generate_title'
  | 'explain'
  | 'translate'
  | 'bullet_points'
  | 'flashcards'
  | 'quiz'
  | 'extract_key_points'
  | 'meeting_summary'
  | 'action_items';

const PROMPTS: Record<AIAction, (text: string, opts?: Record<string, string>) => string> = {
  summarize: (text) => `Summarize the following note in 2-4 concise sentences:\n\n${text}`,
  rewrite: (text) => `Rewrite the following note to be clearer and more polished, keeping the same meaning:\n\n${text}`,
  improve_grammar: (text) => `Correct any grammar and spelling mistakes in the following text. Return only the corrected text:\n\n${text}`,
  generate_title: (text) => `Suggest one short, specific title (under 8 words) for this note:\n\n${text}`,
  explain: (text) => `Explain the following text in simple terms:\n\n${text}`,
  translate: (text, opts) => `Translate the following text to ${opts?.targetLanguage || 'Spanish'}:\n\n${text}`,
  bullet_points: (text) => `Convert the following paragraph into a concise bulleted list:\n\n${text}`,
  flashcards: (text) => `Generate 5 question/answer flashcards from the following note. Format as "Q: ... \\nA: ...":\n\n${text}`,
  quiz: (text) => `Generate a 5-question multiple choice quiz (with answers marked) based on this note:\n\n${text}`,
  extract_key_points: (text) => `Extract the key points from this note as a short bulleted list:\n\n${text}`,
  meeting_summary: (text) => `Summarize these meeting notes into: Attendees (if mentioned), Key Discussion Points, Decisions Made:\n\n${text}`,
  action_items: (text) => `Extract a list of clear, actionable to-do items from this text:\n\n${text}`,
};

class AIService {
  private assertConfigured() {
    if (!env.openAiConfigured) {
      throw ApiError.badRequest(
        'AI features require an OPENAI_API_KEY in the backend .env file. Add your key and restart the server to enable this.'
      );
    }
  }

  async run(action: AIAction, text: string, opts?: Record<string, string>): Promise<string> {
    this.assertConfigured();
    if (!text?.trim()) throw ApiError.badRequest('There is no note content to process');

    const prompt = PROMPTS[action](text, opts);

    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: env.openAi.model,
        messages: [
          { role: 'system', content: 'You are a precise writing assistant embedded in a notes app.' },
          { role: 'user', content: prompt },
        ],
        temperature: 0.4,
      },
      {
        headers: {
          Authorization: `Bearer ${env.openAi.apiKey}`,
          'Content-Type': 'application/json',
        },
        timeout: 30000,
      }
    );

    return response.data.choices?.[0]?.message?.content?.trim() || '';
  }
}

export const aiService = new AIService();
