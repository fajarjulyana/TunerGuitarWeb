import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

interface TuningGaugeProps {
  cents: number;
}

export default function TuningGauge({ cents }: TuningGaugeProps) {
  const progress = Math.min(Math.max((cents + 50) / 100 * 100, 0), 100);
  
  const getAccuracyColor = () => {
    const absValue = Math.abs(cents);
    if (absValue <= 5) return 'bg-green-500';
    if (absValue <= 15) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <Card className="p-6 space-y-4">
      <Progress 
        value={progress} 
        className={cn("w-full h-4", getAccuracyColor())}
      />
      <div className="flex justify-between text-sm text-muted-foreground">
        <span>-50 cents</span>
        <span className={cn(
          "font-bold",
          Math.abs(cents) <= 5 && "text-green-500",
          Math.abs(cents) <= 15 && cents > 5 && "text-yellow-500",
          Math.abs(cents) > 15 && "text-red-500"
        )}>
          {cents > 0 ? '+' : ''}{cents} cents
        </span>
        <span>+50 cents</span>
      </div>
    </Card>
  );
}
