import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { GoogleGenerativeAI } from '@google/generative-ai';

admin.initializeApp();
const db = admin.firestore();

const REGION = process.env.FIREBASE_FUNCTIONS_REGION || 'us-central1';

export const chat = functions.region(REGION).https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated.');
  }

  const userId = context.auth.uid;
  const message: unknown = data?.message;
  const incomingChatId: unknown = data?.chatId;

  if (typeof message !== 'string' || message.trim().length === 0) {
    throw new functions.https.HttpsError('invalid-argument', 'Expected non-empty string message.');
  }

  const apiKey = process.env.GEMINI_API_KEY || (functions.config().gemini && functions.config().gemini.key);
  if (!apiKey) {
    throw new functions.https.HttpsError('failed-precondition', 'Gemini API key not configured.');
  }

  let chatRef: FirebaseFirestore.DocumentReference<FirebaseFirestore.DocumentData>;
  if (typeof incomingChatId === 'string' && incomingChatId) {
    chatRef = db.collection('chats').doc(incomingChatId);
  } else {
    chatRef = db.collection('chats').doc();
    await chatRef.set({
      userId,
      startedAt: admin.firestore.FieldValue.serverTimestamp(),
      topic: null,
      summary: null,
    }, { merge: true });
  }

  const messagesRef = chatRef.collection('messages');

  await messagesRef.add({
    role: 'user',
    content: message,
    timestamp: admin.firestore.FieldValue.serverTimestamp(),
  });

  let replyText = '';
  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const result = await model.generateContent(message);
    replyText = result.response.text();
  } catch (err) {
    console.error('Gemini error', err);
    throw new functions.https.HttpsError('internal', 'Failed to get response from AI');
  }

  await messagesRef.add({
    role: 'assistant',
    content: replyText,
    timestamp: admin.firestore.FieldValue.serverTimestamp(),
  });

  return { reply: replyText, chatId: chatRef.id };
});
