import React, { useEffect, useRef } from 'react'
import * as THREE from 'three'

interface DigitalAwakeningCanvasProps {
  progress: number // 0.0 to 1.0 (representing 0.0s to 6.0s)
  isReducedMotion?: boolean
}

export const DigitalAwakeningCanvas: React.FC<DigitalAwakeningCanvasProps> = ({
  progress,
  isReducedMotion = false,
}) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<{
    renderer: THREE.WebGLRenderer
    scene: THREE.Scene
    camera: THREE.PerspectiveCamera
    particles: THREE.Points
    particlePositions: Float32Array
    startPositions: Float32Array
    corePositions: Float32Array
    shockPositions: Float32Array
    emblemPositions: Float32Array
    energyCoreGroup: THREE.Group
    coreMesh: THREE.Mesh
    innerCoreMesh: THREE.Mesh
    orbitalRing1: THREE.Mesh
    orbitalRing2: THREE.Mesh
    orbitalRing3: THREE.Mesh
    filaments: THREE.LineSegments
    shockwaveRing1: THREE.Mesh
    shockwaveRing2: THREE.Mesh
    shieldGroup: THREE.Group
    shieldMesh: THREE.Mesh
    shieldWireframe: THREE.LineSegments
    shieldCircuitLines: THREE.LineSegments
    ambientGlowMesh: THREE.Mesh
    reqId: number
  } | null>(null)

  // Initialize Three.js 3D Scene
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const width = container.clientWidth || window.innerWidth
    const height = container.clientHeight || window.innerHeight

    // 1. Scene & Camera Setup
    const scene = new THREE.Scene()
    scene.fog = new THREE.FogExp2(0x020b16, 0.008)

    const camera = new THREE.PerspectiveCamera(48, width / height, 0.1, 1000)
    camera.position.set(0, 0, 160)

    // 2. High-Performance WebGL Renderer
    let renderer: THREE.WebGLRenderer
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance',
      })
    } catch {
      return // WebGL not supported
    }

    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setClearColor(0x020b16, 1)
    container.appendChild(renderer.domElement)

    // ========================================================
    // 3. 3D PARTICLE SYSTEM (500 Dual-Color Cyan & Electric Blue Points)
    // ========================================================
    const particleCount = 500
    const particlePositions = new Float32Array(particleCount * 3)
    const particleColors = new Float32Array(particleCount * 3)
    const startPositions = new Float32Array(particleCount * 3)
    const corePositions = new Float32Array(particleCount * 3)
    const shockPositions = new Float32Array(particleCount * 3)
    const emblemPositions = new Float32Array(particleCount * 3)

    const colorCyan = new THREE.Color(0x00d9ff)
    const colorBlue = new THREE.Color(0x008cff)
    const colorWhite = new THREE.Color(0xf8fafc)

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3

      // Colors: 60% cyan, 30% electric blue, 10% ice-white
      const colorChoice = Math.random()
      const pColor = colorChoice < 0.6 ? colorCyan : colorChoice < 0.9 ? colorBlue : colorWhite
      particleColors[i3] = pColor.r
      particleColors[i3 + 1] = pColor.g
      particleColors[i3 + 2] = pColor.b

      // Shot 1: Distant Void positions (spread wide across depth z: -60 to 220)
      const voidRadius = 80 + Math.random() * 120
      const voidTheta = Math.random() * Math.PI * 2
      const voidZ = 200 - Math.random() * 320
      startPositions[i3] = Math.cos(voidTheta) * voidRadius
      startPositions[i3 + 1] = Math.sin(voidTheta) * voidRadius
      startPositions[i3 + 2] = voidZ

      // Shot 2: Spherical Energy Core positions (radius 10 to 18)
      const u = Math.random()
      const v = Math.random()
      const theta = u * 2.0 * Math.PI
      const phi = Math.acos(2.0 * v - 1.0)
      const rCore = 10 + Math.random() * 8
      const sinPhi = Math.sin(phi)
      corePositions[i3] = rCore * sinPhi * Math.cos(theta)
      corePositions[i3 + 1] = rCore * sinPhi * Math.sin(theta)
      corePositions[i3 + 2] = rCore * Math.cos(phi)

      // Shot 3: Outward Shockwave positions (scattered out to radius 90 to 160)
      const rShock = 90 + Math.random() * 80
      shockPositions[i3] = rShock * sinPhi * Math.cos(theta) * 1.3
      shockPositions[i3 + 1] = rShock * sinPhi * Math.sin(theta) * 0.9
      shockPositions[i3 + 2] = rShock * Math.cos(phi) * 1.2

      // Shot 4: Symmetrical Abstract Energy Emblem positions
      // Formed as a multi-tier diamond/hexagon energy matrix
      const angle = (i / particleCount) * Math.PI * 4
      const tier = i % 4
      const radius = 18 + tier * 6
      const symmX = Math.cos(angle) * radius * (1 + 0.3 * Math.cos(angle * 3))
      const symmY = Math.sin(angle) * radius * (1.2 + 0.2 * Math.sin(angle * 2))
      const symmZ = (Math.random() - 0.5) * 8
      emblemPositions[i3] = symmX
      emblemPositions[i3 + 1] = symmY
      emblemPositions[i3 + 2] = symmZ

      // Initial buffer position
      particlePositions[i3] = startPositions[i3]
      particlePositions[i3 + 1] = startPositions[i3 + 1]
      particlePositions[i3 + 2] = startPositions[i3 + 2]
    }

    const particleGeometry = new THREE.BufferGeometry()
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3))
    particleGeometry.setAttribute('color', new THREE.BufferAttribute(particleColors, 3))

    // Glowing Round Particle Shader / Texture
    const particleCanvas = document.createElement('canvas')
    particleCanvas.width = 32
    particleCanvas.height = 32
    const ctx = particleCanvas.getContext('2d')
    if (ctx) {
      const gradient = ctx.createRadialGradient(16, 16, 0, 16, 16, 16)
      gradient.addColorStop(0, 'rgba(255,255,255,1)')
      gradient.addColorStop(0.3, 'rgba(0,217,255,0.9)')
      gradient.addColorStop(0.7, 'rgba(0,140,255,0.4)')
      gradient.addColorStop(1, 'rgba(0,0,0,0)')
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, 32, 32)
    }
    const particleTexture = new THREE.CanvasTexture(particleCanvas)

    const particleMaterial = new THREE.PointsMaterial({
      size: 3.2,
      vertexColors: true,
      map: particleTexture,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    })

    const particles = new THREE.Points(particleGeometry, particleMaterial)
    scene.add(particles)

    // ========================================================
    // 4. FLOATING 3D ENERGY CORE
    // ========================================================
    const energyCoreGroup = new THREE.Group()
    scene.add(energyCoreGroup)

    // A. Luminous Central Icosahedron Core
    const coreGeo = new THREE.IcosahedronGeometry(9.5, 2)
    const coreMat = new THREE.MeshBasicMaterial({
      color: 0x00d9ff,
      wireframe: true,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
    })
    const coreMesh = new THREE.Mesh(coreGeo, coreMat)
    energyCoreGroup.add(coreMesh)

    // B. Intense Inner Specular Sphere
    const innerGeo = new THREE.SphereGeometry(5.5, 24, 24)
    const innerMat = new THREE.MeshBasicMaterial({
      color: 0xf8fafc,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
    })
    const innerCoreMesh = new THREE.Mesh(innerGeo, innerMat)
    energyCoreGroup.add(innerCoreMesh)

    // C. Electric Filaments across Core
    const filamentPoints: THREE.Vector3[] = []
    for (let f = 0; f < 36; f++) {
      const theta1 = Math.random() * Math.PI * 2
      const phi1 = Math.acos(2 * Math.random() - 1)
      const r = 10.5
      const v1 = new THREE.Vector3(
        r * Math.sin(phi1) * Math.cos(theta1),
        r * Math.sin(phi1) * Math.sin(theta1),
        r * Math.cos(phi1)
      )
      const theta2 = theta1 + (Math.random() - 0.5) * 1.2
      const phi2 = phi1 + (Math.random() - 0.5) * 1.2
      const v2 = new THREE.Vector3(
        r * Math.sin(phi2) * Math.cos(theta2),
        r * Math.sin(phi2) * Math.sin(theta2),
        r * Math.cos(phi2)
      )
      filamentPoints.push(v1, v2)
    }
    const filamentGeo = new THREE.BufferGeometry().setFromPoints(filamentPoints)
    const filamentMat = new THREE.LineBasicMaterial({
      color: 0x00d9ff,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
    })
    const filaments = new THREE.LineSegments(filamentGeo, filamentMat)
    energyCoreGroup.add(filaments)

    // D. Three Transparent 3D Orbital Rings Rotating at Independent Angles
    const createRing = (radius: number, tube: number, colorHex: number) => {
      const torusGeo = new THREE.TorusGeometry(radius, tube, 8, 80)
      const torusMat = new THREE.MeshBasicMaterial({
        color: colorHex,
        transparent: true,
        opacity: 0,
        blending: THREE.AdditiveBlending,
      })
      return new THREE.Mesh(torusGeo, torusMat)
    }

    const orbitalRing1 = createRing(14.5, 0.35, 0x00d9ff)
    orbitalRing1.rotation.x = Math.PI * 0.25
    orbitalRing1.rotation.y = Math.PI * 0.15
    energyCoreGroup.add(orbitalRing1)

    const orbitalRing2 = createRing(18.5, 0.28, 0x008cff)
    orbitalRing2.rotation.x = -Math.PI * 0.35
    orbitalRing2.rotation.z = Math.PI * 0.2
    energyCoreGroup.add(orbitalRing2)

    const orbitalRing3 = createRing(22.5, 0.22, 0x00d9ff)
    orbitalRing3.rotation.y = Math.PI * 0.45
    orbitalRing3.rotation.z = -Math.PI * 0.25
    energyCoreGroup.add(orbitalRing3)

    // E. 3D Expanding Shockwave Rings (Shot 3)
    const shockwaveGeo1 = new THREE.RingGeometry(1, 2.5, 64)
    const shockwaveMat1 = new THREE.MeshBasicMaterial({
      color: 0x00d9ff,
      transparent: true,
      opacity: 0,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending,
    })
    const shockwaveRing1 = new THREE.Mesh(shockwaveGeo1, shockwaveMat1)
    shockwaveRing1.rotation.x = Math.PI * 0.5
    scene.add(shockwaveRing1)

    const shockwaveGeo2 = new THREE.RingGeometry(1, 2, 64)
    const shockwaveMat2 = new THREE.MeshBasicMaterial({
      color: 0xf8fafc,
      transparent: true,
      opacity: 0,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending,
    })
    const shockwaveRing2 = new THREE.Mesh(shockwaveGeo2, shockwaveMat2)
    shockwaveRing2.rotation.x = Math.PI * 0.35
    scene.add(shockwaveRing2)

    // ========================================================
    // 5. 3D HOLOGRAPHIC CYBERSECURITY SHIELD (Shots 4 & 5)
    // ========================================================
    const shieldGroup = new THREE.Group()
    shieldGroup.position.set(0, 0, -8) // Positioned directly behind the central brand composition
    scene.add(shieldGroup)

    // Authentic Symmetrical Cybersecurity Shield Contour
    const shieldShape = new THREE.Shape()
    shieldShape.moveTo(0, 26)
    shieldShape.quadraticCurveTo(20, 23, 27, 18)
    shieldShape.quadraticCurveTo(24, -6, 14, -20)
    shieldShape.quadraticCurveTo(0, -32, 0, -32)
    shieldShape.quadraticCurveTo(0, -32, -14, -20)
    shieldShape.quadraticCurveTo(-24, -6, -27, 18)
    shieldShape.quadraticCurveTo(-20, 23, 0, 26)

    const shieldShapeGeo = new THREE.ShapeGeometry(shieldShape)
    const shieldShapeMat = new THREE.MeshBasicMaterial({
      color: 0x061426,
      transparent: true,
      opacity: 0,
      blending: THREE.NormalBlending,
      side: THREE.DoubleSide,
    })
    const shieldMesh = new THREE.Mesh(shieldShapeGeo, shieldShapeMat)
    shieldGroup.add(shieldMesh)

    // Luminous Neon Cyan Shield Edges
    const shieldEdgesGeo = new THREE.EdgesGeometry(shieldShapeGeo)
    const shieldEdgesMat = new THREE.LineBasicMaterial({
      color: 0x00d9ff,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
      linewidth: 2,
    })
    const shieldWireframe = new THREE.LineSegments(shieldEdgesGeo, shieldEdgesMat)
    shieldGroup.add(shieldWireframe)

    // Futuristic Circuit Board Traces on Shield Surface
    const circuitPoints: THREE.Vector3[] = [
      // Top horizontal bus & vertical connectors
      new THREE.Vector3(-18, 16, 0.2), new THREE.Vector3(-8, 16, 0.2),
      new THREE.Vector3(-8, 16, 0.2), new THREE.Vector3(-8, 8, 0.2),
      new THREE.Vector3(-8, 8, 0.2), new THREE.Vector3(-14, 2, 0.2),
      new THREE.Vector3(18, 16, 0.2), new THREE.Vector3(8, 16, 0.2),
      new THREE.Vector3(8, 16, 0.2), new THREE.Vector3(8, 8, 0.2),
      new THREE.Vector3(8, 8, 0.2), new THREE.Vector3(14, 2, 0.2),
      // Lower shield diagonal circuit tracks
      new THREE.Vector3(-12, -4, 0.2), new THREE.Vector3(-6, -12, 0.2),
      new THREE.Vector3(-6, -12, 0.2), new THREE.Vector3(0, -22, 0.2),
      new THREE.Vector3(12, -4, 0.2), new THREE.Vector3(6, -12, 0.2),
      new THREE.Vector3(6, -12, 0.2), new THREE.Vector3(0, -22, 0.2),
      // Central vertical spine
      new THREE.Vector3(0, 22, 0.2), new THREE.Vector3(0, -26, 0.2),
    ]
    const circuitGeo = new THREE.BufferGeometry().setFromPoints(circuitPoints)
    const circuitMat = new THREE.LineBasicMaterial({
      color: 0x00d9ff,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
    })
    const shieldCircuitLines = new THREE.LineSegments(circuitGeo, circuitMat)
    shieldGroup.add(shieldCircuitLines)

    // Ambient Volumetric Halo Plane
    const haloGeo = new THREE.PlaneGeometry(72, 72)
    const haloCanvas = document.createElement('canvas')
    haloCanvas.width = 128
    haloCanvas.height = 128
    const hCtx = haloCanvas.getContext('2d')
    if (hCtx) {
      const hGrad = hCtx.createRadialGradient(64, 64, 0, 64, 64, 64)
      hGrad.addColorStop(0, 'rgba(0,217,255,0.35)')
      hGrad.addColorStop(0.5, 'rgba(0,140,255,0.15)')
      hGrad.addColorStop(1, 'rgba(2,11,22,0)')
      hCtx.fillStyle = hGrad
      hCtx.fillRect(0, 0, 128, 128)
    }
    const haloTexture = new THREE.CanvasTexture(haloCanvas)
    const haloMat = new THREE.MeshBasicMaterial({
      map: haloTexture,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
    })
    const ambientGlowMesh = new THREE.Mesh(haloGeo, haloMat)
    ambientGlowMesh.position.z = -12
    scene.add(ambientGlowMesh)

    // Store references for render updates
    sceneRef.current = {
      renderer,
      scene,
      camera,
      particles,
      particlePositions,
      startPositions,
      corePositions,
      shockPositions,
      emblemPositions,
      energyCoreGroup,
      coreMesh,
      innerCoreMesh,
      orbitalRing1,
      orbitalRing2,
      orbitalRing3,
      filaments,
      shockwaveRing1,
      shockwaveRing2,
      shieldGroup,
      shieldMesh,
      shieldWireframe,
      shieldCircuitLines,
      ambientGlowMesh,
      reqId: 0,
    }

    // Window resize listener
    const handleResize = () => {
      if (!container || !sceneRef.current) return
      const w = container.clientWidth || window.innerWidth
      const h = container.clientHeight || window.innerHeight
      sceneRef.current.camera.aspect = w / h
      sceneRef.current.camera.updateProjectionMatrix()
      sceneRef.current.renderer.setSize(w, h)
    }
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      if (sceneRef.current) {
        cancelAnimationFrame(sceneRef.current.reqId)
        renderer.dispose()
        particleGeometry.dispose()
        particleMaterial.dispose()
        coreGeo.dispose()
        coreMat.dispose()
        innerGeo.dispose()
        innerMat.dispose()
        filamentGeo.dispose()
        filamentMat.dispose()
        shockwaveGeo1.dispose()
        shockwaveMat1.dispose()
        shockwaveGeo2.dispose()
        shockwaveMat2.dispose()
        shieldShapeGeo.dispose()
        shieldShapeMat.dispose()
        shieldEdgesGeo.dispose()
        shieldEdgesMat.dispose()
        circuitGeo.dispose()
        circuitMat.dispose()
        haloGeo.dispose()
        haloMat.dispose()
        if (renderer.domElement.parentNode) {
          renderer.domElement.parentNode.removeChild(renderer.domElement)
        }
      }
    }
  }, [])

  // ========================================================
  // 6. COORDINATED 6-SECOND TIMELINE CONTROLLER
  // ========================================================
  useEffect(() => {
    const s = sceneRef.current
    if (!s) return

    // Calculate time in seconds: 0.0s to 6.0s
    const time = progress * 6.0
    const positions = s.particlePositions
    const posAttr = s.particles.geometry.attributes.position as THREE.BufferAttribute
    const count = positions.length / 3

    // ========================================================
    // SHOT 01: THE VOID & IGNITION (0.0s - 1.0s)
    // ========================================================
    if (time <= 1.0) {
      const t = time / 1.0
      // Forward camera movement through the particle field: z moves from 160 to 90
      s.camera.position.set(0, 0, THREE.MathUtils.lerp(160, 90, t))
      s.camera.lookAt(0, 0, 0)

      // Particles stream from void positions toward the center
      for (let i = 0; i < count; i++) {
        const i3 = i * 3
        positions[i3] = THREE.MathUtils.lerp(s.startPositions[i3], s.corePositions[i3], t * 0.8)
        positions[i3 + 1] = THREE.MathUtils.lerp(s.startPositions[i3 + 1], s.corePositions[i3 + 1], t * 0.8)
        positions[i3 + 2] = THREE.MathUtils.lerp(s.startPositions[i3 + 2], s.corePositions[i3 + 2], t * 0.8)
      }
      posAttr.needsUpdate = true

      // Core opacity starts fading in near 0.8s
      const coreFade = t > 0.7 ? (t - 0.7) / 0.3 : 0
      ;(s.coreMesh.material as THREE.MeshBasicMaterial).opacity = coreFade * 0.4
      ;(s.innerCoreMesh.material as THREE.MeshBasicMaterial).opacity = coreFade * 0.5
      ;(s.filaments.material as THREE.LineBasicMaterial).opacity = coreFade * 0.3
      ;(s.orbitalRing1.material as THREE.MeshBasicMaterial).opacity = 0
      ;(s.orbitalRing2.material as THREE.MeshBasicMaterial).opacity = 0
      ;(s.orbitalRing3.material as THREE.MeshBasicMaterial).opacity = 0
      ;(s.shieldMesh.material as THREE.MeshBasicMaterial).opacity = 0
      ;(s.shieldWireframe.material as THREE.LineBasicMaterial).opacity = 0
      ;(s.shieldCircuitLines.material as THREE.LineBasicMaterial).opacity = 0
      ;(s.ambientGlowMesh.material as THREE.MeshBasicMaterial).opacity = 0
    }

    // ========================================================
    // SHOT 02: THE ENERGY CORE AWAKENS (1.0s - 2.4s)
    // ========================================================
    else if (time <= 2.4) {
      const t = (time - 1.0) / 1.4

      // Smooth orbital camera movement around the floating core
      const angle = t * Math.PI * 0.35
      const camZ = THREE.MathUtils.lerp(90, 75, t)
      s.camera.position.set(Math.sin(angle) * 22, Math.cos(angle * 2) * 8, camZ)
      s.camera.lookAt(0, 0, 0)

      // Core rotates continuously
      s.energyCoreGroup.rotation.y = time * 0.8
      s.energyCoreGroup.rotation.x = Math.sin(time * 0.5) * 0.2

      // Orbital rings rotate at independent speeds & angles
      s.orbitalRing1.rotation.z = time * 1.4
      s.orbitalRing2.rotation.z = -time * 1.8
      s.orbitalRing3.rotation.z = time * 1.1

      // Core materials fully illuminate
      ;(s.coreMesh.material as THREE.MeshBasicMaterial).opacity = 0.85
      ;(s.innerCoreMesh.material as THREE.MeshBasicMaterial).opacity = 0.95
      ;(s.filaments.material as THREE.LineBasicMaterial).opacity = 0.7
      ;(s.orbitalRing1.material as THREE.MeshBasicMaterial).opacity = 0.65
      ;(s.orbitalRing2.material as THREE.MeshBasicMaterial).opacity = 0.55
      ;(s.orbitalRing3.material as THREE.MeshBasicMaterial).opacity = 0.45

      // Particles settle on the spherical core surface with subtle energetic jitter
      for (let i = 0; i < count; i++) {
        const i3 = i * 3
        const wobble = Math.sin(time * 4 + i) * 0.4
        positions[i3] = s.corePositions[i3] + wobble
        positions[i3 + 1] = s.corePositions[i3 + 1] + wobble
        positions[i3 + 2] = s.corePositions[i3 + 2] + wobble
      }
      posAttr.needsUpdate = true
    }

    // ========================================================
    // SHOT 03: THE POWER SURGE & SHOCKWAVE (2.4s - 3.4s)
    // ========================================================
    else if (time <= 3.4) {
      const t = (time - 2.4) / 1.0

      // Core brief compression (2.4s - 2.55s), then explosive shockwave
      if (t < 0.18) {
        // Compression
        const comp = 1.0 - (t / 0.18) * 0.28
        s.energyCoreGroup.scale.set(comp, comp, comp)
        ;(s.innerCoreMesh.material as THREE.MeshBasicMaterial).color.setHex(0xffffff)
        ;(s.innerCoreMesh.material as THREE.MeshBasicMaterial).opacity = 1
      } else {
        // Post-surge expansion
        s.energyCoreGroup.scale.set(1.1, 1.1, 1.1)
        ;(s.innerCoreMesh.material as THREE.MeshBasicMaterial).color.setHex(0xf8fafc)
      }

      // Camera pulls back to reveal the full shockwave scale
      const pullZ = THREE.MathUtils.lerp(75, 125, t)
      s.camera.position.set(0, 0, pullZ)
      s.camera.lookAt(0, 0, 0)

      // Particles scatter outward with shockwave velocity
      for (let i = 0; i < count; i++) {
        const i3 = i * 3
        positions[i3] = THREE.MathUtils.lerp(s.corePositions[i3], s.shockPositions[i3], t)
        positions[i3 + 1] = THREE.MathUtils.lerp(s.corePositions[i3 + 1], s.shockPositions[i3 + 1], t)
        positions[i3 + 2] = THREE.MathUtils.lerp(s.corePositions[i3 + 2], s.shockPositions[i3 + 2], t)
      }
      posAttr.needsUpdate = true

      // Expanding Shockwave Rings
      const shockScale = Math.max(0.1, t * 15)
      const shockOpacity = Math.max(0, (1.0 - t) * 0.9)
      s.shockwaveRing1.scale.set(shockScale, shockScale, 1)
      ;(s.shockwaveRing1.material as THREE.MeshBasicMaterial).opacity = shockOpacity

      s.shockwaveRing2.scale.set(shockScale * 0.85, shockScale * 0.85, 1)
      ;(s.shockwaveRing2.material as THREE.MeshBasicMaterial).opacity = shockOpacity * 0.8
    }

    // ========================================================
    // SHOT 04: ENERGY TRANSFORMS INTO EMBLEM (3.4s - 4.4s)
    // ========================================================
    else if (time <= 4.4) {
      const t = (time - 3.4) / 1.0

      // Camera settles to centered framing
      const camZ = THREE.MathUtils.lerp(125, 95, t)
      s.camera.position.set(0, 0, camZ)
      s.camera.lookAt(0, 0, 0)

      // Outward particles reverse direction and flow into the symmetrical abstract emblem
      for (let i = 0; i < count; i++) {
        const i3 = i * 3
        positions[i3] = THREE.MathUtils.lerp(s.shockPositions[i3], s.emblemPositions[i3], t)
        positions[i3 + 1] = THREE.MathUtils.lerp(s.shockPositions[i3 + 1], s.emblemPositions[i3 + 1], t)
        positions[i3 + 2] = THREE.MathUtils.lerp(s.shockPositions[i3 + 2], s.emblemPositions[i3 + 2], t)
      }
      posAttr.needsUpdate = true

      // Shockwave rings extinguish
      ;(s.shockwaveRing1.material as THREE.MeshBasicMaterial).opacity = 0
      ;(s.shockwaveRing2.material as THREE.MeshBasicMaterial).opacity = 0

      // Holographic 3D Cybersecurity Shield begins emerging
      const shieldFade = t
      ;(s.shieldMesh.material as THREE.MeshBasicMaterial).opacity = shieldFade * 0.75
      ;(s.shieldWireframe.material as THREE.LineBasicMaterial).opacity = shieldFade * 0.85
      ;(s.shieldCircuitLines.material as THREE.LineBasicMaterial).opacity = shieldFade * 0.9
      ;(s.ambientGlowMesh.material as THREE.MeshBasicMaterial).opacity = shieldFade * 0.85

      // Core transitions into the inner emblem matrix
      const coreDissolve = 1.0 - t * 0.6
      s.energyCoreGroup.scale.set(coreDissolve, coreDissolve, coreDissolve)
      ;(s.coreMesh.material as THREE.MeshBasicMaterial).opacity = coreDissolve * 0.6
    }

    // ========================================================
    // SHOT 05 & 06: SHIELD & BRAND REVEAL / TRANSITION (4.4s - 6.0s)
    // ========================================================
    else {
      // Centered perspective with subtle floating parallax
      const floatY = Math.sin(time * 2) * 1.2
      s.camera.position.set(0, floatY, 95)
      s.camera.lookAt(0, 0, 0)

      // Symmetrical emblem particles pulse gently
      for (let i = 0; i < count; i++) {
        const i3 = i * 3
        const pulse = Math.sin(time * 3 + i) * 0.35
        positions[i3] = s.emblemPositions[i3] + pulse
        positions[i3 + 1] = s.emblemPositions[i3 + 1] + pulse
        positions[i3 + 2] = s.emblemPositions[i3 + 2] + pulse
      }
      posAttr.needsUpdate = true

      // 3D Cybersecurity Shield subtle rotation and illumination
      s.shieldGroup.rotation.y = Math.sin(time * 1.5) * 0.08
      s.shieldGroup.rotation.x = Math.cos(time * 1.2) * 0.04

      // Transition out during Shot 06 (5.4s - 6.0s)
      if (time >= 5.4) {
        const outT = (time - 5.4) / 0.6
        const fade = 1.0 - outT
        ;(s.shieldMesh.material as THREE.MeshBasicMaterial).opacity = 0.75 * fade
        ;(s.shieldWireframe.material as THREE.LineBasicMaterial).opacity = 0.85 * fade
        ;(s.shieldCircuitLines.material as THREE.LineBasicMaterial).opacity = 0.9 * fade
        ;(s.ambientGlowMesh.material as THREE.MeshBasicMaterial).opacity = 0.85 * fade
        ;(s.particles.material as THREE.PointsMaterial).opacity = fade
      } else {
        ;(s.shieldMesh.material as THREE.MeshBasicMaterial).opacity = 0.75
        ;(s.shieldWireframe.material as THREE.LineBasicMaterial).opacity = 0.85
        ;(s.shieldCircuitLines.material as THREE.LineBasicMaterial).opacity = 0.9
        ;(s.ambientGlowMesh.material as THREE.MeshBasicMaterial).opacity = 0.85
        ;(s.particles.material as THREE.PointsMaterial).opacity = 1
      }
    }

    // Render frame
    s.renderer.render(s.scene, s.camera)
  }, [progress, isReducedMotion])

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden select-none"
    />
  )
}
