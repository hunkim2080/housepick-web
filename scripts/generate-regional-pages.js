import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { regions as regionsData } from '../src/data/regions.js'
import {
  generateDynamicTitle,
  generateDynamicDescription,
  generateMetaKeywords,
  generateSEOContent,
  generateHashtags,
  generateRating,
  generateProjectData
} from '../src/utils/contentGenerator.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const BASE_URL = 'https://housepick-web.vercel.app'

// regions.js에서 가져온 데이터 사용
const regions = regionsData

// 지역 레이블 생성 함수 (OG 이미지와 동일한 형식)
function getRegionLabel(region) {
  const provinceShort = {
    '서울특별시': '서울',
    '경기도': '경기',
    '인천광역시': '인천'
  }
  const short = provinceShort[region.province] || region.province
  // 인천은 "인천광역시 인천광역시"가 되므로 "인천"만 반환
  if (region.slug === 'incheon') return '인천'
  return `${short} ${region.fullName}`
}

// 67개 지역 slug 매핑
const areaSlugMap = {
  // 서울 (25개)
  '강남': 'gangnam', '강동': 'gangdong', '강북': 'gangbuk', '강서': 'gangseo',
  '관악': 'gwanak', '광진': 'gwangjin', '구로': 'guro', '금천': 'geumcheon',
  '노원': 'nowon', '도봉': 'dobong', '동대문': 'dongdaemun', '동작': 'dongjak',
  '마포': 'mapo', '서대문': 'seodaemun', '서초': 'seocho', '성동': 'seongdong',
  '성북': 'seongbuk', '송파': 'songpa', '양천': 'yangcheon', '영등포': 'yeongdeungpo',
  '용산': 'yongsan', '은평': 'eunpyeong', '종로': 'jongno', '중구': 'junggu-seoul',
  '중랑': 'jungnang',
  // 경기 (31개)
  '수원': 'suwon', '성남': 'seongnam', '용인': 'yongin', '부천': 'bucheon',
  '안산': 'ansan', '안양': 'anyang', '남양주': 'namyangju', '화성': 'hwaseong',
  '평택': 'pyeongtaek', '시흥': 'siheung', '김포': 'gimpo', '광명': 'gwangmyeong',
  '광주': 'gwangju-gg', '군포': 'gunpo', '하남': 'hanam', '오산': 'osan',
  '이천': 'icheon', '안성': 'anseong', '의왕': 'uiwang', '구리': 'guri',
  '의정부': 'uijeongbu', '고양': 'goyang', '파주': 'paju', '양주': 'yangju',
  '포천': 'pocheon', '과천': 'gwacheon',
  '동두천': 'dongducheon', '여주': 'yeoju', '연천': 'yeoncheon', '가평': 'gapyeong', '양평': 'yangpyeong',
  // 인천 (11개)
  '인천': 'incheon',
  '인천 중구': 'junggu-incheon', '인천중구': 'junggu-incheon', '중구(인천)': 'junggu-incheon',
  '인천 동구': 'donggu-incheon', '인천동구': 'donggu-incheon', '동구(인천)': 'donggu-incheon',
  '미추홀': 'michuhol', '미추홀구': 'michuhol',
  '연수': 'yeonsu', '연수구': 'yeonsu',
  '남동': 'namdong', '남동구': 'namdong',
  '부평': 'bupyeong', '부평구': 'bupyeong',
  '계양': 'gyeyang', '계양구': 'gyeyang',
  '인천 서구': 'seogu-incheon', '인천서구': 'seogu-incheon', '서구(인천)': 'seogu-incheon',
  '강화': 'ganghwa', '강화군': 'ganghwa',
  '옹진': 'ongjin', '옹진군': 'ongjin'
}

// 인근 지역 링크 HTML 생성
function generateNearbyLinksHtml(region) {
  if (!region.nearbyAreas || region.nearbyAreas.length === 0) return ''

  const links = region.nearbyAreas.map(area => {
    const slug = areaSlugMap[area] || area.toLowerCase()
    return `        <a href="/${slug}" class="inline-flex items-center gap-1 px-4 py-2 bg-white border border-stone-200 rounded-full text-stone-600 hover:border-amber-400 hover:text-amber-600 hover:bg-amber-50 transition-all text-sm">${area} 줄눈시공 →</a>`
  }).join('\n')

  return `
      <!-- 인근 지역 링크 (SSG) -->
      <section class="py-12 px-6 bg-white border-t border-stone-100">
        <div class="max-w-5xl mx-auto">
          <h3 class="text-lg font-semibold text-stone-800 mb-4">📍 ${region.name} 인근 지역 줄눈시공</h3>
          <div class="flex flex-wrap gap-3">
${links}
          </div>
        </div>
      </section>`
}

// 해시태그 HTML 생성
function generateHashtagsHtml(hashtags, regionName) {
  const tags = hashtags.map(tag =>
    `        <span class="bg-white border border-stone-200 hover:border-amber-400 hover:bg-amber-50 rounded-full px-4 py-2 text-sm text-stone-600 hover:text-amber-600 transition-all cursor-default">#${tag}</span>`
  ).join('\n')

  return `
      <!-- 해시태그 클라우드 (SSG) -->
      <section class="py-12 px-6 bg-stone-100 border-t border-stone-200">
        <div class="max-w-5xl mx-auto">
          <h3 class="text-lg font-semibold text-stone-800 mb-4"># ${regionName} 줄눈시공 관련 태그</h3>
          <div class="flex flex-wrap gap-2">
${tags}
          </div>
        </div>
      </section>`
}

// SEO 본문 콘텐츠 HTML 생성
function generateSEOBodyHtml(region, seoContent) {
  const { intro, bodyParts, conclusion } = seoContent

  let bodyHtml = bodyParts.map(part => `
          <div class="bg-white rounded-xl p-6 shadow-sm">
            <h4 class="font-semibold text-stone-800 mb-2">${part.title}</h4>
            <p class="text-stone-600 text-sm leading-relaxed">${part.content}</p>
          </div>`).join('')

  return `
      <!-- SEO 스토리텔링 콘텐츠 (SSG) -->
      <section class="py-12 px-6 bg-gradient-to-b from-amber-50 to-white">
        <div class="max-w-5xl mx-auto">
          <p class="text-stone-700 leading-relaxed mb-8">${intro}</p>
          <div class="grid md:grid-cols-3 gap-6 mb-8">
${bodyHtml}
          </div>
          <p class="text-stone-700 leading-relaxed">${conclusion}</p>
        </div>
      </section>`
}

// 지역 소개 섹션 HTML 생성
function generateRegionIntroHtml(region) {
  const landmarksHtml = region.landmarks && region.landmarks.length > 0
    ? `
          <div class="mb-6">
            <h4 class="text-sm font-semibold text-stone-500 mb-2">주요 랜드마크</h4>
            <div class="flex flex-wrap gap-2">
              ${region.landmarks.map(l => `<span class="px-3 py-1 bg-stone-100 rounded-full text-sm text-stone-600">${l}</span>`).join('')}
            </div>
          </div>`
    : ''

  const apartmentsHtml = region.apartments && region.apartments.length > 0
    ? `
          <div>
            <h4 class="text-sm font-semibold text-stone-500 mb-2">주요 아파트</h4>
            <div class="flex flex-wrap gap-2">
              ${region.apartments.map(a => `<span class="px-3 py-1 bg-amber-50 border border-amber-200 rounded-full text-sm text-amber-700">${a}</span>`).join('')}
            </div>
          </div>`
    : ''

  return `
      <!-- 지역 소개 (SSG) -->
      <section class="py-12 px-6 bg-white">
        <div class="max-w-5xl mx-auto">
          <h2 class="text-2xl font-bold text-stone-800 mb-4">${region.fullName} 줄눈시공</h2>
          <p class="text-stone-600 leading-relaxed mb-6">${region.description || ''}</p>
${landmarksHtml}${apartmentsHtml}
        </div>
      </section>`
}

// 세부 지역(subAreas) HTML 생성
function generateSubAreasHtml(region) {
  if (!region.subAreas || region.subAreas.length === 0) return ''

  const areas = region.subAreas.map(area =>
    `        <span class="px-3 py-1 bg-stone-50 border border-stone-200 rounded-full text-sm text-stone-600">${area}</span>`
  ).join('\n')

  return `
      <!-- 세부 서비스 지역 (SSG) -->
      <section class="py-8 px-6 bg-stone-50 border-t border-stone-200">
        <div class="max-w-5xl mx-auto">
          <h4 class="text-sm font-semibold text-stone-500 mb-3">${region.fullName} 세부 서비스 지역</h4>
          <div class="flex flex-wrap gap-2">
${areas}
          </div>
        </div>
      </section>`
}

// 포트폴리오 이미지 HTML 생성 (SSG용 - 검색엔진 크롤링 가능한 img 태그 포함)
function generatePortfolioImagesHtml(region) {
  // 실제 projects가 있으면 사용, 없으면 자동 생성
  const projects = region.projects && region.projects.length > 0
    ? region.projects
    : generateProjectData(region)

  if (projects.length === 0) return ''

  const imagesHtml = projects.slice(0, 3).map(project => {
    // Alt 텍스트: {지역명} 줄눈 시공 사례 - {프로젝트명}
    const altBefore = `${region.fullName} ${project.location} 줄눈시공 시공 전 - ${project.title}`
    const altAfter = `${region.fullName} ${project.location} 줄눈시공 시공 후 - ${project.title}`

    return `        <div class="portfolio-item" id="project-${project.id}">
          <h4 class="text-sm font-semibold text-stone-700 mb-2">${project.title}</h4>
          <div class="grid grid-cols-2 gap-2">
            <img
              src="${project.images.before}"
              alt="${altBefore}"
              width="300" height="200"
              loading="lazy"
              class="rounded-lg object-cover w-full"
            />
            <img
              src="${project.images.after}"
              alt="${altAfter}"
              width="300" height="200"
              loading="lazy"
              class="rounded-lg object-cover w-full"
            />
          </div>
          <p class="text-xs text-stone-500 mt-1">${project.date} · ${project.scope}</p>
        </div>`
  }).join('\n')

  return `
      <!-- 포트폴리오 이미지 (SSG - 검색엔진 크롤링 가능) -->
      <section class="py-12 px-6 bg-white border-t border-stone-100">
        <div class="max-w-5xl mx-auto">
          <h3 class="text-lg font-semibold text-stone-800 mb-6">${region.name} 줄눈시공 사례</h3>
          <div class="grid md:grid-cols-3 gap-6">
${imagesHtml}
          </div>
        </div>
      </section>`
}

// LocalBusiness JSON-LD 동적 생성 (동적 평점 + 서비스 카탈로그)
function generateLocalBusinessJsonLd(region) {
  const { ratingValue, reviewCount } = generateRating(region)
  const landmarksText = region.landmarks && region.landmarks.length > 0
    ? ` ${region.landmarks.slice(0, 3).join(', ')} 인근.`
    : ''

  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${BASE_URL}/${region.slug}`,
    "name": `하우스Pick ${region.name}`,
    "description": `${region.fullName} 줄눈시공 전문업체. 업계 최초 정찰제, 5년 무상보장.${landmarksText}`,
    "url": `${BASE_URL}/${region.slug}`,
    "telephone": "010-6461-0131",
    "areaServed": {
      "@type": "City",
      "name": region.fullName,
      "containedIn": {
        "@type": "AdministrativeArea",
        "name": region.province
      }
    },
    "serviceType": ["줄눈시공", "타일줄눈", "화장실줄눈", "거실줄눈"],
    "priceRange": "$$",
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": ratingValue,
      "reviewCount": reviewCount.toString()
    },
    "address": {
      "@type": "PostalAddress",
      "addressLocality": region.fullName,
      "addressRegion": region.province,
      "addressCountry": "KR"
    },
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "줄눈시공 서비스",
      "itemListElement": [
        { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "화장실 줄눈시공" } },
        { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "거실 줄눈시공" } },
        { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "현관 줄눈시공" } }
      ]
    }
  }
}

// ItemList JSON-LD 생성 (포트폴리오 캐러셀용)
function generateItemListJsonLd(region) {
  // 실제 projects가 있으면 사용, 없으면 자동 생성
  const projects = region.projects && region.projects.length > 0
    ? region.projects
    : generateProjectData(region)

  // 최소 2개 항목 필요
  if (projects.length < 2) return null

  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": `${region.fullName} 줄눈시공 포트폴리오`,
    "description": `하우스Pick의 ${region.fullName} 줄눈시공 시공 사례입니다.`,
    "numberOfItems": projects.length,
    "itemListElement": projects.map((project, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "item": {
        "@type": "Service",
        "@id": `${BASE_URL}/${region.slug}#project-${project.id}`,
        "name": project.title,
        "description": project.description,
        "serviceType": "줄눈시공",
        "areaServed": {
          "@type": "Place",
          "name": project.location
        },
        "provider": {
          "@type": "LocalBusiness",
          "name": "하우스Pick",
          "@id": `${BASE_URL}/${region.slug}`
        },
        "image": [
          {
            "@type": "ImageObject",
            "url": `${BASE_URL}${project.images.before}`,
            "name": `${project.title} 시공 전`
          },
          {
            "@type": "ImageObject",
            "url": `${BASE_URL}${project.images.after}`,
            "name": `${project.title} 시공 후`
          }
        ]
      }
    }))
  }
}

// 기존 regions 데이터 (백업용, 이제 사용하지 않음)
const regionsBackup = [
  // 서울
  { slug: 'gangnam', name: '강남', fullName: '강남구', province: '서울특별시', keywords: ['강남 줄눈', '강남구 줄눈시공', '강남 화장실 줄눈'], landmarks: ['코엑스', '삼성역', '강남역', '봉은사', '선릉'], apartments: ['래미안 퍼스티지', '대치 아이파크', '도곡렉슬', '타워팰리스'], description: '강남구는 서울의 대표 주거·상업 중심지입니다. 역삼동, 삼성동, 대치동, 도곡동 등 고급 아파트가 밀집해 있으며, 특히 15~25년 된 아파트의 줄눈 리뉴얼 수요가 높습니다.' },
  { slug: 'gangdong', name: '강동', fullName: '강동구', province: '서울특별시', keywords: ['강동 줄눈', '강동구 줄눈시공', '강동 화장실 줄눈'], landmarks: ['천호역', '암사역사유적지', '길동생태공원'], apartments: ['고덕 래미안', '고덕 그라시움', '힐스테이트 천호역'], description: '강동구는 고덕동, 천호동, 암사동 등 대단지 아파트가 많은 주거지역입니다. 최근 재건축과 리모델링이 활발하여 줄눈시공 수요가 꾸준히 증가하고 있습니다.' },
  { slug: 'gangbuk', name: '강북', fullName: '강북구', province: '서울특별시', keywords: ['강북 줄눈', '강북구 줄눈시공', '강북 화장실 줄눈'], landmarks: ['북한산', '수유역', '4.19 국립묘지'], apartments: ['래미안 수유', '미아사거리 SK', '번동 주공'], description: '강북구는 북한산 자락에 위치한 친환경 주거지역입니다. 수유동, 미아동, 번동 등 오래된 아파트 단지가 많아 줄눈 교체 및 리뉴얼 수요가 높습니다.' },
  { slug: 'gangseo', name: '강서', fullName: '강서구', province: '서울특별시', keywords: ['강서 줄눈', '강서구 줄눈시공', '강서 화장실 줄눈'], landmarks: ['김포공항', '마곡역', '가양역', '발산역'], apartments: ['마곡 엠밸리', '등촌 래미안', '화곡 푸르지오'], description: '강서구는 마곡지구 개발로 신축 아파트가 늘어난 지역입니다. 화곡동, 등촌동의 기존 아파트와 마곡 신도시 모두에서 줄눈시공 문의가 활발합니다.' },
  { slug: 'gwanak', name: '관악', fullName: '관악구', province: '서울특별시', keywords: ['관악 줄눈', '관악구 줄눈시공', '관악 화장실 줄눈'], landmarks: ['서울대학교', '신림역', '관악산', '서울대입구역'], apartments: ['신림 푸르지오', '봉천 래미안', '신림 e편한세상'], description: '관악구는 서울대학교와 관악산이 있는 교육·자연 환경이 좋은 지역입니다. 신림동, 봉천동의 20년 이상 된 아파트에서 줄눈 리뉴얼 문의가 많습니다.' },
  { slug: 'gwangjin', name: '광진', fullName: '광진구', province: '서울특별시', keywords: ['광진 줄눈', '광진구 줄눈시공', '광진 화장실 줄눈'], landmarks: ['건국대학교', '뚝섬유원지', '아차산', '광나루역'], apartments: ['광장동 현대', '자양동 래미안', '구의 현대'], description: '광진구는 한강변과 아차산을 끼고 있는 쾌적한 주거지역입니다. 광장동, 자양동, 구의동의 중대형 아파트에서 줄눈시공 문의가 꾸준합니다.' },
  { slug: 'guro', name: '구로', fullName: '구로구', province: '서울특별시', keywords: ['구로 줄눈', '구로구 줄눈시공', '구로 화장실 줄눈'], landmarks: ['구로디지털단지', '신도림역', '고척스카이돔'], apartments: ['신도림 푸르지오', '고척 래미안', '구로 파크리오'], description: '구로구는 IT 산업단지와 주거지역이 조화를 이루는 지역입니다. 신도림동, 고척동, 개봉동 등 다양한 연식의 아파트에서 줄눈시공 수요가 있습니다.' },
  { slug: 'geumcheon', name: '금천', fullName: '금천구', province: '서울특별시', keywords: ['금천 줄눈', '금천구 줄눈시공', '금천 화장실 줄눈'], landmarks: ['가산디지털단지', '독산역', '금천구청역'], apartments: ['독산 롯데캐슬', '시흥동 래미안', '가산 두산위브'], description: '금천구는 가산디지털단지를 중심으로 발전하는 지역입니다. 독산동, 시흥동의 아파트 단지에서 화장실·현관 줄눈시공 문의가 늘고 있습니다.' },
  { slug: 'nowon', name: '노원', fullName: '노원구', province: '서울특별시', keywords: ['노원 줄눈', '노원구 줄눈시공', '노원 화장실 줄눈'], landmarks: ['노원역', '수락산', '태릉', '노원구청'], apartments: ['상계주공', '중계 그린', '하계 현대', '월계 래미안'], description: '노원구는 서울 동북부 최대 주거지역입니다. 상계동, 중계동, 하계동의 대단지 아파트가 많으며, 20~30년 된 아파트의 줄눈 교체 수요가 매우 높습니다.' },
  { slug: 'dobong', name: '도봉', fullName: '도봉구', province: '서울특별시', keywords: ['도봉 줄눈', '도봉구 줄눈시공', '도봉 화장실 줄눈'], landmarks: ['도봉산', '도봉역', '쌍문역', '방학역'], apartments: ['쌍문 래미안', '창동 주공', '방학 현대'], description: '도봉구는 도봉산과 인접한 자연친화적 주거지역입니다. 쌍문동, 창동, 방학동의 오래된 아파트 단지에서 줄눈 리뉴얼 문의가 많습니다.' },
  { slug: 'dongdaemun', name: '동대문', fullName: '동대문구', province: '서울특별시', keywords: ['동대문 줄눈', '동대문구 줄눈시공', '동대문 화장실 줄눈'], landmarks: ['경희대학교', '청량리역', '동대문역', '배봉산'], apartments: ['전농동 래미안', '이문 힐스테이트', '휘경 현대'], description: '동대문구는 경희대, 한국외대 등 대학가와 주거지역이 어우러진 지역입니다. 전농동, 이문동, 휘경동의 아파트에서 줄눈시공 문의가 꾸준합니다.' },
  { slug: 'dongjak', name: '동작', fullName: '동작구', province: '서울특별시', keywords: ['동작 줄눈', '동작구 줄눈시공', '동작 화장실 줄눈'], landmarks: ['노량진역', '사당역', '동작대교', '국립현충원'], apartments: ['흑석 래미안', '상도 푸르지오', '사당 현대'], description: '동작구는 한강과 관악산 사이에 위치한 주거지역입니다. 사당동, 상도동, 흑석동의 아파트에서 화장실·거실 줄눈시공 문의가 활발합니다.' },
  { slug: 'mapo', name: '마포', fullName: '마포구', province: '서울특별시', keywords: ['마포 줄눈', '마포구 줄눈시공', '마포 화장실 줄눈'], landmarks: ['홍대입구역', '합정역', '상암월드컵경기장'], apartments: ['상암 월드컵파크', '마포 래미안', '공덕 자이'], description: '마포구는 홍대, 합정 등 젊은 문화와 상암 미디어시티가 있는 역동적인 지역입니다. 상암동, 공덕동, 성산동의 아파트에서 줄눈시공 수요가 있습니다.' },
  { slug: 'seodaemun', name: '서대문', fullName: '서대문구', province: '서울특별시', keywords: ['서대문 줄눈', '서대문구 줄눈시공', '서대문 화장실 줄눈'], landmarks: ['신촌역', '이화여대', '연세대학교', '안산'], apartments: ['북가좌 래미안', '남가좌 현대', '연희 삼성'], description: '서대문구는 연세대, 이화여대 등 대학가와 주거지역이 공존하는 곳입니다. 북가좌동, 남가좌동, 연희동의 아파트에서 줄눈시공 문의가 있습니다.' },
  { slug: 'seocho', name: '서초', fullName: '서초구', province: '서울특별시', keywords: ['서초 줄눈', '서초구 줄눈시공', '서초 화장실 줄눈'], landmarks: ['강남역', '교대역', '예술의전당', '반포대교'], apartments: ['반포 자이', '서초 래미안', '방배 삼성', '잠원 한신'], description: '서초구는 서울 강남권의 핵심 주거지역입니다. 반포동, 잠원동, 방배동의 고급 아파트에서 프리미엄 줄눈시공 문의가 많습니다.' },
  { slug: 'seongdong', name: '성동', fullName: '성동구', province: '서울특별시', keywords: ['성동 줄눈', '성동구 줄눈시공', '성동 화장실 줄눈'], landmarks: ['왕십리역', '성수역', '서울숲', '뚝섬역'], apartments: ['옥수 래미안', '금호 삼성', '성수 트리마제'], description: '성동구는 서울숲과 한강이 있는 친환경 주거지역입니다. 성수동, 옥수동, 금호동의 아파트에서 줄눈시공 문의가 늘고 있습니다.' },
  { slug: 'seongbuk', name: '성북', fullName: '성북구', province: '서울특별시', keywords: ['성북 줄눈', '성북구 줄눈시공', '성북 화장실 줄눈'], landmarks: ['고려대학교', '길음역', '성신여대', '북악산'], apartments: ['길음 래미안', '돈암 삼성', '정릉 현대'], description: '성북구는 고려대, 성신여대 등 대학가와 북악산 자락의 주거지역입니다. 길음동, 돈암동, 정릉동의 아파트에서 줄눈시공 문의가 있습니다.' },
  { slug: 'songpa', name: '송파', fullName: '송파구', province: '서울특별시', keywords: ['송파 줄눈', '송파구 줄눈시공', '송파 화장실 줄눈'], landmarks: ['잠실역', '롯데월드', '올림픽공원', '석촌호수'], apartments: ['잠실 엘스', '잠실 리센츠', '파크리오', '헬리오시티'], description: '송파구는 잠실을 중심으로 한 서울 동남부 최대 주거지역입니다. 잠실동, 문정동, 가락동의 대단지 아파트에서 줄눈시공 수요가 매우 높습니다.' },
  { slug: 'yangcheon', name: '양천', fullName: '양천구', province: '서울특별시', keywords: ['양천 줄눈', '양천구 줄눈시공', '양천 화장실 줄눈'], landmarks: ['목동역', '오목교역', '파리공원', '목동종합운동장'], apartments: ['목동 신시가지', '목동 하이페리온', '목동 현대'], description: '양천구는 목동 신시가지로 유명한 교육 중심 주거지역입니다. 목동, 신정동의 25년 이상 된 아파트에서 줄눈 리뉴얼 문의가 특히 많습니다.' },
  { slug: 'yeongdeungpo', name: '영등포', fullName: '영등포구', province: '서울특별시', keywords: ['영등포 줄눈', '영등포구 줄눈시공', '영등포 화장실 줄눈'], landmarks: ['여의도', '영등포역', 'IFC', '여의도공원'], apartments: ['여의도 시범', '당산 래미안', '신길 푸르지오'], description: '영등포구는 여의도 금융중심지와 주거지역이 공존하는 곳입니다. 여의도동, 당산동, 신길동의 아파트에서 줄눈시공 문의가 꾸준합니다.' },
  { slug: 'yongsan', name: '용산', fullName: '용산구', province: '서울특별시', keywords: ['용산 줄눈', '용산구 줄눈시공', '용산 화장실 줄눈'], landmarks: ['용산역', '이태원', '남산타워', '국립중앙박물관'], apartments: ['이촌 래미안', '한남 더힐', '용산 푸르지오'], description: '용산구는 한강변과 남산 사이에 위치한 프리미엄 주거지역입니다. 이촌동, 한남동의 고급 아파트에서 줄눈시공 문의가 많습니다.' },
  { slug: 'eunpyeong', name: '은평', fullName: '은평구', province: '서울특별시', keywords: ['은평 줄눈', '은평구 줄눈시공', '은평 화장실 줄눈'], landmarks: ['은평한옥마을', '불광역', '연신내역', '북한산'], apartments: ['은평 뉴타운', '불광 래미안', '응암 현대'], description: '은평구는 북한산과 인접한 친환경 주거지역입니다. 은평 뉴타운과 불광동, 응암동의 아파트에서 줄눈시공 문의가 늘고 있습니다.' },
  { slug: 'jongno', name: '종로', fullName: '종로구', province: '서울특별시', keywords: ['종로 줄눈', '종로구 줄눈시공', '종로 화장실 줄눈'], landmarks: ['광화문', '경복궁', '인사동', '종로3가'], apartments: ['세운 래미안', '무악 현대', '평창 삼성'], description: '종로구는 서울의 역사·문화 중심지입니다. 무악동, 평창동 등 주거지역의 아파트에서 줄눈시공 문의가 있습니다.' },
  { slug: 'junggu-seoul', name: '중구', fullName: '중구', province: '서울특별시', keywords: ['중구 줄눈', '서울 중구 줄눈시공', '중구 화장실 줄눈'], landmarks: ['명동', '남대문시장', '서울역', 'N서울타워'], apartments: ['신당 래미안', '황학동 삼성', '약수 하이츠'], description: '서울 중구는 명동, 을지로 등 도심 중심지입니다. 신당동, 황학동, 약수동의 아파트에서 줄눈시공 문의가 있습니다.' },
  { slug: 'jungnang', name: '중랑', fullName: '중랑구', province: '서울특별시', keywords: ['중랑 줄눈', '중랑구 줄눈시공', '중랑 화장실 줄눈'], landmarks: ['망우역', '면목역', '중랑천', '용마산'], apartments: ['면목 래미안', '상봉 프레미어스', '신내 데시앙'], description: '중랑구는 중랑천과 용마산이 있는 주거지역입니다. 면목동, 상봉동, 신내동의 아파트에서 줄눈시공 문의가 꾸준합니다.' },
  // 경기도
  { slug: 'suwon', name: '수원', fullName: '수원시', province: '경기도', keywords: ['수원 줄눈', '수원시 줄눈시공', '수원 화장실 줄눈'], landmarks: ['수원화성', '수원역', '광교호수공원', '삼성전자'], apartments: ['광교 자연앤', '영통 래미안', '권선 푸르지오'], description: '수원시는 경기도 남부 최대 도시로 광교신도시와 영통, 권선 등 주거지역이 발달했습니다. 다양한 연식의 아파트에서 줄눈시공 수요가 높습니다.' },
  { slug: 'seongnam', name: '성남', fullName: '성남시', province: '경기도', keywords: ['성남 줄눈', '성남시 줄눈시공', '분당 줄눈'], landmarks: ['판교테크노밸리', '분당서현역', '판교역', '율동공원'], apartments: ['분당 한양수자인', '판교 알파리움', '정자 아이파크'], description: '성남시는 분당과 판교를 중심으로 한 수도권 대표 주거지역입니다. 분당구 아파트의 줄눈 리뉴얼 수요가 특히 많습니다.' },
  { slug: 'yongin', name: '용인', fullName: '용인시', province: '경기도', keywords: ['용인 줄눈', '용인시 줄눈시공', '수지 줄눈'], landmarks: ['에버랜드', '한국민속촌', '용인역', '경희대'], apartments: ['수지 래미안', '죽전 자이', '기흥 롯데캐슬'], description: '용인시는 수지, 죽전, 기흥 등 대규모 주거단지가 발달한 도시입니다. 15~20년 된 아파트의 줄눈시공 문의가 많습니다.' },
  { slug: 'bucheon', name: '부천', fullName: '부천시', province: '경기도', keywords: ['부천 줄눈', '부천시 줄눈시공', '부천 화장실 줄눈'], landmarks: ['부천역', '중동역', '원미산', '부천종합운동장'], apartments: ['중동 신시가지', '상동 래미안', '소사 푸르지오'], description: '부천시는 서울과 인천 사이에 위치한 베드타운입니다. 중동, 상동, 소사 지역의 아파트에서 줄눈시공 문의가 활발합니다.' },
  { slug: 'ansan', name: '안산', fullName: '안산시', province: '경기도', keywords: ['안산 줄눈', '안산시 줄눈시공', '안산 화장실 줄눈'], landmarks: ['안산역', '중앙역', '화랑유원지', '시화호'], apartments: ['고잔 푸르지오', '선부 래미안', '중앙 삼성'], description: '안산시는 반월공단과 주거지역이 공존하는 도시입니다. 고잔동, 선부동, 중앙동의 아파트에서 줄눈시공 수요가 있습니다.' },
  { slug: 'anyang', name: '안양', fullName: '안양시', province: '경기도', keywords: ['안양 줄눈', '안양시 줄눈시공', '평촌 줄눈'], landmarks: ['평촌역', '안양역', '안양예술공원', '범계역'], apartments: ['평촌 래미안', '비산 자이', '안양 푸르지오'], description: '안양시는 평촌 신도시를 중심으로 한 교육도시입니다. 평촌, 비산동, 호계동의 아파트에서 줄눈시공 문의가 꾸준합니다.' },
  { slug: 'namyangju', name: '남양주', fullName: '남양주시', province: '경기도', keywords: ['남양주 줄눈', '남양주시 줄눈시공', '남양주 화장실 줄눈'], landmarks: ['다산신도시', '덕소역', '마석역', '물의정원'], apartments: ['다산 자이', '호평 래미안', '덕소 푸르지오'], description: '남양주시는 다산신도시 개발로 급성장 중인 도시입니다. 다산, 호평, 덕소 지역의 신축 및 기존 아파트에서 줄눈시공 문의가 많습니다.' },
  { slug: 'hwaseong', name: '화성', fullName: '화성시', province: '경기도', keywords: ['화성 줄눈', '화성시 줄눈시공', '동탄 줄눈'], landmarks: ['동탄역', '동탄호수공원', '융건릉', '제부도'], apartments: ['동탄 래미안', '동탄2 시범', '메타폴리스'], description: '화성시는 동탄1·2신도시를 중심으로 급성장한 도시입니다. 동탄, 향남, 봉담 지역의 아파트에서 줄눈시공 수요가 매우 높습니다.' },
  { slug: 'pyeongtaek', name: '평택', fullName: '평택시', province: '경기도', keywords: ['평택 줄눈', '평택시 줄눈시공', '평택 화장실 줄눈'], landmarks: ['평택역', '평택호', '삼성전자 평택캠퍼스', '고덕국제신도시'], apartments: ['고덕 자이', '소사벌 래미안', '비전 푸르지오'], description: '평택시는 삼성전자 캠퍼스와 고덕국제신도시로 급성장 중입니다. 고덕, 소사벌, 비전동의 아파트에서 줄눈시공 문의가 늘고 있습니다.' },
  { slug: 'siheung', name: '시흥', fullName: '시흥시', province: '경기도', keywords: ['시흥 줄눈', '시흥시 줄눈시공', '시흥 화장실 줄눈'], landmarks: ['시흥역', '오이도', '월곶역', '시화MTV'], apartments: ['배곧 자이', '은행 래미안', '정왕 푸르지오'], description: '시흥시는 배곧신도시 개발로 주목받는 도시입니다. 배곧, 정왕동, 대야동의 아파트에서 줄눈시공 문의가 늘고 있습니다.' },
  { slug: 'gimpo', name: '김포', fullName: '김포시', province: '경기도', keywords: ['김포 줄눈', '김포시 줄눈시공', '김포 화장실 줄눈'], landmarks: ['김포공항', '장기역', '걸포역', '라베니체'], apartments: ['장기 래미안', '풍무 자이', '걸포 푸르지오'], description: '김포시는 한강신도시를 중심으로 급성장한 도시입니다. 장기동, 풍무동, 구래동의 아파트에서 줄눈시공 문의가 활발합니다.' },
  { slug: 'gwangmyeong', name: '광명', fullName: '광명시', province: '경기도', keywords: ['광명 줄눈', '광명시 줄눈시공', '광명 화장실 줄눈'], landmarks: ['광명역', 'KTX광명역', 'IKEA광명', '광명동굴'], apartments: ['철산 래미안', '광명 자이', '하안 푸르지오'], description: '광명시는 KTX광명역을 중심으로 발전하는 도시입니다. 철산동, 하안동, 소하동의 아파트에서 줄눈시공 문의가 많습니다.' },
  { slug: 'gwangju-gg', name: '광주', fullName: '광주시', province: '경기도', keywords: ['광주 줄눈', '경기 광주 줄눈시공', '광주 화장실 줄눈'], landmarks: ['곤지암리조트', '남한산성', '경기광주역', '태전역'], apartments: ['경안 래미안', '역동 자이', '송정 푸르지오'], description: '경기도 광주시는 남한산성과 팔당호가 있는 자연친화적 도시입니다. 경안동, 역동, 오포의 아파트에서 줄눈시공 문의가 있습니다.' },
  { slug: 'gunpo', name: '군포', fullName: '군포시', province: '경기도', keywords: ['군포 줄눈', '군포시 줄눈시공', '군포 화장실 줄눈'], landmarks: ['산본역', '군포역', '수리산', '철쭉동산'], apartments: ['산본 래미안', '금정 자이', '군포 푸르지오'], description: '군포시는 산본신도시를 중심으로 한 주거도시입니다. 산본동, 금정동의 20년 이상 된 아파트에서 줄눈 리뉴얼 문의가 많습니다.' },
  { slug: 'hanam', name: '하남', fullName: '하남시', province: '경기도', keywords: ['하남 줄눈', '하남시 줄눈시공', '미사 줄눈'], landmarks: ['미사역', '스타필드하남', '하남유니온타워', '검단산'], apartments: ['미사강변', '풍산 래미안', '신장 자이'], description: '하남시는 미사강변도시 개발로 급성장한 도시입니다. 미사동, 풍산동, 신장동의 아파트에서 줄눈시공 문의가 매우 활발합니다.' },
  { slug: 'osan', name: '오산', fullName: '오산시', province: '경기도', keywords: ['오산 줄눈', '오산시 줄눈시공', '오산 화장실 줄눈'], landmarks: ['오산역', '오산대역', '독산성', '궐리사'], apartments: ['세마 래미안', '운암 자이', '오산 푸르지오'], description: '오산시는 수도권 남부의 소도시로 세마, 운암 지역에 아파트가 밀집해 있습니다. 줄눈시공 문의가 꾸준합니다.' },
  { slug: 'icheon', name: '이천', fullName: '이천시', province: '경기도', keywords: ['이천 줄눈', '이천시 줄눈시공', '이천 화장실 줄눈'], landmarks: ['이천역', '설봉공원', '이천도자예술마을', 'SK하이닉스'], apartments: ['중리 래미안', '증포 자이', '관고 푸르지오'], description: '이천시는 도자기와 쌀로 유명한 도시입니다. 중리동, 증포동의 아파트에서 줄눈시공 문의가 있습니다.' },
  { slug: 'anseong', name: '안성', fullName: '안성시', province: '경기도', keywords: ['안성 줄눈', '안성시 줄눈시공', '안성 화장실 줄눈'], landmarks: ['안성맞춤랜드', '안성역', '칠장사', '안성천'], apartments: ['공도 래미안', '안성 자이', '비봉 푸르지오'], description: '안성시는 경기도 남부의 전원도시입니다. 공도읍, 안성동의 아파트에서 줄눈시공 문의가 있습니다.' },
  { slug: 'uiwang', name: '의왕', fullName: '의왕시', province: '경기도', keywords: ['의왕 줄눈', '의왕시 줄눈시공', '의왕 화장실 줄눈'], landmarks: ['의왕역', '레일바이크', '청계산', '백운호수'], apartments: ['포일 래미안', '내손 자이', '청계 푸르지오'], description: '의왕시는 청계산과 백운호수가 있는 친환경 주거도시입니다. 포일동, 내손동의 아파트에서 줄눈시공 문의가 있습니다.' },
  { slug: 'guri', name: '구리', fullName: '구리시', province: '경기도', keywords: ['구리 줄눈', '구리시 줄눈시공', '구리 화장실 줄눈'], landmarks: ['구리역', '동구릉', '장자호수공원', '구리타워'], apartments: ['인창 래미안', '수택 자이', '교문 푸르지오'], description: '구리시는 서울과 인접한 수도권 동부 도시입니다. 인창동, 수택동, 교문동의 아파트에서 줄눈시공 문의가 꾸준합니다.' },
  { slug: 'uijeongbu', name: '의정부', fullName: '의정부시', province: '경기도', keywords: ['의정부 줄눈', '의정부시 줄눈시공', '의정부 화장실 줄눈'], landmarks: ['의정부역', '부용천', '회룡역', '송산사지'], apartments: ['민락 래미안', '호원 자이', '금오 푸르지오'], description: '의정부시는 경기 북부의 중심도시입니다. 민락동, 호원동, 금오동의 아파트에서 줄눈시공 문의가 있습니다.' },
  { slug: 'goyang', name: '고양', fullName: '고양시', province: '경기도', keywords: ['고양 줄눈', '고양시 줄눈시공', '일산 줄눈'], landmarks: ['킨텍스', '일산호수공원', '정발산역', '웨스턴돔'], apartments: ['일산 후곡', '풍동 아이파크', '덕양 래미안'], description: '고양시는 일산신도시를 중심으로 한 대규모 주거도시입니다. 일산동, 덕양구의 아파트에서 줄눈시공 수요가 매우 높습니다.' },
  { slug: 'paju', name: '파주', fullName: '파주시', province: '경기도', keywords: ['파주 줄눈', '파주시 줄눈시공', '파주 화장실 줄눈'], landmarks: ['운정역', '파주프리미엄아울렛', '헤이리', 'DMZ'], apartments: ['운정 래미안', '금촌 자이', '교하 푸르지오'], description: '파주시는 운정신도시를 중심으로 급성장하는 도시입니다. 운정동, 금촌동, 교하의 아파트에서 줄눈시공 문의가 많습니다.' },
  { slug: 'yangju', name: '양주', fullName: '양주시', province: '경기도', keywords: ['양주 줄눈', '양주시 줄눈시공', '양주 화장실 줄눈'], landmarks: ['양주역', '장흥관광지', '송추계곡', '도락산'], apartments: ['옥정 래미안', '덕계 자이', '회천 푸르지오'], description: '양주시는 옥정신도시 개발로 주목받는 도시입니다. 옥정동, 덕계동의 아파트에서 줄눈시공 문의가 늘고 있습니다.' },
  { slug: 'pocheon', name: '포천', fullName: '포천시', province: '경기도', keywords: ['포천 줄눈', '포천시 줄눈시공', '포천 화장실 줄눈'], landmarks: ['산정호수', '허브아일랜드', '광릉수목원', '명성산'], apartments: ['신읍 래미안', '소흘 자이', '어룡 푸르지오'], description: '포천시는 수도권 동북부의 전원도시입니다. 신읍동, 소흘읍의 아파트에서 줄눈시공 문의가 있습니다.' },
  { slug: 'gwacheon', name: '과천', fullName: '과천시', province: '경기도', keywords: ['과천 줄눈', '과천시 줄눈시공', '과천 화장실 줄눈'], landmarks: ['과천역', '서울대공원', '과천과학관', '서울경마공원'], apartments: ['과천 래미안', '별양 자이', '부림 푸르지오'], description: '과천시는 청계산과 서울대공원이 있는 친환경 주거도시입니다. 별양동, 부림동의 아파트에서 줄눈시공 문의가 있습니다.' },
  // 인천
  { slug: 'incheon', name: '인천', fullName: '인천광역시', province: '인천광역시', keywords: ['인천 줄눈', '인천 줄눈시공', '인천 화장실 줄눈'], landmarks: ['송도센트럴파크', '인천공항', '청라호수공원', '부평역'], apartments: ['송도 자이', '청라 래미안', '부평 푸르지오', '구월 롯데캐슬'], description: '인천광역시는 송도국제도시, 청라국제도시 등 신도시와 부평, 구월 등 기존 주거지역이 공존합니다. 줄눈시공 수요가 매우 다양합니다.' },
]

// 7개 서비스 페이지 정의
const servicePages = [
  { slug: 'faq', title: '줄눈시공 FAQ', priority: 0.9 },
  { slug: 'types', title: '줄눈 종류 비교', priority: 0.8 },
  { slug: 'bathroom', title: '화장실 줄눈 가이드', priority: 0.8 },
  { slug: 'price', title: '줄눈시공 가격표', priority: 0.9 },
  { slug: 'review', title: '줄눈시공 후기', priority: 0.8 },
  { slug: 'self-diy', title: '셀프 vs 업체 비교', priority: 0.7 },
  { slug: 'find', title: '줄눈업체 선택 가이드', priority: 0.7 }
]

// sitemap.xml 생성 함수
function generateSitemap(regions) {
  const today = new Date().toISOString().split('T')[0]

  const urls = [
    // 메인 페이지
    `  <url>
    <loc>${BASE_URL}/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>`,
    // 서비스 페이지들 (7개)
    ...servicePages.map(s => `  <url>
    <loc>${BASE_URL}/${s.slug}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>${s.priority}</priority>
  </url>`),
    // 지역 페이지들 (52개)
    ...regions.map(r => `  <url>
    <loc>${BASE_URL}/${r.slug}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`)
  ]

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('\n')}
</urlset>`
}

// robots.txt 생성 함수
function generateRobotsTxt() {
  return `# HousePick robots.txt
# https://housepick-web.vercel.app

User-agent: *
Allow: /

# Sitemap
Sitemap: ${BASE_URL}/sitemap.xml

# RSS Feed
# ${BASE_URL}/rss.xml

# Disallow
Disallow: /api/
Disallow: /_vercel/
Disallow: /*.json$
`
}

// RSS 피드 생성 함수
function generateRSS() {
  const today = new Date().toUTCString()

  let rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>하우스Pick - 정찰제 줄눈시공</title>
    <link>${BASE_URL}</link>
    <description>줄눈 가격, 이제 검색하지 마세요. 업계 최초 정찰제, 5년 무상보장</description>
    <language>ko</language>
    <lastBuildDate>${today}</lastBuildDate>
    <atom:link href="${BASE_URL}/rss.xml" rel="self" type="application/rss+xml"/>
    <item>
      <title>하우스Pick | 정찰제 줄눈시공</title>
      <link>${BASE_URL}/</link>
      <description>하우스Pick - 줄눈 가격, 이제 검색하지 마세요. 업계 최초 정찰제, 5년 무상보장</description>
      <pubDate>${today}</pubDate>
      <guid>${BASE_URL}/</guid>
    </item>
`

  // 7개 서비스 페이지
  servicePages.forEach(service => {
    rss += `    <item>
      <title>${service.title} | 하우스Pick</title>
      <link>${BASE_URL}/${service.slug}</link>
      <description>하우스Pick ${service.title}. 정찰제 가격, 5년 무상보장.</description>
      <pubDate>${today}</pubDate>
      <guid>${BASE_URL}/${service.slug}</guid>
    </item>
`
  })

  // 52개 지역 페이지
  regions.forEach(region => {
    const regionLabel = getRegionLabel(region)
    const title = `${regionLabel} 줄눈시공 1위, 하우스Pick`
    const description = `${region.fullName} 줄눈시공 전문업체. 정찰제 가격, 5년 무상보장.`

    rss += `    <item>
      <title>${title}</title>
      <link>${BASE_URL}/${region.slug}</link>
      <description>${description}</description>
      <pubDate>${today}</pubDate>
      <guid>${BASE_URL}/${region.slug}</guid>
    </item>
`
  })

  rss += `  </channel>
</rss>`

  return rss
}

// 템플릿 읽기
const templatePath = path.join(__dirname, '..', 'templates', 'regional.html')
const template = fs.readFileSync(templatePath, 'utf-8')

// dist 디렉토리 확인
const distPath = path.join(__dirname, '..', 'dist')
if (!fs.existsSync(distPath)) {
  console.log('dist 폴더가 없습니다. 먼저 npm run build를 실행하세요.')
  process.exit(1)
}

// dist/regional.html에서 빌드된 JS/CSS 경로 추출 (지역 페이지용 엔트리 포인트)
const regionalHtmlPath = path.join(distPath, 'regional.html')
const regionalHtml = fs.readFileSync(regionalHtmlPath, 'utf-8')

// Vite 빌드 파일 경로 추출 (해시 포함된 파일명)
// regional.html에서 regional-xxx.js와 index-xxx.css를 추출
const jsMatch = regionalHtml.match(/src="(\/assets\/regional-[^"]+\.js)"/)
const cssMatch = regionalHtml.match(/href="(\/assets\/index-[^"]+\.css)"/)

const viteJs = jsMatch ? jsMatch[1] : '/assets/regional.js'
const viteCss = cssMatch ? cssMatch[1] : '/assets/index.css'

console.log(`Vite 빌드 파일 감지: JS=${viteJs}, CSS=${viteCss}`)

// 각 지역별 HTML 생성
console.log(`${regions.length}개 지역 페이지 생성 시작...`)

regions.forEach(region => {
  // 동적 SEO 콘텐츠 생성 (시드 기반 - 항상 동일한 결과)
  const dynamicTitle = generateDynamicTitle(region)
  const dynamicDescription = generateDynamicDescription(region)
  const dynamicKeywords = generateMetaKeywords(region)

  // SSG 본문 콘텐츠 생성
  const seoContent = generateSEOContent(region)
  const hashtags = generateHashtags(region)
  const regionIntroHtml = generateRegionIntroHtml(region)
  const seoBodyHtml = generateSEOBodyHtml(region, seoContent)
  const hashtagsHtml = generateHashtagsHtml(hashtags, region.name)
  const nearbyLinksHtml = generateNearbyLinksHtml(region)
  const subAreasHtml = generateSubAreasHtml(region)
  const portfolioImagesHtml = generatePortfolioImagesHtml(region)

  // JSON-LD 스키마 생성 (동적)
  const localBusinessJsonLd = generateLocalBusinessJsonLd(region)
  const itemListJsonLd = generateItemListJsonLd(region)
  const itemListScript = itemListJsonLd
    ? `    <script type="application/ld+json">\n${JSON.stringify(itemListJsonLd, null, 2)}\n    </script>`
    : ''

  // subAreas가 있으면 Title용 텍스트 생성 (최대 3개) - 기존 호환성 유지
  const subAreasForTitle = region.subAreas?.length > 0
    ? `(${region.subAreas.slice(0, 3).join(', ')})`
    : ''

  // subAreas가 있으면 Description용 텍스트 생성 (최대 5개)
  const subAreasForDesc = region.subAreas?.length > 0
    ? ` ${region.subAreas.slice(0, 5).join(', ')} 등`
    : ''

  // 지역 레이블 생성 (OG 이미지와 동일한 형식: "서울 강남구", "경기 수원시")
  const regionLabel = getRegionLabel(region)

  const html = template
    .replace(/\{\{REGION_SLUG\}\}/g, region.slug)
    .replace(/\{\{REGION_NAME\}\}/g, region.name)
    .replace(/\{\{REGION_FULL_NAME\}\}/g, region.fullName)
    .replace(/\{\{REGION_PROVINCE\}\}/g, region.province)
    .replace(/\{\{REGION_LABEL\}\}/g, regionLabel)
    .replace(/\{\{REGION_KEYWORDS\}\}/g, dynamicKeywords)
    .replace(/\{\{REGION_SUB_AREAS\}\}/g, subAreasForTitle)
    .replace(/\{\{REGION_SUB_AREAS_DESC\}\}/g, subAreasForDesc)
    .replace(/\{\{DYNAMIC_TITLE\}\}/g, dynamicTitle)
    .replace(/\{\{DYNAMIC_DESCRIPTION\}\}/g, dynamicDescription)
    .replace(/\{\{VITE_JS\}\}/g, viteJs)
    .replace(/\{\{VITE_CSS\}\}/g, viteCss)
    // SSG 본문 콘텐츠 주입
    .replace('{{REGION_INTRO}}', regionIntroHtml)
    .replace('{{SEO_BODY}}', seoBodyHtml)
    .replace('{{HASHTAGS}}', hashtagsHtml)
    .replace('{{NEARBY_LINKS}}', nearbyLinksHtml)
    .replace('{{SUB_AREAS}}', subAreasHtml)
    .replace('{{PORTFOLIO_IMAGES}}', portfolioImagesHtml)
    // JSON-LD 스키마 주입
    .replace('{{JSON_LD_LOCAL_BUSINESS}}', JSON.stringify(localBusinessJsonLd, null, 2))
    .replace('{{JSON_LD_ITEMLIST}}', itemListScript)

  const regionDir = path.join(distPath, region.slug)
  if (!fs.existsSync(regionDir)) {
    fs.mkdirSync(regionDir, { recursive: true })
  }

  fs.writeFileSync(path.join(regionDir, 'index.html'), html)
  console.log(`  ✓ /${region.slug}/index.html 생성`)
})

// sitemap.xml 생성
const sitemapContent = generateSitemap(regions)
fs.writeFileSync(path.join(distPath, 'sitemap.xml'), sitemapContent)
console.log(`\n  ✓ /sitemap.xml 생성 (${regions.length + 1}개 URL)`)

// robots.txt 생성
const robotsContent = generateRobotsTxt()
fs.writeFileSync(path.join(distPath, 'robots.txt'), robotsContent)
console.log(`  ✓ /robots.txt 생성`)

// RSS 피드 생성
const rssContent = generateRSS()
fs.writeFileSync(path.join(distPath, 'rss.xml'), rssContent)
console.log(`  ✓ /rss.xml 생성 (${regions.length + 1}개 항목)`)

console.log(`\n완료! ${regions.length}개 지역 페이지 + sitemap.xml + robots.txt + rss.xml 생성되었습니다.`)
