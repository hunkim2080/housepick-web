/**
 * schema-generators.js
 * SEO 리치 스니펫을 위한 JSON-LD 스키마 생성 유틸리티
 *
 * Task 1: FAQPage + SiteNavigationElement (지역 페이지)
 * Task 2: ImageObject 캐러셀 (구 허브 페이지)
 * Task 3: HowTo + Dataset (가이드/통계 페이지)
 */

const BASE_URL = 'https://housepick-web.vercel.app'

// ─── Task 1: 지역 + 가격 검색용 FAQPage 스키마 ──────────────────────────

/**
 * 지역별 가격/서비스 FAQ 스키마 생성
 * 검색 결과에서 FAQ 리치 스니펫으로 노출되어 SERP 면적 확대
 * @param {string} regionFullName - 지역 전체명 (예: "강남구")
 * @param {string} regionSlug - 지역 슬러그
 * @returns {object} FAQPage JSON-LD
 */
export function generateRegionalFAQSchema(regionFullName, regionSlug) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": `${regionFullName} 줄눈시공 비용은 얼마인가요?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `${regionFullName} 줄눈시공은 화장실 바닥 30만원, 화장실 전체 90만원, 거실 150만원입니다. 하우스픽은 업계 최초 정찰제로 운영하며, 추가 비용 없이 견적 그대로 시공합니다. 무료 현장 방문 견적 후 정확한 금액을 안내드립니다.`
        }
      },
      {
        "@type": "Question",
        "name": `${regionFullName} 줄눈시공 A/S 기간은 얼마나 되나요?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "하우스픽은 시공 후 5년 무상 A/S를 보장합니다. 이탈리아 마페이 정품 케라폭시를 사용하여 시공하며, A/S 기간 내 줄눈 변색·탈락·크랙 발생 시 무상으로 재시공해 드립니다. 업계 평균 1년 대비 5배 긴 보장 기간입니다."
        }
      },
      {
        "@type": "Question",
        "name": "정찰제란 무엇인가요? 추가 비용이 있나요?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "정찰제는 견적 금액 그대로 시공하는 방식입니다. 현장 방문 후 추가 비용을 요구하는 업체와 달리, 하우스픽은 홈페이지에 공개된 가격 그대로 시공합니다. 출장비, 자재비, 인건비가 모두 포함된 가격이며, 시공 당일 추가 비용은 일체 없습니다."
        }
      },
      {
        "@type": "Question",
        "name": `${regionFullName}에서 줄눈시공 당일 완료가 가능한가요?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `네, ${regionFullName} 지역은 당일 시공이 가능합니다. 화장실 1개 기준 약 2~3시간이면 완료됩니다. 하우스픽은 전문 교육을 이수한 시공 기사가 직접 방문하며, 오전 시공 시 저녁부터 사용 가능합니다. 010-6461-0131로 원하시는 날짜를 예약하세요.`
        }
      }
    ]
  }
}

// ─── Task 1: 사이트 내비게이션 (칩 버튼 유도) ───────────────────────────

/**
 * Sitelinks 칩 버튼 유도를 위한 SiteNavigationElement 스키마
 * 구글 검색 결과에서 주요 페이지를 칩 형태로 노출
 * @returns {object} ItemList JSON-LD
 */
export function generateSiteNavigationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "하우스픽 주요 서비스",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "부위별 줄눈 가격 바로가기",
        "url": `${BASE_URL}/price`
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "케라폭시 줄눈이 뭔가요?",
        "url": `${BASE_URL}/kerapoxy-guide`
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": "줄눈시공의 장점과 단점",
        "url": `${BASE_URL}/types`
      },
      {
        "@type": "ListItem",
        "position": 4,
        "name": "시공 후 1년 뒤, 후기보기",
        "url": `${BASE_URL}/review`
      }
    ]
  }
}

// ─── Task 2: 구 허브 이미지 캐러셀 스키마 ────────────────────────────────

/**
 * 구별 허브 페이지용 이미지 캐러셀 스키마 생성
 * 세대수 상위 아파트의 시공 사진을 캐러셀로 노출
 * @param {string} districtName - 구 이름 (예: "강남구")
 * @param {Array} topApts - 세대수 상위 아파트 배열
 * @param {string} regionSlug - 지역 슬러그
 * @param {string} districtSlug - 구 슬러그
 * @returns {object} ItemList + ImageObject JSON-LD
 */
export function generateImageCarouselSchema(districtName, topApts, regionSlug, districtSlug) {
  const items = topApts.slice(0, 10).map((apt, index) => {
    const aptUrl = `${BASE_URL}/${regionSlug}/${districtSlug}/${apt.slug}`
    const yearLabel = apt.year ? `${apt.year}년 준공` : ''
    const householdsLabel = apt.households ? `${apt.households.toLocaleString()}세대` : ''
    const caption = `${districtName} ${apt.name} 케라폭시 줄눈시공 (${[householdsLabel, yearLabel].filter(Boolean).join(', ')})`

    return {
      "@type": "ListItem",
      "position": index + 1,
      "item": {
        "@type": "ImageObject",
        "@id": aptUrl,
        "name": `${apt.name} 줄눈시공 시공 사례`,
        "caption": caption,
        "contentUrl": `${BASE_URL}/images/projects/${regionSlug}/${regionSlug}-${String(index + 1).padStart(3, '0')}-after.webp`,
        "thumbnailUrl": `${BASE_URL}/images/projects/${regionSlug}/${regionSlug}-${String(index + 1).padStart(3, '0')}-before.webp`,
        "description": `${districtName} ${apt.name} 아파트 케라폭시 줄눈시공 Before/After. ${householdsLabel} 규모.`,
        "representativeOfPage": false,
        "width": 1200,
        "height": 800,
        "associatedArticle": {
          "@type": "WebPage",
          "url": aptUrl
        }
      }
    }
  })

  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": `${districtName} 아파트 줄눈시공 사례`,
    "description": `${districtName} 거래량 상위 아파트 줄눈시공 Before/After 사진 모음. 하우스픽 케라폭시 전문 시공.`,
    "numberOfItems": items.length,
    "itemListOrder": "https://schema.org/ItemListOrderDescending",
    "itemListElement": items
  }
}

// ─── Task 2: 구 허브 FAQ 스키마 ──────────────────────────────────────────

/**
 * 구 허브 페이지 전용 FAQ (지역 특화 질문)
 * @param {string} districtName - 구 이름
 * @param {number} aptCount - 아파트 수
 * @param {number} totalHouseholds - 총 세대수
 * @param {number} avgYear - 평균 준공연도
 * @returns {object} FAQPage JSON-LD
 */
export function generateHubFAQSchema(districtName, aptCount, totalHouseholds, avgYear) {
  const currentYear = new Date().getFullYear()
  const avgAge = currentYear - avgYear

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": `${districtName} 아파트 줄눈시공 평균 비용은?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `${districtName}에는 ${aptCount}개 아파트, 총 ${totalHouseholds.toLocaleString()}세대가 있습니다. 하우스픽은 정찰제로 화장실 바닥 30만원, 전체 90만원에 시공합니다. 평균 준공연도 ${avgYear}년(약 ${avgAge}년 경과)인 ${districtName} 아파트는 ${avgAge >= 15 ? '줄눈 재시공이 시급한' : avgAge >= 7 ? '줄눈 점검이 필요한' : '입주 전 줄눈시공이 인기인'} 시기입니다.`
        }
      },
      {
        "@type": "Question",
        "name": `${districtName}에서 케라폭시 시공이 가능한가요?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `네, ${districtName} 전 지역에서 케라폭시 시공이 가능합니다. 이탈리아 마페이 정품 케라폭시를 사용하며, 5년 무상 A/S를 보장합니다. 전문 교육을 이수한 시공 기사가 직접 방문하여 당일 시공을 완료합니다.`
        }
      },
      {
        "@type": "Question",
        "name": `${districtName} 줄눈시공 예약은 어떻게 하나요?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `010-6461-0131로 전화 또는 카카오톡으로 상담 신청하시면 됩니다. 무료 현장 방문 견적 후, 원하시는 날짜에 시공을 예약할 수 있습니다. 평일·주말 모두 시공 가능합니다.`
        }
      }
    ]
  }
}

// ─── Task 3: HowTo 스키마 (케라폭시 가이드용) ────────────────────────────

/**
 * 하우스픽 3단계 공정 HowTo 스키마
 * 구글 검색 결과에 단계별 가이드로 노출
 * @returns {object} HowTo JSON-LD
 */
export function generateHowToSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": "케라폭시 줄눈시공 3단계 공정",
    "description": "하우스픽의 전문 케라폭시 줄눈시공 3단계 프로세스. 기존 줄눈 제거부터 마스킹, 케라폭시 충진까지 전 과정을 안내합니다.",
    "totalTime": "PT3H",
    "estimatedCost": {
      "@type": "MonetaryAmount",
      "currency": "KRW",
      "value": "300000"
    },
    "supply": [
      {
        "@type": "HowToSupply",
        "name": "마페이 케라폭시 (이탈리아 정품)"
      },
      {
        "@type": "HowToSupply",
        "name": "전용 마스킹 테이프"
      },
      {
        "@type": "HowToSupply",
        "name": "줄눈 제거 전동 공구"
      }
    ],
    "tool": [
      {
        "@type": "HowToTool",
        "name": "전동 줄눈 제거기"
      },
      {
        "@type": "HowToTool",
        "name": "고무 헤라 (충진용)"
      },
      {
        "@type": "HowToTool",
        "name": "스펀지 (마감용)"
      }
    ],
    "step": [
      {
        "@type": "HowToStep",
        "position": 1,
        "name": "1단계: 기존 줄눈 완전 제거",
        "text": "전동 공구를 사용하여 기존 시멘트 줄눈을 2mm 이상 깊이로 완전 제거합니다. 곰팡이가 침투한 줄눈은 뿌리까지 제거해야 재발을 방지할 수 있습니다. 이 과정에서 타일 손상 없이 정밀하게 작업하는 것이 핵심입니다.",
        "url": `${BASE_URL}/kerapoxy-guide#step-1`,
        "image": `${BASE_URL}/images/projects/process-step1-removal.webp`
      },
      {
        "@type": "HowToStep",
        "position": 2,
        "name": "2단계: 정밀 마스킹",
        "text": "타일 가장자리를 전용 마스킹 테이프로 보호합니다. 케라폭시는 경화 후 제거가 어려우므로, 타일 면에 묻지 않도록 정밀 마스킹이 필수입니다. 하우스픽은 이중 마스킹 기법으로 깔끔한 마감을 보장합니다.",
        "url": `${BASE_URL}/kerapoxy-guide#step-2`,
        "image": `${BASE_URL}/images/projects/process-step2-masking.webp`
      },
      {
        "@type": "HowToStep",
        "position": 3,
        "name": "3단계: 케라폭시 충진 및 마감",
        "text": "마페이 정품 케라폭시 A제(에폭시 수지)와 B제(경화제)를 2:1 비율로 정확히 혼합한 뒤, 고무 헤라로 줄눈에 빈틈없이 충진합니다. 가사시간 30분 이내에 마감하며, 24시간 초기 경화 후 72시간 완전 경화됩니다. 수축률 0%로 크랙 없는 완벽한 마감을 실현합니다.",
        "url": `${BASE_URL}/kerapoxy-guide#step-3`,
        "image": `${BASE_URL}/images/projects/process-step3-filling.webp`
      }
    ]
  }
}

// ─── Task 3: 강화된 Dataset 스키마 (통계 페이지용) ────────────────────────

/**
 * 수도권 아파트 거래량 및 시공 수요 Dataset 스키마
 * 구글 지식 그래프 노출을 유도하는 확장된 데이터셋 정의
 * @param {object} stats - stats-summary.json 데이터
 * @returns {object} Dataset JSON-LD
 */
export function generateEnhancedDatasetSchema(stats) {
  const now = new Date()
  const modifiedDate = now.toISOString().split('T')[0]
  const currentYear = now.getFullYear()

  return {
    "@context": "https://schema.org",
    "@type": "Dataset",
    "name": `${currentYear}년 수도권 지역별 아파트 줄눈 재시공 권장 데이터`,
    "alternateName": "Metropolitan Grout Renovation Index",
    "description": `수도권 ${stats.summary.totalCount.toLocaleString()}개 아파트 단지, 총 ${stats.summary.totalHouseholds.toLocaleString()}세대 대상 줄눈 재시공 권장 분석. 구별 순위, 브랜드별 현황, 준공연도별 분포 데이터 포함. 국토교통부 공공데이터 기반 분석.`,
    "url": `${BASE_URL}/stats/metropolitan-grout-index`,
    "identifier": `housepick-grout-index-${currentYear}`,
    "keywords": [
      "아파트 줄눈 시공", "줄눈 재시공", "수도권 아파트 통계",
      "아파트 준공연도", "줄눈 교체 주기", "케라폭시 시공 수요",
      "욕실 타일 줄눈", "아파트 거래량", "시공 수요 통계"
    ],
    "creator": {
      "@type": "Organization",
      "name": "하우스Pick",
      "url": BASE_URL,
      "logo": `${BASE_URL}/favicon.svg`
    },
    "publisher": {
      "@type": "Organization",
      "name": "하우스Pick",
      "url": BASE_URL
    },
    "datePublished": "2026-03-01",
    "dateModified": modifiedDate,
    "license": "https://creativecommons.org/licenses/by-nc-sa/4.0/",
    "isAccessibleForFree": true,
    "temporalCoverage": `1990/${currentYear}`,
    "spatialCoverage": {
      "@type": "Place",
      "name": "수도권 (서울특별시, 경기도, 인천광역시)",
      "geo": {
        "@type": "GeoShape",
        "box": "36.9 126.5 37.8 127.5"
      }
    },
    "variableMeasured": [
      {
        "@type": "PropertyValue",
        "name": "분석 단지 수",
        "value": stats.summary.totalCount,
        "unitText": "개"
      },
      {
        "@type": "PropertyValue",
        "name": "재시공 권장 단지",
        "value": stats.summary.needsRenovation,
        "unitText": "개"
      },
      {
        "@type": "PropertyValue",
        "name": "재시공 권장 지수",
        "value": stats.summary.renovationRate,
        "unitText": "%"
      },
      {
        "@type": "PropertyValue",
        "name": "총 세대수",
        "value": stats.summary.totalHouseholds,
        "unitText": "세대"
      },
      {
        "@type": "PropertyValue",
        "name": "구별 재시공 권장 순위",
        "value": `상위 ${Math.min(20, stats.districtRanking?.length || 0)}개 구 데이터`,
        "unitText": "ranking"
      }
    ],
    "distribution": {
      "@type": "DataDownload",
      "encodingFormat": "text/html",
      "contentUrl": `${BASE_URL}/stats/metropolitan-grout-index`
    },
    "measurementTechnique": "준공연도 기준 7년 이상 경과 단지를 재시공 권장으로 분류. 국토교통부 공공데이터 기반."
  }
}
