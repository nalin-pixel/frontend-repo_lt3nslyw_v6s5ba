import React, { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

function CyberCrate({ reduced = false }) {
  const group = useRef()

  useFrame((state, delta) => {
    if (reduced || !group.current) return
    group.current.rotation.y += delta * 0.25
    group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, Math.sin(state.clock.elapsedTime * 0.2) * 0.1, 0.05)
  })

  return (
    <group ref={group} position={[0, 0.2, 0]}>
      {/* Base physical crate */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[1.6, 1.6, 1.6]} />
        <meshStandardMaterial
          color="#3b2f2f"
          roughness={0.6}
          metalness={0.05}
        />
      </mesh>

      {/* Slightly larger wireframe cyber grid */}
      <mesh scale={[1.01, 1.01, 1.01]}>
        <boxGeometry args={[1.6, 1.6, 1.6]} />
        {/* Use MeshStandard to allow emissive with wireframe */}
        <meshStandardMaterial
          color="#00ffff"
          emissive="#00e5ff"
          emissiveIntensity={1.5}
          wireframe
          transparent
          opacity={0.8}
        />
      </mesh>

      {/* Neon edges for extra definition */}
      <lineSegments>
        <edgesGeometry args={[new THREE.BoxGeometry(1.6, 1.6, 1.6)]} />
        <lineBasicMaterial color="#7ffcff" linewidth={2} transparent opacity={0.9} />
      </lineSegments>
    </group>
  )
}

function SceneContents({ reduced = false }) {
  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.35} />
      <directionalLight position={[3, 5, 4]} intensity={1.0} color={new THREE.Color('#9ae6ff')} castShadow />
      <directionalLight position={[-3, 2, -2]} intensity={0.3} color={new THREE.Color('#00e5ff')} />

      {/* Ground subtle receiver */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.65, 0]} receiveShadow>
        <planeGeometry args={[10, 10]} />
        <meshStandardMaterial color="#0b1220" roughness={0.9} metalness={0.0} />
      </mesh>

      <CyberCrate reduced={reduced} />
    </>
  )
}

export default function CyberCrateScene({ reduced = false }) {
  return (
    <Canvas
      shadows
      camera={{ position: [2.8, 1.8, 3.2], fov: 45 }}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      dpr={[1, 1.8]}
      frameloop={reduced ? 'demand' : 'always'}
      style={{ width: '100%', height: '100%' }}
    >
      <color attach="background" args={[new THREE.Color('transparent')]} />
      <SceneContents reduced={reduced} />
    </Canvas>
  )
}
