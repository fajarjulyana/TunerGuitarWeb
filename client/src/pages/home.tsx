import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Tuner } from '@/lib/tuner';
import NoteDisplay from '@/components/tuner/note-display';
import TuningGauge from '@/components/tuner/tuning-gauge';
import MicStatus from '@/components/tuner/mic-status';

export default function Home() {
  const [note, setNote] = useState('');
  const [cents, setCents] = useState(0);
  const [error, setError] = useState('');
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    const tuner = new Tuner(
      (detectedNote, detectedCents) => {
        setNote(detectedNote);
        setCents(detectedCents);
      },
      (err) => setError(err)
    );

    return () => tuner.stop();
  }, []);

  const toggleTuner = async () => {
    const tuner = new Tuner(
      (detectedNote, detectedCents) => {
        setNote(detectedNote);
        setCents(detectedCents);
      },
      (err) => setError(err)
    );

    if (!isActive) {
      await tuner.start();
      setIsActive(true);
    } else {
      tuner.stop();
      setIsActive(false);
      setNote('');
      setCents(0);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-lg p-8 space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-primary">Guitar Tuner</h1>
          <p className="text-muted-foreground">
            Use your microphone to tune your guitar
          </p>
        </div>

        <MicStatus 
          isActive={isActive} 
          error={error}
          onToggle={toggleTuner}
        />

        {isActive && (
          <div className="space-y-8">
            <NoteDisplay note={note} />
            <TuningGauge cents={cents} />
          </div>
        )}
      </Card>
    </div>
  );
}
