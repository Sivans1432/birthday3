import React, { useEffect, useRef } from 'react'
import * as THREE from 'three'

export const BackgroundCanvas3D: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    // Scene, Camera, Renderer
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    )
    camera.position.z = 30

    const isMobile = window.innerWidth < 768
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: !isMobile, // Disable expensive antialiasing on mobile GPU for locked 60fps
      powerPreference: 'high-performance'
    })
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.5 : 2))
    container.appendChild(renderer.domElement)

    // Ambient & Directional Lights
    const ambientLight = new THREE.AmbientLight(0xfff1cf, 0.8)
    scene.add(ambientLight)

    const pointLight = new THREE.PointLight(0xd4af37, 2, 80)
    pointLight.position.set(0, 5, 20)
    scene.add(pointLight)

    // 1. Golden Dust / Sparkles Particle System
    const particleCount = isMobile ? 45 : 110
    const particleGeo = new THREE.BufferGeometry()
    const positions = new Float32Array(particleCount * 3)
    const scales = new Float32Array(particleCount)
    const speeds = new Float32Array(particleCount)

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 60
      positions[i * 3 + 1] = (Math.random() - 0.5) * 60
      positions[i * 3 + 2] = (Math.random() - 0.5) * 40
      scales[i] = Math.random() * 0.8 + 0.3
      speeds[i] = Math.random() * 0.015 + 0.005
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    particleGeo.setAttribute('scale', new THREE.BufferAttribute(scales, 1))

    // Create custom circular glowing particle texture
    const canvas = document.createElement('canvas')
    canvas.width = 32
    canvas.height = 32
    const ctx = canvas.getContext('2d')
    if (ctx) {
      const grad = ctx.createRadialGradient(16, 16, 0, 16, 16, 16)
      grad.addColorStop(0, 'rgba(255, 245, 200, 1)')
      grad.addColorStop(0.3, 'rgba(212, 175, 55, 0.8)')
      grad.addColorStop(0.7, 'rgba(180, 120, 20, 0.3)')
      grad.addColorStop(1, 'rgba(0, 0, 0, 0)')
      ctx.fillStyle = grad
      ctx.fillRect(0, 0, 32, 32)
    }
    const particleTexture = new THREE.CanvasTexture(canvas)

    const particleMat = new THREE.PointsMaterial({
      size: 1.5,
      map: particleTexture,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      color: 0xffd97d
    })

    const particles = new THREE.Points(particleGeo, particleMat)
    scene.add(particles)

    // 2. Floating 3D Rose Petals
    const petalCount = isMobile ? 8 : 20
    const petalGroup = new THREE.Group()

    // Curved petal geometry
    const petalShape = new THREE.Shape()
    petalShape.moveTo(0, 0)
    petalShape.bezierCurveTo(0.6, 0.4, 0.8, 1.2, 0, 1.8)
    petalShape.bezierCurveTo(-0.8, 1.2, -0.6, 0.4, 0, 0)

    const petalGeo = new THREE.ShapeGeometry(petalShape)
    const petalMat = new THREE.MeshStandardMaterial({
      color: 0x9b111e, // Deep romantic ruby rose
      roughness: 0.4,
      metalness: 0.1,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.75
    })

    interface PetalInstance {
      mesh: THREE.Mesh
      speedY: number
      speedRotX: number
      speedRotY: number
      swayOffset: number
    }

    const petalInstances: PetalInstance[] = []

    for (let i = 0; i < petalCount; i++) {
      const mesh = new THREE.Mesh(petalGeo, petalMat)
      mesh.scale.setScalar(Math.random() * 0.7 + 0.4)
      mesh.position.set(
        (Math.random() - 0.5) * 45,
        (Math.random() - 0.5) * 45,
        (Math.random() - 0.5) * 20
      )
      mesh.rotation.set(
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI
      )
      petalGroup.add(mesh)
      petalInstances.push({
        mesh,
        speedY: Math.random() * 0.03 + 0.015,
        speedRotX: (Math.random() - 0.5) * 0.02,
        speedRotY: (Math.random() - 0.5) * 0.02,
        swayOffset: Math.random() * Math.PI * 2
      })
    }
    scene.add(petalGroup)

    // 3. Floating Golden Rings with slight rotation
    const ringGeo = new THREE.TorusGeometry(3.5, 0.05, 16, 64)
    const ringMat = new THREE.MeshStandardMaterial({
      color: 0xd4af37,
      metalness: 0.85,
      roughness: 0.2,
      emissive: 0x4a3705,
      transparent: true,
      opacity: 0.35
    })
    const ring1 = new THREE.Mesh(ringGeo, ringMat)
    ring1.position.set(-15, 8, -5)
    scene.add(ring1)

    const ring2 = new THREE.Mesh(new THREE.TorusGeometry(2.5, 0.04, 16, 64), ringMat)
    ring2.position.set(16, -10, -8)
    scene.add(ring2)

    // Mouse movement parallax
    let mouseX = 0
    let mouseY = 0
    let targetX = 0
    let targetY = 0

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 2
      mouseY = (e.clientY / window.innerHeight - 0.5) * 2
    }

    window.addEventListener('mousemove', handleMouseMove, { passive: true })

    // Resize Handler
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
    }

    window.addEventListener('resize', handleResize, { passive: true })

    // Animation Loop
    let animationFrameId: number
    let clock = new THREE.Clock()

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate)

      // Skip rendering if browser tab is hidden to save battery & GPU
      if (document.hidden) return

      const elapsedTime = clock.getElapsedTime()

      // Smooth mouse parallax
      targetX += (mouseX - targetX) * 0.03
      targetY += (mouseY - targetY) * 0.03
      camera.position.x = targetX * 3
      camera.position.y = -targetY * 3
      camera.lookAt(0, 0, 0)

      // Rotate Rings
      ring1.rotation.x = elapsedTime * 0.2
      ring1.rotation.y = elapsedTime * 0.3
      ring2.rotation.x = -elapsedTime * 0.15
      ring2.rotation.y = elapsedTime * 0.25

      // Animate Particles
      const posAttr = particleGeo.attributes.position as THREE.BufferAttribute
      for (let i = 0; i < particleCount; i++) {
        let y = posAttr.getY(i) - speeds[i]
        if (y < -30) y = 30
        posAttr.setY(i, y)
      }
      posAttr.needsUpdate = true
      particles.rotation.y = elapsedTime * 0.02

      // Animate Petals
      petalInstances.forEach((petal) => {
        petal.mesh.position.y -= petal.speedY
        petal.mesh.position.x += Math.sin(elapsedTime + petal.swayOffset) * 0.015
        petal.mesh.rotation.x += petal.speedRotX
        petal.mesh.rotation.y += petal.speedRotY

        if (petal.mesh.position.y < -25) {
          petal.mesh.position.y = 25
          petal.mesh.position.x = (Math.random() - 0.5) * 45
        }
      })

      renderer.render(scene, camera)
    }

    animate()

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('resize', handleResize)
      cancelAnimationFrame(animationFrameId)
      particleGeo.dispose()
      particleMat.dispose()
      particleTexture.dispose()
      petalGeo.dispose()
      petalMat.dispose()
      ringGeo.dispose()
      ringMat.dispose()
      renderer.dispose()
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement)
      }
    }
  }, [])

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden opacity-85"
    />
  )
}
