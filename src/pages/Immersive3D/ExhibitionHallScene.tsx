import { Html } from '@react-three/drei'
import { useThree, type ThreeEvent } from '@react-three/fiber'
import { MathUtils, Vector3 } from 'three'

export type ExhibitionHallId =
  | 'central'
  | 'yuelu'
  | 'bailudong'
  | 'songyang'
  | 'yingtian'
  | 'shigu'

export type ExhibitionHall = {
  id: ExhibitionHallId
  name: string
  subtitle: string
  description: string
  color: string
  path: string
}

export const exhibitionHalls: Record<ExhibitionHallId, ExhibitionHall> = {
  central: {
    id: 'central',
    name: '书院文化总览',
    subtitle: '千年文脉 · 五院同源',
    description: '汇聚五大书院的历史沿革、教育思想与文化遗产，呈现中国书院绵延千年的育人传统。',
    color: '#c99c52',
    path: '/resources',
  },
  yuelu: {
    id: 'yuelu',
    name: '岳麓书院展厅',
    subtitle: '惟楚有材，于斯为盛',
    description: '创建于北宋开宝九年，历经千年办学不辍，以朱张会讲、湖湘学派和经世致用精神著称。',
    color: '#5b8c68',
    path: '/academy-3d/yuelu',
  },
  bailudong: {
    id: 'bailudong',
    name: '白鹿洞书院展厅',
    subtitle: '博学之，审问之，慎思之',
    description: '坐落于庐山五老峰南麓，朱熹重建并制定《白鹿洞书院揭示》，奠定后世书院教育规制。',
    color: '#a98258',
    path: '/academy-3d/bailudong',
  },
  songyang: {
    id: 'songyang',
    name: '嵩阳书院展厅',
    subtitle: '二程讲学，洛学薪传',
    description: '位于嵩山南麓，北宋程颢、程颐曾在此讲学，是程朱理学重要的策源与传播之地。',
    color: '#7d8066',
    path: '/academy-3d/songyang',
  },
  yingtian: {
    id: 'yingtian',
    name: '应天书院展厅',
    subtitle: '以天下为己任',
    description: '兴盛于北宋，范仲淹主持书院教务并推行教育改革，形成心怀天下、崇尚实学的育人传统。',
    color: '#a9694f',
    path: '/academy-3d/yingtian',
  },
  shigu: {
    id: 'shigu',
    name: '石鼓书院展厅',
    subtitle: '石鼓江山，文脉流芳',
    description: '始建于唐元和年间，坐落于衡阳石鼓山，因韩愈、朱熹等名贤题咏讲学而声名远播。',
    color: '#587b85',
    path: '/academy-3d/shigu',
  },
}

const satellitePositions: Array<{
  id: Exclude<ExhibitionHallId, 'central'>
  position: [number, number, number]
  rotation: number
}> = [
  { id: 'yuelu', position: [0, 0, -12.5], rotation: 0 },
  { id: 'songyang', position: [10.5, 0, -3.5], rotation: -Math.PI / 2.5 },
  { id: 'yingtian', position: [7, 0, 8.5], rotation: Math.PI - 0.35 },
  { id: 'shigu', position: [-7, 0, 8.5], rotation: Math.PI + 0.35 },
  { id: 'bailudong', position: [-10.5, 0, -3.5], rotation: Math.PI / 2.5 },
]

const doorPositions: Array<{
  id: Exclude<ExhibitionHallId, 'central'>
  x: number
  color: string
}> = [
  { id: 'bailudong', x: -12, color: '#a98258' },
  { id: 'shigu', x: -6, color: '#587b85' },
  { id: 'yuelu', x: 0, color: '#5b8c68' },
  { id: 'songyang', x: 6, color: '#7d8066' },
  { id: 'yingtian', x: 12, color: '#a9694f' },
]

function Doorway({
  hall,
  x,
  color,
  onSelect,
}: {
  hall: ExhibitionHall
  x: number
  color: string
  onSelect: (id: Exclude<ExhibitionHallId, 'central'>) => void
}) {
  const { camera } = useThree()
  const click = (event: ThreeEvent<MouseEvent>) => {
    event.stopPropagation()
    const doorway = new Vector3(x, 2.4, -17.25)
    if (camera.position.distanceTo(doorway) > 5.2) return
    onSelect(hall.id as Exclude<ExhibitionHallId, 'central'>)
  }

  return (
    <group position={[x, 0, -17.25]} onClick={click}>
      <mesh position={[0, 3.15, 0]}>
        <boxGeometry args={[3.65, 6.3, 0.34]} />
        <meshStandardMaterial color="#071513" roughness={0.78} />
      </mesh>
      <mesh position={[-2, 3.2, 0.16]} castShadow>
        <boxGeometry args={[0.34, 6.7, 0.5]} />
        <meshStandardMaterial color="#a18451" roughness={0.52} metalness={0.2} />
      </mesh>
      <mesh position={[2, 3.2, 0.16]} castShadow>
        <boxGeometry args={[0.34, 6.7, 0.5]} />
        <meshStandardMaterial color="#a18451" roughness={0.52} metalness={0.2} />
      </mesh>
      <mesh position={[0, 6.5, 0.16]} castShadow>
        <boxGeometry args={[4.35, 0.34, 0.5]} />
        <meshStandardMaterial color="#a18451" roughness={0.52} metalness={0.2} />
      </mesh>
      <mesh position={[0, 3.25, 0.36]}>
        <boxGeometry args={[2.85, 5.7, 0.08]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.55}
          roughness={0.62}
        />
      </mesh>
      <mesh position={[0, 3.25, 0.42]}>
        <boxGeometry args={[1.9, 4.65, 0.06]} />
        <meshStandardMaterial color="#31534b" emissive={color} emissiveIntensity={0.28} roughness={0.48} />
      </mesh>
      <pointLight position={[0, 3.5, 1.1]} intensity={2.6} distance={5} color={color} />
      <Html position={[0, 7.25, 0.35]} center distanceFactor={5}>
        <button
          className="exhibition3d-door-label"
          style={{ '--door-color': color } as React.CSSProperties}
          type="button"
        >
          <strong>{hall.name.replace('展厅', '')}</strong>
          <span>进入展厅</span>
        </button>
      </Html>
    </group>
  )
}

function Label({
  hall,
  position,
  onSelect,
}: {
  hall: ExhibitionHall
  position: [number, number, number]
  onSelect: (id: ExhibitionHallId) => void
}) {
  return (
    <Html position={position} center distanceFactor={10}>
      <button
        className="exhibition3d-label"
        style={{ '--hall-color': hall.color } as React.CSSProperties}
        onClick={() => onSelect(hall.id)}
      >
        <strong>{hall.name}</strong>
        <span>{hall.subtitle}</span>
      </button>
    </Html>
  )
}

function Pillars({ radius, height, color }: { radius: number; height: number; color: string }) {
  return (
    <>
      {Array.from({ length: 6 }).map((_, index) => {
        const angle = (index / 6) * Math.PI * 2
        return (
          <mesh
            key={index}
            position={[Math.cos(angle) * radius, height / 2, Math.sin(angle) * radius]}
            castShadow
          >
            <cylinderGeometry args={[0.18, 0.22, height, 10]} />
            <meshStandardMaterial color={color} roughness={0.65} />
          </mesh>
        )
      })}
    </>
  )
}

function Pavilion({
  hall,
  position,
  rotation,
  central = false,
  onSelect,
}: {
  hall: ExhibitionHall
  position: [number, number, number]
  rotation?: number
  central?: boolean
  onSelect: (id: ExhibitionHallId) => void
}) {
  const width = central ? 10.4 : 5.4
  const depth = central ? 7.8 : 4.5
  const height = central ? 4.8 : 3.4
  const click = (event: ThreeEvent<MouseEvent>) => {
    event.stopPropagation()
    onSelect(hall.id)
  }

  return (
    <group position={position} rotation={[0, rotation ?? 0, 0]} onClick={click}>
      <mesh position={[0, 0.12, 0]} receiveShadow>
        <boxGeometry args={[width + 0.7, 0.25, depth + 0.7]} />
        <meshStandardMaterial color="#bda984" roughness={0.86} />
      </mesh>
      <mesh position={[0, height / 2, 0]} castShadow>
        <boxGeometry args={[width, height, depth]} />
        <meshStandardMaterial color={central ? '#d9c9a9' : '#d4c09c'} roughness={0.84} />
      </mesh>
      <mesh position={[0, height + 0.22, 0]} rotation={[0, Math.PI / 4, 0]} castShadow>
        <coneGeometry args={[central ? 5.8 : 3.7, central ? 1.6 : 1.05, 4]} />
        <meshStandardMaterial color={central ? '#273e37' : hall.color} roughness={0.72} />
      </mesh>
      <mesh position={[0, height / 2, depth / 2 + 0.08]}>
        <boxGeometry args={[central ? 2.5 : 1.35, central ? 2.5 : 1.7, 0.1]} />
        <meshStandardMaterial color="#513326" roughness={0.7} />
      </mesh>
      <Pillars radius={central ? 3.5 : 2.15} height={height} color={central ? '#755738' : '#65452d'} />
      <mesh position={[0, height + (central ? 1.05 : 0.68), 0]} rotation={[0, Math.PI / 4, 0]}>
        <torusGeometry args={[central ? 3.6 : 2.15, 0.06, 8, 4]} />
        <meshStandardMaterial color="#e2b869" emissive="#a86e27" emissiveIntensity={0.7} />
      </mesh>
      <Label hall={hall} position={[0, height + (central ? 2.2 : 1.45), 0]} onSelect={onSelect} />
    </group>
  )
}

function CentralArch() {
  return (
    <mesh position={[0, 0.38, 4.55]} rotation={[0, 0, 0]} castShadow>
      <torusGeometry args={[5.25, 0.1, 12, 48, Math.PI]} />
      <meshStandardMaterial
        color="#e2b869"
        emissive="#a86e27"
        emissiveIntensity={0.75}
        roughness={0.42}
        metalness={0.35}
      />
    </mesh>
  )
}

function RoomShell() {
  const wallMaterial = { color: '#b9a47b', roughness: 0.88 }
  const redBeamMaterial = { color: '#8b3b2f', roughness: 0.62, metalness: 0.08 }
  const goldTrimMaterial = { color: '#c99132', roughness: 0.42, metalness: 0.28 }

  const ceilingPanels = [
    [-7, -6], [0, -6], [7, -6],
    [-7, 2], [0, 2], [7, 2],
    [-7, 10], [0, 10], [7, 10],
  ] as const

  return (
    <group>
      <mesh position={[0, -0.28, 0]} receiveShadow>
        <boxGeometry args={[44, 0.45, 36]} />
        <meshStandardMaterial color="#a9946b" roughness={0.95} />
      </mesh>
      <mesh position={[0, -0.02, 0]} receiveShadow>
        <boxGeometry args={[41.5, 0.12, 33.5]} />
        <meshStandardMaterial color="#c3ad7f" roughness={0.92} />
      </mesh>

      <mesh position={[-22, 7, 0]} receiveShadow>
        <boxGeometry args={[0.5, 14, 36]} />
        <meshStandardMaterial {...wallMaterial} />
      </mesh>
      <mesh position={[22, 7, 0]} receiveShadow>
        <boxGeometry args={[0.5, 14, 36]} />
        <meshStandardMaterial {...wallMaterial} />
      </mesh>
      <mesh position={[0, 7, -18]} receiveShadow>
        <boxGeometry args={[44, 14, 0.5]} />
        <meshStandardMaterial {...wallMaterial} />
      </mesh>
      <mesh position={[0, 14, 0]}>
        <boxGeometry args={[44, 0.35, 36]} />
        <meshStandardMaterial color="#52716d" roughness={0.92} />
      </mesh>

      {ceilingPanels.map(([x, z]) => (
        <group key={`ceiling-panel-${x}-${z}`} position={[x, 13.78, z]}>
          <mesh receiveShadow>
            <boxGeometry args={[6.8, 0.08, 7.3]} />
            <meshStandardMaterial
              color={x === 0 && z === 2 ? '#6b8f83' : '#78998d'}
              roughness={0.78}
            />
          </mesh>
          <mesh position={[0, 0.06, 0]}>
            <boxGeometry args={[6.15, 0.045, 6.65]} />
            <meshStandardMaterial color="#52776e" roughness={0.72} />
          </mesh>
          <mesh position={[0, 0.1, 0]}>
            <boxGeometry args={[0.32, 0.05, 5.9]} />
            <meshStandardMaterial {...goldTrimMaterial} />
          </mesh>
          <mesh position={[0, 0.1, 0]} rotation={[0, Math.PI / 2, 0]}>
            <boxGeometry args={[0.32, 0.05, 5.9]} />
            <meshStandardMaterial {...goldTrimMaterial} />
          </mesh>
        </group>
      ))}

      {[-14, -3.5, 7.5].map((x) => (
        <mesh key={`beam-x-${x}`} position={[x, 13.52, 2]} castShadow>
          <boxGeometry args={[0.42, 0.38, 35]} />
          <meshStandardMaterial {...redBeamMaterial} />
        </mesh>
      ))}
      {[-12, -1, 10].map((z) => (
        <mesh key={`beam-z-${z}`} position={[0, 13.5, z]} castShadow>
          <boxGeometry args={[43, 0.38, 0.42]} />
          <meshStandardMaterial {...redBeamMaterial} />
        </mesh>
      ))}

      {[-14, -3.5, 7.5].map((x) => (
        <mesh key={`gold-beam-x-${x}`} position={[x, 13.76, 2]}>
          <boxGeometry args={[0.12, 0.06, 34.5]} />
          <meshStandardMaterial {...goldTrimMaterial} />
        </mesh>
      ))}
      {[-12, -1, 10].map((z) => (
        <mesh key={`gold-beam-z-${z}`} position={[0, 13.74, z]}>
          <boxGeometry args={[42.5, 0.06, 0.12]} />
          <meshStandardMaterial {...goldTrimMaterial} />
        </mesh>
      ))}

      <group position={[0, 13.45, 2]}>
        <mesh>
          <boxGeometry args={[7.2, 0.18, 7.2]} />
          <meshStandardMaterial color="#8b3b2f" roughness={0.58} />
        </mesh>
        <mesh position={[0, 0.13, 0]}>
          <boxGeometry args={[6.45, 0.14, 6.45]} />
          <meshStandardMaterial color="#5c877c" roughness={0.68} />
        </mesh>
        <mesh position={[0, 0.24, 0]}>
          <boxGeometry args={[5.7, 0.12, 5.7]} />
          <meshStandardMaterial color="#b98735" roughness={0.45} metalness={0.2} />
        </mesh>
        <mesh position={[0, 0.34, 0]}>
          <boxGeometry args={[4.95, 0.1, 4.95]} />
          <meshStandardMaterial color="#4f786e" roughness={0.66} />
        </mesh>
        <mesh position={[0, 0.43, 0]}>
          <boxGeometry args={[3.65, 0.08, 3.65]} />
          <meshStandardMaterial color="#9a4333" roughness={0.58} />
        </mesh>
        <mesh position={[0, 0.5, 0]}>
          <cylinderGeometry args={[1.35, 1.35, 0.16, 8]} />
          <meshStandardMaterial
            color="#d6a13c"
            emissive="#8d5c1e"
            emissiveIntensity={0.45}
            roughness={0.4}
            metalness={0.25}
          />
        </mesh>
      </group>

      {[-16, 16].map((x) => (
        <group key={`front-column-${x}`} position={[x, 0, 15.5]}>
          <mesh position={[0, 6.5, 0]} castShadow>
            <boxGeometry args={[0.7, 13, 0.7]} />
            <meshStandardMaterial color="#624b35" roughness={0.75} />
          </mesh>
          <mesh position={[0, 13.15, 0]}>
            <boxGeometry args={[1.25, 0.22, 1.25]} />
            <meshStandardMaterial {...goldTrimMaterial} />
          </mesh>
        </group>
      ))}

          <mesh position={[0, 6.5, -17.68]}>
        <boxGeometry args={[15, 8.5, 0.08]} />
        <meshStandardMaterial
          color="#5c786b"
          emissive="#294d43"
          emissiveIntensity={0.3}
          roughness={0.7}
        />
      </mesh>
      <mesh position={[0, 6.5, -17.6]}>
        <boxGeometry args={[15.5, 8.9, 0.06]} />
        <meshStandardMaterial color="#a18451" roughness={0.55} wireframe />
      </mesh>
    </group>
  )
}

const wallExhibits = [
  { id: 'bailudong', x: -12, title: '白鹿洞书院', subtitle: '修身 · 治学', color: '#a98258' },
  { id: 'shigu', x: -6, title: '石鼓书院', subtitle: '山水 · 人文', color: '#587b85' },
  { id: 'yuelu', x: 0, title: '岳麓书院', subtitle: '会讲 · 经世', color: '#5b8c68' },
  { id: 'songyang', x: 6, title: '嵩阳书院', subtitle: '理学 · 师道', color: '#7d8066' },
  { id: 'yingtian', x: 12, title: '应天书院', subtitle: '人才 · 家国', color: '#a9694f' },
] as const

function BackWallExhibit() {
  return (
    <group>
      <mesh position={[0, 11.15, -17.48]}>
        <boxGeometry args={[16.5, 2.5, 0.12]} />
        <meshStandardMaterial color="#163735" roughness={0.82} />
      </mesh>
      <mesh position={[0, 11.15, -17.58]}>
        <boxGeometry args={[15.9, 1.92, 0.06]} />
        <meshStandardMaterial color="#1f4d4d" roughness={0.75} />
      </mesh>
      <mesh position={[0, 12.28, -17.66]}>
        <boxGeometry args={[16.8, 0.12, 0.18]} />
        <meshStandardMaterial color="#d29b3f" emissive="#8d5c1e" emissiveIntensity={0.4} />
      </mesh>
      <mesh position={[0, 10.02, -17.66]}>
        <boxGeometry args={[16.8, 0.12, 0.18]} />
        <meshStandardMaterial color="#d29b3f" emissive="#8d5c1e" emissiveIntensity={0.4} />
      </mesh>
      <Html position={[0, 11.1, -17.72]} center distanceFactor={8}>
        <div className="exhibition3d-wall-title">
          <span>数字书院 · 五脉同源</span>
          <strong>五大书院文化长廊</strong>
          <small>从一扇门，走进一段书院文脉</small>
        </div>
      </Html>

      {wallExhibits.map((item) => (
        <group key={item.id} position={[item.x, 7.2, -17.5]}>
          <mesh>
            <boxGeometry args={[4.3, 1.65, 0.14]} />
            <meshStandardMaterial color="#8b4a32" roughness={0.62} />
          </mesh>
          <mesh position={[0, 0, -0.1]}>
            <boxGeometry args={[3.86, 1.22, 0.08]} />
            <meshStandardMaterial
              color="#416b66"
              emissive={item.color}
              emissiveIntensity={0.18}
              roughness={0.65}
            />
          </mesh>
          <mesh position={[0, 0.84, -0.11]}>
            <boxGeometry args={[3.9, 0.08, 0.14]} />
            <meshStandardMaterial color={item.color} emissive={item.color} emissiveIntensity={0.35} />
          </mesh>
          <Html position={[0, 0, -0.22]} center distanceFactor={7}>
            <div className="exhibition3d-wall-card" style={{ '--wall-color': item.color } as React.CSSProperties}>
              <strong>{item.title}</strong>
              <span>{item.subtitle}</span>
            </div>
          </Html>
        </group>
      ))}
    </group>
  )
}

function FrontWallExhibit() {
  return (
    <group position={[0, 0, 17.55]}>
      <mesh position={[0, 7.2, 0]}>
        <boxGeometry args={[30, 11, 0.12]} />
        <meshStandardMaterial color="#b9a47b" roughness={0.8} />
      </mesh>
      <mesh position={[0, 7.2, -0.08]}>
        <boxGeometry args={[27.8, 9.4, 0.08]} />
        <meshStandardMaterial color="#d1bc8d" roughness={0.72} />
      </mesh>
      <mesh position={[0, 11.8, -0.18]}>
        <boxGeometry args={[28.8, 0.18, 0.18]} />
        <meshStandardMaterial color="#d29b3f" emissive="#8d5c1e" emissiveIntensity={0.45} />
      </mesh>
      <mesh position={[0, 2.55, -0.18]}>
        <boxGeometry args={[28.8, 0.18, 0.18]} />
        <meshStandardMaterial color="#d29b3f" emissive="#8d5c1e" emissiveIntensity={0.45} />
      </mesh>
      <mesh position={[0, 7.1, -0.2]}>
        <boxGeometry args={[13.5, 7.6, 0.08]} />
        <meshStandardMaterial color="#7b3028" roughness={0.6} />
      </mesh>
      <mesh position={[0, 7.1, -0.28]}>
        <boxGeometry args={[12.6, 6.7, 0.06]} />
        <meshStandardMaterial color="#4d776d" emissive="#739b8a" emissiveIntensity={0.22} roughness={0.66} />
      </mesh>
      <mesh position={[0, 7.1, -0.34]}>
        <boxGeometry args={[11.5, 0.08, 0.12]} />
        <meshStandardMaterial color="#d29b3f" emissive="#8d5c1e" emissiveIntensity={0.35} />
      </mesh>
      <mesh position={[0, 7.1, -0.34]} rotation={[0, 0, Math.PI / 2]}>
        <boxGeometry args={[6, 0.08, 0.12]} />
        <meshStandardMaterial color="#d29b3f" emissive="#8d5c1e" emissiveIntensity={0.35} />
      </mesh>
      <mesh position={[-9, 7.2, -0.22]}>
        <boxGeometry args={[4.2, 6.4, 0.08]} />
        <meshStandardMaterial color="#8b4a32" roughness={0.62} />
      </mesh>
      <mesh position={[9, 7.2, -0.22]}>
        <boxGeometry args={[4.2, 6.4, 0.08]} />
        <meshStandardMaterial color="#8b4a32" roughness={0.62} />
      </mesh>
      <mesh position={[-9, 7.2, -0.3]}>
        <boxGeometry args={[3.55, 5.75, 0.06]} />
        <meshStandardMaterial color="#28545a" roughness={0.7} />
      </mesh>
      <mesh position={[9, 7.2, -0.3]}>
        <boxGeometry args={[3.55, 5.75, 0.06]} />
        <meshStandardMaterial color="#28545a" roughness={0.7} />
      </mesh>
      <Html position={[0, 8.1, -0.42]} center distanceFactor={7}>
        <div className="exhibition3d-front-wall-title">
          <span>数字书院 · 五脉同源</span>
          <strong>书院文化总序</strong>
          <small>读书 · 明理 · 修身 · 经世</small>
        </div>
      </Html>
      <Html position={[-9, 7.2, -0.42]} center distanceFactor={7}>
        <div className="exhibition3d-front-wall-card">书院源流</div>
      </Html>
      <Html position={[9, 7.2, -0.42]} center distanceFactor={7}>
        <div className="exhibition3d-front-wall-card">精神传承</div>
      </Html>
    </group>
  )
}

function Path({ position, rotation = 0, length = 10 }: { position: [number, number, number]; rotation?: number; length?: number }) {
  return (
    <mesh position={[position[0], 0.02, position[2]]} rotation={[-Math.PI / 2, 0, rotation]}>
      <planeGeometry args={[1.2, length]} />
      <meshStandardMaterial color="#aa9878" roughness={0.96} />
    </mesh>
  )
}

export function ExhibitionHallScene({ onSelect }: { onSelect: (id: ExhibitionHallId) => void }) {
  return (
    <group>
      <RoomShell />
      <BackWallExhibit />
      <FrontWallExhibit />
      {doorPositions.map(({ id, x, color }) => (
        <Doorway key={id} hall={exhibitionHalls[id]} x={x} color={color} onSelect={onSelect as (id: Exclude<ExhibitionHallId, 'central'>) => void} />
      ))}

      <ambientLight intensity={1.15} color="#f0dfbb" />
      <directionalLight position={[0, 13, 8]} intensity={2.2} color="#ffe4ad" castShadow />
      <pointLight position={[0, 10, 3]} intensity={30} distance={28} color="#ffd477" />
      <pointLight position={[-15, 8, -4]} intensity={15} distance={20} color="#b6d5b7" />
      <pointLight position={[15, 8, -4]} intensity={15} distance={20} color="#f2b078" />
    </group>
  )
}

export function exhibitionCameraTarget() {
  return [0, 4, -1.5] as [number, number, number]
}

export function exhibitionCameraPosition() {
  return [0, 13, 27] as [number, number, number]
}

export function getExhibitionAngle(id: ExhibitionHallId) {
  const index = satellitePositions.findIndex((item) => item.id === id)
  return index < 0 ? 0 : MathUtils.degToRad(index * 72)
}
