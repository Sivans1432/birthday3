// Romantic Web Audio synthesizer + HTML5 Audio fallback engine
// Ensures 100% working romantic background music even if local MP3 is empty or unplayable

class RomanticAudioEngine {
  private ctx: AudioContext | null = null
  private masterGain: GainNode | null = null
  private isPlaying: boolean = false
  private timerId: number | null = null
  private audioEl: HTMLAudioElement | null = null
  private useHtmlAudio: boolean = false
  private currentVolume: number = 0.7

  // Romantic chord progression in G Major / E Minor:
  // Gmaj7 -> Em9 -> Cmaj7 -> Dadd9
  private chordProgression = [
    // G major 7 chord notes (Hz)
    [196.00, 246.94, 293.66, 369.99, 392.00, 493.88],
    // E minor 9 chord notes
    [164.81, 246.94, 293.66, 329.63, 392.00, 493.88],
    // C major 7 chord notes
    [130.81, 196.00, 246.94, 261.63, 329.63, 392.00],
    // D add 9 chord notes
    [146.83, 220.00, 293.66, 369.99, 440.00, 587.33]
  ]
  private chordIndex = 0
  private noteIndex = 0

  constructor() {
    // AudioContext will be initialized on first user gesture
  }

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
      this.ctx = new AudioCtx()
      this.masterGain = this.ctx.createGain()
      this.masterGain.gain.setValueAtTime(this.currentVolume, this.ctx.currentTime)
      this.masterGain.connect(this.ctx.destination)
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume()
    }
  }

  // Play a soft bell/piano chime
  private playRomanticNote(freq: number, time: number, duration: number = 2.4, velocity: number = 0.18) {
    if (!this.ctx || !this.masterGain) return

    const osc = this.ctx.createOscillator()
    const osc2 = this.ctx.createOscillator()
    const noteGain = this.ctx.createGain()
    const filter = this.ctx.createBiquadFilter()

    // Warm filter for dream-like romantic tone
    filter.type = 'lowpass'
    filter.frequency.setValueAtTime(1400, time)
    filter.frequency.exponentialRampToValueAtTime(600, time + duration)

    osc.type = 'sine'
    osc.frequency.setValueAtTime(freq, time)

    // Gentle shimmer overtone
    osc2.type = 'triangle'
    osc2.frequency.setValueAtTime(freq * 2.001, time)

    // Envelope
    noteGain.gain.setValueAtTime(0.0001, time)
    noteGain.gain.exponentialRampToValueAtTime(velocity, time + 0.05)
    noteGain.gain.exponentialRampToValueAtTime(velocity * 0.4, time + 0.4)
    noteGain.gain.exponentialRampToValueAtTime(0.00001, time + duration)

    osc.connect(filter)
    osc2.connect(filter)
    filter.connect(noteGain)
    noteGain.connect(this.masterGain)

    osc.start(time)
    osc2.start(time)
    osc.stop(time + duration)
    osc2.stop(time + duration)
  }

  // Melodic arpeggiator loop
  private scheduleArpeggios = () => {
    if (!this.isPlaying || !this.ctx) return

    const chord = this.chordProgression[this.chordIndex]
    const freq = chord[this.noteIndex % chord.length]
    const now = this.ctx.currentTime

    // Add gentle root bass note at start of chord
    if (this.noteIndex === 0) {
      this.playRomanticNote(chord[0] / 2, now, 3.8, 0.22)
    }

    // Play melody note
    this.playRomanticNote(freq, now, 2.2, 0.16)

    this.noteIndex++
    if (this.noteIndex >= chord.length * 2) {
      this.noteIndex = 0
      this.chordIndex = (this.chordIndex + 1) % this.chordProgression.length
    }

    // Gentle timing between notes: ~380ms
    this.timerId = window.setTimeout(this.scheduleArpeggios, 380)
  }

  // Play magical wish chime (for cake blowing / gift box)
  public playWishChime() {
    this.initContext()
    if (!this.ctx || !this.masterGain) return

    const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51, 1567.98] // C5 to G6
    const now = this.ctx.currentTime

    notes.forEach((freq, idx) => {
      this.playRomanticNote(freq, now + idx * 0.09, 2.5, 0.24)
    })
  }

  public async play(srcUrl?: string): Promise<boolean> {
    this.initContext()
    this.isPlaying = true

    // Check if HTML5 audio can play the user's provided file
    if (srcUrl) {
      try {
        if (!this.audioEl) {
          this.audioEl = new Audio(srcUrl)
          this.audioEl.loop = true
          this.audioEl.volume = this.currentVolume
        }

        // Test if audio is valid
        const playPromise = this.audioEl.play()
        if (playPromise !== undefined) {
          await playPromise
          this.useHtmlAudio = true
          return true
        }
      } catch (err) {
        console.warn("Custom audio playback failed or file empty, falling back to romantic piano synthesizer.", err)
        this.useHtmlAudio = false
      }
    }

    // Fallback or default: romantic ambient synthesizer
    this.useHtmlAudio = false
    this.scheduleArpeggios()
    return true
  }

  public pause() {
    this.isPlaying = false
    if (this.timerId) {
      clearTimeout(this.timerId)
      this.timerId = null
    }
    if (this.audioEl && !this.audioEl.paused) {
      this.audioEl.pause()
    }
  }

  public toggle(srcUrl?: string) {
    if (this.isPlaying) {
      this.pause()
      return false
    } else {
      this.play(srcUrl)
      return true
    }
  }

  public setVolume(vol: number) {
    this.currentVolume = Math.max(0, Math.min(1, vol))
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(this.currentVolume, this.ctx.currentTime)
    }
    if (this.audioEl) {
      this.audioEl.volume = this.currentVolume
    }
  }

  public getVolume(): number {
    return this.currentVolume
  }

  public getIsPlaying(): boolean {
    return this.isPlaying
  }

  public isUsingHtmlAudio(): boolean {
    return this.useHtmlAudio
  }
}

export const romanticAudio = new RomanticAudioEngine()
