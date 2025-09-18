import { motion } from 'framer-motion';
import { Bot } from 'lucide-react';

const TypingIndicator = () => {
  return (
    <motion.div
      className="flex w-full mb-4 justify-start"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <div className="max-w-[80%] lg:max-w-[70%] flex">
        {/* Bot Avatar */}
        <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-chat-bot text-chat-bot-foreground mr-3 border border-border shadow-soft">
          <Bot size={16} />
        </div>

        {/* Typing Animation */}
        <div className="bg-chat-bot text-chat-bot-foreground px-4 py-3 rounded-2xl rounded-bl-md shadow-soft border border-border">
          <div className="flex items-center space-x-1">
            <span className="text-sm text-muted-foreground mr-2">
              Retrieving from LCA database
            </span>
            <div className="flex space-x-1">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="w-2 h-2 bg-accent rounded-full"
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.5, 1, 0.5],
                  }}
                  transition={{
                    duration: 1.4,
                    repeat: Infinity,
                    delay: i * 0.2,
                    ease: "easeInOut",
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default TypingIndicator;