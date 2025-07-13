'use client';

import { useEffect, useState } from 'react';
import { ScrollArea } from '@repo/ui/scroll-area';
import { ArrowLeft, Bot, SendHorizonal } from 'lucide-react';
import { useRouter } from 'next/navigation';

type Message = {
  sender: 'user' | 'bot';
  content: string;
};

export default function ChatApp() {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    setToken(storedToken);
    setReady(true);
  }, []);

  useEffect(() => {
    if (!token) return;

    const fetchMessages = async () => {
      try {
        const res = await fetch('http://localhost:3001/ai-chats', {
          headers: {
            Authorization: `${token}`,
          },
        });

        if (res.ok) {
          const data = await res.json();
          const formatted: Message[] = data.chats
            .map((chat: any) => [
              { sender: 'user', content: chat.message },
              { sender: 'bot', content: chat.response },
            ])
            .flat();

          setMessages([
            {
              sender: 'bot',
              content: "Hello, I'm your emotional companion. How are you feeling today?",
            },
            ...formatted,
          ]);
        }
      } catch (err) {
        console.error('Failed to fetch messages');
      }
    };

    fetchMessages();
  }, [token]);

  const sendMessage = async () => {
    if (!input.trim() || loading || !token) return;

    const userMsg: Message = { sender: 'user', content: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('http://localhost:8000/emotional-companion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input }),
      });

      if (!res.ok) throw new Error('Server Error');

      const data = await res.json();
      const botMsg: Message = { sender: 'bot', content: data.response };

      setMessages((prev) => [...prev, botMsg]);

      await fetch('http://localhost:3001/ai-chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `${token}`,
        },
        body: JSON.stringify({
          message: input,
          response: data.response,
        }),
      });
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { sender: 'bot', content: 'Oops! Something went wrong. Please try again.' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  if (!ready) return null;

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-black via-zinc-900 to-white p-4">
      {/* Sidebar (Back button) */}
      <div className="mr-4 mt-4">
        <button
          className="bg-white text-black rounded-full h-12 w-12 flex items-center justify-center shadow hover:bg-gray-200 transition"
          onClick={() => router.back()}
        >
          <ArrowLeft size={24} />
        </button>
      </div>

      {/* Chat Box */}
      <div className="flex-1 flex flex-col items-center">
        <div className="w-full max-w-3xl bg-white/80 border border-gray-300 rounded-xl shadow-lg backdrop-blur-md p-4">
          <div className="text-center text-xl font-bold text-black mb-4 flex justify-center items-center gap-2">
            <Bot />
            Chat with Stero
          </div>

      <ScrollArea className="h-[450px] overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-inner p-2">
  <div className="flex flex-col gap-2">
    {messages.map((msg, i) => (
      <div
        key={i}
        className={`w-fit px-4 py-2 rounded-xl text-sm break-words whitespace-pre-wrap shadow transition-all ${
          msg.sender === 'user'
            ? 'bg-black text-white self-end'
            : 'bg-white border border-gray-300 text-black self-start'
        }`}
      >
        {msg.content}
      </div>
    ))}
  </div>
</ScrollArea>



          {/* Input */}
          <div className="mt-4 flex items-center gap-2">
            <input
              placeholder="Type your message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
              className="flex-1 rounded-full px-4 py-2 border border-gray-400 bg-white focus:outline-none shadow-inner"
            />
            <button
              onClick={sendMessage}
              disabled={loading}
              className="rounded-full p-3 bg-black text-white hover:bg-white hover:text-black border hover:border-black transition-colors"
            >
              <SendHorizonal size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Visual Right Circle */}
      <div className="pl-6 pr-4 flex justify-center items-center">
        <div className="bg-white shadow-lg p-6 rounded-full cursor-pointer hover:scale-105 transition">
          <div className="bg-black rounded-full p-6 text-white flex flex-col items-center">
            <div className="font-bold text-green-500 mb-2">Speak Stero</div>
            <div className="hover:text-red-300 transition">
              <Bot size={100} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
