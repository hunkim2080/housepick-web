import React from 'react'
import { createRoot } from 'react-dom/client'
import ServicePage from './pages/ServicePage'
import { getServiceBySlug } from './data/services'
import './index.css'

// HTML의 data-page 속성에서 서비스 페이지 slug 가져오기
const rootElement = document.getElementById('root')
const pageSlug = rootElement?.dataset?.page

// 서비스 페이지 데이터 가져오기
const service = getServiceBySlug(pageSlug)

if (service) {
  const app = (
    <React.StrictMode>
      <ServicePage service={service} />
    </React.StrictMode>
  )

  // SSG HTML과 React HTML 구조가 다르므로 항상 createRoot 사용
  // (hydrateRoot는 동일 구조 필요 → 불일치 시 에러 발생)
  rootElement.classList.add('js-loaded')
  createRoot(rootElement).render(app)
} else {
  console.error(`서비스 페이지를 찾을 수 없습니다: ${pageSlug}`)
}
