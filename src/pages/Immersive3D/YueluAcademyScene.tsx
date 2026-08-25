import { Html, useGLTF } from '@react-three/drei'
import { Suspense, useMemo } from 'react'
import type { HotspotId } from './YueluArchitecture'

const MODEL_URL = '/models/yuelu_academy_preview.glb'

function AcademyModel({ onSelect }: { onSelect?: (id: HotspotId) => void }) {
  const { scene } = useGLTF(MODEL_URL)
  const nodes = useMemo(() => {
    scene.traverse((object) => {
      if (object.name === 'hotspot_lecture_hall') object.userData.hotspot = 'hall'
      if (object.name === 'hotspot_imperial_library') object.userData.hotspot = 'library'
      if (object.name === 'hotspot_stele_gallery') object.userData.hotspot = 'stele'
    })
    return scene
  }, [scene])
  return <primitive object={nodes} onClick={(event: { object: { userData: { hotspot?: HotspotId } } }) => { const id = event.object.userData.hotspot; if (id) onSelect?.(id) }} />
}

export function YueluAcademyScene({ onSelect }: { onSelect?: (id: HotspotId) => void }) {
  return <Suspense fallback={<Html center><div className="immersive3d-loading">正在加载岳麓书院模型…</div></Html>}><AcademyModel onSelect={onSelect} /></Suspense>
}

useGLTF.preload(MODEL_URL)
