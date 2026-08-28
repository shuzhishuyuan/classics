import { Html } from '@react-three/drei'
import type { ThreeEvent } from '@react-three/fiber'

export type HotspotId = 'gate' | 'hall' | 'library' | 'stele'

export type Hotspot = {
  id: HotspotId
  title: string
  subtitle: string
  description: string
  path: string
}

export const hotspots: Record<HotspotId, Hotspot> = {
  gate: { id: 'gate', title: '岳麓书院山门', subtitle: '惟楚有材，于斯为盛', description: '穿过山门，进入沿中轴线展开的岳麓书院院落。', path: '/resources' },
  hall: { id: 'hall', title: '讲堂', subtitle: '经典讲学与朱张会讲', description: '在讲堂中连接经典讲解、AI 助学和会讲互动。', path: '/discussion' },
  library: { id: 'library', title: '御书楼', subtitle: '藏书与典籍阅读', description: '从藏书楼进入现有典籍资源库，继续阅读经典。', path: '/classics' },
  stele: { id: 'stele', title: '碑廊', subtitle: '书院历史与人物', description: '查看岳麓书院历史、人物和湖湘文化知识。', path: '/resources' },
}

function Roof({ width = 4, depth = 2.5, y = 3, color = '#25201b' }: { width?: number; depth?: number; y?: number; color?: string }) {
  return <mesh position={[0, y, 0]} rotation={[0, Math.PI / 4, 0]} castShadow><coneGeometry args={[Math.max(width, depth) * 0.72, 1.1, 4]} /><meshStandardMaterial color={color} roughness={0.82} /></mesh>
}

function Column({ position }: { position: [number, number, number] }) {
  return <mesh position={position} castShadow><cylinderGeometry args={[0.13, 0.17, 2.8, 8]} /><meshStandardMaterial color="#3b2419" roughness={0.72} /></mesh>
}

function Building({ position, width = 4, depth = 2.5, color = '#d2c3a8', roofColor = '#29231e', hotspot, onSelect }: { position: [number, number, number]; width?: number; depth?: number; color?: string; roofColor?: string; hotspot?: HotspotId; onSelect?: (id: HotspotId) => void }) {
  const click = (event: ThreeEvent<MouseEvent>) => { event.stopPropagation(); if (hotspot && onSelect) onSelect(hotspot) }
  return (
    <group position={position} onClick={click}>
      <mesh position={[0, 1.35, 0]} castShadow><boxGeometry args={[width, 2.5, depth]} /><meshStandardMaterial color={color} roughness={0.86} /></mesh>
      <Roof width={width} depth={depth} color={roofColor} />
      <Column position={[-width / 2 + 0.35, 1.4, -depth / 2 - 0.04]} />
      <Column position={[width / 2 - 0.35, 1.4, -depth / 2 - 0.04]} />
      <mesh position={[0, 1.25, -depth / 2 - 0.06]}><boxGeometry args={[1.05, 1.6, 0.08]} /><meshStandardMaterial color="#4a2a1b" /></mesh>
    </group>
  )
}

export function YueluGate({ onSelect }: { onSelect: (id: HotspotId) => void }) {
  return (
    <group position={[0, 0, -4]} onClick={() => onSelect('gate')}>
      <mesh position={[-2, 1.8, 0]} castShadow><boxGeometry args={[0.55, 3.6, 0.7]} /><meshStandardMaterial color="#382217" roughness={0.7} /></mesh>
      <mesh position={[2, 1.8, 0]} castShadow><boxGeometry args={[0.55, 3.6, 0.7]} /><meshStandardMaterial color="#382217" roughness={0.7} /></mesh>
      <mesh position={[0, 3.25, 0]} castShadow><boxGeometry args={[4.7, 0.55, 0.85]} /><meshStandardMaterial color="#4b2a1b" roughness={0.7} /></mesh>
      <mesh position={[0, 4, 0]} rotation={[0, Math.PI / 4, 0]} castShadow><coneGeometry args={[2.7, 1, 4]} /><meshStandardMaterial color="#22201c" roughness={0.82} /></mesh>
      <mesh position={[0, 3.35, -0.48]}><boxGeometry args={[1.65, 0.42, 0.06]} /><meshStandardMaterial color="#c99c52" /></mesh>
    </group>
  )
}

export function YueluArchitecture({ onSelect }: { onSelect: (id: HotspotId) => void }) {
  return (
    <group>
      <YueluGate onSelect={onSelect} />
      <Building position={[0, 0, -8]} width={5.2} depth={2.8} hotspot="hall" onSelect={onSelect} />
      <Building position={[0, 0, -13]} width={4.2} depth={2.6} color="#c7b895" hotspot="library" onSelect={onSelect} />
      <group position={[3.3, 0, -9]} onClick={() => onSelect('stele')}>
        {[0, 1, 2, 3].map((i) => <mesh key={i} position={[0, 1.15, i * 0.75]} castShadow><boxGeometry args={[0.14, 2.3, 0.48]} /><meshStandardMaterial color="#6b6d63" roughness={0.9} /></mesh>)}
      </group>
      <mesh position={[0, 0.2, -9.6]}><boxGeometry args={[0.4, 0.2, 10]} /><meshStandardMaterial color="#aa9a7c" /></mesh>
      <mesh position={[-2.9, 1.15, -9.6]}><boxGeometry args={[0.15, 2.3, 10]} /><meshStandardMaterial color="#c9baa0" /></mesh>
      <mesh position={[2.9, 1.15, -9.6]}><boxGeometry args={[0.15, 2.3, 10]} /><meshStandardMaterial color="#c9baa0" /></mesh>
    </group>
  )
}

export function YueluHotspot({ id, position, onSelect }: { id: HotspotId; position: [number, number, number]; onSelect: (id: HotspotId) => void }) {
  return <group position={position} onClick={(event) => { event.stopPropagation(); onSelect(id) }}><mesh><sphereGeometry args={[0.16, 16, 16]} /><meshStandardMaterial color="#d7a351" emissive="#9e5b1b" emissiveIntensity={1.8} /></mesh><Html distanceFactor={8} center><span className="immersive3d-hotspot">探索</span></Html></group>
}
