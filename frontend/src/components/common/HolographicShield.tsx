import React, { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'

type ShieldMode = 'intro' | 'hero'
type ShieldPresentation = 'hero' | 'cinematic'

interface HolographicShieldProps {
    mode: ShieldMode
    presentation?: ShieldPresentation
    progress?: number
    reducedMotion?: boolean
    active?: boolean
    className?: string
}

const createShieldShape = (scale = 1): THREE.Shape => {
    const shape = new THREE.Shape()
    shape.moveTo(0, 35 * scale)
    shape.quadraticCurveTo(23 * scale, 32 * scale, 29 * scale, 24 * scale)
    shape.lineTo(26 * scale, 6 * scale)
    shape.quadraticCurveTo(23 * scale, -13 * scale, 14 * scale, -25 * scale)
    shape.lineTo(0, -35 * scale)
    shape.lineTo(-14 * scale, -25 * scale)
    shape.quadraticCurveTo(-23 * scale, -13 * scale, -26 * scale, 6 * scale)
    shape.lineTo(-29 * scale, 24 * scale)
    shape.quadraticCurveTo(-23 * scale, 32 * scale, 0, 35 * scale)
    shape.closePath()
    return shape
}

const smoothStep = (edge0: number, edge1: number, value: number) => {
    const t = THREE.MathUtils.clamp((value - edge0) / (edge1 - edge0), 0, 1)
    return t * t * (3 - 2 * t)
}

const getPointOnPath = (path: THREE.Vector3[], progress: number) => {
    const lengths: number[] = []
    let totalLength = 0

    for (let index = 1; index < path.length; index += 1) {
        const length = path[index].distanceTo(path[index - 1])
        lengths.push(length)
        totalLength += length
    }

    let distance = progress * totalLength
    for (let index = 0; index < lengths.length; index += 1) {
        const segmentLength = lengths[index]
        if (distance <= segmentLength || index === lengths.length - 1) {
            return path[index].clone().lerp(path[index + 1], distance / segmentLength)
        }
        distance -= segmentLength
    }

    return path[path.length - 1].clone()
}

export const HolographicShield: React.FC<HolographicShieldProps> = ({
    mode,
    presentation = 'hero',
    progress = 1,
    reducedMotion = false,
    active = true,
    className = '',
}) => {
    const isCinematicIntro = mode === 'intro' && presentation === 'cinematic'
    const containerRef = useRef<HTMLDivElement>(null)
    const progressRef = useRef(progress)
    const motionPreferenceRef = useRef(reducedMotion)
    const [isRendered, setIsRendered] = useState(false)

    useEffect(() => {
        progressRef.current = progress
    }, [progress])

    useEffect(() => {
        const container = containerRef.current
        if (!container || !active) {
            setIsRendered(false)
            return
        }

        setIsRendered(false)

        const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
        const updateMotionPreference = () => {
            motionPreferenceRef.current = reducedMotion || mediaQuery.matches
        }
        updateMotionPreference()
        mediaQuery.addEventListener('change', updateMotionPreference)

        let renderer: THREE.WebGLRenderer
        try {
            renderer = new THREE.WebGLRenderer({
                antialias: true,
                alpha: true,
                powerPreference: 'high-performance',
            })
        } catch {
            mediaQuery.removeEventListener('change', updateMotionPreference)
            return
        }

        const width = Math.max(container.clientWidth, 1)
        const height = Math.max(container.clientHeight, 1)
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5))
        renderer.setSize(width, height)
        renderer.outputColorSpace = THREE.SRGBColorSpace
        renderer.toneMapping = THREE.ACESFilmicToneMapping
        renderer.toneMappingExposure = 1
        renderer.setClearColor(0x020b16, 0)
        renderer.domElement.setAttribute('aria-hidden', 'true')
        renderer.domElement.style.position = 'absolute'
        renderer.domElement.style.inset = '0'
        renderer.domElement.style.width = '100%'
        renderer.domElement.style.height = '100%'
        renderer.domElement.style.pointerEvents = 'none'
        container.appendChild(renderer.domElement)

        const scene = new THREE.Scene()
        const cameraFov = (aspectRatio: number) =>
            isCinematicIntro ? aspectRatio < 1 ? 42 : 32 : 36
        const camera = new THREE.PerspectiveCamera(
            cameraFov(width / height),
            width / height,
            0.1,
            260
        )
        camera.position.set(
            isCinematicIntro ? 22 : 12,
            isCinematicIntro ? 11 : 7,
            isCinematicIntro ? 132 : 124
        )
        camera.lookAt(0, 0, 0)
        scene.add(new THREE.HemisphereLight(0x9beeff, 0x07192b, 1.35))

        const keyLight = new THREE.DirectionalLight(0xb5f8ff, 2.4)
        keyLight.position.set(-30, 35, 48)
        scene.add(keyLight)

        const fillLight = new THREE.DirectionalLight(0x20cce4, 1.6)
        fillLight.position.set(32, -12, 28)
        scene.add(fillLight)

        const rimLight = new THREE.DirectionalLight(0x087f9c, 2.2)
        rimLight.position.set(-8, 14, -32)
        scene.add(rimLight)

        const resources = new Set<THREE.Object3D>()
        const shieldGroup = new THREE.Group()
        shieldGroup.scale.setScalar(isCinematicIntro ? 1 : 0.9)
        scene.add(shieldGroup)
        resources.add(shieldGroup)

        const rearLayer = new THREE.Group()
        const middleLayer = new THREE.Group()
        const frontLayer = new THREE.Group()
        shieldGroup.add(rearLayer, middleLayer, frontLayer)

        const shieldMaterials: THREE.Material[] = []
        const detailMaterials: THREE.Material[] = []
        const scanMaterials: THREE.Material[] = []
        const shellMeshes: THREE.Mesh[] = []

        const makeShell = (
            layer: THREE.Group,
            scale: number,
            depth: number,
            color: number,
            opacity: number,
            z: number,
            bevel = 0.45
        ) => {
            const shape = createShieldShape(scale)
            const geometry = new THREE.ExtrudeGeometry(shape, {
                depth,
                bevelEnabled: true,
                bevelSegments: 3,
                steps: 1,
                bevelSize: bevel,
                bevelThickness: bevel,
                curveSegments: 12,
            })
            const material = new THREE.MeshPhysicalMaterial({
                color,
                emissive: 0x00566a,
                emissiveIntensity: 0.32,
                roughness: 0.28,
                metalness: 0,
                clearcoat: 0.8,
                clearcoatRoughness: 0.22,
                transparent: true,
                opacity,
                side: THREE.DoubleSide,
                depthWrite: false,
            })
            material.userData.baseOpacity = opacity
            const introLayer = layer === rearLayer
                ? 'rear'
                : layer === middleLayer
                    ? 'middle'
                    : 'front'
            material.userData.introLayer = introLayer
            const sideMaterial = isCinematicIntro
                ? new THREE.MeshPhysicalMaterial({
                    color: 0x08778b,
                    emissive: 0x006174,
                    emissiveIntensity: 0.38,
                    roughness: 0.26,
                    metalness: 0,
                    clearcoat: 0.65,
                    clearcoatRoughness: 0.2,
                    transparent: true,
                    opacity: Math.min(opacity * 2.4, 0.78),
                    side: THREE.DoubleSide,
                    depthWrite: false,
                })
                : null
            if (sideMaterial) {
                sideMaterial.userData.baseOpacity = Math.min(opacity * 2.4, 0.78)
                sideMaterial.userData.introLayer = introLayer
            }
            const mesh = new THREE.Mesh(
                geometry,
                sideMaterial ? [material, sideMaterial] : material
            )
            mesh.position.z = z
            mesh.renderOrder = 1
            layer.add(mesh)
            resources.add(mesh)
            shieldMaterials.push(material)
            if (sideMaterial) shieldMaterials.push(sideMaterial)
            shellMeshes.push(mesh)
            return { shape, mesh }
        }

        const { shape: rearShape, mesh: rearMembrane } = makeShell(
            rearLayer,
            isCinematicIntro ? 1.12 : 1.08,
            isCinematicIntro ? 7 : 4.4,
            0x073b4b,
            isCinematicIntro ? 0.19 : 0.14,
            isCinematicIntro ? -28 : -18,
            isCinematicIntro ? 1.1 : 0.8
        )
        const { shape: middleShape, mesh: middleMembrane } = makeShell(
            middleLayer,
            isCinematicIntro ? 0.97 : 0.94,
            isCinematicIntro ? 8.5 : 6.2,
            0x08718a,
            isCinematicIntro ? 0.27 : 0.22,
            isCinematicIntro ? -12 : -8.5,
            isCinematicIntro ? 1.15 : 1
        )
        const { shape: mainShape } = makeShell(
            frontLayer,
            1,
            isCinematicIntro ? 16 : 13,
            0x0b7183,
            isCinematicIntro ? 0.4 : 0.34,
            0,
            isCinematicIntro ? 1.5 : 1.25
        )

        rearMembrane.renderOrder = 1
        middleMembrane.renderOrder = 2
        shellMeshes[2].renderOrder = 3

        const makeEnergySurface = (color: THREE.Color, opacity: number) =>
            new THREE.ShaderMaterial({
                uniforms: {
                    uTint: { value: color },
                    uOpacity: { value: opacity },
                    uBreath: { value: 0 },
                },
                vertexShader: `
          varying vec2 vUv;
          void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
                fragmentShader: `
          uniform vec3 uTint;
          uniform float uOpacity;
          uniform float uBreath;
          varying vec2 vUv;
          void main() {
            vec2 centered = (vUv - 0.5) * 2.0;
            float centerEnergy = exp(-dot(centered * vec2(0.76, 0.9), centered * vec2(0.76, 0.9)) * 2.1);
            float upperLight = smoothstep(0.0, 1.0, vUv.y);
            float energy = 0.28 + centerEnergy * 0.52 + upperLight * 0.14 + uBreath * 0.06;
            vec3 color = mix(uTint * 0.42, uTint, clamp(energy, 0.0, 1.0));
            float alpha = uOpacity * (0.62 + centerEnergy * 0.55 + upperLight * 0.12);
            gl_FragColor = vec4(color, alpha);
            #include <tonemapping_fragment>
            #include <colorspace_fragment>
          }
        `,
                transparent: true,
                depthTest: true,
                depthWrite: false,
                side: THREE.DoubleSide,
                blending: THREE.NormalBlending,
            })

        const membraneSurfaceZ = isCinematicIntro ? 17.2 : 14
        const detailsSurfaceZ = isCinematicIntro ? 23 : 19.8
        const mainFrontZ = isCinematicIntro ? 16 : 13
        const membraneSurfaceGeometry = new THREE.ShapeGeometry(mainShape, 16)
        const membraneSurfaceMaterial = makeEnergySurface(
            new THREE.Color(0x18bdd0), 0.46
        )
        const membraneSurface = new THREE.Mesh(
            membraneSurfaceGeometry,
            membraneSurfaceMaterial
        )
        membraneSurface.position.z = membraneSurfaceZ
        membraneSurface.renderOrder = 4
        frontLayer.add(membraneSurface)
        resources.add(membraneSurface)
        detailMaterials.push(membraneSurfaceMaterial)

        const innerShape = createShieldShape(0.77)
        const innerGeometry = new THREE.ExtrudeGeometry(innerShape, {
            depth: isCinematicIntro ? 5.2 : 4.2,
            bevelEnabled: true,
            bevelSegments: 3,
            steps: 1,
            bevelSize: 0.65,
            bevelThickness: 0.65,
            curveSegments: 12,
        })
        const innerMaterial = new THREE.MeshPhysicalMaterial({
            color: 0x0c738a,
            emissive: 0x00788e,
            emissiveIntensity: 0.3,
            roughness: 0.3,
            metalness: 0,
            clearcoat: 0.65,
            clearcoatRoughness: 0.25,
            transparent: true,
            opacity: 0.24,
            side: THREE.DoubleSide,
            depthWrite: false,
        })
        innerMaterial.userData.baseOpacity = 0.24
        const innerMembrane = new THREE.Mesh(innerGeometry, innerMaterial)
        innerMembrane.position.z = isCinematicIntro ? 19.2 : 15.2
        innerMembrane.renderOrder = 5
        frontLayer.add(innerMembrane)
        resources.add(innerMembrane)
        shellMeshes.push(innerMembrane)
        shieldMaterials.push(innerMaterial)

        const addContour = (
            layer: THREE.Group,
            shape: THREE.Shape,
            z: number,
            color: number,
            radius: number,
            opacity: number,
            materialList: THREE.Material[]
        ) => {
            const points = shape.getPoints(96).map((point) => new THREE.Vector3(point.x, point.y, z))
            const curve = new THREE.CatmullRomCurve3(points, true, 'centripetal')
            const geometry = new THREE.TubeGeometry(curve, 144, radius, 5, true)
            const material = new THREE.MeshBasicMaterial({
                color,
                transparent: true,
                opacity,
                blending: THREE.AdditiveBlending,
                depthWrite: false,
            })
            material.userData.baseOpacity = opacity
            material.userData.introLayer = layer === rearLayer
                ? 'rear'
                : layer === middleLayer
                    ? 'middle'
                    : 'front'
            const mesh = new THREE.Mesh(geometry, material)
            mesh.renderOrder = 6
            layer.add(mesh)
            resources.add(mesh)
            materialList.push(material)
        }

        addContour(rearLayer, rearShape, -12.5, 0x087e9a, 0.1, 0.55, shieldMaterials)
        addContour(middleLayer, middleShape, -1.1, 0x22c9dc, 0.12, 0.7, shieldMaterials)
        addContour(frontLayer, mainShape, mainFrontZ + 1.15, 0x37eaff, 0.16, 0.92, shieldMaterials)

        const insetShape = createShieldShape(0.78)
        const insetMaterial = makeEnergySurface(new THREE.Color(0x43d7e6), 0.2)
        const inset = new THREE.Mesh(
            new THREE.ShapeGeometry(insetShape, 16),
            insetMaterial
        )
        inset.position.z = detailsSurfaceZ
        inset.renderOrder = 7
        frontLayer.add(inset)
        resources.add(inset)
        detailMaterials.push(insetMaterial)
        addContour(frontLayer, insetShape, detailsSurfaceZ + 0.05, 0x29cde0, 0.09, 0.68, detailMaterials)

        const traceDefinitions: number[][][] = [
            [[-22, 19], [-16, 19], [-12, 15], [-12, 9], [-8, 5]],
            [[22, 19], [16, 19], [12, 15], [12, 9], [8, 5]],
            [[-23, 4], [-17, 4], [-13, 0], [-13, -7], [-8, -12]],
            [[23, 4], [17, 4], [13, 0], [13, -7], [8, -12]],
            [[-18, -12], [-14, -16], [-14, -22], [-7, -28]],
            [[18, -12], [14, -16], [14, -22], [7, -28]],
        ]
        const tracePaths = traceDefinitions.map((definition) =>
            definition.map(([x, y]) => new THREE.Vector3(x, y, detailsSurfaceZ + 0.35))
        )
        const traceVertices: THREE.Vector3[] = []
        for (const path of tracePaths) {
            for (let index = 1; index < path.length; index += 1) {
                traceVertices.push(path[index - 1], path[index])
            }
        }
        const traceGeometry = new THREE.BufferGeometry().setFromPoints(traceVertices)
        const traceMaterial = new THREE.LineBasicMaterial({
            color: 0x20cee7,
            transparent: true,
            opacity: 0.7,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
        })
        const traces = new THREE.LineSegments(traceGeometry, traceMaterial)
        traces.renderOrder = 8
        frontLayer.add(traces)
        resources.add(traces)
        detailMaterials.push(traceMaterial)

        const nodeGeometry = new THREE.SphereGeometry(0.62, 10, 8)
        const nodeMaterial = new THREE.MeshBasicMaterial({
            color: 0x71f4ff,
            transparent: true,
            opacity: 0.84,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
        })
        const nodePositions = [
            [-12, 15], [12, 15], [-13, 0], [13, 0], [-14, -16], [14, -16],
        ]
        const junctionMaterials: THREE.MeshBasicMaterial[] = []
        for (const [x, y] of nodePositions) {
            const junctionMaterial = nodeMaterial.clone()
            junctionMaterials.push(junctionMaterial)
            detailMaterials.push(junctionMaterial)
            const node = new THREE.Mesh(nodeGeometry, junctionMaterial)
            node.position.set(x, y, detailsSurfaceZ + 0.55)
            node.renderOrder = 9
            frontLayer.add(node)
            resources.add(node)
        }

        const pulseCount = tracePaths.length
        const pulsePositions = new Float32Array(pulseCount * 3)
        const pulseGeometry = new THREE.BufferGeometry()
        pulseGeometry.setAttribute('position', new THREE.BufferAttribute(pulsePositions, 3))
        const pulseMaterial = new THREE.PointsMaterial({
            color: 0xbafaff,
            size: 2.25,
            sizeAttenuation: true,
            transparent: true,
            opacity: 1,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
        })
        const pulses = new THREE.Points(pulseGeometry, pulseMaterial)
        pulses.renderOrder = 10
        frontLayer.add(pulses)
        resources.add(pulses)
        detailMaterials.push(pulseMaterial)

        const emblemShape = createShieldShape(0.22)
        const emblemGeometry = new THREE.ShapeGeometry(emblemShape, 8)
        const emblemMaterial = new THREE.MeshBasicMaterial({
            color: 0x0c748d,
            transparent: true,
            opacity: 0.74,
            side: THREE.DoubleSide,
            depthWrite: false,
        })
        const emblem = new THREE.Mesh(emblemGeometry, emblemMaterial)
        emblem.position.set(0, 0, detailsSurfaceZ + 0.7)
        emblem.renderOrder = 11
        frontLayer.add(emblem)
        resources.add(emblem)
        detailMaterials.push(emblemMaterial)

        const checkCurve = new THREE.CatmullRomCurve3([
            new THREE.Vector3(-3.1, -0.3, detailsSurfaceZ + 1.3),
            new THREE.Vector3(-1.1, -2.5, detailsSurfaceZ + 1.3),
            new THREE.Vector3(3.4, 2.4, detailsSurfaceZ + 1.3),
        ])
        const checkGeometry = new THREE.TubeGeometry(checkCurve, 24, 0.25, 5, false)
        const checkMaterial = new THREE.MeshBasicMaterial({
            color: 0x9af8ff,
            transparent: true,
            opacity: 0.9,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
        })
        const check = new THREE.Mesh(checkGeometry, checkMaterial)
        check.renderOrder = 12
        frontLayer.add(check)
        resources.add(check)
        detailMaterials.push(checkMaterial)

        const scanGeometry = new THREE.ShapeGeometry(mainShape, 16)
        const scanMaterial = new THREE.ShaderMaterial({
            uniforms: { uScanY: { value: 25 }, uOpacity: { value: 0 } },
            vertexShader: `
        varying float vShieldY;
        void main() {
          vShieldY = position.y;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
            fragmentShader: `
        uniform float uScanY;
        uniform float uOpacity;
        varying float vShieldY;
        void main() {
          float band = exp(-pow((vShieldY - uScanY) * 0.42, 2.0));
          float core = exp(-pow((vShieldY - uScanY) * 1.7, 2.0));
          float alpha = (band * 0.42 + core * 0.48) * uOpacity;
          gl_FragColor = vec4(vec3(0.18, 0.88, 1.0), alpha);
          #include <tonemapping_fragment>
          #include <colorspace_fragment>
        }
      `,
            transparent: true,
            blending: THREE.AdditiveBlending,
            depthTest: true,
            depthWrite: false,
            side: THREE.DoubleSide,
        })
        const scan = new THREE.Mesh(scanGeometry, scanMaterial)
        scan.position.z = detailsSurfaceZ + 1.4
        scan.renderOrder = 13
        frontLayer.add(scan)
        resources.add(scan)
        scanMaterials.push(scanMaterial)

        const scanAuraGeometry = new THREE.ShapeGeometry(mainShape, 16)
        const scanAuraMaterial = new THREE.ShaderMaterial({
            uniforms: { uScanY: { value: 25 }, uOpacity: { value: 0 } },
            vertexShader: `
        varying float vShieldY;
        void main() {
          vShieldY = position.y;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
            fragmentShader: `
        uniform float uScanY;
        uniform float uOpacity;
        varying float vShieldY;
        void main() {
          float band = exp(-pow((vShieldY - uScanY) * 0.12, 2.0));
          gl_FragColor = vec4(vec3(0.04, 0.52, 0.68), band * uOpacity);
          #include <tonemapping_fragment>
          #include <colorspace_fragment>
        }
      `,
            transparent: true,
            blending: THREE.AdditiveBlending,
            depthTest: true,
            depthWrite: false,
            side: THREE.DoubleSide,
        })
        const scanAura = new THREE.Mesh(scanAuraGeometry, scanAuraMaterial)
        scanAura.position.z = detailsSurfaceZ + 1.35
        scanAura.renderOrder = 12
        frontLayer.add(scanAura)
        resources.add(scanAura)
        scanMaterials.push(scanAuraMaterial)

        const glowCanvas = document.createElement('canvas')
        glowCanvas.width = 128
        glowCanvas.height = 128
        const glowContext = glowCanvas.getContext('2d')
        if (glowContext) {
            const gradient = glowContext.createRadialGradient(64, 64, 2, 64, 64, 64)
            gradient.addColorStop(0, 'rgba(20, 204, 224, 0.22)')
            gradient.addColorStop(0.5, 'rgba(7, 103, 144, 0.1)')
            gradient.addColorStop(1, 'rgba(2, 11, 22, 0)')
            glowContext.fillStyle = gradient
            glowContext.fillRect(0, 0, 128, 128)
        }
        const glowTexture = new THREE.CanvasTexture(glowCanvas)
        glowTexture.colorSpace = THREE.SRGBColorSpace
        const glowMaterial = new THREE.SpriteMaterial({
            map: glowTexture,
            color: 0x73efff,
            transparent: true,
            opacity: 0.7,
            depthWrite: false,
            toneMapped: false,
        })
        const glow = new THREE.Sprite(glowMaterial)
        glow.position.set(0, 0, -22)
        glow.scale.set(118, 118, 1)
        shieldGroup.add(glow)
        resources.add(glow)

        const lightShafts: THREE.Mesh[] = []
        const lightShaftMaterials: THREE.ShaderMaterial[] = []
        if (isCinematicIntro) {
            const shaftGeometry = new THREE.PlaneGeometry(18, 112)
            for (const [index, x] of [-30, 0, 30].entries()) {
                const shaftMaterial = new THREE.ShaderMaterial({
                    uniforms: { uOpacity: { value: 0 } },
                    vertexShader: `
            varying vec2 vUv;
            void main() {
              vUv = uv;
              gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
          `,
                    fragmentShader: `
            uniform float uOpacity;
            varying vec2 vUv;
            void main() {
              float center = exp(-pow((vUv.x - 0.5) * 5.2, 2.0));
              float fade = smoothstep(0.0, 0.25, vUv.y) * (1.0 - smoothstep(0.7, 1.0, vUv.y));
              gl_FragColor = vec4(0.08, 0.65, 0.8, center * fade * uOpacity);
              #include <tonemapping_fragment>
              #include <colorspace_fragment>
            }
          `,
                    transparent: true,
                    depthTest: true,
                    depthWrite: false,
                    blending: THREE.AdditiveBlending,
                    side: THREE.DoubleSide,
                })
                const shaft = new THREE.Mesh(shaftGeometry, shaftMaterial)
                shaft.position.set(x, index === 1 ? 0 : 2, -34)
                shaft.rotation.z = index === 0 ? 0.12 : index === 2 ? -0.12 : 0
                shaft.renderOrder = 0
                shieldGroup.add(shaft)
                resources.add(shaft)
                lightShafts.push(shaft)
                lightShaftMaterials.push(shaftMaterial)
            }
        }

        const particleCount = isCinematicIntro ? 96 : 72
        const particlePositions = new Float32Array(particleCount * 3)
        const particleStarts = new Float32Array(particleCount * 3)
        const particleTargets = new Float32Array(particleCount * 3)
        const shieldOutline = mainShape.getPoints(96)
        for (let index = 0; index < particleCount; index += 1) {
            const offset = index * 3
            const angle = index * 2.399963
            const radius = 48 + (index % 5) * 5
            particleStarts[offset] = Math.cos(angle) * radius
            particleStarts[offset + 1] = Math.sin(angle) * radius
            particleStarts[offset + 2] = -12 + ((index % 7) - 3) * 3

            const outlineIndex = (index * 7) % shieldOutline.length
            const target = shieldOutline[outlineIndex]
            particleTargets[offset] = target.x * 1.08
            particleTargets[offset + 1] = target.y * 1.08
            particleTargets[offset + 2] = 4 + ((index % 5) - 2) * 0.8
            particlePositions[offset] = particleStarts[offset]
            particlePositions[offset + 1] = particleStarts[offset + 1]
            particlePositions[offset + 2] = particleStarts[offset + 2]
        }
        const particleGeometry = new THREE.BufferGeometry()
        particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3))
        const particleMaterial = new THREE.PointsMaterial({
            color: 0x35dcf1,
            size: 1.65,
            sizeAttenuation: true,
            transparent: true,
            opacity: 0.55,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
        })
        const particles = new THREE.Points(particleGeometry, particleMaterial)
        particles.renderOrder = 1
        shieldGroup.add(particles)
        resources.add(particles)

        const energyTrailPath = mainShape.getPoints(128).map(
            (point) => new THREE.Vector3(point.x, point.y, mainFrontZ + 0.45)
        )
        const energyTrailPositions = new Float32Array(4 * 3)
        const energyTrailGeometry = new THREE.BufferGeometry()
        energyTrailGeometry.setAttribute(
            'position',
            new THREE.BufferAttribute(energyTrailPositions, 3)
        )
        const energyTrailMaterial = new THREE.PointsMaterial({
            color: 0x9bfaff,
            size: 2.6,
            sizeAttenuation: true,
            transparent: true,
            opacity: 0.9,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
        })
        const energyTrails = new THREE.Points(energyTrailGeometry, energyTrailMaterial)
        energyTrails.renderOrder = 14
        frontLayer.add(energyTrails)
        resources.add(energyTrails)
        detailMaterials.push(energyTrailMaterial)

        let animationFrame = 0
        let elapsed = 0
        let lastFrameTime = performance.now()
        let didRender = false
        const drawFrame = (timestamp: number) => {
            const delta = Math.min(Math.max((timestamp - lastFrameTime) / 1000, 0), 0.05)
            lastFrameTime = timestamp
            if (!motionPreferenceRef.current) elapsed += delta

            const introTime = progressRef.current * 4000
            const isStatic = motionPreferenceRef.current
            const assembly = mode === 'intro'
                ? isStatic ? 1 : smoothStep(600, 1500, introTime)
                : 1
            const rearAssembly = isCinematicIntro
                ? isStatic ? 1 : smoothStep(600, 1120, introTime)
                : assembly
            const middleAssembly = isCinematicIntro
                ? isStatic ? 1 : smoothStep(820, 1340, introTime)
                : assembly
            const frontAssembly = isCinematicIntro
                ? isStatic ? 1 : smoothStep(1060, 1500, introTime)
                : assembly
            const details = mode === 'intro'
                ? isStatic ? 1 : smoothStep(1500, 2400, introTime)
                : 1
            const scanReveal = mode === 'intro'
                ? isStatic ? 0 : smoothStep(2400, 2520, introTime) * (1 - smoothStep(3200, 3350, introTime))
                : 0.7
            const scanProgress = mode === 'intro'
                ? smoothStep(2400, 3200, introTime)
                : 0
            const stagedAssembly = isCinematicIntro && !isStatic

            const rotationBase = mode === 'hero' ? 0.58 : isCinematicIntro ? 0.46 : 0.48
            const rotationAmplitude = mode === 'hero' ? 0.13 : isCinematicIntro ? 0.2 : 0.16
            shieldGroup.rotation.y = isStatic
                ? rotationBase
                : rotationBase + Math.sin(elapsed * (mode === 'hero' ? 0.28 : 0.42)) * rotationAmplitude
            shieldGroup.rotation.x = isStatic
                ? isCinematicIntro ? -0.06 : 0
                : Math.sin(elapsed * (isCinematicIntro ? 0.34 : 0.28)) *
                (isCinematicIntro ? 0.075 : 0.045)
            shieldGroup.rotation.z = isStatic ? 0 : Math.sin(elapsed * 0.19) * 0.018
            shieldGroup.position.y = isStatic ? 0 : Math.sin(elapsed * 0.7) * (mode === 'hero' ? 0.8 : 0.45)

            rearLayer.position.x = isCinematicIntro
                ? isStatic ? -2 : THREE.MathUtils.lerp(-17, -2, rearAssembly) + Math.sin(elapsed * 0.42) * 0.65
                : isStatic ? -2 : -2 + Math.sin(elapsed * 0.48) * 1.2
            rearLayer.position.y = isCinematicIntro
                ? isStatic ? -0.6 : THREE.MathUtils.lerp(-4, -0.6, rearAssembly)
                : isStatic ? -0.6 : -0.6 + Math.sin(elapsed * 0.36) * 0.42
            rearLayer.position.z = isCinematicIntro && stagedAssembly
                ? THREE.MathUtils.lerp(-16, 0, rearAssembly)
                : 0

            middleLayer.position.x = isCinematicIntro
                ? isStatic ? 1.1 : THREE.MathUtils.lerp(15, 1.1, middleAssembly) - Math.sin(elapsed * 0.42) * 0.35
                : isStatic ? 1.1 : 1.1 - Math.sin(elapsed * 0.48) * 0.68
            middleLayer.position.y = isCinematicIntro && !isStatic
                ? THREE.MathUtils.lerp(2, 0, middleAssembly)
                : 0
            middleLayer.position.z = isCinematicIntro && stagedAssembly
                ? THREE.MathUtils.lerp(-9, 0, middleAssembly)
                : 0

            frontLayer.position.x = isCinematicIntro && stagedAssembly
                ? THREE.MathUtils.lerp(-1, 0, frontAssembly) + Math.sin(elapsed * 0.42) * 0.16
                : isStatic ? 0 : Math.sin(elapsed * 0.48) * 0.3
            frontLayer.position.z = isCinematicIntro && stagedAssembly
                ? THREE.MathUtils.lerp(18, 0, frontAssembly)
                : 0
            const frontScale = isCinematicIntro && stagedAssembly
                ? THREE.MathUtils.lerp(0.76, 1, frontAssembly)
                : 1
            frontLayer.scale.setScalar(frontScale)

            shieldMaterials.forEach((material) => {
                const introLayer = material.userData.introLayer as string | undefined
                const layerReveal = introLayer === 'rear'
                    ? rearAssembly
                    : introLayer === 'middle'
                        ? middleAssembly
                        : frontAssembly
                material.opacity = (material.userData.baseOpacity as number) *
                    (mode === 'intro' ? 0.08 + layerReveal * 0.92 : 1)
            })
            membraneSurfaceMaterial.uniforms.uOpacity.value =
                0.46 * (isCinematicIntro ? 0.08 + frontAssembly * 0.92 : mode === 'intro' ? 0.2 + assembly * 0.8 : 1)
            insetMaterial.uniforms.uOpacity.value = 0.2 * (isStatic ? 1 : details)
            detailMaterials.forEach((material) => {
                const initialOpacity = material.userData.initialOpacity as number | undefined
                if (initialOpacity === undefined) {
                    material.userData.initialOpacity = material.opacity
                }
                material.opacity = (material.userData.initialOpacity as number) * (isStatic ? 1 : details)
            })
            const scanOpacity = isStatic
                ? 0
                : scanReveal * (mode === 'hero' ? 0.72 + Math.sin(elapsed * 1.1) * 0.12 : 0.86)
            const scanY = mode === 'intro'
                ? THREE.MathUtils.lerp(25, -25, scanProgress)
                : Math.sin(elapsed * 0.52) * 22
            for (const material of scanMaterials) {
                const shader = material as THREE.ShaderMaterial
                shader.uniforms.uScanY.value = scanY
            }
            ; (scanMaterial as THREE.ShaderMaterial).uniforms.uOpacity.value = scanOpacity
                ; (scanAuraMaterial as THREE.ShaderMaterial).uniforms.uOpacity.value = scanOpacity * 0.24
            const shaftReveal = isCinematicIntro && !isStatic
                ? smoothStep(600, 1500, introTime) * (1 - smoothStep(3200, 3550, introTime))
                : 0
            lightShaftMaterials.forEach((material, index) => {
                material.uniforms.uOpacity.value = shaftReveal * (index === 1 ? 0.16 : 0.1)
            })

            const breath = isStatic ? 0 : (Math.sin(elapsed * 1.15) + 1) * 0.5
            membraneSurfaceMaterial.uniforms.uBreath.value = breath
            insetMaterial.uniforms.uBreath.value = breath * 0.75
            innerMaterial.emissiveIntensity = 0.25 + breath * 0.16
            glowMaterial.opacity = 0.52 + breath * 0.16
            glow.scale.setScalar(114 + breath * 6)
            junctionMaterials.forEach((material, index) => {
                const pulse = isStatic
                    ? 0
                    : Math.pow(Math.max(0, Math.sin(elapsed * 1.45 - index * 0.95)), 12)
                material.opacity = 0.62 + breath * 0.1 + pulse * 0.28
            })

            const particleAttribute = particleGeometry.getAttribute('position') as THREE.BufferAttribute
            const particleAssembly = isCinematicIntro
                ? isStatic ? 1 : smoothStep(0, 1500, introTime)
                : mode === 'intro' ? assembly : 1
            for (let index = 0; index < particleCount; index += 1) {
                const offset = index * 3
                const drift = isStatic ? 0 : Math.sin(elapsed * 0.8 + index) * 0.45
                const blend = particleAssembly
                particlePositions[offset] = THREE.MathUtils.lerp(
                    particleStarts[offset],
                    particleTargets[offset],
                    blend
                ) + drift
                particlePositions[offset + 1] = THREE.MathUtils.lerp(
                    particleStarts[offset + 1],
                    particleTargets[offset + 1],
                    blend
                ) + (isStatic ? 0 : Math.cos(elapsed * 0.65 + index * 0.7) * 0.45)
                particlePositions[offset + 2] = THREE.MathUtils.lerp(
                    particleStarts[offset + 2],
                    particleTargets[offset + 2],
                    blend
                )
            }
            particleAttribute.needsUpdate = true
            particleMaterial.opacity = isCinematicIntro
                ? isStatic ? 0.28 : 0.08 + (1 - smoothStep(1350, 1950, introTime)) * 0.42
                : mode === 'intro' ? 0.42 + assembly * 0.2 : 0.46
            for (let index = 0; index < pulseCount; index += 1) {
                const position = getPointOnPath(
                    tracePaths[index],
                    (elapsed * 0.32 + index / pulseCount) % 1
                )
                const offset = index * 3
                pulsePositions[offset] = position.x
                pulsePositions[offset + 1] = position.y
                pulsePositions[offset + 2] = position.z
            }
            ; (pulseGeometry.getAttribute('position') as THREE.BufferAttribute).needsUpdate = true
            pulseMaterial.opacity = details * (isStatic ? 0 : 0.95)
            for (let index = 0; index < 4; index += 1) {
                const position = getPointOnPath(
                    energyTrailPath,
                    (elapsed * 0.055 + index / 4) % 1
                )
                const offset = index * 3
                energyTrailPositions[offset] = position.x
                energyTrailPositions[offset + 1] = position.y
                energyTrailPositions[offset + 2] = position.z
            }
            ; (energyTrailGeometry.getAttribute('position') as THREE.BufferAttribute).needsUpdate = true
            energyTrailMaterial.opacity = details * (0.55 + breath * 0.3)

            renderer.render(scene, camera)
            if (!didRender) {
                didRender = true
                setIsRendered(true)
            }
        }

        const animate = (timestamp: number) => {
            drawFrame(timestamp)
            if (!motionPreferenceRef.current && document.visibilityState === 'visible') {
                animationFrame = requestAnimationFrame(animate)
            }
        }

        const renderStatic = () => {
            if (animationFrame) cancelAnimationFrame(animationFrame)
            animationFrame = 0
            lastFrameTime = performance.now()
            drawFrame(lastFrameTime)
        }

        const handleVisibilityChange = () => {
            if (document.visibilityState === 'hidden') {
                if (animationFrame) cancelAnimationFrame(animationFrame)
                animationFrame = 0
            } else if (!motionPreferenceRef.current && !animationFrame) {
                lastFrameTime = performance.now()
                animationFrame = requestAnimationFrame(animate)
            }
        }

        const handleMotionChange = () => {
            if (motionPreferenceRef.current) {
                renderStatic()
            } else if (!animationFrame && document.visibilityState === 'visible') {
                lastFrameTime = performance.now()
                animationFrame = requestAnimationFrame(animate)
            }
        }
        mediaQuery.addEventListener('change', handleMotionChange)
        document.addEventListener('visibilitychange', handleVisibilityChange)

        const resizeObserver = new ResizeObserver(() => {
            const nextWidth = container.clientWidth
            const nextHeight = container.clientHeight
            if (!nextWidth || !nextHeight) return
            camera.aspect = nextWidth / nextHeight
            camera.fov = cameraFov(camera.aspect)
            camera.updateProjectionMatrix()
            renderer.setSize(nextWidth, nextHeight)
            if (motionPreferenceRef.current) renderStatic()
        })
        resizeObserver.observe(container)

        const handleContextLost = (event: Event) => {
            event.preventDefault()
            if (animationFrame) cancelAnimationFrame(animationFrame)
            animationFrame = 0
            setIsRendered(false)
        }
        renderer.domElement.addEventListener('webglcontextlost', handleContextLost)

        if (motionPreferenceRef.current) {
            renderStatic()
        } else {
            animationFrame = requestAnimationFrame(animate)
        }

        return () => {
            if (animationFrame) cancelAnimationFrame(animationFrame)
            resizeObserver.disconnect()
            document.removeEventListener('visibilitychange', handleVisibilityChange)
            mediaQuery.removeEventListener('change', updateMotionPreference)
            mediaQuery.removeEventListener('change', handleMotionChange)
            renderer.domElement.removeEventListener('webglcontextlost', handleContextLost)

            const geometries = new Set<THREE.BufferGeometry>()
            const materials = new Set<THREE.Material>()
            const textures = new Set<THREE.Texture>()
            for (const object of resources) {
                if ('geometry' in object && object.geometry instanceof THREE.BufferGeometry) {
                    geometries.add(object.geometry)
                }
                if ('material' in object) {
                    const objectMaterials = Array.isArray(object.material) ? object.material : [object.material]
                    for (const material of objectMaterials) {
                        materials.add(material)
                        for (const value of Object.values(material)) {
                            if (value instanceof THREE.Texture) textures.add(value)
                        }
                    }
                }
            }
            geometries.forEach((geometry) => geometry.dispose())
            textures.forEach((texture) => texture.dispose())
            materials.forEach((material) => material.dispose())
            renderer.dispose()
            if (renderer.domElement.parentNode === container) {
                container.removeChild(renderer.domElement)
            }
        }
    }, [active, isCinematicIntro, mode, presentation, reducedMotion])

    return (
        <div
            ref={containerRef}
            className={`relative isolate h-full w-full overflow-hidden ${className}`}
            role="img"
            aria-label="A luminous cyan holographic energy shield with layered surfaces and digital circuit signals"
        >
            <div
                aria-hidden="true"
                className={`pointer-events-none absolute left-1/2 top-1/2 aspect-[0.82] w-[min(54vw,250px)] -translate-x-1/2 -translate-y-1/2 transition-opacity duration-300 ${isRendered ? 'opacity-0' : 'opacity-100'
                    }`}
                style={{
                    clipPath: 'polygon(50% 0%, 92% 15%, 88% 48%, 77% 73%, 50% 100%, 23% 73%, 12% 48%, 8% 15%)',
                    background: 'linear-gradient(145deg, rgba(64,237,255,.75), rgba(9,109,146,.35) 55%, rgba(21,213,233,.7))',
                    filter: 'drop-shadow(0 0 16px rgba(34,211,238,.45))',
                }}
            >
                <div
                    className="absolute inset-[3px] bg-[#071a2b]/90"
                    style={{
                        clipPath: 'polygon(50% 0%, 92% 15%, 88% 48%, 77% 73%, 50% 100%, 23% 73%, 12% 48%, 8% 15%)',
                    }}
                />
                <div className="absolute left-1/2 top-[48%] h-[2px] w-8 -translate-x-1/2 rotate-[-42deg] rounded-full bg-cyan-100 shadow-[0_0_10px_#22d3ee]" />
            </div>
        </div>
    )
}
