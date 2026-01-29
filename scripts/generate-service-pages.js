import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import {
  servicePages,
  faqData,
  reviewsData,
  generateFAQSchema,
  generateArticleSchema,
  generateHowToSchema,
  generateProductSchema,
  generateReviewSchema,
  generateSchema,
  generateBreadcrumbSchema
} from '../src/data/services.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const BASE_URL = 'https://housepick-web.vercel.app'

// 서비스 페이지별 SSG 콘텐츠 생성
function generateSSGContent(service) {
  switch (service.slug) {
    case 'faq':
      return generateFAQSSGContent()
    case 'types':
      return generateTypesSSGContent()
    case 'bathroom':
      return generateBathroomSSGContent()
    case 'price':
      return generatePriceSSGContent()
    case 'review':
      return generateReviewSSGContent()
    case 'self-diy':
      return generateSelfDiySSGContent()
    case 'find':
      return generateFindSSGContent()
    default:
      return '<p>콘텐츠가 준비 중입니다.</p>'
  }
}

// FAQ 페이지 SSG 콘텐츠
function generateFAQSSGContent() {
  const faqHtml = faqData.map((item, idx) => `
        <div class="prerender-faq-item">
          <div class="prerender-faq-question">Q${idx + 1}. ${item.question}</div>
          <div class="prerender-faq-answer">${item.answer}</div>
        </div>`).join('')

  return `
        <div class="faq-list">
          ${faqHtml}
        </div>
        <div style="margin-top: 2rem; padding: 1.5rem; background: #fef3c7; border-radius: 1rem; text-align: center;">
          <p style="font-weight: 700; color: #92400e; margin-bottom: 0.5rem;">더 궁금한 점이 있으신가요?</p>
          <p style="color: #78716c; font-size: 0.875rem;">010-6461-0131 또는 채널톡으로 문의해주세요!</p>
        </div>`
}

// Types 페이지 SSG 콘텐츠
function generateTypesSSGContent() {
  return `
        <div style="margin-bottom: 2rem;">
          <h2 style="font-size: 1.5rem; font-weight: 700; color: #1c1917; margin-bottom: 1rem;">줄눈 종류 한눈에 비교</h2>
          <div style="overflow-x: auto;">
            <table style="width: 100%; border-collapse: collapse; font-size: 0.875rem;">
              <thead>
                <tr style="background: #fef3c7;">
                  <th style="padding: 0.75rem; text-align: left; border-bottom: 2px solid #f59e0b;">종류</th>
                  <th style="padding: 0.75rem; text-align: center; border-bottom: 2px solid #f59e0b;">가격대</th>
                  <th style="padding: 0.75rem; text-align: center; border-bottom: 2px solid #f59e0b;">내구성</th>
                  <th style="padding: 0.75rem; text-align: left; border-bottom: 2px solid #f59e0b;">추천 공간</th>
                </tr>
              </thead>
              <tbody>
                <tr style="border-bottom: 1px solid #e7e5e4;">
                  <td style="padding: 0.75rem; font-weight: 600;">케라폭시</td>
                  <td style="padding: 0.75rem; text-align: center;">★★★★★</td>
                  <td style="padding: 0.75rem; text-align: center;">10년+</td>
                  <td style="padding: 0.75rem;">화장실, 거실</td>
                </tr>
                <tr style="border-bottom: 1px solid #e7e5e4;">
                  <td style="padding: 0.75rem; font-weight: 600;">폴리우레아</td>
                  <td style="padding: 0.75rem; text-align: center;">★★★☆☆</td>
                  <td style="padding: 0.75rem; text-align: center;">5년+</td>
                  <td style="padding: 0.75rem;">현관, 베란다</td>
                </tr>
                <tr style="border-bottom: 1px solid #e7e5e4;">
                  <td style="padding: 0.75rem; font-weight: 600;">아덱스</td>
                  <td style="padding: 0.75rem; text-align: center;">★★★★☆</td>
                  <td style="padding: 0.75rem; text-align: center;">5년+</td>
                  <td style="padding: 0.75rem;">화장실</td>
                </tr>
                <tr style="border-bottom: 1px solid #e7e5e4;">
                  <td style="padding: 0.75rem; font-weight: 600;">빅라이언</td>
                  <td style="padding: 0.75rem; text-align: center;">★★★☆☆</td>
                  <td style="padding: 0.75rem; text-align: center;">5년+</td>
                  <td style="padding: 0.75rem;">화장실, 현관</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div style="background: #f5f5f4; padding: 1.5rem; border-radius: 1rem;">
          <h3 style="font-weight: 700; color: #1c1917; margin-bottom: 0.5rem;">하우스Pick 추천</h3>
          <p style="color: #57534e;">화장실은 <strong style="color: #f59e0b;">케라폭시</strong>, 현관/베란다는 <strong style="color: #f59e0b;">폴리우레아</strong>가 가장 가성비 좋습니다!</p>
        </div>`
}

// Bathroom 페이지 SSG 콘텐츠
function generateBathroomSSGContent() {
  return `
        <div style="margin-bottom: 2rem;">
          <h2 style="font-size: 1.5rem; font-weight: 700; color: #1c1917; margin-bottom: 1rem;">화장실 줄눈시공 가격</h2>
          <div style="overflow-x: auto;">
            <table style="width: 100%; border-collapse: collapse; font-size: 0.875rem;">
              <thead>
                <tr style="background: #fef3c7;">
                  <th style="padding: 0.75rem; text-align: left; border-bottom: 2px solid #f59e0b;">시공 범위</th>
                  <th style="padding: 0.75rem; text-align: center; border-bottom: 2px solid #f59e0b;">신축</th>
                  <th style="padding: 0.75rem; text-align: center; border-bottom: 2px solid #f59e0b;">구축</th>
                </tr>
              </thead>
              <tbody>
                <tr style="border-bottom: 1px solid #e7e5e4;">
                  <td style="padding: 0.75rem;">바닥만</td>
                  <td style="padding: 0.75rem; text-align: center; font-weight: 600; color: #f59e0b;">30만원</td>
                  <td style="padding: 0.75rem; text-align: center; font-weight: 600; color: #f59e0b;">35만원</td>
                </tr>
                <tr style="border-bottom: 1px solid #e7e5e4;">
                  <td style="padding: 0.75rem;">전체 (바닥+벽)</td>
                  <td style="padding: 0.75rem; text-align: center; font-weight: 600; color: #f59e0b;">90만원</td>
                  <td style="padding: 0.75rem; text-align: center; font-weight: 600; color: #f59e0b;">100만원</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div style="margin-bottom: 2rem;">
          <h2 style="font-size: 1.5rem; font-weight: 700; color: #1c1917; margin-bottom: 1rem;">시공 과정</h2>
          <ol style="list-style: none; padding: 0;">
            <li style="display: flex; align-items: flex-start; gap: 1rem; margin-bottom: 1rem; padding: 1rem; background: white; border-radius: 0.5rem; border: 1px solid #e7e5e4;">
              <span style="background: #f59e0b; color: white; width: 2rem; height: 2rem; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700; flex-shrink: 0;">1</span>
              <div><strong>현장 확인</strong> - 타일 상태와 기존 줄눈 상태 확인</div>
            </li>
            <li style="display: flex; align-items: flex-start; gap: 1rem; margin-bottom: 1rem; padding: 1rem; background: white; border-radius: 0.5rem; border: 1px solid #e7e5e4;">
              <span style="background: #f59e0b; color: white; width: 2rem; height: 2rem; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700; flex-shrink: 0;">2</span>
              <div><strong>기존 줄눈 제거</strong> - 전용 기계로 완벽하게 제거</div>
            </li>
            <li style="display: flex; align-items: flex-start; gap: 1rem; margin-bottom: 1rem; padding: 1rem; background: white; border-radius: 0.5rem; border: 1px solid #e7e5e4;">
              <span style="background: #f59e0b; color: white; width: 2rem; height: 2rem; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700; flex-shrink: 0;">3</span>
              <div><strong>청소 및 건조</strong> - 먼지, 이물질 제거 후 완전 건조</div>
            </li>
            <li style="display: flex; align-items: flex-start; gap: 1rem; margin-bottom: 1rem; padding: 1rem; background: white; border-radius: 0.5rem; border: 1px solid #e7e5e4;">
              <span style="background: #f59e0b; color: white; width: 2rem; height: 2rem; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700; flex-shrink: 0;">4</span>
              <div><strong>케라폭시 시공</strong> - 에폭시 줄눈재 정확한 배합 후 시공</div>
            </li>
            <li style="display: flex; align-items: flex-start; gap: 1rem; padding: 1rem; background: white; border-radius: 0.5rem; border: 1px solid #e7e5e4;">
              <span style="background: #f59e0b; color: white; width: 2rem; height: 2rem; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700; flex-shrink: 0;">5</span>
              <div><strong>마무리 및 경화</strong> - 24시간 경화 후 사용 가능</div>
            </li>
          </ol>
        </div>`
}

// Price 페이지 SSG 콘텐츠
function generatePriceSSGContent() {
  return `
        <div style="margin-bottom: 2rem;">
          <h2 style="font-size: 1.5rem; font-weight: 700; color: #1c1917; margin-bottom: 1rem;">2025년 정찰제 가격표</h2>
          <div style="overflow-x: auto;">
            <table style="width: 100%; border-collapse: collapse; font-size: 0.875rem;">
              <thead>
                <tr style="background: #fef3c7;">
                  <th style="padding: 0.75rem; text-align: left; border-bottom: 2px solid #f59e0b;">공간</th>
                  <th style="padding: 0.75rem; text-align: left; border-bottom: 2px solid #f59e0b;">범위</th>
                  <th style="padding: 0.75rem; text-align: center; border-bottom: 2px solid #f59e0b;">신축</th>
                  <th style="padding: 0.75rem; text-align: center; border-bottom: 2px solid #f59e0b;">구축</th>
                  <th style="padding: 0.75rem; text-align: left; border-bottom: 2px solid #f59e0b;">자재</th>
                </tr>
              </thead>
              <tbody>
                <tr style="border-bottom: 1px solid #e7e5e4;">
                  <td style="padding: 0.75rem; font-weight: 600;">화장실</td>
                  <td style="padding: 0.75rem;">바닥</td>
                  <td style="padding: 0.75rem; text-align: center; color: #f59e0b; font-weight: 600;">30만원</td>
                  <td style="padding: 0.75rem; text-align: center; color: #f59e0b; font-weight: 600;">35만원</td>
                  <td style="padding: 0.75rem;">케라폭시</td>
                </tr>
                <tr style="border-bottom: 1px solid #e7e5e4;">
                  <td style="padding: 0.75rem;"></td>
                  <td style="padding: 0.75rem;">전체</td>
                  <td style="padding: 0.75rem; text-align: center; color: #f59e0b; font-weight: 600;">90만원</td>
                  <td style="padding: 0.75rem; text-align: center; color: #f59e0b; font-weight: 600;">100만원</td>
                  <td style="padding: 0.75rem;">케라폭시</td>
                </tr>
                <tr style="border-bottom: 1px solid #e7e5e4;">
                  <td style="padding: 0.75rem; font-weight: 600;">거실</td>
                  <td style="padding: 0.75rem;">바닥</td>
                  <td style="padding: 0.75rem; text-align: center; color: #f59e0b; font-weight: 600;">150만원</td>
                  <td style="padding: 0.75rem; text-align: center; color: #f59e0b; font-weight: 600;">150만원</td>
                  <td style="padding: 0.75rem;">케라폭시</td>
                </tr>
                <tr style="border-bottom: 1px solid #e7e5e4;">
                  <td style="padding: 0.75rem; font-weight: 600;">현관</td>
                  <td style="padding: 0.75rem;">바닥</td>
                  <td style="padding: 0.75rem; text-align: center; color: #f59e0b; font-weight: 600;">5만원</td>
                  <td style="padding: 0.75rem; text-align: center; color: #f59e0b; font-weight: 600;">10만원</td>
                  <td style="padding: 0.75rem;">폴리우레아</td>
                </tr>
                <tr style="border-bottom: 1px solid #e7e5e4;">
                  <td style="padding: 0.75rem; font-weight: 600;">베란다</td>
                  <td style="padding: 0.75rem;">바닥</td>
                  <td style="padding: 0.75rem; text-align: center; color: #f59e0b; font-weight: 600;">15만원</td>
                  <td style="padding: 0.75rem; text-align: center; color: #f59e0b; font-weight: 600;">15만원</td>
                  <td style="padding: 0.75rem;">폴리우레아</td>
                </tr>
                <tr>
                  <td style="padding: 0.75rem; font-weight: 600;">세탁실</td>
                  <td style="padding: 0.75rem;">바닥</td>
                  <td style="padding: 0.75rem; text-align: center; color: #f59e0b; font-weight: 600;">15만원</td>
                  <td style="padding: 0.75rem; text-align: center; color: #f59e0b; font-weight: 600;">15만원</td>
                  <td style="padding: 0.75rem;">폴리우레아</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div style="background: #dcfce7; padding: 1.5rem; border-radius: 1rem; border: 1px solid #86efac;">
          <h3 style="font-weight: 700; color: #166534; margin-bottom: 0.5rem;">✅ 가격에 포함된 것</h3>
          <ul style="color: #15803d; margin: 0; padding-left: 1.25rem;">
            <li>자재비 (케라폭시/폴리우레아)</li>
            <li>시공 인건비</li>
            <li>기존 줄눈 제거</li>
            <li>실리콘 마감</li>
            <li><strong>5년 무상 A/S</strong></li>
          </ul>
        </div>
        <div style="background: #fee2e2; padding: 1.5rem; border-radius: 1rem; border: 1px solid #fca5a5; margin-top: 1rem;">
          <h3 style="font-weight: 700; color: #991b1b; margin-bottom: 0.5rem;">❌ 추가 비용?</h3>
          <p style="color: #b91c1c; margin: 0;"><strong>없습니다.</strong> 정찰제라서 현장에서 추가 비용 요구하지 않습니다.</p>
        </div>`
}

// Review 페이지 SSG 콘텐츠
function generateReviewSSGContent() {
  const reviewsHtml = reviewsData.map(review => `
        <div style="background: white; border: 1px solid #e7e5e4; border-radius: 1rem; padding: 1.5rem; margin-bottom: 1rem;">
          <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.75rem;">
            <span style="color: #f59e0b;">${'★'.repeat(review.rating)}</span>
            <span style="color: #a8a29e; font-size: 0.875rem;">${review.date}</span>
          </div>
          <p style="color: #44403c; margin-bottom: 1rem; line-height: 1.6;">"${review.text}"</p>
          <div style="display: flex; flex-wrap: wrap; gap: 0.5rem; font-size: 0.75rem; margin-bottom: 0.75rem;">
            <span style="background: #f5f5f4; color: #57534e; padding: 0.25rem 0.75rem; border-radius: 9999px;">${review.location}</span>
            <span style="background: #fef3c7; color: #92400e; padding: 0.25rem 0.75rem; border-radius: 9999px;">${review.space}</span>
            <span style="background: #dcfce7; color: #166534; padding: 0.25rem 0.75rem; border-radius: 9999px;">${review.cost}</span>
          </div>
          <p style="color: #78716c; font-size: 0.875rem; margin: 0;">- ${review.author}</p>
        </div>`).join('')

  return `
        <div style="background: #fef3c7; border: 1px solid #fcd34d; border-radius: 1rem; padding: 2rem; text-align: center; margin-bottom: 2rem;">
          <div style="font-size: 3rem; font-weight: 900; color: #f59e0b; margin-bottom: 0.5rem;">4.9</div>
          <div style="color: #f59e0b; font-size: 1.25rem; margin-bottom: 0.5rem;">★★★★★</div>
          <p style="color: #57534e; margin: 0;">총 127건의 리뷰</p>
        </div>
        <h2 style="font-size: 1.5rem; font-weight: 700; color: #1c1917; margin-bottom: 1rem;">고객 후기</h2>
        ${reviewsHtml}`
}

// Self-DIY 페이지 SSG 콘텐츠
function generateSelfDiySSGContent() {
  return `
        <div style="margin-bottom: 2rem;">
          <h2 style="font-size: 1.5rem; font-weight: 700; color: #1c1917; margin-bottom: 1rem;">결론부터 말씀드리면</h2>
          <div style="overflow-x: auto;">
            <table style="width: 100%; border-collapse: collapse; font-size: 0.875rem;">
              <thead>
                <tr style="background: #fef3c7;">
                  <th style="padding: 0.75rem; text-align: left; border-bottom: 2px solid #f59e0b;">상황</th>
                  <th style="padding: 0.75rem; text-align: center; border-bottom: 2px solid #f59e0b;">추천</th>
                </tr>
              </thead>
              <tbody>
                <tr style="border-bottom: 1px solid #e7e5e4;">
                  <td style="padding: 0.75rem;">현관/베란다 소규모</td>
                  <td style="padding: 0.75rem; text-align: center; color: #16a34a; font-weight: 600;">셀프 도전 가능 ✅</td>
                </tr>
                <tr style="border-bottom: 1px solid #e7e5e4;">
                  <td style="padding: 0.75rem;">화장실 바닥 이상</td>
                  <td style="padding: 0.75rem; text-align: center; color: #f59e0b; font-weight: 600;">업체 추천</td>
                </tr>
                <tr style="border-bottom: 1px solid #e7e5e4;">
                  <td style="padding: 0.75rem;">거실</td>
                  <td style="padding: 0.75rem; text-align: center; color: #dc2626; font-weight: 600;">무조건 업체 ❌</td>
                </tr>
                <tr>
                  <td style="padding: 0.75rem;">케라폭시 원하면</td>
                  <td style="padding: 0.75rem; text-align: center; color: #dc2626; font-weight: 600;">무조건 업체 ❌</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div style="margin-bottom: 2rem;">
          <h2 style="font-size: 1.5rem; font-weight: 700; color: #1c1917; margin-bottom: 1rem;">비용 비교</h2>
          <div style="overflow-x: auto;">
            <table style="width: 100%; border-collapse: collapse; font-size: 0.875rem;">
              <thead>
                <tr style="background: #f5f5f4;">
                  <th style="padding: 0.75rem; text-align: left; border-bottom: 2px solid #d6d3d1;">항목</th>
                  <th style="padding: 0.75rem; text-align: center; border-bottom: 2px solid #d6d3d1;">셀프</th>
                  <th style="padding: 0.75rem; text-align: center; border-bottom: 2px solid #d6d3d1;">업체</th>
                </tr>
              </thead>
              <tbody>
                <tr style="border-bottom: 1px solid #e7e5e4;">
                  <td style="padding: 0.75rem;">화장실 바닥</td>
                  <td style="padding: 0.75rem; text-align: center;">3~5만원</td>
                  <td style="padding: 0.75rem; text-align: center;">30만원</td>
                </tr>
                <tr style="border-bottom: 1px solid #e7e5e4;">
                  <td style="padding: 0.75rem;">현관</td>
                  <td style="padding: 0.75rem; text-align: center;">1~2만원</td>
                  <td style="padding: 0.75rem; text-align: center;">5만원</td>
                </tr>
                <tr style="border-bottom: 1px solid #e7e5e4;">
                  <td style="padding: 0.75rem;">내구성</td>
                  <td style="padding: 0.75rem; text-align: center;">2~3년</td>
                  <td style="padding: 0.75rem; text-align: center; color: #16a34a; font-weight: 600;">10년+</td>
                </tr>
                <tr>
                  <td style="padding: 0.75rem;">A/S</td>
                  <td style="padding: 0.75rem; text-align: center; color: #dc2626;">없음</td>
                  <td style="padding: 0.75rem; text-align: center; color: #16a34a; font-weight: 600;">5년</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div style="background: #fef3c7; padding: 1.5rem; border-radius: 1rem;">
          <p style="color: #92400e; margin: 0;"><strong>💡 셀프는 2~3년마다 다시 해야 합니다.</strong> 10년 기준으로 계산하면 업체가 더 저렴할 수 있어요!</p>
        </div>`
}

// Find 페이지 SSG 콘텐츠
function generateFindSSGContent() {
  return `
        <div style="margin-bottom: 2rem;">
          <h2 style="font-size: 1.5rem; font-weight: 700; color: #1c1917; margin-bottom: 1rem;">좋은 줄눈업체 체크리스트</h2>
          <div style="display: flex; flex-direction: column; gap: 1rem;">
            <div style="background: white; border: 1px solid #e7e5e4; border-radius: 1rem; padding: 1.25rem;">
              <div style="display: flex; align-items: center; gap: 0.75rem;">
                <span style="font-size: 1.5rem;">✅</span>
                <div>
                  <h3 style="font-weight: 700; color: #1c1917; margin: 0 0 0.25rem 0;">가격표 공개</h3>
                  <p style="color: #57534e; font-size: 0.875rem; margin: 0;">홈페이지에 가격이 투명하게 공개되어 있는지 확인하세요.</p>
                </div>
              </div>
            </div>
            <div style="background: white; border: 1px solid #e7e5e4; border-radius: 1rem; padding: 1.25rem;">
              <div style="display: flex; align-items: center; gap: 0.75rem;">
                <span style="font-size: 1.5rem;">✅</span>
                <div>
                  <h3 style="font-weight: 700; color: #1c1917; margin: 0 0 0.25rem 0;">A/S 기간</h3>
                  <p style="color: #57534e; font-size: 0.875rem; margin: 0;">최소 3년 이상 A/S 보장하는 업체를 선택하세요.</p>
                </div>
              </div>
            </div>
            <div style="background: white; border: 1px solid #e7e5e4; border-radius: 1rem; padding: 1.25rem;">
              <div style="display: flex; align-items: center; gap: 0.75rem;">
                <span style="font-size: 1.5rem;">✅</span>
                <div>
                  <h3 style="font-weight: 700; color: #1c1917; margin: 0 0 0.25rem 0;">사용 자재</h3>
                  <p style="color: #57534e; font-size: 0.875rem; margin: 0;">케라폭시 등 자재를 명확히 안내하는지 확인하세요.</p>
                </div>
              </div>
            </div>
            <div style="background: white; border: 1px solid #e7e5e4; border-radius: 1rem; padding: 1.25rem;">
              <div style="display: flex; align-items: center; gap: 0.75rem;">
                <span style="font-size: 1.5rem;">✅</span>
                <div>
                  <h3 style="font-weight: 700; color: #1c1917; margin: 0 0 0.25rem 0;">실제 후기</h3>
                  <p style="color: #57534e; font-size: 0.875rem; margin: 0;">Before/After 사진이 포함된 실제 후기가 있는지 확인하세요.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div style="background: #fee2e2; padding: 1.5rem; border-radius: 1rem; border: 1px solid #fca5a5;">
          <h3 style="font-weight: 700; color: #991b1b; margin: 0 0 0.75rem 0;">❌ 피해야 할 업체</h3>
          <ul style="color: #b91c1c; margin: 0; padding-left: 1.25rem;">
            <li>가격을 안 알려주는 업체</li>
            <li>너무 싼 업체 (숨은 비용 의심)</li>
            <li>A/S 기간이 애매한 업체</li>
            <li>연락이 잘 안 되는 업체</li>
          </ul>
        </div>`
}

// 메인 실행
async function main() {
  console.log('서비스 페이지 생성 시작...')

  // 템플릿 읽기
  const templatePath = path.join(__dirname, '..', 'templates', 'service.html')
  const template = fs.readFileSync(templatePath, 'utf-8')

  // dist 디렉토리 확인
  const distPath = path.join(__dirname, '..', 'dist')
  if (!fs.existsSync(distPath)) {
    console.log('dist 폴더가 없습니다. 먼저 npm run build를 실행하세요.')
    process.exit(1)
  }

  // dist/service.html에서 빌드된 JS/CSS 경로 추출
  const serviceHtmlPath = path.join(distPath, 'service.html')
  if (!fs.existsSync(serviceHtmlPath)) {
    console.log('dist/service.html이 없습니다. Vite 빌드에 service 엔트리가 포함되었는지 확인하세요.')
    process.exit(1)
  }
  const serviceHtml = fs.readFileSync(serviceHtmlPath, 'utf-8')

  // Vite 빌드 파일 경로 추출 (해시 포함된 파일명)
  const jsMatch = serviceHtml.match(/src="(\/assets\/service-[^"]+\.js)"/)
  const cssMatch = serviceHtml.match(/href="(\/assets\/index-[^"]+\.css)"/)

  const viteJs = jsMatch ? jsMatch[1] : '/assets/service.js'
  const viteCss = cssMatch ? cssMatch[1] : '/assets/index.css'

  console.log(`Vite 빌드 파일 감지: JS=${viteJs}, CSS=${viteCss}`)

  // 7개 서비스 페이지 생성
  const services = Object.values(servicePages)
  console.log(`${services.length}개 서비스 페이지 생성 시작...`)

  services.forEach(service => {
    // JSON-LD 스키마 생성
    const mainSchema = generateSchema(service)
    const breadcrumbSchema = generateBreadcrumbSchema(service)

    // SSG 콘텐츠 생성
    const ssgContent = generateSSGContent(service)

    // 템플릿 치환
    const html = template
      .replace(/\{\{PAGE_SLUG\}\}/g, service.slug)
      .replace(/\{\{PAGE_TITLE\}\}/g, service.title)
      .replace(/\{\{PAGE_DESCRIPTION\}\}/g, service.description)
      .replace(/\{\{PAGE_KEYWORDS\}\}/g, service.keywords)
      .replace(/\{\{PAGE_H1\}\}/g, service.h1)
      .replace(/\{\{PAGE_SUBTITLE\}\}/g, service.subtitle)
      .replace('{{JSON_LD_SCHEMA}}', JSON.stringify(mainSchema, null, 2))
      .replace('{{BREADCRUMB_JSON_LD}}', JSON.stringify(breadcrumbSchema, null, 2))
      .replace('{{SSG_CONTENT}}', ssgContent)
      .replace(/\{\{VITE_JS\}\}/g, viteJs)
      .replace(/\{\{VITE_CSS\}\}/g, viteCss)

    // 디렉토리 생성 및 파일 저장
    const pageDir = path.join(distPath, service.slug)
    if (!fs.existsSync(pageDir)) {
      fs.mkdirSync(pageDir, { recursive: true })
    }

    fs.writeFileSync(path.join(pageDir, 'index.html'), html)
    console.log(`  ✓ /${service.slug}/index.html 생성`)
  })

  console.log(`\n완료! ${services.length}개 서비스 페이지가 생성되었습니다.`)
}

main().catch(console.error)
