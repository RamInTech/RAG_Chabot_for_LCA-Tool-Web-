import { Shield, Pickaxe } from 'lucide-react';
import { motion } from 'framer-motion';

interface ChatHeaderProps {
  model: 'flan' | 'llama';
  setModel: (model: 'flan' | 'llama') => void;
}

const ChatHeader = ({ model, setModel }: ChatHeaderProps) => {
  return (
    <motion.header 
      className="bg-gradient-primary border-b border-border shadow-soft"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <motion.div 
              className="flex items-center space-x-2"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="relative">
                <Shield className="h-8 w-8 text-primary-foreground" />
                <Pickaxe className="h-4 w-4 text-accent absolute -bottom-1 -right-1" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-primary-foreground">
                  Ministry of Mines
                </h1>
                <p className="text-sm text-primary-foreground/80">
                  Life Cycle Assessment Tool
                </p>
              </div>
            </motion.div>
          </div>
          
          <motion.div
            className="flex items-center space-x-4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <div className="text-right">
              <p className="text-sm text-primary-foreground/90 font-medium">
                Smart India Hackathon 2025
              </p>
              <p className="text-xs text-primary-foreground/70">
                RAG-Powered LCA Assistant
              </p>
            </div>
            <div className="flex flex-col">
              <label className="text-xs text-primary-foreground/70 mb-1">LLM Model</label>
              <select
                value={model}
                onChange={(e) => setModel(e.target.value as 'flan' | 'llama')}
                className="bg-primary-foreground/10 border border-primary-foreground/20 text-primary-foreground rounded px-2 py-1 text-sm"
              >
                <option value="flan">Google Flan T5</option>
                <option value="llama">Llama 3</option>
              </select>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.header>
  );
};

export default ChatHeader;