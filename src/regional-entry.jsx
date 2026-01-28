import React from 'react'
import ReactDOM from 'react-dom/client'
import RegionalPage from './pages/RegionalPage'
import { getRegionBySlug } from './data/regions'
import './index.css'

// HTML의 data-region 속성에서 지역 slug 가져오기
const rootElement = document.getElementById('root')
const regionSlug = rootElement?.dataset?.region

// 지역 데이터 가져오기
const region = getRegionBySlug(regionSlug)

if (region) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <RegionalPage region={region} />
    </React.StrictMode>
  )
} else {
  console.error(`지역을 찾을 수 없습니다: ${regionSlug}`)
}
