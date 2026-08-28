import { Physics, RigidBody } from '@react-three/rapier'

export function YueluPhysics() {
  return (
    <Physics gravity={[0, -9.81, 0]}>
      <RigidBody type="fixed" colliders="cuboid" position={[0, -0.3, -4]}>
        <mesh visible={false}><boxGeometry args={[22, 0.4, 26]} /></mesh>
      </RigidBody>
    </Physics>
  )
}
