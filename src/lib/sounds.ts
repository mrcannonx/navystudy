// Sound effects for the quiz application
const audioContext = typeof window !== 'undefined' ? new (window.AudioContext || (window as any).webkitAudioContext)() : null

function createOscillator(frequency: number, type: OscillatorType, duration: number) {
  if (!audioContext) return

  const oscillator = audioContext.createOscillator()
  const gainNode = audioContext.createGain()

  oscillator.type = type
  oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime)
  
  gainNode.gain.setValueAtTime(0.1, audioContext.currentTime)
  gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration)

  oscillator.connect(gainNode)
  gainNode.connect(audioContext.destination)

  return { oscillator, gainNode }
}

export const sounds = {
  correct: () => {
    if (!audioContext) return
    
    const { oscillator, gainNode } = createOscillator(880, 'sine', 0.1)!
    
    oscillator.start()
    oscillator.stop(audioContext.currentTime + 0.1)
  },

  incorrect: () => {
    if (!audioContext) return
    
    const { oscillator, gainNode } = createOscillator(220, 'square', 0.2)!
    
    oscillator.start()
    oscillator.stop(audioContext.currentTime + 0.2)
  },

  click: () => {
    if (!audioContext) return
    
    const { oscillator, gainNode } = createOscillator(440, 'sine', 0.05)!
    
    oscillator.start()
    oscillator.stop(audioContext.currentTime + 0.05)
  },

  warning: () => {
    if (!audioContext) return
    
    // Play two quick beeps
    const { oscillator: osc1, gainNode: gain1 } = createOscillator(660, 'square', 0.1)!
    const { oscillator: osc2, gainNode: gain2 } = createOscillator(660, 'square', 0.1)!
    
    osc1.start()
    osc1.stop(audioContext.currentTime + 0.1)
    
    setTimeout(() => {
      osc2.start()
      osc2.stop(audioContext.currentTime + 0.1)
    }, 200)
  },

  timeUp: () => {
    if (!audioContext) return
    
    // Play three descending tones
    const { oscillator: osc1, gainNode: gain1 } = createOscillator(880, 'square', 0.15)!
    const { oscillator: osc2, gainNode: gain2 } = createOscillator(660, 'square', 0.15)!
    const { oscillator: osc3, gainNode: gain3 } = createOscillator(440, 'square', 0.15)!
    
    osc1.start()
    osc1.stop(audioContext.currentTime + 0.15)
    
    setTimeout(() => {
      osc2.start()
      osc2.stop(audioContext.currentTime + 0.15)
    }, 150)
    
    setTimeout(() => {
      osc3.start()
      osc3.stop(audioContext.currentTime + 0.15)
    }, 300)
  }
} 