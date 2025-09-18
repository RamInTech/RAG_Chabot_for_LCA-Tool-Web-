import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ChatHeader from './ChatHeader';
import ChatMessage, { Message } from './ChatMessage';
import ChatInput from './ChatInput';
import ChatSidebar from './ChatSidebar';
import TypingIndicator from './TypingIndicator';

const ChatbotPage = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: 'Hello! I\'m your LCA assistant for the Ministry of Mines. I can help you with Life Cycle Assessment queries, mining environmental impacts, and circular economy insights. What would you like to know?',
      sender: 'bot',
      timestamp: new Date(),
      sources: ['LCA Knowledge Base - Introduction', 'Mining Standards Database']
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [model, setModel] = useState<'flan' | 'llama'>('flan');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSendMessage = async (content: string) => {
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);

    try {
      const response = await fetch('http://localhost:8000/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ query: content, model })
      });
      const data = await response.json();
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: data.answer || 'Sorry, no answer received.',
        sender: 'bot',
        timestamp: new Date(),
        sources: [] // You can extend to include sources if backend provides
      };
      setMessages(prev => [...prev, botResponse]);
    } catch (error) {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: 'Error fetching response: ' + (error as Error).message,
        sender: 'bot',
        timestamp: new Date(),
        sources: []
      };
      setMessages(prev => [...prev, botResponse]);
    } finally {
      setIsTyping(false);
    }
  };

  const generateMockResponse = (query: string): string => {
    const responses = {
      lca: 'Life Cycle Assessment (LCA) is a systematic approach to evaluating the environmental impacts of mining operations throughout their entire lifecycle. For mining operations, this includes extraction, processing, transportation, and end-of-life management phases.',
      carbon: 'Carbon footprint analysis for mining operations typically shows that energy consumption during extraction and processing phases contribute 60-80% of total emissions. Implementation of renewable energy sources can reduce this by 30-50%.',
      water: 'Water usage in mining varies significantly by mineral type. Copper mining typically requires 150-200 cubic meters per ton of copper produced, while iron ore mining uses approximately 50-80 cubic meters per ton.',
      circular: 'Circular economy principles in mining focus on waste minimization, resource recovery, and sustainable practices. Key strategies include mine waste valorization, closed-loop water systems, and equipment lifecycle optimization.',
      default: 'Based on our LCA knowledge base, I can provide detailed analysis of environmental impacts, sustainability metrics, and regulatory compliance information for various mining operations. Could you please specify which aspect you\'d like to explore further?'
    };

    const lowerQuery = query.toLowerCase();
    if (lowerQuery.includes('lca') || lowerQuery.includes('life cycle')) return responses.lca;
    if (lowerQuery.includes('carbon') || lowerQuery.includes('footprint')) return responses.carbon;
    if (lowerQuery.includes('water')) return responses.water;
    if (lowerQuery.includes('circular') || lowerQuery.includes('economy')) return responses.circular;
    return responses.default;
  };

  const generateMockSources = (query: string): string[] => {
    const baseSources = [
      'ISO 14040:2006 - Environmental management principles',
      'Mining Industry LCA Database 2024',
      'Environmental Impact Assessment Guidelines'
    ];

    const lowerQuery = query.toLowerCase();
    if (lowerQuery.includes('carbon')) {
      return [...baseSources, 'Carbon Footprint Calculation Standards', 'IPCC Mining Sector Guidelines'];
    }
    if (lowerQuery.includes('water')) {
      return [...baseSources, 'Water Usage in Mining Operations Study', 'Sustainable Water Management Guidelines'];
    }
    if (lowerQuery.includes('circular')) {
      return [...baseSources, 'Circular Economy in Mining Whitepaper', 'Resource Recovery Best Practices'];
    }
    return baseSources;
  };

  return (
    <div className="h-screen flex flex-col bg-background">
      <ChatHeader model={model} setModel={setModel} />
      
      <div className="flex-1 flex overflow-hidden">
        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col">
          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            <div className="container mx-auto px-6 py-6">
              <motion.div
                className="space-y-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                {messages.map((message, index) => (
                  <ChatMessage
                    key={message.id}
                    message={message}
                    index={index}
                  />
                ))}
                
                <AnimatePresence>
                  {isTyping && <TypingIndicator />}
                </AnimatePresence>
                
                <div ref={messagesEndRef} />
              </motion.div>
            </div>
          </div>

          {/* Input Area */}
          <ChatInput 
            onSendMessage={handleSendMessage}
            disabled={isTyping}
          />
        </div>

        {/* Sidebar Toggle Button */}
        <motion.button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="fixed top-20 right-4 z-50 p-2 bg-primary text-primary-foreground rounded-lg shadow-medium hover:shadow-strong transition-shadow duration-200"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          animate={{ 
            rotate: isSidebarOpen ? 180 : 0,
            right: isSidebarOpen ? 324 : 16 
          }}
          transition={{ duration: 0.3 }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </motion.button>

        {/* Sidebar */}
        <AnimatePresence>
          {isSidebarOpen && (
            <ChatSidebar 
              onSelectQuery={handleSendMessage}
              onClose={() => setIsSidebarOpen(false)}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ChatbotPage;