import { httpsCallable } from 'firebase/functions';
import { functions } from '../firebase';

export async function sendChatMessage(message: string, chatId?: string): Promise<{ reply: string; chatId: string }> {
  const chat = httpsCallable<{ message: string; chatId?: string }, { reply: string; chatId: string }>(functions, 'chat');
  const res = await chat({ message, chatId });
  return res.data;
}
