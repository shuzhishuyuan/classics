export type PhotoCategory = '建筑全景' | '核心建筑' | '讲堂院落' | '碑刻匾额' | '山水环境'
type AcademyId = 'yuelu' | 'bailudong' | 'songyang' | 'yingtian' | 'shigu'

export type AcademyPhoto = {
  file: string
  category: PhotoCategory
  title: string
  source: string
  license: string
  localFile?: string
}

const commonsSource = (file: string) => `https://commons.wikimedia.org/wiki/File:${encodeURIComponent(file.replace(/ /g, '_'))}`
const yingtianSource = 'https://article.xuexi.cn/html/2390676221166037830.html'

function photo(file: string, category: PhotoCategory, title: string, license = '授权见来源页'): AcademyPhoto {
  return { file, category, title, source: commonsSource(file), license }
}

export const academyPhotoCollections = {
  yuelu: [
    photo('岳麓书院.jpg', '建筑全景', '岳麓书院全景', 'CC BY-SA 3.0'),
    photo('Baiquan Lodge of Yuelu Academy 20251018.jpg', '建筑全景', '百泉轩', 'CC BY-SA 4.0'),
    photo('Lecture Hall of Yuelu Academy 20251018.jpg', '核心建筑', '岳麓书院讲堂', 'CC BY-SA 4.0'),
    photo('Imperial Book Tower of Yuelu Academy 20251018.jpg', '核心建筑', '御书楼', 'CC BY-SA 4.0'),
    photo('岳麓书院大成殿 20181012.jpg', '核心建筑', '大成殿', 'CC BY-SA 4.0'),
    photo('岳麓书院孔子祠.jpg', '核心建筑', '孔子祠', 'CC BY-SA 4.0'),
    photo('岳麓书院御书楼.jpg', '核心建筑', '御书楼旧影', 'CC BY-SA 4.0'),
    photo('岳麓书院教学斋 20251018.jpg', '讲堂院落', '教学斋', 'CC BY-SA 4.0'),
    photo('岳麓书院亭子 20181012.jpg', '山水环境', '书院亭台', 'CC BY-SA 4.0'),
    photo('岳麓书院南脉正道 20181012.jpg', '山水环境', '南脉正道', 'CC BY-SA 4.0'),
    photo('岳麓书院名山 20181012.jpg', '山水环境', '名山相依', 'CC BY-SA 4.0'),
    photo('岳麓书院大门“岳麓书院”匾额.jpg', '碑刻匾额', '书院大门匾额', 'CC BY-SA 4.0'),
  ],
  bailudong: [
    photo('Lushan White Lotus Grotto Academy.JPG', '建筑全景', '白鹿洞书院全景', 'CC BY 3.0'),
    photo('White Deer Grotto Academy.jpg', '建筑全景', '书院山门', 'CC BY-SA 2.0'),
    photo('白鹿洞.JPG', '山水环境', '白鹿洞山林', 'CC BY 3.0'),
    photo('White Deer Academy interior courtyard.jpg', '讲堂院落', '书院内院', 'CC BY 2.5'),
    photo('文会堂.JPG', '核心建筑', '文会堂', 'CC BY 3.0'),
    photo('朱子祠.JPG', '核心建筑', '朱子祠', 'CC BY 3.0'),
    photo('白鹿洞书院明伦堂2019.jpg', '核心建筑', '明伦堂', 'CC BY-SA 4.0'),
    photo('白鹿洞书院礼圣殿2019.jpg', '核心建筑', '礼圣殿', 'CC BY-SA 4.0'),
    photo('礼圣殿.JPG', '核心建筑', '礼圣殿旧影', 'CC BY 3.0'),
    photo('正学之门.JPG', '核心建筑', '正学之门', 'CC BY 3.0'),
    photo('延宾馆.JPG', '讲堂院落', '延宾馆', 'CC BY 3.0'),
    photo('碑林.JPG', '碑刻匾额', '碑林', 'CC BY 3.0'),
    photo('PSM V67 D532 A view of the college halls.png', '碑刻匾额', '历史影像：书院诸堂', 'Public domain'),
  ],
  songyang: [
    photo('20250531 Songyang Academy 02.jpg', '建筑全景', '书院建筑群', 'CC BY-SA 4.0'),
    photo('20250629 Songyang Academy 02.jpg', '核心建筑', '嵩阳书院殿堂', 'CC BY-SA 4.0'),
    photo('20250629 Songyang Academy 06.jpg', '讲堂院落', '讲学空间', 'CC BY-SA 4.0'),
    photo('20250629 Songyang Academy 07.jpg', '讲堂院落', '回廊与庭院', 'CC BY-SA 4.0'),
    photo('20250629 Songyang Academy 08.jpg', '山水环境', '嵩山书院环境', 'CC BY-SA 4.0'),
    photo('20250629 Songyang Academy 09.jpg', '山水环境', '院中古柏', 'CC BY-SA 4.0'),
    photo('20250629 Songyang Academy 10.jpg', '山水环境', '嵩阳古树', 'CC BY-SA 4.0'),
    photo('20250629 Songyang Academy 11.jpg', '碑刻匾额', '书院碑刻', 'CC BY-SA 4.0'),
    photo('大唐嵩阳观纪圣德感应之颂碑.jpg', '碑刻匾额', '大唐嵩阳观碑', 'CC BY-SA 3.0'),
    photo('嵩阳书院将军柏.jpg', '山水环境', '将军柏', 'CC BY-SA 3.0'),
    photo('登封嵩阳书院.JPG', '建筑全景', '登封嵩阳书院', 'CC BY-SA 3.0'),
  ],
  shigu: [
    photo('Shigu-Academy.jpg', '建筑全景', '石鼓书院全景', 'Public domain'),
    photo('Shigu Academy59.jpg', '建筑全景', '石鼓书院建筑群', 'CC BY-SA 4.0'),
    photo('石鼓书院正门.jpg', '核心建筑', '书院正门', 'CC BY-SA 3.0'),
    photo('书院讲堂.jpg', '讲堂院落', '书院讲堂', 'CC BY-SA 3.0'),
    photo('合江亭.jpg', '讲堂院落', '合江亭', 'CC BY-SA 3.0'),
    photo('合江亭（绿净阁）.jpg', '讲堂院落', '绿净阁', 'CC BY-SA 3.0'),
    photo('禹碑亭.jpg', '碑刻匾额', '禹碑亭', 'CC BY-SA 3.0'),
    photo('石鼓七贤.jpg', '碑刻匾额', '石鼓七贤', 'CC BY-SA 3.0'),
    photo('朱陵后洞.jpg', '山水环境', '朱陵后洞', 'CC BY-SA 3.0'),
    photo('石鼓书院一隅.jpg', '山水环境', '书院一隅', 'CC BY-SA 3.0'),
  ],
  yingtian: [
    { file: '应天书院大门.jpg', category: '建筑全景', title: '应天书院大门', source: yingtianSource, license: '来源：河南学习平台' },
    { file: '应天书院全景.jpg', category: '建筑全景', title: '应天书院全景', source: yingtianSource, license: '来源：河南学习平台' },
    { file: '应天书院崇圣殿.jpg', category: '核心建筑', title: '崇圣殿', source: yingtianSource, license: '来源：中国孔子网' },
    { file: '应天书院讲堂.jpg', category: '讲堂院落', title: '书院讲堂', source: yingtianSource, license: '来源：中国孔子网' },
    { file: '应天书院状元桥.jpg', category: '山水环境', title: '状元桥', source: yingtianSource, license: '来源：中国孔子网' },
  ],
} satisfies Record<AcademyId, AcademyPhoto[]>

export const photoCategoryOrder: PhotoCategory[] = ['建筑全景', '核心建筑', '讲堂院落', '碑刻匾额', '山水环境']

export function getAcademyPhotoUrl(photoItem: AcademyPhoto) {
  const localFile = photoItem.localFile ?? photoItem.file.replace(/[<>:"/\\|?*]/g, '_')
  return `/academy-photos/${encodeURIComponent(localFile)}`
}
