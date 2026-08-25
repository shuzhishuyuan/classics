import { Html } from '@react-three/drei'
import type { HotspotId } from './YueluArchitecture'

function Shelf({ position }: { position: [number, number, number] }) {
  return <group position={position}>
    <mesh position={[0, 2.1, 0]}><boxGeometry args={[3.4, 4.2, 0.35]} /><meshStandardMaterial color="#30251f" roughness={0.75} /></mesh>
    {[-1.35, -0.45, 0.45, 1.35].map((x) => <mesh key={x} position={[x, 2.1, -0.22]}><boxGeometry args={[0.62, 3.55, 0.08]} /><meshStandardMaterial color="#5b392d" roughness={0.7} /></mesh>)}
    {[0.75, 1.55, 2.35, 3.15].map((y) => <mesh key={y} position={[0, y, -0.25]}><boxGeometry args={[3.1, 0.08, 0.42]} /><meshStandardMaterial color="#8b6945" roughness={0.75} /></mesh>)}
    {Array.from({ length: 18 }).map((_, i) => <mesh key={i} position={[-1.15 + (i % 6) * 0.46, 0.95 + Math.floor(i / 6) * 0.78, -0.34]}><boxGeometry args={[0.28, 0.58, 0.16]} /><meshStandardMaterial color={i % 3 === 0 ? '#b07a52' : '#375247'} roughness={0.9} /></mesh>)}
  </group>
}

function Table({ position }: { position: [number, number, number] }) {
  return <group position={position}>
    <mesh position={[0, 1.45, 0]} castShadow><boxGeometry args={[4.2, 0.16, 1.65]} /><meshStandardMaterial color="#9b6a42" metalness={0.15} roughness={0.45} /></mesh>
    {[[-1.65, 0.7, -0.55], [1.65, 0.7, -0.55], [-1.65, 0.7, 0.55], [1.65, 0.7, 0.55]].map(([x, y, z], i) => <mesh key={i} position={[x, y, z]}><boxGeometry args={[0.12, 1.4, 0.12]} /><meshStandardMaterial color="#5d402b" /></mesh>)}
    <mesh position={[0, 1.62, 0]}><boxGeometry args={[1.3, 0.05, 0.8]} /><meshStandardMaterial color="#d8c49a" roughness={0.9} /></mesh>
  </group>
}

function DocumentWall({ position }: { position: [number, number, number] }) {
  return <group position={position}>
    <mesh><planeGeometry args={[5.1, 5.8]} /><meshBasicMaterial color="#f0eee6" /></mesh>
    <Html transform position={[0, 0, 0.02]} distanceFactor={5.3} style={{ width: '430px', pointerEvents: 'none' }}>
      <div className="immersive3d-document">
        <span>岳麓书院 · 数字文献</span><h3>惟楚有材，于斯为盛</h3>
        <p>书院是教化之所。讲学、藏书、祭祀与游息，皆在一院之中，山水与人文相互成就。</p>
        <p>千年学府，弦歌不绝。此处收录书院沿革、讲学制度与经典文献，点击空间节点进入对应学习内容。</p>
        <small>DOCUMENT 01 / DIGITAL ARCHIVE</small>
      </div>
    </Html>
  </group>
}

function Hotspot({ position, label, hint, id, onSelect }: { position: [number, number, number]; label: string; hint: string; id: HotspotId; onSelect?: (id: HotspotId) => void }) {
  return <Html position={position} center distanceFactor={7}><button className="immersive3d-scene-hotspot" onClick={() => onSelect?.(id)}><strong>{label}</strong><span>{hint}</span></button></Html>
}

export function VirtualLibrary({ onSelect }: { onSelect?: (id: HotspotId) => void }) {
  return <group scale={2}>
    <mesh position={[0, -0.2, 0]} receiveShadow><boxGeometry args={[18, 0.3, 14]} /><meshStandardMaterial color="#59645d" roughness={0.88} /></mesh>
    <mesh position={[0, 4, -5]}><boxGeometry args={[18, 8, 0.25]} /><meshStandardMaterial color="#263b38" roughness={0.92} /></mesh>
    <mesh position={[-8.8, 4, 0]}><boxGeometry args={[0.25, 8, 10]} /><meshStandardMaterial color="#304740" roughness={0.92} /></mesh>
    <mesh position={[8.8, 4, 0]}><boxGeometry args={[0.25, 8, 10]} /><meshStandardMaterial color="#304740" roughness={0.92} /></mesh>
    <Shelf position={[-6.3, 0, -4.4]} /><Shelf position={[-6.3, 0, -0.2]} /><Table position={[-1.7, 0, 0.5]} /><DocumentWall position={[3.7, 3.1, -4.7]} />
    {[-2.2, 1.2, 6.1].map((x) => <group key={x} position={[x, 1.4, -4.75]}><mesh><boxGeometry args={[0.025, 4.8, 0.025]} /><meshBasicMaterial color="#ffd75e" /></mesh><pointLight color="#ffd75e" intensity={3} distance={4} /></group>)}
    <pointLight position={[3.1, 3.2, -2.2]} color="#d9ffff" intensity={16} distance={7} />
    <Hotspot position={[-6.2, 2.4, -4]} label="藏书阁" hint="进入典籍阅读" id="library" onSelect={onSelect} />
    <Hotspot position={[0, 2.1, -4.4]} label="讲堂" hint="进入会讲空间" id="hall" onSelect={onSelect} />
    <Hotspot position={[3.2, 2.4, -4.35]} label="碑廊" hint="查看书院沿革" id="stele" onSelect={onSelect} />
  </group>
}
