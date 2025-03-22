import { PitchDetector } from 'pitchy';
import { CHROMATIC_NOTES, type Note } from '@shared/schema';

export class Tuner {
  private audioContext: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private stream: MediaStream | null = null;
  private animationFrame: number | null = null;
  private detector: PitchDetector<Float32Array> | null = null;
  private lastNote: string = '';
  private noteBuffer: string[] = [];
  private readonly bufferSize = 5;

  constructor(
    private onPitch: (note: string, cents: number) => void,
    private onError: (error: string) => void
  ) {}

  async start() {
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      this.audioContext = new AudioContext();
      const source = this.audioContext.createMediaStreamSource(this.stream);
      this.analyser = this.audioContext.createAnalyser();
      this.detector = PitchDetector.forFloat32Array(this.analyser.frequencyBinCount);
      source.connect(this.analyser);

      console.log('Tuner started successfully');
      this.analyse();
    } catch (error) {
      console.error('Tuner start error:', error);
      this.onError('Microphone access denied');
    }
  }

  stop() {
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
    }
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
    }
    if (this.audioContext) {
      this.audioContext.close();
    }
    this.analyser = null;
    this.stream = null;
    this.audioContext = null;
    this.detector = null;
    this.noteBuffer = [];
    this.lastNote = '';
    console.log('Tuner stopped');
  }

  private analyse = () => {
    if (!this.analyser || !this.audioContext || !this.detector) return;

    const buffer = new Float32Array(this.analyser.frequencyBinCount);
    this.analyser.getFloatTimeDomainData(buffer);

    const [pitch, clarity] = this.detector.findPitch(buffer, this.audioContext.sampleRate);

    if (clarity > 0.9 && pitch > 0) {
      const closestNote = this.findClosestNote(pitch);
      const cents = this.getCents(pitch, closestNote);

      // Debug logging
      console.debug('Pitch detection:', {
        frequency: pitch.toFixed(2),
        clarity: clarity.toFixed(2),
        note: closestNote.name,
        octave: closestNote.octave,
        cents
      });

      // Add note to buffer for smoothing
      const noteString = this.formatNote(closestNote);
      this.noteBuffer.push(noteString);
      if (this.noteBuffer.length > this.bufferSize) {
        this.noteBuffer.shift();
      }

      // Only update if the same note appears majority of times in the buffer
      const mostFrequentNote = this.getMostFrequentNote();
      if (mostFrequentNote && mostFrequentNote !== this.lastNote) {
        this.lastNote = mostFrequentNote;
        this.onPitch(mostFrequentNote, cents);
      }
    }

    this.animationFrame = requestAnimationFrame(this.analyse);
  };

  private findClosestNote(frequency: number): Note {
    return CHROMATIC_NOTES.reduce((prev, curr) => {
      const prevDiff = Math.abs(prev.frequency - frequency);
      const currDiff = Math.abs(curr.frequency - frequency);
      return currDiff < prevDiff ? curr : prev;
    });
  }

  private getCents(frequency: number, note: Note): number {
    return Math.round(1200 * Math.log2(frequency / note.frequency));
  }

  private formatNote(note: Note): string {
    return `${note.name}${note.octave}`;
  }

  private getMostFrequentNote(): string | null {
    if (this.noteBuffer.length === 0) return null;

    const noteCounts = new Map<string, number>();
    let maxCount = 0;
    let mostFrequentNote = null;

    for (const note of this.noteBuffer) {
      const count = (noteCounts.get(note) || 0) + 1;
      noteCounts.set(note, count);

      if (count > maxCount) {
        maxCount = count;
        mostFrequentNote = note;
      }
    }

    // Only return if the note appears more than 50% of the buffer size
    return maxCount > this.bufferSize / 2 ? mostFrequentNote : null;
  }
}