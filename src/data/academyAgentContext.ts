export type AcademyAgentContext = {
  name: string
  location: string
  prompt: string
  suggestions: string[]
}

export const academyAgentContexts: Record<string, AcademyAgentContext> = {
  yuelu: {
    name: '岳麓书院',
    location: '岳麓书院展厅',
    prompt: '请优先结合岳麓书院的建筑、朱张会讲、赫曦台、岳麓学规和湖湘学派回答。',
    suggestions: ['为什么岳麓书院被称为“千年学府”？', '讲讲朱张会讲的意义'],
  },
  bailudong: {
    name: '白鹿洞书院',
    location: '白鹿洞书院展厅',
    prompt: '请优先结合白鹿洞书院的历史、朱熹、《白鹿洞书院揭示》和书院建筑回答。',
    suggestions: ['《白鹿洞书院揭示》讲了什么？', '白鹿洞书院为什么依山而建？'],
  },
  songyang: {
    name: '嵩阳书院',
    location: '嵩阳书院展厅',
    prompt: '请优先结合嵩阳书院、二程讲学、嵩阳碑刻和将军柏回答。',
    suggestions: ['嵩阳书院和二程有什么关系？', '将军柏为什么重要？'],
  },
  yingtian: {
    name: '应天书院',
    location: '应天书院展厅',
    prompt: '请优先结合应天书院、范仲淹、府学制度和北宋教育回答。',
    suggestions: ['范仲淹与应天书院有什么关系？', '应天书院如何走向制度化？'],
  },
  shigu: {
    name: '石鼓书院',
    location: '石鼓书院展厅',
    prompt: '请优先结合石鼓书院、石鼓山、韩愈《石鼓歌》、朱张讲学和湖湘文脉回答。',
    suggestions: ['石鼓书院为什么建在临水之地？', '韩愈《石鼓歌》写了什么？'],
  },
}

export const lobbyAgentContext: AcademyAgentContext = {
  name: '五院同源',
  location: '五院互动大厅',
  prompt: '请优先结合五大书院的共同传统、差异、历史脉络和当前展馆中的五院入口回答。',
  suggestions: ['五大书院有什么共同点？', '我应该先参观哪一座书院？'],
}

export function getAcademyAgentContext(id?: string | null) {
  return (id && academyAgentContexts[id]) || lobbyAgentContext
}
