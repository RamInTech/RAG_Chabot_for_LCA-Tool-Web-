import { motion } from 'framer-motion';
import { User, Bot, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface Message {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  sources?: string[];
}

interface ChatMessageProps {
  message: Message;
  index: number;
}

const ChatMessage = ({ message, index }: ChatMessageProps) => {
  const isUser = message.sender === 'user';

  return (
    <motion.div
      className={cn(
        "flex w-full mb-4",
        isUser ? "justify-end" : "justify-start"
      )}
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ 
        delay: index * 0.1,
        duration: 0.4,
        ease: [0.25, 0.1, 0.25, 1]
      }}
    >
      <div
        className={cn(
          "max-w-[80%] lg:max-w-[70%] flex",
          isUser ? "flex-row-reverse" : "flex-row"
        )}
      >
        {/* Avatar */}
        <motion.div
          className={cn(
            "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center shadow-soft",
            isUser 
              ? "bg-chat-user text-chat-user-foreground ml-3" 
              : "bg-chat-bot text-chat-bot-foreground mr-3 border border-border"
          )}
          whileHover={{ scale: 1.1 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          {isUser ? <User size={16} /> : <Bot size={16} />}
        </motion.div>

        {/* Message Content */}
        <div
          className={cn(
            "px-4 py-3 rounded-2xl shadow-soft",
            isUser
              ? "bg-chat-user text-chat-user-foreground rounded-br-md"
              : "bg-chat-bot text-chat-bot-foreground border border-border rounded-bl-md"
          )}
        >
          <p className="text-sm leading-relaxed whitespace-pre-wrap">
            {message.content}
          </p>

          {/* Sources for bot messages */}
          {!isUser && message.sources && message.sources.length > 0 && (
            <motion.div 
              className="mt-3 pt-3 border-t border-border/30"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              transition={{ delay: 0.3, duration: 0.3 }}
            >
              <p className="text-xs font-medium text-muted-foreground mb-2">
                Sources from LCA Knowledge Base:
              </p>
              <div className="space-y-1">
                {message.sources.map((source, idx) => (
                  <motion.div
                    key={idx}
                    className="flex items-center space-x-2 text-xs"
                    whileHover={{ x: 2 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <ExternalLink size={12} className="text-accent" />
                    <span className="text-muted-foreground hover:text-accent cursor-pointer transition-colors">
                      {source}
                    </span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Timestamp */}
          <p className={cn(
            "text-xs mt-2",
            isUser ? "text-chat-user-foreground/70" : "text-muted-foreground"
          )}>
            {message.timestamp.toLocaleTimeString([], { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default ChatMessage;