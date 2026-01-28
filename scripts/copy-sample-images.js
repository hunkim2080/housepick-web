/**
 * 52개 지역 폴더에 샘플 이미지를 최적화하여 복사하는 스크립트
 *
 * 사용 방법:
 * 1. public/images/projects/ 폴더에 샘플 이미지를 넣는다
 *    - sample-001-before.jpg, sample-001-after.jpg (1번 세트)
 *    - sample-002-before.jpg, sample-002-after.jpg (2번 세트)
 *    - sample-003-before.jpg, sample-003-after.jpg (3번 세트, 선택)
 *    - ... (원하는 만큼 추가 가능)
 * 2. npm run copy-images 실행
 * 3. 각 지역 폴더에 {지역slug}-001-before.webp, {지역slug}-001-after.webp 등이 생성됨
 *
 * 최적화 내용:
 * - WebP 형식으로 자동 변환
 * - 가로 1200px로 리사이즈 (비율 유지)
 * - 품질 80%로 압축
 * - 예상 용량: 3~5MB → 100~200KB (약 95% 절감)
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import sharp from 'sharp'
import { regions } from '../src/data/regions.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const projectsDir = path.join(__dirname, '..', 'public', 'images', 'projects')

// 이미지 최적화 설정
const IMAGE_WIDTH = 1200  // 가로 최대 픽셀
const WEBP_QUALITY = 80   // WebP 품질 (0-100)

// 샘플 이미지 자동 감지
const files = fs.readdirSync(projectsDir)
const samplePairs = []

// sample-XXX-before.jpg 패턴 찾기 (jpg, jpeg, webp, png 지원)
const beforePattern = /^sample-(\d+)-before\.(jpg|jpeg|webp|png)$/i

files.forEach(file => {
  const match = file.match(beforePattern)
  if (match) {
    const num = match[1]
    const ext = match[2]
    // 대응하는 after 파일 찾기
    const afterFile = `sample-${num}-after.${ext}`
    if (files.includes(afterFile)) {
      samplePairs.push({
        num,
        ext,
        before: file,
        after: afterFile,
        beforePath: path.join(projectsDir, file),
        afterPath: path.join(projectsDir, afterFile)
      })
    }
  }
})

// 번호순 정렬
samplePairs.sort((a, b) => parseInt(a.num) - parseInt(b.num))

// 샘플 이미지 존재 여부 확인
if (samplePairs.length === 0) {
  console.log('')
  console.log('  샘플 이미지를 찾을 수 없습니다.')
  console.log('')
  console.log('  다음 위치에 샘플 이미지를 넣어주세요:')
  console.log('    public/images/projects/')
  console.log('')
  console.log('  파일명 형식:')
  console.log('    - sample-001-before.jpg, sample-001-after.jpg (1번 세트)')
  console.log('    - sample-002-before.jpg, sample-002-after.jpg (2번 세트)')
  console.log('    - sample-003-before.jpg, sample-003-after.jpg (3번 세트)')
  console.log('    - ... (원하는 만큼)')
  console.log('')
  console.log('  지원 형식: jpg, jpeg, webp, png')
  console.log('')
  process.exit(1)
}

// 원본 파일 용량 계산
let originalTotalSize = 0
samplePairs.forEach(pair => {
  originalTotalSize += fs.statSync(pair.beforePath).size
  originalTotalSize += fs.statSync(pair.afterPath).size
})

console.log('')
console.log(`  ${samplePairs.length}개의 샘플 이미지 세트 감지됨:`)
samplePairs.forEach(pair => {
  const beforeSize = (fs.statSync(pair.beforePath).size / 1024 / 1024).toFixed(1)
  const afterSize = (fs.statSync(pair.afterPath).size / 1024 / 1024).toFixed(1)
  console.log(`    - ${pair.before} (${beforeSize}MB) / ${pair.after} (${afterSize}MB)`)
})
console.log('')
console.log(`  원본 총 용량: ${(originalTotalSize / 1024 / 1024).toFixed(1)}MB`)
console.log(`  예상 최적화 후: ${(originalTotalSize / 1024 / 1024 * 0.05).toFixed(1)}MB (약 95% 절감)`)
console.log('')
console.log(`  ${regions.length}개 지역에 WebP 최적화 이미지 생성 시작...`)
console.log('')

// 이미지 최적화 함수
async function optimizeImage(inputPath, outputPath) {
  await sharp(inputPath)
    .rotate()  // EXIF 정보 기반 자동 회전 (세로 사진 방향 보정)
    .resize(IMAGE_WIDTH, null, {
      withoutEnlargement: true,  // 원본보다 크게 확대하지 않음
      fit: 'inside'
    })
    .webp({ quality: WEBP_QUALITY })
    .toFile(outputPath)

  return fs.statSync(outputPath).size
}

// 메인 실행
async function main() {
  let processedCount = 0
  let totalFiles = 0
  let totalOptimizedSize = 0

  for (const region of regions) {
    const regionDir = path.join(projectsDir, region.slug)

    // 폴더 생성 (없으면)
    if (!fs.existsSync(regionDir)) {
      fs.mkdirSync(regionDir, { recursive: true })
    }

    // 기존 jpg 파일 삭제 (이전에 생성된 것들)
    const existingFiles = fs.readdirSync(regionDir)
    existingFiles.forEach(file => {
      if (file.match(/\.(jpg|jpeg|png)$/i)) {
        fs.unlinkSync(path.join(regionDir, file))
      }
    })

    // 각 샘플 세트 최적화 및 복사
    for (const pair of samplePairs) {
      const targetBefore = path.join(regionDir, `${region.slug}-${pair.num}-before.webp`)
      const targetAfter = path.join(regionDir, `${region.slug}-${pair.num}-after.webp`)

      const beforeSize = await optimizeImage(pair.beforePath, targetBefore)
      const afterSize = await optimizeImage(pair.afterPath, targetAfter)

      totalOptimizedSize += beforeSize + afterSize
      totalFiles += 2
    }

    console.log(`    ${region.slug}/ 폴더에 ${samplePairs.length}세트 WebP 생성 완료`)
    processedCount++
  }

  const savedSize = originalTotalSize * regions.length - totalOptimizedSize
  const savedPercent = ((savedSize / (originalTotalSize * regions.length)) * 100).toFixed(1)

  console.log('')
  console.log('  ========================================')
  console.log('  최적화 완료!')
  console.log('  ========================================')
  console.log(`    처리된 지역: ${processedCount}개`)
  console.log(`    생성된 파일: ${totalFiles}개`)
  console.log(`    최적화 전 (예상): ${(originalTotalSize * regions.length / 1024 / 1024).toFixed(1)}MB`)
  console.log(`    최적화 후 (실제): ${(totalOptimizedSize / 1024 / 1024).toFixed(1)}MB`)
  console.log(`    절감된 용량: ${(savedSize / 1024 / 1024).toFixed(1)}MB (${savedPercent}%)`)
  console.log('  ========================================')
  console.log('')
}

main().catch(err => {
  console.error('오류 발생:', err)
  process.exit(1)
})
