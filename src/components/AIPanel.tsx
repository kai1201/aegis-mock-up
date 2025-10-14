import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { MessageCircle, Send, X, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AIMessage {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  sources?: Array<{
    title: string;
    url: string;
    type: 'document' | 'chart' | 'news';
  }>;
  timestamp: Date;
}

interface AIPanelProps {
  isOpen: boolean;
  onClose: () => void;
  context?: string;
  className?: string;
}

export default function AIPanel({ isOpen, onClose, context, className }: AIPanelProps) {
  const [messages, setMessages] = useState<AIMessage[]>([
    {
      id: '1',
      type: 'assistant',
      content: context 
        ? `I can help you understand the data in this context. What would you like to know?`
        : `Hello! I'm your Component Risk Intelligence assistant. I can help you with part analysis, EOL insights, cross-references, and supply chain risks. How can I assist you today?`,
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: AIMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: input,
      timestamp: new Date(),
    };

    const assistantMessage: AIMessage = {
      id: (Date.now() + 1).toString(),
      type: 'assistant',
      content: `Based on the available data, here's my analysis of "${input}". This is a simulated response that would normally include detailed technical insights with proper source citations.`,
      sources: [
        { title: 'PCN Document TI-2024-001', url: '#', type: 'document' },
        { title: 'Lead Time Trend Analysis', url: '#', type: 'chart' },
        { title: 'Supplier News Update', url: '#', type: 'news' },
      ],
      timestamp: new Date(),
    };

    setMessages([...messages, userMessage, assistantMessage]);
    setInput('');
  };

  if (!isOpen) return null;

  return (
    <Card className={cn('w-80 h-[500px] flex flex-col', className)}>
      <CardHeader className="flex flex-row items-center justify-between py-3">
        <CardTitle className="text-base flex items-center">
          <MessageCircle className="w-4 h-4 mr-2" />
          AI Assistant
        </CardTitle>
        <Button variant="ghost" size="sm" onClick={onClose} className="h-6 w-6 p-0">
          <X className="w-4 h-4" />
        </Button>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col p-4 pt-0">
        <div className="flex-1 space-y-4 overflow-y-auto mb-4">
          {messages.map((message) => (
            <div key={message.id} className={cn(
              'flex',
              message.type === 'user' ? 'justify-end' : 'justify-start'
            )}>
              <div className={cn(
                'max-w-[85%] rounded-lg px-3 py-2 text-sm',
                message.type === 'user' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 text-gray-900'
              )}>
                <p>{message.content}</p>
                {message.sources && (
                  <div className="mt-2 space-y-1">
                    <p className="text-xs opacity-70">Sources:</p>
                    {message.sources.map((source, index) => (
                      <div key={index} className="flex items-center space-x-1">
                        <Badge variant="outline" className="text-xs">
                          {source.type}
                        </Badge>
                        <a href={source.url} className="text-xs underline flex items-center">
                          {source.title}
                          <ExternalLink className="w-2 h-2 ml-1" />
                        </a>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="flex space-x-2">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about parts, risks, or analysis..."
            className="flex-1 min-h-[2.5rem] resize-none"
            onKeyPress={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
          />
          <Button onClick={handleSend} size="sm" className="px-3">
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}