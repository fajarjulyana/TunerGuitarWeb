import { Card } from '@/components/ui/card';

interface NoteDisplayProps {
  note: string;
}

export default function NoteDisplay({ note }: NoteDisplayProps) {
  // Split note into name and octave (e.g., "C#4" -> ["C#", "4"])
  const [noteName, octave] = note ? note.match(/([A-G]#?)(\d)/)?.slice(1) || ['--', '--'] : ['--', '--'];

  return (
    <Card className="p-8 flex flex-col items-center justify-center bg-primary space-y-2">
      <span className="text-8xl font-bold text-primary-foreground">
        {noteName}
      </span>
      <span className="text-2xl font-semibold text-primary-foreground/80">
        Octave {octave}
      </span>
    </Card>
  );
}