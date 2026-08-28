import { useEffect, useMemo, useState, type CSSProperties, type ReactNode } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { FiActivity, FiArrowLeft, FiArrowRight, FiArrowUpRight, FiBookOpen, FiChevronRight, FiClock, FiInfo, FiMapPin, FiMessageCircle, FiPause, FiPlay, FiX } from 'react-icons/fi'
import { Navigate, useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import AcademyAgentPage from './AcademyAgentPage'
import AcademyMap from './AcademyMap'
import { getAcademyAgentContext } from '../../data/academyAgentContext'
import './academyHall.css'
import { academyPhotoCollections, getAcademyPhotoUrl, photoCategoryOrder, type AcademyPhoto } from './academyPhotos'

export type AcademyId = 'yuelu' | 'bailudong' | 'songyang' | 'yingtian' | 'shigu'

type Exhibit = {
  title: string
  type: string
  period: string
  summary: string
  detail: string
  points: string[]
}

type Academy = {
  id: AcademyId
  name: string
  alias: string
  region: string
  period: string
  color: string
  seal: string
  motto: string
  introduction: string
  history: string
  figures: string[]
  exhibits: Exhibit[]
  photoLocalFile?: string
  photoSource?: string
  photoCredit?: string
}

const academies: Record<AcademyId, Academy> = {
  yuelu: {
    id: 'yuelu', name: '岳麓书院', alias: '千年学府', region: '湖南 · 长沙', period: '创建于北宋开宝九年（976）', color: '#2d644b', seal: '岳', photoLocalFile: '岳麓书院.jpg', photoSource: 'https://commons.wikimedia.org/wiki/File:Lecture_Hall_of_Yuelu_Academy_20251018.jpg', photoCredit: '颐园居 · CC BY-SA 4.0',
    motto: '惟楚有材，于斯为盛',
    introduction: '岳麓书院是中国古代四大书院之一，历经宋、元、明、清，文脉延续至今。这里既是讲学、藏书和祭祀的场所，也是湖湘学派与经世致用思想的重要发生地。',
    history: '朱熹、张栻曾在此举行会讲，王夫之、魏源、曾国藩等湖湘先贤的思想也与这座书院紧密相连。今天的岳麓书院隶属湖南大学，仍承担着传统文化研究与教育传播的使命。',
    figures: ['朱熹', '张栻', '王夫之', '曾国藩'],
    exhibits: [
      { title: '朱张会讲', type: '学术事件', period: '南宋乾道三年 · 1167', summary: '朱熹与张栻在岳麓书院论学，形成中国书院史上的会讲典范。', detail: '朱熹访长沙，与主持岳麓书院的张栻围绕理学、读书与修身展开讨论。两位学者相互质证、各抒己见，促成了不同学术观点之间的公开交流，也使岳麓书院成为南宋学术中心。', points: ['核心人物：朱熹、张栻', '文化影响：湖湘学派、理学会讲', '互动提示：比较两位先生的为学主张'] },
      { title: '赫曦台', type: '建筑遗存', period: '南宋 · 讲学空间', summary: '一座承载观景、题咏与讲学记忆的古台。', detail: '赫曦台位于岳麓书院前，是书院建筑格局中极具识别度的空间。朱熹曾登台观日，后人以“赫曦”命名，寄托着对光明与学问的向往。台上的题刻记录了历代访学者的文化回响。', points: ['空间属性：书院公共讲学空间', '关键词：观日、题咏、文脉', '观察角度：建筑如何服务于教育'] },
      { title: '岳麓学规', type: '制度文献', period: '清代 · 学规传统', summary: '从日常作息、读书方法到师生礼仪，建立书院共同生活的秩序。', detail: '岳麓书院学规将求学落实到日常生活：读书要过笔、要循序渐进，也要关心父母、尊敬师长。它体现了古代书院将知识学习、人格养成和社会责任合在一起的教育理想。', points: ['制度重点：读书、修身、处世', '今日连接：学习计划与公共规则', '思考问题：规则如何支持自由求学'] },
    ],
  },
  bailudong: {
    id: 'bailudong', name: '白鹿洞书院', alias: '海内第一书院', region: '江西 · 庐山', period: '始建于南唐升元四年（940）', color: '#9a6b3d', seal: '白', photoLocalFile: 'White Deer Grotto Academy.jpg', photoSource: 'https://commons.wikimedia.org/wiki/File:White_Deer_Grotto_Academy_in_Jiujiang,_Jiangxi_province.jpg', photoCredit: 'Pauloleong2002 · CC BY-SA 4.0',
    motto: '博学之，审问之，慎思之，明辨之，笃行之',
    introduction: '白鹿洞书院坐落于庐山五老峰南麓。南宋朱熹重建书院、制定《白鹿洞书院揭示》，将教育目标、学习次序与修身原则系统地写入书院制度。',
    history: '书院依山就势，形成先贤祠、礼圣殿、讲堂、御书阁等层层递进的空间。它不仅保存了古代书院教育的制度样本，也呈现出山林环境与读书生活之间的关系。',
    figures: ['李渤', '朱熹', '陆九渊', '王守仁'],
    exhibits: [
      { title: '白鹿洞书院揭示', type: '教育文献', period: '南宋淳熙七年 · 1180', summary: '朱熹为书院制定的教育纲领，成为后世书院学规的经典范本。', detail: '《白鹿洞书院揭示》从父子、君臣、夫妇、长幼、朋友五伦出发，提出“博学、审问、慎思、明辨、笃行”的学习次序。它把道德实践与知识求索连在一起，影响了元明清书院教育。', points: ['五教之目：人伦与责任', '为学之序：由博学而笃行', '修身之要：言行相顾'] },
      { title: '白鹿与书院', type: '文脉故事', period: '唐代 · 书院源流', summary: '白鹿传说让一处读书旧址拥有了亲切而持久的文化意象。', detail: '李渤隐居庐山读书时曾养白鹿，白鹿洞由此得名。传说与史实共同塑造了书院的文化记忆：远离尘嚣的山林、与自然相伴的阅读，以及将个人修养放置于天地之间的传统。', points: ['文化意象：白鹿、山林、读书', '空间体验：从洞名到书院格局', '延伸阅读：古代隐逸与教育'] },
      { title: '御书阁', type: '建筑遗存', period: '宋元以来 · 藏书空间', summary: '书院中收藏经籍、承接文脉的重要建筑。', detail: '藏书是古代书院的核心功能之一。御书阁既用于保存皇帝赐书，也承担着典籍整理、师生借阅与学术传承的职责。书院的“读书”因此并非个人行为，而是由藏书、讲学和共同体共同支撑的文化活动。', points: ['核心功能：藏书与传书', '观察角度：知识如何被保存', '今日连接：数字资源与开放共享'] },
    ],
  },
  songyang: {
    id: 'songyang', name: '嵩阳书院', alias: '程朱理学重镇', region: '河南 · 登封', period: '始建于北魏太和八年（484）', color: '#6f7657', seal: '嵩', photoLocalFile: '登封嵩阳书院.JPG', photoSource: 'https://commons.wikimedia.org/wiki/File:20250531_Songyang_Academy_02.jpg', photoCredit: 'Windmemories · CC BY-SA 4.0',
    motto: '学以成人，学以明理',
    introduction: '嵩阳书院位于嵩山南麓，经历佛寺、道观到儒学书院的变化。这里保存着古代建筑、碑刻和古柏共同构成的历史景观。',
    history: '北宋时期，程颢、程颐曾在嵩阳书院讲学，二程理学思想由此传播。书院与嵩山文化景观相互依存，体现了中国古代教育空间“依山林而建、借自然明理”的特色。',
    figures: ['程颢', '程颐', '司马光', '范仲淹'],
    exhibits: [
      { title: '二程讲学', type: '学术传统', period: '北宋 · 理学讲会', summary: '程颢、程颐在嵩阳聚徒讲学，推动理学思想传播。', detail: '二程重视日常涵养、格物穷理与为己之学。他们的讲学不是单向灌输，而是通过问答、辨析与自我反省，让学习者在生活实践中理解“理”的意义。', points: ['核心主张：为己之学', '学习方式：讲论、质疑、反思', '今日连接：从记知识到建构理解'] },
      { title: '大唐嵩阳观纪圣德感应颂', type: '碑刻文物', period: '唐天宝三年 · 744', summary: '记录嵩阳历史变迁的著名碑刻，也是书法与宗教文化的实物见证。', detail: '碑刻以宏大的叙事记录嵩阳观的历史，碑身高大、文字精整，具有重要的书法、文献和历史价值。它提醒我们，书院和学术空间从来不是孤立存在，而是与地方社会、宗教传统和国家文化相互交织。', points: ['文物价值：历史、书法、文献', '观看方法：从碑文到空间语境', '保护议题：石质文物的长期维护'] },
      { title: '将军柏', type: '自然遗产', period: '古柏 · 千年见证', summary: '两株古柏与书院建筑共同组成嵩阳的时间坐标。', detail: '嵩阳书院中的古柏相传为汉武帝封树，虽带有传说色彩，却真实地呈现了古人借树木表达时间、秩序与敬意的方式。古树与碑刻、讲堂并置，形成一种独特的历史现场。', points: ['景观角色：自然与人文并置', '关键词：时间、见证、敬意', '观察角度：一棵树如何成为文化记忆'] },
    ],
  },
  yingtian: {
    id: 'yingtian', name: '应天书院', alias: '北宋教育制度化样本', region: '河南 · 商丘', period: '五代后晋时期由杨悫创办', color: '#a15f4e', seal: '应', photoLocalFile: '应天书院大门.jpg', photoSource: 'https://article.xuexi.cn/html/2390676221166037830.html', photoCredit: '来源：河南学习平台',
    motto: '以天下为己任',
    introduction: '应天书院前身为睢阳学舍，地处交通与文化交汇之地。北宋时期书院升格为府学，后成为南京国子监，是书院走向制度化的重要案例。',
    history: '范仲淹曾在应天书院求学、执教，书院形成了“勤学、笃行、经世”的教育传统。它连接民间讲学与国家教育制度，反映了北宋士人参与公共事务的理想。',
    figures: ['杨悫', '范仲淹', '晏殊', '孙复'],
    exhibits: [
      { title: '范仲淹读书处', type: '人物故事', period: '北宋 · 睢阳学舍', summary: '范仲淹在困顿中坚持读书，后来将个人求学与天下责任连在一起。', detail: '范仲淹早年在应天书院读书，生活清苦却不改其志。他提出“先天下之忧而忧，后天下之乐而乐”，这份精神并非抽象口号，而是从长期读书、实践和面对现实中逐渐形成的。', points: ['人物关键词：勤学、担当、经世', '精神线索：个人成长与公共责任', '今日连接：学习成果如何服务社会'] },
      { title: '书院升府学', type: '制度变迁', period: '北宋大中祥符年间', summary: '应天书院由私学走向官方教育，呈现书院制度化的历史过程。', detail: '随着北宋教育政策变化，应天书院获得官方支持，逐渐成为府学和国子监体系的一部分。这种变化扩大了教育资源的覆盖面，同时也提出了新的问题：民间学术的活力如何在制度中延续。', points: ['制度关键词：私学、府学、国子监', '历史视角：教育资源如何扩散', '思考问题：开放与规范如何平衡'] },
      { title: '六经课程', type: '课程体系', period: '北宋 · 经学教育', summary: '以经典阅读、讲论和实践为主的课程传统。', detail: '应天书院的课程以经学为核心，同时强调文章、历史和现实事务。古代书院课程不是简单的篇目清单，而是一套从阅读经典到理解社会、从课堂讲论到身体力行的成长路径。', points: ['课程结构：经典、文章、时务', '学习方法：读、讲、问、行', '今日连接：跨学科学习与实践项目'] },
    ],
  },
  shigu: {
    id: 'shigu', name: '石鼓书院', alias: '湖湘文脉源流', region: '湖南 · 衡阳', period: '始建于唐元和五年（810）', color: '#397486', seal: '石', photoLocalFile: 'Shigu Academy59.jpg', photoSource: 'https://commons.wikimedia.org/wiki/File:Shigu_Academy59.jpg', photoCredit: 'FreeePedia · CC BY-SA 4.0',
    motto: '江山留胜迹，文脉有传人',
    introduction: '石鼓书院位于蒸水、湘江、耒水汇合处的石鼓山。韩愈、朱熹、张栻等人的题咏与讲学，让它成为湖湘山水与书院文化交汇的代表。',
    history: '书院依山临水，既有独特的自然格局，也保存着碑刻、题咏和讲学传统。它展现了古代书院如何借助交通、山水与地方文脉，形成开放的文化传播网络。',
    figures: ['李宽', '韩愈', '朱熹', '张栻'],
    exhibits: [
      { title: '石鼓书院源流', type: '书院沿革', period: '唐至清 · 千年文脉', summary: '一处临水读书空间，逐渐发展为湖湘文化的重要地标。', detail: '石鼓山因形似鼓而得名，唐代李宽筑室读书，后世不断扩建。书院依托三水汇流的地理位置，连接南北交通与地方学术，形成了独特的开放性。', points: ['空间关键词：三水汇流、临江讲学', '历史线索：读书屋、书院、文化地标', '观察角度：地理如何塑造文脉'] },
      { title: '韩愈石鼓歌', type: '文学遗产', period: '唐元和年间', summary: '以诗歌为石鼓书院留下早期而鲜明的文化印记。', detail: '韩愈《石鼓歌》关注石鼓文物的保存与流传，既是文学作品，也是关于古代文化遗产保护的思考。作品让一处地方景观进入更广阔的文化记忆，并持续影响后人对石鼓的想象。', points: ['作品价值：文学与金石学', '核心问题：文物为何需要被记录', '今日连接：文化遗产的公众传播'] },
      { title: '朱张讲学', type: '学术事件', period: '南宋淳熙年间', summary: '朱熹、张栻在湖湘地区的讲学活动，延续了会讲传统。', detail: '朱熹与张栻多次往来湖湘，围绕理学与教育展开讨论。石鼓书院因此成为湖湘学术网络中的重要节点，见证了学者之间通过游学、讲会和书信进行的知识交流。', points: ['交流方式：游学、会讲、书信', '思想关键词：理学、经世、实践', '今日连接：跨校交流与开放课堂'] },
    ],
  },
}

const academyOrder: AcademyId[] = ['bailudong', 'shigu', 'yuelu', 'songyang', 'yingtian']
const lobbyAcademyOrder: AcademyId[] = ['yuelu', 'bailudong', 'songyang', 'yingtian', 'shigu']

const guideCharacterImage = '/guide-assets/scholar-guide-cutout.png'

const lobbyPhotoFiles: Record<AcademyId, string> = {
  yuelu: 'yuelu-verified-main.jpg',
  bailudong: 'bailudong-verified-main.jpg',
  songyang: '登封嵩阳书院.JPG',
  yingtian: '应天书院全景.jpg',
  shigu: 'shigu-verified-main.jpg',
}

const guideLines = [
  {
    label: '怎么参观',
    title: '先从五院总览开始',
    text: '你可以先看长卷上的“五院同源”，再从下方五座门楼进入具体书院展厅。每个展厅都准备了实景照片、代表展项和历史脉络。',
  },
  {
    label: '五院关系',
    title: '五院同源，各有文脉',
    text: '白鹿洞重学规，石鼓依山水传文脉，岳麓承湖湘学统，嵩阳连理学与嵩山，应天体现书院制度化路径。',
  },
  {
    label: '智能问答',
    title: '可以直接问我',
    text: '如果你想追问人物、制度、建筑或文化影响，可以进入展馆智导，把问题交给书院智能体继续展开。',
  },
] as const

function CoverGuideCharacter({ onOpenAgent }: { onOpenAgent: () => void }) {
  const reduceMotion = useReducedMotion()
  const [open, setOpen] = useState(false)
  const [activeLine, setActiveLine] = useState(0)
  const [imageFailed, setImageFailed] = useState(false)
  const currentLine = guideLines[activeLine]

  return (
    <motion.div
      className={`cover-guide${open ? ' is-open' : ''}`}
      initial={reduceMotion ? false : { opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.24, duration: .5 }}
    >
      {open && (
        <motion.div
          className="guide-dialog"
          initial={reduceMotion ? false : { opacity: 0, y: 10, scale: .96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: .24 }}
        >
          <div className="guide-dialog-head">
            <span>AI 导览员</span>
            <button type="button" aria-label="关闭导览员对话" onClick={() => setOpen(false)}><FiX /></button>
          </div>
          <strong>{currentLine.title}</strong>
          <p>{currentLine.text}</p>
          <div className="guide-dialog-actions" aria-label="切换导览员对话">
            {guideLines.map((line, index) => (
              <button
                key={line.label}
                type="button"
                className={index === activeLine ? 'active' : undefined}
                onClick={() => setActiveLine(index)}
              >
                {line.label}
              </button>
            ))}
          </div>
          <button className="guide-agent-link" type="button" onClick={onOpenAgent}>
            进入展馆智导 <FiArrowRight />
          </button>
        </motion.div>
      )}

      <button
        className="guide-character"
        type="button"
        aria-expanded={open}
        aria-label={open ? '收起导览员对话' : '打开导览员对话'}
        onClick={() => setOpen((value) => !value)}
      >
        <span className="guide-hint">问问导览</span>
        <span className="guide-avatar-frame" aria-hidden="true">
          {imageFailed ? (
            <span className="guide-avatar-fallback">AI</span>
          ) : (
            <img
              className="guide-character-img"
              src={guideCharacterImage}
              alt=""
              loading="eager"
              draggable={false}
              onError={() => setImageFailed(true)}
            />
          )}
        </span>
      </button>
    </motion.div>
  )
}

function AcademyGate({ academy, index, onClick }: { academy: Academy; index: number; onClick: () => void }) {
  const reduceMotion = useReducedMotion()

  return (
    <motion.button
      className={`cover-gate cover-gate-${academy.id}`}
      style={{ '--gate-accent': academy.color } as CSSProperties}
      initial={reduceMotion ? false : { opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: .72 + index * .09, duration: .55, ease: 'easeOut' }}
      whileHover={reduceMotion ? undefined : { y: -9 }}
      onClick={onClick}
    >
      <span className="gate-smoke" aria-hidden="true"><i /><i /><i /></span>
      <span className="gate-page" aria-hidden="true"><i /><i /><i /></span>
      <span className="gate-roof"><i /><i /><i /></span>
      <span className="gate-body">
        <span className="gate-columns"><i /><i /></span>
        <span className="gate-tablet"><b>{academy.seal}</b><small>书院</small></span>
        <span className="gate-threshold" />
      </span>
      <span className="gate-copy"><strong>{academy.name}</strong><small>{academy.alias}</small></span>
      <span className="gate-enter">入院观展 <FiArrowRight /></span>
    </motion.button>
  )
}

function LobbyAcademyCard({ academy, index, onClick }: { academy: Academy; index: number; onClick: () => void }) {
  const [imageFailed, setImageFailed] = useState(false)
  const photoFile = lobbyPhotoFiles[academy.id]

  return (
    <button
      type="button"
      className={`hall-academy-card${academy.id === 'yuelu' ? ' is-featured' : ''}`}
      style={{ '--academy-accent': academy.color } as CSSProperties}
      onClick={onClick}
    >
      <span className="hall-academy-card-image">
        {imageFailed ? (
          <span className="hall-academy-card-fallback"><FiBookOpen /><b>{academy.name}</b></span>
        ) : (
          <img
            src={`/academy-photos/${encodeURIComponent(photoFile)}`}
            alt={`${academy.name}实景`}
            loading="lazy"
            onError={() => setImageFailed(true)}
          />
        )}
        <span className="hall-academy-card-index">0{index + 1}</span>
        <span className="hall-academy-card-arrow"><FiArrowUpRight /></span>
      </span>
      <span className="hall-academy-card-copy">
        <strong>{academy.name}</strong>
        <small>{academy.region}</small>
        <em>{academy.introduction.slice(0, 32)}...</em>
        <span>进入书院 <FiArrowRight /></span>
      </span>
    </button>
  )
}

function HallServiceLink({ icon, index, title, detail, onClick }: { icon: ReactNode; index: string; title: string; detail: string; onClick: () => void }) {
  return (
    <button type="button" className="hall-service-link" onClick={onClick}>
      <span className="hall-service-index">{index}</span>
      <span className="hall-service-icon">{icon}</span>
      <span className="hall-service-copy"><strong>{title}</strong><small>{detail}</small></span>
      <FiArrowUpRight className="hall-service-arrow" />
    </button>
  )
}

function Lobby({ onEnter, onOpenAgent }: { onEnter: (id: AcademyId) => void; onOpenAgent: () => void }) {
  const reduceMotion = useReducedMotion()
  const [overviewOpen, setOverviewOpen] = useState(false)

  return (
    <main className="academy-hall-lobby-page">
      <section className="hall-entry-strip" aria-label="互动展馆入口">
        <div className="hall-entry-heading">
          <div>
            <span className="hall-entry-kicker">INTERACTIVE EXHIBITION HALL / 01</span>
            <h2>进入互动展馆</h2>
            <button type="button" className="hall-overview-link" onClick={() => setOverviewOpen(true)}>
              <FiBookOpen /> 查看五院总览
            </button>
          </div>
          <p>从一座真实的书院开始，沿着建筑、人物与典籍的线索，走进五院共同延续的文化空间。</p>
        </div>

        <div className="hall-entry-layout">
          <article className="hall-featured-room">
            <img src="/academy-photos/yuelu-gate.jpg" alt="岳麓书院入口实景" loading="lazy" />
            <div className="hall-featured-room-shade" aria-hidden="true" />
            <div className="hall-featured-room-copy">
              <span>RECOMMENDED ROOM / 01</span>
              <h3>岳麓书院</h3>
              <small>湖南 · 长沙 · 岳麓山下</small>
              <p>从“惟楚有材，于斯为盛”的讲堂门额出发，查看千年学府的建筑、人物与会讲记忆。</p>
              <button type="button" onClick={() => onEnter('yuelu')}>开始探索 <FiArrowRight /></button>
            </div>
            <span className="hall-featured-room-stamp" aria-hidden="true">岳麓</span>
          </article>

          <aside className="hall-entry-rail">
            <div className="hall-entry-rail-head">
              <span>展馆导览设施</span>
              <small>SELECT A GUIDE</small>
            </div>
            <HallServiceLink
              icon={<FiActivity />}
              index="01"
              title="动态导览"
              detail="沿着展厅线索开始漫游"
              onClick={() => document.getElementById('hall-academy-path')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
            />
            <HallServiceLink
              icon={<FiMessageCircle />}
              index="02"
              title="智能问答"
              detail="向书院智问直接提问"
              onClick={onOpenAgent}
            />
            <HallServiceLink
              icon={<FiMapPin />}
              index="03"
              title="书院地图"
              detail="查看五院真实地理位置"
              onClick={() => document.getElementById('academy-map-panel')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
            />
            <div className="hall-guide-dock">
              <CoverGuideCharacter onOpenAgent={onOpenAgent} />
            </div>
          </aside>
        </div>

        <div id="hall-academy-path" className="hall-academy-path-head">
          <div>
            <span>ACADEMY PATH / 05</span>
            <h3>沿着五院，继续阅读</h3>
          </div>
          <p>五座书院各有一扇入口，也各自保存着一段关于求学、讲学与传承的现场。</p>
        </div>
        <div className="hall-academy-path">
          {lobbyAcademyOrder.map((id, index) => (
            <LobbyAcademyCard key={id} academy={academies[id]} index={index} onClick={() => onEnter(id)} />
          ))}
        </div>

        <div id="academy-map-panel">
          <AcademyMap onEnter={onEnter} />
        </div>
      </section>

      {overviewOpen && (
        <div className="cover-overview-overlay" onMouseDown={(event) => event.target === event.currentTarget && setOverviewOpen(false)}>
          <motion.article className="cover-overview" initial={reduceMotion ? false : { opacity: 0, scale: .96, y: 18 }} animate={{ opacity: 1, scale: 1, y: 0 }}>
            <button className="icon-button overview-close" aria-label="关闭五院总览" onClick={() => setOverviewOpen(false)}><FiX /></button>
            <span className="modal-kicker"><FiBookOpen /> 五院同源 · 文脉图谱</span>
            <h2>一座书院，是一方山水与一代士人的共同作品</h2>
            <p>五座书院地域不同、制度各异，却共同保存着讲学、藏书、祭祀与修身的教育传统。选择任一书院，可继续查看代表人物、历史事件与核心展项。</p>
            <div className="overview-academies">{academyOrder.map((id) => <button key={id} onClick={() => onEnter(id)}><span style={{ background: academies[id].color }}>{academies[id].seal}</span><strong>{academies[id].name}</strong><small>{academies[id].region}</small><FiChevronRight /></button>)}</div>
          </motion.article>
        </div>
      )}
    </main>
  )
}

function AcademyFacade({ academy, photos }: { academy: Academy; photos: AcademyPhoto[] }) {
  const reduceMotion = useReducedMotion()
  const [failedPhotos, setFailedPhotos] = useState<string[]>([])
  const [activePhotoIndex, setActivePhotoIndex] = useState(0)
  const [photoPaused, setPhotoPaused] = useState(Boolean(reduceMotion))
  const carouselPhotos = useMemo(() => {
    const verifiedMainPhoto = academy.photoLocalFile ? [{
      file: academy.photoLocalFile,
      category: '建筑全景' as const,
      title: `${academy.name}实景`,
      source: academy.photoSource ?? '',
      license: academy.photoCredit ?? '来源见原图',
      localFile: academy.photoLocalFile,
    }] : []
    return [...verifiedMainPhoto, ...photos].filter((photo, index, all) => all.findIndex((item) => item.file === photo.file) === index)
  }, [academy, photos])
  const availablePhotos = carouselPhotos.filter((photo) => !failedPhotos.includes(photo.file))

  useEffect(() => {
    if (activePhotoIndex >= availablePhotos.length) setActivePhotoIndex(0)
  }, [activePhotoIndex, availablePhotos.length])

  useEffect(() => {
    if (photoPaused || reduceMotion || availablePhotos.length <= 1) return undefined
    const timer = window.setInterval(() => {
      setActivePhotoIndex((current) => (current + 1) % availablePhotos.length)
    }, 4200)
    return () => window.clearInterval(timer)
  }, [availablePhotos.length, photoPaused, reduceMotion])

  return (
    <section className="academy-facade" style={{ '--academy-accent': academy.color } as CSSProperties}>
      {availablePhotos.length ? (
        <div className="facade-carousel">
          <div className="facade-carousel-viewport">
            <motion.a
              key={availablePhotos[activePhotoIndex].file}
              className="facade-carousel-slide"
              href={availablePhotos[activePhotoIndex].source}
              target="_blank"
              rel="noreferrer"
              initial={reduceMotion ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: .35 }}
            >
              <img
                className="facade-carousel-image"
                src={getAcademyPhotoUrl(availablePhotos[activePhotoIndex])}
                alt={`${academy.name} · ${availablePhotos[activePhotoIndex].title}`}
                onError={() => setFailedPhotos((current) => current.includes(availablePhotos[activePhotoIndex].file) ? current : [...current, availablePhotos[activePhotoIndex].file])}
              />
            </motion.a>
          </div>
          <div className="facade-carousel-meta">
            <div>
              <strong>{availablePhotos[activePhotoIndex]?.title}</strong>
              <small>{availablePhotos[activePhotoIndex]?.category} · {availablePhotos[activePhotoIndex]?.license}</small>
            </div>
            {availablePhotos.length > 1 && (
              <div className="facade-carousel-controls">
                <button type="button" aria-label="上一张照片" title="上一张照片" onClick={() => setActivePhotoIndex((current) => (current - 1 + availablePhotos.length) % availablePhotos.length)}><FiArrowLeft /></button>
                <button type="button" aria-label={photoPaused ? '继续播放' : '暂停播放'} title={photoPaused ? '继续播放' : '暂停播放'} onClick={() => setPhotoPaused((current) => !current)}>
                  {photoPaused ? <FiPlay /> : <FiPause />}
                </button>
                <button type="button" aria-label="下一张照片" title="下一张照片" onClick={() => setActivePhotoIndex((current) => (current + 1) % availablePhotos.length)}><FiArrowRight /></button>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="facade-photo-empty"><FiInfo /><span>暂时没有可确认的公开实景照片</span></div>
      )}
    </section>
  )
}

function ExhibitModal({ exhibit, academy, onClose }: { exhibit: Exhibit; academy: Academy; onClose: () => void }) {
  return (
    <div className="exhibit-overlay" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <article className="exhibit-modal" onMouseDown={(event) => event.stopPropagation()}>
        <button className="icon-button modal-close" aria-label="关闭展项详情" onClick={onClose}><FiX /></button>
        <span className="modal-kicker">{academy.name} · {exhibit.type}</span>
        <h2>{exhibit.title}</h2>
        <p className="modal-lead">{exhibit.summary}</p>
        <div className="modal-meta"><span><FiClock /> {exhibit.period}</span><span><FiMapPin /> {academy.region}</span></div>
        <div className="modal-copy"><p>{exhibit.detail}</p><h3>展项索引</h3><ul>{exhibit.points.map((point) => <li key={point}>{point}</li>)}</ul></div>
        <button className="modal-action" onClick={onClose}>继续浏览展厅 <FiArrowRight /></button>
      </article>
    </div>
  )
}

function PhotoGallery({ academy, photos }: { academy: Academy; photos: AcademyPhoto[] }) {
  const [category, setCategory] = useState<(typeof photoCategoryOrder)[number]>('建筑全景')
  const visiblePhotos = photos.filter((photo) => photo.category === category)

  return (
    <div className="photo-gallery">
      <div className="photo-gallery-head"><div><span>实景图像档案</span><strong>{photos.length} 张公开授权图片</strong></div><small>点击图片查看高清原图与授权信息</small></div>
      <div className="photo-category-tabs" role="tablist">
        {photoCategoryOrder.map((item) => {
          const count = photos.filter((photo) => photo.category === item).length
          return <button key={item} className={category === item ? 'active' : ''} disabled={!count} onClick={() => setCategory(item)}>{item}<span>{count}</span></button>
        })}
      </div>
      {visiblePhotos.length ? <div className="photo-grid">{visiblePhotos.map((photo) => <a className="photo-card" key={photo.file} href={photo.source} target="_blank" rel="noreferrer"><img src={getAcademyPhotoUrl(photo)} alt={`${academy.name} · ${photo.title}`} loading="lazy" /><span className="photo-card-overlay"><strong>{photo.title}</strong><small>{photo.license} · 查看来源</small></span></a>)}</div> : <div className="photo-empty"><FiInfo /><strong>该分类暂时没有确认的公开图片</strong><span>我们不会用其他建筑图片替代 {academy.name} 的实景。</span></div>}
    </div>
  )
}

function PhotoWall({ academy, photos }: { academy: Academy; photos: AcademyPhoto[] }) {
  return (
    <section className="photo-wall" aria-label={`${academy.name}图片档案`}>
      <div className="photo-wall-head">
        <div>
          <span>书院实景档案</span>
          <strong>更多现场照片</strong>
        </div>
        <small>{photos.length} 张 · 按建筑、院落、碑刻与山水分类</small>
      </div>
      {photos.length ? photoCategoryOrder.map((category) => {
        const categoryPhotos = photos.filter((photo) => photo.category === category)
        if (!categoryPhotos.length) return null
        return (
          <div className="photo-wall-section" key={category}>
            <h3>{category}<span>{categoryPhotos.length}</span></h3>
            <div className="photo-wall-grid">
              {categoryPhotos.map((photo) => (
                <a className="photo-wall-item" key={photo.file} href={photo.source} target="_blank" rel="noreferrer">
                  <img src={getAcademyPhotoUrl(photo)} alt={`${academy.name} · ${photo.title}`} loading="lazy" />
                  <span>
                    <strong>{photo.title}</strong>
                    <small>{photo.license} · 查看来源</small>
                  </span>
                </a>
              ))}
            </div>
          </div>
        )
      }) : (
        <div className="photo-empty"><FiInfo /><strong>暂时没有可确认的公开照片</strong><span>我们不会用其他建筑图片替代{academy.name}的实景。</span></div>
      )}
    </section>
  )
}

function PhotoCarousel({ academy, photos }: { academy: Academy; photos: AcademyPhoto[] }) {
  const reduceMotion = useReducedMotion()
  const visibleCount = 4
  const maxIndex = Math.max(0, photos.length - visibleCount)
  const [activeIndex, setActiveIndex] = useState(0)
  const [paused, setPaused] = useState(Boolean(reduceMotion))

  useEffect(() => {
    if (paused || reduceMotion || photos.length <= visibleCount) return undefined
    const timer = window.setInterval(() => {
      setActiveIndex((current) => current >= maxIndex ? 0 : current + 1)
    }, 3600)
    return () => window.clearInterval(timer)
  }, [maxIndex, paused, photos.length, reduceMotion])

  const move = (direction: number) => {
    setActiveIndex((current) => {
      const next = current + direction
      if (next < 0) return maxIndex
      if (next > maxIndex) return 0
      return next
    })
  }

  return (
    <section className="photo-wall" aria-label={`${academy.name} 图片轮播`}>
      <div className="photo-wall-head">
        <div>
          <span>书院实景档案</span>
          <strong>实景照片滚动播放</strong>
        </div>
        <div className="photo-wall-controls">
          <small>{photos.length} 张 · 按分类连续浏览</small>
          {photos.length > visibleCount && (
            <>
              <button type="button" aria-label="上一组照片" title="上一组照片" onClick={() => move(-1)}><FiArrowLeft /></button>
              <button type="button" aria-label={paused ? '继续播放' : '暂停播放'} title={paused ? '继续播放' : '暂停播放'} onClick={() => setPaused((current) => !current)}>
                {paused ? <FiPlay /> : <FiPause />}
              </button>
              <button type="button" aria-label="下一组照片" title="下一组照片" onClick={() => move(1)}><FiArrowRight /></button>
            </>
          )}
        </div>
      </div>
      {photos.length ? (
        <div className="photo-carousel">
          <div className="photo-carousel-viewport">
            <div className="photo-carousel-track" style={{ '--active-index': activeIndex } as CSSProperties}>
              {photos.map((photo) => (
                <a className="photo-wall-item" key={photo.file} href={photo.source} target="_blank" rel="noreferrer">
                  <img src={getAcademyPhotoUrl(photo)} alt={`${academy.name} · ${photo.title}`} loading="lazy" />
                  <span>
                    <strong>{photo.title}</strong>
                    <small>{photo.category} · {photo.license} · 查看来源</small>
                  </span>
                </a>
              ))}
            </div>
          </div>
          {photos.length > visibleCount && (
            <div className="photo-carousel-progress" aria-label="照片播放进度">
              {photos.map((photo, index) => (
                <button
                  type="button"
                  key={photo.file}
                  className={index >= activeIndex && index < activeIndex + visibleCount ? 'active' : ''}
                  aria-label={`查看第 ${index + 1} 张照片`}
                  onClick={() => setActiveIndex(Math.min(index, maxIndex))}
                />
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="photo-empty"><FiInfo /><strong>暂时没有可确认的公开照片</strong><span>我们不会用其他建筑图片替代{academy.name}的实景。</span></div>
      )}
    </section>
  )
}

function AcademyRoom({ academy, onBack }: { academy: Academy; onBack: () => void }) {
  const navigate = useNavigate()
  const [selectedExhibit, setSelectedExhibit] = useState<Exhibit | null>(null)
  const [activeTab, setActiveTab] = useState<'overview' | 'exhibits' | 'photos'>('overview')
  const photos = academyPhotoCollections[academy.id]

  return (
    <main className="academy-hall-page academy-room-page" style={{ '--academy-accent': academy.color } as CSSProperties}>
      <header className="room-header">
        <button className="back-button" onClick={onBack}><FiArrowLeft /> 返回大厅</button>
        <div className="room-breadcrumb"><span>互动展馆</span><FiChevronRight /><strong>{academy.name}</strong></div>
        <button className="room-agent-button" type="button" onClick={() => navigate(`/academy-hall/ai?academy=${academy.id}`)}>
          <FiMessageCircle /> 展馆智导
        </button>
        <span className="room-count">展厅 0{academyOrder.indexOf(academy.id) + 1} / 05</span>
      </header>
      <div className="room-content">
        <div className="room-visual-column">
          <AcademyFacade academy={academy} photos={photos} />
        </div>
        <aside className="room-info">
          <div className="room-kicker"><span className="seal-mini">{academy.seal}</span><span>{academy.region}</span></div>
          <h1>{academy.name}</h1>
          <p className="room-motto">“{academy.motto}”</p>
          <div className="room-tabs" role="tablist">
            <button className={activeTab === 'overview' ? 'active' : ''} onClick={() => setActiveTab('overview')}>书院档案</button>
            <button className={activeTab === 'exhibits' ? 'active' : ''} onClick={() => setActiveTab('exhibits')}>展项索引 <span>03</span></button>
            <button className={activeTab === 'photos' ? 'active' : ''} onClick={() => setActiveTab('photos')}>图片档案 <span>{photos.length}</span></button>
          </div>
          {activeTab === 'overview' ? <div className="overview-content"><p>{academy.introduction}</p><p>{academy.history}</p><div className="fact-list"><div><span>建院时间</span><strong>{academy.period}</strong></div><div><span>代表人物</span><strong>{academy.figures.join(' · ')}</strong></div></div><button className="switch-tab" onClick={() => setActiveTab('exhibits')}>查看三件展项 <FiArrowRight /></button></div> : activeTab === 'exhibits' ? <div className="exhibit-list">{academy.exhibits.map((exhibit, index) => <button key={exhibit.title} className="exhibit-list-item" onClick={() => setSelectedExhibit(exhibit)}><span className="list-number">0{index + 1}</span><span><strong>{exhibit.title}</strong><small>{exhibit.type} · {exhibit.period}</small></span><FiChevronRight /></button>)}</div> : <PhotoGallery academy={academy} photos={photos} />}
        </aside>
      </div>
      <footer className="room-footer"><span><FiInfo /> 点击展馆中的展签，或从右侧展项索引查看详细资料</span><button className="next-room" onClick={() => { const next = academyOrder[(academyOrder.indexOf(academy.id) + 1) % academyOrder.length]; navigate(`/academy-hall/${next}`) }}>下一座书院 <FiArrowRight /></button></footer>
      {selectedExhibit && <ExhibitModal exhibit={selectedExhibit} academy={academy} onClose={() => setSelectedExhibit(null)} />}
    </main>
  )
}

export default function AcademyHallPage() {
  const { academyId } = useParams<{ academyId?: string }>()
  const location = useLocation()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const academy = useMemo(() => (academyId && academyId in academies ? academies[academyId as AcademyId] : null), [academyId])
  const isAgentWorkspace = academyId === 'ai'
  const agentContext = getAcademyAgentContext(searchParams.get('academy'))
  const hallRoot = location.pathname.startsWith('/academy-3d') ? '/academy-3d' : '/academy-hall'

  if (isAgentWorkspace) {
    return <AcademyAgentPage embedded context={agentContext} onBack={() => navigate(hallRoot)} />
  }

  if (academyId && !academy) {
    return <Navigate to="/academy-hall" replace />
  }

  return academy
    ? <AcademyRoom academy={academy} onBack={() => navigate('/academy-hall')} />
    : <Lobby onEnter={(id) => navigate(`/academy-hall/${id}`)} onOpenAgent={() => navigate('/academy-hall/ai')} />
}
