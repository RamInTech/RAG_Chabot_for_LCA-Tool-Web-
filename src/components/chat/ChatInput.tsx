import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send, Paperclip } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

const ChatInput = ({ 
  onSendMessage, 
  disabled = false, 
  placeholder = "Ask about LCA data, mining processes, or circular economy..." 
}: ChatInputProps) => {
  const [message, setMessage] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      onSendMessage(message.trim());
      setMessage('');
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
    
    // Auto-resize textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  useEffect(() => {
    // Simple focus animation without anime.js
    const inputElement = textareaRef.current;
    if (inputElement) {
      const handleFocus = () => {
        inputElement.style.transform = 'scale(1.02)';
        inputElement.style.transition = 'transform 0.2s ease-out';
        setTimeout(() => {
          inputElement.style.transform = 'scale(1)';
        }, 200);
      };
      
      inputElement.addEventListener('focus', handleFocus);
      return () => inputElement.removeEventListener('focus', handleFocus);
    }
  }, []);

  return (
    <motion.div 
      className="border-t border-border bg-background/95 backdrop-blur-sm"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <div className="container mx-auto px-6 py-4">
        <form onSubmit={handleSubmit} className="relative">
          <div className="flex items-end space-x-3">
            {/* File attachment button */}
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="flex-shrink-0 btn-professional"
              disabled={disabled}
            >
              <Paperclip size={16} />
            </Button>

            {/* Message input */}
            <div className="flex-1 relative">
              <Textarea
                ref={textareaRef}
                value={message}
                onChange={handleTextareaChange}
                onKeyPress={handleKeyPress}
                placeholder={placeholder}
                disabled={disabled}
                className={cn(
                  "min-h-[44px] max-h-32 resize-none pr-12 shadow-soft transition-all duration-200",
                  "focus:shadow-medium focus:ring-2 focus:ring-primary/20",
                  disabled && "opacity-50 cursor-not-allowed"
                )}
                rows={1}
              />
              
              {/* Character count indicator */}
              {message.length > 0 && (
                <motion.div
                  className="absolute bottom-2 right-12 text-xs text-muted-foreground"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.2 }}
                >
                  {message.length}
                </motion.div>
              )}
            </div>

            {/* Send button */}
            <Button
              type="submit"
              disabled={!message.trim() || disabled}
              className={cn(
                "flex-shrink-0 btn-professional",
                "bg-gradient-primary hover:bg-primary-hover",
                "disabled:opacity-50 disabled:cursor-not-allowed"
              )}
            >
              <Send size={16} />
            </Button>
          </div>

          {/* Quick action buttons */}
          <motion.div 
            className="flex flex-wrap gap-2 mt-3"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            transition={{ delay: 0.5, duration: 0.3 }}
          >
            {[
              'LCA for copper mining',
              'Circular economy benefits',
              'Environmental impact data'
            ].map((suggestion, index) => (
              <motion.button
                key={suggestion}
                type="button"
                onClick={() => setMessage(suggestion)}
                className="text-xs px-3 py-1 rounded-full border border-border hover:border-primary transition-colors text-muted-foreground hover:text-primary"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + index * 0.1 }}
              >
                {suggestion}
              </motion.button>
            ))}
          </motion.div>
        </form>
      </div>
    </motion.div>
  );
};

export default ChatInput;