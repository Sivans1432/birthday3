import confetti from 'canvas-confetti'

export function triggerGrandCelebration() {
  const duration = 4.5 * 1000
  const animationEnd = Date.now() + duration

  const colors = ['#d4af37', '#ffd700', '#ff4d6d', '#ff758f', '#ffffff', '#e63946']

  const frame = () => {
    // Launch confetti from left edge
    confetti({
      particleCount: 5,
      angle: 60,
      spread: 65,
      origin: { x: 0, y: 0.75 },
      colors: colors,
      shapes: ['circle', 'square'],
      scalar: 1.2
    })

    // Launch confetti from right edge
    confetti({
      particleCount: 5,
      angle: 120,
      spread: 65,
      origin: { x: 1, y: 0.75 },
      colors: colors,
      shapes: ['circle', 'square'],
      scalar: 1.2
    })

    // Center star burst
    if (Math.random() < 0.25) {
      confetti({
        particleCount: 15,
        startVelocity: 35,
        spread: 360,
        ticks: 80,
        origin: { x: 0.5, y: 0.35 },
        colors: ['#ffe484', '#d4af37', '#ffffff'],
        shapes: ['star'],
        scalar: 1.4
      })
    }

    if (Date.now() < animationEnd) {
      requestAnimationFrame(frame)
    }
  }

  frame()
}

export function triggerHeartBurst(x: number = 0.5, y: number = 0.5) {
  confetti({
    particleCount: 40,
    spread: 80,
    origin: { x, y },
    colors: ['#ff3366', '#ff758f', '#ffd700', '#ffffff'],
    shapes: ['circle'],
    scalar: 1.3
  })
}

export function triggerGoldenSparks(x: number = 0.5, y: number = 0.5) {
  confetti({
    particleCount: 60,
    spread: 100,
    origin: { x, y },
    colors: ['#ffe082', '#d4af37', '#ffffff', '#ffb300'],
    shapes: ['star', 'circle'],
    scalar: 1.1,
    startVelocity: 25
  })
}
