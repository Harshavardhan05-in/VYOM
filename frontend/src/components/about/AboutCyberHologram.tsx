import React, { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { Globe, Link2, FileText, QrCode, Phone, Mail } from 'lucide-react'

/**
 * AboutCyberHologram
 * 
 * Recreates the central cybersecurity visual for the About Us page
 * as a live, multi-layered interactive 3D hologram:
 * - 3D Digital Globe rotating smoothly around its vertical Y-axis.
 * - Orbiting elliptical energy rings rotating independently at different speeds.
 * - Multi-tiered holographic platform at the base with cyan neon rings.
 * - Vertical cyan energy beam with pulsating core connecting platform to shield tip.
 * - Central 3D cybersecurity shield with glowing 'P' emblem, floating breathing tilt, and cyan glow pulse.
 * - Six separate floating tool cards (Globe, Link, File, QR, Phone, Mail) hovering in 3D space with subtle independent float.
 * - Zero rectangular border or pasted-image appearance; seamlessly blends into #020B16.
 */
export const AboutCyberHologram: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const [hasWebGL, setHasWebGL] = useState(true)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    // 1. Initialize WebGL Renderer
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

    const width = container.clientWidth || 420
    const height = container.clientHeight || 360

    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.3
    container.appendChild(renderer.domElement)

    // ========================================================
    // 2. SCENE, ATMOSPHERE & CAMERA SETUP
    // ========================================================
    const scene = new THREE.Scene()
    scene.fog = new THREE.FogExp2(0x020b16, 0.005)

    const camera = new THREE.PerspectiveCamera(46, width / height, 0.1, 1000)
    camera.position.set(0, 0, 95)
    camera.lookAt(0, -0.5, 0)

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x061426, 3.2)
    scene.add(ambientLight)

    // Key front cyan light
    const keyLightFront = new THREE.PointLight(0x00d9ff, 4.0, 130)
    keyLightFront.position.set(-20, 18, 45)
    scene.add(keyLightFront)

    // Key front blue light
    const keyLightBlue = new THREE.PointLight(0x008cff, 3.2, 130)
    keyLightBlue.position.set(25, 20, 45)
    scene.add(keyLightBlue)

    // Rim backlight behind globe
    const rimLightBack = new THREE.PointLight(0x00d9ff, 4.2, 100)
    rimLightBack.position.set(0, 5, -20)
    scene.add(rimLightBack)

    // Platform cyan uplight
    const platformLight = new THREE.PointLight(0x00d9ff, 4.5, 80)
    platformLight.position.set(0, -22, 12)
    scene.add(platformLight)

    // ========================================================
    // 3. GENUINE 3D ROTATING DIGITAL GLOBE
    // Rotating smoothly on its vertical Y-axis
    // ========================================================
    const globeGroup = new THREE.Group()
    globeGroup.position.set(0, 2.5, -18)
    scene.add(globeGroup)

    const globeRadius = 22.0

    // Procedural Earth Continent Dot Matrix Canvas Texture
    const createGlobeMapCanvas = (): HTMLCanvasElement => {
      const c = document.createElement('canvas')
      c.width = 1024
      c.height = 512
      const ctx = c.getContext('2d')!
      ctx.clearRect(0, 0, 1024, 512)

      // Continental clusters
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
            ctx.shadowBlur = 3
            ctx.beginPath()
            ctx.arc(x, y, 1.8, 0, Math.PI * 2)
            ctx.fill()
          }
        }
      }

      // Coordinate Grid Lines
      ctx.strokeStyle = 'rgba(0, 217, 255, 0.24)'
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

    // 3D Latitude line loops
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
        opacity: latDeg === 0 ? 0.42 : 0.24,
      })
      globeGroup.add(new THREE.LineLoop(geom, mat))
    })

    // 3D Longitude meridian line loops
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
        opacity: 0.26,
      })
      globeGroup.add(new THREE.LineLoop(geom, mat))
    })

    // Globe outer glowing atmosphere halo
    const atmosphereGeom = new THREE.SphereGeometry(globeRadius * 1.03, 36, 36)
    const atmosphereMat = new THREE.MeshBasicMaterial({
      color: 0x008cff,
      transparent: true,
      opacity: 0.16,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide,
    })
    globeGroup.add(new THREE.Mesh(atmosphereGeom, atmosphereMat))

    // Floating cyber micro-particles around globe
    const particleCount = 40
    const pCoords = new Float32Array(particleCount * 3)
    for (let i = 0; i < particleCount; i++) {
      const theta = Math.random() * Math.PI * 2
      const phi = (Math.random() - 0.5) * Math.PI
      const dist = globeRadius + 2 + Math.random() * 7
      pCoords[i * 3] = Math.cos(phi) * Math.cos(theta) * dist
      pCoords[i * 3 + 1] = Math.sin(phi) * dist
      pCoords[i * 3 + 2] = Math.cos(phi) * Math.sin(theta) * dist
    }
    const particleGeom = new THREE.BufferGeometry()
    particleGeom.setAttribute('position', new THREE.BufferAttribute(pCoords, 3))
    const particleMat = new THREE.PointsMaterial({
      color: 0x00d9ff,
      size: 2.5,
      transparent: true,
      opacity: 0.72,
      blending: THREE.AdditiveBlending,
    })
    globeGroup.add(new THREE.Points(particleGeom, particleMat))

    // ========================================================
    // 4. INDEPENDENT ORBITING ENERGY RINGS
    // Rotating around globe at different speeds
    // ========================================================
    const ringsGroup = new THREE.Group()
    ringsGroup.position.set(0, 2.5, -16)
    ringsGroup.rotation.x = 1.15
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
          size: 3.2,
          transparent: true,
          opacity: 0.9,
          blending: THREE.AdditiveBlending,
        })
      )
      group.add(nodePts)
      return group
    }

    const ring1 = createOrbitRing(30.5, 0x00d9ff, 0.7, 8)
    const ring2 = createOrbitRing(34.0, 0x008cff, 0.5, 6)
    ring2.rotation.z = 0.45
    ringsGroup.add(ring1)
    ringsGroup.add(ring2)

    // ========================================================
    // 5. HOLOGRAPHIC PLATFORM & VERTICAL ENERGY BEAM
    // ========================================================
    const platformGroup = new THREE.Group()
    platformGroup.position.set(0, -28.5, 2)
    scene.add(platformGroup)

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

    // Outer floor base disc
    const floorDisc = new THREE.Mesh(
      new THREE.CylinderGeometry(38, 38, 0.4, 64),
      new THREE.MeshStandardMaterial({
        color: 0x061426,
        metalness: 0.75,
        roughness: 0.35,
        emissive: 0x020b16,
        emissiveIntensity: 0.35,
      })
    )
    floorDisc.position.y = 0.2
    platformGroup.add(floorDisc)

    // Outer floor neon tracks
    ;[36, 30, 24].forEach((r) => {
      const trackGeom = new THREE.TorusGeometry(r, 0.25, 8, 64)
      trackGeom.rotateX(Math.PI / 2)
      const track = new THREE.Mesh(trackGeom, neonCyanMat)
      track.position.y = 0.45
      platformGroup.add(track)
    })

    // Tier 1 Stepped Cylindrical Base
    const tier1 = new THREE.Mesh(new THREE.CylinderGeometry(29, 30.5, 2.6, 54), platformAlloyMat)
    tier1.position.y = 1.5
    platformGroup.add(tier1)

    const rim1Geom = new THREE.TorusGeometry(29.2, 0.38, 12, 64)
    rim1Geom.rotateX(Math.PI / 2)
    const rim1 = new THREE.Mesh(rim1Geom, neonCyanMat)
    rim1.position.y = 2.8
    platformGroup.add(rim1)

    // Tier 2 Raised Inner Platform
    const tier2 = new THREE.Mesh(new THREE.CylinderGeometry(21, 22, 1.8, 48), platformAlloyMat)
    tier2.position.y = 3.6
    platformGroup.add(tier2)

    const rim2Geom = new THREE.TorusGeometry(21.2, 0.34, 12, 64)
    rim2Geom.rotateX(Math.PI / 2)
    const rim2 = new THREE.Mesh(rim2Geom, neonCyanMat)
    rim2.position.y = 4.5
    platformGroup.add(rim2)

    // Tier 3 Deck
    const tier3 = new THREE.Mesh(new THREE.CylinderGeometry(14, 15, 1.0, 48), platformAlloyMat)
    tier3.position.y = 5.0
    platformGroup.add(tier3)

    // Luminous Center Emitter Disc
    const centerEmitter = new THREE.Mesh(
      new THREE.CylinderGeometry(6.0, 6.0, 0.4, 36),
      new THREE.MeshBasicMaterial({ color: 0x00d9ff, blending: THREE.AdditiveBlending })
    )
    centerEmitter.position.y = 5.6
    platformGroup.add(centerEmitter)

    // Cardinal Flare Points
    const flareCoords = [
      [29.2, 2.8, 0],
      [-29.2, 2.8, 0],
      [0, 2.8, 29.2],
      [0, 2.8, -29.2],
      [21.2, 4.5, 0],
      [-21.2, 4.5, 0],
    ]
    const flarePos = new Float32Array(flareCoords.flat())
    const flareGeom = new THREE.BufferGeometry().setAttribute('position', new THREE.BufferAttribute(flarePos, 3))
    platformGroup.add(
      new THREE.Points(
        flareGeom,
        new THREE.PointsMaterial({
          color: 0xf8fafc,
          size: 4.2,
          transparent: true,
          opacity: 0.9,
          blending: THREE.AdditiveBlending,
        })
      )
    )

    // Central Vertical Energy Beam (touches bottom tip of shield at y = -14.5)
    // Platform top emitter is at world y = -28.5 + 5.6 = -22.9
    // Shield tip sits at world y = -14.5
    const beamHeight = 8.4
    const beamCenterY = -22.9 + beamHeight / 2

    const beamOuter = new THREE.Mesh(
      new THREE.CylinderGeometry(0.5, 2.6, beamHeight, 32),
      new THREE.MeshBasicMaterial({
        color: 0x00d9ff,
        transparent: true,
        opacity: 0.58,
        blending: THREE.AdditiveBlending,
      })
    )
    beamOuter.position.set(0, beamCenterY, 2)
    scene.add(beamOuter)

    const beamCore = new THREE.Mesh(
      new THREE.CylinderGeometry(0.18, 0.85, beamHeight, 32),
      new THREE.MeshBasicMaterial({
        color: 0xf8fafc,
        transparent: true,
        opacity: 0.96,
        blending: THREE.AdditiveBlending,
      })
    )
    beamCore.position.set(0, beamCenterY, 2)
    scene.add(beamCore)

    // Contact Flare Sprite at bottom tip of shield
    const tipFlareGeom = new THREE.BufferGeometry().setAttribute(
      'position',
      new THREE.BufferAttribute(new Float32Array([0, -14.5, 2]), 3)
    )
    const tipFlare = new THREE.Points(
      tipFlareGeom,
      new THREE.PointsMaterial({
        color: 0x00ffff,
        size: 8.5,
        transparent: true,
        opacity: 0.98,
        blending: THREE.AdditiveBlending,
      })
    )
    scene.add(tipFlare)

    // ========================================================
    // 6. CENTRAL 3D CYBER SHIELD WITH 'P' EMBLEM
    // Faces forward with gentle dimensional floating breathing & glow pulse
    // ========================================================
    const shieldGroup = new THREE.Group()
    shieldGroup.position.set(0, 4.0, 3)
    scene.add(shieldGroup)

    // Shield Body Outline
    const shieldShape = new THREE.Shape()
    shieldShape.moveTo(0, -18.5) // Sharp bottom V-tip
    shieldShape.bezierCurveTo(6.5, -15.0, 15.0, -8.0, 15.2, 0.8)
    shieldShape.lineTo(15.2, 9.5)
    shieldShape.lineTo(12.5, 11.8)
    shieldShape.lineTo(-12.5, 11.8)
    shieldShape.lineTo(-15.2, 9.5)
    shieldShape.lineTo(-15.2, 0.8)
    shieldShape.bezierCurveTo(-15.0, -8.0, -6.5, -15.0, 0, -18.5)

    const shieldGeom = new THREE.ExtrudeGeometry(shieldShape, {
      depth: 3.8,
      bevelEnabled: true,
      bevelSegments: 4,
      steps: 1,
      bevelSize: 0.7,
      bevelThickness: 0.7,
    })
    shieldGeom.translate(0, 0, -1.9)

    const shieldMaterial = new THREE.MeshStandardMaterial({
      color: 0x0a203c,
      metalness: 0.92,
      roughness: 0.18,
      emissive: 0x051c36,
      emissiveIntensity: 0.6,
    })

    const shieldMesh = new THREE.Mesh(shieldGeom, shieldMaterial)
    shieldMesh.renderOrder = 10
    shieldGroup.add(shieldMesh)

    // Thick Glowing Neon Cyan Bevel Rim
    const createShieldRimGeometry = () => {
      const outer = new THREE.Shape()
      outer.moveTo(0, -18.5)
      outer.bezierCurveTo(6.5, -15.0, 15.0, -8.0, 15.2, 0.8)
      outer.lineTo(15.2, 9.5)
      outer.lineTo(12.5, 11.8)
      outer.lineTo(-12.5, 11.8)
      outer.lineTo(-15.2, 9.5)
      outer.lineTo(-15.2, 0.8)
      outer.bezierCurveTo(-15.0, -8.0, -6.5, -15.0, 0, -18.5)

      const hole = new THREE.Path()
      hole.moveTo(0, -16.5)
      hole.bezierCurveTo(5.6, -13.5, 13.2, -7.2, 13.4, 0.6)
      hole.lineTo(13.4, 8.4)
      hole.lineTo(11.2, 10.4)
      hole.lineTo(-11.2, 10.4)
      hole.lineTo(-13.4, 8.4)
      hole.lineTo(-13.4, 0.6)
      hole.bezierCurveTo(-13.2, -7.2, -5.6, -13.5, 0, -16.5)
      outer.holes.push(hole)

      const geom = new THREE.ExtrudeGeometry(outer, { depth: 0.4, bevelEnabled: false })
      geom.translate(0, 0, -0.2)
      return geom
    }

    const neonRimMat = new THREE.MeshBasicMaterial({
      color: 0x00d9ff,
      blending: THREE.AdditiveBlending,
    })

    const frontRim = new THREE.Mesh(createShieldRimGeometry(), neonRimMat)
    frontRim.position.z = 2.15
    frontRim.renderOrder = 11
    shieldGroup.add(frontRim)

    // Nested Inner Shield
    const innerShieldShape = new THREE.Shape()
    innerShieldShape.moveTo(0, -15.0)
    innerShieldShape.bezierCurveTo(5.0, -12.0, 12.0, -6.2, 12.2, 0.4)
    innerShieldShape.lineTo(12.2, 7.8)
    innerShieldShape.lineTo(10.2, 9.5)
    innerShieldShape.lineTo(-10.2, 9.5)
    innerShieldShape.lineTo(-12.2, 7.8)
    innerShieldShape.lineTo(-12.2, 0.4)
    innerShieldShape.bezierCurveTo(-12.0, -6.2, -5.0, -12.0, 0, -15.0)

    const innerShieldGeom = new THREE.ExtrudeGeometry(innerShieldShape, {
      depth: 0.5,
      bevelEnabled: true,
      bevelSegments: 2,
      bevelSize: 0.25,
      bevelThickness: 0.25,
    })
    innerShieldGeom.translate(0, 0, -0.25)

    const innerShield = new THREE.Mesh(
      innerShieldGeom,
      new THREE.MeshStandardMaterial({
        color: 0x071930,
        metalness: 0.95,
        roughness: 0.22,
        emissive: 0x041326,
        emissiveIntensity: 0.45,
      })
    )
    innerShield.position.z = 2.18
    innerShield.renderOrder = 12
    shieldGroup.add(innerShield)

    // Inner Glowing Cyan Contour Outline
    const createInnerRimGeom = () => {
      const outer = new THREE.Shape()
      outer.moveTo(0, -15.0)
      outer.bezierCurveTo(5.0, -12.0, 12.0, -6.2, 12.2, 0.4)
      outer.lineTo(12.2, 7.8)
      outer.lineTo(10.2, 9.5)
      outer.lineTo(-10.2, 9.5)
      outer.lineTo(-12.2, 7.8)
      outer.lineTo(-12.2, 0.4)
      outer.bezierCurveTo(-12.0, -6.2, -5.0, -12.0, 0, -15.0)

      const hole = new THREE.Path()
      hole.moveTo(0, -13.5)
      hole.bezierCurveTo(4.2, -10.8, 10.6, -5.4, 10.8, 0.3)
      hole.lineTo(10.8, 6.8)
      hole.lineTo(9.2, 8.2)
      hole.lineTo(-9.2, 8.2)
      hole.lineTo(-10.8, 6.8)
      hole.lineTo(-10.8, 0.3)
      hole.bezierCurveTo(-10.6, -5.4, -4.2, -10.8, 0, -13.5)
      outer.holes.push(hole)

      const geom = new THREE.ExtrudeGeometry(outer, { depth: 0.3, bevelEnabled: false })
      geom.translate(0, 0, -0.15)
      return geom
    }

    const innerRim = new THREE.Mesh(createInnerRimGeom(), neonRimMat)
    innerRim.position.z = 2.45
    innerRim.renderOrder = 13
    shieldGroup.add(innerRim)

    // Stylized 'P' Emblem
    const pShape = new THREE.Shape()
    pShape.moveTo(-4.2, 6.0)
    pShape.lineTo(-1.8, 6.0)
    pShape.lineTo(1.8, 6.0)
    pShape.bezierCurveTo(4.8, 6.0, 5.2, 0.6, 1.8, 0.6)
    pShape.lineTo(-0.6, 0.6)
    pShape.lineTo(-0.6, -4.8)
    pShape.lineTo(-3.6, -4.8)
    pShape.lineTo(-3.6, 3.2)
    pShape.closePath()

    const pHole = new THREE.Path()
    pHole.moveTo(-0.6, 4.0)
    pHole.lineTo(1.4, 4.0)
    pHole.bezierCurveTo(2.8, 4.0, 2.8, 2.4, 1.4, 2.4)
    pHole.lineTo(-0.6, 2.4)
    pHole.closePath()
    pShape.holes.push(pHole)

    const pGeom = new THREE.ExtrudeGeometry(pShape, {
      depth: 0.7,
      bevelEnabled: true,
      bevelSegments: 2,
      bevelSize: 0.22,
      bevelThickness: 0.22,
    })
    pGeom.translate(0, 0, -0.35)

    const pEmblemMat = new THREE.MeshStandardMaterial({
      color: 0x00d9ff,
      emissive: 0x00d9ff,
      emissiveIntensity: 2.8,
      metalness: 0.15,
      roughness: 0.1,
    })

    const pEmblem = new THREE.Mesh(pGeom, pEmblemMat)
    pEmblem.position.set(0.5, -0.8, 2.65)
    pEmblem.renderOrder = 14
    shieldGroup.add(pEmblem)

    // Shoulder Specular Flare Glints
    const shoulderGlints = new THREE.Points(
      new THREE.BufferGeometry().setAttribute(
        'position',
        new THREE.BufferAttribute(
          new Float32Array([
            12.8, 10.8, 2.2,
            -12.8, 10.8, 2.2,
          ]),
          3
        )
      ),
      new THREE.PointsMaterial({
        color: 0xf8fafc,
        size: 5.2,
        transparent: true,
        opacity: 0.95,
        blending: THREE.AdditiveBlending,
      })
    )
    shoulderGlints.renderOrder = 15
    shieldGroup.add(shoulderGlints)

    // ========================================================
    // 7. ANIMATION LOOP
    // Globe & rings rotate continuously; shield has subtle breathing float
    // ========================================================
    let animationFrameId: number
    let lastTime = performance.now()

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const globeSpeed = prefersReducedMotion ? 0.002 : 0.012

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate)
      const now = performance.now()
      const delta = Math.min((now - lastTime) / 1000, 0.1)
      lastTime = now
      const elapsed = now * 0.001

      // 1. DIGITAL GLOBE: Genuine 3D vertical-axis rotation (~20s cycle)
      globeGroup.rotation.y += globeSpeed * (delta * 60)

      // 2. ORBITING RINGS: Independent rotations at different speeds
      ring1.rotation.z += 0.08 * delta
      ring2.rotation.z -= 0.05 * delta

      // 3. CENTRAL SHIELD: Subtle dimensional breathing float (stays facing forward)
      shieldGroup.position.y = 4.0 + Math.sin(elapsed * 1.6) * 0.3
      shieldGroup.rotation.y = Math.sin(elapsed * 0.8) * 0.035 // subtle ±2° yaw tilt
      shieldGroup.rotation.x = Math.sin(elapsed * 1.2) * 0.025 // subtle ±1.5° pitch tilt

      // Cyan illumination pulse on shield
      pEmblemMat.emissiveIntensity = 2.4 + Math.sin(elapsed * 2.8) * 0.5

      // 4. ENERGY BEAM & TIP FLARE PULSE
      const beamPulse = 0.82 + Math.sin(elapsed * 4.0) * 0.18
      beamCore.material.opacity = beamPulse
      beamOuter.material.opacity = 0.48 + Math.sin(elapsed * 4.0) * 0.12

      renderer.render(scene, camera)
    }

    animate()

    // ========================================================
    // 8. RESIZE OBSERVER
    // ========================================================
    const handleResize = () => {
      if (!container) return
      const w = container.clientWidth || 420
      const h = container.clientHeight || 360
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer.setSize(w, h)
    }

    const resizeObserver = new ResizeObserver(handleResize)
    resizeObserver.observe(container)

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
      className="relative w-full max-w-[420px] h-[340px] sm:h-[360px] flex items-center justify-center select-none overflow-visible mx-auto group"
      aria-label="PhishShield AI Master Animated Cybersecurity Hologram"
    >
      {/* Ambient background glow behind the hologram */}
      <div
        className="absolute inset-0 pointer-events-none rounded-full blur-2xl"
        style={{
          background:
            'radial-gradient(circle at 50% 50%, rgba(0, 217, 255, 0.22) 0%, rgba(0, 140, 255, 0.12) 45%, transparent 70%)',
        }}
      />

      {/* 3D WebGL Canvas Layer */}
      <div ref={containerRef} className="absolute inset-0 w-full h-full flex items-center justify-center z-10" />

      {/* ======================================================== */}
      {/* 6 FLOATING TOOL ICONS AROUND THE CENTRAL VISUAL          */}
      {/* Independent subtle floating animations with phase delays */}
      {/* ======================================================== */}

      {/* 1. Top-Left: Globe Icon */}
      <div
        className="absolute left-[3%] sm:left-[6%] top-[14%] z-20 w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-[#04182B]/85 border border-[#00D9FF]/40 flex items-center justify-center text-[#00D9FF] shadow-[0_0_12px_rgba(0,217,255,0.25)] backdrop-blur-sm transition-all hover:border-[#00D9FF] hover:shadow-[0_0_18px_rgba(0,217,255,0.4)] pointer-events-auto hover:scale-105"
        style={{ animation: 'floatTool1 4.4s ease-in-out infinite' }}
        title="Web Scanner"
      >
        <Globe className="w-5 h-5 text-[#00D9FF]" />
      </div>

      {/* 2. Mid-Left: Link Icon */}
      <div
        className="absolute left-[0%] sm:left-[2%] top-[42%] z-20 w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-[#04182B]/85 border border-[#00D9FF]/40 flex items-center justify-center text-[#00D9FF] shadow-[0_0_12px_rgba(0,217,255,0.25)] backdrop-blur-sm transition-all hover:border-[#00D9FF] hover:shadow-[0_0_18px_rgba(0,217,255,0.4)] pointer-events-auto hover:scale-105"
        style={{ animation: 'floatTool2 5.0s ease-in-out infinite', animationDelay: '0.8s' }}
        title="URL Inspector"
      >
        <Link2 className="w-5 h-5 text-[#00D9FF]" />
      </div>

      {/* 3. Bottom-Left: Document Icon */}
      <div
        className="absolute left-[4%] sm:left-[7%] top-[70%] z-20 w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-[#04182B]/85 border border-[#00D9FF]/40 flex items-center justify-center text-[#00D9FF] shadow-[0_0_12px_rgba(0,217,255,0.25)] backdrop-blur-sm transition-all hover:border-[#00D9FF] hover:shadow-[0_0_18px_rgba(0,217,255,0.4)] pointer-events-auto hover:scale-105"
        style={{ animation: 'floatTool3 4.6s ease-in-out infinite', animationDelay: '1.6s' }}
        title="File Analyzer"
      >
        <FileText className="w-5 h-5 text-[#00D9FF]" />
      </div>

      {/* 4. Top-Right: QR Code Icon */}
      <div
        className="absolute right-[3%] sm:right-[6%] top-[14%] z-20 w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-[#04182B]/85 border border-[#00D9FF]/40 flex items-center justify-center text-[#00D9FF] shadow-[0_0_12px_rgba(0,217,255,0.25)] backdrop-blur-sm transition-all hover:border-[#00D9FF] hover:shadow-[0_0_18px_rgba(0,217,255,0.4)] pointer-events-auto hover:scale-105"
        style={{ animation: 'floatTool2 4.8s ease-in-out infinite', animationDelay: '0.4s' }}
        title="QR Code Scanner"
      >
        <QrCode className="w-5 h-5 text-[#00D9FF]" />
      </div>

      {/* 5. Mid-Right: Phone Icon */}
      <div
        className="absolute right-[0%] sm:right-[2%] top-[42%] z-20 w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-[#04182B]/85 border border-[#00D9FF]/40 flex items-center justify-center text-[#00D9FF] shadow-[0_0_12px_rgba(0,217,255,0.25)] backdrop-blur-sm transition-all hover:border-[#00D9FF] hover:shadow-[0_0_18px_rgba(0,217,255,0.4)] pointer-events-auto hover:scale-105"
        style={{ animation: 'floatTool1 5.2s ease-in-out infinite', animationDelay: '1.2s' }}
        title="Phone Fraud Verifier"
      >
        <Phone className="w-5 h-5 text-[#00D9FF]" />
      </div>

      {/* 6. Bottom-Right: Email Icon */}
      <div
        className="absolute right-[4%] sm:right-[7%] top-[70%] z-20 w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-[#04182B]/85 border border-[#00D9FF]/40 flex items-center justify-center text-[#00D9FF] shadow-[0_0_12px_rgba(0,217,255,0.25)] backdrop-blur-sm transition-all hover:border-[#00D9FF] hover:shadow-[0_0_18px_rgba(0,217,255,0.4)] pointer-events-auto hover:scale-105"
        style={{ animation: 'floatTool3 4.4s ease-in-out infinite', animationDelay: '2.0s' }}
        title="Email Analyzer"
      >
        <Mail className="w-5 h-5 text-[#00D9FF]" />
      </div>

      {/* Fallback in case WebGL is unavailable */}
      {!hasWebGL && (
        <img
          src="/assets/about/center-hologram-clean.png"
          alt="PhishShield AI Master Cyber Shield Hologram"
          className="w-full h-auto object-contain relative z-10 drop-shadow-[0_0_30px_rgba(0,217,255,0.35)] select-none pointer-events-none"
        />
      )}

      {/* CSS Keyframes for subtle floating animations */}
      <style>{`
        @keyframes floatTool1 {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-3.5px);
          }
        }
        @keyframes floatTool2 {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(3px);
          }
        }
        @keyframes floatTool3 {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-3px);
          }
        }
        @media (prefers-reduced-motion: reduce) {
          div[style*="floatTool"] {
            animation: none !important;
          }
        }
      `}</style>
    </div>
  )
}
