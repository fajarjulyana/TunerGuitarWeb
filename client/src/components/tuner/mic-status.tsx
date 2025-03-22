import { Button } from '@/components/ui/button';
import { Mic, MicOff } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface MicStatusProps {
  isActive: boolean;
  error: string;
  onToggle: () => void;
}

export default function MicStatus({ isActive, error, onToggle }: MicStatusProps) {
  return (
    <div className="space-y-4">
      <Button 
        onClick={onToggle}
        variant={isActive ? "destructive" : "default"}
        className="w-full"
      >
        {isActive ? (
          <>
            <MicOff className="mr-2 h-4 w-4" />
            Stop Tuner
          </>
        ) : (
          <>
            <Mic className="mr-2 h-4 w-4" />
            Start Tuner
          </>
        )}
      </Button>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  );
}
