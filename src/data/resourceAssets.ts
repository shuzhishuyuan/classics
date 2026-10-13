import type { ResourceAsset } from '../types/resource'

const documentAsset = (label: string, url: string): ResourceAsset => ({ label, url, kind: 'document' })
const videoAsset = (label: string, url: string): ResourceAsset => ({ label, url, kind: 'video' })
const imageAsset = (label: string, url: string): ResourceAsset => ({ label, url, kind: 'image' })

const materials = '/materials'

export const resourceAssetsById: Record<string, ResourceAsset[]> = {
  'course-01': [videoAsset('白鹿洞书院揭示微课', `${materials}/名师微课/白鹿洞书院揭示---朱熹的教育思想.mp4`)],
  'course-02': [videoAsset('书院发展史微课', `${materials}/名师微课/书院千年--中国古代书院发展史.mp4`)],
  'course-03': [videoAsset('程门立雪微课', `${materials}/名师微课/程门立雪微课.mp4`)],
  'course-04': [videoAsset('岳阳楼记朗读微课', `${materials}/名师微课/岳阳楼记朗读微课.mp4`)],
  'course-05': [videoAsset('朱子读书法微课', `${materials}/名师微课/朱子读书法.mp4`)],
  'course-06': [videoAsset('岳麓书院学规解读', `${materials}/名师微课/岳麓书院学规解读.mp4`)],
  'course-07': [videoAsset('范仲淹与应天书院', `${materials}/名师微课/范仲淹与应天书院.mp4`)],
  'course-08': [videoAsset('二程哲学思想', `${materials}/名师微课/二程哲学思想.mp4`)],
  'course-09': [videoAsset('石鼓书院微课', `${materials}/名师微课/石鼓书院.mp4`)],
  'course-10': [videoAsset('楹联文化微课', `${materials}/名师微课/楹联文化.mp4`)],
  'course-11': [videoAsset('湖湘学派微课', `${materials}/名师微课/湖湘学派.mp4`)],

  'prep-01': [documentAsset('《白鹿洞书院揭示》三课时教案', `${materials}/教师备课/《白鹿洞书院揭示》教案（三课时）.docx`)],
  'prep-02': [documentAsset('书院文化系列主题班会设计方案', `${materials}/教师备课/书院文化-系列主题班会设计方案.docx`)],
  'prep-03': [documentAsset('《岳阳楼记》教学课件', `${materials}/教师备课/《岳阳楼记》教学课件-九年级上册 语文.pptx`)],
  'prep-04': [documentAsset('书院文化研学活动操作手册', `${materials}/教师备课/书院文化研学活动操作手册.docx`)],
  'prep-05': [documentAsset('儒家经典名句同步检测试题', `${materials}/教师备课/儒家经典名句测试题.docx`)],
  'prep-06': [documentAsset('先贤精神与生涯规划主题班会设计', `${materials}/教师备课/“先贤精神与生涯规划”主题班会设计.docx`)],
  'prep-07': [
    documentAsset('古代书院与现代学校历史比较教学方案', `${materials}/教师备课/古现代书院对比资源包/古代书院与现代学校历史比较教学方案.docx`),
    videoAsset('古代书院与现代学校对比视频', `${materials}/教师备课/古现代书院对比资源包/书院对比资源（古代书院）.mp4`),
  ],
  'prep-08': [documentAsset('程门立雪课本剧排演方案', `${materials}/教师备课/《程门立雪》课本剧排演方案.docx`)],
  'prep-09': [documentAsset('先忧后乐跨学科项目式学习方案', `${materials}/教师备课/先忧后乐——范仲淹精神跨学科项目式学习方案.docx`)],
  'prep-10': [documentAsset('墨香书社书法教育资源包', `${materials}/教师备课/墨香书社书法教育资源包.doc`)],
  'prep-11': [documentAsset('教师备课补充资源', `${materials}/教师备课/教师备课2.doc`)],

  'student-01': [
    documentAsset('四大书院知识卡文档', `${materials}/学生学习/书院文化知识卡--四大书院知多少.docx`),
    imageAsset('古代书院课程表知识卡', `${materials}/学生学习/书院文化知识卡/古代书院课程表知识卡.png`),
    imageAsset('古代书院课程表知识卡（JPEG）', `${materials}/学生学习/书院文化知识卡/古代书院课程表知识卡.jpeg`),
    imageAsset('书院文化知识卡', `${materials}/学生学习/书院文化知识卡/3.jpeg`),
  ],
  'student-02': [documentAsset('学规名篇诵读本', `${materials}/学生学习/经典诵读材料--学规名篇诵读本.docx`)],
  'student-06': [
    documentAsset('范仲淹人物故事教学稿', `${materials}/学生学习/书院人物故事—范仲淹.docx`),
    videoAsset('书院人物故事视频', `${materials}/学生学习/书院人物故事.mp4`),
  ],
  'student-07': [
    imageAsset('古代书院课程表知识卡', `${materials}/学生学习/书院文化知识卡/古代书院课程表知识卡.png`),
    imageAsset('古代书院课程表知识卡（JPEG）', `${materials}/学生学习/书院文化知识卡/古代书院课程表知识卡.jpeg`),
  ],
  'student-08': [
    documentAsset('书院知识闯关题目', `${materials}/学生学习/书院知识闯关——趣味问答挑战/书院知识闯关.docx`),
    imageAsset('闯关材料图一', `${materials}/学生学习/书院知识闯关——趣味问答挑战/材料包/29e4550448e74ce9b065197b2f707da1.jpeg~tplv-a9rns2rl98-cthumb_wm1.png`),
    imageAsset('闯关材料图二', `${materials}/学生学习/书院知识闯关——趣味问答挑战/材料包/519a72db012b42fa9faed94a1acc1937.jpeg~tplv-a9rns2rl98-cthumb_wm1.png`),
    imageAsset('闯关材料图三', `${materials}/学生学习/书院知识闯关——趣味问答挑战/材料包/a7b0248bde7647f8b1d44298835fb351.jpeg~tplv-a9rns2rl98-cthumb_wm1.png`),
    imageAsset('闯关材料图四', `${materials}/学生学习/书院知识闯关——趣味问答挑战/材料包/fede931ca6c54c428883ccadf9065221.jpeg~tplv-a9rns2rl98-cthumb_wm1.png`),
  ],
  'student-09': [documentAsset('我是书院士角色扮演小剧本', `${materials}/学生学习/学生学习—角色扮演小剧本.docx`)],
  'student-10': [
    documentAsset('书院文化手抄报素材包', `${materials}/学生学习/学生学习—书院文化手抄报素材包.docx`),
    imageAsset('手抄报模板一', `${materials}/学生学习/手抄报模板1.jpg`),
    imageAsset('手抄报模板二', `${materials}/学生学习/手抄报模板2.jpg`),
  ],

  'family-01': [documentAsset('白鹿洞书院揭示亲子分段诵读脚本', `${materials}/亲子共读/《白鹿洞书院揭示》亲子分段诵读脚本（适配音频录制·三段式专属设计）.docx`)],
  'family-02': [documentAsset('朱熹家教智慧亲子读本', `${materials}/亲子共读/先贤家风故事--朱熹的家教智慧.docx`)],
  'family-03': [
    documentAsset('家庭礼仪微课堂与亲子共学任务卡', `${materials}/亲子共读/家庭礼仪微课堂+亲自共学任务卡.docx`),
    imageAsset('礼仪小卡片一', `${materials}/亲子共读/礼仪小卡片1.png`),
    imageAsset('礼仪小卡片二', `${materials}/亲子共读/礼仪小卡片2.png`),
    imageAsset('礼仪小卡片三', `${materials}/亲子共读/礼仪小卡片3.png`),
    imageAsset('礼仪小卡片四', `${materials}/亲子共读/礼仪小卡片4.png`),
  ],
  'family-04': [documentAsset('家庭礼仪微课堂与亲子共学任务卡', `${materials}/亲子共读/家庭礼仪微课堂+亲自共学任务卡.docx`)],
  'family-05': [documentAsset('范仲淹义庄与家风传承', `${materials}/亲子共读/先贤家风故事（范仲淹义庄）+每日一诵书院经典打卡计划.docx`)],
  'family-06': [documentAsset('每日一诵书院经典打卡计划', `${materials}/亲子共读/先贤家风故事（范仲淹义庄）+每日一诵书院经典打卡计划.docx`)],
  'family-09': [documentAsset('每日一诗亲子经典诵读', `${materials}/亲子共读/每日一诗 亲子经典诵读.docx`)],
  'family-10': [
    documentAsset('五座书院线上打卡挑战', `${materials}/亲子共读/五座书院线上打卡挑战.docx`),
    imageAsset('亲子打卡模板', `${materials}/亲子共读/打卡模板.jpg`),
  ],
}
