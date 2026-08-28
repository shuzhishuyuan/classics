import { useEffect, useMemo, useRef, useState } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { FiArrowRight, FiMap, FiMapPin, FiNavigation2, FiRefreshCw } from 'react-icons/fi'
import type { AcademyId } from './AcademyHallPage'

type MapPoint = {
  id: AcademyId
  name: string
  city: string
  note: string
  summary: string
  position: [number, number]
  color: string
}

type MarkerState = {
  id: AcademyId
  point: MapPoint
  marker: L.Marker
  index: number
}

const mapPoints: MapPoint[] = [
  {
    id: 'bailudong',
    name: '白鹿洞书院',
    city: '江西 · 九江',
    note: '理学与学规并重的千年书院',
    summary: '位于庐山南麓，山林气息与讲学空间并行，是五院中最具山居气质的一处。',
    position: [115.972, 29.575],
    color: '#9a6b3d',
  },
  {
    id: 'shigu',
    name: '石鼓书院',
    city: '湖南 · 衡阳',
    note: '湘学源流的重要节点',
    summary: '依托衡阳石鼓山水，连接湖湘文脉与地方学术传统。',
    position: [112.612, 26.895],
    color: '#397486',
  },
  {
    id: 'yuelu',
    name: '岳麓书院',
    city: '湖南 · 长沙',
    note: '千年学府，近代延续最强',
    summary: '坐落岳麓山下，是五院中最具代表性的文化坐标。',
    position: [112.936, 28.182],
    color: '#2d644b',
  },
  {
    id: 'songyang',
    name: '嵩阳书院',
    city: '河南 · 登封',
    note: '理学与嵩山文化交汇点',
    summary: '靠近中岳嵩山，呈现“依山明理”的历史格局。',
    position: [113.017, 34.452],
    color: '#6f7657',
  },
  {
    id: 'yingtian',
    name: '应天书院',
    city: '河南 · 商丘',
    note: '书院制度走向规范化的样本',
    summary: '位于中原东部，串联民间讲学与官学体系。',
    position: [115.652, 34.447],
    color: '#a15f4e',
  },
]

const initialSelectedId: AcademyId = 'yuelu'
const initialCenter: [number, number] = [31.8, 113.4]

function toLatLng(position: [number, number]): [number, number] {
  return [position[1], position[0]]
}

function createMarkerIcon(point: MapPoint, index: number, active: boolean) {
  return L.divIcon({
    className: 'academy-map-div-icon',
    html: `
      <span class="academy-map-pin${active ? ' is-active' : ''}" style="--pin-color:${point.color}">
        <b>${index + 1}</b>
      </span>
    `,
    iconSize: [34, 34],
    iconAnchor: [17, 17],
  })
}

export default function AcademyMap({ onEnter }: { onEnter: (id: AcademyId) => void }) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const mapRef = useRef<L.Map | null>(null)
  const markersRef = useRef<MarkerState[]>([])
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading')
  const [selectedId, setSelectedId] = useState<AcademyId>(initialSelectedId)

  const selected = useMemo(() => mapPoints.find((item) => item.id === selectedId) ?? mapPoints[0], [selectedId])

  const refreshMarkers = (activeId: AcademyId) => {
    markersRef.current.forEach(({ id, point, marker, index }) => {
      marker.setIcon(createMarkerIcon(point, index, id === activeId))
    })
  }

  const focusPoint = (id: AcademyId, shouldMove = true) => {
    const point = mapPoints.find((item) => item.id === id)
    if (!point) return
    setSelectedId(id)
    refreshMarkers(id)
    if (shouldMove && mapRef.current) {
      mapRef.current.flyTo(toLatLng(point.position), 6.2, { animate: true, duration: 0.7 })
    }
  }

  useEffect(() => {
    if (!containerRef.current) return

    const map = L.map(containerRef.current, {
      zoomControl: false,
      attributionControl: true,
      minZoom: 4,
      maxZoom: 13,
      scrollWheelZoom: true,
      doubleClickZoom: true,
      dragging: true,
      worldCopyJump: false,
      preferCanvas: true,
    })

    mapRef.current = map

    L.control.zoom({ position: 'bottomright' }).addTo(map)
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
      maxZoom: 19,
      detectRetina: true,
    }).addTo(map)

    const bounds = L.latLngBounds([])
    markersRef.current = mapPoints.map((point, index) => {
      const marker = L.marker(toLatLng(point.position), {
        icon: createMarkerIcon(point, index, point.id === initialSelectedId),
        keyboard: false,
      }).addTo(map)

      marker.on('click', () => focusPoint(point.id))
      bounds.extend(toLatLng(point.position))

      return { id: point.id, point, marker, index }
    })

    if (bounds.isValid()) {
      map.fitBounds(bounds.pad(0.24), { animate: false })
    } else {
      map.setView(initialCenter, 5)
    }

    refreshMarkers(initialSelectedId)
    setStatus('ready')

    const handleTileError = () => setStatus('error')
    map.on('tileerror', handleTileError)

    return () => {
      map.off('tileerror', handleTileError)
      markersRef.current = []
      mapRef.current = null
      map.remove()
    }
  }, [])

  useEffect(() => {
    if (status !== 'ready') return
    refreshMarkers(selectedId)
  }, [selectedId, status])

  return (
    <section className="academy-map-panel" aria-label="书院地图">
      <div className="academy-map-head">
        <div>
          <span><FiMap /> 书院地图</span>
          <strong>地图上的五院位置</strong>
          <small>先按五院所在城市标点，后续还能继续细化到院落级坐标。</small>
        </div>
        <div className="academy-map-head-tip">
          <FiNavigation2 />
          <span>可拖拽 · 可缩放 · 可点选</span>
        </div>
      </div>

      <div className="academy-map-layout">
        <div className="academy-map-view">
          <div ref={containerRef} className="academy-map-surface" />
          {status === 'loading' && (
            <div className="academy-map-overlay">
              <strong>地图正在加载</strong>
              <span>开放底图与五院标记即将显示。</span>
            </div>
          )}
          {status === 'error' && (
            <div className="academy-map-overlay">
              <strong>地图加载失败</strong>
              <span>请检查网络连接后重试，或稍后再看地图底图。</span>
            </div>
          )}
        </div>

        <aside className="academy-map-sidebar">
          <article className="academy-map-focus">
            <span className="academy-map-focus-kicker">当前选中</span>
            <strong>{selected.name}</strong>
            <small>{selected.city}</small>
            <p>{selected.summary}</p>
            <div className="academy-map-focus-actions">
              <button type="button" onClick={() => focusPoint(selected.id)}>
                定位到这里
              </button>
              <button type="button" className="primary" onClick={() => onEnter(selected.id)}>
                进入展厅 <FiArrowRight />
              </button>
            </div>
          </article>

          <div className="academy-map-list">
            {mapPoints.map((point, index) => (
              <button
                key={point.id}
                type="button"
                className={`academy-map-item${point.id === selectedId ? ' active' : ''}`}
                onClick={() => focusPoint(point.id)}
              >
                <span className="academy-map-item-index" style={{ background: point.color }}>{index + 1}</span>
                <span className="academy-map-item-copy">
                  <strong>{point.name}</strong>
                  <small>{point.city}</small>
                </span>
                <FiRefreshCw />
                <em>{point.note}</em>
              </button>
            ))}
          </div>
        </aside>
      </div>
    </section>
  )
}
