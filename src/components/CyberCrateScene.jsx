import React, { useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { RoundedBox, MeshReflectorMaterial } from '@react-three/drei'
import * as THREE from 'three'

function CircuitGrid({ size = 1.6 }) {
  // Generates cyan "circuit traces" across each face, not just edges
  const geom = useMemo(() => {
    const g = new THREE.BufferGeometry()
    const lines = []
    const half = size / 2
    const inset = 0.02
    const step = 0.2

    function addLine(a, b) {
      lines.push(a.x, a.y, a.z, b.x, b.y, b.z)
    }

    // For each principal plane, lay a grid plus some diagonals
    const faces = [
      { n: new THREE.Vector3(1, 0, 0), u: 'y', v: 'z' }, // +X/-X faces
      { n: new THREE.Vector3(0, 1, 0), u: 'x', v: 'z' }, // +Y/-Y
      { n: new THREE.Vector3(0, 0, 1), u: 'x', v: 'y' }, // +Z/-Z
    ]

    const range = (from, to, stp) => {
      const out = []
      for (let v = from; v <= to + 1e-6; v += stp) out.push(parseFloat(v.toFixed(4)))
      return out
    }

    const drawFace = (axis, sign) => {
      const uvs = faces.find((f) => f.n.getComponent(['x', 'y', 'z'].indexOf(axis)) === 1)
      const planeU = uvs.u
      const planeV = uvs.v
      const fixed = sign * half
      const span = range(-half + inset, half - inset, step)

      // Grid lines parallel to U
      span.forEach((v) => {
        const a = new THREE.Vector3()
        const b = new THREE.Vector3()
        a[axis] = fixed
        b[axis] = fixed
        a[planeU] = -half + inset
        b[planeU] = half - inset
        a[planeV] = v
        b[planeV] = v
        addLine(a, b)
      })
      // Grid lines parallel to V
      span.forEach((u) => {
        const a = new THREE.Vector3()
        const b = new THREE.Vector3()
        a[axis] = fixed
        b[axis] = fixed
        a[planeV] = -half + inset
        b[planeV] = half - inset
        a[planeU] = u
        b[planeU] = u
        addLine(a, b)
      })
      // Diagonal details
      const diag = range(-half + inset, half - inset, step * 2)
      diag.forEach((t) => {
        const a = new THREE.Vector3()
        const b = new THREE.Vector3()
        a[axis] = fixed
        b[axis] = fixed
        a[planeU] = -half + inset
        a[planeV] = t
        b[planeU] = t
        b[planeV] = -half + inset
        addLine(a, b)
      })
    }

    // + and - for each axis
    ;[['x', 1], ['x', -1], ['y', 1], ['y', -1], ['z', 1], ['z', -1]].forEach(([axis, s]) => drawFace(axis, s))

    const positions = new Float32Array(lines)
    g.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    return g
  }, [size])

  return (
    <lineSegments position={[0, 0, 0]}>
      <primitive object={geom} attach="geometry" />
      <lineBasicMaterial
        color="#00ffff"
        transparent
        opacity={0.9}
        blending={THREE.AdditiveBlending}
      />
    </lineSegments>
  )
}

function CyberCrate({ reduced = false, progress = 0 }) {
  const group = useRef()

  useFrame((state) => {
    if (!group.current) return

    const p = THREE.MathUtils.clamp(progress, 0, 1)
    const startScale = 1.5
    const endScale = 1.0
    const scale = THREE.MathUtils.lerp(startScale, endScale, p)

    const startPos = new THREE.Vector3(0, 0.1, 0)
    const endPos = new THREE.Vector3(1.2, 0.1, 0) // move right
    const pos = startPos.lerp(endPos, p)

    const startRot = new THREE.Euler(0, 0, 0)
    const endRot = new THREE.Euler(Math.PI / 4, Math.PI / 4, 0)

    group.current.scale.setScalar(scale)
    group.current.position.copy(pos)

    if (reduced) {
      group.current.rotation.copy(endRot)
    } else {
      // smooth approach to target + subtle idle spin at load
      const t = state.clock.elapsedTime
      const idle = p < 0.02 ? 0.2 : 0
      group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, endRot.x + idle * Math.sin(t * 0.6), 0.08)
      group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, endRot.y + idle * Math.cos(t * 0.6), 0.08)
    }
  })

  return (
    <group ref={group}>
      {/* Outer shell: rounded, glossy, semi-transparent */}
      <RoundedBox args={[1.6, 1.6, 1.6]} radius={0.12} smoothness={6} castShadow receiveShadow>
        <meshPhysicalMaterial
          color="#050505"
          roughness={0.1}
          metalness={0.8}
          transmission={0.2}
          thickness={0.6}
          envMapIntensity={1.2}
        />
      </RoundedBox>

      {/* Cyan circuit grid overlay (slightly larger than shell) */}
      <group scale={[1.01, 1.01, 1.01]}>
        <CircuitGrid size={1.6} />
        {/* Bright edges for pop */}
        <lineSegments>
          <edgesGeometry args={[new THREE.BoxGeometry(1.6, 1.6, 1.6)]} />
          <lineBasicMaterial color="#00ffff" transparent opacity={1} blending={THREE.AdditiveBlending} />
        </lineSegments>
      </group>

      {/* Inner cargo parcels */}
      <group>
        {[
          [-0.35, -0.2, -0.25, 0.5],
          [0.25, 0.15, -0.15, 0.4],
          [0.1, -0.25, 0.35, 0.45],
        ].map(([x, y, z, s], i) => (
          <mesh key={i} position={[x, y, z]} castShadow>
            <boxGeometry args={[s, s * 0.7, s * 0.8]} />
            <meshStandardMaterial color="#ffaa00" emissive="#ff4400" emissiveIntensity={1.0} roughness={0.5} metalness={0.2} />
          </mesh>
        ))}
      </group>
    </group>
  )
}

function SceneContents({ reduced = false, progress = 0 }) {
  return (
    <>
      {/* Background and atmosphere */}
      <color attach="background" args={["#050505"]} />
      <fog attach="fog" args={["#050505", 8, 25]} />

      {/* Lighting: cinematic */}
      {/* Key light from top-left */}
      <spotLight position={[-4, 6, 3]} angle={0.5} penumbra={0.7} intensity={2} color={"#e6f0ff"} castShadow />
      {/* Fill light inside crate */}
      <pointLight position={[0, 0, 0]} intensity={1} color={"#ff7a00"} distance={6} />
      {/* Cyan rim from behind/right */}
      <spotLight position={[5, 2, -4]} angle={0.4} penumbra={1} intensity={5} color={"#00ffff"} castShadow />

      {/* Subtle ambient */}
      <ambientLight intensity={0.1} />

      {/* Reflective floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 0]} receiveShadow>
        <planeGeometry args={[40, 40]} />
        <MeshReflectorMaterial
          mirror={0.6}
          color="#070707"
          metalness={0.6}
          roughness={0.4}
          blur={[300, 100]}
          mixBlur={1}
          mixStrength={8}
          resolution={1024}
          depthScale={0.5}
          minDepthThreshold={0.8}
          maxDepthThreshold={1.0}
        />
      </mesh>

      <CyberCrate reduced={reduced} progress={progress} />
    </>
  )
}

export default function CyberCrateScene({ reduced = false, progress = 0 }) {
  return (
    <Canvas
      shadows
      camera={{ position: [3.2, 2.1, 4.2], fov: 45 }}
      gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
      dpr={[1, 1.8]}
      frameloop={reduced ? 'demand' : 'always'}
      style={{ width: '100%', height: '100%' }}
    >
      <SceneContents reduced={reduced} progress={progress} />
    </Canvas>
  )
}
