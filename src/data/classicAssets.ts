const materials = '/materials/典籍检索'

const image = (label: string, path: string) => ({ label, url: `${materials}/${path}` })

export const classicSourceAssets: Record<string, { label: string; url: string }[]> = {
  'bailu-dong': [
    image('白鹿洞书院揭示原件一', '《白鹿洞书院揭示》.png'),
    image('白鹿洞书院揭示原件补充页', '《白鹿洞书院揭示》(1).png'),
    image('白鹿洞书院揭示原件二', '《白鹿洞书院揭示》(2).png'),
    image('白鹿洞书院揭示原件三', '《白鹿洞书院揭示》(3).png'),
  ],
  'yuelu-xuegui': [
    image('岳麓书院学规原件一', '《岳麓书院学规》.png'),
    image('岳麓书院学规原件二', '《岳麓书院学规》(1).png'),
  ],
  'yuelu-dushu': [image('读经六法读史六法原件', '《读经六法·读史六法》.png')],
  xuezhen: [
    image('学箴九首原件一', '《学箴九首》.png'),
    image('学箴九首原件二', '《学箴九首》(1).png'),
    image('学箴九首原件三', '《学箴九首》(2).png'),
  ],
  'liuyou-zhen': [image('六有箴原件', '六有箴.png')],
  'shigu-ji': [image('衡州石鼓书院记原件', '衡州石鼓书院记.png')],
  'nanjing-shuyuan': [image('南京书院题名记原件', '南京书院.png')],
  'zhuzi-dushufa': [image('朱子读书法原件', '朱子读书法.png')],
  'ercheng-yishu': [image('二程遗书原件', '二程遗书.jpg')],
  'shigu-lunyu': [image('石鼓论语问答原件', '石鼓论语问答.jpg')],
  'yuelou-ji': [image('岳阳楼记原件', '岳阳楼记.jpg')],
  'songshi-fanzhongyan': [
    image('宋史范仲淹传原件', '宋史~范仲淹传.jpg'),
    image('宋史范仲淹传补充页一', '宋史/0b55b319ebc4b745c8e9ba8b83a9f01e8b821588.jpeg'),
    image('宋史范仲淹传补充页二', '宋史/6fc564890dad8f6c_b.jpg'),
    image('宋史范仲淹传补充页三', '宋史/a72a14cc8249c82be92e47e571fe21a5.jpg'),
    image('宋史范仲淹传补充页四', '宋史/u=1066920187,2783834893&fm=3074&app=3074&f=JPEG.jpg'),
  ],
  'songyang-zhi': [
    image('嵩阳书院志原件一', '嵩阳书院志/1.png'),
    image('嵩阳书院志原件二', '嵩阳书院志/2.png'),
    image('嵩阳书院志原件三', '嵩阳书院志/3.png'),
    image('嵩阳书院志原件四', '嵩阳书院志/12d89b63-8a68-4c8f-b4d9-3e817cb212bb.png'),
    image('嵩阳书院志原件五', '嵩阳书院志/182a9b10-abea-4b11-8133-ebb196431236.png'),
    image('嵩阳书院志原件六', '嵩阳书院志/1d83da1f-815f-4f84-a44c-60053ce17162.png'),
    image('嵩阳书院志原件七', '嵩阳书院志/3502a09d-5854-45c8-950f-70ded4d09ff2.png'),
    image('嵩阳书院志原件八', '嵩阳书院志/603eced8-1a06-4eb2-a277-1951777a7806.png'),
    image('嵩阳书院志原件九', '嵩阳书院志/79b75b5e-4687-4f2a-bcc4-276eec494885.png'),
    image('嵩阳书院志原件十', '嵩阳书院志/9cac18cd-3113-4fda-ab9b-4c2074773053.png'),
    image('嵩阳书院志原件十一', '嵩阳书院志/b1ca811d-6699-429f-bc16-f5a94ac2a943.png'),
    image('嵩阳书院志原件十二', '嵩阳书院志/e8918ea6-eb7b-4379-83a2-0c057abb346b.png'),
    image('嵩阳书院志原件十三', '嵩阳书院志/f28fe53a-7152-4b31-baa6-869016328cbf.png'),
  ],
  'yuelu-beike': [
    image('岳麓书院碑刻原件一', '岳麓书院碑刻/02917fe5-1238-4a10-be89-0bdfb2b781b7.png'),
    image('岳麓书院碑刻原件二', '岳麓书院碑刻/K4PljUWWRak8sBAlcObIuQ546103aba7fe10a5435d3ade28caa3b1.jpg'),
    image('岳麓书院碑刻原件三', '岳麓书院碑刻/3cef594a137243419bb9220966c9579cmpand__jpg.heic~tplv-s1ctq42ewb-s2-cC-q_750_0_0_0_q80.webp'),
    image('岳麓书院碑刻原件四', '岳麓书院碑刻/804820ef1c1251d989b182d37391ebb7~tplv-be4g95zd3a-448x448.jpg'),
    image('岳麓书院碑刻原件五', '岳麓书院碑刻/9d4ebadfd21f48ec86f6f83607781a24.webp'),
    image('岳麓书院碑刻原件六', '岳麓书院碑刻/bff0a27b586e3605e9e317c60c67c337~tplv-be4g95zd3a-448x448.jpg'),
    image('岳麓书院碑刻原件七', '岳麓书院碑刻/cd0503fa14cdab9f82fa14c246ab4f91~tplv-be4g95zd3a-448x448.jpg'),
    image('岳麓书院碑刻原件八', '岳麓书院碑刻/u=1774830337,1256013099&fm=253&fmt=auto&app=138&f=JPEG.webp'),
    image('岳麓书院碑刻原件九', '岳麓书院碑刻/u=439290353,2904200021&fm=253&fmt=auto&app=138&f=JPEG.webp'),
  ],
  'shangzhizheng-shu': [
    image('上执政书原件一', '上执政书/38dbb6fd5266d016200c0e7e982bd40735fa354a.jpg'),
    image('上执政书原件二', '上执政书/46fff5ce672441a78060666672300c2b.jpeg'),
    image('上执政书原件三', '上执政书/5e70c086b21100d277949f4b2b32df97~tplv-be4g95zd3a-448x448.jpg'),
    image('上执政书原件四', '上执政书/8f7ef7f5cd80e4a7d253ae543977d914~tplv-be4g95zd3a-448x448.jpg'),
  ],
  'zhuzi-yulei': [
    image('朱子语类原件一', '朱子语类1.jpg'),
    image('朱子语类原件二', '朱子语类2.jpg'),
  ],
  'fanwenzheng-jiayu': [
    image('范文正公家训原件一', '范文正1.jpg'),
    image('范文正公家训原件二', '范文正2.jpg'),
  ],
  'chengshi-waishu': [image('二程外书原件', '二程外文.png')],
  'donglin-huiyue': [image('东林会约原件', '东林会约.jpg')],
}
