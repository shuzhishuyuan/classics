import { Router } from 'express'
import { ok, fail } from '../middleware/response'

const router = Router()

const yueluScene = {
  id: 'yuelu-academy',
  name: '岳麓书院',
  version: '0.1.0',
  status: 'prototype',
  entry: { position: [0, 4.4, 22], target: [0, 4, -10], fov: 48 },
  route: ['mountain-path', 'bamboo-stream', 'academy-gate', 'lecture-hall', 'imperial-library', 'stele-gallery'],
  nodes: [
    { id: 'academy-gate', type: 'landmark', title: '岳麓书院山门', subtitle: '惟楚有材，于斯为盛', action: { type: 'route', target: '/resources' } },
    { id: 'lecture-hall', type: 'learning', title: '讲堂', subtitle: '经典讲学与朱张会讲', action: { type: 'route', target: '/discussion' } },
    { id: 'imperial-library', type: 'collection', title: '御书楼', subtitle: '藏书与典籍阅读', action: { type: 'route', target: '/classics' } },
    { id: 'stele-gallery', type: 'culture', title: '碑廊', subtitle: '书院历史与人物', action: { type: 'route', target: '/resources' } },
  ],
  assets: [
    { id: 'yuelu-panorama', kind: 'panorama', url: null, license: '待补充授权素材', status: 'planned' },
    { id: 'yuelu-main-building', kind: 'model', url: null, license: '待补充授权 GLB', status: 'planned' },
  ],
}

router.get('/scenes', (_req, res) => ok(res, { list: [yueluScene], total: 1 }))

router.get('/scenes/:sceneId', (req, res) => {
  if (req.params.sceneId !== yueluScene.id) return fail(res, '场景不存在', 404)
  return ok(res, yueluScene)
})

export default router
