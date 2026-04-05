/**
 * 시공 사례 상세 페이지 생성 스크립트
 * Supabase에서 approved 시공 사례를 조회하여 개별 페이지 생성
 * + 아파트 허브 페이지에 삽입할 사례 카드 HTML 생성
 *
 * URL: /{region}/{district}/{apt-slug}/cases/{case-slug}
 * 허브 연동: {{CASE_CARDS_HTML}} 플레이스홀더로 아파트 페이지에 삽입
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const BASE_URL = 'https://housepick-web.vercel.app'
const SUPABASE_URL = process.env.SUPABASE_URL || ''
const SUPABASE_KEY = process.env.SUPABASE_SECRET_KEY || ''

const distPath = path.join(__dirname, '..', 'dist')
const dataPath = path.join(__dirname, '..', 'data')
const apartmentsData = JSON.parse(fs.readFileSync(path.join(dataPath, 'apartments.json'), 'utf-8'))

// 템플릿 로드
const templatePath = path.join(__dirname, '..', 'templates', 'case-detail.html')
const template = fs.readFileSync(templatePath, 'utf-8')

// Vite 빌드 파일 감지
const regionalHtmlPath = path.join(distPath, 'regional.html')
const regionalHtml = fs.readFileSync(regionalHtmlPath, 'utf-8')
const cssMatch = regionalHtml.match(/href="(\/assets\/index-[^"]+\.css)"/)
const viteCss = cssMatch ? cssMatch[1] : '/assets/index.css'

// ─── 매핑 데이터 ──────────────────────────────────────────────────

const SPACE_NAMES = { bathroom: '화장실', entrance: '현관', veranda: '베란다', laundry: '세탁실', living: '거실', other: '기타' }
const ISSUE_NAMES = { mold: '곰팡이', discoloration: '변색', crack: '크랙/탈락', smell: '냄새', moisture: '습기/결로', aging: '노후', general: '일반 오염' }
const MATERIAL_NAMES = { kerapoxy: '케라폭시', polyurea: '폴리우레아', cement: '시멘트 줄눈' }

const regionNames = { seoul: '서울', gyeonggi: '경기', incheon: '인천' }

// 아파트 slug → 데이터 매핑
const aptMap = new Map()
for (const [regionSlug, districts] of Object.entries(apartmentsData)) {
  for (const [districtSlug, districtData] of Object.entries(districts)) {
    for (const apt of districtData.apartments) {
      aptMap.set(apt.slug, {
        ...apt,
        regionSlug,
        districtSlug,
        districtName: districtData.name,
        regionName: regionNames[regionSlug] || regionSlug
      })
    }
  }
}

// ─── 가격 텍스트 ──────────────────────────────────────────────────

function getPriceText(spaceType) {
  const spaces = spaceType.split(',')
  const prices = {
    bathroom: '화장실 바닥 30만원, 화장실 전체(바닥+벽) 90만원',
    entrance: '현관 줄눈시공 20만원~',
    veranda: '베란다 줄눈시공 25만원~',
    laundry: '세탁실 줄눈시공 20만원~',
    living: '거실 줄눈시공 150만원~',
    other: '부위별 맞춤 견적'
  }
  const parts = spaces.map(s => prices[s] || '').filter(Boolean)
  return `${parts.join(', ')}. 출장비·자재비·인건비 모두 포함. 현장 추가 비용 없는 정찰제 가격입니다.`
}

// ─── 관리 팁 ──────────────────────────────────────────────────────

function getMaintenanceTips(issueType, materialType) {
  const tips = []
  if (materialType === 'kerapoxy') {
    tips.push('케라폭시 시공 후 72시간 완전 경화 후 사용을 권장합니다.')
    tips.push('중성 세제로 청소 가능하며, 연 1회 전용 보호제 도포 시 수명이 연장됩니다.')
  }
  if (issueType === 'mold' || issueType === 'moisture') {
    tips.push('환기를 자주 해주시고, 사용 후 물기를 닦아주시면 곰팡이 재발을 방지할 수 있습니다.')
  }
  if (issueType === 'discoloration') {
    tips.push('케라폭시는 흡수율 0.1% 이하로 변색 재발 걱정이 없습니다.')
  }
  tips.push('5년 무상 A/S 기간 내 줄눈 변색·탈락·크랙 발생 시 무상 재시공해 드립니다.')
  return tips.join(' ')
}

// ─── JSON-LD 스키마 ───────────────────────────────────────────────

function generateCaseJsonLd(caseItem, apt, caseUrl, hubUrl) {
  const spaceText = (caseItem.space_type || '').split(',').map(s => SPACE_NAMES[s] || s).join(', ')
  const issueText = ISSUE_NAMES[caseItem.issue_type] || '줄눈 오염'
  const afterImages = parseImages(caseItem.after_image)
  const beforeImages = parseImages(caseItem.before_image)

  return JSON.stringify([
    {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": caseItem.seo_title || `${apt.districtName} ${caseItem.apartment_name} ${spaceText} 줄눈시공 사례`,
      "description": `${caseItem.apartment_name} ${spaceText} ${issueText} 개선 사례. 케라폭시 줄눈시공 Before/After.`,
      "author": { "@type": "Organization", "name": "하우스Pick", "url": BASE_URL },
      "publisher": { "@type": "Organization", "name": "하우스Pick", "url": BASE_URL, "logo": { "@type": "ImageObject", "url": `${BASE_URL}/favicon.svg` } },
      "datePublished": caseItem.work_date || caseItem.created_at?.split('T')[0],
      "dateModified": caseItem.created_at?.split('T')[0],
      "mainEntityOfPage": caseUrl,
      "image": afterImages[0] || beforeImages[0] || `${BASE_URL}/images/og/og-${apt.regionSlug}.png`,
      "about": `${caseItem.apartment_name} 줄눈시공`
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "홈", "item": `${BASE_URL}/` },
        { "@type": "ListItem", "position": 2, "name": `${apt.regionName} 줄눈시공`, "item": `${BASE_URL}/${apt.regionSlug}` },
        { "@type": "ListItem", "position": 3, "name": `${caseItem.apartment_name}`, "item": `${BASE_URL}${hubUrl}` },
        { "@type": "ListItem", "position": 4, "name": `${spaceText} 시공 사례`, "item": caseUrl }
      ]
    }
  ], null, 2)
}

// ─── 품질 게이트 ──────────────────────────────────────────────────

const MIN_PHOTOS = 3        // 전후 합산 최소 3장
const MIN_TEXT_LENGTH = 500  // SEO 본문 최소 500자

function passesQualityGate(caseItem) {
  const beforeImages = parseImages(caseItem.before_image)
  const afterImages = parseImages(caseItem.after_image)
  const totalPhotos = beforeImages.length + afterImages.length
  const textLength = (caseItem.seo_content || caseItem.detail_content || '').length
  const hasSpace = !!caseItem.space_type
  const hasIssue = !!caseItem.issue_type
  const hasMaterial = !!caseItem.material_type

  const reasons = []
  if (totalPhotos < MIN_PHOTOS) reasons.push(`사진 ${totalPhotos}장 (최소 ${MIN_PHOTOS}장)`)
  if (textLength < MIN_TEXT_LENGTH) reasons.push(`본문 ${textLength}자 (최소 ${MIN_TEXT_LENGTH}자)`)
  if (!hasSpace) reasons.push('시공 부위 없음')
  if (!hasIssue) reasons.push('문제 유형 없음')
  if (!hasMaterial) reasons.push('자재 정보 없음')

  return { pass: reasons.length === 0, reasons }
}

// ─── 유틸리티 ─────────────────────────────────────────────────────

function parseImages(imgField) {
  if (!imgField) return []
  try { return JSON.parse(imgField) } catch { return imgField ? [imgField] : [] }
}

function formatDate(dateStr) {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  return `${d.getFullYear()}년 ${d.getMonth() + 1}월 ${d.getDate()}일`
}

function generateImageAlt(aptName, spaceText, issueText, type, index, workDate, materialText) {
  if (type === 'before') return `${aptName} ${spaceText} 줄눈시공 전 사진${index > 1 ? ` ${index}` : ''}`
  if (type === 'after') return `${aptName} ${spaceText} ${issueText} 개선 후 사진${index > 1 ? ` ${index}` : ''}`
  return `${aptName} ${workDate} ${materialText} 시공 완료 이미지`
}

// ─── 메인 ─────────────────────────────────────────────────────────

async function main() {
  console.log('\n시공 사례 페이지 생성 시작...')

  // Supabase에서 승인된 사례 조회
  if (!SUPABASE_URL || !SUPABASE_KEY) {
    console.log('  ℹ️ SUPABASE 환경변수 없음 → 시공 사례 페이지 생성 스킵')
    // 빈 case-cards.json 생성 (아파트 빌드에서 참조)
    fs.writeFileSync(path.join(dataPath, 'case-cards.json'), '{}')
    return
  }

  let cases = []
  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/portfolio?status=eq.approved&select=*&order=created_at.desc`,
      { headers: { 'apikey': SUPABASE_KEY, 'Authorization': `Bearer ${SUPABASE_KEY}` } }
    )
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    cases = await res.json()
    console.log(`  ✅ Supabase에서 ${cases.length}건의 승인된 사례 조회`)
  } catch (e) {
    console.log(`  ⚠️ Supabase 조회 실패: ${e.message}`)
    fs.writeFileSync(path.join(dataPath, 'case-cards.json'), '{}')
    return
  }

  if (cases.length === 0) {
    console.log('  ℹ️ 승인된 사례 없음 → 스킵')
    fs.writeFileSync(path.join(dataPath, 'case-cards.json'), '{}')
    return
  }

  let generatedCount = 0
  let skippedCount = 0
  const sitemapUrls = []
  const caseCardsByApt = {} // apt_slug → [ card HTML ]

  for (const caseItem of cases) {
    const apt = aptMap.get(caseItem.apartment_slug)
    if (!apt) {
      console.log(`  ⚠️ 아파트 매칭 실패: ${caseItem.apartment_slug}`)
      continue
    }

    // 품질 게이트 체크
    const quality = passesQualityGate(caseItem)
    if (!quality.pass) {
      console.log(`  ⏭️ 품질 미달 (${caseItem.apartment_name}): ${quality.reasons.join(', ')}`)
      skippedCount++
      // 허브 카드에는 간단히 노출 (상세 페이지 미생성)
      if (!caseCardsByApt[caseItem.apartment_slug]) caseCardsByApt[caseItem.apartment_slug] = []
      const afterImgs = parseImages(caseItem.after_image)
      const spText = (caseItem.space_type || '').split(',').map(s => SPACE_NAMES[s] || s).join('+')
      caseCardsByApt[caseItem.apartment_slug].push({
        url: null, // 상세 페이지 없음
        spaceText: spText,
        issueText: ISSUE_NAMES[caseItem.issue_type] || '줄눈 오염',
        materialText: MATERIAL_NAMES[caseItem.material_type] || '케라폭시',
        workDate: caseItem.work_date ? formatDate(caseItem.work_date) : '',
        afterImage: afterImgs[0] || '',
        beforeImage: parseImages(caseItem.before_image)[0] || ''
      })
      continue
    }

    // case_slug 생성 (없으면 ID 기반)
    const caseSlug = caseItem.case_slug || `case-${caseItem.id}`
    const hubUrl = `/${apt.regionSlug}/${apt.districtSlug}/${apt.slug}`
    const caseUrl = `${hubUrl}/cases/${caseSlug}`
    const fullCaseUrl = `${BASE_URL}${caseUrl}`

    const spaceText = (caseItem.space_type || '').split(',').map(s => SPACE_NAMES[s] || s).join(' + ')
    const issueText = ISSUE_NAMES[caseItem.issue_type] || '줄눈 오염'
    const materialText = MATERIAL_NAMES[caseItem.material_type] || '케라폭시'
    const workDateText = caseItem.work_date ? formatDate(caseItem.work_date) : formatDate(caseItem.created_at)
    const beforeImages = parseImages(caseItem.before_image)
    const afterImages = parseImages(caseItem.after_image)

    // 사진 비교 HTML
    let photoCompareHtml = ''
    if (beforeImages.length > 0 && afterImages.length > 0) {
      photoCompareHtml = `        <div class="photo-compare">
          <div class="photo-compare-single">
            <img src="${beforeImages[0]}" alt="${generateImageAlt(caseItem.apartment_name, spaceText, issueText, 'before', 1, workDateText, materialText)}" loading="lazy">
            <div class="photo-compare-label label-before">시공 전</div>
          </div>
          <div class="photo-compare-single">
            <img src="${afterImages[0]}" alt="${generateImageAlt(caseItem.apartment_name, spaceText, issueText, 'after', 1, workDateText, materialText)}" loading="lazy">
            <div class="photo-compare-label label-after">시공 후</div>
          </div>
        </div>`
    }

    // 추가 사진 (before/after 구분 alt)
    const extraBefore = beforeImages.slice(1).map((url, i) => ({url, alt: generateImageAlt(caseItem.apartment_name, spaceText, issueText, 'before', i + 2, workDateText, materialText)}))
    const extraAfter = afterImages.slice(1).map((url, i) => ({url, alt: generateImageAlt(caseItem.apartment_name, spaceText, issueText, 'after', i + 2, workDateText, materialText)}))
    const extraAll = [...extraBefore, ...extraAfter]
    const photoExtraHtml = extraAll.length > 0
      ? `        <div class="photo-extra">${extraAll.map(img => `<img src="${img.url}" alt="${img.alt}" loading="lazy">`).join('\n')}</div>`
      : ''

    // 본문 HTML
    const contentParagraphs = (caseItem.seo_content || caseItem.detail_content || '').split('\n\n').filter(Boolean)
    const caseContentHtml = contentParagraphs.map(p => `        <p>${p}</p>`).join('\n')

    // 관리 팁
    const tips = caseItem.maintenance_tips || getMaintenanceTips(caseItem.issue_type, caseItem.material_type)
    const tipsHtml = tips ? `      <div class="case-tips">
        <h3>시공 후 관리 팁</h3>
        <p>${tips}</p>
      </div>` : ''

    // 관련 사례 (같은 아파트)
    const relatedCases = cases.filter(c => c.apartment_slug === caseItem.apartment_slug && c.id !== caseItem.id).slice(0, 4)
    let relatedHtml = ''
    if (relatedCases.length > 0) {
      const cards = relatedCases.map(rc => {
        const rcAfter = parseImages(rc.after_image)
        const rcSpace = (rc.space_type || '').split(',').map(s => SPACE_NAMES[s] || s).join('+')
        const rcSlug = rc.case_slug || `case-${rc.id}`
        const rcDate = rc.work_date ? formatDate(rc.work_date) : ''
        return `          <a href="${hubUrl}/cases/${rcSlug}" class="related-card">
            ${rcAfter[0] ? `<img src="${rcAfter[0]}" alt="${rc.apartment_name} ${rcSpace} 시공 사례" loading="lazy">` : ''}
            <div class="related-card-body">
              <div class="related-card-title">${rcSpace} 시공</div>
              <div class="related-card-meta">${rcDate}</div>
            </div>
          </a>`
      }).join('\n')
      relatedHtml = `      <div class="case-related">
        <h3>${caseItem.apartment_name} 다른 시공 사례</h3>
        <div class="related-cards">
${cards}
        </div>
      </div>`
    }

    // 메타 데이터
    const caseTitle = caseItem.seo_title || `${apt.districtName} ${caseItem.apartment_name} ${spaceText} 줄눈시공 사례 | ${issueText} | ${workDateText}`
    const caseDesc = `${caseItem.apartment_name} ${spaceText}에서 진행한 ${issueText} 개선 사례. ${materialText} 사용, Before/After 사진 포함. 정찰제 가격, 5년 무상 A/S.`
    const caseKeywords = `${caseItem.apartment_name} 줄눈시공, ${apt.districtName} 줄눈, ${spaceText} 줄눈, ${issueText} 줄눈, ${materialText}`

    // H1 (title과 다르게)
    const caseH1 = `${caseItem.apartment_name} ${spaceText} ${materialText} 줄눈시공 – ${issueText} 개선 사례`

    // HTML 생성
    let html = template
      .replace(/\{\{CASE_TITLE\}\}/g, caseTitle)
      .replace(/\{\{CASE_DESCRIPTION\}\}/g, caseDesc)
      .replace(/\{\{CASE_KEYWORDS\}\}/g, caseKeywords)
      .replace(/\{\{CASE_CANONICAL\}\}/g, fullCaseUrl)
      .replace(/\{\{CASE_H1\}\}/g, caseH1)
      .replace(/\{\{OG_IMAGE\}\}/g, afterImages[0] || `${BASE_URL}/images/og/og-${apt.regionSlug}.png`)
      .replace(/\{\{VITE_CSS\}\}/g, viteCss)
      .replace(/\{\{REGION_SLUG\}\}/g, apt.regionSlug)
      .replace(/\{\{REGION_NAME\}\}/g, apt.regionName)
      .replace(/\{\{DISTRICT_NAME\}\}/g, apt.districtName)
      .replace(/\{\{APT_NAME\}\}/g, caseItem.apartment_name)
      .replace(/\{\{HOUSEHOLDS\}\}/g, (apt.households || 0).toLocaleString())
      .replace(/\{\{HUB_URL\}\}/g, hubUrl)
      .replace(/\{\{SPACE_TEXT\}\}/g, spaceText)
      .replace(/\{\{ISSUE_TEXT\}\}/g, issueText)
      .replace(/\{\{MATERIAL_TEXT\}\}/g, materialText)
      .replace(/\{\{WORK_DATE_TEXT\}\}/g, workDateText)
      .replace(/\{\{PRICE_TEXT\}\}/g, getPriceText(caseItem.space_type))
      .replace('{{PHOTO_COMPARE_HTML}}', photoCompareHtml)
      .replace('{{PHOTO_EXTRA_HTML}}', photoExtraHtml)
      .replace('{{CASE_CONTENT_HTML}}', caseContentHtml)
      .replace('{{TIPS_HTML}}', tipsHtml)
      .replace('{{RELATED_CASES_HTML}}', relatedHtml)
      .replace('{{JSON_LD}}', generateCaseJsonLd(caseItem, apt, fullCaseUrl, hubUrl))

    // 파일 저장
    const outputDir = path.join(distPath, apt.regionSlug, apt.districtSlug, apt.slug, 'cases', caseSlug)
    fs.mkdirSync(outputDir, { recursive: true })
    fs.writeFileSync(path.join(outputDir, 'index.html'), html)

    generatedCount++
    sitemapUrls.push(fullCaseUrl)

    // 허브 페이지용 카드 데이터 수집
    if (!caseCardsByApt[caseItem.apartment_slug]) caseCardsByApt[caseItem.apartment_slug] = []
    caseCardsByApt[caseItem.apartment_slug].push({
      url: caseUrl,
      spaceText,
      issueText,
      materialText,
      workDate: workDateText,
      afterImage: afterImages[0] || '',
      beforeImage: beforeImages[0] || ''
    })
  }

  // case-cards.json 저장 (아파트 빌드에서 참조)
  fs.writeFileSync(path.join(dataPath, 'case-cards.json'), JSON.stringify(caseCardsByApt, null, 2))
  console.log(`  ✅ case-cards.json 생성 (${Object.keys(caseCardsByApt).length}개 아파트)`)

  // sitemap에 추가
  if (sitemapUrls.length > 0) {
    const sitemapPath = path.join(distPath, 'sitemap.xml')
    if (fs.existsSync(sitemapPath)) {
      let sitemap = fs.readFileSync(sitemapPath, 'utf-8')
      const today = new Date().toISOString().split('T')[0]
      const caseUrlsXml = sitemapUrls.map(url => `  <url>
    <loc>${url}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>`).join('\n')
      sitemap = sitemap.replace('</urlset>', `${caseUrlsXml}\n</urlset>`)
      fs.writeFileSync(sitemapPath, sitemap)
      console.log(`  ✅ sitemap.xml에 사례 ${sitemapUrls.length}개 URL 추가`)
    }
  }

  console.log(`\n✅ 시공 사례 페이지 생성 완료: ${generatedCount}개`)
  if (skippedCount > 0) {
    console.log(`  ⏭️ 품질 미달로 상세 페이지 미생성: ${skippedCount}건 (허브 카드에만 노출)`)
  }
}

main().catch(console.error)
