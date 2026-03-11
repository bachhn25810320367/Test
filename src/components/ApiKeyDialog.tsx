import React from 'react';
import { Key, ExternalLink, ArrowRight } from 'lucide-react';
import { Button } from './Button';

interface ApiKeyDialogProps {
  onContinue: () => void;
}

const ApiKeyDialog: React.FC<ApiKeyDialogProps> = ({ onContinue }) => {
  return (
    <div className="fixed inset-0 z-[200] bg-black/90 backdrop-blur-xl flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-zinc-900 border border-zinc-800 rounded-3xl p-8 shadow-2xl animate-pop-in">
        <div className="w-16 h-16 bg-indigo-500/20 rounded-2xl flex items-center justify-center mb-6 mx-auto">
          <Key className="text-indigo-400 w-8 h-8" />
        </div>
        
        <h2 className="text-2xl font-bold text-white text-center mb-4">API Key Required</h2>
        
        <p className="text-zinc-400 text-center mb-8 leading-relaxed">
          To use advanced AI image generation, you need to select a Gemini API key from a paid Google Cloud project.
        </p>

        <div className="space-y-4">
          <Button 
            onClick={onContinue} 
            className="w-full py-4 text-lg"
            icon={<ArrowRight size={20} />}
          >
            Select API Key
          </Button>
          
          <a 
            href="https://ai.google.dev/gemini-api/docs/billing" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 text-sm text-zinc-500 hover:text-indigo-400 transition-colors py-2"
          >
            Learn about billing <ExternalLink size={14} />
          </a>
        </div>
      </div>
    </div>
  );
};

export default ApiKeyDialog;
