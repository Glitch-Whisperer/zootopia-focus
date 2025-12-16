import { AlertTriangle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

const modeWarnings = {
  citizen: {
    title: 'Leave Session?',
    message: 'You\'ll lose your current progress in this biome.',
    confirmText: 'Leave Anyway',
  },
  zpd: {
    title: 'Abandon Case?',
    message: 'The suspect will escape! Chief Bogo won\'t be happy...',
    confirmText: 'Abandon Case',
  },
  hustle: {
    title: 'Give Up Hustle?',
    message: 'You\'ll lose your 500 Bucks bet instantly!',
    confirmText: 'Lose 500 Bucks',
  },
};

export function SessionAlert({ isOpen, onConfirm, onCancel, mode }) {
  if (!isOpen) return null;

  const warning = modeWarnings[mode];

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-background/90 backdrop-blur-sm animate-fade-in">
      <div className="glass-panel p-6 max-w-sm mx-4 animate-scale-in">
        <div className="flex items-center justify-between mb-4">
          <div className="w-12 h-12 rounded-full bg-destructive/20 flex items-center justify-center">
            <AlertTriangle className="w-6 h-6 text-destructive" />
          </div>
          <button 
            onClick={onCancel}
            className="w-8 h-8 rounded-full bg-muted/80 flex items-center justify-center hover:bg-muted"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        
        <h3 className="font-display text-xl text-foreground mb-2">{warning.title}</h3>
        <p className="text-muted-foreground mb-6">{warning.message}</p>
        
        <div className="flex gap-3">
          <Button 
            variant="outline" 
            className="flex-1 font-display"
            onClick={onCancel}
          >
            Stay
          </Button>
          <Button 
            variant="destructive" 
            className="flex-1 font-display"
            onClick={onConfirm}
          >
            {warning.confirmText}
          </Button>
        </div>
      </div>
    </div>
  );
}
