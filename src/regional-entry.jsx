import React from 'react'
import { hydrateRoot, createRoot } from 'react-dom/client'
import RegionalPage from './pages/RegionalPage'
import { getRegionBySlug } from './data/regions'
import './index.css'

// HTML의 data-region 속성에서 지역 slug 가져오기
const rootElement = document.getElementById('root')
const regionSlug = rootElement?.dataset?.region

// 지역 데이터 가져오기
const region = getRegionBySlug(regionSlug)

if (region) {
  // 프리렌더링된 콘텐츠가 있는지 확인 (자식 요소 존재 여부)
  const hasPrerenderedContent = rootElement.children.length > 0

  const app = (
    <React.StrictMode>
      <RegionalPage region={region} />
    </React.StrictMode>
  )

  if (hasPrerenderedContent) {
    // 프리렌더링된 콘텐츠가 있으면 hydrate (기존 DOM 재활용)
    hydrateRoot(rootElement, app)
  } else {
    // 프리렌더링된 콘텐츠가 없으면 일반 render
    createRoot(rootElement).render(app)
  }
} else {
  console.error(`지역을 찾을 수 없습니다: ${regionSlug}`)
}
