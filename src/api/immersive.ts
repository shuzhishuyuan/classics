import { get } from '../hooks/useApi'

export interface ImmersiveScene {
  id: string
  name: string
  version: string
  status: string
  entry: { position: number[]; target: number[]; fov: number }
  route: string[]
  nodes: Array<{ id: string; type: string; title: string; subtitle: string; action: { type: string; target: string } }>
  assets: Array<{ id: string; kind: string; url: string | null; license: string; status: string }>
}

export function fetchImmersiveScene(sceneId = 'yuelu-academy') {
  return get<ImmersiveScene>(`/immersive/scenes/${sceneId}`)
}
