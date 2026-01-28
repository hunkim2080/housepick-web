/**
 * 52개 지역 폴더에 샘플 이미지를 자동으로 복사하는 스크립트
 *
 * 사용 방법:
 * 1. public/images/projects/ 폴더에 sample-before.jpg, sample-after.jpg 파일을 넣는다
 * 2. npm run copy-images 실행
 * 3. 각 지역 폴더에 {지역slug}-001-before.jpg, {지역slug}-001-after.jpg 파일이 복사됨
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { regions } from '../src/data/regions.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const projectsDir = path.join(__dirname, '..', 'public', 'images', 'projects')

// 원본 샘플 이미지 경로
const sampleBefore = path.join(projectsDir, 'sample-before.jpg')
const sampleAfter = path.join(projectsDir, 'sample-after.jpg')

// 원본 이미지 존재 여부 확인
if (!fs.existsSync(sampleBefore) || !fs.existsSync(sampleAfter)) {
  console.log('')
  console.log('  원본 이미지를 찾을 수 없습니다.')
  console.log('')
  console.log('  다음 위치에 샘플 이미지를 넣어주세요:')
  console.log(`    - public/images/projects/sample-before.jpg`)
  console.log(`    - public/images/projects/sample-after.jpg`)
  console.log('')
  process.exit(1)
}

console.log('')
console.log(`  ${regions.length}개 지역에 이미지 복사 시작...`)
console.log('')

let copiedCount = 0

regions.forEach(region => {
  const regionDir = path.join(projectsDir, region.slug)

  // 폴더 생성 (없으면)
  if (!fs.existsSync(regionDir)) {
    fs.mkdirSync(regionDir, { recursive: true })
  }

  // 파일명 변경하여 복사
  const targetBefore = path.join(regionDir, `${region.slug}-001-before.jpg`)
  const targetAfter = path.join(regionDir, `${region.slug}-001-after.jpg`)

  fs.copyFileSync(sampleBefore, targetBefore)
  fs.copyFileSync(sampleAfter, targetAfter)

  console.log(`    ${region.slug}/ 폴더에 이미지 복사 완료`)
  copiedCount++
})

console.log('')
console.log(`  완료! ${copiedCount}개 지역에 이미지가 복사되었습니다.`)
console.log(`  총 ${copiedCount * 2}개 파일 생성됨`)
console.log('')

// 이미지 최적화 가이드 출력
console.log('  ----------------------------------------')
console.log('  이미지 최적화 권장 사양')
console.log('  ----------------------------------------')
console.log('    형식: WebP 권장 (JPG 가능)')
console.log('    크기: 가로 800~1200px')
console.log('    용량: 200KB 이하')
console.log('    비율: 4:3 또는 16:9')
console.log('  ----------------------------------------')
console.log('')
