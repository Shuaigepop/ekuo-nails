/**
 * Luxury Web Audio Synthesizer
 * Generates soft ethereal ambient tones and subtle tactile clicks without external audio files.
 */
class LuxuryAudioEngine {
  constructor() {
    this.ctx = null
    this.ambientGain = null
    this.osc1 = null
    this.osc2 = null
    this.isPlaying = false
    this.lastClickTime = 0
  }

  init() {
    if (this.ctx) return
    const AudioContext = window.AudioContext || window.webkitAudioContext
    this.ctx = new AudioContext()
  }

  startAmbient() {
    this.init()
    if (this.ctx.state === 'suspended') {
      this.ctx.resume()
    }
    if (this.isPlaying) return

    // Soft resonant master gain
    this.ambientGain = this.ctx.createGain()
    this.ambientGain.gain.setValueAtTime(0.001, this.ctx.currentTime)
    this.ambientGain.gain.exponentialRampToValueAtTime(0.05, this.ctx.currentTime + 3)
    this.ambientGain.connect(this.ctx.destination)

    // Gentle crystal drone 432Hz & 528Hz (Harmonic luxury frequency)
    this.osc1 = this.ctx.createOscillator()
    this.osc1.type = 'sine'
    this.osc1.frequency.setValueAtTime(432, this.ctx.currentTime)

    this.osc2 = this.ctx.createOscillator()
    this.osc2.type = 'sine'
    this.osc2.frequency.setValueAtTime(216, this.ctx.currentTime)

    // Lowpass filter for velvety warmth
    const filter = this.ctx.createBiquadFilter()
    filter.type = 'lowpass'
    filter.frequency.setValueAtTime(650, this.ctx.currentTime)

    this.osc1.connect(filter)
    this.osc2.connect(filter)
    filter.connect(this.ambientGain)

    this.osc1.start()
    this.osc2.start()
    this.isPlaying = true
  }

  stopAmbient() {
    if (!this.isPlaying || !this.ambientGain) return
    const now = this.ctx.currentTime
    this.ambientGain.gain.setValueAtTime(this.ambientGain.gain.value, now)
    this.ambientGain.gain.exponentialRampToValueAtTime(0.0001, now + 1.2)
    setTimeout(() => {
      try {
        if (this.osc1) this.osc1.stop()
        if (this.osc2) this.osc2.stop()
      } catch (e) {}
      this.isPlaying = false
    }, 1300)
  }

  // Micro tactile tick on frame scrub
  playScrubTick(pitch = 880) {
    if (!this.ctx || this.ctx.state === 'suspended' || !this.isPlaying) return
    const now = performance.now()
    if (now - this.lastClickTime < 45) return // Throttle
    this.lastClickTime = now

    const osc = this.ctx.createOscillator()
    const gain = this.ctx.createGain()

    osc.type = 'triangle'
    osc.frequency.setValueAtTime(pitch, this.ctx.currentTime)
    osc.frequency.exponentialRampToValueAtTime(pitch * 0.5, this.ctx.currentTime + 0.03)

    gain.gain.setValueAtTime(0.02, this.ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.03)

    osc.connect(gain)
    gain.connect(this.ctx.destination)

    osc.start()
    osc.stop(this.ctx.currentTime + 0.035)
  }
}

export const luxuryAudio = new LuxuryAudioEngine()
