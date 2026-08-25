import { Suspense, useEffect, useRef, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { ContactShadows, Environment, KeyboardControls, PerspectiveCamera, PointerLockControls, useKeyboardControls } from '@react-three/drei'
import { Vector3 } from 'three'
import { useNavigate } from 'react-router-dom'
import { hotspots, type HotspotId } from './YueluArchitecture'
import { YueluPhysics } from './YueluPhysics'
import { VirtualLibrary } from './VirtualLibrary'
import './immersive3d.css'
import { fetchImmersiveScene, type ImmersiveScene } from '../../api/immersive'

function KeyboardWalk() {
  const { camera } = useThree()
  const [, get] = useKeyboardControls()
  const forwardVector = useRef(new Vector3())
  const rightVector = useRef(new Vector3())
  const speed = 3.2

  useFrame((_, delta) => {
    const forward = Number(get().forward) - Number(get().back)
    const strafe = Number(get().right) - Number(get().left)
    if (!forward && !strafe) return
    camera.getWorldDirection(forwardVector.current)
    forwardVector.current.y = 0
    forwardVector.current.normalize()
    rightVector.current.crossVectors(forwardVector.current, camera.up).normalize()
    camera.position.addScaledVector(forwardVector.current, forward * speed * delta)
    camera.position.addScaledVector(rightVector.current, strafe * speed * delta)
    camera.position.x = Math.max(-15, Math.min(15, camera.position.x))
    camera.position.z = Math.max(-12, Math.min(20, camera.position.z))
    camera.position.y = 4.4
  })

  return null
}

function YueluScene({ onSelect, scene }: { onSelect: (id: HotspotId) => void; scene: ImmersiveScene | null }) {
  const entry = scene?.entry ?? { position: [0, 4.4, 22], target: [0, 4, -10], fov: 48 }
  return <>
    <PerspectiveCamera makeDefault position={entry.position as [number, number, number]} fov={entry.fov} near={0.1} far={180} />
    <fog attach="fog" args={['#263b38', 18, 62]} /><color attach="background" args={['#263b38']} />
    <ambientLight intensity={0.52} color="#e3d5b8" /><directionalLight position={[-4, 8, 3]} intensity={1.2} color="#d8c39b" castShadow />
    <pointLight position={[-2, 4, -4]} intensity={8} distance={10} color="#d9a441" />
    <Suspense fallback={null}><VirtualLibrary onSelect={onSelect} /><Environment preset="night" /></Suspense>
    <ContactShadows position={[0, 0.02, 0]} opacity={0.6} scale={14} blur={2.2} far={12} resolution={512} color="#000000" />
    <PointerLockControls selector=".immersive3d-walk-area" />
    <KeyboardWalk />
    <YueluPhysics />
  </>
}

export default function Immersive3DPage() {
  const navigate = useNavigate()
  const [selected, setSelected] = useState<HotspotId | null>(null)
  const [scene, setScene] = useState<ImmersiveScene | null>(null)
  const [sceneLoading, setSceneLoading] = useState(true)
  const [sceneError, setSceneError] = useState(false)
  const selectedHotspot = selected ? hotspots[selected] : null

  useEffect(() => { fetchImmersiveScene().then((response) => { if (response.code === 200 && response.data) setScene(response.data); else setSceneError(true) }).catch(() => setSceneError(true)).finally(() => setSceneLoading(false)) }, [])

  return <main className="immersive3d-page immersive3d-yuelu">
    <KeyboardControls map={[{ name: 'forward', keys: ['w', 'W', 'ArrowUp'] }, { name: 'back', keys: ['s', 'S', 'ArrowDown'] }, { name: 'left', keys: ['a', 'A', 'ArrowLeft'] }, { name: 'right', keys: ['d', 'D', 'ArrowRight'] }]}>
      <Canvas className="immersive3d-walk-area" shadows dpr={[1, 1.5]}><YueluScene onSelect={setSelected} scene={scene} /></Canvas>
    </KeyboardControls>
    <div className="immersive3d-yuelu-hud"><button className="immersive3d-back" onClick={() => navigate('/')}>返回平台</button><div className="immersive3d-location"><span>{scene?.name ? `${scene.name} · 数字导览` : '岳麓书院 · 场景加载中'}</span><strong>{scene?.name ?? '岳麓书院'}</strong><small>{sceneLoading ? '正在读取场景配置' : sceneError ? '场景配置读取失败，使用本地预览' : `场景版本 ${scene?.version}`}</small></div></div>
    {selectedHotspot && <section className="immersive3d-overlay immersive3d-yuelu-card"><button className="immersive3d-close" onClick={() => setSelected(null)} aria-label="关闭信息">×</button><span className="immersive3d-kicker">{selectedHotspot.subtitle}</span><h2>{selectedHotspot.title}</h2><p>{selectedHotspot.description}</p><button className="immersive3d-action" onClick={() => navigate(selectedHotspot.path)}>进入学习模块</button></section>}
  </main>
}
