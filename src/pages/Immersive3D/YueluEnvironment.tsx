import { Float } from '@react-three/drei'

function Tree({ position, scale = 1 }: { position: [number, number, number]; scale?: number }) {
  return <group position={position} scale={scale}><mesh position={[0, 1.8, 0]} castShadow><cylinderGeometry args={[0.18, 0.32, 3.6, 8]} /><meshStandardMaterial color="#463526" roughness={1} /></mesh><mesh position={[0, 3.6, 0]} castShadow><icosahedronGeometry args={[1.5, 1]} /><meshStandardMaterial color="#294d35" roughness={1} /></mesh></group>
}

function Bamboo({ position }: { position: [number, number, number] }) {
  return <group position={position}><mesh position={[0, 1.8, 0]}><cylinderGeometry args={[0.06, 0.08, 3.6, 8]} /><meshStandardMaterial color="#4c6b3d" /></mesh><mesh position={[0.25, 2.2, 0.1]} rotation={[0.08, 0, -0.12]}><cylinderGeometry args={[0.05, 0.07, 4.2, 8]} /><meshStandardMaterial color="#5a7a42" /></mesh><mesh position={[-0.35, 2.4, -0.1]} rotation={[-0.1, 0, 0.12]}><cylinderGeometry args={[0.05, 0.07, 4.4, 8]} /><meshStandardMaterial color="#54743e" /></mesh></group>
}

export function YueluEnvironment() {
  return <group><Tree position={[-5, 0, 1]} scale={1.4} /><Tree position={[6, 0, -1]} scale={1.2} /><Tree position={[-5, 0, -8]} scale={1.5} /><Tree position={[5.5, 0, -12]} scale={1.25} /><Bamboo position={[-4, 0, 3]} /><Bamboo position={[-3.2, 0, 4]} /><Bamboo position={[-5.2, 0, 5]} /><Bamboo position={[5, 0, -4]} /></group>
}
