import { Canvas, useFrame, useThree } from '@react-three/fiber'
import {
  KeyboardControls,
  PointerLockControls,
  useKeyboardControls,
} from '@react-three/drei'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Vector3 } from 'three'
import {
  ExhibitionHallScene,
  type ExhibitionHallId,
} from './ExhibitionHallScene'
import './immersive3d.css'

function FirstPersonWalk() {
  const { camera } = useThree()
  const [, getKeys] = useKeyboardControls()
  const forward = new Vector3()
  const right = new Vector3()
  const speed = 4.2

  useFrame((_, delta) => {
    const keys = getKeys()
    const movingForward = Number(keys.forward) - Number(keys.back)
    const movingRight = Number(keys.right) - Number(keys.left)
    if (!movingForward && !movingRight) return

    camera.getWorldDirection(forward)
    forward.y = 0
    forward.normalize()
    right.crossVectors(forward, camera.up).normalize()

    camera.position.addScaledVector(forward, movingForward * speed * delta)
    camera.position.addScaledVector(right, movingRight * speed * delta)
    camera.position.x = Math.max(-18, Math.min(18, camera.position.x))
    camera.position.z = Math.max(-15, Math.min(15, camera.position.z))
    camera.position.y = 2.35
  })

  return null
}

export default function YueluAcademyPage() {
  const navigate = useNavigate()

  const enterAcademy = (id: ExhibitionHallId) => {
    navigate(`/academy-3d/${id}`)
  }

  return (
    <main className="immersive3d-page immersive3d-exhibition">
      <KeyboardControls
        map={[
          { name: 'forward', keys: ['w', 'W', 'ArrowUp'] },
          { name: 'back', keys: ['s', 'S', 'ArrowDown'] },
          { name: 'left', keys: ['a', 'A', 'ArrowLeft'] },
          { name: 'right', keys: ['d', 'D', 'ArrowRight'] },
        ]}
      >
        <Canvas className="immersive3d-walk-area" shadows dpr={[1, 1.5]} camera={{ position: [0, 2.35, 13], fov: 68 }}>
          <color attach="background" args={['#9d8967']} />
          <fog attach="fog" args={['#9d8967', 24, 58]} />
          <ambientLight intensity={1.15} color="#f0dfbb" />
          <directionalLight position={[-8, 14, 8]} intensity={2.2} color="#ffe4ad" castShadow />
          <pointLight position={[0, 11, 3]} intensity={18} distance={32} color="#ffd477" />
          <ExhibitionHallScene onSelect={enterAcademy} />
          <PointerLockControls selector=".immersive3d-walk-area" />
          <FirstPersonWalk />
        </Canvas>
      </KeyboardControls>

      <div className="immersive3d-exhibition-hud">
        <button className="immersive3d-back" onClick={() => navigate('/')}>
          返回平台
        </button>
        <div className="immersive3d-location">
          <span>数智书院 · 3D展馆</span>
          <strong>五大书院文化大厅</strong>
          <small>WASD移动 · 鼠标转向 · ESC退出漫游</small>
        </div>
      </div>
      <div className="immersive3d-crosshair" aria-hidden="true">
        <span />
      </div>
    </main>
  )
}
