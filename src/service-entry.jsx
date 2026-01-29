import React from 'react'
import { hydrateRoot, createRoot } from 'react-dom/client'
import ServicePage from './pages/ServicePage'
import { getServiceBySlug } from './data/services'
import './index.css'

// HTML의 data-page 속성에서 서비스 페이지 slug 가져오기
const rootElement = document.getElementById('root')
const pageSlug = rootElement?.dataset?.page

// 서비스 페이지 데이터 가져오기
const service = getServiceBySlug(pageSlug)

if (service) {
  // 프리렌더링된 콘텐츠가 있는지 확인 (자식 요소 존재 여부)
  const hasPrerenderedContent = rootElement.children.length > 0

  const app = (
    <React.StrictMode>
      <ServicePage service={service} />
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
  console.error(`서비스 페이지를 찾을 수 없습니다: ${pageSlug}`)
}
