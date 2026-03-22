import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const BASE_URL = 'https://housepick-web.vercel.app'

// 템플릿 로드
const templatePath = path.join(__dirname, '..', 'templates', 'kerapoxy-guide.html')
const template = fs.readFileSync(templatePath, 'utf-8')

// dist 디렉토리 확인
const distPath = path.join(__dirname, '..', 'dist')
if (!fs.existsSync(distPath)) {
  console.log('dist 폴더가 없습니다. 먼저 npm run build를 실행하세요.')
  process.exit(1)
}

// dist/regional.html에서 빌드된 CSS 경로 추출
const regionalHtmlPath = path.join(distPath, 'regional.html')
const regionalHtml = fs.readFileSync(regionalHtmlPath, 'utf-8')
const cssMatch = regionalHtml.match(/href="(\/assets\/index-[^"]+\.css)"/)
const viteCss = cssMatch ? cssMatch[1] : '/assets/index.css'

console.log(`Vite CSS 파일 감지: ${viteCss}`)

// 현재 날짜
const now = new Date()
const modifiedDate = now.toISOString().split('T')[0]

// 템플릿 치환
let html = template
  .replace(/\{\{VITE_CSS\}\}/g, viteCss)
  .replace(/\{\{MODIFIED_DATE\}\}/g, modifiedDate)

// 디렉토리 생성
const outputDir = path.join(distPath, 'kerapoxy-guide')
fs.mkdirSync(outputDir, { recursive: true })

// HTML 저장
const outputPath = path.join(outputDir, 'index.html')
fs.writeFileSync(outputPath, html, 'utf-8')

// sitemap.xml에 URL 추가
const sitemapPath = path.join(distPath, 'sitemap.xml')
if (fs.existsSync(sitemapPath)) {
  let sitemap = fs.readFileSync(sitemapPath, 'utf-8')
  const guideUrl = `${BASE_URL}/kerapoxy-guide`

  if (!sitemap.includes(guideUrl)) {
    const newEntry = `  <url>
    <loc>${guideUrl}</loc>
    <lastmod>${modifiedDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.9</priority>
  </url>
</urlset>`
    sitemap = sitemap.replace('</urlset>', newEntry)
    fs.writeFileSync(sitemapPath, sitemap, 'utf-8')
    console.log('✅ sitemap.xml에 케라폭시 가이드 URL 추가 (priority: 0.9)')
  }
}

console.log('✅ 케라폭시 마스터 가이드 페이지 생성 완료')
console.log(`   URL: /kerapoxy-guide`)
console.log(`   수정일: ${modifiedDate}`)
