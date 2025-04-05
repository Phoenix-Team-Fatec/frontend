'use client';

import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, X, Bot, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { motion, AnimatePresence } from 'framer-motion';
import { useUser } from '@/hook/UserData';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

const SimpleAIChat = () => {
  const user = useUser();
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (user) {
      setMessages([
        { 
          role: 'assistant', 
          content: `Olá, ${user.user_nome || 'usuário'}! Sou seu assistente de projetos. Como posso ajudar você hoje?` 
        }
      ]);
    } else {
      setMessages([
        { 
          role: 'assistant', 
          content: 'Olá! Sou seu assistente de projetos. Como posso ajudar você hoje?' 
        }
      ]);
    }
  }, [user]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = () => {
    if (!message.trim()) return;

    setMessages(prev => [...prev, { role: 'user', content: message }]);
    setMessage('');
    setIsLoading(true);

    setTimeout(() => {
      setMessages(prev => [
        ...prev,
        { 
          role: 'assistant', 
          content: 'Esta é uma versão de demonstração do chat. Em uma implementação completa, eu poderia ajudar você a criar e gerenciar projetos automaticamente.' 
        }
      ]);
      setIsLoading(false);
    }, 1500);
  };

  return (
    <>
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-8 right-28 w-12 h-12 rounded-full bg-[#355EAF] text-white flex items-center justify-center shadow-xl hover:bg-[#2C4B8B] hover:scale-105 transition-all duration-300 cursor-pointer"
      >
        <MessageSquare size={20} />
      </Button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-28 right-10 w-80 sm:w-96 bg-white rounded-xl shadow-2xl overflow-hidden z-50 border border-gray-200"
          >
            <div className="flex items-center justify-between bg-[#355EAF] text-white p-4">
              <div className="flex items-center space-x-2">
                <Bot size={20} />
                <h3 className="font-medium">Assistente de Projetos</h3>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="text-white rounded-full hover:bg-[#2C4B8B] hover:text-white h-8 w-8 p-0 cursor-pointer">
                <X size={18} />
              </Button>
            </div>

            <div className="h-80 overflow-y-auto p-4 bg-gray-50">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`mb-4 flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`rounded-lg p-3 max-w-[85%] ${
                      msg.role === 'user'
                        ? 'bg-[#355EAF] text-white rounded-tr-none'
                        : 'bg-white text-gray-800 shadow-sm border border-gray-200 rounded-tl-none'
                    }`}
                  >
                    <div className="flex items-center space-x-2 mb-1">
                      {msg.role === 'assistant' ? (
                        <Bot size={16} className="text-[#355EAF]" />
                      ) : (
                        <User size={16} />
                      )}
                      <span className="text-xs font-medium">
                        {msg.role === 'assistant' ? 'Assistente' : 'Você'}
                      </span>
                    </div>
                    <p className="text-sm whitespace-pre-line">{msg.content}</p>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start mb-4">
                  <div className="bg-white text-gray-800 rounded-lg rounded-tl-none p-3 shadow-sm border border-gray-200">
                    <div className="flex items-center space-x-2">
                      <Bot size={16} className="text-[#355EAF]" />
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                        <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
            <div className="bg-white p-3 border-t border-gray-200">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="flex items-center space-x-2"
              >
                <Input
                  type="text"
                  placeholder="Digite sua mensagem..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  disabled={isLoading}
                  className="flex-1 bg-gray-100 border-0 focus-visible:ring-1 focus-visible:ring-[#355EAF]"
                />
                <Button
                  type="submit"
                  disabled={!message.trim() || isLoading}
                  className="bg-[#355EAF] hover:bg-[#2C4B8B] text-white rounded-full h-8 w-8 p-0 flex items-center justify-center"
                >
                  <Send size={16} />
                </Button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default SimpleAIChat;