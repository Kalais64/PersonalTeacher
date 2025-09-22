import { useState } from 'react';
import { sendChatMessage } from '../services/chat';

interface Msg { role: 'user' | 'assistant'; content: string }

export default function ChatPage() {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState('');
  const [chatId, setChatId] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(false);

  const onSend = async () => {
    const text = input.trim();
    if (!text) return;
    setInput('');
    setMessages((m) => [...m, { role: 'user', content: text }]);
    setLoading(true);
    try {
      const res = await sendChatMessage(text, chatId);
      setChatId(res.chatId);
      setMessages((m) => [...m, { role: 'assistant', content: res.reply }]);
    } catch (e) {
      setMessages((m) => [...m, { role: 'assistant', content: 'Error getting response. Check Functions logs.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold">Chat</h1>
      <div className="flex-1 space-y-3 border rounded p-3 bg-white">
        {messages.length === 0 && (
          <p className="text-gray-500">Start the conversation by asking a question.</p>
        )}
        {messages.map((m, i) => (
          <div key={i} className={m.role === 'user' ? 'text-right' : 'text-left'}>
            <div className={`inline-block rounded px-3 py-2 ${m.role === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-100'}`}>
              {m.content}
            </div>
          </div>
        ))}
        {loading && <p className="text-sm text-gray-500">Thinking…</p>}
      </div>
      <div className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && onSend()}
          placeholder="Ask anything…"
          className="flex-1 border rounded px-3 py-2"
        />
        <button onClick={onSend} className="px-4 py-2 rounded bg-blue-600 text-white">Send</button>
      </div>
    </section>
  );
}
