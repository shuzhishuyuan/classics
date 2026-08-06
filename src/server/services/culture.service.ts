import { academyCultureData } from '../../data/resourceMockData'
import type { AcademyCulture } from '../../types/resource'

/** 五大书院文化列表 */
export function listAcademies(): AcademyCulture[] {
  return academyCultureData
}

/** 某书院文化详情 */
export function getAcademyDetail(name: string): AcademyCulture | null {
  return academyCultureData.find(a => a.academyName === name) ?? null
}
