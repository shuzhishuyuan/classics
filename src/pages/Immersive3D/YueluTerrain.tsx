import { Float } from '@react-three/drei'

export function YueluTerrain() {
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.12, -4]} receiveShadow><planeGeometry args={[22, 26]} /><meshStandardMaterial color="#53644b" roughness={1} /></mesh>
      <mesh position={[0, -0.02, 1]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[2.7, 16]} /><meshStandardMaterial color="#77715d" roughness={0.92} /></mesh>
      <mesh position={[4.5, -0.02, -5]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[2.2, 15]} /><meshStandardMaterial color="#607d82" metalness={0.15} roughness={0.25} /></mesh>
      <mesh position={[3.7, 0.12, -5]} rotation={[-Math.PI / 2, 0, 0]}><boxGeometry args={[3.4, 0.16, 0.8]} /><meshStandardMaterial color="#9a8a6f" roughness={0.9} /></mesh>
      {[[-3, 0, 2], [2.8, 0, -1], [-4, 0, -6], [4, 0, -15], [-4, 0, -15]].map(([x, y, z], i) => <mesh key={i} position={[x, y, z]} rotation={[-Math.PI / 2, 0, 0]}><circleGeometry args={[0.45, 8]} /><meshStandardMaterial color="#4b694c" /></mesh>)}
      <Float speed={0.5} floatIntensity={0.05}><mesh position={[4.5, 0.8, -7]}><boxGeometry args={[0.08, 1.4, 0.08]} /><meshStandardMaterial color="#7b5b3b" /></mesh></Float>
    </group>
  )
}
