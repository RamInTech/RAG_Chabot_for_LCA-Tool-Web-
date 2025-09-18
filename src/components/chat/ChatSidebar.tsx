import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Info, 
  Lightbulb, 
  Recycle, 
  TreePine, 
  Factory, 
  ChevronRight 
} from 'lucide-react';

interface ChatSidebarProps {
  onSelectQuery?: (query: string) => void;
  onClose?: () => void;
}

const ChatSidebar = ({ onSelectQuery, onClose }: ChatSidebarProps) => {
  const exampleQueries = [
    {
      category: 'LCA Basics',
      icon: Info,
      queries: [
        'What is Life Cycle Assessment?',
        'LCA phases for mining operations',
        'Environmental impact categories'
      ]
    },
    {
      category: 'Mining Processes',
      icon: Factory,
      queries: [
        'Carbon footprint of iron ore mining',
        'Water usage in coal extraction',
        'Energy consumption in mineral processing'
      ]
    },
    {
      category: 'Circular Economy',
      icon: Recycle,
      queries: [
        'Waste-to-resource opportunities',
        'Mine closure and rehabilitation',
        'Sustainable mining practices'
      ]
    },
    {
      category: 'Environmental Impact',
      icon: TreePine,
      queries: [
        'Biodiversity impact assessment',
        'Soil contamination analysis',
        'Air quality monitoring data'
      ]
    }
  ];

  const keyFeatures = [
    'Real-time LCA calculations',
    'Environmental impact scoring',
    'Circular economy recommendations',
    'Regulatory compliance checks',
    'Sustainability metrics tracking'
  ];

  return (
    <motion.aside 
      className="w-80 bg-chat-sidebar border-l border-border h-full overflow-y-auto custom-scrollbar"
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 100 }}
      transition={{ duration: 0.3 }}
    >
      <div className="p-6 space-y-6">
        {/* Tool Description */}
        <Card className="p-4 shadow-soft">
          <div className="flex items-center space-x-2 mb-3">
            <Lightbulb className="h-5 w-5 text-accent" />
            <h3 className="font-semibold text-foreground">About This Tool</h3>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Our RAG-powered LCA assistant helps you analyze environmental impacts 
            throughout the mining lifecycle. Ask questions about processes, 
            materials, and sustainability metrics.
          </p>
          
          <div className="mt-4 space-y-2">
            <h4 className="text-sm font-medium text-foreground">Key Features:</h4>
            {keyFeatures.map((feature, index) => (
              <motion.div
                key={feature}
                className="flex items-center space-x-2"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
              >
                <ChevronRight size={12} className="text-accent" />
                <span className="text-xs text-muted-foreground">{feature}</span>
              </motion.div>
            ))}
          </div>
        </Card>

        {/* Example Queries */}
        <div className="space-y-4">
          <h3 className="font-semibold text-foreground flex items-center space-x-2">
            <Info className="h-4 w-4 text-primary" />
            <span>Example Queries</span>
          </h3>

          {exampleQueries.map((category, categoryIndex) => (
            <motion.div
              key={category.category}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 + categoryIndex * 0.1 }}
            >
              <Card className="p-4 shadow-soft hover:shadow-medium transition-shadow duration-200">
                <div className="flex items-center space-x-2 mb-3">
                  <category.icon className="h-4 w-4 text-accent" />
                  <Badge variant="secondary" className="text-xs">
                    {category.category}
                  </Badge>
                </div>
                
                <div className="space-y-2">
                  {category.queries.map((query, queryIndex) => (
                    <motion.button
                      key={query}
                      className="w-full text-left text-sm text-muted-foreground hover:text-primary p-2 rounded-md hover:bg-muted/50 transition-colors duration-200 border border-transparent hover:border-border"
                      whileHover={{ x: 4 }}
                      transition={{ type: "spring", stiffness: 300 }}
                      onClick={() => {
                        onSelectQuery?.(query);
                      }}
                    >
                      {query}
                    </motion.button>
                  ))}
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Additional Info */}
        <Card className="p-4 bg-gradient-secondary shadow-soft">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
          >
            <h4 className="font-medium text-secondary-foreground mb-2">
              Need Help?
            </h4>
            <p className="text-xs text-secondary-foreground/80">
              This AI assistant is trained on comprehensive LCA databases, 
              mining industry standards, and environmental regulations. 
              For complex calculations, please verify results with domain experts.
            </p>
          </motion.div>
        </Card>
      </div>
    </motion.aside>
  );
};

export default ChatSidebar;