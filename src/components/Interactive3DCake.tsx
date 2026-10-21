import React, { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, Flame, Wind, RotateCcw, Maximize2, Download, X, Heart } from 'lucide-react'
import { triggerGrandCelebration, triggerGoldenSparks } from '../utils/confettiFireworks'
import { romanticAudio } from '../utils/audioManager'

export const Interactive3DCake: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null)
  const [candlesLit, setCandlesLit] = useState<boolean[]>([true, true, true])
  const [wishMade, setWishMade] = useState<boolean>(false)
  const [showPosterModal, setShowPosterModal] = useState<boolean>(false)
  const sceneRef = useRef<THREE.Scene | null>(null)
  const flamesRef = useRef<(THREE.Mesh | THREE.Group)[]>([])
  const lightsRef = useRef<THREE.PointLight[]>([])
  const smokeParticlesRef = useRef<THREE.Points | null>(null)
  const cakeGroupRef = useRef<THREE.Group | null>(null)

  const allCandlesBlown = candlesLit.every((lit) => !lit)

  // Initialize Three.js 3D Cake Scene
  useEffect(() => {
    const container = mountRef.current
    if (!container) return

    const width = container.clientWidth || 480
    const height = 420

    const scene = new THREE.Scene()
    sceneRef.current = scene

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000)
    camera.position.set(0, 5, 14)
    camera.lookAt(0, 1.5, 0)

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance'
    })
    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
    container.appendChild(renderer.domElement)

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xfff3db, 1.2)
    scene.add(ambientLight)

    const keyLight = new THREE.DirectionalLight(0xffeedd, 1.5)
    keyLight.position.set(8, 15, 10)
    keyLight.castShadow = true
    scene.add(keyLight)

    const fillLight = new THREE.DirectionalLight(0xd4af37, 0.8)
    fillLight.position.set(-8, 5, -5)
    scene.add(fillLight)

    // Cake Group for gentle auto-rotation and interactive drag
    const cakeGroup = new THREE.Group()
    cakeGroupRef.current = cakeGroup
    scene.add(cakeGroup)

    // 1. Golden Plate / Stand
    const plateGeo = new THREE.CylinderGeometry(5.4, 5.7, 0.35, 64)
    const goldMat = new THREE.MeshStandardMaterial({
      color: 0xd4af37,
      metalness: 0.85,
      roughness: 0.25,
      emissive: 0x221a05
    })
    const plate = new THREE.Mesh(plateGeo, goldMat)
    plate.position.y = -0.15
    plate.receiveShadow = true
    cakeGroup.add(plate)

    // Plate rim decor
    const rimGeo = new THREE.TorusGeometry(5.5, 0.1, 16, 64)
    const rim = new THREE.Mesh(rimGeo, goldMat)
    rim.rotation.x = Math.PI / 2
    rim.position.y = 0.05
    cakeGroup.add(rim)

    // 2. Bottom Tier (Dark Luxury Chocolate / Burgundy Red Cream)
    const bottomGeo = new THREE.CylinderGeometry(4.3, 4.3, 2.2, 64)
    const cakeMatBottom = new THREE.MeshStandardMaterial({
      color: 0x1f0f14, // Deep chocolate velvet
      roughness: 0.5,
      metalness: 0.05
    })
    const bottomTier = new THREE.Mesh(bottomGeo, cakeMatBottom)
    bottomTier.position.y = 1.1
    bottomTier.castShadow = true
    bottomTier.receiveShadow = true
    cakeGroup.add(bottomTier)

    // Bottom tier golden pearls around base
    const pearlGeo = new THREE.SphereGeometry(0.18, 16, 16)
    const pearlMat = new THREE.MeshStandardMaterial({
      color: 0xffe89e,
      metalness: 0.9,
      roughness: 0.15
    })
    const pearlCount = 28
    for (let i = 0; i < pearlCount; i++) {
      const angle = (i / pearlCount) * Math.PI * 2
      const pearl = new THREE.Mesh(pearlGeo, pearlMat)
      pearl.position.set(Math.cos(angle) * 4.32, 0.1, Math.sin(angle) * 4.32)
      cakeGroup.add(pearl)
    }

    // Bottom tier top cream border
    const bottomCreamGeo = new THREE.TorusGeometry(4.25, 0.14, 16, 64)
    const goldCreamMat = new THREE.MeshStandardMaterial({
      color: 0xe8c766,
      metalness: 0.7,
      roughness: 0.3
    })
    const bottomBorder = new THREE.Mesh(bottomCreamGeo, goldCreamMat)
    bottomBorder.rotation.x = Math.PI / 2
    bottomBorder.position.y = 2.2
    cakeGroup.add(bottomBorder)

    // 3. Top Tier (Royal Champagne Gold Cream)
    const topGeo = new THREE.CylinderGeometry(2.7, 2.7, 1.8, 64)
    const cakeMatTop = new THREE.MeshStandardMaterial({
      color: 0x2b1419, // Deep burgundy royal velvet
      roughness: 0.45,
      metalness: 0.08
    })
    const topTier = new THREE.Mesh(topGeo, cakeMatTop)
    topTier.position.y = 3.1
    topTier.castShadow = true
    topTier.receiveShadow = true
    cakeGroup.add(topTier)

    // Top tier pearls
    const topPearlCount = 20
    for (let i = 0; i < topPearlCount; i++) {
      const angle = (i / topPearlCount) * Math.PI * 2
      const pearl = new THREE.Mesh(pearlGeo, pearlMat)
      pearl.position.set(Math.cos(angle) * 2.72, 2.2, Math.sin(angle) * 2.72)
      cakeGroup.add(pearl)
    }

    // Top tier icing ribbon
    const topBorder = new THREE.Mesh(new THREE.TorusGeometry(2.68, 0.12, 16, 64), goldCreamMat)
    topBorder.rotation.x = Math.PI / 2
    topBorder.position.y = 4.0
    cakeGroup.add(topBorder)

    // 4. Golden Crown / Heart topper on cake center
    const heartShape = new THREE.Shape()
    heartShape.moveTo(0, 0)
    heartShape.bezierCurveTo(0.3, 0.4, 0.6, 0.8, 0, 1.2)
    heartShape.bezierCurveTo(-0.6, 0.8, -0.3, 0.4, 0, 0)
    const heartGeo = new THREE.ExtrudeGeometry(heartShape, {
      depth: 0.12,
      bevelEnabled: true,
      bevelSegments: 4,
      steps: 1,
      bevelSize: 0.04,
      bevelThickness: 0.04
    })
    const topperMesh = new THREE.Mesh(heartGeo, goldMat)
    topperMesh.scale.set(0.9, 0.9, 0.9)
    topperMesh.position.set(0, 4.1, 0)
    topperMesh.rotation.y = 0
    cakeGroup.add(topperMesh)

    // 5. Candles & Glowing Animated Flames
    const candleGeo = new THREE.CylinderGeometry(0.12, 0.12, 1.3, 24)
    const candleMat = new THREE.MeshStandardMaterial({
      color: 0xfffcf0,
      metalness: 0.1,
      roughness: 0.3
    })

    const candlePositions = [
      { x: -1.3, z: 0.3 },
      { x: 1.3, z: 0.3 },
      { x: 0, z: -1.2 }
    ]

    flamesRef.current = []
    lightsRef.current = []

    // Custom teardrop flame shape
    const flameShape = new THREE.Shape()
    flameShape.moveTo(0, 0)
    flameShape.quadraticCurveTo(0.18, 0.3, 0, 0.7)
    flameShape.quadraticCurveTo(-0.18, 0.3, 0, 0)

    const flameGeo = new THREE.ShapeGeometry(flameShape)
    const flameMat = new THREE.MeshBasicMaterial({
      color: 0xffd000,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.95,
      blending: THREE.AdditiveBlending
    })

    candlePositions.forEach((pos, idx) => {
      // Candle Body
      const candle = new THREE.Mesh(candleGeo, candleMat)
      candle.position.set(pos.x, 4.65, pos.z)
      candle.castShadow = true
      candle.userData = { candleIndex: idx }
      cakeGroup.add(candle)

      // Candle Wick
      const wickGeo = new THREE.CylinderGeometry(0.02, 0.02, 0.2, 12)
      const wickMat = new THREE.MeshBasicMaterial({ color: 0x333333 })
      const wick = new THREE.Mesh(wickGeo, wickMat)
      wick.position.set(pos.x, 5.35, pos.z)
      cakeGroup.add(wick)

      // Flame Group (dual layered for realistic glow)
      const flameGroup = new THREE.Group()
      flameGroup.position.set(pos.x, 5.4, pos.z)

      const flameOuter = new THREE.Mesh(flameGeo, flameMat)
      flameGroup.add(flameOuter)

      // Inner hotter core
      const innerFlameMat = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.9
      })
      const flameInner = new THREE.Mesh(flameGeo, innerFlameMat)
      flameInner.scale.set(0.5, 0.6, 0.5)
      flameGroup.add(flameInner)

      cakeGroup.add(flameGroup)
      flamesRef.current.push(flameGroup)

      // Point Light for realistic flickering illumination
      const flameLight = new THREE.PointLight(0xffa200, 1.8, 8)
      flameLight.position.set(pos.x, 5.6, pos.z)
      cakeGroup.add(flameLight)
      lightsRef.current.push(flameLight)
    })

    // Smoke particles for extinguished candle
    const smokeGeo = new THREE.BufferGeometry()
    const smokeCount = 30
    const smokePos = new Float32Array(smokeCount * 3)
    smokeGeo.setAttribute('position', new THREE.BufferAttribute(smokePos, 3))
    const smokeMat = new THREE.PointsMaterial({
      color: 0xaaaaaa,
      size: 0.4,
      transparent: true,
      opacity: 0
    })
    const smokeMesh = new THREE.Points(smokeGeo, smokeMat)
    scene.add(smokeMesh)
    smokeParticlesRef.current = smokeMesh

    // Raycasting for interactive clicking on candles/flames directly
    const raycaster = new THREE.Raycaster()
    const mouse = new THREE.Vector2()

    const handleCanvasClick = (event: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect()
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1

      raycaster.setFromCamera(mouse, camera)
      const intersects = raycaster.intersectObjects(cakeGroup.children, true)

      if (intersects.length > 0) {
        // Find if candle or flame was hit
        for (const hit of intersects) {
          let curr: THREE.Object3D | null = hit.object
          while (curr && curr !== cakeGroup) {
            if (curr.userData && curr.userData.candleIndex !== undefined) {
              const cIdx = curr.userData.candleIndex
              extinguishSingleCandle(cIdx)
              return
            }
            curr = curr.parent
          }
        }
      }
    }

    renderer.domElement.addEventListener('click', handleCanvasClick)

    // Gentle drag rotation
    let isDragging = false
    let prevMouseX = 0

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true
      prevMouseX = e.clientX
    }

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging || !cakeGroupRef.current) return
      const deltaX = e.clientX - prevMouseX
      cakeGroupRef.current.rotation.y += deltaX * 0.008
      prevMouseX = e.clientX
    }

    const onMouseUp = () => {
      isDragging = false
    }

    const dom = renderer.domElement
    dom.addEventListener('mousedown', onMouseDown)
    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', onMouseUp)

    // Touch support for mobile phones & tablets
    let prevTouchX = 0
    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        isDragging = true
        prevTouchX = e.touches[0].clientX
      }
    }
    const onTouchMove = (e: TouchEvent) => {
      if (!isDragging || !cakeGroupRef.current || e.touches.length !== 1) return
      const deltaX = e.touches[0].clientX - prevTouchX
      cakeGroupRef.current.rotation.y += deltaX * 0.008
      prevTouchX = e.touches[0].clientX
    }
    const onTouchEnd = () => {
      isDragging = false
    }

    dom.addEventListener('touchstart', onTouchStart, { passive: true })
    window.addEventListener('touchmove', onTouchMove, { passive: true })
    window.addEventListener('touchend', onTouchEnd)

    // Resize handler
    const handleResize = () => {
      if (!mountRef.current) return
      const newWidth = mountRef.current.clientWidth || 480
      camera.aspect = newWidth / height
      camera.updateProjectionMatrix()
      renderer.setSize(newWidth, height)
    }

    window.addEventListener('resize', handleResize)

    // Render loop
    let animId: number
    let clock = new THREE.Clock()

    const animate = () => {
      animId = requestAnimationFrame(animate)
      const time = clock.getElapsedTime()

      // Auto rotation when not dragging
      if (!isDragging && cakeGroupRef.current) {
        cakeGroupRef.current.rotation.y += 0.004
      }

      // Animate candle flames (flicker scale and rotation)
      flamesRef.current.forEach((flame, idx) => {
        if (flame.visible) {
          const noise = Math.sin(time * 12 + idx * 3) * 0.12
          const flicker = Math.cos(time * 16 + idx * 2) * 0.08
          flame.scale.set(1 + noise, 1 + flicker, 1 + noise)
          flame.rotation.z = Math.sin(time * 8 + idx) * 0.1

          // Always face camera
          flame.rotation.y = -cakeGroup.rotation.y

          // Point light intensity flickering
          if (lightsRef.current[idx]) {
            lightsRef.current[idx].intensity = 1.6 + Math.sin(time * 20 + idx) * 0.4
          }
        }
      })

      renderer.render(scene, camera)
    }

    animate()

    return () => {
      window.removeEventListener('resize', handleResize)
      dom.removeEventListener('click', handleCanvasClick)
      dom.removeEventListener('mousedown', onMouseDown)
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseup', onMouseUp)
      dom.removeEventListener('touchstart', onTouchStart)
      window.removeEventListener('touchmove', onTouchMove)
      window.removeEventListener('touchend', onTouchEnd)
      cancelAnimationFrame(animId)
      renderer.dispose()
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement)
      }
    }
  }, [])

  // Sync candle flame visibility with state
  useEffect(() => {
    candlesLit.forEach((isLit, idx) => {
      if (flamesRef.current[idx]) {
        flamesRef.current[idx].visible = isLit
      }
      if (lightsRef.current[idx]) {
        lightsRef.current[idx].visible = isLit
      }
    })
  }, [candlesLit])

  const extinguishSingleCandle = (idx: number) => {
    setCandlesLit((prev) => {
      const next = [...prev]
      next[idx] = false
      if (next.every((lit) => !lit)) {
        setWishMade(true)
        romanticAudio.playWishChime()
        triggerGoldenSparks(0.5, 0.45)
        setTimeout(() => {
          triggerGrandCelebration()
        }, 250)
      }
      return next
    })
    triggerGoldenSparks(0.5, 0.4)
  }

  const handleMakeWish = () => {
    // Extinguish all candles
    setCandlesLit([false, false, false])
    setWishMade(true)

    // Play chime sound
    romanticAudio.playWishChime()

    // Trigger grand fireworks and confetti explosion
    triggerGoldenSparks(0.5, 0.45)
    setTimeout(() => {
      triggerGrandCelebration()
    }, 250)
  }

  const handleRelight = () => {
    setCandlesLit([true, true, true])
    setWishMade(false)
    triggerGoldenSparks(0.5, 0.4)
  }

  return (
    <section id="cake" className="relative py-24 px-4 overflow-hidden">
      {/* Background radial highlight */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-amber-500/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-4xl mx-auto flex flex-col items-center text-center">
        {/* Section Header */}
        <div className="space-y-3 mb-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-amber-500/30 bg-amber-950/20 backdrop-blur-md">
            <Sparkles size={14} className="text-amber-400" />
            <span className="font-cinzel text-xs uppercase tracking-[0.25em] text-amber-200">
              Interactive 3D Celebration
            </span>
          </div>

          <h2 className="text-3xl sm:text-5xl md:text-6xl font-cinzel font-bold text-gold-bright tracking-tight">
            Make a Wish, Ammuuu! ❤️
          </h2>

          <p className="max-w-xl mx-auto text-amber-100/75 text-sm sm:text-base font-serif italic">
            Close your eyes, make the deepest wish in your heart, and blow out the candles.
            (Drag to rotate the cake in 3D or tap individual candles!)
          </p>
        </div>

        {/* 3D Cake Canvas Container */}
        <div className="relative w-full max-w-[560px] h-[430px] rounded-3xl border border-amber-500/30 bg-gradient-to-b from-[#17130f]/80 via-[#0d0a08]/90 to-[#070605] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.9),0_0_40px_rgba(212,175,55,0.15)] backdrop-blur-xl flex items-center justify-center overflow-hidden group">
          {/* Subtle 3D rotate prompt badge */}
          <div className="absolute top-4 left-4 z-10 px-3 py-1 rounded-full bg-black/60 border border-amber-400/20 text-[11px] font-cinzel text-amber-300/80 flex items-center gap-1.5 pointer-events-none">
            <span>✦ Drag to rotate cake</span>
          </div>

          {/* Candle Status Badges */}
          <div className="absolute top-4 right-4 z-10 flex items-center gap-1.5">
            {candlesLit.map((lit, i) => (
              <button
                key={i}
                onClick={() => extinguishSingleCandle(i)}
                title={lit ? `Tap to blow candle ${i + 1}` : `Candle ${i + 1} extinguished`}
                className={`p-1.5 rounded-full border transition-all cursor-pointer ${
                  lit
                    ? 'border-amber-400/60 bg-amber-500/20 text-amber-300 shadow-[0_0_10px_rgba(245,158,11,0.5)]'
                    : 'border-white/10 bg-black/40 text-white/30'
                }`}
              >
                <Flame size={14} className={lit ? 'animate-pulse text-amber-400' : 'text-zinc-600'} />
              </button>
            ))}
          </div>

          {/* Three.js Mount Node */}
          <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />
        </div>

        {/* Interaction Controls */}
        <div className="mt-8 flex flex-col sm:flex-row items-center gap-4">
          {!allCandlesBlown ? (
            <button
              onClick={handleMakeWish}
              className="px-8 py-3.5 rounded-full bg-gold-btn text-amber-950 font-cinzel font-bold text-base tracking-wider uppercase shadow-[0_0_30px_rgba(212,175,55,0.4)] hover:shadow-[0_0_45px_rgba(212,175,55,0.6)] flex items-center gap-2.5 transition-all transform hover:scale-105 cursor-pointer"
            >
              <Wind size={18} />
              <span>Blow Out Candles & Make a Wish</span>
            </button>
          ) : (
            <button
              onClick={handleRelight}
              className="px-6 py-3 rounded-full bg-amber-950/60 border border-amber-400/40 text-amber-200 font-cinzel font-semibold text-sm tracking-wider uppercase hover:bg-amber-900/60 flex items-center gap-2 transition-all cursor-pointer"
            >
              <RotateCcw size={16} />
              <span>Relight Candles 🕯️</span>
            </button>
          )}
        </div>

        {/* Wish & Grand Birthday Poster Reveal */}
        <AnimatePresence>
          {wishMade && (
            <div className="w-full flex flex-col items-center">
              {/* Wish Revealed Card */}
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.8 }}
                className="mt-8 max-w-lg w-full p-6 rounded-2xl gold-card border-amber-400/50 shadow-[0_0_35px_rgba(212,175,55,0.25)] relative"
              >
                <div className="flex items-center justify-center gap-2 text-rose-400 mb-2">
                  <Sparkles size={18} />
                  <span className="font-cinzel text-xs uppercase tracking-widest text-amber-300">
                    Wish Whispered To The Stars
                  </span>
                  <Sparkles size={18} />
                </div>

                <p className="font-serif text-lg md:text-xl text-white font-medium mb-3">
                  “May every single prayer, dream, and unspoken wish in your beautiful heart come true, Ammuuu! 💖✨”
                </p>

                <p className="text-xs text-amber-200/80 font-telugu leading-relaxed">
                  Nee life lo nuvvu anukunna dreams anni nijam avvaali. Nee face lo smile eppudu alage undaali! 🙏🏻💗
                </p>
              </motion.div>

              {/* Grand Birthday Surprise Poster Reveal */}
              <motion.div
                initial={{ opacity: 0, y: 30, scale: 0.92 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.92 }}
                transition={{ duration: 0.9, delay: 0.3 }}
                className="mt-8 w-full max-w-xl p-5 sm:p-7 rounded-3xl gold-card border-2 border-amber-400/60 shadow-[0_0_60px_rgba(212,175,55,0.4)] relative overflow-hidden flex flex-col items-center"
              >
                {/* Glow behind frame */}
                <div className="absolute inset-0 bg-gradient-to-tr from-amber-500/10 via-rose-500/10 to-amber-500/10 animate-shimmer pointer-events-none" />

                {/* Badge Header */}
                <div className="relative z-10 flex items-center gap-2 mb-4 px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-500/20 via-rose-500/20 to-amber-500/20 border border-amber-400/40">
                  <Heart size={14} className="text-rose-500 fill-rose-500 animate-pulse" />
                  <span className="font-cinzel text-xs uppercase tracking-[0.2em] text-amber-200 font-bold">
                    A Special Surprise Keepsake For Ammuuu
                  </span>
                  <Sparkles size={14} className="text-amber-400" />
                </div>

                {/* Poster Frame */}
                <div
                  onClick={() => setShowPosterModal(true)}
                  className="group/poster relative w-full max-w-md aspect-[2/3] rounded-2xl overflow-hidden border-2 border-amber-400/50 shadow-2xl cursor-pointer bg-black/90 transition-transform duration-500 hover:scale-[1.02]"
                >
                  <img
                    src="/assets/birthday-poster.jpg"
                    alt="Happy Birthday Ammuu Grand Poster"
                    className="w-full h-full object-cover group-hover/poster:scale-105 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent opacity-0 group-hover/poster:opacity-100 transition-opacity duration-300 flex items-end justify-between p-4">
                    <span className="text-xs font-cinzel text-amber-200 tracking-wider">
                      Tap to view in full resolution
                    </span>
                    <div className="p-2 rounded-full bg-amber-500/40 border border-amber-400/60 text-amber-200">
                      <Maximize2 size={18} />
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="relative z-10 mt-5 flex flex-wrap items-center justify-center gap-3 w-full">
                  <button
                    onClick={() => setShowPosterModal(true)}
                    className="px-6 py-2.5 rounded-full bg-gold-btn text-amber-950 font-cinzel font-bold text-xs uppercase tracking-wider shadow-lg flex items-center gap-2 cursor-pointer hover:scale-105 transition-transform"
                  >
                    <Maximize2 size={14} />
                    <span>View Fullscreen Poster</span>
                  </button>
                  <a
                    href="/assets/birthday-poster.jpg"
                    download="Happy-Birthday-Ammuuu.jpg"
                    className="px-5 py-2.5 rounded-full bg-amber-950/70 border border-amber-400/40 text-amber-200 font-cinzel font-semibold text-xs uppercase tracking-wider hover:bg-amber-900/60 flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Download size={14} />
                    <span>Save Poster</span>
                  </a>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Fullscreen Poster Lightbox Modal */}
        <AnimatePresence>
          {showPosterModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-2xl p-4 sm:p-6"
              onClick={() => setShowPosterModal(false)}
            >
              <button
                onClick={() => setShowPosterModal(false)}
                className="absolute top-6 right-6 z-50 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-all cursor-pointer"
                title="Close"
              >
                <X size={24} />
              </button>

              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="relative max-w-xl max-h-[92vh] flex flex-col items-center bg-[#0d0a08] border border-amber-500/50 rounded-3xl overflow-hidden shadow-[0_0_80px_rgba(212,175,55,0.4)]"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="relative max-h-[78vh] overflow-hidden flex items-center justify-center p-2 sm:p-3">
                  <img
                    src="/assets/birthday-poster.jpg"
                    alt="Happy Birthday Ammuu Full Poster"
                    className="max-h-[75vh] w-auto object-contain rounded-xl select-none shadow-2xl"
                  />
                </div>
                <div className="w-full p-4 sm:p-5 bg-gradient-to-b from-[#140f0c] to-[#0a0806] border-t border-amber-500/30 flex items-center justify-between gap-3">
                  <div className="text-left">
                    <p className="font-cinzel text-sm sm:text-base font-bold text-white">Happy Birthday, Ammuuu ❤️</p>
                    <p className="text-xs text-amber-200/70 font-serif italic">My Ammuu • My Happiness • 27 October</p>
                  </div>
                  <a
                    href="/assets/birthday-poster.jpg"
                    download="Happy-Birthday-Ammuuu.jpg"
                    className="px-4 py-2 rounded-full bg-gold-btn text-amber-950 font-cinzel font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 cursor-pointer shadow-md hover:scale-105 transition-transform"
                  >
                    <Download size={14} />
                    <span>Download</span>
                  </a>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}
