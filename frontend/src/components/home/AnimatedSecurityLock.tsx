import React, { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'

/**
 * AnimatedSecurityLock
 * 
 * PhishShield AI — Refined Hero Environment & Colour Palette
 * - Primary Background: #020B16 (Midnight Navy)
 * - Secondary Background: #061426 (Deep Navy Atmosphere)
 * - Hero Surface: #0B1120 (Cyber Surface)
 * - Dark Blue Panels: #111C30 (Deep Panels)
 * - Electric Cyan: #00D9FF (Luminous Cyan Accents)
 * - Bright Blue: #008CFF (Cyber Blue Energy)
 * - Primary Specular / Text: #F8FAFC
 * - Secondary Specular / Text: #CBD5E1
 * 
 * Genuine 3D lock-and-shield rotates continuously 360° around vertical Y-axis
 * in ~15s. The surrounding digital globe, horizontal orbiting rings,
 * holographic platform, vertical energy beam, and cyber city remain stationary.
 */
export const AnimatedSecurityLock: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const [hasWebGL, setHasWebGL] = useState(true)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    // Verify WebGL availability
    let renderer: THREE.WebGLRenderer
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance',
      })
    } catch {
      setHasWebGL(false)
      return
    }

    const width = container.clientWidth || 540
    const height = container.clientHeight || 560

    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.3
    container.appendChild(renderer.domElement)

    // ========================================================
    // 1. SCENE, ATMOSPHERE & CAMERA SETUP (Rich Midnight Navy)
    // ========================================================
    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0x020b16)
    scene.fog = new THREE.FogExp2(0x020b16, 0.0035)

    const camera = new THREE.PerspectiveCamera(46, width / height, 0.1, 1000)
    camera.position.set(0, 0, 108)
    camera.lookAt(0, -1, 0)

    // Ambient light in rich midnight navy
    const ambientLight = new THREE.AmbientLight(0x061426, 3.0)
    scene.add(ambientLight)

    // Key cyan light (front-left)
    const keyLightLeft = new THREE.PointLight(0x00d9ff, 3.8, 140)
    keyLightLeft.position.set(-34, 22, 48)
    scene.add(keyLightLeft)

    // Key bright-blue light (front-right)
    const keyLightRight = new THREE.PointLight(0x008cff, 3.4, 140)
    keyLightRight.position.set(34, 24, 48)
    scene.add(keyLightRight)

    // Electric cyan rim light behind lock
    const rimLightBack = new THREE.PointLight(0x00d9ff, 4.5, 110)
    rimLightBack.position.set(0, 8, -10)
    scene.add(rimLightBack)

    // Platform cyan uplight
    const platformLight = new THREE.PointLight(0x00d9ff, 4.8, 95)
    platformLight.position.set(0, -26, 16)
    scene.add(platformLight)

    // ========================================================
    // 2. REFINED CYBER ENVIRONMENT & CITY BACKDROP (STATIONARY)
    // ========================================================
    const createCityCanvas = (): HTMLCanvasElement => {
      const c = document.createElement('canvas')
      c.width = 1024
      c.height = 1024
      const ctx = c.getContext('2d')!

      // Midnight-Navy gradient background: #020B16 -> #061426 -> #0B1120
      const grad = ctx.createLinearGradient(0, 0, 0, 1024)
      grad.addColorStop(0, '#020B16')     // Primary background at top
      grad.addColorStop(0.3, '#061426')   // Secondary background
      grad.addColorStop(0.68, '#0B1120')  // Hero surface tone
      grad.addColorStop(1, '#061426')     // Smooth transition to floor
      ctx.fillStyle = grad
      ctx.fillRect(0, 0, 1024, 1024)

      // Restrained atmospheric cyan & blue lighting behind globe
      const radial = ctx.createRadialGradient(512, 480, 25, 512, 480, 520)
      radial.addColorStop(0, 'rgba(0, 217, 255, 0.32)')  // Electric cyan
      radial.addColorStop(0.26, 'rgba(0, 140, 255, 0.20)') // Bright blue
      radial.addColorStop(0.60, 'rgba(6, 20, 38, 0.08)')   // Midnight navy
      radial.addColorStop(1, 'rgba(2, 11, 22, 0)')
      ctx.fillStyle = radial
      ctx.fillRect(0, 0, 1024, 1024)

      // Deep-blue futuristic city silhouettes on Left & Right Flanks
      const towers = [
        // Left Flank Silhouettes
        { x: 0, w: 90, h: 840, winRows: 50, winW: 3, winH: 8, col: '#00D9FF', density: 0.4 },
        { x: 75, w: 105, h: 920, winRows: 56, winW: 4, winH: 10, col: '#008CFF', density: 0.44 },
        { x: 165, w: 95, h: 780, winRows: 44, winW: 3, winH: 7, col: '#00D9FF', density: 0.34 },
        { x: 245, w: 85, h: 700, winRows: 40, winW: 2, winH: 6, col: '#008CFF', density: 0.3 },
        // Right Flank Silhouettes
        { x: 690, w: 85, h: 700, winRows: 40, winW: 2, winH: 6, col: '#008CFF', density: 0.3 },
        { x: 760, w: 100, h: 800, winRows: 46, winW: 3, winH: 7, col: '#00D9FF', density: 0.34 },
        { x: 845, w: 105, h: 930, winRows: 58, winW: 4, winH: 10, col: '#008CFF', density: 0.44 },
        { x: 935, w: 90, h: 850, winRows: 52, winW: 3, winH: 8, col: '#00D9FF', density: 0.4 },
      ]

      towers.forEach(t => {
        const topY = 1024 - t.h
        // Tower Body: Deep Navy panels (#0B192E / #0D203A)
        ctx.fillStyle = 'rgba(11, 28, 48, 0.96)'
        ctx.fillRect(t.x, topY, t.w, t.h)

        // Tower Outer Edge in subtle electric cyan
        ctx.strokeStyle = 'rgba(0, 217, 255, 0.24)'
        ctx.lineWidth = 1
        ctx.strokeRect(t.x, topY, t.w, t.h)

        // Windows & Telemetry LEDs
        const cols = Math.floor(t.w / (t.winW + 7))
        for (let c = 0; c < cols; c++) {
          const wx = t.x + 8 + c * (t.winW + 7)
          for (let r = 0; r < t.winRows; r++) {
            const wy = topY + 16 + r * (t.winH + 6)
            if (Math.random() < t.density) {
              ctx.fillStyle = Math.random() < 0.2 ? '#F8FAFC' : t.col
              ctx.globalAlpha = 0.3 + Math.random() * 0.7
              ctx.fillRect(wx, wy, t.winW, t.winH)
            }
          }
        }
        ctx.globalAlpha = 1.0
      })

      // Vertical data streams in electric cyan and bright blue
      for (let i = 0; i < 24; i++) {
        const lx = i < 12 ? 30 + i * 22 : 730 + (i - 12) * 22
        const ly = 100 + Math.random() * 420
        const lh = 50 + Math.random() * 160
        const streamColor = i % 2 === 0 ? 'rgba(0, 217, 255,' : 'rgba(0, 140, 255,'
        const lGrad = ctx.createLinearGradient(0, ly, 0, ly + lh)
        lGrad.addColorStop(0, `${streamColor} 0)`)
        lGrad.addColorStop(0.5, `${streamColor} 0.45)`)
        lGrad.addColorStop(1, `${streamColor} 0)`)
        ctx.strokeStyle = lGrad
        ctx.lineWidth = 1.2
        ctx.beginPath()
        ctx.moveTo(lx, ly)
        ctx.lineTo(lx, ly + lh)
        ctx.stroke()
      }

      return c
    }

    const cityTexture = new THREE.CanvasTexture(createCityCanvas())
    const cityBackdrop = new THREE.Mesh(
      new THREE.PlaneGeometry(165, 145),
      new THREE.MeshBasicMaterial({ map: cityTexture, depthWrite: false })
    )
    cityBackdrop.position.set(0, 2, -58)
    scene.add(cityBackdrop)

    // ========================================================
    // 3. SOFTLY ILLUMINATED DIGITAL GLOBE (STATIONARY BEHIND LOCK)
    // Positioned at z = -24 so the entire sphere sits behind lock
    // ========================================================
    const globeGroup = new THREE.Group()
    globeGroup.position.set(0, 2.5, -24)
    scene.add(globeGroup)

    const globeRadius = 24.5

    // Procedural Earth Continents Dot Matrix Texture
    const createGlobeMapCanvas = (): HTMLCanvasElement => {
      const c = document.createElement('canvas')
      c.width = 1024
      c.height = 512
      const ctx = c.getContext('2d')!
      ctx.clearRect(0, 0, 1024, 512)

      // Continental clusters (Lat/Lon ranges)
      const landmasses = [
        { x1: 120, x2: 320, y1: 70, y2: 240, density: 0.65 },  // North America
        { x1: 240, x2: 370, y1: 240, y2: 430, density: 0.6 },  // South America
        { x1: 450, x2: 570, y1: 90, y2: 210, density: 0.7 },   // Europe
        { x1: 460, x2: 600, y1: 200, y2: 400, density: 0.6 },  // Africa
        { x1: 570, x2: 870, y1: 80, y2: 260, density: 0.7 },   // Asia
        { x1: 730, x2: 900, y1: 260, y2: 430, density: 0.6 },  // Australia & Oceania
      ]

      const step = 7
      for (let x = 0; x < 1024; x += step) {
        for (let y = 0; y < 512; y += step) {
          let isLand = false
          for (const m of landmasses) {
            if (x >= m.x1 && x <= m.x2 && y >= m.y1 && y <= m.y2) {
              const cx = (m.x1 + m.x2) / 2
              const cy = (m.y1 + m.y2) / 2
              const rx = (m.x2 - m.x1) / 2
              const ry = (m.y2 - m.y1) / 2
              const dist = Math.pow((x - cx) / rx, 2) + Math.pow((y - cy) / ry, 2)
              if (dist < 0.95 && Math.random() < m.density) {
                isLand = true
                break
              }
            }
          }
          if (isLand) {
            const rand = Math.random()
            ctx.fillStyle = rand < 0.15 ? '#F8FAFC' : rand < 0.75 ? '#00D9FF' : '#008CFF'
            ctx.shadowColor = '#00D9FF'
            ctx.shadowBlur = 4
            ctx.beginPath()
            ctx.arc(x, y, 1.9, 0, Math.PI * 2)
            ctx.fill()
          }
        }
      }

      // Coordinate Grid Lines
      ctx.strokeStyle = 'rgba(0, 217, 255, 0.25)'
      ctx.lineWidth = 1
      for (let y = 64; y < 512; y += 64) {
        ctx.beginPath()
        ctx.moveTo(0, y)
        ctx.lineTo(1024, y)
        ctx.stroke()
      }
      for (let x = 64; x < 1024; x += 64) {
        ctx.beginPath()
        ctx.moveTo(x, 0)
        ctx.lineTo(x, 512)
        ctx.stroke()
      }

      return c
    }

    const globeTexture = new THREE.CanvasTexture(createGlobeMapCanvas())
    const globeMesh = new THREE.Mesh(
      new THREE.SphereGeometry(globeRadius, 48, 48),
      new THREE.MeshBasicMaterial({
        map: globeTexture,
        transparent: true,
        opacity: 0.92,
        blending: THREE.AdditiveBlending,
      })
    )
    globeGroup.add(globeMesh)

    // 3D Latitude rings (Electric Cyan)
    const lats = [-50, -25, 0, 25, 50]
    lats.forEach(latDeg => {
      const phi = (latDeg * Math.PI) / 180
      const r = globeRadius * Math.cos(phi)
      const y = globeRadius * Math.sin(phi)
      const points: THREE.Vector3[] = []
      for (let i = 0; i <= 64; i++) {
        const theta = (i / 64) * Math.PI * 2
        points.push(new THREE.Vector3(Math.cos(theta) * r, y, Math.sin(theta) * r))
      }
      const geom = new THREE.BufferGeometry().setFromPoints(points)
      const mat = new THREE.LineBasicMaterial({
        color: 0x00d9ff,
        transparent: true,
        opacity: latDeg === 0 ? 0.45 : 0.28,
      })
      globeGroup.add(new THREE.LineLoop(geom, mat))
    })

    // 3D Longitude meridians (Bright Blue)
    const lons = [0, 45, 90, 135]
    lons.forEach(lonDeg => {
      const points: THREE.Vector3[] = []
      const rad = (lonDeg * Math.PI) / 180
      for (let i = 0; i <= 64; i++) {
        const theta = (i / 64) * Math.PI * 2
        const x = globeRadius * Math.sin(theta) * Math.cos(rad)
        const z = globeRadius * Math.sin(theta) * Math.sin(rad)
        const y = globeRadius * Math.cos(theta)
        points.push(new THREE.Vector3(x, y, z))
      }
      const geom = new THREE.BufferGeometry().setFromPoints(points)
      const mat = new THREE.LineBasicMaterial({
        color: 0x008cff,
        transparent: true,
        opacity: 0.28,
      })
      globeGroup.add(new THREE.LineLoop(geom, mat))
    })

    // Globe outer glowing atmosphere halo (Cyan-Blue blend)
    const atmosphereGeom = new THREE.SphereGeometry(globeRadius * 1.03, 36, 36)
    const atmosphereMat = new THREE.MeshBasicMaterial({
      color: 0x008cff,
      transparent: true,
      opacity: 0.16,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide,
    })
    globeGroup.add(new THREE.Mesh(atmosphereGeom, atmosphereMat))

    // Ambient floating network micro-particles around globe
    const particleCount = 45
    const pCoords = new Float32Array(particleCount * 3)
    for (let i = 0; i < particleCount; i++) {
      const theta = Math.random() * Math.PI * 2
      const phi = (Math.random() - 0.5) * Math.PI
      const dist = globeRadius + 2 + Math.random() * 8
      pCoords[i * 3] = Math.cos(phi) * Math.cos(theta) * dist
      pCoords[i * 3 + 1] = Math.sin(phi) * dist
      pCoords[i * 3 + 2] = Math.cos(phi) * Math.sin(theta) * dist
    }
    const particleGeom = new THREE.BufferGeometry()
    particleGeom.setAttribute('position', new THREE.BufferAttribute(pCoords, 3))
    const particleMat = new THREE.PointsMaterial({
      color: 0x00d9ff,
      size: 2.8,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending,
    })
    globeGroup.add(new THREE.Points(particleGeom, particleMat))

    // ========================================================
    // 4. ORBITING HORIZONTAL ENERGY RINGS (STATIONARY/AMBIENT)
    // ========================================================
    const ringsGroup = new THREE.Group()
    ringsGroup.position.set(0, 2.5, -22)
    ringsGroup.rotation.x = 1.15 // tilted towards viewer
    scene.add(ringsGroup)

    const createOrbitRing = (radius: number, color: number, opacity: number, nodes: number) => {
      const group = new THREE.Group()
      const pts: THREE.Vector3[] = []
      for (let i = 0; i <= 80; i++) {
        const theta = (i / 80) * Math.PI * 2
        pts.push(new THREE.Vector3(Math.cos(theta) * radius, Math.sin(theta) * radius, 0))
      }
      const ringLine = new THREE.Line(
        new THREE.BufferGeometry().setFromPoints(pts),
        new THREE.LineBasicMaterial({ color, transparent: true, opacity })
      )
      group.add(ringLine)

      // Glowing flare nodes
      const nodePos = new Float32Array(nodes * 3)
      for (let i = 0; i < nodes; i++) {
        const theta = (i / nodes) * Math.PI * 2
        nodePos[i * 3] = Math.cos(theta) * radius
        nodePos[i * 3 + 1] = Math.sin(theta) * radius
        nodePos[i * 3 + 2] = 0
      }
      const nodeGeom = new THREE.BufferGeometry()
      nodeGeom.setAttribute('position', new THREE.BufferAttribute(nodePos, 3))
      const nodePts = new THREE.Points(
        nodeGeom,
        new THREE.PointsMaterial({
          color: 0xf8fafc,
          size: 3.5,
          transparent: true,
          opacity: 0.9,
          blending: THREE.AdditiveBlending,
        })
      )
      group.add(nodePts)
      return group
    }

    const ring1 = createOrbitRing(34.5, 0x00d9ff, 0.7, 8) // Electric cyan
    const ring2 = createOrbitRing(38.0, 0x008cff, 0.5, 6) // Bright blue
    ring2.rotation.z = 0.4
    ringsGroup.add(ring1)
    ringsGroup.add(ring2)

    // ========================================================
    // 5. REFINED HOLOGRAPHIC PLATFORM (Smooth Background Blend)
    // Deep blue alloy with luminous cyan highlights
    // ========================================================
    const platformGroup = new THREE.Group()
    platformGroup.position.set(0, -33.5, 2)
    scene.add(platformGroup)

    // Deep-blue cybersecurity alloy (avoids harsh flat black)
    const platformAlloyMat = new THREE.MeshStandardMaterial({
      color: 0x0c203b,
      metalness: 0.86,
      roughness: 0.25,
      emissive: 0x051528,
      emissiveIntensity: 0.45,
    })

    const neonCyanMat = new THREE.MeshBasicMaterial({
      color: 0x00d9ff,
      blending: THREE.AdditiveBlending,
    })

    const brightBlueMat = new THREE.MeshBasicMaterial({
      color: 0x008cff,
      blending: THREE.AdditiveBlending,
    })

    // Outer floor base disc with smooth fade into #020B16 floor
    const floorDiscGeom = new THREE.CylinderGeometry(45, 45, 0.4, 64)
    const floorDiscMat = new THREE.MeshStandardMaterial({
      color: 0x061426,
      metalness: 0.75,
      roughness: 0.35,
      emissive: 0x020b16,
      emissiveIntensity: 0.35,
    })
    const floorDisc = new THREE.Mesh(floorDiscGeom, floorDiscMat)
    floorDisc.position.y = 0.2
    platformGroup.add(floorDisc)

    // Outer floor neon tracks in electric cyan and bright blue
    ;[44, 38, 31].forEach((r, idx) => {
      const trackGeom = new THREE.TorusGeometry(r, 0.28, 8, 64)
      trackGeom.rotateX(Math.PI / 2)
      const trackMat = idx === 1 ? brightBlueMat : neonCyanMat
      const track = new THREE.Mesh(trackGeom, trackMat)
      track.position.y = 0.45
      platformGroup.add(track)
    })

    // Tier 1 Stepped Cylindrical Base (Radius: 35.5, Height: 3.2)
    const tier1Geom = new THREE.CylinderGeometry(35, 36.5, 3.2, 54)
    const tier1 = new THREE.Mesh(tier1Geom, platformAlloyMat)
    tier1.position.y = 1.8
    platformGroup.add(tier1)

    const rim1Geom = new THREE.TorusGeometry(35.2, 0.42, 12, 64)
    rim1Geom.rotateX(Math.PI / 2)
    const rim1 = new THREE.Mesh(rim1Geom, neonCyanMat)
    rim1.position.y = 3.4
    platformGroup.add(rim1)

    // Tier 2 Raised Inner Platform (Radius: 26, Height: 2.2)
    const tier2Geom = new THREE.CylinderGeometry(25.5, 26.5, 2.2, 48)
    const tier2 = new THREE.Mesh(tier2Geom, platformAlloyMat)
    tier2.position.y = 4.3
    platformGroup.add(tier2)

    const rim2Geom = new THREE.TorusGeometry(25.6, 0.38, 12, 64)
    rim2Geom.rotateX(Math.PI / 2)
    const rim2 = new THREE.Mesh(rim2Geom, neonCyanMat)
    rim2.position.y = 5.4
    platformGroup.add(rim2)

    // Tier 3 Deck (Radius: 17, Height: 1.2)
    const tier3Geom = new THREE.CylinderGeometry(16.5, 17.5, 1.2, 48)
    const tier3 = new THREE.Mesh(tier3Geom, platformAlloyMat)
    tier3.position.y = 5.9
    platformGroup.add(tier3)

    // Luminous Center Emitter Disc (Electric Cyan + White Core)
    const centerEmitter = new THREE.Mesh(
      new THREE.CylinderGeometry(7.5, 7.5, 0.4, 36),
      new THREE.MeshBasicMaterial({ color: 0x00d9ff, blending: THREE.AdditiveBlending })
    )
    centerEmitter.position.y = 6.6
    platformGroup.add(centerEmitter)

    // Cardinal Flare Points along the platform rims
    const flareMat = new THREE.PointsMaterial({
      color: 0xf8fafc,
      size: 4.8,
      transparent: true,
      opacity: 0.92,
      blending: THREE.AdditiveBlending,
    })
    const flareCoords = [
      [35.2, 3.4, 0],
      [-35.2, 3.4, 0],
      [0, 3.4, 35.2],
      [0, 3.4, -35.2],
      [25.6, 5.4, 0],
      [-25.6, 5.4, 0],
    ]
    const flarePos = new Float32Array(flareCoords.flat())
    const flareGeom = new THREE.BufferGeometry()
    flareGeom.setAttribute('position', new THREE.BufferAttribute(flarePos, 3))
    platformGroup.add(new THREE.Points(flareGeom, flareMat))

    // ========================================================
    // 6. BRIGHT CENTRAL VERTICAL ENERGY BEAM (STATIONARY)
    // ========================================================
    const beamHeight = 8.7
    const beamCenterY = -26.9 + beamHeight / 2

    const beamOuterGeom = new THREE.CylinderGeometry(0.55, 3.0, beamHeight, 32)
    const beamOuterMat = new THREE.MeshBasicMaterial({
      color: 0x00d9ff,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending,
    })
    const beamOuter = new THREE.Mesh(beamOuterGeom, beamOuterMat)
    beamOuter.position.set(0, beamCenterY, 2)
    scene.add(beamOuter)

    const beamCoreGeom = new THREE.CylinderGeometry(0.2, 1.0, beamHeight, 32)
    const beamCoreMat = new THREE.MeshBasicMaterial({
      color: 0xf8fafc,
      transparent: true,
      opacity: 0.98,
      blending: THREE.AdditiveBlending,
    })
    const beamCore = new THREE.Mesh(beamCoreGeom, beamCoreMat)
    beamCore.position.set(0, beamCenterY, 2)
    scene.add(beamCore)

    // Contact Flare Sprite at bottom tip of shield
    const tipFlareGeom = new THREE.BufferGeometry()
    tipFlareGeom.setAttribute('position', new THREE.BufferAttribute(new Float32Array([0, -18.2, 2]), 3))
    const tipFlare = new THREE.Points(
      tipFlareGeom,
      new THREE.PointsMaterial({
        color: 0x00ffff,
        size: 9.0,
        transparent: true,
        opacity: 0.98,
        blending: THREE.AdditiveBlending,
      })
    )
    scene.add(tipFlare)

    // ========================================================
    // 7. THE CENTRAL PADLOCK-SHIELD (3D ROTATING OBJECT)
    // Deep-blue shadows + luminous cyan highlights
    // Continuous 360° rotation around vertical Y-axis in ~15s
    // ========================================================
    const lockGroup = new THREE.Group()
    lockGroup.position.set(0, 3.5, 2)
    scene.add(lockGroup)

    // --------------------------------------------------------
    // A. SHIELD-SHAPED BODY (Extruded 3D Mesh)
    // --------------------------------------------------------
    const shieldShape = new THREE.Shape()
    shieldShape.moveTo(0, -21.7) // Sharp bottom V-tip
    shieldShape.bezierCurveTo(7.5, -17.5, 17.5, -9.5, 17.8, 1.0)
    shieldShape.lineTo(17.8, 11.0)
    shieldShape.lineTo(14.8, 13.5)
    shieldShape.lineTo(-14.8, 13.5)
    shieldShape.lineTo(-17.8, 11.0)
    shieldShape.lineTo(-17.8, 1.0)
    shieldShape.bezierCurveTo(-17.5, -9.5, -7.5, -17.5, 0, -21.7)

    const extrudeSettings: THREE.ExtrudeGeometryOptions = {
      depth: 4.4,
      bevelEnabled: true,
      bevelSegments: 4,
      steps: 1,
      bevelSize: 0.8,
      bevelThickness: 0.8,
    }

    const shieldGeometry = new THREE.ExtrudeGeometry(shieldShape, extrudeSettings)
    shieldGeometry.translate(0, 0, -2.2)

    // Rich midnight-navy body with cyan-tinted edge response
    const shieldMaterial = new THREE.MeshStandardMaterial({
      color: 0x0a203c,
      metalness: 0.92,
      roughness: 0.18,
      emissive: 0x051c36,
      emissiveIntensity: 0.55,
    })

    const shieldMesh = new THREE.Mesh(shieldGeometry, shieldMaterial)
    shieldMesh.renderOrder = 10
    lockGroup.add(shieldMesh)

    // --------------------------------------------------------
    // B. THICK GLOWING NEON CYAN SHIELD RIM (Front and Back)
    // --------------------------------------------------------
    const createShieldRimGeometry = () => {
      const outer = new THREE.Shape()
      outer.moveTo(0, -21.7)
      outer.bezierCurveTo(7.5, -17.5, 17.5, -9.5, 17.8, 1.0)
      outer.lineTo(17.8, 11.0)
      outer.lineTo(14.8, 13.5)
      outer.lineTo(-14.8, 13.5)
      outer.lineTo(-17.8, 11.0)
      outer.lineTo(-17.8, 1.0)
      outer.bezierCurveTo(-17.5, -9.5, -7.5, -17.5, 0, -21.7)

      const hole = new THREE.Path()
      hole.moveTo(0, -19.5)
      hole.bezierCurveTo(6.6, -15.8, 15.6, -8.6, 15.8, 0.8)
      hole.lineTo(15.8, 9.8)
      hole.lineTo(13.2, 12.0)
      hole.lineTo(-13.2, 12.0)
      hole.lineTo(-15.8, 9.8)
      hole.lineTo(-15.8, 0.8)
      hole.bezierCurveTo(-15.6, -8.6, -6.6, -15.8, 0, -19.5)
      outer.holes.push(hole)

      const geom = new THREE.ExtrudeGeometry(outer, { depth: 0.45, bevelEnabled: false })
      geom.translate(0, 0, -0.22)
      return geom
    }

    const neonRimMat = new THREE.MeshBasicMaterial({
      color: 0x00d9ff,
      blending: THREE.AdditiveBlending,
    })

    const frontRim = new THREE.Mesh(createShieldRimGeometry(), neonRimMat)
    frontRim.position.z = 2.45
    frontRim.renderOrder = 11
    lockGroup.add(frontRim)

    const backRim = new THREE.Mesh(createShieldRimGeometry(), neonRimMat)
    backRim.position.z = -2.45
    backRim.renderOrder = 11
    lockGroup.add(backRim)

    // --------------------------------------------------------
    // C. SHACKLE (Smooth Curved Inverted U-Tube)
    // --------------------------------------------------------
    const shackleCurve = new THREE.CurvePath<THREE.Vector3>()
    const leg1 = new THREE.LineCurve3(new THREE.Vector3(-8.8, 9.5, 0), new THREE.Vector3(-8.8, 20.5, 0))
    const arc = new THREE.CubicBezierCurve3(
      new THREE.Vector3(-8.8, 20.5, 0),
      new THREE.Vector3(-8.8, 30.5, 0),
      new THREE.Vector3(8.8, 30.5, 0),
      new THREE.Vector3(8.8, 20.5, 0)
    )
    const leg2 = new THREE.LineCurve3(new THREE.Vector3(8.8, 20.5, 0), new THREE.Vector3(8.8, 9.5, 0))
    shackleCurve.add(leg1)
    shackleCurve.add(arc)
    shackleCurve.add(leg2)

    // Outer Shackle Tube in deep aerospace navy
    const shackleGeom = new THREE.TubeGeometry(shackleCurve, 54, 2.1, 24, false)
    const shackleMat = new THREE.MeshStandardMaterial({
      color: 0x0e284c,
      metalness: 0.94,
      roughness: 0.16,
      emissive: 0x082444,
      emissiveIntensity: 0.5,
    })
    const shackleMesh = new THREE.Mesh(shackleGeom, shackleMat)
    shackleMesh.renderOrder = 10
    lockGroup.add(shackleMesh)

    // Smooth Glowing Neon Cyan Contour along Shackle Curve
    const shackleGlowGeom = new THREE.TubeGeometry(shackleCurve, 54, 2.25, 16, false)
    const shackleGlowMat = new THREE.MeshBasicMaterial({
      color: 0x00d9ff,
      transparent: true,
      opacity: 0.45,
      blending: THREE.AdditiveBlending,
    })
    const shackleGlowMesh = new THREE.Mesh(shackleGlowGeom, shackleGlowMat)
    shackleGlowMesh.renderOrder = 11
    lockGroup.add(shackleGlowMesh)

    // Crest Specular White Highlight (#F8FAFC)
    const crestArc = new THREE.CubicBezierCurve3(
      new THREE.Vector3(-6.5, 23.5, 1.8),
      new THREE.Vector3(-6.5, 29.5, 1.8),
      new THREE.Vector3(6.5, 29.5, 1.8),
      new THREE.Vector3(6.5, 23.5, 1.8)
    )
    const crestPts = crestArc.getPoints(24)
    const crestGeom = new THREE.BufferGeometry().setFromPoints(crestPts)
    const crestLine = new THREE.Line(
      crestGeom,
      new THREE.LineBasicMaterial({ color: 0xf8fafc, transparent: true, opacity: 0.95 })
    )
    crestLine.renderOrder = 12
    lockGroup.add(crestLine)

    // --------------------------------------------------------
    // D. NESTED INNER SHIELD (Front and Back)
    // --------------------------------------------------------
    const innerShieldShape = new THREE.Shape()
    innerShieldShape.moveTo(0, -17.5)
    innerShieldShape.bezierCurveTo(6.0, -14.0, 14.0, -7.5, 14.2, 0.5)
    innerShieldShape.lineTo(14.2, 9.0)
    innerShieldShape.lineTo(12.0, 11.0)
    innerShieldShape.lineTo(-12.0, 11.0)
    innerShieldShape.lineTo(-14.2, 9.0)
    innerShieldShape.lineTo(-14.2, 0.5)
    innerShieldShape.bezierCurveTo(-14.0, -7.5, -6.0, -14.0, 0, -17.5)

    const innerShieldGeom = new THREE.ExtrudeGeometry(innerShieldShape, {
      depth: 0.6,
      bevelEnabled: true,
      bevelSegments: 2,
      bevelSize: 0.3,
      bevelThickness: 0.3,
    })
    innerShieldGeom.translate(0, 0, -0.3)

    const innerShieldMat = new THREE.MeshStandardMaterial({
      color: 0x071930,
      metalness: 0.95,
      roughness: 0.22,
      emissive: 0x041326,
      emissiveIntensity: 0.4,
    })

    const frontInnerShield = new THREE.Mesh(innerShieldGeom, innerShieldMat)
    frontInnerShield.position.z = 2.45
    frontInnerShield.renderOrder = 12
    lockGroup.add(frontInnerShield)

    const backInnerShield = new THREE.Mesh(innerShieldGeom, innerShieldMat)
    backInnerShield.position.z = -2.45
    backInnerShield.renderOrder = 12
    lockGroup.add(backInnerShield)

    // Inner Glowing Cyan Contour Outline
    const createInnerShieldRimGeometry = () => {
      const outer = new THREE.Shape()
      outer.moveTo(0, -17.5)
      outer.bezierCurveTo(6.0, -14.0, 14.0, -7.5, 14.2, 0.5)
      outer.lineTo(14.2, 9.0)
      outer.lineTo(12.0, 11.0)
      outer.lineTo(-12.0, 11.0)
      outer.lineTo(-14.2, 9.0)
      outer.lineTo(-14.2, 0.5)
      outer.bezierCurveTo(-14.0, -7.5, -6.0, -14.0, 0, -17.5)

      const hole = new THREE.Path()
      hole.moveTo(0, -15.8)
      hole.bezierCurveTo(5.2, -12.6, 12.5, -6.6, 12.7, 0.4)
      hole.lineTo(12.7, 7.8)
      hole.lineTo(10.8, 9.6)
      hole.lineTo(-10.8, 9.6)
      hole.lineTo(-12.7, 7.8)
      hole.lineTo(-12.7, 0.4)
      hole.bezierCurveTo(-12.5, -6.6, -5.2, -12.6, 0, -15.8)
      outer.holes.push(hole)

      const geom = new THREE.ExtrudeGeometry(outer, { depth: 0.35, bevelEnabled: false })
      geom.translate(0, 0, -0.17)
      return geom
    }

    const frontInnerRim = new THREE.Mesh(createInnerShieldRimGeometry(), neonRimMat)
    frontInnerRim.position.z = 2.8
    frontInnerRim.renderOrder = 13
    lockGroup.add(frontInnerRim)

    const backInnerRim = new THREE.Mesh(createInnerShieldRimGeometry(), neonRimMat)
    backInnerRim.position.z = -2.8
    backInnerRim.renderOrder = 13
    lockGroup.add(backInnerRim)

    // --------------------------------------------------------
    // E. STYLIZED 'P' EMBLEM (Front and Back)
    // Brilliant electric cyan (#00D9FF) + specular white core (#F8FAFC)
    // --------------------------------------------------------
    const pShape = new THREE.Shape()
    pShape.moveTo(-5.0, 7.0)
    pShape.lineTo(-2.2, 7.0)
    pShape.lineTo(2.0, 7.0)
    pShape.bezierCurveTo(5.5, 7.0, 6.0, 0.8, 2.0, 0.8)
    pShape.lineTo(-0.8, 0.8)
    pShape.lineTo(-0.8, -5.5)
    pShape.lineTo(-4.2, -5.5)
    pShape.lineTo(-4.2, 3.8)
    pShape.closePath()

    const pHole = new THREE.Path()
    pHole.moveTo(-0.8, 4.8)
    pHole.lineTo(1.6, 4.8)
    pHole.bezierCurveTo(3.2, 4.8, 3.2, 3.0, 1.6, 3.0)
    pHole.lineTo(-0.8, 3.0)
    pHole.closePath()
    pShape.holes.push(pHole)

    const pGeom = new THREE.ExtrudeGeometry(pShape, {
      depth: 0.8,
      bevelEnabled: true,
      bevelSegments: 2,
      bevelSize: 0.25,
      bevelThickness: 0.25,
    })
    pGeom.translate(0, 0, -0.4)

    const pEmblemMat = new THREE.MeshStandardMaterial({
      color: 0x00d9ff,
      emissive: 0x00d9ff,
      emissiveIntensity: 2.8,
      metalness: 0.15,
      roughness: 0.1,
    })

    const frontPEmblem = new THREE.Mesh(pGeom, pEmblemMat)
    frontPEmblem.position.set(0.6, -1.0, 3.05)
    frontPEmblem.renderOrder = 14
    lockGroup.add(frontPEmblem)

    const backPEmblem = new THREE.Mesh(pGeom, pEmblemMat)
    backPEmblem.position.set(-0.6, -1.0, -3.05)
    backPEmblem.rotation.y = Math.PI
    backPEmblem.renderOrder = 14
    lockGroup.add(backPEmblem)

    // Specular Flare Glints on Shield Shoulders (#F8FAFC)
    const shoulderGlints = new THREE.Points(
      new THREE.BufferGeometry().setAttribute(
        'position',
        new THREE.BufferAttribute(
          new Float32Array([
            15.0, 12.5, 2.4,
            -15.0, 12.5, 2.4,
            15.0, 12.5, -2.4,
            -15.0, 12.5, -2.4,
          ]),
          3
        )
      ),
      new THREE.PointsMaterial({
        color: 0xf8fafc,
        size: 5.5,
        transparent: true,
        opacity: 0.95,
        blending: THREE.AdditiveBlending,
      })
    )
    shoulderGlints.renderOrder = 15
    lockGroup.add(shoulderGlints)

    // ========================================================
    // 8. ANIMATION LOOP
    // ONLY lockGroup rotates 360° around Y-axis in ~15s
    // Globe, Platform, City, Beam remain firmly STATIONARY
    // ========================================================
    let animationFrameId: number
    let lastTime = performance.now()

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const rotationSpeed = prefersReducedMotion ? (Math.PI * 2) / 60.0 : (Math.PI * 2) / 15.0 // ~15 seconds per 360° turn

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate)
      const now = performance.now()
      const delta = Math.min((now - lastTime) / 1000, 0.1)
      lastTime = now
      const elapsed = now * 0.001

      // 1. ROTATE ONLY THE CENTRAL LOCK-SHIELD 360° ON Y-AXIS (15s cycle)
      lockGroup.rotation.y += rotationSpeed * delta

      // Subtle vertical floating breath (only ±0.25 units, stays directly aligned with beam)
      lockGroup.position.y = 3.5 + Math.sin(elapsed * 1.5) * 0.25

      // 2. STATIONARY GLOBE: subtle internal coordinate shimmer
      globeGroup.rotation.y += 0.02 * delta

      // 3. STATIONARY ORBITING RINGS: subtle ambient drift
      ring1.rotation.z += 0.06 * delta
      ring2.rotation.z -= 0.04 * delta

      // 4. ENERGY BEAM & TIP FLARE PULSE
      const beamPulse = 0.82 + Math.sin(elapsed * 4.0) * 0.18
      beamCoreMat.opacity = beamPulse
      beamOuterMat.opacity = 0.48 + Math.sin(elapsed * 4.0) * 0.12

      renderer.render(scene, camera)
    }

    animate()

    // ========================================================
    // 9. RESIZE OBSERVER
    // ========================================================
    const handleResize = () => {
      if (!container) return
      const w = container.clientWidth || 540
      const h = container.clientHeight || 560
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer.setSize(w, h)
    }

    const resizeObserver = new ResizeObserver(handleResize)
    resizeObserver.observe(container)

    // Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId)
      resizeObserver.disconnect()
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement)
      }
      renderer.dispose()
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[480px] sm:h-[540px] lg:h-[580px] flex items-center justify-center select-none overflow-hidden group"
      aria-label="PhishShield AI Exact Reference Security Padlock Hologram"
    >
      {/* Fallback in case WebGL is unavailable */}
      {!hasWebGL && (
        <div className="text-[#00D9FF] text-center p-6 bg-[#061426]/90 rounded-xl border border-[#00D9FF]/30">
          <p className="font-semibold text-lg text-[#F8FAFC]">3D Hologram Initializing...</p>
          <p className="text-xs text-[#CBD5E1] mt-1">Please ensure hardware acceleration is enabled.</p>
        </div>
      )}
    </div>
  )
}
