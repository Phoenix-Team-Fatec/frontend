'use client';
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { MessageSquare, Send, X, Bot, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { motion, AnimatePresence } from 'framer-motion';
import { useUser } from '@/hook/UserData';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}
interface SimpleAIChatProps {
  onTaskUpdate?: () => void;
}

const SimpleAIChat = ({ onTaskUpdate }: SimpleAIChatProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Configuração da URL da API
  const API_URL = 'http://localhost:3000';

  useEffect(() => {
    // Mensagem inicial genérica
    setMessages([{ 
      role: 'assistant', 
      content: 'Olá! Sou seu assistente de tarefas. Como posso ajudar?' 
    }]);
  }, []);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    try {
      // Adiciona mensagem do usuário
      setMessages(prev => [...prev, { role: 'user', content: message }]);
      setMessage('');
      setIsLoading(true);

      // Chamada para a API
      const response = await fetch(`http://localhost:3000/ai/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro na requisição');
      }

      const data = await response.json();

      // Adiciona resposta da IA
      setMessages(prev => [
        ...prev,
        { role: 'assistant', content: data.message }
      ]);

      if (data.success && onTaskUpdate) {
        onTaskUpdate(); // Atualiza a lista de tarefas
      }

    } catch (error) {
      console.error('Erro:', error);
      
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Erro desconhecido ao processar solicitação';

      setMessages(prev => [
        ...prev,
        { 
          role: 'assistant', 
          content: `⚠️ ${errorMessage}` 
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-8 right-28 w-12 h-12 rounded-full bg-[#355EAF] text-white flex items-center justify-center shadow-xl hover:bg-[#2C4B8B] hover:scale-105 transition-all duration-300 cursor-pointer"
        aria-label="Abrir chat"
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
            role="dialog"
            aria-label="Chat de assistente de tarefas"
          >
            <div className="flex items-center justify-between bg-[#355EAF] text-white p-4">
              <div className="flex items-center space-x-2">
                <Bot size={20} aria-hidden="true" />
                <h3 className="font-medium">Assistente de Tarefas</h3>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setIsOpen(false)}
                className="text-white rounded-full hover:bg-[#2C4B8B] hover:text-white h-8 w-8 p-0 cursor-pointer"
                aria-label="Fechar chat"
              >
                <X size={18} aria-hidden="true" />
              </Button>
            </div>

            <div className="h-80 overflow-y-auto p-4 bg-gray-50">
              {messages.map((msg, index) => (
                <div
                  key={`msg-${index}-${Date.now()}`}
                  className={`mb-4 flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`rounded-lg p-3 max-w-[85%] ${
                      msg.role === 'user'
                        ? 'bg-[#355EAF] text-white rounded-tr-none'
                        : 'bg-white text-gray-800 shadow-sm border border-gray-200 rounded-tl-none'
                    }`}
                    role="article"
                    aria-label={`Mensagem de ${msg.role === 'user' ? 'você' : 'assistente'}`}
                  >
                    <div className="flex items-center space-x-2 mb-1">
                      {msg.role === 'assistant' ? (
                        <Bot size={16} className="text-[#355EAF]" aria-hidden="true" />
                      ) : (
                        <User size={16} aria-hidden="true" />
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
                      <Bot size={16} className="text-[#355EAF]" aria-hidden="true" />
                      <div className="flex space-x-1" aria-label="Carregando">
                        {[...Array(3)].map((_, i) => (
                          <div
                            key={i}
                            className="w-2 h-2 bg-gray-300 rounded-full animate-bounce"
                            style={{ animationDelay: `${i * 0.2}s` }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} aria-hidden="true" />
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
                  aria-label="Campo de mensagem"
                />
                <Button
                  type="submit"
                  disabled={!message.trim() || isLoading}
                  className="bg-[#355EAF] hover:bg-[#2C4B8B] text-white rounded-full h-8 w-8 p-0 flex items-center justify-center"
                  aria-label="Enviar mensagem"
                >
                  <Send size={16} aria-hidden="true" />
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