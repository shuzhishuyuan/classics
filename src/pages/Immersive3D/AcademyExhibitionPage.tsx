import { Html, KeyboardControls, PointerLockControls, useKeyboardControls } from '@react-three/drei'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useCallback, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Object3D, Raycaster, Vector2, Vector3 } from 'three'
import {
  exhibitionHalls,
  type ExhibitionHallId,
} from './ExhibitionHallScene'
import './immersive3d.css'

type AcademyId = Exclude<ExhibitionHallId, 'central'>

const academyIds: AcademyId[] = ['yuelu', 'bailudong', 'songyang', 'yingtian', 'shigu']

type ExhibitKind = 'book' | 'stele' | 'scroll' | 'inkstone' | 'lecture'

type AcademySource = {
  label: string
  url: string
}

type AcademyProfile = {
  founded: string
  location: string
  overview: string
  timeline: string[]
  figures: string[]
  heritage: string[]
}

type RoomExhibit = {
  title: string
  category: string
  summary: string
  detail: string
  facts: string[]
  kind: ExhibitKind
  color: string
  source: AcademySource
}

const academySources: Record<AcademyId, AcademySource> = {
  yuelu: { label: '岳麓书院官网', url: 'https://ylsy.hnu.edu.cn/sygk/syjj.htm' },
  bailudong: { label: '维基百科：白鹿洞书院', url: 'https://zh.wikipedia.org/wiki/白鹿洞书院' },
  songyang: { label: '登封市人民政府：嵩阳书院', url: 'https://www.dengfeng.gov.cn/mjdf/5237626.jhtml' },
  yingtian: { label: '维基百科：应天府书院', url: 'https://zh.wikipedia.org/wiki/应天府书院' },
  shigu: { label: '湖南省人民政府：石鼓书院', url: 'https://www.hunan.gov.cn/hnszf/c101477/202108/t20210830_20409320.html' },
}

const academyProfiles: Record<AcademyId, AcademyProfile> = {
  yuelu: {
    founded: '北宋开宝九年（976年）',
    location: '湖南省长沙市岳麓山东麓',
    overview: '岳麓书院是中国古代四大书院之一，也是现存延续办学时间最长的书院之一。它以讲学、藏书、祭祀为基本功能，历经宋、元、明、清而文脉不绝，今天隶属湖南大学。',
    timeline: ['976年：潭州太守朱洞在岳麓山下正式建院', '1015年：宋真宗召见周式并亲书“岳麓书院”匾额', '1167年：朱熹访院，与张栻举行朱张会讲', '1903年：改为湖南高等学堂，进入现代教育转型', '1988年：列入第三批全国重点文物保护单位'],
    figures: ['朱洞：北宋创建书院的潭州太守', '周式：北宋中期兴学山长，获宋真宗嘉许', '张栻、朱熹：南宋会讲与湖湘学派代表', '王守仁、王文清：明清时期重要讲学者与学规制定者'],
    heritage: ['大门楹联“惟楚有材，于斯为盛”', '讲堂、文庙、御书楼与赫曦台', '饮马池、碑刻和历代楹联', '湖湘学派与经世致用的思想传统'],
  },
  bailudong: {
    founded: '南唐升元四年（940年）',
    location: '江西省九江市庐山五老峰南麓',
    overview: '白鹿洞书院由李渤读书旧址发展而来，南唐时设为庐山国学。南宋朱熹重建后，书院以完整的课程、学规和讲学制度闻名，被誉为“海内第一书院”。',
    timeline: ['940年：南唐在李渤旧址设庐山国学，又称白鹿国庠', '宋初：宋太祖赐国子监刻印的九经等书', '1179年：朱熹任南康军时重建书院、置田、征书', '1180年：书院完成重建，朱熹亲自讲学', '1988年：列入全国重点文物保护单位'],
    figures: ['李渤：唐代在此隐居读书，白鹿洞名称由此而来', '朱熹：重建书院、制定揭示并确立课程', '陆九渊：登台讲义利之辨，形成白鹿洞之会', '王守仁：曾在白鹿洞讲学并思考格物之学'],
    heritage: ['礼圣殿、先贤书院、白鹿洞、紫阳书院、延宾馆', '朱子祠、御书阁与宋至明清碑林', '庐山五老峰的山水环境与讲学空间', '《白鹿洞书院揭示》及其书院制度影响'],
  },
  songyang: {
    founded: '北魏太和八年（484年）；宋景祐二年（1035年）改为书院',
    location: '河南省登封市嵩山南麓',
    overview: '嵩阳书院经历佛寺、道观到儒学书院的转变，是登封“天地之中”历史建筑群的重要组成部分。二程在此聚徒讲学，古建筑、碑刻和古柏共同构成书院的历史景观。',
    timeline: ['484年：始建嵩阳寺，早期为佛教场所', '隋唐时期：先后转为佛教经阁与道教嵩阳观', '1035年：成为儒学书院，与四大书院并称', '北宋：程颢、程颐在此聚徒数百人讲学', '2010年：作为登封“天地之中”历史建筑群列入世界文化遗产'],
    figures: ['程颢、程颐：在嵩阳讲学的理学家兄弟', '苏轼：北宋文学家，旧书院匾额相传为其题写', '徐浩：唐代书法家，《大唐嵩阳碑》书写者', '欧阳修：在唐碑背面留下题跋'],
    heritage: ['大门、先圣殿、讲堂、道统祠、藏书楼五进院落', '《大唐嵩阳观纪圣德感应之颂碑》', '两株相传为汉武帝所封的将军柏', '《二程全书》《二程遗书》等理学文献陈列'],
  },
  yingtian: {
    founded: '五代后晋时期由杨悫创办睢阳学舍',
    location: '河南省商丘市睢阳区商丘古城南湖畔',
    overview: '应天府书院又称睢阳书院、南都学舍，前身是杨悫创办的睢阳学舍。它位于城市而非山林，北宋时从私学升格为南京国子监，是书院制度官学化的重要案例。',
    timeline: ['五代后晋：杨悫创办睢阳学舍，戚同文继承师业', '1009年：宋真宗赐额“应天府书院”', '1014年：应天府升为南京，书院改称南京书院', '1043年：升为南京国子监，与三京国子监并列', '1126年：靖康之变中书院毁于战乱，教育中心随之南移'],
    figures: ['杨悫、戚同文：书院创办与早期传承者', '晏殊：任应天知府时扩展书院并延聘名师', '范仲淹：曾求学、任教并形成明体达用的教育思想', '孙复、胡瑗：曾在书院讲会，形成多学派交流'],
    heritage: ['睢阳学舍到应天府书院的制度演变', '六经课程与学、问、思、辨、行的学习次序', '范仲淹《南京书院题名记》相关文脉', '商丘古城、南湖与书院城市空间关系'],
  },
  shigu: {
    founded: '唐元和五年（810年）',
    location: '湖南省衡阳市石鼓区石鼓山，三水汇合处',
    overview: '石鼓书院位于蒸水、湘江、耒水汇合的石鼓山，是创建时间有确切史志记载且很早的书院之一。韩愈、朱熹、张栻等名贤的题咏与讲学，使它成为湖湘山水与书院文化交汇的代表。',
    timeline: ['810年：李宽在合江亭旁筑室读书，名为寻真观', '978年：宋太宗赐“石鼓书院”匾额和学田', '1035年：宋仁宗再次赐额，书院进入鼎盛时期', '1187年：朱熹、张栻到石鼓讲学，形成三绝碑文脉', '1939年：书院毁于战火；2006年按清代格局重修'],
    figures: ['李宽：唐代在石鼓筑室读书，开启书院源流', '韩愈：作《合江亭序》《石鼓歌》，使石鼓名扬文坛', '朱熹、张栻：南宋到石鼓讲学并留下碑刻', '苏轼、周敦颐、文天祥：曾题咏或到访石鼓山'],
    heritage: ['三水汇合、石鼓山与合江亭山水格局', '三绝碑、摩崖石刻及历代题咏', '宋代赐额、学田和讲学传统', '2006年按清代建筑格局重建的书院建筑'],
  },
}

const roomExhibits: Record<AcademyId, RoomExhibit[]> = {
  yuelu: [
    { title: '朱张会讲', category: '学术传统', summary: '南宋乾道三年，朱熹与张栻在岳麓会讲。', detail: '1167年朱熹访岳麓书院，与主教张栻论学，听讲者络绎不绝。这场会讲推动了湖湘学派与宋代理学的发展。', facts: ['时间：南宋乾道三年（1167年）', '人物：朱熹、张栻，以及前来听讲的四方学子', '影响：形成开放切磋的会讲传统，提升岳麓书院在中国哲学史上的地位'], kind: 'lecture', color: '#5b8c68', source: academySources.yuelu },
    { title: '岳麓书院学规', category: '育人制度', summary: '从读书、修身到经世，学问与品行并重。', detail: '岳麓书院历史上多次颁行教条与学规，朱熹重整书院时颁行《朱子书院教条》，清代又有王文清《岳麓书院学规》十八条。', facts: ['核心：尊敬师长、读书过笔、检点身心', '制度：讲学、藏书、祭祀构成书院的基本教育功能', '传承：学规把个人修养与经世致用连接起来'], kind: 'book', color: '#c99c52', source: academySources.yuelu },
    { title: '湖湘学派', category: '思想谱系', summary: '千年学府延续“惟楚有材，于斯为盛”的文脉。', detail: '岳麓书院以讲学、藏书、祭祀为核心功能，湖湘学派在此发展，形成重实践、求真知、勇担当的学术气质。', facts: ['地理：位于长沙岳麓山东麓，依山而建', '文脉：湖湘学派在南宋岳麓讲学活动中逐渐形成', '精神：重视实践、责任与对现实社会的回应'], kind: 'scroll', color: '#7aa47e', source: academySources.yuelu },
  ],
  bailudong: [
    { title: '白鹿洞书院揭示', category: '教育纲领', summary: '为学有序、修身有要、处事有方。', detail: '南宋淳熙六年（1179），朱熹重建白鹿洞书院并亲自讲学，制定《白鹿洞书院揭示》，内容涵盖为学、修身、处事、接物，影响后世书院教育。', facts: ['源流：书院始建于南唐升元四年（940年），有“海内第一书院”之誉', '纲领：为学之序、修身之要、处事之要、接物之要', '影响：成为后世书院制定学规、安排课程的重要范本'], kind: 'stele', color: '#a98258', source: academySources.bailudong },
    { title: '白鹿洞之会', category: '理学传承', summary: '朱熹与陆九渊在白鹿洞讨论义利之辨。', detail: '朱熹重建书院期间邀请陆九渊登台讲学，陆九渊以“君子喻于义，小人喻于利”阐发为学之道，形成著名的白鹿洞之会。', facts: ['人物：朱熹、陆九渊分别代表理学的重要学术方向', '事件：陆九渊在白鹿洞登台讲学，朱熹请他将讲稿写下', '主题：以义利之辨讨论读书人的志向与为学目的'], kind: 'lecture', color: '#c99c52', source: academySources.bailudong },
    { title: '碑林与御书阁', category: '文献遗存', summary: '宋至明清碑刻与御赐文献保存书院记忆。', detail: '白鹿洞书院现存碑廊、朱子祠、御书阁等遗存，碑刻记录书院沿革与历代讲学活动，是研究书院制度的重要实物资料。', facts: ['遗存：碑廊保存宋至明清古碑，记录院规、题名与修建历史', '建筑：礼圣殿、紫阳书院、朱子祠、御书阁构成院落格局', '环境：书院位于庐山五老峰南麓，山水环境与讲学空间相互结合'], kind: 'scroll', color: '#75939a', source: academySources.bailudong },
  ],
  songyang: [
    { title: '二程讲学', category: '名贤足迹', summary: '程颢、程颐在嵩阳聚徒讲学，传播洛学。', detail: '北宋景祐二年（1035），嵩阳书院成为儒学书院。程颢、程颐曾在此聚生徒数百人讲学，嵩阳由此成为程朱理学的重要传播地。', facts: ['沿革：嵩阳早期曾为佛教寺院、道教观宇，宋代转为儒学书院', '人物：程颢、程颐在此聚徒数百人讲学', '位置：书院位于河南登封嵩山南麓，北依峻极峰'], kind: 'lecture', color: '#7d8066', source: academySources.songyang },
    { title: '大唐嵩阳碑', category: '金石遗存', summary: '九米高唐碑，记录嵩阳观的历史遗迹。', detail: '《大唐嵩阳观纪圣德感应之颂碑》刻于唐天宝三年（744），由李林甫撰文、徐浩书写，是嵩山地区重要的唐代碑刻。', facts: ['年代：唐天宝三年（744年）刻立', '形制：碑高约九米，是嵩山地区体量重要的唐代碑刻', '价值：兼具历史记载、书法艺术与宗教文化研究价值'], kind: 'stele', color: '#a98258', source: academySources.songyang },
    { title: '将军柏与藏书楼', category: '院落遗存', summary: '古柏、讲堂、道统祠与藏书楼构成书院格局。', detail: '嵩阳书院现存清代布局，中轴线上依次为大门、先圣殿、讲堂、道统祠和藏书楼；书院内的两株古柏也成为著名文化景观。', facts: ['建筑：现存院落南北五进，古建筑一百余间', '藏书：藏书楼曾收藏《二程全书》《二程遗书》等理学文献', '景观：两株古柏相传为汉武帝所封，成为书院重要文化标志'], kind: 'book', color: '#b2a06f', source: academySources.songyang },
  ],
  yingtian: [
    { title: '睢阳学舍', category: '书院源流', summary: '杨悫创学，戚同文继业，士子远近归之。', detail: '应天府书院前身为五代后晋杨悫创办的睢阳学舍，弟子戚同文继承师业，北宋初登第者众，逐渐成为中原教育中心。', facts: ['创办：五代后晋杨悫在宋州创办睢阳学舍', '传承：戚同文继承师业，培养出多位后来进入台阁的士人', '特点：书院位于城市交通与政治中心，不同于多在山林的书院'], kind: 'book', color: '#a9694f', source: academySources.yingtian },
    { title: '应天府书院升格', category: '制度沿革', summary: '从民间书舍到北宋南京国子监。', detail: '大中祥符二年（1009），宋真宗赐额“应天府书院”；庆历三年（1043）升为南京国子监，成为中国古代书院中少见的官学化案例。', facts: ['1009年：宋真宗正式赐额“应天府书院”', '1014年：应天府升为北宋三京之一，书院改称南京书院', '1043年：升为南京国子监，与东京、西京国子监并列'], kind: 'scroll', color: '#d19a50', source: academySources.yingtian },
    { title: '范仲淹明体达用', category: '经世思想', summary: '六经为本，学问最终落实到行动。', detail: '范仲淹曾在应天府书院求学、任教，主张课程重经义、重时务、重实际，强调培养“经济之才”，形成学以致用的教育传统。', facts: ['人物：范仲淹曾在应天府书院求学，后来在此任教', '课程：以六经为基本教材，强调学、问、思、辨最后落实于行', '理念：不把科举仕进作为求学唯一目的，重视德才与社会责任'], kind: 'inkstone', color: '#b97d62', source: academySources.yingtian },
  ],
  shigu: [
    { title: '寻真观与石鼓肇始', category: '书院源流', summary: '唐元和五年，李宽筑室读书，成为书院雏形。', detail: '石鼓山三面环水，唐元和五年（810），李宽在合江亭旁建屋读书，取名寻真观，后来逐渐发展为石鼓书院。', facts: ['地点：位于蒸水、湘江、耒水三水汇合的石鼓山', '810年：李宽在合江亭旁筑屋读书，名为寻真观', '978年：宋太宗赐“石鼓书院”匾额和学田，书院进入发展期'], kind: 'stele', color: '#587b85', source: academySources.shigu },
    { title: '三绝碑', category: '名贤遗墨', summary: '朱熹撰记、张栻书写、韩愈诗文合为一碑。', detail: '淳熙十四年（1187），朱熹、张栻来到石鼓讲学，朱熹作《石鼓书院记》，张栻书韩愈《合江亭》诗与书院记，后世称为三绝碑。', facts: ['时间：南宋淳熙十四年（1187年）', '人物：朱熹撰《石鼓书院记》，张栻书写相关碑文', '渊源：碑中合有韩愈诗文，因此被后世称为“三绝碑”'], kind: 'scroll', color: '#c99c52', source: academySources.shigu },
    { title: '湘江合江亭', category: '山水文脉', summary: '蒸水、湘江、耒水交汇，名贤题咏相继。', detail: '石鼓书院位于三水汇合的石鼓山，韩愈曾为合江亭作序，苏轼、周敦颐、朱熹等名贤相继来此，形成独特的湖湘山水文脉。', facts: ['山水：石鼓山三面环水，形成“石鼓江山锦绣华”的景观传统', '文献：韩愈曾作《合江亭序》，记录湘江与蒸水交汇的景致', '近代：书院1939年毁于战火，2006年按清代建筑格局重建'], kind: 'lecture', color: '#6c9b9d', source: academySources.shigu },
  ],
}

function RoomAim() {
  const { camera } = useThree()

  useEffect(() => {
    camera.lookAt(0, 2.35, -4)
    camera.updateProjectionMatrix()
  }, [camera])

  return null
}

function FirstPersonRoomWalk() {
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

    const distance = speed * Math.min(delta, 0.05)
    camera.position.addScaledVector(forward, movingForward * distance)
    camera.position.addScaledVector(right, movingRight * distance)
    camera.position.x = Math.max(-13.2, Math.min(13.2, camera.position.x))
    camera.position.z = Math.max(-10.3, Math.min(13.5, camera.position.z))
    camera.position.y = 2.35
  })

  return null
}

function ExhibitObject({ kind, color }: { kind: ExhibitKind; color: string }) {
  if (kind === 'stele') {
    return <group>
      <mesh position={[0, 1.15, 0]} castShadow><boxGeometry args={[1.1, 2.3, 0.25]} /><meshStandardMaterial color="#6d7168" roughness={0.82} /></mesh>
      <mesh position={[0, 2.38, 0]}><boxGeometry args={[1.35, 0.18, 0.34]} /><meshStandardMaterial color="#8b8a76" roughness={0.78} /></mesh>
      <mesh position={[0, 1.25, -0.15]}><boxGeometry args={[0.56, 1.5, 0.02]} /><meshStandardMaterial color="#c7b98b" emissive="#8e7541" emissiveIntensity={0.35} /></mesh>
    </group>
  }
  if (kind === 'scroll') {
    return <group rotation={[0, 0, Math.PI / 2]}>
      <mesh position={[0, 1.15, 0]} castShadow><cylinderGeometry args={[0.18, 0.18, 2.3, 18]} /><meshStandardMaterial color={color} roughness={0.56} /></mesh>
      <mesh position={[0, 1.15, -0.1]}><boxGeometry args={[0.72, 1.65, 0.025]} /><meshStandardMaterial color="#e8d6a9" roughness={0.84} /></mesh>
      <mesh position={[0, 1.15, -0.13]}><boxGeometry args={[0.5, 0.06, 0.035]} /><meshStandardMaterial color="#9a4c35" /></mesh>
    </group>
  }
  if (kind === 'inkstone') {
    return <group>
      <mesh position={[0, 0.62, 0]} rotation={[0, 0.2, 0]} castShadow><boxGeometry args={[1.9, 0.22, 1.2]} /><meshStandardMaterial color="#374c4a" roughness={0.62} /></mesh>
      <mesh position={[0, 0.8, 0]}><torusGeometry args={[0.34, 0.08, 12, 24, Math.PI * 1.6]} /><meshStandardMaterial color="#c99c52" emissive="#9c6624" emissiveIntensity={0.45} /></mesh>
      <mesh position={[0.45, 0.86, 0.22]}><sphereGeometry args={[0.16, 16, 12]} /><meshStandardMaterial color="#172524" /></mesh>
    </group>
  }
  if (kind === 'lecture') {
    return <group>
      <mesh position={[0, 0.65, 0]} castShadow><boxGeometry args={[1.8, 0.3, 1.15]} /><meshStandardMaterial color="#8d4a32" roughness={0.62} /></mesh>
      <mesh position={[0, 0.9, 0]}><boxGeometry args={[1.5, 0.12, 0.9]} /><meshStandardMaterial color="#d8b66c" roughness={0.62} /></mesh>
      {[-0.62, 0.62].map((x) => <mesh key={x} position={[x, 1.35, 0]}><boxGeometry args={[0.12, 0.85, 0.12]} /><meshStandardMaterial color="#67402d" /></mesh>)}
    </group>
  }
  return <group>
    <mesh position={[-0.32, 0.72, 0]} rotation={[0, 0.04, -0.06]} castShadow><boxGeometry args={[1.35, 0.2, 1.65]} /><meshStandardMaterial color="#7c3429" roughness={0.56} /></mesh>
    <mesh position={[0.32, 0.86, 0]} rotation={[0, -0.04, 0.06]} castShadow><boxGeometry args={[1.35, 0.2, 1.65]} /><meshStandardMaterial color="#d7b36a" roughness={0.66} /></mesh>
    <mesh position={[0.32, 0.99, 0]}><boxGeometry args={[1.1, 0.035, 1.4]} /><meshStandardMaterial color="#eee1bd" roughness={0.9} /></mesh>
  </group>
}

function ExhibitCase({ exhibit, position, onSelect }: { exhibit: RoomExhibit; position: [number, number, number]; onSelect: (exhibit: RoomExhibit) => void }) {
  return <group position={position} userData={{ exhibit }}>
    <mesh position={[0, 0.35, 0]} castShadow><boxGeometry args={[3.5, 0.7, 2.4]} /><meshStandardMaterial color="#754432" roughness={0.66} /></mesh>
    <mesh position={[0, 1.55, 0]} castShadow><boxGeometry args={[3.1, 1.7, 2]} /><meshStandardMaterial color="#d8c49a" transparent opacity={0.28} roughness={0.12} metalness={0.08} /></mesh>
    <mesh position={[0, 2.38, 0]}><boxGeometry args={[3.4, 0.12, 2.3]} /><meshStandardMaterial color={exhibit.color} emissive={exhibit.color} emissiveIntensity={0.28} /></mesh>
    <mesh position={[-1.68, 1.5, 0]}><boxGeometry args={[0.08, 2.25, 2.1]} /><meshStandardMaterial color="#d39e4e" emissive="#925d20" emissiveIntensity={0.35} /></mesh>
    <mesh position={[1.68, 1.5, 0]}><boxGeometry args={[0.08, 2.25, 2.1]} /><meshStandardMaterial color="#d39e4e" emissive="#925d20" emissiveIntensity={0.35} /></mesh>
    <ExhibitObject kind={exhibit.kind} color={exhibit.color} />
    <Html position={[0, 3.05, 0]} center distanceFactor={7}>
      <button
        type="button"
        className="academy-exhibit-label"
        style={{ '--exhibit-color': exhibit.color } as React.CSSProperties}
        aria-label={`查看${exhibit.title}详情`}
        onClick={(event) => { event.stopPropagation(); onSelect(exhibit) }}
      >
        <span>{exhibit.category}</span><strong>{exhibit.title}</strong><small>点击查看</small>
      </button>
    </Html>
  </group>
}

function RoomAimInteraction({ onSelect }: { onSelect: (exhibit: RoomExhibit) => void }) {
  const { camera, gl, scene } = useThree()

  useEffect(() => {
    const raycaster = new Raycaster()
    const center = new Vector2(0, 0)

    const findExhibit = (object: Object3D): RoomExhibit | null => {
      let current: Object3D | null = object
      while (current) {
        const exhibit = current.userData.exhibit as RoomExhibit | undefined
        if (exhibit) return exhibit
        current = current.parent
      }
      return null
    }

    const handleMouseDown = (event: MouseEvent) => {
      if (event.button !== 0) return
      // The first click belongs to pointer lock. Select only on a later click
      // while the camera is already under mouse control.
      if (document.pointerLockElement !== gl.domElement) return

      raycaster.setFromCamera(center, camera)
      const hit = raycaster.intersectObjects(scene.children, true)
        .map((intersection) => findExhibit(intersection.object))
        .find((exhibit): exhibit is RoomExhibit => Boolean(exhibit))

      if (hit) onSelect(hit)
    }

    gl.domElement.addEventListener('mousedown', handleMouseDown)
    return () => gl.domElement.removeEventListener('mousedown', handleMouseDown)
  }, [camera, gl, onSelect, scene])

  return null
}

function AcademyRoom({ academy, onSelect }: { academy: (typeof exhibitionHalls)[AcademyId]; onSelect: (exhibit: RoomExhibit) => void }) {
  const exhibits: RoomExhibit[] = roomExhibits[academy.id as AcademyId]
  return (
    <group>
      <mesh position={[0, -0.25, 0]} receiveShadow>
        <boxGeometry args={[30, 0.4, 24]} />
        <meshStandardMaterial color="#5c5d4c" roughness={0.94} />
      </mesh>
      <mesh position={[0, -0.02, 0]} receiveShadow>
        <boxGeometry args={[28.5, 0.12, 22.5]} />
        <meshStandardMaterial color="#81765b" roughness={0.88} />
      </mesh>

      <mesh position={[0, 6, -11.8]} receiveShadow>
        <boxGeometry args={[30, 12, 0.45]} />
        <meshStandardMaterial color="#d2bd8c" roughness={0.88} />
      </mesh>
      <mesh position={[-15, 6, 0]} receiveShadow>
        <boxGeometry args={[0.45, 12, 24]} />
        <meshStandardMaterial color="#c4a978" roughness={0.88} />
      </mesh>
      <mesh position={[15, 6, 0]} receiveShadow>
        <boxGeometry args={[0.45, 12, 24]} />
        <meshStandardMaterial color="#c4a978" roughness={0.88} />
      </mesh>

      {[-9, 0, 9].map((x) => (
        <mesh key={x} position={[x, 11.5, -1]}>
          <boxGeometry args={[4.6, 0.12, 0.55]} />
          <meshStandardMaterial
            color="#efc46b"
            emissive="#c8872f"
            emissiveIntensity={1.6}
          />
        </mesh>
      ))}

      <mesh position={[0, 7.1, -11.48]}><boxGeometry args={[22, 7.8, 0.08]} /><meshStandardMaterial color="#ead9ad" roughness={0.8} /></mesh>
      <mesh position={[0, 7.1, -11.38]}><boxGeometry args={[13.2, 5.4, 0.06]} /><meshStandardMaterial color={academy.color} emissive={academy.color} emissiveIntensity={0.18} /></mesh>
      <mesh position={[0, 4.38, -11.32]}><boxGeometry args={[13.8, 0.1, 0.1]} /><meshStandardMaterial color="#d4a54e" emissive="#8d5c1e" emissiveIntensity={0.5} /></mesh>
      <mesh position={[0, 9.82, -11.32]}><boxGeometry args={[13.8, 0.1, 0.1]} /><meshStandardMaterial color="#d4a54e" emissive="#8d5c1e" emissiveIntensity={0.5} /></mesh>
      <mesh userData={{ exhibit: exhibits[0] }} position={[-10.2, 5.6, -11.3]}><boxGeometry args={[2.7, 6.3, 0.08]} /><meshStandardMaterial color="#557366" roughness={0.72} /></mesh>
      <mesh userData={{ exhibit: exhibits[2] }} position={[10.2, 5.6, -11.3]}><boxGeometry args={[2.7, 6.3, 0.08]} /><meshStandardMaterial color="#557366" roughness={0.72} /></mesh>

      {exhibits.map((exhibit: RoomExhibit, index: number) => <ExhibitCase key={exhibit.title} exhibit={exhibit} position={[-7.2 + index * 7.2, 0, -7.9]} onSelect={onSelect} />)}
      <mesh position={[0, 4.1, -8.55]}><boxGeometry args={[7.5, 0.12, 0.12]} /><meshStandardMaterial color="#d39e4e" emissive="#925d20" emissiveIntensity={0.45} /></mesh>
      <Html position={[0, 7.2, -7.7]} center distanceFactor={9}>
        <div className="academy-room-title" style={{ '--academy-color': academy.color } as React.CSSProperties}>
          <span>THEMATIC EXHIBITION</span>
          <strong>{academy.name}</strong>
          <small>{academy.subtitle}</small>
        </div>
      </Html>
      <Html position={[-10.2, 5.7, -11.18]} center distanceFactor={8}>
        <button
          type="button"
          className="academy-room-panel"
          aria-label={`查看${exhibits[0].title}详情`}
          onClick={(event) => { event.stopPropagation(); onSelect(exhibits[0]) }}
        >
          <strong>历史源流</strong><span>沿革 · 名贤 · 文脉</span>
        </button>
      </Html>
      <Html position={[10.2, 5.7, -11.18]} center distanceFactor={8}>
        <button
          type="button"
          className="academy-room-panel"
          aria-label={`查看${exhibits[2].title}详情`}
          onClick={(event) => { event.stopPropagation(); onSelect(exhibits[2]) }}
        >
          <strong>精神传承</strong><span>修身 · 讲学 · 经世</span>
        </button>
      </Html>

      <ambientLight intensity={1.1} color="#f1e0bd" />
      <directionalLight position={[-7, 12, 8]} intensity={2.4} color="#ffe7b0" castShadow />
      <pointLight position={[-7, 7, -6]} intensity={24} distance={18} color="#ffd477" />
      <pointLight position={[0, 8, -6]} intensity={26} distance={20} color="#f3c16a" />
      <pointLight position={[7, 7, -6]} intensity={24} distance={18} color="#ffd477" />
    </group>
  )
}

export default function AcademyExhibitionPage() {
  const navigate = useNavigate()
  const { academyId } = useParams<{ academyId: string }>()
  const id = academyIds.includes(academyId as AcademyId) ? (academyId as AcademyId) : null
  const academy = (id ? exhibitionHalls[id] : exhibitionHalls.yuelu) as (typeof exhibitionHalls)[AcademyId]
  const profile = academyProfiles[academy.id as AcademyId]
  const [selectedExhibit, setSelectedExhibit] = useState<RoomExhibit | null>(null)

  useEffect(() => {
    if (!id) navigate('/academy-3d', { replace: true })
  }, [id, navigate])

  return (
    <main className={`immersive3d-page immersive3d-academy-room${selectedExhibit ? ' has-academy-scroll' : ''}`}>
      <KeyboardControls
        map={[
          { name: 'forward', keys: ['w', 'W', 'ArrowUp'] },
          { name: 'back', keys: ['s', 'S', 'ArrowDown'] },
          { name: 'left', keys: ['a', 'A', 'ArrowLeft'] },
          { name: 'right', keys: ['d', 'D', 'ArrowRight'] },
        ]}
      >
        <Canvas className="immersive3d-room-walk-area" shadows dpr={[1, 1.5]} camera={{ position: [0, 2.35, 13.5], fov: 68 }}>
          <color attach="background" args={['#d2bd8c']} />
          <fog attach="fog" args={['#d2bd8c', 18, 38]} />
          <RoomAim />
          <AcademyRoom academy={academy} onSelect={setSelectedExhibit} />
          <RoomAimInteraction onSelect={setSelectedExhibit} />
          <PointerLockControls selector="canvas" />
          <FirstPersonRoomWalk />
        </Canvas>
      </KeyboardControls>

      <div className="immersive3d-exhibition-hud">
        <button className="immersive3d-back" onClick={() => navigate('/academy-3d')}>
          返回大厅
        </button>
        <div className="immersive3d-location">
          <span>数智书院 · 主题展厅</span>
          <strong>{academy.name}</strong>
          <small>{academy.subtitle}</small>
        </div>
      </div>
      {selectedExhibit && (
        <section className="academy-exhibit-scroll" style={{ '--exhibit-color': selectedExhibit.color } as React.CSSProperties}>
          <button className="immersive3d-close" onClick={() => setSelectedExhibit(null)} aria-label="关闭展品详情">×</button>
          <span className="academy-scroll-kicker">书院文脉档案 · {selectedExhibit.category}</span>
          <h2>{selectedExhibit.title}</h2>
          <p className="academy-exhibit-summary">{selectedExhibit.summary}</p>
          <ul className="academy-scroll-facts">
            {selectedExhibit.facts.map((fact) => <li key={fact}>{fact}</li>)}
          </ul>
          <p>{selectedExhibit.detail}</p>
          <div className="academy-scroll-profile">
            <h3>书院全景档案</h3>
            <div className="academy-scroll-meta">
              <span><b>始建</b>{profile.founded}</span>
              <span><b>位置</b>{profile.location}</span>
            </div>
            <p>{profile.overview}</p>
            <h4>历史时间线</h4>
            <ul>{profile.timeline.map((item) => <li key={item}>{item}</li>)}</ul>
            <h4>代表人物</h4>
            <ul>{profile.figures.map((item) => <li key={item}>{item}</li>)}</ul>
            <h4>建筑与文物</h4>
            <ul>{profile.heritage.map((item) => <li key={item}>{item}</li>)}</ul>
          </div>
          <a
            className="academy-exhibit-source"
            href={selectedExhibit.source.url}
            target="_blank"
            rel="noreferrer"
          >
            资料来源：{selectedExhibit.source.label} {'>'}
          </a>
        </section>
      )}
      <div className="immersive3d-crosshair" aria-hidden="true"><span /></div>
      <div className="academy-room-tip">点击画面进入漫游 · WASD移动 · ESC退出视角</div>
    </main>
  )
}
