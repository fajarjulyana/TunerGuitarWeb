// All chromatic notes and their frequencies
export type Note = {
  name: string;
  frequency: number;
  octave: number;
};

// Generate chromatic scale frequencies for octaves 0-8
// Using A4 = 440Hz as reference
function generateChromaticScale(): Note[] {
  const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
  const scale: Note[] = [];

  // A4 = 440Hz
  const A4 = 440;

  // Generate frequencies for octaves 0-8
  for (let octave = 0; octave <= 8; octave++) {
    notes.forEach((noteName, index) => {
      // Calculate frequency using the formula: f = 440 × 2^(n/12)
      // where n is the number of semitones from A4
      const n = index - 9 + (octave - 4) * 12;
      const frequency = A4 * Math.pow(2, n / 12);

      scale.push({
        name: noteName,
        frequency: Number(frequency.toFixed(2)),
        octave
      });
    });
  }

  return scale;
}

export const CHROMATIC_NOTES = generateChromaticScale();