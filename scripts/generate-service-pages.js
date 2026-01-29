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

// OG 이미지 매핑 (페이지별 고유 OG 이미지)
const ogImageMap = {
  'faq': { url: '/images/og/og-faq.png', alt: '줄눈시공 자주 묻는 질문 BEST 10' },
  'types': { url: '/images/og/og-types.png', alt: '줄눈 종류 완벽 비교 가이드 - 케라폭시, 폴리우레아' },
  'bathroom': { url: '/images/og/og-bathroom.png', alt: '화장실 줄눈시공 완벽 가이드 - 가격, 과정, 후기' },
  'price': { url: '/images/og/og-price.png', alt: '줄눈시공 가격표 - 2025년 정찰제' },
  'review': { url: '/images/og/og-review.png', alt: '줄눈시공 실제 고객 후기 - Before & After' },
  'self-diy': { url: '/images/og/og-self-diy.png', alt: '셀프 줄눈시공 vs 전문업체 비교' },
  'find': { url: '/images/og/og-find.png', alt: '줄눈업체 선택 가이드 - 사기 안 당하는 법' },
}

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
  return `
        <!-- 인트로 -->
        <div style="background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); padding: 1.5rem; border-radius: 1rem; margin-bottom: 2rem;">
          <p style="color: #92400e; font-size: 1rem; line-height: 1.8; margin: 0;">
            줄눈시공 전에 궁금한 점들, 여기서 다 해결하세요!<br>
            고객님들이 가장 많이 묻는 질문 <strong>10가지</strong>를 정리했습니다.
          </p>
        </div>

        <!-- Q1. 비용 -->
        <div style="background: white; border: 1px solid #e7e5e4; border-radius: 1rem; padding: 1.5rem; margin-bottom: 1rem;">
          <h3 style="font-size: 1.125rem; font-weight: 700; color: #f59e0b; margin: 0 0 1rem 0;">Q1. 줄눈시공 비용은 얼마인가요?</h3>

          <p style="color: #57534e; margin-bottom: 1rem;">하우스Pick 정찰제 가격입니다:</p>

          <div style="overflow-x: auto; margin-bottom: 1rem;">
            <table style="width: 100%; border-collapse: collapse; font-size: 0.875rem;">
              <thead>
                <tr style="background: #1c1917; color: white;">
                  <th style="padding: 0.75rem; text-align: left; border: 1px solid #e7e5e4;">공간</th>
                  <th style="padding: 0.75rem; text-align: center; border: 1px solid #e7e5e4;">범위</th>
                  <th style="padding: 0.75rem; text-align: center; border: 1px solid #e7e5e4;">신축</th>
                  <th style="padding: 0.75rem; text-align: center; border: 1px solid #e7e5e4;">구축</th>
                </tr>
              </thead>
              <tbody>
                <tr style="background: #fef3c7;">
                  <td style="padding: 0.75rem; border: 1px solid #e7e5e4; font-weight: 600;" rowspan="2">화장실</td>
                  <td style="padding: 0.75rem; text-align: center; border: 1px solid #e7e5e4;">바닥</td>
                  <td style="padding: 0.75rem; text-align: center; border: 1px solid #e7e5e4;">30만원</td>
                  <td style="padding: 0.75rem; text-align: center; border: 1px solid #e7e5e4;">35만원</td>
                </tr>
                <tr style="background: #fef3c7;">
                  <td style="padding: 0.75rem; text-align: center; border: 1px solid #e7e5e4;">전체</td>
                  <td style="padding: 0.75rem; text-align: center; border: 1px solid #e7e5e4; font-weight: 600;">90만원</td>
                  <td style="padding: 0.75rem; text-align: center; border: 1px solid #e7e5e4; font-weight: 600;">100만원</td>
                </tr>
                <tr style="background: white;">
                  <td style="padding: 0.75rem; border: 1px solid #e7e5e4; font-weight: 600;">현관</td>
                  <td style="padding: 0.75rem; text-align: center; border: 1px solid #e7e5e4;">바닥</td>
                  <td style="padding: 0.75rem; text-align: center; border: 1px solid #e7e5e4;">5만원</td>
                  <td style="padding: 0.75rem; text-align: center; border: 1px solid #e7e5e4;">10만원</td>
                </tr>
                <tr style="background: #f5f5f4;">
                  <td style="padding: 0.75rem; border: 1px solid #e7e5e4; font-weight: 600;">베란다</td>
                  <td style="padding: 0.75rem; text-align: center; border: 1px solid #e7e5e4;">바닥</td>
                  <td style="padding: 0.75rem; text-align: center; border: 1px solid #e7e5e4;">15만원</td>
                  <td style="padding: 0.75rem; text-align: center; border: 1px solid #e7e5e4;">15만원</td>
                </tr>
                <tr style="background: white;">
                  <td style="padding: 0.75rem; border: 1px solid #e7e5e4; font-weight: 600;">세탁실</td>
                  <td style="padding: 0.75rem; text-align: center; border: 1px solid #e7e5e4;">바닥</td>
                  <td style="padding: 0.75rem; text-align: center; border: 1px solid #e7e5e4;">15만원</td>
                  <td style="padding: 0.75rem; text-align: center; border: 1px solid #e7e5e4;">15만원</td>
                </tr>
                <tr style="background: #f5f5f4;">
                  <td style="padding: 0.75rem; border: 1px solid #e7e5e4; font-weight: 600;">거실</td>
                  <td style="padding: 0.75rem; text-align: center; border: 1px solid #e7e5e4;">바닥</td>
                  <td style="padding: 0.75rem; text-align: center; border: 1px solid #e7e5e4; font-weight: 600;">150만원</td>
                  <td style="padding: 0.75rem; text-align: center; border: 1px solid #e7e5e4; font-weight: 600;">150만원</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div style="background: #dcfce7; padding: 1rem; border-radius: 0.75rem; margin-bottom: 1rem;">
            <p style="font-weight: 600; color: #166534; margin: 0 0 0.5rem 0;">포함 내역</p>
            <ul style="margin: 0; padding-left: 1.25rem; color: #166534; font-size: 0.875rem;">
              <li>자재비 (케라폭시/폴리우레아)</li>
              <li>시공 인건비</li>
              <li>기존 줄눈 제거</li>
              <li><strong>5년 무상 A/S</strong></li>
            </ul>
          </div>

          <div style="background: #fef3c7; padding: 1rem; border-radius: 0.75rem;">
            <p style="margin: 0; color: #92400e; font-size: 0.875rem;">
              💡 <strong>추가 비용?</strong> 없습니다. 정찰제라 현장에서 추가 비용 요구 절대 없습니다.
            </p>
          </div>
        </div>

        <!-- Q2. 시간 -->
        <div style="background: white; border: 1px solid #e7e5e4; border-radius: 1rem; padding: 1.5rem; margin-bottom: 1rem;">
          <h3 style="font-size: 1.125rem; font-weight: 700; color: #f59e0b; margin: 0 0 1rem 0;">Q2. 시공 시간은 얼마나 걸리나요?</h3>

          <div style="overflow-x: auto; margin-bottom: 1rem;">
            <table style="width: 100%; border-collapse: collapse; font-size: 0.875rem;">
              <thead>
                <tr style="background: #1c1917; color: white;">
                  <th style="padding: 0.75rem; text-align: left; border: 1px solid #e7e5e4;">공간</th>
                  <th style="padding: 0.75rem; text-align: center; border: 1px solid #e7e5e4;">범위</th>
                  <th style="padding: 0.75rem; text-align: center; border: 1px solid #e7e5e4;">소요 시간</th>
                </tr>
              </thead>
              <tbody>
                <tr style="background: white;">
                  <td style="padding: 0.75rem; border: 1px solid #e7e5e4;" rowspan="2">화장실 1개</td>
                  <td style="padding: 0.75rem; text-align: center; border: 1px solid #e7e5e4;">바닥</td>
                  <td style="padding: 0.75rem; text-align: center; border: 1px solid #e7e5e4;">약 2시간</td>
                </tr>
                <tr style="background: white;">
                  <td style="padding: 0.75rem; text-align: center; border: 1px solid #e7e5e4;">전체</td>
                  <td style="padding: 0.75rem; text-align: center; border: 1px solid #e7e5e4;">약 3~4시간</td>
                </tr>
                <tr style="background: #f5f5f4;">
                  <td style="padding: 0.75rem; border: 1px solid #e7e5e4;" rowspan="2">화장실 2개</td>
                  <td style="padding: 0.75rem; text-align: center; border: 1px solid #e7e5e4;">바닥</td>
                  <td style="padding: 0.75rem; text-align: center; border: 1px solid #e7e5e4;">약 3~4시간</td>
                </tr>
                <tr style="background: #f5f5f4;">
                  <td style="padding: 0.75rem; text-align: center; border: 1px solid #e7e5e4;">전체</td>
                  <td style="padding: 0.75rem; text-align: center; border: 1px solid #e7e5e4;">약 5~6시간</td>
                </tr>
                <tr style="background: white;">
                  <td style="padding: 0.75rem; border: 1px solid #e7e5e4;">거실</td>
                  <td style="padding: 0.75rem; text-align: center; border: 1px solid #e7e5e4;">바닥</td>
                  <td style="padding: 0.75rem; text-align: center; border: 1px solid #e7e5e4;">약 6~8시간</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div style="background: #f5f5f4; padding: 1rem; border-radius: 0.75rem;">
            <p style="font-weight: 600; color: #1c1917; margin: 0 0 0.5rem 0;">시간에 영향을 주는 요소</p>
            <ul style="margin: 0; padding-left: 1.25rem; color: #57534e; font-size: 0.875rem;">
              <li>신축 vs 구축 (구축이 +1시간)</li>
              <li>면적 크기</li>
              <li>타일 종류 (소형 타일이 더 오래 걸림)</li>
            </ul>
          </div>
        </div>

        <!-- Q3. 경화 시간 -->
        <div style="background: white; border: 1px solid #e7e5e4; border-radius: 1rem; padding: 1.5rem; margin-bottom: 1rem;">
          <h3 style="font-size: 1.125rem; font-weight: 700; color: #f59e0b; margin: 0 0 1rem 0;">Q3. 시공 후 바로 사용할 수 있나요?</h3>

          <p style="color: #57534e; margin-bottom: 1rem;"><strong style="color: #1c1917;">24시간 경화 시간</strong>이 필요합니다.</p>

          <div style="overflow-x: auto; margin-bottom: 1rem;">
            <table style="width: 100%; border-collapse: collapse; font-size: 0.875rem;">
              <thead>
                <tr style="background: #1c1917; color: white;">
                  <th style="padding: 0.75rem; text-align: center; border: 1px solid #e7e5e4;">시간</th>
                  <th style="padding: 0.75rem; text-align: center; border: 1px solid #e7e5e4;">상태</th>
                  <th style="padding: 0.75rem; text-align: left; border: 1px solid #e7e5e4;">가능한 것</th>
                </tr>
              </thead>
              <tbody>
                <tr style="background: #fee2e2;">
                  <td style="padding: 0.75rem; text-align: center; border: 1px solid #e7e5e4;">0~6시간</td>
                  <td style="padding: 0.75rem; text-align: center; border: 1px solid #e7e5e4;">경화 중</td>
                  <td style="padding: 0.75rem; border: 1px solid #e7e5e4;">❌ 접촉 금지</td>
                </tr>
                <tr style="background: #fef3c7;">
                  <td style="padding: 0.75rem; text-align: center; border: 1px solid #e7e5e4;">6~12시간</td>
                  <td style="padding: 0.75rem; text-align: center; border: 1px solid #e7e5e4;">표면 경화</td>
                  <td style="padding: 0.75rem; border: 1px solid #e7e5e4;">△ 가벼운 발걸음</td>
                </tr>
                <tr style="background: #fef3c7;">
                  <td style="padding: 0.75rem; text-align: center; border: 1px solid #e7e5e4;">12~24시간</td>
                  <td style="padding: 0.75rem; text-align: center; border: 1px solid #e7e5e4;">거의 완료</td>
                  <td style="padding: 0.75rem; border: 1px solid #e7e5e4;">△ 조심해서 사용</td>
                </tr>
                <tr style="background: #dcfce7;">
                  <td style="padding: 0.75rem; text-align: center; border: 1px solid #e7e5e4; font-weight: 600;">24시간+</td>
                  <td style="padding: 0.75rem; text-align: center; border: 1px solid #e7e5e4;">완전 경화</td>
                  <td style="padding: 0.75rem; border: 1px solid #e7e5e4;">✅ 정상 사용</td>
                </tr>
                <tr style="background: #dcfce7;">
                  <td style="padding: 0.75rem; text-align: center; border: 1px solid #e7e5e4;">48시간+</td>
                  <td style="padding: 0.75rem; text-align: center; border: 1px solid #e7e5e4;">완벽 경화</td>
                  <td style="padding: 0.75rem; border: 1px solid #e7e5e4;">✅ 가구 올리기 가능</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div style="background: #fee2e2; padding: 1rem; border-radius: 0.75rem;">
            <p style="font-weight: 600; color: #991b1b; margin: 0 0 0.5rem 0;">⚠️ 주의사항</p>
            <ul style="margin: 0; padding-left: 1.25rem; color: #991b1b; font-size: 0.875rem;">
              <li>24시간 내 물 사용 금지</li>
              <li>24시간 내 샤워 금지</li>
              <li>다른 화장실 사용 준비하세요</li>
            </ul>
          </div>
        </div>

        <!-- Q4. 신축 vs 구축 -->
        <div style="background: white; border: 1px solid #e7e5e4; border-radius: 1rem; padding: 1.5rem; margin-bottom: 1rem;">
          <h3 style="font-size: 1.125rem; font-weight: 700; color: #f59e0b; margin: 0 0 1rem 0;">Q4. 신축과 구축 차이가 있나요?</h3>

          <p style="color: #57534e; margin-bottom: 1rem;"><strong style="color: #1c1917;">있습니다.</strong> 가격과 작업량이 다릅니다.</p>

          <div style="overflow-x: auto; margin-bottom: 1rem;">
            <table style="width: 100%; border-collapse: collapse; font-size: 0.875rem;">
              <thead>
                <tr style="background: #1c1917; color: white;">
                  <th style="padding: 0.75rem; text-align: left; border: 1px solid #e7e5e4;">항목</th>
                  <th style="padding: 0.75rem; text-align: center; border: 1px solid #e7e5e4;">신축</th>
                  <th style="padding: 0.75rem; text-align: center; border: 1px solid #e7e5e4;">구축</th>
                </tr>
              </thead>
              <tbody>
                <tr style="background: white;">
                  <td style="padding: 0.75rem; border: 1px solid #e7e5e4; font-weight: 600;">정의</td>
                  <td style="padding: 0.75rem; text-align: center; border: 1px solid #e7e5e4;">새 아파트 (1년 이내)</td>
                  <td style="padding: 0.75rem; text-align: center; border: 1px solid #e7e5e4;">거주 중인 집</td>
                </tr>
                <tr style="background: #f5f5f4;">
                  <td style="padding: 0.75rem; border: 1px solid #e7e5e4; font-weight: 600;">기존 줄눈</td>
                  <td style="padding: 0.75rem; text-align: center; border: 1px solid #e7e5e4;">깨끗한 백시멘트</td>
                  <td style="padding: 0.75rem; text-align: center; border: 1px solid #e7e5e4;">오염/변색된 줄눈</td>
                </tr>
                <tr style="background: white;">
                  <td style="padding: 0.75rem; border: 1px solid #e7e5e4; font-weight: 600;">작업</td>
                  <td style="padding: 0.75rem; text-align: center; border: 1px solid #e7e5e4;">바로 시공</td>
                  <td style="padding: 0.75rem; text-align: center; border: 1px solid #e7e5e4;">기계 제거 후 시공</td>
                </tr>
                <tr style="background: #f5f5f4;">
                  <td style="padding: 0.75rem; border: 1px solid #e7e5e4; font-weight: 600;">시간</td>
                  <td style="padding: 0.75rem; text-align: center; border: 1px solid #e7e5e4;">짧음</td>
                  <td style="padding: 0.75rem; text-align: center; border: 1px solid #e7e5e4;">+1시간</td>
                </tr>
                <tr style="background: #fef3c7;">
                  <td style="padding: 0.75rem; border: 1px solid #e7e5e4; font-weight: 600;">가격</td>
                  <td style="padding: 0.75rem; text-align: center; border: 1px solid #e7e5e4;">기본가</td>
                  <td style="padding: 0.75rem; text-align: center; border: 1px solid #e7e5e4; font-weight: 600; color: #dc2626;">+5만원</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div style="background: #fef3c7; padding: 1rem; border-radius: 0.75rem;">
            <p style="font-weight: 600; color: #92400e; margin: 0 0 0.5rem 0;">💡 왜 구축이 더 비싸요?</p>
            <p style="margin: 0; color: #92400e; font-size: 0.875rem;">
              구축은 <strong>기존 줄눈을 기계로 완전히 제거</strong>하는 작업이 추가됩니다.<br>
              대충 덧칠하면 새 줄눈이 안 붙고 금방 떨어집니다. <strong>확실한 제거가 핵심</strong>입니다.
            </p>
          </div>
        </div>

        <!-- Q5. 자재 -->
        <div style="background: white; border: 1px solid #e7e5e4; border-radius: 1rem; padding: 1.5rem; margin-bottom: 1rem;">
          <h3 style="font-size: 1.125rem; font-weight: 700; color: #f59e0b; margin: 0 0 1rem 0;">Q5. 어떤 줄눈 자재가 좋나요?</h3>

          <p style="color: #57534e; margin-bottom: 1rem;">공간에 따라 다릅니다.</p>

          <div style="overflow-x: auto; margin-bottom: 1rem;">
            <table style="width: 100%; border-collapse: collapse; font-size: 0.875rem;">
              <thead>
                <tr style="background: #1c1917; color: white;">
                  <th style="padding: 0.75rem; text-align: left; border: 1px solid #e7e5e4;">자재</th>
                  <th style="padding: 0.75rem; text-align: center; border: 1px solid #e7e5e4;">가격</th>
                  <th style="padding: 0.75rem; text-align: center; border: 1px solid #e7e5e4;">내구성</th>
                  <th style="padding: 0.75rem; text-align: left; border: 1px solid #e7e5e4;">추천 공간</th>
                </tr>
              </thead>
              <tbody>
                <tr style="background: #fef3c7;">
                  <td style="padding: 0.75rem; border: 1px solid #e7e5e4; font-weight: 700;">케라폭시</td>
                  <td style="padding: 0.75rem; text-align: center; border: 1px solid #e7e5e4;">비쌈</td>
                  <td style="padding: 0.75rem; text-align: center; border: 1px solid #e7e5e4; font-weight: 600;">10년+</td>
                  <td style="padding: 0.75rem; border: 1px solid #e7e5e4;">화장실, 거실</td>
                </tr>
                <tr style="background: white;">
                  <td style="padding: 0.75rem; border: 1px solid #e7e5e4; font-weight: 700;">폴리우레아</td>
                  <td style="padding: 0.75rem; text-align: center; border: 1px solid #e7e5e4;">저렴</td>
                  <td style="padding: 0.75rem; text-align: center; border: 1px solid #e7e5e4;">5년+</td>
                  <td style="padding: 0.75rem; border: 1px solid #e7e5e4;">현관, 베란다</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div style="background: #dcfce7; padding: 1rem; border-radius: 0.75rem;">
            <p style="font-weight: 600; color: #166534; margin: 0 0 0.75rem 0;">✅ 하우스Pick 추천 조합</p>
            <ul style="margin: 0; padding-left: 1.25rem; color: #166534; font-size: 0.875rem;">
              <li><strong>화장실</strong> → 케라폭시 (물 많이 사용, 방수력/곰팡이 방지 중요)</li>
              <li><strong>현관/베란다/세탁실</strong> → 폴리우레아 (가성비 좋음, 충분한 내구성)</li>
            </ul>
            <p style="margin: 0.75rem 0 0 0; color: #166534; font-size: 0.875rem; font-weight: 600;">이 조합이 가격 대비 최고입니다!</p>
          </div>
        </div>

        <!-- Q6. 셀프 -->
        <div style="background: white; border: 1px solid #e7e5e4; border-radius: 1rem; padding: 1.5rem; margin-bottom: 1rem;">
          <h3 style="font-size: 1.125rem; font-weight: 700; color: #f59e0b; margin: 0 0 1rem 0;">Q6. 셀프로 할 수 있나요?</h3>

          <p style="color: #57534e; margin-bottom: 1rem;"><strong style="color: #1c1917;">공간과 자재에 따라 다릅니다.</strong></p>

          <div style="overflow-x: auto; margin-bottom: 1rem;">
            <table style="width: 100%; border-collapse: collapse; font-size: 0.875rem;">
              <thead>
                <tr style="background: #1c1917; color: white;">
                  <th style="padding: 0.75rem; text-align: left; border: 1px solid #e7e5e4;">상황</th>
                  <th style="padding: 0.75rem; text-align: center; border: 1px solid #e7e5e4;">셀프 가능?</th>
                </tr>
              </thead>
              <tbody>
                <tr style="background: #dcfce7;">
                  <td style="padding: 0.75rem; border: 1px solid #e7e5e4;">현관 + 폴리우레아</td>
                  <td style="padding: 0.75rem; text-align: center; border: 1px solid #e7e5e4;">✅ 가능</td>
                </tr>
                <tr style="background: #dcfce7;">
                  <td style="padding: 0.75rem; border: 1px solid #e7e5e4;">베란다 + 폴리우레아</td>
                  <td style="padding: 0.75rem; text-align: center; border: 1px solid #e7e5e4;">✅ 가능</td>
                </tr>
                <tr style="background: #fef3c7;">
                  <td style="padding: 0.75rem; border: 1px solid #e7e5e4;">화장실 + 일반 줄눈</td>
                  <td style="padding: 0.75rem; text-align: center; border: 1px solid #e7e5e4;">△ 어려움</td>
                </tr>
                <tr style="background: #fee2e2;">
                  <td style="padding: 0.75rem; border: 1px solid #e7e5e4;">화장실 + 케라폭시</td>
                  <td style="padding: 0.75rem; text-align: center; border: 1px solid #e7e5e4;">❌ 불가능</td>
                </tr>
                <tr style="background: #fee2e2;">
                  <td style="padding: 0.75rem; border: 1px solid #e7e5e4;">거실</td>
                  <td style="padding: 0.75rem; text-align: center; border: 1px solid #e7e5e4;">❌ 불가능</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div style="background: #fef3c7; padding: 1rem; border-radius: 0.75rem;">
            <p style="font-weight: 600; color: #92400e; margin: 0 0 0.5rem 0;">💡 왜 케라폭시는 셀프가 안 되나요?</p>
            <ol style="margin: 0; padding-left: 1.25rem; color: #92400e; font-size: 0.875rem;">
              <li><strong>2액형 배합:</strong> A제 + B제를 정확한 비율로 섞어야 함</li>
              <li><strong>배합 실패:</strong> 틀리면 안 굳거나 갈라짐</li>
              <li><strong>기존 줄눈 제거:</strong> 기계 없이는 하루 종일 해도 부족</li>
              <li><strong>빠른 경화:</strong> 시간 내 작업 못 끝내면 굳어버림</li>
            </ol>
          </div>
        </div>

        <!-- Q7. A/S -->
        <div style="background: white; border: 1px solid #e7e5e4; border-radius: 1rem; padding: 1.5rem; margin-bottom: 1rem;">
          <h3 style="font-size: 1.125rem; font-weight: 700; color: #f59e0b; margin: 0 0 1rem 0;">Q7. A/S는 어떻게 되나요?</h3>

          <p style="color: #57534e; margin-bottom: 1rem;">하우스Pick은 <strong style="color: #16a34a;">5년 무상 A/S</strong>입니다.</p>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1rem;">
            <div style="background: #dcfce7; padding: 1rem; border-radius: 0.75rem;">
              <p style="font-weight: 600; color: #166534; margin: 0 0 0.5rem 0;">✅ A/S 대상</p>
              <ul style="margin: 0; padding-left: 1.25rem; color: #166534; font-size: 0.875rem;">
                <li>줄눈 탈락/들뜸</li>
                <li>변색 (시공 불량인 경우)</li>
                <li>갈라짐</li>
              </ul>
            </div>
            <div style="background: #fee2e2; padding: 1rem; border-radius: 0.75rem;">
              <p style="font-weight: 600; color: #991b1b; margin: 0 0 0.5rem 0;">❌ A/S 제외</p>
              <ul style="margin: 0; padding-left: 1.25rem; color: #991b1b; font-size: 0.875rem;">
                <li>고객 과실 (날카로운 것으로 긁음 등)</li>
                <li>자연재해</li>
              </ul>
            </div>
          </div>

          <div style="background: #f5f5f4; padding: 1rem; border-radius: 0.75rem;">
            <p style="font-weight: 600; color: #1c1917; margin: 0 0 0.5rem 0;">A/S 신청 방법</p>
            <ol style="margin: 0; padding-left: 1.25rem; color: #57534e; font-size: 0.875rem;">
              <li>채널톡 또는 전화 연락</li>
              <li>문제 부분 사진 전송</li>
              <li>확인 후 방문 일정 조율</li>
              <li>무상 재시공</li>
            </ol>
          </div>
        </div>

        <!-- Q8. 곰팡이 -->
        <div style="background: white; border: 1px solid #e7e5e4; border-radius: 1rem; padding: 1.5rem; margin-bottom: 1rem;">
          <h3 style="font-size: 1.125rem; font-weight: 700; color: #f59e0b; margin: 0 0 1rem 0;">Q8. 곰팡이가 다시 생기나요?</h3>

          <p style="color: #57534e; margin-bottom: 1rem;"><strong style="color: #1c1917;">케라폭시 시공 후에는 거의 발생하지 않습니다.</strong></p>

          <div style="background: #dcfce7; padding: 1rem; border-radius: 0.75rem; margin-bottom: 1rem;">
            <p style="font-weight: 600; color: #166534; margin: 0 0 0.5rem 0;">케라폭시가 곰팡이에 강한 이유</p>
            <ul style="margin: 0; padding-left: 1.25rem; color: #166534; font-size: 0.875rem;">
              <li>수분 흡수 안 함</li>
              <li>곰팡이 자랄 환경 안 됨</li>
              <li>영양분 없음 (곰팡이 먹이 없음)</li>
            </ul>
          </div>

          <div style="background: #fef3c7; padding: 1rem; border-radius: 0.75rem; margin-bottom: 1rem;">
            <p style="font-weight: 600; color: #92400e; margin: 0 0 0.5rem 0;">⚠️ 단, 예외 상황</p>
            <ul style="margin: 0; padding-left: 1.25rem; color: #92400e; font-size: 0.875rem;">
              <li>환기를 전혀 안 하면 <strong>타일 표면</strong>에 생길 수 있음</li>
              <li>줄눈이 아니라 타일 자체에 곰팡이</li>
            </ul>
          </div>

          <div style="background: #f5f5f4; padding: 1rem; border-radius: 0.75rem;">
            <p style="font-weight: 600; color: #1c1917; margin: 0 0 0.5rem 0;">곰팡이 예방 팁</p>
            <ol style="margin: 0; padding-left: 1.25rem; color: #57534e; font-size: 0.875rem;">
              <li>샤워 후 환풍기 10분</li>
              <li>주 1회 환기</li>
              <li>물기 스퀴지로 제거</li>
            </ol>
            <p style="margin: 0.75rem 0 0 0; color: #16a34a; font-size: 0.875rem; font-weight: 600;">💡 줄눈 자체에 곰팡이 생기면 A/S 대상입니다!</p>
          </div>
        </div>

        <!-- Q9. 반려동물 -->
        <div style="background: white; border: 1px solid #e7e5e4; border-radius: 1rem; padding: 1.5rem; margin-bottom: 1rem;">
          <h3 style="font-size: 1.125rem; font-weight: 700; color: #f59e0b; margin: 0 0 1rem 0;">Q9. 반려동물이 있어도 안전한가요?</h3>

          <p style="color: #57534e; margin-bottom: 1rem;"><strong style="color: #16a34a;">네, 안전합니다.</strong></p>

          <div style="background: #dcfce7; padding: 1rem; border-radius: 0.75rem; margin-bottom: 1rem;">
            <p style="font-weight: 600; color: #166534; margin: 0 0 0.5rem 0;">✅ 하우스Pick 자재 특징</p>
            <ul style="margin: 0; padding-left: 1.25rem; color: #166534; font-size: 0.875rem;">
              <li>유해물질 없음</li>
              <li>친환경 자재</li>
              <li>냄새 적음</li>
              <li>경화 후 완전 무해</li>
            </ul>
          </div>

          <div style="overflow-x: auto; margin-bottom: 1rem;">
            <table style="width: 100%; border-collapse: collapse; font-size: 0.875rem;">
              <thead>
                <tr style="background: #1c1917; color: white;">
                  <th style="padding: 0.75rem; text-align: center; border: 1px solid #e7e5e4;">시점</th>
                  <th style="padding: 0.75rem; text-align: left; border: 1px solid #e7e5e4;">반려동물</th>
                </tr>
              </thead>
              <tbody>
                <tr style="background: #fee2e2;">
                  <td style="padding: 0.75rem; text-align: center; border: 1px solid #e7e5e4;">시공 중</td>
                  <td style="padding: 0.75rem; border: 1px solid #e7e5e4;">다른 방에 격리</td>
                </tr>
                <tr style="background: #fef3c7;">
                  <td style="padding: 0.75rem; text-align: center; border: 1px solid #e7e5e4;">0~24시간</td>
                  <td style="padding: 0.75rem; border: 1px solid #e7e5e4;">해당 공간 출입 금지</td>
                </tr>
                <tr style="background: #dcfce7;">
                  <td style="padding: 0.75rem; text-align: center; border: 1px solid #e7e5e4;">24시간 후</td>
                  <td style="padding: 0.75rem; border: 1px solid #e7e5e4;">정상 출입 가능</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Q10. 예약 -->
        <div style="background: white; border: 1px solid #e7e5e4; border-radius: 1rem; padding: 1.5rem; margin-bottom: 1rem;">
          <h3 style="font-size: 1.125rem; font-weight: 700; color: #f59e0b; margin: 0 0 1rem 0;">Q10. 예약은 어떻게 하나요?</h3>

          <h4 style="font-size: 1rem; font-weight: 600; color: #1c1917; margin: 1rem 0 0.75rem;">예약 방법</h4>

          <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.75rem; margin-bottom: 1rem;">
            <div style="background: #f5f5f4; padding: 1rem; border-radius: 0.75rem; text-align: center;">
              <p style="margin: 0 0 0.25rem 0; font-size: 1.25rem;">📞</p>
              <p style="margin: 0; font-weight: 600; color: #1c1917; font-size: 0.875rem;">전화</p>
              <p style="margin: 0.25rem 0 0 0; color: #57534e; font-size: 0.75rem;">010-6461-0131<br>평일 09:00~18:00</p>
            </div>
            <div style="background: #f5f5f4; padding: 1rem; border-radius: 0.75rem; text-align: center;">
              <p style="margin: 0 0 0.25rem 0; font-size: 1.25rem;">💬</p>
              <p style="margin: 0; font-weight: 600; color: #1c1917; font-size: 0.875rem;">채널톡</p>
              <p style="margin: 0.25rem 0 0 0; color: #57534e; font-size: 0.75rem;">홈페이지 우측 하단<br>24시간 접수</p>
            </div>
            <div style="background: #f5f5f4; padding: 1rem; border-radius: 0.75rem; text-align: center;">
              <p style="margin: 0 0 0.25rem 0; font-size: 1.25rem;">💛</p>
              <p style="margin: 0; font-weight: 600; color: #1c1917; font-size: 0.875rem;">카카오톡</p>
              <p style="margin: 0.25rem 0 0 0; color: #57534e; font-size: 0.75rem;">"하우스Pick" 검색<br>24시간 접수</p>
            </div>
          </div>

          <h4 style="font-size: 1rem; font-weight: 600; color: #1c1917; margin: 1rem 0 0.75rem;">예약 과정</h4>
          <ol style="margin: 0 0 1rem 0; padding-left: 1.5rem; color: #57534e; font-size: 0.875rem; line-height: 2;">
            <li><strong>상담</strong> - 공간, 범위, 희망일 확인</li>
            <li><strong>견적</strong> - 정찰제라 바로 안내</li>
            <li><strong>예약</strong> - 날짜 확정</li>
            <li><strong>시공</strong> - 약속 시간에 방문</li>
            <li><strong>완료</strong> - 현장 결제</li>
          </ol>

          <h4 style="font-size: 1rem; font-weight: 600; color: #1c1917; margin: 1rem 0 0.75rem;">예약 시 알려주실 것</h4>
          <div style="background: #f5f5f4; padding: 1rem; border-radius: 0.75rem; margin-bottom: 1rem;">
            <ul style="margin: 0; padding-left: 0; list-style: none; color: #57534e; font-size: 0.875rem;">
              <li style="margin-bottom: 0.25rem;">📍 주소</li>
              <li style="margin-bottom: 0.25rem;">🏠 공간 (화장실, 현관 등)</li>
              <li style="margin-bottom: 0.25rem;">📐 범위 (바닥만? 전체?)</li>
              <li style="margin-bottom: 0.25rem;">🏗️ 신축/구축</li>
              <li>📅 희망 날짜</li>
            </ul>
          </div>

          <div style="background: #fef3c7; padding: 1rem; border-radius: 0.75rem;">
            <p style="font-weight: 600; color: #92400e; margin: 0 0 0.5rem 0;">💡 얼마나 전에 예약해야 하나요?</p>
            <ul style="margin: 0; padding-left: 1.25rem; color: #92400e; font-size: 0.875rem;">
              <li>일반: 3~5일 전</li>
              <li>급한 경우: 1~2일 전 가능 (일정 확인 필요)</li>
              <li>주말: 1주일 전 추천</li>
            </ul>
          </div>
        </div>

        <!-- 상담 안내 -->
        <div style="background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); padding: 1.5rem; border-radius: 1rem; margin-top: 2rem; text-align: center;">
          <h3 style="font-size: 1.125rem; font-weight: 700; color: #92400e; margin: 0 0 0.75rem 0;">더 궁금한 점이 있으신가요?</h3>
          <p style="color: #78350f; margin: 0 0 1rem 0; font-size: 0.875rem;">
            위 질문 외에 궁금한 점은 언제든 문의해주세요!<br>
            친절하게 답변드리겠습니다.
          </p>
          <p style="font-weight: 700; color: #92400e; margin: 0; font-size: 1rem;">
            ☎ 010-6461-0131<br>
            💬 채널톡 상담 (24시간)
          </p>
        </div>

        <p style="color: #a8a29e; font-size: 0.75rem; text-align: center; margin-top: 2rem;">최종 업데이트: 2025년 1월</p>`
}

// Types 페이지 SSG 콘텐츠
function generateTypesSSGContent() {
  return `
        <!-- 도입부 -->
        <div style="background: #f5f5f4; padding: 1.5rem; border-radius: 1rem; margin-bottom: 2rem; font-size: 1rem; color: #57534e; line-height: 1.8;">
          <p style="margin: 0;">케라폭시? 폴리우레아? 어떤 줄눈을 선택해야 할지 고민되시나요?<br/>6가지 줄눈 종류의 특징, 가격, 장단점을 한눈에 비교해드립니다.</p>
        </div>

        <!-- 목차 -->
        <div style="background: white; border: 1px solid #e7e5e4; border-radius: 1rem; padding: 1.5rem; margin-bottom: 2rem;">
          <h3 style="font-weight: 700; color: #1c1917; margin: 0 0 1rem 0; font-size: 1rem;">📋 목차</h3>
          <ol style="margin: 0; padding-left: 1.25rem; color: #57534e; line-height: 2; columns: 2;">
            <li><a href="#what-is" style="color: #f59e0b; text-decoration: none;">줄눈이란?</a></li>
            <li><a href="#compare" style="color: #f59e0b; text-decoration: none;">줄눈 종류 한눈에 비교</a></li>
            <li><a href="#kerapoxy" style="color: #f59e0b; text-decoration: none;">케라폭시 줄눈</a></li>
            <li><a href="#polyurea" style="color: #f59e0b; text-decoration: none;">폴리우레아 줄눈</a></li>
            <li><a href="#ardex" style="color: #f59e0b; text-decoration: none;">아덱스 줄눈</a></li>
            <li><a href="#biglion" style="color: #f59e0b; text-decoration: none;">빅라이언 줄눈</a></li>
            <li><a href="#aspakton" style="color: #f59e0b; text-decoration: none;">아스팍톤 줄눈</a></li>
            <li><a href="#starlike" style="color: #f59e0b; text-decoration: none;">스타라이크에보 줄눈</a></li>
            <li><a href="#space-recommend" style="color: #f59e0b; text-decoration: none;">공간별 추천 줄눈</a></li>
            <li><a href="#conclusion" style="color: #f59e0b; text-decoration: none;">결론</a></li>
          </ol>
        </div>

        <!-- 1. 줄눈이란? -->
        <h2 id="what-is" style="font-size: 1.5rem; font-weight: 700; color: #1c1917; margin: 2.5rem 0 1rem; padding-top: 1rem; border-top: 1px solid #e7e5e4;">1. 줄눈이란?</h2>
        <p style="color: #57534e; margin-bottom: 1.5rem; line-height: 1.8;">줄눈은 타일과 타일 사이의 <strong style="color: #1c1917;">이음새를 메우는 시공</strong>입니다.</p>

        <h3 style="font-size: 1.125rem; font-weight: 700; color: #1c1917; margin: 1.5rem 0 1rem;">줄눈의 역할</h3>
        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem; margin-bottom: 1.5rem;">
          <div style="background: #dcfce7; padding: 1rem; border-radius: 0.75rem;">
            <p style="margin: 0; color: #166534;"><strong>💧 방수</strong><br/><span style="font-size: 0.875rem;">타일 틈새로 물이 스며드는 것을 방지</span></p>
          </div>
          <div style="background: #dcfce7; padding: 1rem; border-radius: 0.75rem;">
            <p style="margin: 0; color: #166534;"><strong>🦠 곰팡이 방지</strong><br/><span style="font-size: 0.875rem;">습기로 인한 곰팡이 번식 차단</span></p>
          </div>
          <div style="background: #dcfce7; padding: 1rem; border-radius: 0.75rem;">
            <p style="margin: 0; color: #166534;"><strong>🧹 오염 방지</strong><br/><span style="font-size: 0.875rem;">이물질이 틈새에 끼는 것을 방지</span></p>
          </div>
          <div style="background: #dcfce7; padding: 1rem; border-radius: 0.75rem;">
            <p style="margin: 0; color: #166534;"><strong>✨ 미관</strong><br/><span style="font-size: 0.875rem;">깔끔하고 고급스러운 마감</span></p>
          </div>
        </div>

        <h3 style="font-size: 1.125rem; font-weight: 700; color: #1c1917; margin: 1.5rem 0 1rem;">줄눈을 안 하면?</h3>
        <div style="background: #fee2e2; padding: 1.25rem; border-radius: 0.75rem; margin-bottom: 2rem;">
          <ul style="margin: 0; padding-left: 1.25rem; color: #b91c1c;">
            <li>타일 틈새에 곰팡이 번식</li>
            <li>검은 때가 끼어 지저분해짐</li>
            <li>냄새 발생</li>
            <li>타일 들뜸 현상</li>
          </ul>
        </div>

        <!-- 2. 줄눈 종류 한눈에 비교 -->
        <h2 id="compare" style="font-size: 1.5rem; font-weight: 700; color: #1c1917; margin: 2.5rem 0 1rem; padding-top: 1rem; border-top: 1px solid #e7e5e4;">2. 줄눈 종류 한눈에 비교</h2>
        <div style="overflow-x: auto; margin-bottom: 2rem;">
          <table style="width: 100%; border-collapse: collapse; font-size: 0.875rem; min-width: 600px;">
            <thead>
              <tr style="background: #fef3c7;">
                <th style="padding: 0.75rem; text-align: left; border-bottom: 2px solid #f59e0b;">종류</th>
                <th style="padding: 0.75rem; text-align: center; border-bottom: 2px solid #f59e0b;">가격대</th>
                <th style="padding: 0.75rem; text-align: center; border-bottom: 2px solid #f59e0b;">내구성</th>
                <th style="padding: 0.75rem; text-align: left; border-bottom: 2px solid #f59e0b;">추천 공간</th>
                <th style="padding: 0.75rem; text-align: left; border-bottom: 2px solid #f59e0b;">특징</th>
              </tr>
            </thead>
            <tbody>
              <tr style="border-bottom: 1px solid #e7e5e4; background: #fffbeb;">
                <td style="padding: 0.75rem; font-weight: 700; color: #f59e0b;">케라폭시</td>
                <td style="padding: 0.75rem; text-align: center;">★★★★★</td>
                <td style="padding: 0.75rem; text-align: center;">★★★★★</td>
                <td style="padding: 0.75rem;">화장실, 거실</td>
                <td style="padding: 0.75rem;">최고급, 광택, 10년+</td>
              </tr>
              <tr style="border-bottom: 1px solid #e7e5e4;">
                <td style="padding: 0.75rem; font-weight: 600;">폴리우레아</td>
                <td style="padding: 0.75rem; text-align: center;">★★★☆☆</td>
                <td style="padding: 0.75rem; text-align: center;">★★★★☆</td>
                <td style="padding: 0.75rem;">현관, 베란다</td>
                <td style="padding: 0.75rem;">가성비, 빠른 경화</td>
              </tr>
              <tr style="border-bottom: 1px solid #e7e5e4;">
                <td style="padding: 0.75rem; font-weight: 600;">아덱스</td>
                <td style="padding: 0.75rem; text-align: center;">★★★★☆</td>
                <td style="padding: 0.75rem; text-align: center;">★★★★☆</td>
                <td style="padding: 0.75rem;">화장실</td>
                <td style="padding: 0.75rem;">유럽산, 고급</td>
              </tr>
              <tr style="border-bottom: 1px solid #e7e5e4;">
                <td style="padding: 0.75rem; font-weight: 600;">빅라이언</td>
                <td style="padding: 0.75rem; text-align: center;">★★★☆☆</td>
                <td style="padding: 0.75rem; text-align: center;">★★★★☆</td>
                <td style="padding: 0.75rem;">화장실, 현관</td>
                <td style="padding: 0.75rem;">국산, 가성비</td>
              </tr>
              <tr style="border-bottom: 1px solid #e7e5e4;">
                <td style="padding: 0.75rem; font-weight: 600;">아스팍톤</td>
                <td style="padding: 0.75rem; text-align: center;">★★★★☆</td>
                <td style="padding: 0.75rem; text-align: center;">★★★★☆</td>
                <td style="padding: 0.75rem;">화장실</td>
                <td style="padding: 0.75rem;">항균 기능</td>
              </tr>
              <tr>
                <td style="padding: 0.75rem; font-weight: 600;">스타라이크에보</td>
                <td style="padding: 0.75rem; text-align: center;">★★★★★</td>
                <td style="padding: 0.75rem; text-align: center;">★★★★★</td>
                <td style="padding: 0.75rem;">거실, 화장실</td>
                <td style="padding: 0.75rem;">이탈리아산, 프리미엄</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- 3. 케라폭시 줄눈 -->
        <h2 id="kerapoxy" style="font-size: 1.5rem; font-weight: 700; color: #1c1917; margin: 2.5rem 0 1rem; padding-top: 1rem; border-top: 1px solid #e7e5e4;">3. 케라폭시 줄눈</h2>

        <h3 style="font-size: 1.125rem; font-weight: 700; color: #1c1917; margin: 1.5rem 0 1rem;">케라폭시란?</h3>
        <p style="color: #57534e; margin-bottom: 1rem; line-height: 1.8;">케라폭시(Kerapoxy)는 <strong style="color: #1c1917;">에폭시 계열의 프리미엄 줄눈재</strong>입니다. 이탈리아 Mapei사에서 개발했으며, 현재 가장 인기 있는 고급 줄눈재입니다.</p>

        <h3 style="font-size: 1.125rem; font-weight: 700; color: #1c1917; margin: 1.5rem 0 1rem;">특징</h3>
        <ul style="list-style: none; padding: 0; margin: 0 0 1.5rem 0;">
          <li style="display: flex; gap: 0.5rem; margin-bottom: 0.5rem; color: #57534e;">
            <span>•</span><span><strong>2액형 에폭시:</strong> A제(주제)와 B제(경화제)를 혼합하여 사용</span>
          </li>
          <li style="display: flex; gap: 0.5rem; margin-bottom: 0.5rem; color: #57534e;">
            <span>•</span><span><strong>완전 방수:</strong> 물이 전혀 스며들지 않음</span>
          </li>
          <li style="display: flex; gap: 0.5rem; margin-bottom: 0.5rem; color: #57534e;">
            <span>•</span><span><strong>내구성:</strong> 10년 이상 유지</span>
          </li>
          <li style="display: flex; gap: 0.5rem; color: #57534e;">
            <span>•</span><span><strong>광택:</strong> 시공 후 반짝이는 고급스러운 마감</span>
          </li>
        </ul>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1.5rem;">
          <div style="background: #dcfce7; padding: 1.25rem; border-radius: 0.75rem;">
            <h4 style="font-weight: 700; color: #166534; margin: 0 0 0.75rem 0;">✅ 장점</h4>
            <ul style="margin: 0; padding-left: 1rem; color: #15803d; font-size: 0.875rem; line-height: 1.8;">
              <li>최고 수준의 내구성 (10년+)</li>
              <li>완벽한 방수 기능</li>
              <li>곰팡이가 거의 발생하지 않음</li>
              <li>변색이 적음</li>
              <li>고급스러운 광택 마감</li>
            </ul>
          </div>
          <div style="background: #fee2e2; padding: 1.25rem; border-radius: 0.75rem;">
            <h4 style="font-weight: 700; color: #991b1b; margin: 0 0 0.75rem 0;">❌ 단점</h4>
            <ul style="margin: 0; padding-left: 1rem; color: #b91c1c; font-size: 0.875rem; line-height: 1.8;">
              <li>가격이 비쌈 (일반 줄눈 대비 3~5배)</li>
              <li>시공 난이도가 높음 (전문가 필요)</li>
              <li>경화 시간이 김 (24시간)</li>
              <li>한번 굳으면 수정이 어려움</li>
            </ul>
          </div>
        </div>

        <h3 style="font-size: 1.125rem; font-weight: 700; color: #1c1917; margin: 1.5rem 0 1rem;">케라폭시 가격</h3>
        <div style="overflow-x: auto; margin-bottom: 1.5rem;">
          <table style="width: 100%; border-collapse: collapse; font-size: 0.875rem;">
            <thead>
              <tr style="background: #fef3c7;">
                <th style="padding: 0.75rem; text-align: left; border-bottom: 2px solid #f59e0b;">공간</th>
                <th style="padding: 0.75rem; text-align: center; border-bottom: 2px solid #f59e0b;">신축</th>
                <th style="padding: 0.75rem; text-align: center; border-bottom: 2px solid #f59e0b;">구축</th>
              </tr>
            </thead>
            <tbody>
              <tr style="border-bottom: 1px solid #e7e5e4;">
                <td style="padding: 0.75rem;">화장실 바닥</td>
                <td style="padding: 0.75rem; text-align: center; font-weight: 600; color: #f59e0b;">30만원</td>
                <td style="padding: 0.75rem; text-align: center; font-weight: 600; color: #f59e0b;">35만원</td>
              </tr>
              <tr style="border-bottom: 1px solid #e7e5e4;">
                <td style="padding: 0.75rem;">화장실 전체</td>
                <td style="padding: 0.75rem; text-align: center; font-weight: 600; color: #f59e0b;">90만원</td>
                <td style="padding: 0.75rem; text-align: center; font-weight: 600; color: #f59e0b;">100만원</td>
              </tr>
              <tr>
                <td style="padding: 0.75rem;">거실 바닥</td>
                <td style="padding: 0.75rem; text-align: center; font-weight: 600; color: #f59e0b;">150만원</td>
                <td style="padding: 0.75rem; text-align: center; font-weight: 600; color: #f59e0b;">150만원</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 style="font-size: 1.125rem; font-weight: 700; color: #1c1917; margin: 1.5rem 0 1rem;">추천 공간</h3>
        <ul style="list-style: none; padding: 0; margin: 0 0 1.5rem 0;">
          <li style="display: flex; gap: 0.5rem; margin-bottom: 0.5rem; color: #57534e;">
            <span>⭐</span><span><strong>화장실:</strong> 물을 많이 쓰는 공간에 최적</span>
          </li>
          <li style="display: flex; gap: 0.5rem; margin-bottom: 0.5rem; color: #57534e;">
            <span>⭐</span><span><strong>거실:</strong> 고급스러운 마감을 원할 때</span>
          </li>
          <li style="display: flex; gap: 0.5rem; color: #57534e;">
            <span>•</span><span><strong>주방:</strong> 기름때 방지에 효과적</span>
          </li>
        </ul>

        <div style="background: #f5f5f4; padding: 1.25rem; border-radius: 0.75rem; margin-bottom: 2rem; border-left: 4px solid #f59e0b;">
          <p style="margin: 0 0 0.5rem 0; color: #57534e; font-style: italic; line-height: 1.7;">"처음엔 비싸다고 생각했는데, 3년 지난 지금도 첫날처럼 깨끗해요. 확실히 케라폭시 하길 잘했어요."</p>
          <p style="margin: 0; color: #78716c; font-size: 0.875rem;">— 강남구 김** 고객</p>
        </div>

        <!-- 4. 폴리우레아 줄눈 -->
        <h2 id="polyurea" style="font-size: 1.5rem; font-weight: 700; color: #1c1917; margin: 2.5rem 0 1rem; padding-top: 1rem; border-top: 1px solid #e7e5e4;">4. 폴리우레아 줄눈</h2>

        <h3 style="font-size: 1.125rem; font-weight: 700; color: #1c1917; margin: 1.5rem 0 1rem;">폴리우레아란?</h3>
        <p style="color: #57534e; margin-bottom: 1rem; line-height: 1.8;">폴리우레아(Polyurea)는 <strong style="color: #1c1917;">우레아 계열의 줄눈재</strong>로, 케라폭시보다 가격이 저렴하면서도 우수한 성능을 자랑합니다.</p>

        <h3 style="font-size: 1.125rem; font-weight: 700; color: #1c1917; margin: 1.5rem 0 1rem;">특징</h3>
        <ul style="list-style: none; padding: 0; margin: 0 0 1.5rem 0;">
          <li style="display: flex; gap: 0.5rem; margin-bottom: 0.5rem; color: #57534e;">
            <span>•</span><span><strong>1액형:</strong> 별도의 혼합 없이 바로 사용</span>
          </li>
          <li style="display: flex; gap: 0.5rem; margin-bottom: 0.5rem; color: #57534e;">
            <span>•</span><span><strong>빠른 경화:</strong> 2~4시간이면 사용 가능</span>
          </li>
          <li style="display: flex; gap: 0.5rem; color: #57534e;">
            <span>•</span><span><strong>유연성:</strong> 타일 움직임에도 갈라지지 않음</span>
          </li>
        </ul>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1.5rem;">
          <div style="background: #dcfce7; padding: 1.25rem; border-radius: 0.75rem;">
            <h4 style="font-weight: 700; color: #166534; margin: 0 0 0.75rem 0;">✅ 장점</h4>
            <ul style="margin: 0; padding-left: 1rem; color: #15803d; font-size: 0.875rem; line-height: 1.8;">
              <li>케라폭시 대비 저렴한 가격</li>
              <li>빠른 경화 시간 (2~4시간)</li>
              <li>시공이 비교적 쉬움</li>
              <li>유연성이 좋아 크랙 발생이 적음</li>
              <li>다양한 색상 선택 가능</li>
            </ul>
          </div>
          <div style="background: #fee2e2; padding: 1.25rem; border-radius: 0.75rem;">
            <h4 style="font-weight: 700; color: #991b1b; margin: 0 0 0.75rem 0;">❌ 단점</h4>
            <ul style="margin: 0; padding-left: 1rem; color: #b91c1c; font-size: 0.875rem; line-height: 1.8;">
              <li>케라폭시보다 내구성이 낮음</li>
              <li>광택이 적음</li>
              <li>거실 등 넓은 면적에는 부적합</li>
            </ul>
          </div>
        </div>

        <h3 style="font-size: 1.125rem; font-weight: 700; color: #1c1917; margin: 1.5rem 0 1rem;">폴리우레아 가격</h3>
        <div style="overflow-x: auto; margin-bottom: 1.5rem;">
          <table style="width: 100%; border-collapse: collapse; font-size: 0.875rem;">
            <thead>
              <tr style="background: #fef3c7;">
                <th style="padding: 0.75rem; text-align: left; border-bottom: 2px solid #f59e0b;">공간</th>
                <th style="padding: 0.75rem; text-align: center; border-bottom: 2px solid #f59e0b;">신축</th>
                <th style="padding: 0.75rem; text-align: center; border-bottom: 2px solid #f59e0b;">구축</th>
              </tr>
            </thead>
            <tbody>
              <tr style="border-bottom: 1px solid #e7e5e4;">
                <td style="padding: 0.75rem;">현관</td>
                <td style="padding: 0.75rem; text-align: center; font-weight: 600; color: #f59e0b;">5만원</td>
                <td style="padding: 0.75rem; text-align: center; font-weight: 600; color: #f59e0b;">10만원</td>
              </tr>
              <tr style="border-bottom: 1px solid #e7e5e4;">
                <td style="padding: 0.75rem;">세탁실</td>
                <td style="padding: 0.75rem; text-align: center; font-weight: 600; color: #f59e0b;">15만원</td>
                <td style="padding: 0.75rem; text-align: center; font-weight: 600; color: #f59e0b;">15만원</td>
              </tr>
              <tr>
                <td style="padding: 0.75rem;">베란다</td>
                <td style="padding: 0.75rem; text-align: center; font-weight: 600; color: #f59e0b;">15만원</td>
                <td style="padding: 0.75rem; text-align: center; font-weight: 600; color: #f59e0b;">15만원</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 style="font-size: 1.125rem; font-weight: 700; color: #1c1917; margin: 1.5rem 0 1rem;">추천 공간</h3>
        <ul style="list-style: none; padding: 0; margin: 0 0 1.5rem 0;">
          <li style="display: flex; gap: 0.5rem; margin-bottom: 0.5rem; color: #57534e;">
            <span>⭐</span><span><strong>현관:</strong> 가성비 좋은 선택</span>
          </li>
          <li style="display: flex; gap: 0.5rem; margin-bottom: 0.5rem; color: #57534e;">
            <span>⭐</span><span><strong>베란다:</strong> 외부 환경에 강함</span>
          </li>
          <li style="display: flex; gap: 0.5rem; color: #57534e;">
            <span>•</span><span><strong>세탁실:</strong> 습기에 강함</span>
          </li>
        </ul>

        <div style="background: #f5f5f4; padding: 1.25rem; border-radius: 0.75rem; margin-bottom: 2rem; border-left: 4px solid #f59e0b;">
          <p style="margin: 0 0 0.5rem 0; color: #57534e; font-style: italic; line-height: 1.7;">"현관이랑 베란다 폴리우레아로 했는데, 가격 대비 만족스러워요. 1년 지났는데 아직 깨끗해요."</p>
          <p style="margin: 0; color: #78716c; font-size: 0.875rem;">— 수원시 이** 고객</p>
        </div>

        <!-- 5. 아덱스 줄눈 -->
        <h2 id="ardex" style="font-size: 1.5rem; font-weight: 700; color: #1c1917; margin: 2.5rem 0 1rem; padding-top: 1rem; border-top: 1px solid #e7e5e4;">5. 아덱스 줄눈</h2>

        <h3 style="font-size: 1.125rem; font-weight: 700; color: #1c1917; margin: 1.5rem 0 1rem;">아덱스란?</h3>
        <p style="color: #57534e; margin-bottom: 1rem; line-height: 1.8;">아덱스(Ardex)는 <strong style="color: #1c1917;">독일 기술력이 적용된 프리미엄 줄눈재</strong>입니다. 유럽에서 높은 점유율을 가진 브랜드입니다.</p>

        <h3 style="font-size: 1.125rem; font-weight: 700; color: #1c1917; margin: 1.5rem 0 1rem;">특징</h3>
        <ul style="list-style: none; padding: 0; margin: 0 0 1.5rem 0;">
          <li style="display: flex; gap: 0.5rem; margin-bottom: 0.5rem; color: #57534e;">
            <span>•</span><span><strong>시멘트 계열:</strong> 전통적인 방식의 고급화</span>
          </li>
          <li style="display: flex; gap: 0.5rem; margin-bottom: 0.5rem; color: #57534e;">
            <span>•</span><span><strong>뛰어난 접착력:</strong> 타일과의 결합력이 우수</span>
          </li>
          <li style="display: flex; gap: 0.5rem; color: #57534e;">
            <span>•</span><span><strong>다양한 색상:</strong> 30가지 이상의 색상 보유</span>
          </li>
        </ul>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1.5rem;">
          <div style="background: #dcfce7; padding: 1.25rem; border-radius: 0.75rem;">
            <h4 style="font-weight: 700; color: #166534; margin: 0 0 0.75rem 0;">✅ 장점</h4>
            <ul style="margin: 0; padding-left: 1rem; color: #15803d; font-size: 0.875rem; line-height: 1.8;">
              <li>유럽 품질 인증</li>
              <li>뛰어난 접착력</li>
              <li>다양한 색상 선택</li>
              <li>작업성이 좋음</li>
            </ul>
          </div>
          <div style="background: #fee2e2; padding: 1.25rem; border-radius: 0.75rem;">
            <h4 style="font-weight: 700; color: #991b1b; margin: 0 0 0.75rem 0;">❌ 단점</h4>
            <ul style="margin: 0; padding-left: 1rem; color: #b91c1c; font-size: 0.875rem; line-height: 1.8;">
              <li>케라폭시보다 방수 성능이 낮음</li>
              <li>시간이 지나면 변색 가능성</li>
              <li>국내 A/S가 제한적</li>
            </ul>
          </div>
        </div>

        <h3 style="font-size: 1.125rem; font-weight: 700; color: #1c1917; margin: 1.5rem 0 1rem;">추천 공간</h3>
        <ul style="list-style: none; padding: 0; margin: 0 0 2rem 0;">
          <li style="display: flex; gap: 0.5rem; margin-bottom: 0.5rem; color: #57534e;">
            <span>•</span><span>화장실 (물 사용량이 적은 경우)</span>
          </li>
          <li style="display: flex; gap: 0.5rem; color: #57534e;">
            <span>•</span><span>주방 벽면</span>
          </li>
        </ul>

        <!-- 6. 빅라이언 줄눈 -->
        <h2 id="biglion" style="font-size: 1.5rem; font-weight: 700; color: #1c1917; margin: 2.5rem 0 1rem; padding-top: 1rem; border-top: 1px solid #e7e5e4;">6. 빅라이언 줄눈</h2>

        <h3 style="font-size: 1.125rem; font-weight: 700; color: #1c1917; margin: 1.5rem 0 1rem;">빅라이언이란?</h3>
        <p style="color: #57534e; margin-bottom: 1rem; line-height: 1.8;">빅라이언은 <strong style="color: #1c1917;">국산 줄눈재</strong> 브랜드로, 가성비가 뛰어나 최근 인기를 얻고 있습니다.</p>

        <h3 style="font-size: 1.125rem; font-weight: 700; color: #1c1917; margin: 1.5rem 0 1rem;">특징</h3>
        <ul style="list-style: none; padding: 0; margin: 0 0 1.5rem 0;">
          <li style="display: flex; gap: 0.5rem; margin-bottom: 0.5rem; color: #57534e;">
            <span>•</span><span><strong>국산 제품:</strong> A/S 및 구매가 편리</span>
          </li>
          <li style="display: flex; gap: 0.5rem; margin-bottom: 0.5rem; color: #57534e;">
            <span>•</span><span><strong>다양한 라인업:</strong> 에폭시, 우레아 등 다양한 제품군</span>
          </li>
          <li style="display: flex; gap: 0.5rem; color: #57534e;">
            <span>•</span><span><strong>합리적인 가격:</strong> 수입산 대비 저렴</span>
          </li>
        </ul>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1.5rem;">
          <div style="background: #dcfce7; padding: 1.25rem; border-radius: 0.75rem;">
            <h4 style="font-weight: 700; color: #166534; margin: 0 0 0.75rem 0;">✅ 장점</h4>
            <ul style="margin: 0; padding-left: 1rem; color: #15803d; font-size: 0.875rem; line-height: 1.8;">
              <li>가성비 우수</li>
              <li>국내 A/S 가능</li>
              <li>빠른 배송</li>
              <li>다양한 제품 라인업</li>
            </ul>
          </div>
          <div style="background: #fee2e2; padding: 1.25rem; border-radius: 0.75rem;">
            <h4 style="font-weight: 700; color: #991b1b; margin: 0 0 0.75rem 0;">❌ 단점</h4>
            <ul style="margin: 0; padding-left: 1rem; color: #b91c1c; font-size: 0.875rem; line-height: 1.8;">
              <li>브랜드 인지도가 낮음</li>
              <li>프리미엄 제품 대비 내구성</li>
            </ul>
          </div>
        </div>

        <h3 style="font-size: 1.125rem; font-weight: 700; color: #1c1917; margin: 1.5rem 0 1rem;">추천 공간</h3>
        <ul style="list-style: none; padding: 0; margin: 0 0 2rem 0;">
          <li style="display: flex; gap: 0.5rem; margin-bottom: 0.5rem; color: #57534e;">
            <span>•</span><span>화장실</span>
          </li>
          <li style="display: flex; gap: 0.5rem; margin-bottom: 0.5rem; color: #57534e;">
            <span>•</span><span>현관</span>
          </li>
          <li style="display: flex; gap: 0.5rem; color: #57534e;">
            <span>•</span><span>일반 가정집 전반</span>
          </li>
        </ul>

        <!-- 7. 아스팍톤 줄눈 -->
        <h2 id="aspakton" style="font-size: 1.5rem; font-weight: 700; color: #1c1917; margin: 2.5rem 0 1rem; padding-top: 1rem; border-top: 1px solid #e7e5e4;">7. 아스팍톤 줄눈</h2>

        <h3 style="font-size: 1.125rem; font-weight: 700; color: #1c1917; margin: 1.5rem 0 1rem;">아스팍톤이란?</h3>
        <p style="color: #57534e; margin-bottom: 1rem; line-height: 1.8;">아스팍톤은 <strong style="color: #1c1917;">항균 기능이 강화된 줄눈재</strong>로, 위생을 중시하는 공간에 적합합니다.</p>

        <h3 style="font-size: 1.125rem; font-weight: 700; color: #1c1917; margin: 1.5rem 0 1rem;">특징</h3>
        <ul style="list-style: none; padding: 0; margin: 0 0 1.5rem 0;">
          <li style="display: flex; gap: 0.5rem; margin-bottom: 0.5rem; color: #57534e;">
            <span>•</span><span><strong>항균 성분:</strong> 곰팡이 및 세균 번식 억제</span>
          </li>
          <li style="display: flex; gap: 0.5rem; margin-bottom: 0.5rem; color: #57534e;">
            <span>•</span><span><strong>친환경:</strong> 유해물질 저감</span>
          </li>
          <li style="display: flex; gap: 0.5rem; color: #57534e;">
            <span>•</span><span><strong>냄새 억제:</strong> 화장실 냄새 방지</span>
          </li>
        </ul>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1.5rem;">
          <div style="background: #dcfce7; padding: 1.25rem; border-radius: 0.75rem;">
            <h4 style="font-weight: 700; color: #166534; margin: 0 0 0.75rem 0;">✅ 장점</h4>
            <ul style="margin: 0; padding-left: 1rem; color: #15803d; font-size: 0.875rem; line-height: 1.8;">
              <li>항균 기능</li>
              <li>친환경 소재</li>
              <li>냄새 억제 효과</li>
              <li>어린이, 반려동물 가정에 적합</li>
            </ul>
          </div>
          <div style="background: #fee2e2; padding: 1.25rem; border-radius: 0.75rem;">
            <h4 style="font-weight: 700; color: #991b1b; margin: 0 0 0.75rem 0;">❌ 단점</h4>
            <ul style="margin: 0; padding-left: 1rem; color: #b91c1c; font-size: 0.875rem; line-height: 1.8;">
              <li>가격이 다소 높음</li>
              <li>케라폭시 대비 광택이 적음</li>
            </ul>
          </div>
        </div>

        <h3 style="font-size: 1.125rem; font-weight: 700; color: #1c1917; margin: 1.5rem 0 1rem;">추천 공간</h3>
        <ul style="list-style: none; padding: 0; margin: 0 0 2rem 0;">
          <li style="display: flex; gap: 0.5rem; margin-bottom: 0.5rem; color: #57534e;">
            <span>⭐</span><span><strong>화장실:</strong> 항균 기능 활용</span>
          </li>
          <li style="display: flex; gap: 0.5rem; margin-bottom: 0.5rem; color: #57534e;">
            <span>•</span><span>어린이 방</span>
          </li>
          <li style="display: flex; gap: 0.5rem; color: #57534e;">
            <span>•</span><span>반려동물 가정</span>
          </li>
        </ul>

        <!-- 8. 스타라이크에보 줄눈 -->
        <h2 id="starlike" style="font-size: 1.5rem; font-weight: 700; color: #1c1917; margin: 2.5rem 0 1rem; padding-top: 1rem; border-top: 1px solid #e7e5e4;">8. 스타라이크에보 줄눈</h2>

        <h3 style="font-size: 1.125rem; font-weight: 700; color: #1c1917; margin: 1.5rem 0 1rem;">스타라이크에보란?</h3>
        <p style="color: #57534e; margin-bottom: 1rem; line-height: 1.8;">스타라이크에보(Starlike Evo)는 <strong style="color: #1c1917;">이탈리아 Litokol사의 최고급 에폭시 줄눈재</strong>입니다. 케라폭시와 함께 프리미엄 시장을 양분하고 있습니다.</p>

        <h3 style="font-size: 1.125rem; font-weight: 700; color: #1c1917; margin: 1.5rem 0 1rem;">특징</h3>
        <ul style="list-style: none; padding: 0; margin: 0 0 1.5rem 0;">
          <li style="display: flex; gap: 0.5rem; margin-bottom: 0.5rem; color: #57534e;">
            <span>•</span><span><strong>3세대 에폭시:</strong> 최신 기술 적용</span>
          </li>
          <li style="display: flex; gap: 0.5rem; margin-bottom: 0.5rem; color: #57534e;">
            <span>•</span><span><strong>무광/유광 선택:</strong> 취향에 맞는 마감</span>
          </li>
          <li style="display: flex; gap: 0.5rem; color: #57534e;">
            <span>•</span><span><strong>색상 유지:</strong> 변색이 거의 없음</span>
          </li>
        </ul>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1.5rem;">
          <div style="background: #dcfce7; padding: 1.25rem; border-radius: 0.75rem;">
            <h4 style="font-weight: 700; color: #166534; margin: 0 0 0.75rem 0;">✅ 장점</h4>
            <ul style="margin: 0; padding-left: 1rem; color: #15803d; font-size: 0.875rem; line-height: 1.8;">
              <li>최고급 품질</li>
              <li>색상 변화 없음</li>
              <li>무광/유광 선택 가능</li>
              <li>화학물질에 강함</li>
            </ul>
          </div>
          <div style="background: #fee2e2; padding: 1.25rem; border-radius: 0.75rem;">
            <h4 style="font-weight: 700; color: #991b1b; margin: 0 0 0.75rem 0;">❌ 단점</h4>
            <ul style="margin: 0; padding-left: 1rem; color: #b91c1c; font-size: 0.875rem; line-height: 1.8;">
              <li>최고가 (케라폭시보다 비쌈)</li>
              <li>시공 전문가 필요</li>
              <li>국내 유통이 제한적</li>
            </ul>
          </div>
        </div>

        <h3 style="font-size: 1.125rem; font-weight: 700; color: #1c1917; margin: 1.5rem 0 1rem;">추천 공간</h3>
        <ul style="list-style: none; padding: 0; margin: 0 0 2rem 0;">
          <li style="display: flex; gap: 0.5rem; margin-bottom: 0.5rem; color: #57534e;">
            <span>•</span><span>프리미엄 인테리어</span>
          </li>
          <li style="display: flex; gap: 0.5rem; margin-bottom: 0.5rem; color: #57534e;">
            <span>•</span><span>호텔, 고급 빌라</span>
          </li>
          <li style="display: flex; gap: 0.5rem; color: #57534e;">
            <span>•</span><span>거실 대리석 타일</span>
          </li>
        </ul>

        <!-- 9. 공간별 추천 줄눈 -->
        <h2 id="space-recommend" style="font-size: 1.5rem; font-weight: 700; color: #1c1917; margin: 2.5rem 0 1rem; padding-top: 1rem; border-top: 1px solid #e7e5e4;">9. 공간별 추천 줄눈</h2>

        <h3 style="font-size: 1.125rem; font-weight: 700; color: #1c1917; margin: 1.5rem 0 1rem;">화장실</h3>
        <div style="overflow-x: auto; margin-bottom: 1.5rem;">
          <table style="width: 100%; border-collapse: collapse; font-size: 0.875rem;">
            <thead>
              <tr style="background: #fef3c7;">
                <th style="padding: 0.75rem; text-align: center; border-bottom: 2px solid #f59e0b;">추천 순위</th>
                <th style="padding: 0.75rem; text-align: left; border-bottom: 2px solid #f59e0b;">줄눈 종류</th>
                <th style="padding: 0.75rem; text-align: left; border-bottom: 2px solid #f59e0b;">이유</th>
              </tr>
            </thead>
            <tbody>
              <tr style="border-bottom: 1px solid #e7e5e4; background: #fffbeb;">
                <td style="padding: 0.75rem; text-align: center; font-weight: 700; color: #f59e0b;">🥇 1위</td>
                <td style="padding: 0.75rem; font-weight: 700;">케라폭시</td>
                <td style="padding: 0.75rem;">최고의 방수, 곰팡이 방지</td>
              </tr>
              <tr style="border-bottom: 1px solid #e7e5e4;">
                <td style="padding: 0.75rem; text-align: center; font-weight: 600;">🥈 2위</td>
                <td style="padding: 0.75rem;">아스팍톤</td>
                <td style="padding: 0.75rem;">항균 기능</td>
              </tr>
              <tr>
                <td style="padding: 0.75rem; text-align: center; font-weight: 600;">🥉 3위</td>
                <td style="padding: 0.75rem;">빅라이언 에폭시</td>
                <td style="padding: 0.75rem;">가성비</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 style="font-size: 1.125rem; font-weight: 700; color: #1c1917; margin: 1.5rem 0 1rem;">거실</h3>
        <div style="overflow-x: auto; margin-bottom: 1.5rem;">
          <table style="width: 100%; border-collapse: collapse; font-size: 0.875rem;">
            <thead>
              <tr style="background: #fef3c7;">
                <th style="padding: 0.75rem; text-align: center; border-bottom: 2px solid #f59e0b;">추천 순위</th>
                <th style="padding: 0.75rem; text-align: left; border-bottom: 2px solid #f59e0b;">줄눈 종류</th>
                <th style="padding: 0.75rem; text-align: left; border-bottom: 2px solid #f59e0b;">이유</th>
              </tr>
            </thead>
            <tbody>
              <tr style="border-bottom: 1px solid #e7e5e4; background: #fffbeb;">
                <td style="padding: 0.75rem; text-align: center; font-weight: 700; color: #f59e0b;">🥇 1위</td>
                <td style="padding: 0.75rem; font-weight: 700;">케라폭시</td>
                <td style="padding: 0.75rem;">내구성, 고급스러운 마감</td>
              </tr>
              <tr>
                <td style="padding: 0.75rem; text-align: center; font-weight: 600;">🥈 2위</td>
                <td style="padding: 0.75rem;">스타라이크에보</td>
                <td style="padding: 0.75rem;">프리미엄 인테리어</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 style="font-size: 1.125rem; font-weight: 700; color: #1c1917; margin: 1.5rem 0 1rem;">현관 / 베란다 / 세탁실</h3>
        <div style="overflow-x: auto; margin-bottom: 2rem;">
          <table style="width: 100%; border-collapse: collapse; font-size: 0.875rem;">
            <thead>
              <tr style="background: #fef3c7;">
                <th style="padding: 0.75rem; text-align: center; border-bottom: 2px solid #f59e0b;">추천 순위</th>
                <th style="padding: 0.75rem; text-align: left; border-bottom: 2px solid #f59e0b;">줄눈 종류</th>
                <th style="padding: 0.75rem; text-align: left; border-bottom: 2px solid #f59e0b;">이유</th>
              </tr>
            </thead>
            <tbody>
              <tr style="border-bottom: 1px solid #e7e5e4; background: #fffbeb;">
                <td style="padding: 0.75rem; text-align: center; font-weight: 700; color: #f59e0b;">🥇 1위</td>
                <td style="padding: 0.75rem; font-weight: 700;">폴리우레아</td>
                <td style="padding: 0.75rem;">가성비, 빠른 시공</td>
              </tr>
              <tr>
                <td style="padding: 0.75rem; text-align: center; font-weight: 600;">🥈 2위</td>
                <td style="padding: 0.75rem;">빅라이언 우레아</td>
                <td style="padding: 0.75rem;">국산 가성비</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- 10. 결론 -->
        <h2 id="conclusion" style="font-size: 1.5rem; font-weight: 700; color: #1c1917; margin: 2.5rem 0 1rem; padding-top: 1rem; border-top: 1px solid #e7e5e4;">10. 결론</h2>

        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; margin-bottom: 2rem;">
          <div style="background: #fef3c7; padding: 1.25rem; border-radius: 0.75rem; text-align: center;">
            <h4 style="font-weight: 700; color: #92400e; margin: 0 0 0.75rem 0; font-size: 0.9375rem;">예산이 충분하다면?</h4>
            <p style="margin: 0; color: #a16207; font-size: 0.875rem;"><strong>케라폭시</strong> 또는<br/><strong>스타라이크에보</strong></p>
          </div>
          <div style="background: #dcfce7; padding: 1.25rem; border-radius: 0.75rem; text-align: center;">
            <h4 style="font-weight: 700; color: #166534; margin: 0 0 0.75rem 0; font-size: 0.9375rem;">가성비를 원한다면?</h4>
            <p style="margin: 0; color: #15803d; font-size: 0.875rem;">화장실: <strong>빅라이언 에폭시</strong><br/>현관/베란다: <strong>폴리우레아</strong></p>
          </div>
          <div style="background: #e0e7ff; padding: 1.25rem; border-radius: 0.75rem; text-align: center;">
            <h4 style="font-weight: 700; color: #3730a3; margin: 0 0 0.75rem 0; font-size: 0.9375rem;">항균이 중요하다면?</h4>
            <p style="margin: 0; color: #4338ca; font-size: 0.875rem;"><strong>아스팍톤</strong></p>
          </div>
        </div>

        <!-- 하우스Pick 추천 -->
        <div style="background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); padding: 2rem; border-radius: 1rem; margin-bottom: 2rem;">
          <h3 style="font-weight: 700; color: #92400e; margin: 0 0 1rem 0; font-size: 1.25rem;">🏠 하우스Pick은?</h3>
          <p style="color: #a16207; margin: 0 0 1rem 0;">저희 하우스Pick은 <strong>공간에 맞는 최적의 줄눈재를 추천</strong>해드립니다.</p>
          <ul style="list-style: none; padding: 0; margin: 0 0 1rem 0;">
            <li style="display: flex; gap: 0.5rem; margin-bottom: 0.5rem; color: #92400e;">
              <span>✅</span><span><strong>화장실:</strong> 케라폭시 (90~100만원)</span>
            </li>
            <li style="display: flex; gap: 0.5rem; margin-bottom: 0.5rem; color: #92400e;">
              <span>✅</span><span><strong>현관/베란다:</strong> 폴리우레아 (5~15만원)</span>
            </li>
            <li style="display: flex; gap: 0.5rem; color: #92400e;">
              <span>✅</span><span><strong>거실:</strong> 케라폭시 (150만원)</span>
            </li>
          </ul>
          <p style="color: #78716c; margin: 0; font-size: 0.875rem;"><strong>정찰제로 가격이 투명합니다.</strong> 추가 비용 없이 딱 이 가격입니다.</p>
        </div>

        <!-- 상담 CTA -->
        <div style="background: white; border: 2px solid #f59e0b; padding: 2rem; border-radius: 1rem; text-align: center;">
          <h3 style="font-weight: 700; color: #1c1917; margin: 0 0 1rem 0; font-size: 1.25rem;">📞 무료 상담 받기</h3>
          <p style="color: #57534e; margin: 0 0 1.5rem 0;">줄눈 종류 선택이 어려우시다면, 전문 상담을 받아보세요.<br/>공간과 예산에 맞는 최적의 줄눈을 추천해드립니다.</p>
          <div style="display: flex; flex-direction: column; gap: 0.75rem; align-items: center;">
            <a href="tel:010-6461-0131" style="display: inline-flex; align-items: center; gap: 0.5rem; background: #f59e0b; color: white; padding: 0.75rem 1.5rem; border-radius: 9999px; text-decoration: none; font-weight: 600;">
              📞 010-6461-0131
            </a>
            <span style="color: #78716c; font-size: 0.875rem;">💬 채널톡 상담</span>
          </div>
        </div>

        <p style="color: #a8a29e; font-size: 0.75rem; text-align: center; margin-top: 2rem;">최종 업데이트: 2025년 1월</p>`
}

// Bathroom 페이지 SSG 콘텐츠
function generateBathroomSSGContent() {
  return `
        <!-- 도입부 -->
        <div style="background: #f5f5f4; padding: 1.5rem; border-radius: 1rem; margin-bottom: 2rem; font-size: 1rem; color: #57534e; line-height: 1.8;">
          <p style="margin: 0 0 0.5rem 0;">화장실 줄눈, 꼭 해야 하나요?</p>
          <p style="margin: 0 0 0.5rem 0;">비용은 얼마나 들까요?</p>
          <p style="margin: 0 0 0.5rem 0;">신축이랑 구축 차이가 있나요?</p>
          <p style="margin: 1rem 0 0 0;"><strong style="color: #1c1917;">화장실 줄눈시공에 대한 모든 궁금증을 해결해드립니다.</strong></p>
        </div>

        <!-- 목차 -->
        <div style="background: white; border: 1px solid #e7e5e4; border-radius: 1rem; padding: 1.5rem; margin-bottom: 2rem;">
          <h3 style="font-weight: 700; color: #1c1917; margin: 0 0 1rem 0; font-size: 1rem;">📋 목차</h3>
          <ol style="margin: 0; padding-left: 1.25rem; color: #57534e; line-height: 2; columns: 2;">
            <li><a href="#what-is" style="color: #f59e0b; text-decoration: none;">화장실 줄눈이란?</a></li>
            <li><a href="#why" style="color: #f59e0b; text-decoration: none;">왜 해야 하나요?</a></li>
            <li><a href="#new-vs-old" style="color: #f59e0b; text-decoration: none;">신축 vs 구축 차이점</a></li>
            <li><a href="#price" style="color: #f59e0b; text-decoration: none;">가격</a></li>
            <li><a href="#process" style="color: #f59e0b; text-decoration: none;">시공 과정</a></li>
            <li><a href="#material" style="color: #f59e0b; text-decoration: none;">추천 자재</a></li>
            <li><a href="#checklist" style="color: #f59e0b; text-decoration: none;">시공 전 체크리스트</a></li>
            <li><a href="#aftercare" style="color: #f59e0b; text-decoration: none;">시공 후 관리법</a></li>
            <li><a href="#faq" style="color: #f59e0b; text-decoration: none;">자주 묻는 질문</a></li>
          </ol>
        </div>

        <!-- 1. 화장실 줄눈이란? -->
        <h2 id="what-is" style="font-size: 1.5rem; font-weight: 700; color: #1c1917; margin: 2.5rem 0 1rem; padding-top: 1rem; border-top: 1px solid #e7e5e4;">1. 화장실 줄눈이란?</h2>
        <p style="color: #57534e; margin-bottom: 1rem; line-height: 1.8;">화장실 줄눈시공은 <strong style="color: #1c1917;">타일과 타일 사이의 틈새를 메우는 작업</strong>입니다.</p>
        <p style="color: #57534e; margin-bottom: 1rem; line-height: 1.8;">새 아파트에는 보통 "백시멘트"라는 하얀 재료로 채워져 있는데, 이건 시간이 지나면 누렇게 변색되고 곰팡이가 생깁니다.</p>
        <p style="color: #57534e; margin-bottom: 2rem; line-height: 1.8;">이 백시멘트를 <strong style="color: #f59e0b;">전문 줄눈재(케라폭시 등)</strong>로 교체하는 것이 줄눈시공입니다.</p>

        <!-- 2. 왜 해야 하나요? -->
        <h2 id="why" style="font-size: 1.5rem; font-weight: 700; color: #1c1917; margin: 2.5rem 0 1rem; padding-top: 1rem; border-top: 1px solid #e7e5e4;">2. 화장실 줄눈 왜 해야 하나요?</h2>

        <h3 style="font-size: 1.125rem; font-weight: 700; color: #1c1917; margin: 1.5rem 0 1rem;">줄눈시공을 안 하면 생기는 문제</h3>
        <div style="overflow-x: auto; margin-bottom: 1.5rem;">
          <table style="width: 100%; border-collapse: collapse; font-size: 0.875rem;">
            <thead>
              <tr style="background: #fee2e2;">
                <th style="padding: 0.75rem; text-align: left; border-bottom: 2px solid #fca5a5;">시간</th>
                <th style="padding: 0.75rem; text-align: left; border-bottom: 2px solid #fca5a5;">발생하는 문제</th>
              </tr>
            </thead>
            <tbody>
              <tr style="border-bottom: 1px solid #e7e5e4;">
                <td style="padding: 0.75rem; font-weight: 600;">6개월</td>
                <td style="padding: 0.75rem;">백시멘트 변색 시작</td>
              </tr>
              <tr style="border-bottom: 1px solid #e7e5e4;">
                <td style="padding: 0.75rem; font-weight: 600;">1년</td>
                <td style="padding: 0.75rem;">곰팡이 발생</td>
              </tr>
              <tr style="border-bottom: 1px solid #e7e5e4;">
                <td style="padding: 0.75rem; font-weight: 600;">2년</td>
                <td style="padding: 0.75rem;">검은 때 축적, 냄새</td>
              </tr>
              <tr>
                <td style="padding: 0.75rem; font-weight: 600;">3년+</td>
                <td style="padding: 0.75rem; color: #dc2626;">타일 틈새 벌어짐, 물 침투</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 style="font-size: 1.125rem; font-weight: 700; color: #1c1917; margin: 1.5rem 0 1rem;">줄눈시공 후 달라지는 점</h3>
        <div style="background: #dcfce7; padding: 1.25rem; border-radius: 0.75rem; margin-bottom: 1.5rem;">
          <ul style="margin: 0; padding-left: 1.25rem; color: #15803d; line-height: 1.8;">
            <li><strong>곰팡이 원천 차단:</strong> 케라폭시는 곰팡이가 자랄 수 없는 환경</li>
            <li><strong>변색 없음:</strong> 10년 이상 처음 그대로 유지</li>
            <li><strong>청소 쉬움:</strong> 물만 뿌려도 깨끗</li>
            <li><strong>냄새 방지:</strong> 이물질이 끼지 않아 냄새 없음</li>
            <li><strong>집값 상승:</strong> 깔끔한 화장실 = 집 가치 상승</li>
          </ul>
        </div>

        <h3 style="font-size: 1.125rem; font-weight: 700; color: #1c1917; margin: 1.5rem 0 1rem;">Before & After</h3>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 2rem;">
          <div style="background: #fee2e2; padding: 1.25rem; border-radius: 0.75rem;">
            <h4 style="font-weight: 700; color: #991b1b; margin: 0 0 0.75rem 0;">Before (백시멘트)</h4>
            <ul style="margin: 0; padding-left: 1rem; color: #b91c1c; font-size: 0.875rem;">
              <li>누렇게 변색</li>
              <li>검은 곰팡이</li>
              <li>지저분한 틈새</li>
            </ul>
          </div>
          <div style="background: #dcfce7; padding: 1.25rem; border-radius: 0.75rem;">
            <h4 style="font-weight: 700; color: #166534; margin: 0 0 0.75rem 0;">After (케라폭시)</h4>
            <ul style="margin: 0; padding-left: 1rem; color: #15803d; font-size: 0.875rem;">
              <li>깔끔한 흰색/회색 유지</li>
              <li>곰팡이 없음</li>
              <li>반짝이는 고급스러운 마감</li>
            </ul>
          </div>
        </div>

        <!-- 3. 신축 vs 구축 차이점 -->
        <h2 id="new-vs-old" style="font-size: 1.5rem; font-weight: 700; color: #1c1917; margin: 2.5rem 0 1rem; padding-top: 1rem; border-top: 1px solid #e7e5e4;">3. 신축 vs 구축 차이점</h2>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1.5rem;">
          <div style="background: #e0f2fe; padding: 1.25rem; border-radius: 0.75rem;">
            <h4 style="font-weight: 700; color: #0369a1; margin: 0 0 0.75rem 0;">🏠 신축 화장실</h4>
            <p style="margin: 0 0 0.5rem 0; color: #0c4a6e; font-size: 0.875rem;"><strong>정의:</strong> 새 아파트 입주 전/후 (1년 이내)</p>
            <ul style="margin: 0.5rem 0; padding-left: 1rem; color: #0369a1; font-size: 0.875rem;">
              <li>백시멘트 상태 양호</li>
              <li>곰팡이 없음</li>
              <li>기존 줄눈 제거 쉬움</li>
            </ul>
            <p style="margin: 0.5rem 0 0 0; color: #0c4a6e; font-size: 0.875rem;"><strong>추천 시기:</strong> 입주 전이 가장 좋음</p>
          </div>
          <div style="background: #fef3c7; padding: 1.25rem; border-radius: 0.75rem;">
            <h4 style="font-weight: 700; color: #92400e; margin: 0 0 0.75rem 0;">🏚️ 구축 화장실</h4>
            <p style="margin: 0 0 0.5rem 0; color: #78350f; font-size: 0.875rem;"><strong>정의:</strong> 거주 중인 집 (1년 이상)</p>
            <ul style="margin: 0.5rem 0; padding-left: 1rem; color: #a16207; font-size: 0.875rem;">
              <li>기존 줄눈 변색/오염</li>
              <li>곰팡이 있을 수 있음</li>
              <li>기존 줄눈 제거 작업 필요</li>
            </ul>
            <p style="margin: 0.5rem 0 0 0; color: #78350f; font-size: 0.875rem;"><strong>추천 시기:</strong> 곰팡이 보이면 바로</p>
          </div>
        </div>

        <h3 style="font-size: 1.125rem; font-weight: 700; color: #1c1917; margin: 1.5rem 0 1rem;">비교표</h3>
        <div style="overflow-x: auto; margin-bottom: 2rem;">
          <table style="width: 100%; border-collapse: collapse; font-size: 0.875rem;">
            <thead>
              <tr style="background: #fef3c7;">
                <th style="padding: 0.75rem; text-align: left; border-bottom: 2px solid #f59e0b;">항목</th>
                <th style="padding: 0.75rem; text-align: center; border-bottom: 2px solid #f59e0b;">신축</th>
                <th style="padding: 0.75rem; text-align: center; border-bottom: 2px solid #f59e0b;">구축</th>
              </tr>
            </thead>
            <tbody>
              <tr style="border-bottom: 1px solid #e7e5e4;">
                <td style="padding: 0.75rem;">상태</td>
                <td style="padding: 0.75rem; text-align: center; color: #16a34a;">깨끗</td>
                <td style="padding: 0.75rem; text-align: center; color: #dc2626;">오염/변색</td>
              </tr>
              <tr style="border-bottom: 1px solid #e7e5e4;">
                <td style="padding: 0.75rem;">작업량</td>
                <td style="padding: 0.75rem; text-align: center;">적음</td>
                <td style="padding: 0.75rem; text-align: center;">많음</td>
              </tr>
              <tr style="border-bottom: 1px solid #e7e5e4;">
                <td style="padding: 0.75rem;">시간</td>
                <td style="padding: 0.75rem; text-align: center;">2~3시간</td>
                <td style="padding: 0.75rem; text-align: center;">3~4시간</td>
              </tr>
              <tr style="border-bottom: 1px solid #e7e5e4;">
                <td style="padding: 0.75rem;">바닥</td>
                <td style="padding: 0.75rem; text-align: center; font-weight: 600; color: #f59e0b;">30만원</td>
                <td style="padding: 0.75rem; text-align: center; font-weight: 600; color: #f59e0b;">35만원</td>
              </tr>
              <tr>
                <td style="padding: 0.75rem;">전체</td>
                <td style="padding: 0.75rem; text-align: center; font-weight: 600; color: #f59e0b;">90만원</td>
                <td style="padding: 0.75rem; text-align: center; font-weight: 600; color: #f59e0b;">100만원</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- 4. 가격 -->
        <h2 id="price" style="font-size: 1.5rem; font-weight: 700; color: #1c1917; margin: 2.5rem 0 1rem; padding-top: 1rem; border-top: 1px solid #e7e5e4;">4. 화장실 줄눈시공 가격</h2>

        <h3 style="font-size: 1.125rem; font-weight: 700; color: #1c1917; margin: 1.5rem 0 1rem;">💰 하우스Pick 정찰제 가격표</h3>

        <h4 style="font-size: 1rem; font-weight: 700; color: #57534e; margin: 1.25rem 0 0.75rem;">욕조 화장실</h4>
        <div style="overflow-x: auto; margin-bottom: 1rem;">
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
                <td style="padding: 0.75rem; text-align: center; font-weight: 700; color: #f59e0b;">30만원</td>
                <td style="padding: 0.75rem; text-align: center; font-weight: 700; color: #f59e0b;">35만원</td>
              </tr>
              <tr style="border-bottom: 1px solid #e7e5e4;">
                <td style="padding: 0.75rem;">벽 3면 추가</td>
                <td style="padding: 0.75rem; text-align: center;">+35만원</td>
                <td style="padding: 0.75rem; text-align: center;">+35만원</td>
              </tr>
              <tr style="background: #fffbeb;">
                <td style="padding: 0.75rem; font-weight: 600;">전체 (바닥+벽)</td>
                <td style="padding: 0.75rem; text-align: center; font-weight: 700; color: #f59e0b;">90만원</td>
                <td style="padding: 0.75rem; text-align: center; font-weight: 700; color: #f59e0b;">100만원</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h4 style="font-size: 1rem; font-weight: 700; color: #57534e; margin: 1.25rem 0 0.75rem;">샤워부스 화장실</h4>
        <div style="overflow-x: auto; margin-bottom: 1.5rem;">
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
                <td style="padding: 0.75rem; text-align: center; font-weight: 700; color: #f59e0b;">35만원</td>
                <td style="padding: 0.75rem; text-align: center; font-weight: 700; color: #f59e0b;">40만원</td>
              </tr>
              <tr style="border-bottom: 1px solid #e7e5e4;">
                <td style="padding: 0.75rem;">벽 3면 추가</td>
                <td style="padding: 0.75rem; text-align: center;">+35만원</td>
                <td style="padding: 0.75rem; text-align: center;">+35만원</td>
              </tr>
              <tr style="background: #fffbeb;">
                <td style="padding: 0.75rem; font-weight: 600;">전체 (바닥+벽)</td>
                <td style="padding: 0.75rem; text-align: center; font-weight: 700; color: #f59e0b;">95만원</td>
                <td style="padding: 0.75rem; text-align: center; font-weight: 700; color: #f59e0b;">105만원</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div style="background: #dcfce7; padding: 1.5rem; border-radius: 1rem; border: 1px solid #86efac; margin-bottom: 1rem;">
          <h4 style="font-weight: 700; color: #166534; margin: 0 0 0.75rem 0;">✅ 가격에 포함된 것</h4>
          <ul style="color: #15803d; margin: 0; padding-left: 1.25rem;">
            <li>케라폭시 자재비</li>
            <li>시공 인건비</li>
            <li>기존 줄눈 제거 (구축)</li>
            <li><strong>5년 무상 A/S</strong></li>
          </ul>
        </div>
        <div style="background: #fee2e2; padding: 1.5rem; border-radius: 1rem; border: 1px solid #fca5a5; margin-bottom: 2rem;">
          <h4 style="font-weight: 700; color: #991b1b; margin: 0 0 0.5rem 0;">❌ 추가 비용?</h4>
          <p style="color: #b91c1c; margin: 0;"><strong>없습니다!</strong> 하우스Pick은 정찰제입니다. 위 가격이 최종 가격입니다. 현장에서 추가 비용 요구 절대 없습니다.</p>
        </div>

        <!-- 5. 시공 과정 -->
        <h2 id="process" style="font-size: 1.5rem; font-weight: 700; color: #1c1917; margin: 2.5rem 0 1rem; padding-top: 1rem; border-top: 1px solid #e7e5e4;">5. 시공 과정</h2>

        <!-- Step 1 -->
        <div style="background: white; border: 1px solid #e7e5e4; border-radius: 1rem; padding: 1.5rem; margin-bottom: 1rem;">
          <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 1rem;">
            <span style="background: #f59e0b; color: white; width: 2.5rem; height: 2.5rem; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700; flex-shrink: 0; font-size: 1.125rem;">1</span>
            <h4 style="font-weight: 700; color: #1c1917; margin: 0;">현장 확인 (10분)</h4>
          </div>
          <ul style="margin: 0; padding-left: 1.5rem; color: #57534e; line-height: 1.8;">
            <li>타일 종류 및 상태 확인</li>
            <li>기존 줄눈 상태 체크</li>
            <li>시공 범위 최종 확인</li>
          </ul>
        </div>

        <!-- Step 2 -->
        <div style="background: white; border: 1px solid #e7e5e4; border-radius: 1rem; padding: 1.5rem; margin-bottom: 1rem;">
          <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 1rem;">
            <span style="background: #f59e0b; color: white; width: 2.5rem; height: 2.5rem; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700; flex-shrink: 0; font-size: 1.125rem;">2</span>
            <h4 style="font-weight: 700; color: #1c1917; margin: 0;">기존 줄눈 제거 (30분~1시간)</h4>
          </div>
          <ul style="margin: 0 0 1rem 0; padding-left: 1.5rem; color: #57534e; line-height: 1.8;">
            <li>전용 기계로 백시멘트 제거</li>
            <li>손상 없이 깔끔하게 제거</li>
            <li>구축의 경우 곰팡이까지 완전 제거</li>
          </ul>
          <div style="background: #fef3c7; padding: 0.75rem 1rem; border-radius: 0.5rem;">
            <p style="margin: 0; color: #92400e; font-size: 0.875rem;"><strong>💡 중요:</strong> 기계 제거가 핵심입니다. 손으로 대충 긁어내면 새 줄눈이 안 붙습니다.</p>
          </div>
        </div>

        <!-- Step 3 -->
        <div style="background: white; border: 1px solid #e7e5e4; border-radius: 1rem; padding: 1.5rem; margin-bottom: 1rem;">
          <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 1rem;">
            <span style="background: #f59e0b; color: white; width: 2.5rem; height: 2.5rem; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700; flex-shrink: 0; font-size: 1.125rem;">3</span>
            <h4 style="font-weight: 700; color: #1c1917; margin: 0;">청소 및 건조 (20분)</h4>
          </div>
          <ul style="margin: 0; padding-left: 1.5rem; color: #57534e; line-height: 1.8;">
            <li>먼지 및 이물질 제거</li>
            <li>물기 완전 건조</li>
            <li>접착력 확보</li>
          </ul>
        </div>

        <!-- Step 4 -->
        <div style="background: white; border: 1px solid #e7e5e4; border-radius: 1rem; padding: 1.5rem; margin-bottom: 1rem;">
          <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 1rem;">
            <span style="background: #f59e0b; color: white; width: 2.5rem; height: 2.5rem; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700; flex-shrink: 0; font-size: 1.125rem;">4</span>
            <h4 style="font-weight: 700; color: #1c1917; margin: 0;">케라폭시 시공 (1~2시간)</h4>
          </div>
          <ul style="margin: 0 0 1rem 0; padding-left: 1.5rem; color: #57534e; line-height: 1.8;">
            <li>2액형 에폭시 정확한 비율로 배합</li>
            <li>틈새에 빈틈없이 채움</li>
            <li>표면 깔끔하게 정리</li>
          </ul>
          <div style="background: #fef3c7; padding: 0.75rem 1rem; border-radius: 0.5rem;">
            <p style="margin: 0; color: #92400e; font-size: 0.875rem;"><strong>💡 중요:</strong> 배합 비율이 틀리면 굳지 않거나 갈라집니다. 반드시 전문가가 시공해야 합니다.</p>
          </div>
        </div>

        <!-- Step 5 -->
        <div style="background: white; border: 1px solid #e7e5e4; border-radius: 1rem; padding: 1.5rem; margin-bottom: 1.5rem;">
          <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 1rem;">
            <span style="background: #f59e0b; color: white; width: 2.5rem; height: 2.5rem; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700; flex-shrink: 0; font-size: 1.125rem;">5</span>
            <h4 style="font-weight: 700; color: #1c1917; margin: 0;">마무리 및 경화 (24시간)</h4>
          </div>
          <ul style="margin: 0; padding-left: 1.5rem; color: #57534e; line-height: 1.8;">
            <li>잔여물 제거</li>
            <li>타일 표면 깨끗하게 닦기</li>
            <li><strong>24시간 경화</strong> (물 사용 금지)</li>
          </ul>
        </div>

        <h3 style="font-size: 1.125rem; font-weight: 700; color: #1c1917; margin: 1.5rem 0 1rem;">전체 소요 시간</h3>
        <div style="overflow-x: auto; margin-bottom: 2rem;">
          <table style="width: 100%; border-collapse: collapse; font-size: 0.875rem;">
            <thead>
              <tr style="background: #f5f5f4;">
                <th style="padding: 0.75rem; text-align: left; border-bottom: 2px solid #d6d3d1;">구분</th>
                <th style="padding: 0.75rem; text-align: center; border-bottom: 2px solid #d6d3d1;">시공 시간</th>
                <th style="padding: 0.75rem; text-align: center; border-bottom: 2px solid #d6d3d1;">사용 가능</th>
              </tr>
            </thead>
            <tbody>
              <tr style="border-bottom: 1px solid #e7e5e4;">
                <td style="padding: 0.75rem;">바닥만</td>
                <td style="padding: 0.75rem; text-align: center;">2시간</td>
                <td style="padding: 0.75rem; text-align: center;">24시간 후</td>
              </tr>
              <tr>
                <td style="padding: 0.75rem;">전체</td>
                <td style="padding: 0.75rem; text-align: center;">3~4시간</td>
                <td style="padding: 0.75rem; text-align: center;">24시간 후</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- 6. 추천 자재 -->
        <h2 id="material" style="font-size: 1.5rem; font-weight: 700; color: #1c1917; margin: 2.5rem 0 1rem; padding-top: 1rem; border-top: 1px solid #e7e5e4;">6. 추천 줄눈 자재</h2>

        <h3 style="font-size: 1.125rem; font-weight: 700; color: #1c1917; margin: 1.5rem 0 1rem;">화장실에는 케라폭시!</h3>
        <p style="color: #57534e; margin-bottom: 1rem; line-height: 1.8;">화장실은 <strong style="color: #1c1917;">습기가 많고 물을 자주 사용</strong>하는 공간입니다. 따라서 <strong style="color: #f59e0b;">방수력이 최고인 케라폭시</strong>를 추천합니다.</p>

        <h3 style="font-size: 1.125rem; font-weight: 700; color: #1c1917; margin: 1.5rem 0 1rem;">왜 케라폭시인가?</h3>
        <div style="overflow-x: auto; margin-bottom: 1.5rem;">
          <table style="width: 100%; border-collapse: collapse; font-size: 0.875rem;">
            <thead>
              <tr style="background: #fef3c7;">
                <th style="padding: 0.75rem; text-align: left; border-bottom: 2px solid #f59e0b;">항목</th>
                <th style="padding: 0.75rem; text-align: center; border-bottom: 2px solid #f59e0b;">백시멘트</th>
                <th style="padding: 0.75rem; text-align: center; border-bottom: 2px solid #f59e0b;">일반 줄눈</th>
                <th style="padding: 0.75rem; text-align: center; border-bottom: 2px solid #f59e0b;">케라폭시</th>
              </tr>
            </thead>
            <tbody>
              <tr style="border-bottom: 1px solid #e7e5e4;">
                <td style="padding: 0.75rem;">방수</td>
                <td style="padding: 0.75rem; text-align: center; color: #dc2626;">❌</td>
                <td style="padding: 0.75rem; text-align: center; color: #f59e0b;">△</td>
                <td style="padding: 0.75rem; text-align: center; color: #16a34a;">⭐ 최고</td>
              </tr>
              <tr style="border-bottom: 1px solid #e7e5e4;">
                <td style="padding: 0.75rem;">곰팡이</td>
                <td style="padding: 0.75rem; text-align: center; color: #dc2626;">많음</td>
                <td style="padding: 0.75rem; text-align: center;">보통</td>
                <td style="padding: 0.75rem; text-align: center; color: #16a34a;">⭐ 거의 없음</td>
              </tr>
              <tr style="border-bottom: 1px solid #e7e5e4;">
                <td style="padding: 0.75rem;">변색</td>
                <td style="padding: 0.75rem; text-align: center; color: #dc2626;">심함</td>
                <td style="padding: 0.75rem; text-align: center;">보통</td>
                <td style="padding: 0.75rem; text-align: center; color: #16a34a;">⭐ 없음</td>
              </tr>
              <tr>
                <td style="padding: 0.75rem;">내구성</td>
                <td style="padding: 0.75rem; text-align: center;">1~2년</td>
                <td style="padding: 0.75rem; text-align: center;">3~5년</td>
                <td style="padding: 0.75rem; text-align: center; color: #16a34a; font-weight: 600;">⭐ 10년+</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div style="background: #fef3c7; padding: 1rem; border-radius: 0.75rem; margin-bottom: 2rem;">
          <p style="margin: 0; color: #92400e;"><strong>💡 하우스Pick은 화장실에 100% 케라폭시만 사용합니다.</strong></p>
        </div>

        <!-- 7. 시공 전 체크리스트 -->
        <h2 id="checklist" style="font-size: 1.5rem; font-weight: 700; color: #1c1917; margin: 2.5rem 0 1rem; padding-top: 1rem; border-top: 1px solid #e7e5e4;">7. 시공 전 체크리스트</h2>

        <h3 style="font-size: 1.125rem; font-weight: 700; color: #1c1917; margin: 1.5rem 0 1rem;">✅ 준비사항</h3>
        <div style="overflow-x: auto; margin-bottom: 1.5rem;">
          <table style="width: 100%; border-collapse: collapse; font-size: 0.875rem;">
            <thead>
              <tr style="background: #dcfce7;">
                <th style="padding: 0.75rem; text-align: left; border-bottom: 2px solid #86efac;">항목</th>
                <th style="padding: 0.75rem; text-align: left; border-bottom: 2px solid #86efac;">내용</th>
              </tr>
            </thead>
            <tbody>
              <tr style="border-bottom: 1px solid #e7e5e4;">
                <td style="padding: 0.75rem;">☐ 물건 치우기</td>
                <td style="padding: 0.75rem;">화장실 내 모든 물건 빼기</td>
              </tr>
              <tr style="border-bottom: 1px solid #e7e5e4;">
                <td style="padding: 0.75rem;">☐ 변기 주변</td>
                <td style="padding: 0.75rem;">변기 뒤, 옆 접근 가능하게</td>
              </tr>
              <tr style="border-bottom: 1px solid #e7e5e4;">
                <td style="padding: 0.75rem;">☐ 환기</td>
                <td style="padding: 0.75rem;">창문 열어두기</td>
              </tr>
              <tr style="border-bottom: 1px solid #e7e5e4;">
                <td style="padding: 0.75rem;">☐ 다른 화장실</td>
                <td style="padding: 0.75rem;">24시간 동안 다른 화장실 사용 준비</td>
              </tr>
              <tr>
                <td style="padding: 0.75rem;">☐ 주차</td>
                <td style="padding: 0.75rem;">시공 차량 주차 공간</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 style="font-size: 1.125rem; font-weight: 700; color: #dc2626; margin: 1.5rem 0 1rem;">⚠️ 주의사항</h3>
        <div style="background: #fee2e2; padding: 1.25rem; border-radius: 0.75rem; margin-bottom: 2rem;">
          <ul style="margin: 0; padding-left: 1.25rem; color: #b91c1c;">
            <li>❌ 시공 당일 해당 화장실 물 사용 금지</li>
            <li>❌ 24시간 내 샤워 금지</li>
            <li>❌ 반려동물 접근 금지 (경화 전)</li>
            <li>❌ 환기 안 되면 시공 불가</li>
          </ul>
        </div>

        <!-- 8. 시공 후 관리법 -->
        <h2 id="aftercare" style="font-size: 1.5rem; font-weight: 700; color: #1c1917; margin: 2.5rem 0 1rem; padding-top: 1rem; border-top: 1px solid #e7e5e4;">8. 시공 후 관리법</h2>

        <h3 style="font-size: 1.125rem; font-weight: 700; color: #1c1917; margin: 1.5rem 0 1rem;">경화 시간</h3>
        <div style="overflow-x: auto; margin-bottom: 1.5rem;">
          <table style="width: 100%; border-collapse: collapse; font-size: 0.875rem;">
            <thead>
              <tr style="background: #f5f5f4;">
                <th style="padding: 0.75rem; text-align: left; border-bottom: 2px solid #d6d3d1;">시간</th>
                <th style="padding: 0.75rem; text-align: left; border-bottom: 2px solid #d6d3d1;">상태</th>
                <th style="padding: 0.75rem; text-align: left; border-bottom: 2px solid #d6d3d1;">가능한 것</th>
              </tr>
            </thead>
            <tbody>
              <tr style="border-bottom: 1px solid #e7e5e4;">
                <td style="padding: 0.75rem;">0~6시간</td>
                <td style="padding: 0.75rem;">경화 중</td>
                <td style="padding: 0.75rem; color: #dc2626;">❌ 접촉 금지</td>
              </tr>
              <tr style="border-bottom: 1px solid #e7e5e4;">
                <td style="padding: 0.75rem;">6~12시간</td>
                <td style="padding: 0.75rem;">표면 경화</td>
                <td style="padding: 0.75rem; color: #f59e0b;">△ 가벼운 발걸음</td>
              </tr>
              <tr style="border-bottom: 1px solid #e7e5e4;">
                <td style="padding: 0.75rem;">12~24시간</td>
                <td style="padding: 0.75rem;">거의 완료</td>
                <td style="padding: 0.75rem; color: #f59e0b;">△ 조심해서 사용</td>
              </tr>
              <tr>
                <td style="padding: 0.75rem;">24시간+</td>
                <td style="padding: 0.75rem;">완전 경화</td>
                <td style="padding: 0.75rem; color: #16a34a;">✅ 정상 사용</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 style="font-size: 1.125rem; font-weight: 700; color: #1c1917; margin: 1.5rem 0 1rem;">일상 관리</h3>
        <ul style="list-style: none; padding: 0; margin: 0 0 1.5rem 0;">
          <li style="display: flex; gap: 0.5rem; margin-bottom: 0.5rem; color: #57534e;">
            <span>•</span><span><strong>청소:</strong> 일반 욕실 세정제 OK</span>
          </li>
          <li style="display: flex; gap: 0.5rem; margin-bottom: 0.5rem; color: #57534e;">
            <span>•</span><span><strong>도구:</strong> 부드러운 스펀지 사용</span>
          </li>
          <li style="display: flex; gap: 0.5rem; color: #57534e;">
            <span>•</span><span><strong>주기:</strong> 일주일 1회 닦기면 충분</span>
          </li>
        </ul>

        <h3 style="font-size: 1.125rem; font-weight: 700; color: #dc2626; margin: 1.5rem 0 1rem;">하면 안 되는 것</h3>
        <div style="background: #fee2e2; padding: 1rem; border-radius: 0.75rem; margin-bottom: 1.5rem;">
          <ul style="margin: 0; padding-left: 1.25rem; color: #b91c1c;">
            <li>❌ 락스 원액 직접 뿌리기</li>
            <li>❌ 철 수세미로 문지르기</li>
            <li>❌ 고압 스팀 청소기</li>
          </ul>
        </div>

        <h3 style="font-size: 1.125rem; font-weight: 700; color: #1c1917; margin: 1.5rem 0 1rem;">오래 유지하는 팁</h3>
        <div style="background: #dcfce7; padding: 1.25rem; border-radius: 0.75rem; margin-bottom: 2rem;">
          <ol style="margin: 0; padding-left: 1.25rem; color: #15803d; line-height: 1.8;">
            <li><strong>환기 잘 시키기:</strong> 샤워 후 환풍기 10분</li>
            <li><strong>물기 제거:</strong> 스퀴지로 벽면 물기 제거</li>
            <li><strong>정기 청소:</strong> 일주일 1회 중성세제</li>
          </ol>
        </div>

        <!-- 9. 자주 묻는 질문 -->
        <h2 id="faq" style="font-size: 1.5rem; font-weight: 700; color: #1c1917; margin: 2.5rem 0 1rem; padding-top: 1rem; border-top: 1px solid #e7e5e4;">9. 자주 묻는 질문</h2>

        <div class="prerender-faq-item" style="margin-bottom: 1rem;">
          <div class="prerender-faq-question">Q1. 시공 시간은 얼마나 걸리나요?</div>
          <div class="prerender-faq-answer">화장실 1개 기준으로 바닥만은 약 2시간, 전체(바닥+벽)는 약 3~4시간, 화장실 2개는 약 5~6시간 소요됩니다.</div>
        </div>

        <div class="prerender-faq-item" style="margin-bottom: 1rem;">
          <div class="prerender-faq-question">Q2. 시공 후 바로 사용할 수 있나요?</div>
          <div class="prerender-faq-answer">아니요. <strong>24시간 경화 시간</strong>이 필요합니다. 6시간 후 가벼운 발걸음은 가능하고, 24시간 후 정상 사용, 완전 경화는 48시간입니다.</div>
        </div>

        <div class="prerender-faq-item" style="margin-bottom: 1rem;">
          <div class="prerender-faq-question">Q3. 신축인데 꼭 해야 하나요?</div>
          <div class="prerender-faq-answer"><strong>강력 추천합니다.</strong> 새 아파트의 백시멘트는 6개월~1년 내 변색됩니다. 입주 전에 하면 가격도 더 저렴하고, 처음부터 깨끗하게 유지할 수 있습니다.</div>
        </div>

        <div class="prerender-faq-item" style="margin-bottom: 1rem;">
          <div class="prerender-faq-question">Q4. 곰팡이가 다시 생기나요?</div>
          <div class="prerender-faq-answer">케라폭시 시공 후에는 <strong>거의 생기지 않습니다.</strong> 케라폭시는 수분을 흡수하지 않아 곰팡이가 자랄 환경이 안 됩니다. 다만, 환기를 전혀 안 하면 타일 표면에 생길 수 있습니다.</div>
        </div>

        <div class="prerender-faq-item" style="margin-bottom: 1rem;">
          <div class="prerender-faq-question">Q5. A/S는 어떻게 되나요?</div>
          <div class="prerender-faq-answer"><strong>5년 무상 A/S</strong>입니다. 탈락/들뜸/변색(시공 불량)은 무상 재시공해드립니다. 사진 찍어서 카톡으로 보내주시면 확인 후 방문합니다.</div>
        </div>

        <div class="prerender-faq-item" style="margin-bottom: 2rem;">
          <div class="prerender-faq-question">Q6. 다른 업체보다 비싼 것 같은데요?</div>
          <div class="prerender-faq-answer">하우스Pick 가격에는 <strong>모든 것이 포함</strong>되어 있습니다. 케라폭시 자재(최고급), 기계 제거 작업, 5년 무상 A/S까지. 싼 업체는 일반 줄눈 사용(2~3년 후 다시 시공), A/S 없음, 현장에서 추가금 요구합니다. <strong>처음 제대로 하는 게 결국 더 저렴합니다.</strong></div>
        </div>

        <!-- 하우스Pick 소개 -->
        <div style="background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); padding: 2rem; border-radius: 1rem; margin-bottom: 2rem;">
          <h3 style="font-weight: 700; color: #92400e; margin: 0 0 1rem 0; font-size: 1.25rem;">🏠 화장실 줄눈, 하우스Pick</h3>
          <div style="overflow-x: auto; margin-bottom: 1rem;">
            <table style="width: 100%; border-collapse: collapse; font-size: 0.875rem; background: white; border-radius: 0.5rem;">
              <tbody>
                <tr style="border-bottom: 1px solid #e7e5e4;">
                  <td style="padding: 0.75rem; font-weight: 600;">정찰제</td>
                  <td style="padding: 0.75rem;">가격표 그대로, 추가 비용 없음</td>
                </tr>
                <tr style="border-bottom: 1px solid #e7e5e4;">
                  <td style="padding: 0.75rem; font-weight: 600;">케라폭시 100%</td>
                  <td style="padding: 0.75rem;">화장실엔 최고급만 사용</td>
                </tr>
                <tr style="border-bottom: 1px solid #e7e5e4;">
                  <td style="padding: 0.75rem; font-weight: 600;">기계 제거</td>
                  <td style="padding: 0.75rem;">대충 덧칠 ❌, 확실한 제거</td>
                </tr>
                <tr>
                  <td style="padding: 0.75rem; font-weight: 600;">5년 A/S</td>
                  <td style="padding: 0.75rem;">업계 최장 보증 기간</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div style="text-align: center;">
            <p style="color: #78716c; font-size: 0.875rem; margin: 0 0 0.5rem 0;">바닥만: 신축 30만원 / 구축 35만원</p>
            <p style="color: #78716c; font-size: 0.875rem; margin: 0;">전체: 신축 90만원 / 구축 100만원</p>
          </div>
        </div>

        <!-- 상담 CTA -->
        <div style="background: white; border: 2px solid #f59e0b; padding: 2rem; border-radius: 1rem; text-align: center;">
          <h3 style="font-weight: 700; color: #1c1917; margin: 0 0 1rem 0; font-size: 1.25rem;">📞 무료 상담 받기</h3>
          <p style="color: #57534e; margin: 0 0 1.5rem 0;">화장실 줄눈, 더 궁금한 점이 있으신가요?<br/>부담 없이 상담받아 보세요.</p>
          <div style="display: flex; flex-direction: column; gap: 0.75rem; align-items: center;">
            <a href="tel:010-6461-0131" style="display: inline-flex; align-items: center; gap: 0.5rem; background: #f59e0b; color: white; padding: 0.75rem 1.5rem; border-radius: 9999px; text-decoration: none; font-weight: 600;">
              📞 010-6461-0131
            </a>
            <span style="color: #78716c; font-size: 0.875rem;">💬 채널톡 상담 (24시간)</span>
          </div>
        </div>

        <p style="color: #a8a29e; font-size: 0.75rem; text-align: center; margin-top: 2rem;">최종 업데이트: 2025년 1월</p>`
}

// Price 페이지 SSG 콘텐츠
function generatePriceSSGContent() {
  return `
        <!-- 도입부 -->
        <div style="background: #f5f5f4; padding: 1.5rem; border-radius: 1rem; margin-bottom: 2rem; font-size: 1rem; color: #57534e; line-height: 1.8;">
          <p style="margin: 0 0 0.5rem 0;">줄눈시공 얼마예요?</p>
          <p style="margin: 0 0 0.5rem 0;">업체마다 가격이 왜 다른가요?</p>
          <p style="margin: 0 0 1rem 0;">추가 비용은 없나요?</p>
          <p style="margin: 0;"><strong style="color: #f59e0b;">하우스Pick 정찰제 가격표</strong>를 공개합니다.<br/>이 가격이 최종 가격입니다. 추가 비용 없습니다.</p>
        </div>

        <!-- 목차 -->
        <div style="background: white; border: 1px solid #e7e5e4; border-radius: 1rem; padding: 1.5rem; margin-bottom: 2rem;">
          <h3 style="font-weight: 700; color: #1c1917; margin: 0 0 1rem 0; font-size: 1rem;">📋 목차</h3>
          <ol style="margin: 0; padding-left: 1.25rem; color: #57534e; line-height: 2; columns: 2;">
            <li><a href="#main-price" style="color: #f59e0b; text-decoration: none;">정찰제 가격표</a></li>
            <li><a href="#bathroom-price" style="color: #f59e0b; text-decoration: none;">화장실 가격</a></li>
            <li><a href="#living-price" style="color: #f59e0b; text-decoration: none;">거실 가격</a></li>
            <li><a href="#etc-price" style="color: #f59e0b; text-decoration: none;">현관/베란다/세탁실</a></li>
            <li><a href="#material-compare" style="color: #f59e0b; text-decoration: none;">자재별 비교</a></li>
            <li><a href="#new-vs-old" style="color: #f59e0b; text-decoration: none;">신축 vs 구축</a></li>
            <li><a href="#set-discount" style="color: #f59e0b; text-decoration: none;">세트 할인</a></li>
            <li><a href="#competitor-compare" style="color: #f59e0b; text-decoration: none;">타 업체 비교</a></li>
            <li><a href="#faq" style="color: #f59e0b; text-decoration: none;">가격 Q&A</a></li>
          </ol>
        </div>

        <!-- 1. 정찰제 가격표 -->
        <h2 id="main-price" style="font-size: 1.5rem; font-weight: 700; color: #1c1917; margin: 2.5rem 0 1rem; padding-top: 1rem; border-top: 1px solid #e7e5e4;">1. 정찰제 가격표</h2>

        <h3 style="font-size: 1.125rem; font-weight: 700; color: #1c1917; margin: 1.5rem 0 1rem;">💰 하우스Pick 2025년 가격표</h3>
        <div style="overflow-x: auto; margin-bottom: 1.5rem;">
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
              <tr style="border-bottom: 1px solid #e7e5e4; background: #fffbeb;">
                <td style="padding: 0.75rem; font-weight: 700;" rowspan="3">화장실</td>
                <td style="padding: 0.75rem;">바닥</td>
                <td style="padding: 0.75rem; text-align: center; color: #f59e0b; font-weight: 700;">30만원</td>
                <td style="padding: 0.75rem; text-align: center; color: #f59e0b; font-weight: 700;">35만원</td>
                <td style="padding: 0.75rem;">케라폭시</td>
              </tr>
              <tr style="border-bottom: 1px solid #e7e5e4; background: #fffbeb;">
                <td style="padding: 0.75rem;">벽 3면</td>
                <td style="padding: 0.75rem; text-align: center;">+35만원</td>
                <td style="padding: 0.75rem; text-align: center;">+35만원</td>
                <td style="padding: 0.75rem;">케라폭시</td>
              </tr>
              <tr style="border-bottom: 1px solid #e7e5e4; background: #fffbeb;">
                <td style="padding: 0.75rem;">전체</td>
                <td style="padding: 0.75rem; text-align: center; color: #f59e0b; font-weight: 700;">90만원</td>
                <td style="padding: 0.75rem; text-align: center; color: #f59e0b; font-weight: 700;">100만원</td>
                <td style="padding: 0.75rem;">케라폭시</td>
              </tr>
              <tr style="border-bottom: 1px solid #e7e5e4;">
                <td style="padding: 0.75rem; font-weight: 600;">거실</td>
                <td style="padding: 0.75rem;">바닥</td>
                <td style="padding: 0.75rem; text-align: center; color: #f59e0b; font-weight: 700;">150만원</td>
                <td style="padding: 0.75rem; text-align: center; color: #f59e0b; font-weight: 700;">150만원</td>
                <td style="padding: 0.75rem;">케라폭시</td>
              </tr>
              <tr style="border-bottom: 1px solid #e7e5e4;">
                <td style="padding: 0.75rem; font-weight: 600;">현관</td>
                <td style="padding: 0.75rem;">바닥</td>
                <td style="padding: 0.75rem; text-align: center; color: #f59e0b; font-weight: 700;">5만원</td>
                <td style="padding: 0.75rem; text-align: center; color: #f59e0b; font-weight: 700;">10만원</td>
                <td style="padding: 0.75rem;">폴리우레아</td>
              </tr>
              <tr style="border-bottom: 1px solid #e7e5e4;">
                <td style="padding: 0.75rem; font-weight: 600;">세탁실</td>
                <td style="padding: 0.75rem;">바닥</td>
                <td style="padding: 0.75rem; text-align: center; color: #f59e0b; font-weight: 700;">15만원</td>
                <td style="padding: 0.75rem; text-align: center; color: #f59e0b; font-weight: 700;">15만원</td>
                <td style="padding: 0.75rem;">폴리우레아</td>
              </tr>
              <tr>
                <td style="padding: 0.75rem; font-weight: 600;">베란다</td>
                <td style="padding: 0.75rem;">바닥</td>
                <td style="padding: 0.75rem; text-align: center; color: #f59e0b; font-weight: 700;">15만원</td>
                <td style="padding: 0.75rem; text-align: center; color: #f59e0b; font-weight: 700;">15만원</td>
                <td style="padding: 0.75rem;">폴리우레아</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 2rem;">
          <div style="background: #dcfce7; padding: 1.25rem; border-radius: 0.75rem; border: 1px solid #86efac;">
            <h4 style="font-weight: 700; color: #166534; margin: 0 0 0.75rem 0;">✅ 가격에 포함된 것</h4>
            <ul style="margin: 0; padding-left: 1rem; color: #15803d; font-size: 0.875rem; line-height: 1.8;">
              <li>자재비 (케라폭시/폴리우레아)</li>
              <li>시공 인건비</li>
              <li>기존 줄눈 제거 (구축)</li>
              <li>실리콘 마감</li>
              <li><strong>5년 무상 A/S</strong></li>
            </ul>
          </div>
          <div style="background: #fee2e2; padding: 1.25rem; border-radius: 0.75rem; border: 1px solid #fca5a5;">
            <h4 style="font-weight: 700; color: #991b1b; margin: 0 0 0.75rem 0;">❌ 추가 비용?</h4>
            <p style="margin: 0 0 0.5rem 0; color: #b91c1c; font-size: 0.875rem;"><strong>없습니다.</strong></p>
            <ul style="margin: 0; padding-left: 1rem; color: #b91c1c; font-size: 0.875rem; line-height: 1.8;">
              <li>곰팡이 제거비? ❌ 포함</li>
              <li>출장비? ❌ 포함</li>
              <li>자재비? ❌ 포함</li>
            </ul>
          </div>
        </div>

        <!-- 2. 화장실 가격 -->
        <h2 id="bathroom-price" style="font-size: 1.5rem; font-weight: 700; color: #1c1917; margin: 2.5rem 0 1rem; padding-top: 1rem; border-top: 1px solid #e7e5e4;">2. 화장실 줄눈 가격</h2>

        <h3 style="font-size: 1.125rem; font-weight: 700; color: #1c1917; margin: 1.5rem 0 1rem;">🚿 욕조 화장실</h3>
        <div style="overflow-x: auto; margin-bottom: 1.5rem;">
          <table style="width: 100%; border-collapse: collapse; font-size: 0.875rem;">
            <thead>
              <tr style="background: #fef3c7;">
                <th style="padding: 0.75rem; text-align: left; border-bottom: 2px solid #f59e0b;">시공 범위</th>
                <th style="padding: 0.75rem; text-align: center; border-bottom: 2px solid #f59e0b;">신축</th>
                <th style="padding: 0.75rem; text-align: center; border-bottom: 2px solid #f59e0b;">구축</th>
                <th style="padding: 0.75rem; text-align: left; border-bottom: 2px solid #f59e0b;">설명</th>
              </tr>
            </thead>
            <tbody>
              <tr style="border-bottom: 1px solid #e7e5e4;">
                <td style="padding: 0.75rem; font-weight: 600;">바닥만</td>
                <td style="padding: 0.75rem; text-align: center; font-weight: 700; color: #f59e0b;">30만원</td>
                <td style="padding: 0.75rem; text-align: center; font-weight: 700; color: #f59e0b;">35만원</td>
                <td style="padding: 0.75rem;">300각 타일 기준</td>
              </tr>
              <tr style="border-bottom: 1px solid #e7e5e4;">
                <td style="padding: 0.75rem;">벽 3면</td>
                <td style="padding: 0.75rem; text-align: center;">+35만원</td>
                <td style="padding: 0.75rem; text-align: center;">+35만원</td>
                <td style="padding: 0.75rem;">샤워/욕조 구역</td>
              </tr>
              <tr style="background: #fffbeb;">
                <td style="padding: 0.75rem; font-weight: 600;">전체</td>
                <td style="padding: 0.75rem; text-align: center; font-weight: 700; color: #f59e0b;">90만원</td>
                <td style="padding: 0.75rem; text-align: center; font-weight: 700; color: #f59e0b;">100만원</td>
                <td style="padding: 0.75rem;">바닥 + 벽 전체</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 style="font-size: 1.125rem; font-weight: 700; color: #1c1917; margin: 1.5rem 0 1rem;">🚿 샤워부스 화장실</h3>
        <div style="overflow-x: auto; margin-bottom: 1.5rem;">
          <table style="width: 100%; border-collapse: collapse; font-size: 0.875rem;">
            <thead>
              <tr style="background: #fef3c7;">
                <th style="padding: 0.75rem; text-align: left; border-bottom: 2px solid #f59e0b;">시공 범위</th>
                <th style="padding: 0.75rem; text-align: center; border-bottom: 2px solid #f59e0b;">신축</th>
                <th style="padding: 0.75rem; text-align: center; border-bottom: 2px solid #f59e0b;">구축</th>
                <th style="padding: 0.75rem; text-align: left; border-bottom: 2px solid #f59e0b;">설명</th>
              </tr>
            </thead>
            <tbody>
              <tr style="border-bottom: 1px solid #e7e5e4;">
                <td style="padding: 0.75rem; font-weight: 600;">바닥만</td>
                <td style="padding: 0.75rem; text-align: center; font-weight: 700; color: #f59e0b;">35만원</td>
                <td style="padding: 0.75rem; text-align: center; font-weight: 700; color: #f59e0b;">40만원</td>
                <td style="padding: 0.75rem;">샤워부스 포함</td>
              </tr>
              <tr style="border-bottom: 1px solid #e7e5e4;">
                <td style="padding: 0.75rem;">벽 3면</td>
                <td style="padding: 0.75rem; text-align: center;">+35만원</td>
                <td style="padding: 0.75rem; text-align: center;">+35만원</td>
                <td style="padding: 0.75rem;">샤워부스 구역</td>
              </tr>
              <tr style="background: #fffbeb;">
                <td style="padding: 0.75rem; font-weight: 600;">전체</td>
                <td style="padding: 0.75rem; text-align: center; font-weight: 700; color: #f59e0b;">95만원</td>
                <td style="padding: 0.75rem; text-align: center; font-weight: 700; color: #f59e0b;">105만원</td>
                <td style="padding: 0.75rem;">바닥 + 벽 전체</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 style="font-size: 1.125rem; font-weight: 700; color: #1c1917; margin: 1.5rem 0 1rem;">화장실 2개 시공 시</h3>
        <div style="overflow-x: auto; margin-bottom: 1rem;">
          <table style="width: 100%; border-collapse: collapse; font-size: 0.875rem;">
            <thead>
              <tr style="background: #e0f2fe;">
                <th style="padding: 0.75rem; text-align: left; border-bottom: 2px solid #0ea5e9;">조합</th>
                <th style="padding: 0.75rem; text-align: center; border-bottom: 2px solid #0ea5e9;">신축</th>
                <th style="padding: 0.75rem; text-align: center; border-bottom: 2px solid #0ea5e9;">구축</th>
              </tr>
            </thead>
            <tbody>
              <tr style="border-bottom: 1px solid #e7e5e4;">
                <td style="padding: 0.75rem;">바닥 2개</td>
                <td style="padding: 0.75rem; text-align: center; font-weight: 600; color: #0369a1;">55만원</td>
                <td style="padding: 0.75rem; text-align: center; font-weight: 600; color: #0369a1;">65만원</td>
              </tr>
              <tr>
                <td style="padding: 0.75rem;">전체 2개</td>
                <td style="padding: 0.75rem; text-align: center; font-weight: 600; color: #0369a1;">170만원</td>
                <td style="padding: 0.75rem; text-align: center; font-weight: 600; color: #0369a1;">190만원</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div style="background: #fef3c7; padding: 1rem; border-radius: 0.75rem; margin-bottom: 2rem;">
          <p style="margin: 0; color: #92400e;"><strong>💡 2개 이상 시공 시 할인 적용됩니다.</strong></p>
        </div>

        <!-- 3. 거실 가격 -->
        <h2 id="living-price" style="font-size: 1.5rem; font-weight: 700; color: #1c1917; margin: 2.5rem 0 1rem; padding-top: 1rem; border-top: 1px solid #e7e5e4;">3. 거실 줄눈 가격</h2>

        <h3 style="font-size: 1.125rem; font-weight: 700; color: #1c1917; margin: 1.5rem 0 1rem;">🛋️ 거실 바닥</h3>
        <div style="overflow-x: auto; margin-bottom: 1.5rem;">
          <table style="width: 100%; border-collapse: collapse; font-size: 0.875rem;">
            <thead>
              <tr style="background: #fef3c7;">
                <th style="padding: 0.75rem; text-align: left; border-bottom: 2px solid #f59e0b;">평형</th>
                <th style="padding: 0.75rem; text-align: center; border-bottom: 2px solid #f59e0b;">가격</th>
                <th style="padding: 0.75rem; text-align: left; border-bottom: 2px solid #f59e0b;">자재</th>
              </tr>
            </thead>
            <tbody>
              <tr style="border-bottom: 1px solid #e7e5e4; background: #fffbeb;">
                <td style="padding: 0.75rem; font-weight: 600;">20평대</td>
                <td style="padding: 0.75rem; text-align: center; font-weight: 700; color: #f59e0b;">150만원</td>
                <td style="padding: 0.75rem;">케라폭시</td>
              </tr>
              <tr style="border-bottom: 1px solid #e7e5e4;">
                <td style="padding: 0.75rem;">30평대</td>
                <td style="padding: 0.75rem; text-align: center;">별도 협의</td>
                <td style="padding: 0.75rem;">케라폭시</td>
              </tr>
              <tr>
                <td style="padding: 0.75rem;">40평대+</td>
                <td style="padding: 0.75rem; text-align: center;">별도 협의</td>
                <td style="padding: 0.75rem;">케라폭시</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 style="font-size: 1.125rem; font-weight: 700; color: #1c1917; margin: 1.5rem 0 1rem;">거실 줄눈 특징</h3>
        <ul style="list-style: none; padding: 0; margin: 0 0 1.5rem 0;">
          <li style="display: flex; gap: 0.5rem; margin-bottom: 0.5rem; color: #57534e;">
            <span>•</span><span><strong>자재:</strong> 케라폭시 (고급 에폭시)</span>
          </li>
          <li style="display: flex; gap: 0.5rem; margin-bottom: 0.5rem; color: #57534e;">
            <span>•</span><span><strong>시공 시간:</strong> 6~8시간</span>
          </li>
          <li style="display: flex; gap: 0.5rem; color: #57534e;">
            <span>•</span><span><strong>경화 시간:</strong> 24시간 (가구 올리기 48시간 후)</span>
          </li>
        </ul>

        <h3 style="font-size: 1.125rem; font-weight: 700; color: #1c1917; margin: 1.5rem 0 1rem;">거실 줄눈 가격이 비싼 이유</h3>
        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem; margin-bottom: 2rem;">
          <div style="background: #f5f5f4; padding: 1rem; border-radius: 0.75rem; text-align: center;">
            <p style="margin: 0; color: #57534e;"><strong style="color: #1c1917; font-size: 1.25rem;">1</strong><br/>면적이 넓음<br/><span style="font-size: 0.75rem;">화장실의 5~10배</span></p>
          </div>
          <div style="background: #f5f5f4; padding: 1rem; border-radius: 0.75rem; text-align: center;">
            <p style="margin: 0; color: #57534e;"><strong style="color: #1c1917; font-size: 1.25rem;">2</strong><br/>자재 사용량 많음<br/><span style="font-size: 0.75rem;">케라폭시 5~10배 사용</span></p>
          </div>
          <div style="background: #f5f5f4; padding: 1rem; border-radius: 0.75rem; text-align: center;">
            <p style="margin: 0; color: #57534e;"><strong style="color: #1c1917; font-size: 1.25rem;">3</strong><br/>시공 시간 길음<br/><span style="font-size: 0.75rem;">6~8시간 소요</span></p>
          </div>
          <div style="background: #f5f5f4; padding: 1rem; border-radius: 0.75rem; text-align: center;">
            <p style="margin: 0; color: #57534e;"><strong style="color: #1c1917; font-size: 1.25rem;">4</strong><br/>정밀 작업 필요<br/><span style="font-size: 0.75rem;">넓은 면적 균일하게</span></p>
          </div>
        </div>

        <!-- 4. 현관/베란다/세탁실 -->
        <h2 id="etc-price" style="font-size: 1.5rem; font-weight: 700; color: #1c1917; margin: 2.5rem 0 1rem; padding-top: 1rem; border-top: 1px solid #e7e5e4;">4. 현관 / 베란다 / 세탁실 가격</h2>

        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; margin-bottom: 1.5rem;">
          <div style="background: #fef3c7; padding: 1.25rem; border-radius: 0.75rem; text-align: center;">
            <h4 style="font-weight: 700; color: #92400e; margin: 0 0 0.75rem 0;">🚪 현관</h4>
            <p style="margin: 0 0 0.25rem 0; color: #a16207; font-size: 0.875rem;">신축: <strong style="color: #f59e0b; font-size: 1.125rem;">5만원</strong></p>
            <p style="margin: 0; color: #a16207; font-size: 0.875rem;">구축: <strong style="color: #f59e0b; font-size: 1.125rem;">10만원</strong></p>
          </div>
          <div style="background: #dcfce7; padding: 1.25rem; border-radius: 0.75rem; text-align: center;">
            <h4 style="font-weight: 700; color: #166534; margin: 0 0 0.75rem 0;">🌿 베란다</h4>
            <p style="margin: 0; color: #15803d; font-size: 0.875rem;">일반: <strong style="color: #16a34a; font-size: 1.125rem;">15만원</strong></p>
          </div>
          <div style="background: #e0e7ff; padding: 1.25rem; border-radius: 0.75rem; text-align: center;">
            <h4 style="font-weight: 700; color: #3730a3; margin: 0 0 0.75rem 0;">👕 세탁실</h4>
            <p style="margin: 0; color: #4338ca; font-size: 0.875rem;">일반: <strong style="color: #4f46e5; font-size: 1.125rem;">15만원</strong></p>
          </div>
        </div>

        <h3 style="font-size: 1.125rem; font-weight: 700; color: #1c1917; margin: 1.5rem 0 1rem;">폴리우레아 사용 이유</h3>
        <p style="color: #57534e; margin-bottom: 1rem; line-height: 1.8;">현관, 베란다, 세탁실은 <strong style="color: #1c1917;">화장실만큼 물을 많이 사용하지 않습니다.</strong> 따라서 고가의 케라폭시 대신 <strong style="color: #f59e0b;">가성비 좋은 폴리우레아</strong>를 사용합니다.</p>
        <div style="background: #dcfce7; padding: 1rem; border-radius: 0.75rem; margin-bottom: 2rem;">
          <ul style="margin: 0; padding-left: 1.25rem; color: #15803d;">
            <li>✅ 케라폭시 대비 50% 저렴</li>
            <li>✅ 빠른 경화 (2~4시간)</li>
            <li>✅ 충분한 내구성 (5년+)</li>
          </ul>
        </div>

        <!-- 5. 자재별 비교 -->
        <h2 id="material-compare" style="font-size: 1.5rem; font-weight: 700; color: #1c1917; margin: 2.5rem 0 1rem; padding-top: 1rem; border-top: 1px solid #e7e5e4;">5. 자재별 가격 비교</h2>

        <h3 style="font-size: 1.125rem; font-weight: 700; color: #1c1917; margin: 1.5rem 0 1rem;">같은 공간, 다른 자재</h3>
        <div style="overflow-x: auto; margin-bottom: 1.5rem;">
          <table style="width: 100%; border-collapse: collapse; font-size: 0.875rem;">
            <thead>
              <tr style="background: #f5f5f4;">
                <th style="padding: 0.75rem; text-align: left; border-bottom: 2px solid #d6d3d1;">자재</th>
                <th style="padding: 0.75rem; text-align: center; border-bottom: 2px solid #d6d3d1;">화장실 바닥</th>
                <th style="padding: 0.75rem; text-align: center; border-bottom: 2px solid #d6d3d1;">현관</th>
                <th style="padding: 0.75rem; text-align: left; border-bottom: 2px solid #d6d3d1;">특징</th>
              </tr>
            </thead>
            <tbody>
              <tr style="border-bottom: 1px solid #e7e5e4; background: #fffbeb;">
                <td style="padding: 0.75rem; font-weight: 700; color: #f59e0b;">케라폭시</td>
                <td style="padding: 0.75rem; text-align: center;">30만원</td>
                <td style="padding: 0.75rem; text-align: center;">15만원</td>
                <td style="padding: 0.75rem;">최고급, 10년+</td>
              </tr>
              <tr style="border-bottom: 1px solid #e7e5e4;">
                <td style="padding: 0.75rem; font-weight: 600;">폴리우레아</td>
                <td style="padding: 0.75rem; text-align: center;">20만원</td>
                <td style="padding: 0.75rem; text-align: center;">5만원</td>
                <td style="padding: 0.75rem;">가성비, 5년+</td>
              </tr>
              <tr>
                <td style="padding: 0.75rem;">일반 줄눈</td>
                <td style="padding: 0.75rem; text-align: center;">10만원</td>
                <td style="padding: 0.75rem; text-align: center;">3만원</td>
                <td style="padding: 0.75rem; color: #dc2626;">저가, 2~3년</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div style="background: #fef3c7; padding: 1.25rem; border-radius: 0.75rem; margin-bottom: 2rem;">
          <p style="margin: 0; color: #92400e;"><strong>💡 하우스Pick 추천:</strong> 화장실은 케라폭시, 나머지는 폴리우레아! 이 조합이 가장 가성비 좋습니다.</p>
        </div>

        <!-- 6. 신축 vs 구축 -->
        <h2 id="new-vs-old" style="font-size: 1.5rem; font-weight: 700; color: #1c1917; margin: 2.5rem 0 1rem; padding-top: 1rem; border-top: 1px solid #e7e5e4;">6. 신축 vs 구축 가격 차이</h2>

        <h3 style="font-size: 1.125rem; font-weight: 700; color: #1c1917; margin: 1.5rem 0 1rem;">왜 구축이 더 비싸요?</h3>
        <div style="overflow-x: auto; margin-bottom: 1.5rem;">
          <table style="width: 100%; border-collapse: collapse; font-size: 0.875rem;">
            <thead>
              <tr style="background: #fef3c7;">
                <th style="padding: 0.75rem; text-align: left; border-bottom: 2px solid #f59e0b;">항목</th>
                <th style="padding: 0.75rem; text-align: center; border-bottom: 2px solid #f59e0b;">신축</th>
                <th style="padding: 0.75rem; text-align: center; border-bottom: 2px solid #f59e0b;">구축</th>
              </tr>
            </thead>
            <tbody>
              <tr style="border-bottom: 1px solid #e7e5e4;">
                <td style="padding: 0.75rem;">기존 줄눈</td>
                <td style="padding: 0.75rem; text-align: center; color: #16a34a;">깨끗한 백시멘트</td>
                <td style="padding: 0.75rem; text-align: center; color: #dc2626;">오염된 줄눈</td>
              </tr>
              <tr style="border-bottom: 1px solid #e7e5e4;">
                <td style="padding: 0.75rem;">제거 작업</td>
                <td style="padding: 0.75rem; text-align: center;">간단</td>
                <td style="padding: 0.75rem; text-align: center; font-weight: 600;">기계로 완전 제거</td>
              </tr>
              <tr style="border-bottom: 1px solid #e7e5e4;">
                <td style="padding: 0.75rem;">시간</td>
                <td style="padding: 0.75rem; text-align: center;">짧음</td>
                <td style="padding: 0.75rem; text-align: center;">길음 (+1시간)</td>
              </tr>
              <tr>
                <td style="padding: 0.75rem;">가격 차이</td>
                <td style="padding: 0.75rem; text-align: center;">기본</td>
                <td style="padding: 0.75rem; text-align: center; font-weight: 700; color: #f59e0b;">+5만원</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div style="background: #e0f2fe; padding: 1.25rem; border-radius: 0.75rem; margin-bottom: 2rem;">
          <h4 style="font-weight: 700; color: #0369a1; margin: 0 0 0.5rem 0;">구축인데 신축 가격?</h4>
          <p style="margin: 0; color: #0c4a6e; font-size: 0.875rem;">입주 1년 이내이고, 줄눈 상태가 깨끗하면 <strong>신축 가격 적용 가능</strong>합니다. 사진 보내주시면 확인 후 안내드립니다.</p>
        </div>

        <!-- 7. 세트 할인 -->
        <h2 id="set-discount" style="font-size: 1.5rem; font-weight: 700; color: #1c1917; margin: 2.5rem 0 1rem; padding-top: 1rem; border-top: 1px solid #e7e5e4;">7. 세트 할인 가격</h2>

        <h3 style="font-size: 1.125rem; font-weight: 700; color: #1c1917; margin: 1.5rem 0 1rem;">🎁 인기 세트</h3>

        <!-- 세트 A -->
        <div style="background: white; border: 2px solid #22c55e; border-radius: 1rem; padding: 1.5rem; margin-bottom: 1rem;">
          <h4 style="font-weight: 700; color: #166534; margin: 0 0 1rem 0;">세트 A: 신축 입주 세트</h4>
          <div style="overflow-x: auto; margin-bottom: 1rem;">
            <table style="width: 100%; border-collapse: collapse; font-size: 0.875rem;">
              <tbody>
                <tr style="border-bottom: 1px solid #e7e5e4;">
                  <td style="padding: 0.5rem;">화장실 바닥 2개</td>
                  <td style="padding: 0.5rem; text-align: right;">60만원</td>
                </tr>
                <tr style="border-bottom: 1px solid #e7e5e4;">
                  <td style="padding: 0.5rem;">현관</td>
                  <td style="padding: 0.5rem; text-align: right;">5만원</td>
                </tr>
                <tr style="border-bottom: 1px solid #e7e5e4;">
                  <td style="padding: 0.5rem;">베란다</td>
                  <td style="padding: 0.5rem; text-align: right;">15만원</td>
                </tr>
                <tr style="border-bottom: 1px solid #e7e5e4;">
                  <td style="padding: 0.5rem; color: #78716c;"><s>합계</s></td>
                  <td style="padding: 0.5rem; text-align: right; color: #78716c;"><s>80만원</s></td>
                </tr>
                <tr style="background: #dcfce7;">
                  <td style="padding: 0.5rem; font-weight: 700;">세트 가격</td>
                  <td style="padding: 0.5rem; text-align: right; font-weight: 700; color: #16a34a; font-size: 1.125rem;">75만원</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- 세트 B -->
        <div style="background: white; border: 2px solid #f59e0b; border-radius: 1rem; padding: 1.5rem; margin-bottom: 1rem;">
          <h4 style="font-weight: 700; color: #92400e; margin: 0 0 1rem 0;">세트 B: 구축 리모델링 세트</h4>
          <div style="overflow-x: auto; margin-bottom: 1rem;">
            <table style="width: 100%; border-collapse: collapse; font-size: 0.875rem;">
              <tbody>
                <tr style="border-bottom: 1px solid #e7e5e4;">
                  <td style="padding: 0.5rem;">화장실 전체 1개</td>
                  <td style="padding: 0.5rem; text-align: right;">100만원</td>
                </tr>
                <tr style="border-bottom: 1px solid #e7e5e4;">
                  <td style="padding: 0.5rem;">현관</td>
                  <td style="padding: 0.5rem; text-align: right;">10만원</td>
                </tr>
                <tr style="border-bottom: 1px solid #e7e5e4;">
                  <td style="padding: 0.5rem;">세탁실</td>
                  <td style="padding: 0.5rem; text-align: right;">15만원</td>
                </tr>
                <tr style="border-bottom: 1px solid #e7e5e4;">
                  <td style="padding: 0.5rem; color: #78716c;"><s>합계</s></td>
                  <td style="padding: 0.5rem; text-align: right; color: #78716c;"><s>125만원</s></td>
                </tr>
                <tr style="background: #fef3c7;">
                  <td style="padding: 0.5rem; font-weight: 700;">세트 가격</td>
                  <td style="padding: 0.5rem; text-align: right; font-weight: 700; color: #f59e0b; font-size: 1.125rem;">115만원</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- 세트 C -->
        <div style="background: white; border: 2px solid #8b5cf6; border-radius: 1rem; padding: 1.5rem; margin-bottom: 1.5rem;">
          <h4 style="font-weight: 700; color: #6d28d9; margin: 0 0 1rem 0;">세트 C: 올인원 세트 (구축)</h4>
          <div style="overflow-x: auto; margin-bottom: 1rem;">
            <table style="width: 100%; border-collapse: collapse; font-size: 0.875rem;">
              <tbody>
                <tr style="border-bottom: 1px solid #e7e5e4;">
                  <td style="padding: 0.5rem;">화장실 전체 2개</td>
                  <td style="padding: 0.5rem; text-align: right;">190만원</td>
                </tr>
                <tr style="border-bottom: 1px solid #e7e5e4;">
                  <td style="padding: 0.5rem;">거실</td>
                  <td style="padding: 0.5rem; text-align: right;">150만원</td>
                </tr>
                <tr style="border-bottom: 1px solid #e7e5e4;">
                  <td style="padding: 0.5rem;">현관</td>
                  <td style="padding: 0.5rem; text-align: right;">10만원</td>
                </tr>
                <tr style="border-bottom: 1px solid #e7e5e4;">
                  <td style="padding: 0.5rem;">베란다</td>
                  <td style="padding: 0.5rem; text-align: right;">15만원</td>
                </tr>
                <tr style="border-bottom: 1px solid #e7e5e4;">
                  <td style="padding: 0.5rem;">세탁실</td>
                  <td style="padding: 0.5rem; text-align: right;">15만원</td>
                </tr>
                <tr style="border-bottom: 1px solid #e7e5e4;">
                  <td style="padding: 0.5rem; color: #78716c;"><s>합계</s></td>
                  <td style="padding: 0.5rem; text-align: right; color: #78716c;"><s>380만원</s></td>
                </tr>
                <tr style="background: #ede9fe;">
                  <td style="padding: 0.5rem; font-weight: 700;">세트 가격</td>
                  <td style="padding: 0.5rem; text-align: right; font-weight: 700; color: #7c3aed; font-size: 1.125rem;">350만원</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div style="background: #fef3c7; padding: 1rem; border-radius: 0.75rem; margin-bottom: 2rem;">
          <p style="margin: 0; color: #92400e;"><strong>💡 여러 공간 시공 시 상담하면 할인 받을 수 있어요!</strong></p>
        </div>

        <!-- 8. 타 업체 비교 -->
        <h2 id="competitor-compare" style="font-size: 1.5rem; font-weight: 700; color: #1c1917; margin: 2.5rem 0 1rem; padding-top: 1rem; border-top: 1px solid #e7e5e4;">8. 타 업체와 가격 비교</h2>

        <h3 style="font-size: 1.125rem; font-weight: 700; color: #1c1917; margin: 1.5rem 0 1rem;">동일 조건 비교 (화장실 바닥 기준)</h3>
        <div style="overflow-x: auto; margin-bottom: 1.5rem;">
          <table style="width: 100%; border-collapse: collapse; font-size: 0.875rem;">
            <thead>
              <tr style="background: #fef3c7;">
                <th style="padding: 0.75rem; text-align: left; border-bottom: 2px solid #f59e0b;">항목</th>
                <th style="padding: 0.75rem; text-align: center; border-bottom: 2px solid #f59e0b;">저가 업체</th>
                <th style="padding: 0.75rem; text-align: center; border-bottom: 2px solid #f59e0b;">일반 업체</th>
                <th style="padding: 0.75rem; text-align: center; border-bottom: 2px solid #f59e0b; background: #fde68a;">하우스Pick</th>
              </tr>
            </thead>
            <tbody>
              <tr style="border-bottom: 1px solid #e7e5e4;">
                <td style="padding: 0.75rem;">표면 가격</td>
                <td style="padding: 0.75rem; text-align: center;">10~15만원</td>
                <td style="padding: 0.75rem; text-align: center;">20~30만원</td>
                <td style="padding: 0.75rem; text-align: center; font-weight: 700; background: #fffbeb;">30만원</td>
              </tr>
              <tr style="border-bottom: 1px solid #e7e5e4;">
                <td style="padding: 0.75rem;">자재</td>
                <td style="padding: 0.75rem; text-align: center; color: #dc2626;">일반 줄눈</td>
                <td style="padding: 0.75rem; text-align: center;">다양</td>
                <td style="padding: 0.75rem; text-align: center; font-weight: 700; color: #f59e0b; background: #fffbeb;">케라폭시</td>
              </tr>
              <tr style="border-bottom: 1px solid #e7e5e4;">
                <td style="padding: 0.75rem;">제거 작업</td>
                <td style="padding: 0.75rem; text-align: center; color: #dc2626;">손 작업</td>
                <td style="padding: 0.75rem; text-align: center;">다양</td>
                <td style="padding: 0.75rem; text-align: center; font-weight: 600; background: #fffbeb;">기계 제거</td>
              </tr>
              <tr style="border-bottom: 1px solid #e7e5e4;">
                <td style="padding: 0.75rem;">A/S</td>
                <td style="padding: 0.75rem; text-align: center; color: #dc2626;">없음~1년</td>
                <td style="padding: 0.75rem; text-align: center;">1~2년</td>
                <td style="padding: 0.75rem; text-align: center; font-weight: 700; color: #16a34a; background: #fffbeb;">5년</td>
              </tr>
              <tr>
                <td style="padding: 0.75rem;">추가 비용</td>
                <td style="padding: 0.75rem; text-align: center; color: #dc2626;">있음</td>
                <td style="padding: 0.75rem; text-align: center; color: #f59e0b;">있음</td>
                <td style="padding: 0.75rem; text-align: center; font-weight: 700; color: #16a34a; background: #fffbeb;">없음</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 style="font-size: 1.125rem; font-weight: 700; color: #dc2626; margin: 1.5rem 0 1rem;">⚠️ 저가 업체의 함정</h3>
        <div style="background: #fee2e2; padding: 1.25rem; border-radius: 0.75rem; margin-bottom: 1.5rem;">
          <p style="margin: 0 0 1rem 0; font-weight: 700; color: #991b1b;">"10만원에 해드려요"</p>
          <ul style="margin: 0; padding-left: 1.25rem; color: #b91c1c; line-height: 1.8;">
            <li>일반 줄눈 사용 → 2~3년 후 재시공</li>
            <li>손으로 대충 제거 → 새 줄눈 안 붙음</li>
            <li>A/S 없음 → 문제 생기면 그대로</li>
            <li>현장 추가 비용 → "곰팡이 제거 5만원 추가요"</li>
          </ul>
        </div>

        <h3 style="font-size: 1.125rem; font-weight: 700; color: #1c1917; margin: 1.5rem 0 1rem;">실제 비용 비교 (10년 기준)</h3>
        <div style="overflow-x: auto; margin-bottom: 1rem;">
          <table style="width: 100%; border-collapse: collapse; font-size: 0.875rem;">
            <thead>
              <tr style="background: #f5f5f4;">
                <th style="padding: 0.75rem; text-align: left; border-bottom: 2px solid #d6d3d1;">구분</th>
                <th style="padding: 0.75rem; text-align: center; border-bottom: 2px solid #d6d3d1;">저가 업체</th>
                <th style="padding: 0.75rem; text-align: center; border-bottom: 2px solid #d6d3d1; background: #fef3c7;">하우스Pick</th>
              </tr>
            </thead>
            <tbody>
              <tr style="border-bottom: 1px solid #e7e5e4;">
                <td style="padding: 0.75rem;">첫 시공</td>
                <td style="padding: 0.75rem; text-align: center;">10만원</td>
                <td style="padding: 0.75rem; text-align: center; background: #fffbeb;">30만원</td>
              </tr>
              <tr style="border-bottom: 1px solid #e7e5e4;">
                <td style="padding: 0.75rem;">3년 후 재시공</td>
                <td style="padding: 0.75rem; text-align: center; color: #dc2626;">+15만원</td>
                <td style="padding: 0.75rem; text-align: center; background: #fffbeb;">-</td>
              </tr>
              <tr style="border-bottom: 1px solid #e7e5e4;">
                <td style="padding: 0.75rem;">5년 후 재시공</td>
                <td style="padding: 0.75rem; text-align: center; color: #dc2626;">+15만원</td>
                <td style="padding: 0.75rem; text-align: center; background: #fffbeb;">-</td>
              </tr>
              <tr style="background: #fef3c7;">
                <td style="padding: 0.75rem; font-weight: 700;">10년 총 비용</td>
                <td style="padding: 0.75rem; text-align: center; font-weight: 700; color: #dc2626;">40만원</td>
                <td style="padding: 0.75rem; text-align: center; font-weight: 700; color: #16a34a;">30만원</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div style="background: #dcfce7; padding: 1rem; border-radius: 0.75rem; margin-bottom: 2rem;">
          <p style="margin: 0; color: #166534;"><strong>💡 처음 제대로 하는 게 결국 더 저렴합니다.</strong></p>
        </div>

        <!-- 9. 가격 Q&A -->
        <h2 id="faq" style="font-size: 1.5rem; font-weight: 700; color: #1c1917; margin: 2.5rem 0 1rem; padding-top: 1rem; border-top: 1px solid #e7e5e4;">9. 자주 묻는 가격 질문</h2>

        <div class="prerender-faq-item" style="margin-bottom: 1rem;">
          <div class="prerender-faq-question">Q1. 정찰제가 뭐예요?</div>
          <div class="prerender-faq-answer">가격표 그대로의 가격입니다. 홈페이지 가격 = 실제 가격. 현장에서 추가 비용 없습니다.</div>
        </div>

        <div class="prerender-faq-item" style="margin-bottom: 1rem;">
          <div class="prerender-faq-question">Q2. 견적 받아볼 수 있나요?</div>
          <div class="prerender-faq-answer">위 가격표가 곧 견적입니다. 공간과 범위만 정해주시면 바로 계산 가능합니다.<br/><br/>예시:<br/>• 신축 화장실 바닥 1개 = 30만원<br/>• 구축 화장실 전체 1개 + 현관 = 100 + 10 = 110만원</div>
        </div>

        <div class="prerender-faq-item" style="margin-bottom: 1rem;">
          <div class="prerender-faq-question">Q3. 할인 가능한가요?</div>
          <div class="prerender-faq-answer">여러 공간 함께 시공 시 할인됩니다.<br/>• 2개 공간: 5만원 할인<br/>• 3개 공간 이상: 10만원+ 할인<br/><br/>상담 시 말씀해주세요!</div>
        </div>

        <div class="prerender-faq-item" style="margin-bottom: 1rem;">
          <div class="prerender-faq-question">Q4. 왜 다른 업체보다 비싸요?</div>
          <div class="prerender-faq-answer">비싸 보이지만, 실제로는 더 저렴합니다.<br/><br/><strong>하우스Pick 가격 포함:</strong><br/>✅ 케라폭시 (최고급 자재)<br/>✅ 기계 제거 (확실한 밑작업)<br/>✅ 5년 무상 A/S<br/><br/><strong>저가 업체 숨은 비용:</strong><br/>❌ 일반 줄눈 → 3년 후 재시공<br/>❌ 손 작업 → 금방 떨어짐<br/>❌ A/S 없음 → 문제 시 비용 발생</div>
        </div>

        <div class="prerender-faq-item" style="margin-bottom: 1rem;">
          <div class="prerender-faq-question">Q5. 언제 비용을 내나요?</div>
          <div class="prerender-faq-answer">시공 완료 후 결제합니다.<br/>• 계약금: 없음<br/>• 선입금: 없음<br/>• 시공 후 현장 결제<br/><br/>결제 방법: 현금, 카드, 계좌이체 모두 가능</div>
        </div>

        <div class="prerender-faq-item" style="margin-bottom: 2rem;">
          <div class="prerender-faq-question">Q6. 영수증/세금계산서 가능한가요?</div>
          <div class="prerender-faq-answer">네, 가능합니다. 사업자 세금계산서, 현금영수증 모두 발행해드립니다.</div>
        </div>

        <!-- 계산 예시 -->
        <h2 style="font-size: 1.5rem; font-weight: 700; color: #1c1917; margin: 2.5rem 0 1rem; padding-top: 1rem; border-top: 1px solid #e7e5e4;">🏠 내 집 예상 비용</h2>

        <div style="display: grid; gap: 1rem; margin-bottom: 2rem;">
          <div style="background: #f5f5f4; padding: 1.25rem; border-radius: 0.75rem;">
            <h4 style="font-weight: 700; color: #1c1917; margin: 0 0 0.75rem 0;">예시 1: 신축 30평 아파트 입주</h4>
            <p style="margin: 0; color: #57534e; font-size: 0.875rem; line-height: 1.8;">
              화장실 2개 바닥: 55만원<br/>
              현관: 5만원<br/>
              베란다: 15만원<br/>
              <strong style="color: #f59e0b;">총 예상: 75만원</strong>
            </p>
          </div>
          <div style="background: #f5f5f4; padding: 1.25rem; border-radius: 0.75rem;">
            <h4 style="font-weight: 700; color: #1c1917; margin: 0 0 0.75rem 0;">예시 2: 구축 아파트 화장실만</h4>
            <p style="margin: 0; color: #57534e; font-size: 0.875rem; line-height: 1.8;">
              화장실 1개 전체: 100만원<br/>
              <strong style="color: #f59e0b;">총 예상: 100만원</strong>
            </p>
          </div>
          <div style="background: #f5f5f4; padding: 1.25rem; border-radius: 0.75rem;">
            <h4 style="font-weight: 700; color: #1c1917; margin: 0 0 0.75rem 0;">예시 3: 전세 들어가기 전 전체</h4>
            <p style="margin: 0; color: #57534e; font-size: 0.875rem; line-height: 1.8;">
              화장실 2개 전체: 190만원<br/>
              현관: 10만원<br/>
              세탁실: 15만원<br/>
              <strong style="color: #f59e0b;">총 예상: 215만원</strong>
            </p>
          </div>
        </div>

        <!-- 상담 CTA -->
        <div style="background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); padding: 2rem; border-radius: 1rem; text-align: center;">
          <h3 style="font-weight: 700; color: #92400e; margin: 0 0 1rem 0; font-size: 1.25rem;">📞 무료 상담</h3>
          <p style="color: #a16207; margin: 0 0 1.5rem 0;">가격이 궁금하시면 부담 없이 문의하세요.<br/>사진 보내주시면 정확한 견적 안내드립니다.</p>
          <div style="display: flex; flex-direction: column; gap: 0.75rem; align-items: center;">
            <a href="tel:010-6461-0131" style="display: inline-flex; align-items: center; gap: 0.5rem; background: #f59e0b; color: white; padding: 0.75rem 1.5rem; border-radius: 9999px; text-decoration: none; font-weight: 600;">
              📞 010-6461-0131
            </a>
            <span style="color: #78716c; font-size: 0.875rem;">💬 채널톡 상담 (24시간)</span>
          </div>
        </div>

        <p style="color: #a8a29e; font-size: 0.75rem; text-align: center; margin-top: 2rem;">최종 업데이트: 2025년 1월<br/>정찰제 가격은 변동될 수 있습니다. 상담 시 최신 가격을 확인해주세요.</p>`
}

// Review 페이지 SSG 콘텐츠
function generateReviewSSGContent() {
  return `
        <!-- 인트로 -->
        <div style="background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); padding: 1.5rem; border-radius: 1rem; margin-bottom: 2rem;">
          <p style="color: #92400e; font-size: 1rem; line-height: 1.8; margin: 0;">
            말보다 결과로 보여드립니다.<br>
            하우스Pick 고객님들의 <strong>실제 후기</strong>와 <strong>Before/After 사진</strong>을 확인하세요.
          </p>
        </div>

        <!-- 목차 -->
        <div style="background: #f5f5f4; padding: 1.25rem; border-radius: 0.75rem; margin-bottom: 2rem;">
          <p style="font-weight: 700; color: #1c1917; margin: 0 0 0.75rem 0;">📑 목차</p>
          <ol style="margin: 0; padding-left: 1.25rem; color: #57534e; font-size: 0.875rem; line-height: 1.8;">
            <li>고객 평점 요약</li>
            <li>화장실 시공 후기</li>
            <li>거실 시공 후기</li>
            <li>현관/베란다 시공 후기</li>
            <li>지역별 시공 후기</li>
            <li>카카오톡 실제 후기</li>
            <li>후기 남기기</li>
          </ol>
        </div>

        <!-- 1. 고객 평점 요약 -->
        <h2 style="font-size: 1.5rem; font-weight: 700; color: #1c1917; margin: 2rem 0 1rem; padding-top: 1rem; border-top: 1px solid #e7e5e4;">
          1. 고객 평점 요약
        </h2>

        <!-- 평점 카드 -->
        <div style="background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); border-radius: 1rem; padding: 2rem; text-align: center; margin-bottom: 1.5rem;">
          <div style="font-size: 3.5rem; font-weight: 900; color: #f59e0b; margin-bottom: 0.5rem;">4.9</div>
          <div style="color: #f59e0b; font-size: 1.5rem; margin-bottom: 0.5rem;">★★★★★</div>
          <p style="color: #92400e; margin: 0; font-size: 1rem;">총 127건의 리뷰</p>
        </div>

        <h3 style="font-size: 1.125rem; font-weight: 600; color: #1c1917; margin: 1.5rem 0 1rem;">⭐ 하우스Pick 평점</h3>

        <div style="overflow-x: auto; margin-bottom: 1.5rem;">
          <table style="width: 100%; border-collapse: collapse; font-size: 0.875rem;">
            <thead>
              <tr style="background: #1c1917; color: white;">
                <th style="padding: 0.75rem; text-align: left; border: 1px solid #e7e5e4;">항목</th>
                <th style="padding: 0.75rem; text-align: center; border: 1px solid #e7e5e4;">점수</th>
              </tr>
            </thead>
            <tbody>
              <tr style="background: #fef3c7;">
                <td style="padding: 0.75rem; border: 1px solid #e7e5e4; font-weight: 600;">종합 평점</td>
                <td style="padding: 0.75rem; text-align: center; border: 1px solid #e7e5e4; font-weight: 700; color: #f59e0b;">⭐ 4.9 / 5.0</td>
              </tr>
              <tr style="background: white;">
                <td style="padding: 0.75rem; border: 1px solid #e7e5e4; font-weight: 600;">총 리뷰 수</td>
                <td style="padding: 0.75rem; text-align: center; border: 1px solid #e7e5e4;">127건</td>
              </tr>
              <tr style="background: #f5f5f4;">
                <td style="padding: 0.75rem; border: 1px solid #e7e5e4; font-weight: 600;">재주문율</td>
                <td style="padding: 0.75rem; text-align: center; border: 1px solid #e7e5e4;">23%</td>
              </tr>
              <tr style="background: white;">
                <td style="padding: 0.75rem; border: 1px solid #e7e5e4; font-weight: 600;">추천 의향</td>
                <td style="padding: 0.75rem; text-align: center; border: 1px solid #e7e5e4; font-weight: 600; color: #16a34a;">98%</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 style="font-size: 1.125rem; font-weight: 600; color: #1c1917; margin: 1.5rem 0 1rem;">평점 분포</h3>

        <div style="overflow-x: auto; margin-bottom: 1.5rem;">
          <table style="width: 100%; border-collapse: collapse; font-size: 0.875rem;">
            <thead>
              <tr style="background: #1c1917; color: white;">
                <th style="padding: 0.75rem; text-align: left; border: 1px solid #e7e5e4;">별점</th>
                <th style="padding: 0.75rem; text-align: center; border: 1px solid #e7e5e4;">비율</th>
                <th style="padding: 0.75rem; text-align: center; border: 1px solid #e7e5e4;">수</th>
              </tr>
            </thead>
            <tbody>
              <tr style="background: #dcfce7;">
                <td style="padding: 0.75rem; border: 1px solid #e7e5e4;">⭐⭐⭐⭐⭐ (5점)</td>
                <td style="padding: 0.75rem; text-align: center; border: 1px solid #e7e5e4; font-weight: 600;">92%</td>
                <td style="padding: 0.75rem; text-align: center; border: 1px solid #e7e5e4;">117건</td>
              </tr>
              <tr style="background: white;">
                <td style="padding: 0.75rem; border: 1px solid #e7e5e4;">⭐⭐⭐⭐ (4점)</td>
                <td style="padding: 0.75rem; text-align: center; border: 1px solid #e7e5e4;">6%</td>
                <td style="padding: 0.75rem; text-align: center; border: 1px solid #e7e5e4;">8건</td>
              </tr>
              <tr style="background: #f5f5f4;">
                <td style="padding: 0.75rem; border: 1px solid #e7e5e4;">⭐⭐⭐ (3점)</td>
                <td style="padding: 0.75rem; text-align: center; border: 1px solid #e7e5e4;">2%</td>
                <td style="padding: 0.75rem; text-align: center; border: 1px solid #e7e5e4;">2건</td>
              </tr>
              <tr style="background: white;">
                <td style="padding: 0.75rem; border: 1px solid #e7e5e4;">⭐⭐ (2점)</td>
                <td style="padding: 0.75rem; text-align: center; border: 1px solid #e7e5e4;">0%</td>
                <td style="padding: 0.75rem; text-align: center; border: 1px solid #e7e5e4;">0건</td>
              </tr>
              <tr style="background: #f5f5f4;">
                <td style="padding: 0.75rem; border: 1px solid #e7e5e4;">⭐ (1점)</td>
                <td style="padding: 0.75rem; text-align: center; border: 1px solid #e7e5e4;">0%</td>
                <td style="padding: 0.75rem; text-align: center; border: 1px solid #e7e5e4;">0건</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 style="font-size: 1.125rem; font-weight: 600; color: #1c1917; margin: 1.5rem 0 1rem;">고객이 선택한 이유 TOP 5</h3>

        <div style="overflow-x: auto; margin-bottom: 1.5rem;">
          <table style="width: 100%; border-collapse: collapse; font-size: 0.875rem;">
            <thead>
              <tr style="background: #1c1917; color: white;">
                <th style="padding: 0.75rem; text-align: center; border: 1px solid #e7e5e4;">순위</th>
                <th style="padding: 0.75rem; text-align: left; border: 1px solid #e7e5e4;">이유</th>
                <th style="padding: 0.75rem; text-align: center; border: 1px solid #e7e5e4;">비율</th>
              </tr>
            </thead>
            <tbody>
              <tr style="background: #fef3c7;">
                <td style="padding: 0.75rem; text-align: center; border: 1px solid #e7e5e4; font-weight: 700;">1위</td>
                <td style="padding: 0.75rem; border: 1px solid #e7e5e4; font-weight: 600;">정찰제 (가격 투명)</td>
                <td style="padding: 0.75rem; text-align: center; border: 1px solid #e7e5e4; font-weight: 600;">34%</td>
              </tr>
              <tr style="background: white;">
                <td style="padding: 0.75rem; text-align: center; border: 1px solid #e7e5e4; font-weight: 700;">2위</td>
                <td style="padding: 0.75rem; border: 1px solid #e7e5e4; font-weight: 600;">5년 무상 A/S</td>
                <td style="padding: 0.75rem; text-align: center; border: 1px solid #e7e5e4;">28%</td>
              </tr>
              <tr style="background: #f5f5f4;">
                <td style="padding: 0.75rem; text-align: center; border: 1px solid #e7e5e4; font-weight: 700;">3위</td>
                <td style="padding: 0.75rem; border: 1px solid #e7e5e4;">꼼꼼한 시공</td>
                <td style="padding: 0.75rem; text-align: center; border: 1px solid #e7e5e4;">21%</td>
              </tr>
              <tr style="background: white;">
                <td style="padding: 0.75rem; text-align: center; border: 1px solid #e7e5e4; font-weight: 700;">4위</td>
                <td style="padding: 0.75rem; border: 1px solid #e7e5e4;">친절한 상담</td>
                <td style="padding: 0.75rem; text-align: center; border: 1px solid #e7e5e4;">12%</td>
              </tr>
              <tr style="background: #f5f5f4;">
                <td style="padding: 0.75rem; text-align: center; border: 1px solid #e7e5e4; font-weight: 700;">5위</td>
                <td style="padding: 0.75rem; border: 1px solid #e7e5e4;">지인 추천</td>
                <td style="padding: 0.75rem; text-align: center; border: 1px solid #e7e5e4;">5%</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- 2. 화장실 시공 후기 -->
        <h2 style="font-size: 1.5rem; font-weight: 700; color: #1c1917; margin: 2rem 0 1rem; padding-top: 1rem; border-top: 1px solid #e7e5e4;">
          2. 화장실 시공 후기
        </h2>

        <!-- 후기 1 -->
        <div style="background: white; border: 1px solid #e7e5e4; border-radius: 1rem; padding: 1.5rem; margin-bottom: 1.5rem;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
            <h4 style="font-size: 1rem; font-weight: 600; color: #1c1917; margin: 0;">후기 1: 강남구 김** 고객님</h4>
            <span style="color: #f59e0b; font-size: 1rem;">★★★★★</span>
          </div>

          <div style="overflow-x: auto; margin-bottom: 1rem;">
            <table style="width: 100%; border-collapse: collapse; font-size: 0.813rem;">
              <tbody>
                <tr style="background: #f5f5f4;">
                  <td style="padding: 0.5rem; border: 1px solid #e7e5e4; font-weight: 600; width: 25%;">지역</td>
                  <td style="padding: 0.5rem; border: 1px solid #e7e5e4;">서울 강남구</td>
                  <td style="padding: 0.5rem; border: 1px solid #e7e5e4; font-weight: 600; width: 25%;">공간</td>
                  <td style="padding: 0.5rem; border: 1px solid #e7e5e4;">화장실 2개 (바닥)</td>
                </tr>
                <tr style="background: white;">
                  <td style="padding: 0.5rem; border: 1px solid #e7e5e4; font-weight: 600;">상태</td>
                  <td style="padding: 0.5rem; border: 1px solid #e7e5e4;">신축</td>
                  <td style="padding: 0.5rem; border: 1px solid #e7e5e4; font-weight: 600;">비용</td>
                  <td style="padding: 0.5rem; border: 1px solid #e7e5e4; color: #16a34a; font-weight: 600;">55만원</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div style="background: #f0fdf4; padding: 1rem; border-radius: 0.75rem; border-left: 4px solid #22c55e;">
            <p style="margin: 0; color: #166534; font-size: 0.875rem; line-height: 1.7; font-style: italic;">
              "시간 약속도 잘 지켜주시고 일 처리도 꼼꼼히 잘 해주셔서 최종 결과물이 아주 만족스러웠습니다.
              다른 업체 견적도 받아봤는데 하우스Pick이 가격도 합리적이고 설명도 자세했어요.
              <strong>지인 소개 적극 추천 예정입니다!</strong>"
            </p>
          </div>
        </div>

        <!-- 후기 2 -->
        <div style="background: white; border: 1px solid #e7e5e4; border-radius: 1rem; padding: 1.5rem; margin-bottom: 1.5rem;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
            <h4 style="font-size: 1rem; font-weight: 600; color: #1c1917; margin: 0;">후기 2: 수원시 이** 고객님</h4>
            <span style="color: #f59e0b; font-size: 1rem;">★★★★★</span>
          </div>

          <div style="overflow-x: auto; margin-bottom: 1rem;">
            <table style="width: 100%; border-collapse: collapse; font-size: 0.813rem;">
              <tbody>
                <tr style="background: #f5f5f4;">
                  <td style="padding: 0.5rem; border: 1px solid #e7e5e4; font-weight: 600; width: 25%;">지역</td>
                  <td style="padding: 0.5rem; border: 1px solid #e7e5e4;">경기 수원시</td>
                  <td style="padding: 0.5rem; border: 1px solid #e7e5e4; font-weight: 600; width: 25%;">공간</td>
                  <td style="padding: 0.5rem; border: 1px solid #e7e5e4;">화장실 1개 (전체)</td>
                </tr>
                <tr style="background: white;">
                  <td style="padding: 0.5rem; border: 1px solid #e7e5e4; font-weight: 600;">상태</td>
                  <td style="padding: 0.5rem; border: 1px solid #e7e5e4;">신축 입주</td>
                  <td style="padding: 0.5rem; border: 1px solid #e7e5e4; font-weight: 600;">비용</td>
                  <td style="padding: 0.5rem; border: 1px solid #e7e5e4; color: #16a34a; font-weight: 600;">90만원</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div style="background: #f0fdf4; padding: 1rem; border-radius: 0.75rem; border-left: 4px solid #22c55e;">
            <p style="margin: 0; color: #166534; font-size: 0.875rem; line-height: 1.7; font-style: italic;">
              "견적 받았을 때 타업체보다 저렴해서 반신반의였는데,
              줄눈하고 나니 새집이 더 새집같아졌습니다!
              처음엔 바닥만 할까 했는데 벽까지 하길 정말 잘한 것 같아요.
              <strong>주변에 추천해주려구요 ㅎㅎ</strong>"
            </p>
          </div>
        </div>

        <!-- 후기 3 -->
        <div style="background: white; border: 1px solid #e7e5e4; border-radius: 1rem; padding: 1.5rem; margin-bottom: 1.5rem;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
            <h4 style="font-size: 1rem; font-weight: 600; color: #1c1917; margin: 0;">후기 3: 성남시 박** 고객님</h4>
            <span style="color: #f59e0b; font-size: 1rem;">★★★★★</span>
          </div>

          <div style="overflow-x: auto; margin-bottom: 1rem;">
            <table style="width: 100%; border-collapse: collapse; font-size: 0.813rem;">
              <tbody>
                <tr style="background: #f5f5f4;">
                  <td style="padding: 0.5rem; border: 1px solid #e7e5e4; font-weight: 600; width: 25%;">지역</td>
                  <td style="padding: 0.5rem; border: 1px solid #e7e5e4;">경기 성남시</td>
                  <td style="padding: 0.5rem; border: 1px solid #e7e5e4; font-weight: 600; width: 25%;">공간</td>
                  <td style="padding: 0.5rem; border: 1px solid #e7e5e4;">화장실 1개 (바닥)</td>
                </tr>
                <tr style="background: white;">
                  <td style="padding: 0.5rem; border: 1px solid #e7e5e4; font-weight: 600;">상태</td>
                  <td style="padding: 0.5rem; border: 1px solid #e7e5e4;">구축 (5년)</td>
                  <td style="padding: 0.5rem; border: 1px solid #e7e5e4; font-weight: 600;">비용</td>
                  <td style="padding: 0.5rem; border: 1px solid #e7e5e4; color: #16a34a; font-weight: 600;">35만원</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div style="background: #f0fdf4; padding: 1rem; border-radius: 0.75rem; border-left: 4px solid #22c55e;">
            <p style="margin: 0; color: #166534; font-size: 0.875rem; line-height: 1.7; font-style: italic;">
              "견적제시 업체 중 가장 정확하게 견적을 제시했어요.
              색상 제안도 예쁘고 작업도 꼼꼼하고 완벽해서
              <strong>가족들에게 추천하고 싶어요!</strong><br><br>
              구축이라 곰팡이가 심했는데 기계로 깔끔하게 다 제거해주셨어요.
              이제 완전 새 화장실 같아요."
            </p>
          </div>
        </div>

        <!-- 후기 4 -->
        <div style="background: white; border: 1px solid #e7e5e4; border-radius: 1rem; padding: 1.5rem; margin-bottom: 1.5rem;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
            <h4 style="font-size: 1rem; font-weight: 600; color: #1c1917; margin: 0;">후기 4: 인천 서구 최** 고객님</h4>
            <span style="color: #f59e0b; font-size: 1rem;">★★★★★</span>
          </div>

          <div style="overflow-x: auto; margin-bottom: 1rem;">
            <table style="width: 100%; border-collapse: collapse; font-size: 0.813rem;">
              <tbody>
                <tr style="background: #f5f5f4;">
                  <td style="padding: 0.5rem; border: 1px solid #e7e5e4; font-weight: 600; width: 25%;">지역</td>
                  <td style="padding: 0.5rem; border: 1px solid #e7e5e4;">인천 서구</td>
                  <td style="padding: 0.5rem; border: 1px solid #e7e5e4; font-weight: 600; width: 25%;">공간</td>
                  <td style="padding: 0.5rem; border: 1px solid #e7e5e4;">화장실 2개 (전체)</td>
                </tr>
                <tr style="background: white;">
                  <td style="padding: 0.5rem; border: 1px solid #e7e5e4; font-weight: 600;">상태</td>
                  <td style="padding: 0.5rem; border: 1px solid #e7e5e4;">구축 (10년)</td>
                  <td style="padding: 0.5rem; border: 1px solid #e7e5e4; font-weight: 600;">비용</td>
                  <td style="padding: 0.5rem; border: 1px solid #e7e5e4; color: #16a34a; font-weight: 600;">190만원</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div style="background: #f0fdf4; padding: 1rem; border-radius: 0.75rem; border-left: 4px solid #22c55e;">
            <p style="margin: 0; color: #166534; font-size: 0.875rem; line-height: 1.7; font-style: italic;">
              "10년 된 아파트라 줄눈이 완전 까맣게 변해있었어요.
              여러 업체 알아봤는데 하우스Pick이 가장 신뢰가 갔습니다.<br><br>
              정찰제라 현장에서 추가비용 없었고,
              시공 후 1달 지났는데 정말 깨끗하게 유지되고 있어요.
              <strong>5년 A/S가 있어서 더 안심이 됩니다.</strong>"
            </p>
          </div>
        </div>

        <!-- 후기 5 -->
        <div style="background: white; border: 1px solid #e7e5e4; border-radius: 1rem; padding: 1.5rem; margin-bottom: 1.5rem;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
            <h4 style="font-size: 1rem; font-weight: 600; color: #1c1917; margin: 0;">후기 5: 고양시 정** 고객님</h4>
            <span style="color: #f59e0b; font-size: 1rem;">★★★★★</span>
          </div>

          <div style="overflow-x: auto; margin-bottom: 1rem;">
            <table style="width: 100%; border-collapse: collapse; font-size: 0.813rem;">
              <tbody>
                <tr style="background: #f5f5f4;">
                  <td style="padding: 0.5rem; border: 1px solid #e7e5e4; font-weight: 600; width: 25%;">지역</td>
                  <td style="padding: 0.5rem; border: 1px solid #e7e5e4;">경기 고양시</td>
                  <td style="padding: 0.5rem; border: 1px solid #e7e5e4; font-weight: 600; width: 25%;">공간</td>
                  <td style="padding: 0.5rem; border: 1px solid #e7e5e4;">화장실 1개 (바닥+벽 일부)</td>
                </tr>
                <tr style="background: white;">
                  <td style="padding: 0.5rem; border: 1px solid #e7e5e4; font-weight: 600;">상태</td>
                  <td style="padding: 0.5rem; border: 1px solid #e7e5e4;">신축</td>
                  <td style="padding: 0.5rem; border: 1px solid #e7e5e4; font-weight: 600;">비용</td>
                  <td style="padding: 0.5rem; border: 1px solid #e7e5e4; color: #16a34a; font-weight: 600;">50만원</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div style="background: #f0fdf4; padding: 1rem; border-radius: 0.75rem; border-left: 4px solid #22c55e;">
            <p style="margin: 0; color: #166534; font-size: 0.875rem; line-height: 1.7; font-style: italic;">
              "새 아파트 입주 전에 줄눈 했어요.
              입주 후에 하려면 짐 다 치워야 해서 미리 하길 잘한 것 같아요.<br><br>
              기사님이 친절하시고 설명도 자세히 해주셨어요.
              마감이 정말 깔끔해서 만족합니다.
              <strong>친구들한테도 입주 전에 꼭 하라고 추천했어요!</strong>"
            </p>
          </div>
        </div>

        <!-- 3. 거실 시공 후기 -->
        <h2 style="font-size: 1.5rem; font-weight: 700; color: #1c1917; margin: 2rem 0 1rem; padding-top: 1rem; border-top: 1px solid #e7e5e4;">
          3. 거실 시공 후기
        </h2>

        <!-- 후기 6 -->
        <div style="background: white; border: 1px solid #e7e5e4; border-radius: 1rem; padding: 1.5rem; margin-bottom: 1.5rem;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
            <h4 style="font-size: 1rem; font-weight: 600; color: #1c1917; margin: 0;">후기 6: 송파구 한** 고객님</h4>
            <span style="color: #f59e0b; font-size: 1rem;">★★★★★</span>
          </div>

          <div style="overflow-x: auto; margin-bottom: 1rem;">
            <table style="width: 100%; border-collapse: collapse; font-size: 0.813rem;">
              <tbody>
                <tr style="background: #f5f5f4;">
                  <td style="padding: 0.5rem; border: 1px solid #e7e5e4; font-weight: 600; width: 25%;">지역</td>
                  <td style="padding: 0.5rem; border: 1px solid #e7e5e4;">서울 송파구</td>
                  <td style="padding: 0.5rem; border: 1px solid #e7e5e4; font-weight: 600; width: 25%;">공간</td>
                  <td style="padding: 0.5rem; border: 1px solid #e7e5e4;">거실 (25평)</td>
                </tr>
                <tr style="background: white;">
                  <td style="padding: 0.5rem; border: 1px solid #e7e5e4; font-weight: 600;">상태</td>
                  <td style="padding: 0.5rem; border: 1px solid #e7e5e4;">신축</td>
                  <td style="padding: 0.5rem; border: 1px solid #e7e5e4; font-weight: 600;">비용</td>
                  <td style="padding: 0.5rem; border: 1px solid #e7e5e4; color: #16a34a; font-weight: 600;">150만원</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div style="background: #f0fdf4; padding: 1rem; border-radius: 0.75rem; border-left: 4px solid #22c55e;">
            <p style="margin: 0; color: #166534; font-size: 0.875rem; line-height: 1.7; font-style: italic;">
              "거실 타일이 600각이라 줄눈이 많이 보여서 고민했어요.
              케라폭시로 하니까 광택이 나면서 고급스러워졌습니다.<br><br>
              면적이 넓어서 하루 종일 걸렸는데,
              기사님이 꼼꼼하게 작업해주셔서 결과물이 완벽해요.
              <strong>거실 줄눈 강추합니다!</strong>"
            </p>
          </div>
        </div>

        <!-- 4. 현관/베란다 시공 후기 -->
        <h2 style="font-size: 1.5rem; font-weight: 700; color: #1c1917; margin: 2rem 0 1rem; padding-top: 1rem; border-top: 1px solid #e7e5e4;">
          4. 현관/베란다 시공 후기
        </h2>

        <!-- 후기 7 -->
        <div style="background: white; border: 1px solid #e7e5e4; border-radius: 1rem; padding: 1.5rem; margin-bottom: 1.5rem;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
            <h4 style="font-size: 1rem; font-weight: 600; color: #1c1917; margin: 0;">후기 7: 용인시 강** 고객님</h4>
            <span style="color: #f59e0b; font-size: 1rem;">★★★★★</span>
          </div>

          <div style="overflow-x: auto; margin-bottom: 1rem;">
            <table style="width: 100%; border-collapse: collapse; font-size: 0.813rem;">
              <tbody>
                <tr style="background: #f5f5f4;">
                  <td style="padding: 0.5rem; border: 1px solid #e7e5e4; font-weight: 600; width: 25%;">지역</td>
                  <td style="padding: 0.5rem; border: 1px solid #e7e5e4;">경기 용인시</td>
                  <td style="padding: 0.5rem; border: 1px solid #e7e5e4; font-weight: 600; width: 25%;">공간</td>
                  <td style="padding: 0.5rem; border: 1px solid #e7e5e4;">현관 + 베란다</td>
                </tr>
                <tr style="background: white;">
                  <td style="padding: 0.5rem; border: 1px solid #e7e5e4; font-weight: 600;">상태</td>
                  <td style="padding: 0.5rem; border: 1px solid #e7e5e4;">신축</td>
                  <td style="padding: 0.5rem; border: 1px solid #e7e5e4; font-weight: 600;">비용</td>
                  <td style="padding: 0.5rem; border: 1px solid #e7e5e4; color: #16a34a; font-weight: 600;">20만원</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div style="background: #f0fdf4; padding: 1rem; border-radius: 0.75rem; border-left: 4px solid #22c55e;">
            <p style="margin: 0; color: #166534; font-size: 0.875rem; line-height: 1.7; font-style: italic;">
              "화장실은 다른 데서 하고, 현관이랑 베란다만 했어요.
              폴리우레아로 해서 가격도 저렴하고 결과도 깔끔해요.<br><br>
              솔직히 현관은 셀프할까 했는데,
              업체에서 하니까 마감이 확실히 다르네요.
              <strong>5만원인데 이 정도면 가성비 최고!</strong>"
            </p>
          </div>
        </div>

        <!-- 후기 8 -->
        <div style="background: white; border: 1px solid #e7e5e4; border-radius: 1rem; padding: 1.5rem; margin-bottom: 1.5rem;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
            <h4 style="font-size: 1rem; font-weight: 600; color: #1c1917; margin: 0;">후기 8: 부천시 윤** 고객님</h4>
            <span style="color: #f59e0b; font-size: 1rem;">★★★★☆</span>
          </div>

          <div style="overflow-x: auto; margin-bottom: 1rem;">
            <table style="width: 100%; border-collapse: collapse; font-size: 0.813rem;">
              <tbody>
                <tr style="background: #f5f5f4;">
                  <td style="padding: 0.5rem; border: 1px solid #e7e5e4; font-weight: 600; width: 25%;">지역</td>
                  <td style="padding: 0.5rem; border: 1px solid #e7e5e4;">경기 부천시</td>
                  <td style="padding: 0.5rem; border: 1px solid #e7e5e4; font-weight: 600; width: 25%;">공간</td>
                  <td style="padding: 0.5rem; border: 1px solid #e7e5e4;">현관 + 세탁실 + 베란다</td>
                </tr>
                <tr style="background: white;">
                  <td style="padding: 0.5rem; border: 1px solid #e7e5e4; font-weight: 600;">상태</td>
                  <td style="padding: 0.5rem; border: 1px solid #e7e5e4;">구축</td>
                  <td style="padding: 0.5rem; border: 1px solid #e7e5e4; font-weight: 600;">비용</td>
                  <td style="padding: 0.5rem; border: 1px solid #e7e5e4; color: #16a34a; font-weight: 600;">40만원</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div style="background: #f0fdf4; padding: 1rem; border-radius: 0.75rem; border-left: 4px solid #22c55e;">
            <p style="margin: 0; color: #166534; font-size: 0.875rem; line-height: 1.7; font-style: italic;">
              "이사 오면서 화장실은 리모델링했는데,
              현관이랑 세탁실, 베란다는 줄눈만 했어요.<br><br>
              구축이라 기존 줄눈이 지저분했는데 깔끔해졌습니다.
              폴리우레아인데도 생각보다 튼튼해 보여요.
              <strong>가격 대비 만족합니다!</strong>"
            </p>
          </div>
        </div>

        <!-- 5. 지역별 시공 후기 -->
        <h2 style="font-size: 1.5rem; font-weight: 700; color: #1c1917; margin: 2rem 0 1rem; padding-top: 1rem; border-top: 1px solid #e7e5e4;">
          5. 지역별 시공 후기
        </h2>

        <h3 style="font-size: 1.125rem; font-weight: 600; color: #1c1917; margin: 1.5rem 0 1rem;">📍 서울 후기 요약</h3>
        <div style="overflow-x: auto; margin-bottom: 1.5rem;">
          <table style="width: 100%; border-collapse: collapse; font-size: 0.875rem;">
            <thead>
              <tr style="background: #1c1917; color: white;">
                <th style="padding: 0.75rem; text-align: left; border: 1px solid #e7e5e4;">지역</th>
                <th style="padding: 0.75rem; text-align: center; border: 1px solid #e7e5e4;">후기 수</th>
                <th style="padding: 0.75rem; text-align: center; border: 1px solid #e7e5e4;">평균 평점</th>
              </tr>
            </thead>
            <tbody>
              <tr style="background: white;">
                <td style="padding: 0.75rem; border: 1px solid #e7e5e4;">강남구</td>
                <td style="padding: 0.75rem; text-align: center; border: 1px solid #e7e5e4;">15건</td>
                <td style="padding: 0.75rem; text-align: center; border: 1px solid #e7e5e4; color: #f59e0b;">4.9</td>
              </tr>
              <tr style="background: #f5f5f4;">
                <td style="padding: 0.75rem; border: 1px solid #e7e5e4;">송파구</td>
                <td style="padding: 0.75rem; text-align: center; border: 1px solid #e7e5e4;">12건</td>
                <td style="padding: 0.75rem; text-align: center; border: 1px solid #e7e5e4; color: #f59e0b;">4.9</td>
              </tr>
              <tr style="background: white;">
                <td style="padding: 0.75rem; border: 1px solid #e7e5e4;">강서구</td>
                <td style="padding: 0.75rem; text-align: center; border: 1px solid #e7e5e4;">10건</td>
                <td style="padding: 0.75rem; text-align: center; border: 1px solid #e7e5e4; color: #f59e0b;">4.8</td>
              </tr>
              <tr style="background: #f5f5f4;">
                <td style="padding: 0.75rem; border: 1px solid #e7e5e4;">마포구</td>
                <td style="padding: 0.75rem; text-align: center; border: 1px solid #e7e5e4;">8건</td>
                <td style="padding: 0.75rem; text-align: center; border: 1px solid #e7e5e4; color: #f59e0b;">5.0</td>
              </tr>
              <tr style="background: white;">
                <td style="padding: 0.75rem; border: 1px solid #e7e5e4;">영등포구</td>
                <td style="padding: 0.75rem; text-align: center; border: 1px solid #e7e5e4;">7건</td>
                <td style="padding: 0.75rem; text-align: center; border: 1px solid #e7e5e4; color: #f59e0b;">4.9</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 style="font-size: 1.125rem; font-weight: 600; color: #1c1917; margin: 1.5rem 0 1rem;">📍 경기 후기 요약</h3>
        <div style="overflow-x: auto; margin-bottom: 1.5rem;">
          <table style="width: 100%; border-collapse: collapse; font-size: 0.875rem;">
            <thead>
              <tr style="background: #1c1917; color: white;">
                <th style="padding: 0.75rem; text-align: left; border: 1px solid #e7e5e4;">지역</th>
                <th style="padding: 0.75rem; text-align: center; border: 1px solid #e7e5e4;">후기 수</th>
                <th style="padding: 0.75rem; text-align: center; border: 1px solid #e7e5e4;">평균 평점</th>
              </tr>
            </thead>
            <tbody>
              <tr style="background: white;">
                <td style="padding: 0.75rem; border: 1px solid #e7e5e4;">수원시</td>
                <td style="padding: 0.75rem; text-align: center; border: 1px solid #e7e5e4;">18건</td>
                <td style="padding: 0.75rem; text-align: center; border: 1px solid #e7e5e4; color: #f59e0b;">4.9</td>
              </tr>
              <tr style="background: #f5f5f4;">
                <td style="padding: 0.75rem; border: 1px solid #e7e5e4;">성남시</td>
                <td style="padding: 0.75rem; text-align: center; border: 1px solid #e7e5e4;">14건</td>
                <td style="padding: 0.75rem; text-align: center; border: 1px solid #e7e5e4; color: #f59e0b;">4.9</td>
              </tr>
              <tr style="background: white;">
                <td style="padding: 0.75rem; border: 1px solid #e7e5e4;">고양시</td>
                <td style="padding: 0.75rem; text-align: center; border: 1px solid #e7e5e4;">11건</td>
                <td style="padding: 0.75rem; text-align: center; border: 1px solid #e7e5e4; color: #f59e0b;">4.8</td>
              </tr>
              <tr style="background: #f5f5f4;">
                <td style="padding: 0.75rem; border: 1px solid #e7e5e4;">용인시</td>
                <td style="padding: 0.75rem; text-align: center; border: 1px solid #e7e5e4;">9건</td>
                <td style="padding: 0.75rem; text-align: center; border: 1px solid #e7e5e4; color: #f59e0b;">5.0</td>
              </tr>
              <tr style="background: white;">
                <td style="padding: 0.75rem; border: 1px solid #e7e5e4;">화성시</td>
                <td style="padding: 0.75rem; text-align: center; border: 1px solid #e7e5e4;">8건</td>
                <td style="padding: 0.75rem; text-align: center; border: 1px solid #e7e5e4; color: #f59e0b;">4.9</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 style="font-size: 1.125rem; font-weight: 600; color: #1c1917; margin: 1.5rem 0 1rem;">📍 인천 후기 요약</h3>
        <div style="overflow-x: auto; margin-bottom: 1.5rem;">
          <table style="width: 100%; border-collapse: collapse; font-size: 0.875rem;">
            <thead>
              <tr style="background: #1c1917; color: white;">
                <th style="padding: 0.75rem; text-align: left; border: 1px solid #e7e5e4;">지역</th>
                <th style="padding: 0.75rem; text-align: center; border: 1px solid #e7e5e4;">후기 수</th>
                <th style="padding: 0.75rem; text-align: center; border: 1px solid #e7e5e4;">평균 평점</th>
              </tr>
            </thead>
            <tbody>
              <tr style="background: white;">
                <td style="padding: 0.75rem; border: 1px solid #e7e5e4;">서구</td>
                <td style="padding: 0.75rem; text-align: center; border: 1px solid #e7e5e4;">6건</td>
                <td style="padding: 0.75rem; text-align: center; border: 1px solid #e7e5e4; color: #f59e0b;">4.9</td>
              </tr>
              <tr style="background: #f5f5f4;">
                <td style="padding: 0.75rem; border: 1px solid #e7e5e4;">남동구</td>
                <td style="padding: 0.75rem; text-align: center; border: 1px solid #e7e5e4;">5건</td>
                <td style="padding: 0.75rem; text-align: center; border: 1px solid #e7e5e4; color: #f59e0b;">5.0</td>
              </tr>
              <tr style="background: white;">
                <td style="padding: 0.75rem; border: 1px solid #e7e5e4;">부평구</td>
                <td style="padding: 0.75rem; text-align: center; border: 1px solid #e7e5e4;">4건</td>
                <td style="padding: 0.75rem; text-align: center; border: 1px solid #e7e5e4; color: #f59e0b;">4.8</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- 6. 카카오톡 실제 후기 -->
        <h2 style="font-size: 1.5rem; font-weight: 700; color: #1c1917; margin: 2rem 0 1rem; padding-top: 1rem; border-top: 1px solid #e7e5e4;">
          6. 카카오톡 실제 후기
        </h2>

        <h3 style="font-size: 1.125rem; font-weight: 600; color: #1c1917; margin: 1.5rem 0 1rem;">💬 실제 고객 메시지</h3>

        <div style="display: flex; flex-direction: column; gap: 1rem; margin-bottom: 1.5rem;">
          <div style="background: #fff9c4; padding: 1rem; border-radius: 1rem 1rem 1rem 0; max-width: 85%; border: 1px solid #fbc02d;">
            <p style="margin: 0 0 0.25rem 0; font-weight: 600; color: #f57f17; font-size: 0.75rem;">고객 A</p>
            <p style="margin: 0; color: #5d4037; font-size: 0.875rem;">"오늘 시공 너무 잘 됐어요! 감사합니다 😊"</p>
          </div>
          <div style="background: #fff9c4; padding: 1rem; border-radius: 1rem 1rem 1rem 0; max-width: 85%; border: 1px solid #fbc02d;">
            <p style="margin: 0 0 0.25rem 0; font-weight: 600; color: #f57f17; font-size: 0.75rem;">고객 B</p>
            <p style="margin: 0; color: #5d4037; font-size: 0.875rem;">"친구가 추천해서 했는데 역시 잘했네요. 저도 주변에 추천할게요!"</p>
          </div>
          <div style="background: #fff9c4; padding: 1rem; border-radius: 1rem 1rem 1rem 0; max-width: 85%; border: 1px solid #fbc02d;">
            <p style="margin: 0 0 0.25rem 0; font-weight: 600; color: #f57f17; font-size: 0.75rem;">고객 C</p>
            <p style="margin: 0; color: #5d4037; font-size: 0.875rem;">"1년 지났는데 아직도 첫날처럼 깨끗해요. 케라폭시 진짜 좋네요"</p>
          </div>
          <div style="background: #fff9c4; padding: 1rem; border-radius: 1rem 1rem 1rem 0; max-width: 85%; border: 1px solid #fbc02d;">
            <p style="margin: 0 0 0.25rem 0; font-weight: 600; color: #f57f17; font-size: 0.75rem;">고객 D</p>
            <p style="margin: 0; color: #5d4037; font-size: 0.875rem;">"처음에 비싸다 생각했는데 결과 보니까 돈값 합니다 👍"</p>
          </div>
          <div style="background: #fff9c4; padding: 1rem; border-radius: 1rem 1rem 1rem 0; max-width: 85%; border: 1px solid #fbc02d;">
            <p style="margin: 0 0 0.25rem 0; font-weight: 600; color: #f57f17; font-size: 0.75rem;">고객 E</p>
            <p style="margin: 0; color: #5d4037; font-size: 0.875rem;">"A/S 요청했는데 바로 와주셨어요. 역시 5년 보증 믿음직하네요"</p>
          </div>
        </div>

        <!-- 후기 요약 -->
        <h3 style="font-size: 1.125rem; font-weight: 600; color: #1c1917; margin: 1.5rem 0 1rem;">📊 고객들이 자주 언급하는 키워드</h3>

        <div style="overflow-x: auto; margin-bottom: 1.5rem;">
          <table style="width: 100%; border-collapse: collapse; font-size: 0.875rem;">
            <thead>
              <tr style="background: #1c1917; color: white;">
                <th style="padding: 0.75rem; text-align: left; border: 1px solid #e7e5e4;">키워드</th>
                <th style="padding: 0.75rem; text-align: center; border: 1px solid #e7e5e4;">언급 횟수</th>
              </tr>
            </thead>
            <tbody>
              <tr style="background: #dcfce7;">
                <td style="padding: 0.75rem; border: 1px solid #e7e5e4; font-weight: 600;">추천</td>
                <td style="padding: 0.75rem; text-align: center; border: 1px solid #e7e5e4;">89회</td>
              </tr>
              <tr style="background: white;">
                <td style="padding: 0.75rem; border: 1px solid #e7e5e4; font-weight: 600;">꼼꼼</td>
                <td style="padding: 0.75rem; text-align: center; border: 1px solid #e7e5e4;">67회</td>
              </tr>
              <tr style="background: #f5f5f4;">
                <td style="padding: 0.75rem; border: 1px solid #e7e5e4; font-weight: 600;">정찰제</td>
                <td style="padding: 0.75rem; text-align: center; border: 1px solid #e7e5e4;">54회</td>
              </tr>
              <tr style="background: white;">
                <td style="padding: 0.75rem; border: 1px solid #e7e5e4; font-weight: 600;">깔끔</td>
                <td style="padding: 0.75rem; text-align: center; border: 1px solid #e7e5e4;">48회</td>
              </tr>
              <tr style="background: #f5f5f4;">
                <td style="padding: 0.75rem; border: 1px solid #e7e5e4; font-weight: 600;">친절</td>
                <td style="padding: 0.75rem; text-align: center; border: 1px solid #e7e5e4;">41회</td>
              </tr>
              <tr style="background: white;">
                <td style="padding: 0.75rem; border: 1px solid #e7e5e4; font-weight: 600;">만족</td>
                <td style="padding: 0.75rem; text-align: center; border: 1px solid #e7e5e4;">38회</td>
              </tr>
              <tr style="background: #f5f5f4;">
                <td style="padding: 0.75rem; border: 1px solid #e7e5e4; font-weight: 600;">가성비</td>
                <td style="padding: 0.75rem; text-align: center; border: 1px solid #e7e5e4;">32회</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div style="background: #fef3c7; padding: 1.25rem; border-radius: 0.75rem; margin-bottom: 2rem;">
          <p style="margin: 0; color: #92400e; font-size: 1rem; font-weight: 600; text-align: center;">
            "정찰제 + 꼼꼼한 시공 = 추천"<br>
            <span style="font-weight: 400; font-size: 0.875rem;">이게 하우스Pick 후기의 공통점입니다.</span>
          </p>
        </div>

        <!-- 7. 후기 남기기 -->
        <h2 style="font-size: 1.5rem; font-weight: 700; color: #1c1917; margin: 2rem 0 1rem; padding-top: 1rem; border-top: 1px solid #e7e5e4;">
          7. 후기 남기기
        </h2>

        <p style="color: #57534e; margin-bottom: 1rem;">
          시공받으셨나요?<br>
          후기 남겨주시면 <strong>소정의 선물</strong>을 드립니다!
        </p>

        <h3 style="font-size: 1.125rem; font-weight: 600; color: #1c1917; margin: 1.5rem 0 1rem;">후기 작성 방법</h3>

        <ol style="margin: 0 0 1.5rem 0; padding-left: 1.5rem; color: #57534e; line-height: 2;">
          <li>채널톡으로 "후기 작성" 문의</li>
          <li>시공 사진 + 한줄평 전송</li>
          <li>확인 후 선물 발송</li>
        </ol>

        <h3 style="font-size: 1.125rem; font-weight: 600; color: #1c1917; margin: 1.5rem 0 1rem;">🎁 선물 안내</h3>

        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem; margin-bottom: 2rem;">
          <div style="background: #f0fdf4; padding: 1rem; border-radius: 0.75rem; text-align: center; border: 1px solid #bbf7d0;">
            <p style="margin: 0; font-size: 2rem;">☕</p>
            <p style="margin: 0.5rem 0 0 0; color: #166534; font-size: 0.875rem; font-weight: 600;">스타벅스 아메리카노<br>기프티콘</p>
          </div>
          <div style="background: #f0fdf4; padding: 1rem; border-radius: 0.75rem; text-align: center; border: 1px solid #bbf7d0;">
            <p style="margin: 0; font-size: 2rem;">💰</p>
            <p style="margin: 0.5rem 0 0 0; color: #166534; font-size: 0.875rem; font-weight: 600;">다음 시공<br>5,000원 할인</p>
          </div>
        </div>

        <!-- 상담 안내 -->
        <div style="background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); padding: 1.5rem; border-radius: 1rem; margin-top: 2rem; text-align: center;">
          <h3 style="font-size: 1.125rem; font-weight: 700; color: #92400e; margin: 0 0 0.75rem 0;">📞 상담 받기</h3>
          <p style="color: #78350f; margin: 0 0 1rem 0; font-size: 0.875rem;">
            후기가 마음에 드셨나요?<br>
            직접 경험해보세요!
          </p>
          <p style="font-weight: 700; color: #92400e; margin: 0; font-size: 1rem;">
            ☎ 010-6461-0131<br>
            💬 채널톡 상담 (24시간)
          </p>
        </div>

        <p style="color: #a8a29e; font-size: 0.75rem; text-align: center; margin-top: 2rem;">
          후기는 실제 고객님들의 동의를 받고 게재되었습니다.<br>
          최종 업데이트: 2025년 1월
        </p>`
}

// Self-DIY 페이지 SSG 콘텐츠
function generateSelfDiySSGContent() {
  return `
        <!-- 도입부 -->
        <div style="background: #f5f5f4; padding: 1.5rem; border-radius: 1rem; margin-bottom: 2rem; font-size: 1rem; color: #57534e; line-height: 1.8;">
          <p style="margin: 0 0 1rem 0;">줄눈시공, 직접 해볼까?</p>
          <p style="margin: 0 0 1rem 0;">업체에 맡기자니 비용이 부담되고...<br/>직접 하자니 잘 될지 걱정되고...</p>
          <p style="margin: 0;"><strong style="color: #1c1917;">솔직하게 비교</strong>해드립니다.<br/><span style="font-size: 0.875rem;">(저희가 업체라 업체 편들 것 같죠? 객관적으로 알려드릴게요)</span></p>
        </div>

        <!-- 목차 -->
        <div style="background: white; border: 1px solid #e7e5e4; border-radius: 1rem; padding: 1.5rem; margin-bottom: 2rem;">
          <h3 style="font-weight: 700; color: #1c1917; margin: 0 0 1rem 0; font-size: 1rem;">📋 목차</h3>
          <ol style="margin: 0; padding-left: 1.25rem; color: #57534e; line-height: 2;">
            <li><a href="#conclusion" style="color: #f59e0b; text-decoration: none;">결론부터</a></li>
            <li><a href="#cost" style="color: #f59e0b; text-decoration: none;">비용 비교</a></li>
            <li><a href="#difficulty" style="color: #f59e0b; text-decoration: none;">난이도 비교</a></li>
            <li><a href="#quality" style="color: #f59e0b; text-decoration: none;">결과물 비교</a></li>
            <li><a href="#howto" style="color: #f59e0b; text-decoration: none;">셀프 줄눈시공 방법</a></li>
            <li><a href="#reviews" style="color: #f59e0b; text-decoration: none;">셀프 후기 (성공/실패)</a></li>
            <li><a href="#self-ok" style="color: #f59e0b; text-decoration: none;">이런 경우는 셀프 가능</a></li>
            <li><a href="#pro-recommend" style="color: #f59e0b; text-decoration: none;">이런 경우는 업체 추천</a></li>
          </ol>
        </div>

        <!-- 1. 결론부터 -->
        <h2 id="conclusion" style="font-size: 1.5rem; font-weight: 700; color: #1c1917; margin: 2.5rem 0 1rem; padding-top: 1rem; border-top: 1px solid #e7e5e4;">1. 결론부터</h2>

        <h3 style="font-size: 1.125rem; font-weight: 700; color: #1c1917; margin: 1.5rem 0 1rem;">🎯 한 줄 요약</h3>
        <div style="overflow-x: auto; margin-bottom: 1.5rem;">
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

        <h3 style="font-size: 1.125rem; font-weight: 700; color: #1c1917; margin: 1.5rem 0 1rem;">왜?</h3>
        <ul style="list-style: none; padding: 0; margin: 0 0 1rem 0;">
          <li style="display: flex; gap: 0.5rem; margin-bottom: 0.5rem; color: #57534e;">
            <span>•</span><span><strong>셀프 가능한 줄눈:</strong> 폴리우레아, 일반 줄눈</span>
          </li>
          <li style="display: flex; gap: 0.5rem; color: #57534e;">
            <span>•</span><span><strong>셀프 불가능한 줄눈:</strong> 케라폭시 (에폭시)</span>
          </li>
        </ul>
        <div style="background: #fef3c7; padding: 1rem; border-radius: 0.75rem; margin-bottom: 2rem;">
          <p style="margin: 0; color: #92400e;">케라폭시는 2액형 에폭시라서 <strong>배합 비율이 중요</strong>합니다. 조금만 틀려도 안 굳거나 갈라집니다.</p>
        </div>

        <!-- 2. 비용 비교 -->
        <h2 id="cost" style="font-size: 1.5rem; font-weight: 700; color: #1c1917; margin: 2.5rem 0 1rem; padding-top: 1rem; border-top: 1px solid #e7e5e4;">2. 비용 비교</h2>

        <h3 style="font-size: 1.125rem; font-weight: 700; color: #1c1917; margin: 1.5rem 0 1rem;">💰 셀프 vs 업체 비용</h3>
        <div style="overflow-x: auto; margin-bottom: 1.5rem;">
          <table style="width: 100%; border-collapse: collapse; font-size: 0.875rem;">
            <thead>
              <tr style="background: #fef3c7;">
                <th style="padding: 0.75rem; text-align: left; border-bottom: 2px solid #f59e0b;">항목</th>
                <th style="padding: 0.75rem; text-align: center; border-bottom: 2px solid #f59e0b;">셀프</th>
                <th style="padding: 0.75rem; text-align: center; border-bottom: 2px solid #f59e0b;">업체 (하우스Pick)</th>
              </tr>
            </thead>
            <tbody>
              <tr style="border-bottom: 1px solid #e7e5e4;">
                <td style="padding: 0.75rem; font-weight: 600;">화장실 바닥</td>
                <td style="padding: 0.75rem; text-align: center;">3~5만원</td>
                <td style="padding: 0.75rem; text-align: center;">30만원</td>
              </tr>
              <tr style="border-bottom: 1px solid #e7e5e4;">
                <td style="padding: 0.75rem; font-weight: 600;">현관</td>
                <td style="padding: 0.75rem; text-align: center;">1~2만원</td>
                <td style="padding: 0.75rem; text-align: center;">5만원</td>
              </tr>
              <tr style="border-bottom: 1px solid #e7e5e4;">
                <td style="padding: 0.75rem; font-weight: 600;">베란다</td>
                <td style="padding: 0.75rem; text-align: center;">2~3만원</td>
                <td style="padding: 0.75rem; text-align: center;">15만원</td>
              </tr>
              <tr>
                <td style="padding: 0.75rem; font-weight: 600;">거실</td>
                <td style="padding: 0.75rem; text-align: center;">10~20만원</td>
                <td style="padding: 0.75rem; text-align: center;">150만원</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 style="font-size: 1.125rem; font-weight: 700; color: #1c1917; margin: 1.5rem 0 1rem;">셀프 비용 상세</h3>
        <div style="overflow-x: auto; margin-bottom: 1.5rem;">
          <table style="width: 100%; border-collapse: collapse; font-size: 0.875rem;">
            <thead>
              <tr style="background: #f5f5f4;">
                <th style="padding: 0.75rem; text-align: left; border-bottom: 2px solid #d6d3d1;">항목</th>
                <th style="padding: 0.75rem; text-align: center; border-bottom: 2px solid #d6d3d1;">가격</th>
                <th style="padding: 0.75rem; text-align: left; border-bottom: 2px solid #d6d3d1;">비고</th>
              </tr>
            </thead>
            <tbody>
              <tr style="border-bottom: 1px solid #e7e5e4;">
                <td style="padding: 0.75rem;">줄눈재</td>
                <td style="padding: 0.75rem; text-align: center;">1~3만원</td>
                <td style="padding: 0.75rem;">폴리우레아/일반</td>
              </tr>
              <tr style="border-bottom: 1px solid #e7e5e4;">
                <td style="padding: 0.75rem;">스크래퍼</td>
                <td style="padding: 0.75rem; text-align: center;">0.5만원</td>
                <td style="padding: 0.75rem;">기존 줄눈 제거</td>
              </tr>
              <tr style="border-bottom: 1px solid #e7e5e4;">
                <td style="padding: 0.75rem;">스펀지</td>
                <td style="padding: 0.75rem; text-align: center;">0.3만원</td>
                <td style="padding: 0.75rem;">마무리용</td>
              </tr>
              <tr style="border-bottom: 1px solid #e7e5e4;">
                <td style="padding: 0.75rem;">마스킹테이프</td>
                <td style="padding: 0.75rem; text-align: center;">0.5만원</td>
                <td style="padding: 0.75rem;">타일 보호</td>
              </tr>
              <tr style="background: #fef3c7;">
                <td style="padding: 0.75rem; font-weight: 700;">합계</td>
                <td style="padding: 0.75rem; text-align: center; font-weight: 700; color: #f59e0b;">2~5만원</td>
                <td style="padding: 0.75rem;"></td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 style="font-size: 1.125rem; font-weight: 700; color: #1c1917; margin: 1.5rem 0 1rem;">숨은 비용</h3>
        <div style="overflow-x: auto; margin-bottom: 1.5rem;">
          <table style="width: 100%; border-collapse: collapse; font-size: 0.875rem;">
            <thead>
              <tr style="background: #fee2e2;">
                <th style="padding: 0.75rem; text-align: left; border-bottom: 2px solid #fca5a5;">항목</th>
                <th style="padding: 0.75rem; text-align: center; border-bottom: 2px solid #fca5a5;">셀프</th>
                <th style="padding: 0.75rem; text-align: center; border-bottom: 2px solid #fca5a5;">업체</th>
              </tr>
            </thead>
            <tbody>
              <tr style="border-bottom: 1px solid #e7e5e4;">
                <td style="padding: 0.75rem;">시간</td>
                <td style="padding: 0.75rem; text-align: center; color: #dc2626;">하루~이틀</td>
                <td style="padding: 0.75rem; text-align: center; color: #16a34a;">2~3시간</td>
              </tr>
              <tr style="border-bottom: 1px solid #e7e5e4;">
                <td style="padding: 0.75rem;">실패 시</td>
                <td style="padding: 0.75rem; text-align: center; color: #dc2626;">재료비+시간</td>
                <td style="padding: 0.75rem; text-align: center;">-</td>
              </tr>
              <tr style="border-bottom: 1px solid #e7e5e4;">
                <td style="padding: 0.75rem;">재시공 (3년 후)</td>
                <td style="padding: 0.75rem; text-align: center; color: #dc2626;">또 셀프</td>
                <td style="padding: 0.75rem; text-align: center; color: #16a34a;">포함 (5년 A/S)</td>
              </tr>
              <tr>
                <td style="padding: 0.75rem;">체력</td>
                <td style="padding: 0.75rem; text-align: center;">💀</td>
                <td style="padding: 0.75rem; text-align: center;">-</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 style="font-size: 1.125rem; font-weight: 700; color: #1c1917; margin: 1.5rem 0 1rem;">실제 비용 (10년 기준)</h3>
        <div style="overflow-x: auto; margin-bottom: 1rem;">
          <table style="width: 100%; border-collapse: collapse; font-size: 0.875rem;">
            <thead>
              <tr style="background: #f5f5f4;">
                <th style="padding: 0.75rem; text-align: left; border-bottom: 2px solid #d6d3d1;">방식</th>
                <th style="padding: 0.75rem; text-align: left; border-bottom: 2px solid #d6d3d1;">비용 계산</th>
                <th style="padding: 0.75rem; text-align: center; border-bottom: 2px solid #d6d3d1;">합계</th>
              </tr>
            </thead>
            <tbody>
              <tr style="border-bottom: 1px solid #e7e5e4;">
                <td style="padding: 0.75rem;">셀프</td>
                <td style="padding: 0.75rem;">5만원 × 3회</td>
                <td style="padding: 0.75rem; text-align: center;">15만원 + 시간</td>
              </tr>
              <tr>
                <td style="padding: 0.75rem;">업체</td>
                <td style="padding: 0.75rem;">30만원 × 1회</td>
                <td style="padding: 0.75rem; text-align: center; font-weight: 600;">30만원</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div style="background: #fef3c7; padding: 1rem; border-radius: 0.75rem; margin-bottom: 2rem;">
          <p style="margin: 0; color: #92400e;"><strong>💡 셀프는 2~3년마다 다시 해야 합니다.</strong> 일반 줄눈재는 내구성이 낮아요.</p>
        </div>

        <!-- 3. 난이도 비교 -->
        <h2 id="difficulty" style="font-size: 1.5rem; font-weight: 700; color: #1c1917; margin: 2.5rem 0 1rem; padding-top: 1rem; border-top: 1px solid #e7e5e4;">3. 난이도 비교</h2>

        <h3 style="font-size: 1.125rem; font-weight: 700; color: #1c1917; margin: 1.5rem 0 1rem;">🔧 작업별 난이도</h3>
        <div style="overflow-x: auto; margin-bottom: 1.5rem;">
          <table style="width: 100%; border-collapse: collapse; font-size: 0.875rem;">
            <thead>
              <tr style="background: #fef3c7;">
                <th style="padding: 0.75rem; text-align: left; border-bottom: 2px solid #f59e0b;">작업</th>
                <th style="padding: 0.75rem; text-align: center; border-bottom: 2px solid #f59e0b;">난이도</th>
                <th style="padding: 0.75rem; text-align: left; border-bottom: 2px solid #f59e0b;">설명</th>
              </tr>
            </thead>
            <tbody>
              <tr style="border-bottom: 1px solid #e7e5e4;">
                <td style="padding: 0.75rem;">기존 줄눈 제거</td>
                <td style="padding: 0.75rem; text-align: center; color: #dc2626;">⭐⭐⭐⭐⭐</td>
                <td style="padding: 0.75rem;">가장 힘듦, 손목 아픔</td>
              </tr>
              <tr style="border-bottom: 1px solid #e7e5e4;">
                <td style="padding: 0.75rem;">줄눈재 바르기</td>
                <td style="padding: 0.75rem; text-align: center; color: #f59e0b;">⭐⭐⭐</td>
                <td style="padding: 0.75rem;">생각보다 쉬움</td>
              </tr>
              <tr style="border-bottom: 1px solid #e7e5e4;">
                <td style="padding: 0.75rem;">마무리 닦기</td>
                <td style="padding: 0.75rem; text-align: center; color: #16a34a;">⭐⭐</td>
                <td style="padding: 0.75rem;">빨리 해야 함</td>
              </tr>
              <tr>
                <td style="padding: 0.75rem;">케라폭시 배합</td>
                <td style="padding: 0.75rem; text-align: center; color: #dc2626;">⭐⭐⭐⭐⭐</td>
                <td style="padding: 0.75rem;">전문 기술 필요</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 style="font-size: 1.125rem; font-weight: 700; color: #1c1917; margin: 1.5rem 0 1rem;">가장 어려운 점: 기존 줄눈 제거</h3>
        <div style="background: #fee2e2; padding: 1.25rem; border-radius: 0.75rem; margin-bottom: 1rem;">
          <p style="margin: 0 0 1rem 0; font-weight: 700; color: #991b1b;">셀프의 최대 난관은 "제거"입니다.</p>
          <ul style="margin: 0; padding-left: 1.25rem; color: #b91c1c;">
            <li>손 스크래퍼: 2~3시간에 1㎡ (손목 파괴)</li>
            <li>전동 공구: 타일 깨짐 위험</li>
            <li>대충 제거: 새 줄눈 안 붙음</li>
          </ul>
        </div>
        <div style="background: #dcfce7; padding: 1rem; border-radius: 0.75rem; margin-bottom: 1.5rem;">
          <p style="margin: 0; color: #166534;"><strong>💡 업체는 전용 기계로 10분에 1㎡ 제거합니다.</strong></p>
        </div>

        <h3 style="font-size: 1.125rem; font-weight: 700; color: #1c1917; margin: 1.5rem 0 1rem;">자재별 난이도</h3>
        <div style="overflow-x: auto; margin-bottom: 2rem;">
          <table style="width: 100%; border-collapse: collapse; font-size: 0.875rem;">
            <thead>
              <tr style="background: #f5f5f4;">
                <th style="padding: 0.75rem; text-align: left; border-bottom: 2px solid #d6d3d1;">자재</th>
                <th style="padding: 0.75rem; text-align: center; border-bottom: 2px solid #d6d3d1;">셀프 난이도</th>
                <th style="padding: 0.75rem; text-align: left; border-bottom: 2px solid #d6d3d1;">이유</th>
              </tr>
            </thead>
            <tbody>
              <tr style="border-bottom: 1px solid #e7e5e4;">
                <td style="padding: 0.75rem;">일반 줄눈</td>
                <td style="padding: 0.75rem; text-align: center; color: #16a34a;">⭐⭐</td>
                <td style="padding: 0.75rem;">쉬움, 하지만 내구성 낮음</td>
              </tr>
              <tr style="border-bottom: 1px solid #e7e5e4;">
                <td style="padding: 0.75rem;">폴리우레아</td>
                <td style="padding: 0.75rem; text-align: center; color: #f59e0b;">⭐⭐⭐</td>
                <td style="padding: 0.75rem;">중간, 어느정도 가능</td>
              </tr>
              <tr>
                <td style="padding: 0.75rem;">케라폭시</td>
                <td style="padding: 0.75rem; text-align: center; color: #dc2626;">⭐⭐⭐⭐⭐</td>
                <td style="padding: 0.75rem;">불가능 (전문가 필요)</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- 4. 결과물 비교 -->
        <h2 id="quality" style="font-size: 1.5rem; font-weight: 700; color: #1c1917; margin: 2.5rem 0 1rem; padding-top: 1rem; border-top: 1px solid #e7e5e4;">4. 결과물 비교</h2>

        <h3 style="font-size: 1.125rem; font-weight: 700; color: #1c1917; margin: 1.5rem 0 1rem;">📊 품질 차이</h3>
        <div style="overflow-x: auto; margin-bottom: 1.5rem;">
          <table style="width: 100%; border-collapse: collapse; font-size: 0.875rem;">
            <thead>
              <tr style="background: #fef3c7;">
                <th style="padding: 0.75rem; text-align: left; border-bottom: 2px solid #f59e0b;">항목</th>
                <th style="padding: 0.75rem; text-align: center; border-bottom: 2px solid #f59e0b;">셀프 (일반 줄눈)</th>
                <th style="padding: 0.75rem; text-align: center; border-bottom: 2px solid #f59e0b;">업체 (케라폭시)</th>
              </tr>
            </thead>
            <tbody>
              <tr style="border-bottom: 1px solid #e7e5e4;">
                <td style="padding: 0.75rem; font-weight: 600;">마감</td>
                <td style="padding: 0.75rem; text-align: center;">울퉁불퉁 가능</td>
                <td style="padding: 0.75rem; text-align: center; color: #16a34a;">매끈함</td>
              </tr>
              <tr style="border-bottom: 1px solid #e7e5e4;">
                <td style="padding: 0.75rem; font-weight: 600;">색상</td>
                <td style="padding: 0.75rem; text-align: center;">변색 있음</td>
                <td style="padding: 0.75rem; text-align: center; color: #16a34a;">변색 없음</td>
              </tr>
              <tr style="border-bottom: 1px solid #e7e5e4;">
                <td style="padding: 0.75rem; font-weight: 600;">내구성</td>
                <td style="padding: 0.75rem; text-align: center;">2~3년</td>
                <td style="padding: 0.75rem; text-align: center; color: #16a34a; font-weight: 600;">10년+</td>
              </tr>
              <tr style="border-bottom: 1px solid #e7e5e4;">
                <td style="padding: 0.75rem; font-weight: 600;">방수</td>
                <td style="padding: 0.75rem; text-align: center;">보통</td>
                <td style="padding: 0.75rem; text-align: center; color: #16a34a;">최고</td>
              </tr>
              <tr>
                <td style="padding: 0.75rem; font-weight: 600;">곰팡이</td>
                <td style="padding: 0.75rem; text-align: center; color: #dc2626;">발생 가능</td>
                <td style="padding: 0.75rem; text-align: center; color: #16a34a;">거의 없음</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 style="font-size: 1.125rem; font-weight: 700; color: #1c1917; margin: 1.5rem 0 1rem;">Before & After 차이</h3>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 2rem;">
          <div style="background: #fee2e2; padding: 1.25rem; border-radius: 0.75rem;">
            <h4 style="font-weight: 700; color: #991b1b; margin: 0 0 0.75rem 0; font-size: 0.9375rem;">셀프 시공 6개월 후</h4>
            <ul style="margin: 0; padding-left: 1rem; color: #b91c1c; font-size: 0.875rem;">
              <li>일부 틈새 갈라짐</li>
              <li>색상 약간 변색</li>
              <li>모서리 들뜸 가능</li>
            </ul>
          </div>
          <div style="background: #dcfce7; padding: 1.25rem; border-radius: 0.75rem;">
            <h4 style="font-weight: 700; color: #166534; margin: 0 0 0.75rem 0; font-size: 0.9375rem;">업체 시공 3년 후</h4>
            <ul style="margin: 0; padding-left: 1rem; color: #15803d; font-size: 0.875rem;">
              <li>첫날과 동일</li>
              <li>변색 없음</li>
              <li>들뜸 없음</li>
            </ul>
          </div>
        </div>

        <!-- 5. 셀프 줄눈시공 방법 -->
        <h2 id="howto" style="font-size: 1.5rem; font-weight: 700; color: #1c1917; margin: 2.5rem 0 1rem; padding-top: 1rem; border-top: 1px solid #e7e5e4;">5. 셀프 줄눈시공 방법</h2>
        <p style="color: #57534e; margin-bottom: 1.5rem;">셀프로 도전하고 싶은 분들을 위해 방법을 알려드릴게요.</p>

        <h3 style="font-size: 1.125rem; font-weight: 700; color: #1c1917; margin: 1.5rem 0 1rem;">준비물</h3>
        <div style="overflow-x: auto; margin-bottom: 1.5rem;">
          <table style="width: 100%; border-collapse: collapse; font-size: 0.875rem;">
            <thead>
              <tr style="background: #f5f5f4;">
                <th style="padding: 0.75rem; text-align: left; border-bottom: 2px solid #d6d3d1;">품목</th>
                <th style="padding: 0.75rem; text-align: center; border-bottom: 2px solid #d6d3d1;">가격</th>
                <th style="padding: 0.75rem; text-align: left; border-bottom: 2px solid #d6d3d1;">구매처</th>
              </tr>
            </thead>
            <tbody>
              <tr style="border-bottom: 1px solid #e7e5e4;">
                <td style="padding: 0.75rem;">줄눈재 (폴리우레아)</td>
                <td style="padding: 0.75rem; text-align: center;">1~2만원</td>
                <td style="padding: 0.75rem;">인터넷, 철물점</td>
              </tr>
              <tr style="border-bottom: 1px solid #e7e5e4;">
                <td style="padding: 0.75rem;">스크래퍼</td>
                <td style="padding: 0.75rem; text-align: center;">5천원</td>
                <td style="padding: 0.75rem;">다이소, 철물점</td>
              </tr>
              <tr style="border-bottom: 1px solid #e7e5e4;">
                <td style="padding: 0.75rem;">스펀지</td>
                <td style="padding: 0.75rem; text-align: center;">3천원</td>
                <td style="padding: 0.75rem;">다이소</td>
              </tr>
              <tr style="border-bottom: 1px solid #e7e5e4;">
                <td style="padding: 0.75rem;">마스킹테이프</td>
                <td style="padding: 0.75rem; text-align: center;">5천원</td>
                <td style="padding: 0.75rem;">다이소</td>
              </tr>
              <tr style="border-bottom: 1px solid #e7e5e4;">
                <td style="padding: 0.75rem;">고무장갑</td>
                <td style="padding: 0.75rem; text-align: center;">1천원</td>
                <td style="padding: 0.75rem;">다이소</td>
              </tr>
              <tr>
                <td style="padding: 0.75rem;">물통</td>
                <td style="padding: 0.75rem; text-align: center;">-</td>
                <td style="padding: 0.75rem;">집에 있는 것</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Step 1 -->
        <div style="background: white; border: 1px solid #e7e5e4; border-radius: 1rem; padding: 1.5rem; margin-bottom: 1rem;">
          <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 1rem;">
            <span style="background: #f59e0b; color: white; width: 2.5rem; height: 2.5rem; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700; flex-shrink: 0; font-size: 1.125rem;">1</span>
            <h4 style="font-weight: 700; color: #1c1917; margin: 0;">기존 줄눈 제거 (2~4시간)</h4>
          </div>
          <ol style="margin: 0 0 1rem 0; padding-left: 1.5rem; color: #57534e; line-height: 1.8;">
            <li>스크래퍼로 기존 줄눈 긁어내기</li>
            <li>최대한 깊게 파내기 (2mm 이상)</li>
            <li>먼지 진공청소기로 제거</li>
          </ol>
          <div style="background: #fef3c7; padding: 0.75rem 1rem; border-radius: 0.5rem; margin-bottom: 0.5rem;">
            <p style="margin: 0; color: #92400e; font-size: 0.875rem;"><strong>💡 팁:</strong> 샤워기로 물 뿌리면서 하면 먼지가 덜 납니다.</p>
          </div>
          <div style="background: #fee2e2; padding: 0.75rem 1rem; border-radius: 0.5rem;">
            <p style="margin: 0; color: #991b1b; font-size: 0.875rem;"><strong>⚠️ 주의:</strong> 타일 긁히지 않게 조심!</p>
          </div>
        </div>

        <!-- Step 2 -->
        <div style="background: white; border: 1px solid #e7e5e4; border-radius: 1rem; padding: 1.5rem; margin-bottom: 1rem;">
          <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 1rem;">
            <span style="background: #f59e0b; color: white; width: 2.5rem; height: 2.5rem; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700; flex-shrink: 0; font-size: 1.125rem;">2</span>
            <h4 style="font-weight: 700; color: #1c1917; margin: 0;">청소 및 건조 (1시간)</h4>
          </div>
          <ol style="margin: 0 0 1rem 0; padding-left: 1.5rem; color: #57534e; line-height: 1.8;">
            <li>틈새의 먼지 완전히 제거</li>
            <li>물기 완전히 말리기</li>
            <li>드라이기 사용하면 빠름</li>
          </ol>
          <div style="background: #fef3c7; padding: 0.75rem 1rem; border-radius: 0.5rem;">
            <p style="margin: 0; color: #92400e; font-size: 0.875rem;"><strong>💡 팁:</strong> 물기 있으면 줄눈 안 붙어요!</p>
          </div>
        </div>

        <!-- Step 3 -->
        <div style="background: white; border: 1px solid #e7e5e4; border-radius: 1rem; padding: 1.5rem; margin-bottom: 1rem;">
          <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 1rem;">
            <span style="background: #f59e0b; color: white; width: 2.5rem; height: 2.5rem; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700; flex-shrink: 0; font-size: 1.125rem;">3</span>
            <h4 style="font-weight: 700; color: #1c1917; margin: 0;">줄눈재 시공 (1~2시간)</h4>
          </div>
          <ol style="margin: 0 0 1rem 0; padding-left: 1.5rem; color: #57534e; line-height: 1.8;">
            <li>줄눈재를 틈새에 밀어넣기</li>
            <li>스크래퍼로 누르며 채우기</li>
            <li>45도 각도로 여분 긁어내기</li>
          </ol>
          <div style="background: #fef3c7; padding: 0.75rem 1rem; border-radius: 0.5rem;">
            <p style="margin: 0; color: #92400e; font-size: 0.875rem;"><strong>💡 팁:</strong> 조금씩 나눠서 하세요. 한번에 많이 하면 굳어버립니다.</p>
          </div>
        </div>

        <!-- Step 4 -->
        <div style="background: white; border: 1px solid #e7e5e4; border-radius: 1rem; padding: 1.5rem; margin-bottom: 1rem;">
          <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 1rem;">
            <span style="background: #f59e0b; color: white; width: 2.5rem; height: 2.5rem; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700; flex-shrink: 0; font-size: 1.125rem;">4</span>
            <h4 style="font-weight: 700; color: #1c1917; margin: 0;">마무리 (30분)</h4>
          </div>
          <ol style="margin: 0 0 1rem 0; padding-left: 1.5rem; color: #57534e; line-height: 1.8;">
            <li>10~15분 후 표면 살짝 굳으면</li>
            <li>젖은 스펀지로 타일 위 잔여물 제거</li>
            <li>깨끗한 물로 여러 번 닦기</li>
          </ol>
          <div style="background: #fee2e2; padding: 0.75rem 1rem; border-radius: 0.5rem;">
            <p style="margin: 0; color: #991b1b; font-size: 0.875rem;"><strong>⚠️ 주의:</strong> 너무 빨리 닦으면 줄눈이 파이고, 너무 늦으면 안 닦입니다.</p>
          </div>
        </div>

        <!-- Step 5 -->
        <div style="background: white; border: 1px solid #e7e5e4; border-radius: 1rem; padding: 1.5rem; margin-bottom: 2rem;">
          <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 1rem;">
            <span style="background: #f59e0b; color: white; width: 2.5rem; height: 2.5rem; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700; flex-shrink: 0; font-size: 1.125rem;">5</span>
            <h4 style="font-weight: 700; color: #1c1917; margin: 0;">경화 (24시간)</h4>
          </div>
          <ol style="margin: 0; padding-left: 1.5rem; color: #57534e; line-height: 1.8;">
            <li>24시간 동안 물 사용 금지</li>
            <li>환기 잘 시키기</li>
            <li>밟지 않기</li>
          </ol>
        </div>

        <!-- 6. 셀프 후기 -->
        <h2 id="reviews" style="font-size: 1.5rem; font-weight: 700; color: #1c1917; margin: 2.5rem 0 1rem; padding-top: 1rem; border-top: 1px solid #e7e5e4;">6. 셀프 후기</h2>

        <h3 style="font-size: 1.125rem; font-weight: 700; color: #1c1917; margin: 1.5rem 0 1rem;">✅ 성공 사례</h3>
        <div style="background: #dcfce7; padding: 1.25rem; border-radius: 0.75rem; margin-bottom: 1rem; border-left: 4px solid #22c55e;">
          <p style="font-weight: 700; color: #166534; margin: 0 0 0.5rem 0;">현관 셀프 성공 - 경기도 김**</p>
          <p style="color: #15803d; margin: 0; font-size: 0.9375rem; line-height: 1.7;">"현관만 폴리우레아로 셀프 했어요. 면적이 작아서 2시간 정도 걸렸네요. 유튜브 보면서 하니까 할 만했어요. 다만 기존 줄눈 제거가 제일 힘들었어요. 손목 아파요 ㅠㅠ"</p>
        </div>
        <div style="background: #dcfce7; padding: 1.25rem; border-radius: 0.75rem; margin-bottom: 1.5rem; border-left: 4px solid #22c55e;">
          <p style="font-weight: 700; color: #166534; margin: 0 0 0.5rem 0;">베란다 셀프 성공 - 서울시 이**</p>
          <p style="color: #15803d; margin: 0; font-size: 0.9375rem; line-height: 1.7;">"베란다 바닥 3시간 걸렸어요. 생각보다 어렵진 않은데, 마감이 업체만큼 예쁘진 않아요. 그래도 비용 절약했으니 만족합니다."</p>
        </div>

        <h3 style="font-size: 1.125rem; font-weight: 700; color: #1c1917; margin: 1.5rem 0 1rem;">❌ 실패 사례</h3>
        <div style="background: #fee2e2; padding: 1.25rem; border-radius: 0.75rem; margin-bottom: 1rem; border-left: 4px solid #ef4444;">
          <p style="font-weight: 700; color: #991b1b; margin: 0 0 0.5rem 0;">화장실 셀프 실패 - 인천시 박**</p>
          <p style="color: #b91c1c; margin: 0; font-size: 0.9375rem; line-height: 1.7;">"화장실 바닥 셀프 시도했다가 망했어요... 기존 줄눈 제거를 대충 했더니 새 줄눈이 2주 만에 떨어졌어요. 결국 업체 불렀는데, 오히려 비용이 더 들었습니다. 제거 비용 추가로..."</p>
        </div>
        <div style="background: #fee2e2; padding: 1.25rem; border-radius: 0.75rem; margin-bottom: 1.5rem; border-left: 4px solid #ef4444;">
          <p style="font-weight: 700; color: #991b1b; margin: 0 0 0.5rem 0;">케라폭시 셀프 실패 - 수원시 최**</p>
          <p style="color: #b91c1c; margin: 0; font-size: 0.9375rem; line-height: 1.7;">"케라폭시 직접 해보려고 재료 샀어요. 배합 비율 잘못했는지 굳지를 않더라고요... 다 긁어내고 업체 부르느라 재료비+시간+업체비 다 날렸어요. 케라폭시는 절대 셀프 하지 마세요."</p>
        </div>

        <h3 style="font-size: 1.125rem; font-weight: 700; color: #1c1917; margin: 1.5rem 0 1rem;">셀프 후기 요약</h3>
        <div style="overflow-x: auto; margin-bottom: 2rem;">
          <table style="width: 100%; border-collapse: collapse; font-size: 0.875rem;">
            <thead>
              <tr style="background: #f5f5f4;">
                <th style="padding: 0.75rem; text-align: left; border-bottom: 2px solid #d6d3d1;">공간</th>
                <th style="padding: 0.75rem; text-align: center; border-bottom: 2px solid #d6d3d1;">성공률</th>
                <th style="padding: 0.75rem; text-align: left; border-bottom: 2px solid #d6d3d1;">후기</th>
              </tr>
            </thead>
            <tbody>
              <tr style="border-bottom: 1px solid #e7e5e4;">
                <td style="padding: 0.75rem;">현관</td>
                <td style="padding: 0.75rem; text-align: center; color: #16a34a; font-weight: 600;">70%</td>
                <td style="padding: 0.75rem;">면적 작아서 가능</td>
              </tr>
              <tr style="border-bottom: 1px solid #e7e5e4;">
                <td style="padding: 0.75rem;">베란다</td>
                <td style="padding: 0.75rem; text-align: center; color: #f59e0b; font-weight: 600;">60%</td>
                <td style="padding: 0.75rem;">가능하지만 힘듦</td>
              </tr>
              <tr style="border-bottom: 1px solid #e7e5e4;">
                <td style="padding: 0.75rem;">세탁실</td>
                <td style="padding: 0.75rem; text-align: center; color: #f59e0b; font-weight: 600;">60%</td>
                <td style="padding: 0.75rem;">베란다와 비슷</td>
              </tr>
              <tr style="border-bottom: 1px solid #e7e5e4;">
                <td style="padding: 0.75rem;">화장실</td>
                <td style="padding: 0.75rem; text-align: center; color: #dc2626; font-weight: 600;">30%</td>
                <td style="padding: 0.75rem;">실패 많음</td>
              </tr>
              <tr>
                <td style="padding: 0.75rem;">거실</td>
                <td style="padding: 0.75rem; text-align: center; color: #dc2626; font-weight: 600;">10%</td>
                <td style="padding: 0.75rem;">면적 커서 거의 불가</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- 7. 이런 경우는 셀프 가능 -->
        <h2 id="self-ok" style="font-size: 1.5rem; font-weight: 700; color: #1c1917; margin: 2.5rem 0 1rem; padding-top: 1rem; border-top: 1px solid #e7e5e4;">7. 이런 경우는 셀프 가능</h2>

        <h3 style="font-size: 1.125rem; font-weight: 700; color: #16a34a; margin: 1.5rem 0 1rem;">✅ 셀프 추천 상황</h3>
        <div style="display: flex; flex-direction: column; gap: 1rem; margin-bottom: 2rem;">
          <div style="background: #dcfce7; border: 1px solid #86efac; border-radius: 1rem; padding: 1.25rem;">
            <h4 style="font-weight: 700; color: #166534; margin: 0 0 0.5rem 0;">1. 현관만 할 때</h4>
            <ul style="margin: 0; padding-left: 1.25rem; color: #15803d; font-size: 0.875rem;">
              <li>면적 작음 (1~2㎡)</li>
              <li>물 많이 안 닿음</li>
              <li>실패해도 다시 하면 됨</li>
            </ul>
          </div>
          <div style="background: #dcfce7; border: 1px solid #86efac; border-radius: 1rem; padding: 1.25rem;">
            <h4 style="font-weight: 700; color: #166534; margin: 0 0 0.5rem 0;">2. 베란다/세탁실</h4>
            <ul style="margin: 0; padding-left: 1.25rem; color: #15803d; font-size: 0.875rem;">
              <li>면적 작음</li>
              <li>눈에 잘 안 띄는 공간</li>
              <li>폴리우레아로 충분</li>
            </ul>
          </div>
          <div style="background: #dcfce7; border: 1px solid #86efac; border-radius: 1rem; padding: 1.25rem;">
            <h4 style="font-weight: 700; color: #166534; margin: 0 0 0.5rem 0;">3. 손재주가 좋을 때</h4>
            <ul style="margin: 0; padding-left: 1.25rem; color: #15803d; font-size: 0.875rem;">
              <li>타일, 페인트 등 DIY 경험 있음</li>
              <li>유튜브 보고 따라할 자신 있음</li>
            </ul>
          </div>
          <div style="background: #dcfce7; border: 1px solid #86efac; border-radius: 1rem; padding: 1.25rem;">
            <h4 style="font-weight: 700; color: #166534; margin: 0 0 0.5rem 0;">4. 시간 여유가 있을 때</h4>
            <ul style="margin: 0; padding-left: 1.25rem; color: #15803d; font-size: 0.875rem;">
              <li>주말 하루 온종일 투자 가능</li>
              <li>실패해도 다시 할 시간 있음</li>
            </ul>
          </div>
          <div style="background: #dcfce7; border: 1px solid #86efac; border-radius: 1rem; padding: 1.25rem;">
            <h4 style="font-weight: 700; color: #166534; margin: 0 0 0.5rem 0;">5. 예산이 진짜 없을 때</h4>
            <ul style="margin: 0; padding-left: 1.25rem; color: #15803d; font-size: 0.875rem;">
              <li>5만원도 부담될 때</li>
              <li>결과물 퀄리티 포기 가능</li>
            </ul>
          </div>
        </div>

        <!-- 8. 이런 경우는 업체 추천 -->
        <h2 id="pro-recommend" style="font-size: 1.5rem; font-weight: 700; color: #1c1917; margin: 2.5rem 0 1rem; padding-top: 1rem; border-top: 1px solid #e7e5e4;">8. 이런 경우는 업체 추천</h2>

        <h3 style="font-size: 1.125rem; font-weight: 700; color: #dc2626; margin: 1.5rem 0 1rem;">❌ 셀프 비추천 상황</h3>
        <div style="display: flex; flex-direction: column; gap: 1rem; margin-bottom: 2rem;">
          <div style="background: #fee2e2; border: 1px solid #fca5a5; border-radius: 1rem; padding: 1.25rem;">
            <h4 style="font-weight: 700; color: #991b1b; margin: 0 0 0.5rem 0;">1. 화장실</h4>
            <ul style="margin: 0; padding-left: 1.25rem; color: #b91c1c; font-size: 0.875rem;">
              <li>면적 넓음</li>
              <li>방수 중요 (케라폭시 필요)</li>
              <li>실패하면 곰팡이 문제</li>
            </ul>
          </div>
          <div style="background: #fee2e2; border: 1px solid #fca5a5; border-radius: 1rem; padding: 1.25rem;">
            <h4 style="font-weight: 700; color: #991b1b; margin: 0 0 0.5rem 0;">2. 거실</h4>
            <ul style="margin: 0; padding-left: 1.25rem; color: #b91c1c; font-size: 0.875rem;">
              <li>면적 너무 넓음</li>
              <li>셀프 불가능 수준</li>
              <li>결과물 차이 큼</li>
            </ul>
          </div>
          <div style="background: #fee2e2; border: 1px solid #fca5a5; border-radius: 1rem; padding: 1.25rem;">
            <h4 style="font-weight: 700; color: #991b1b; margin: 0 0 0.5rem 0;">3. 케라폭시 원할 때</h4>
            <ul style="margin: 0; padding-left: 1.25rem; color: #b91c1c; font-size: 0.875rem;">
              <li>2액형이라 배합 어려움</li>
              <li>틀리면 안 굳음</li>
              <li>전문 기술 필요</li>
            </ul>
          </div>
          <div style="background: #fee2e2; border: 1px solid #fca5a5; border-radius: 1rem; padding: 1.25rem;">
            <h4 style="font-weight: 700; color: #991b1b; margin: 0 0 0.5rem 0;">4. 구축 (오래된 집)</h4>
            <ul style="margin: 0; padding-left: 1.25rem; color: #b91c1c; font-size: 0.875rem;">
              <li>기존 줄눈 제거가 핵심</li>
              <li>손으로는 한계</li>
              <li>기계 필요</li>
            </ul>
          </div>
          <div style="background: #fee2e2; border: 1px solid #fca5a5; border-radius: 1rem; padding: 1.25rem;">
            <h4 style="font-weight: 700; color: #991b1b; margin: 0 0 0.5rem 0;">5. 깔끔한 마감 원할 때</h4>
            <ul style="margin: 0; padding-left: 1.25rem; color: #b91c1c; font-size: 0.875rem;">
              <li>셀프는 아무래도 티남</li>
              <li>손님 오는 집</li>
              <li>매매/전세 예정</li>
            </ul>
          </div>
          <div style="background: #fee2e2; border: 1px solid #fca5a5; border-radius: 1rem; padding: 1.25rem;">
            <h4 style="font-weight: 700; color: #991b1b; margin: 0 0 0.5rem 0;">6. 시간 없을 때</h4>
            <ul style="margin: 0; padding-left: 1.25rem; color: #b91c1c; font-size: 0.875rem;">
              <li>셀프: 하루 이상</li>
              <li>업체: 2~3시간</li>
              <li>시간도 돈</li>
            </ul>
          </div>
          <div style="background: #fee2e2; border: 1px solid #fca5a5; border-radius: 1rem; padding: 1.25rem;">
            <h4 style="font-weight: 700; color: #991b1b; margin: 0 0 0.5rem 0;">7. A/S 원할 때</h4>
            <ul style="margin: 0; padding-left: 1.25rem; color: #b91c1c; font-size: 0.875rem;">
              <li>셀프: 셀프 A/S</li>
              <li>업체: 5년 무상 A/S</li>
            </ul>
          </div>
        </div>

        <!-- 최종 정리 -->
        <h2 style="font-size: 1.5rem; font-weight: 700; color: #1c1917; margin: 2.5rem 0 1rem; padding-top: 1rem; border-top: 1px solid #e7e5e4;">최종 정리</h2>

        <h3 style="font-size: 1.125rem; font-weight: 700; color: #1c1917; margin: 1.5rem 0 1rem;">📊 종합 비교</h3>
        <div style="overflow-x: auto; margin-bottom: 1.5rem;">
          <table style="width: 100%; border-collapse: collapse; font-size: 0.875rem;">
            <thead>
              <tr style="background: #fef3c7;">
                <th style="padding: 0.75rem; text-align: left; border-bottom: 2px solid #f59e0b;">항목</th>
                <th style="padding: 0.75rem; text-align: center; border-bottom: 2px solid #f59e0b;">셀프</th>
                <th style="padding: 0.75rem; text-align: center; border-bottom: 2px solid #f59e0b;">업체</th>
              </tr>
            </thead>
            <tbody>
              <tr style="border-bottom: 1px solid #e7e5e4;">
                <td style="padding: 0.75rem; font-weight: 600;">비용</td>
                <td style="padding: 0.75rem; text-align: center;">2~5만원</td>
                <td style="padding: 0.75rem; text-align: center;">30~150만원</td>
              </tr>
              <tr style="border-bottom: 1px solid #e7e5e4;">
                <td style="padding: 0.75rem; font-weight: 600;">시간</td>
                <td style="padding: 0.75rem; text-align: center;">하루 이상</td>
                <td style="padding: 0.75rem; text-align: center; color: #16a34a;">2~3시간</td>
              </tr>
              <tr style="border-bottom: 1px solid #e7e5e4;">
                <td style="padding: 0.75rem; font-weight: 600;">난이도</td>
                <td style="padding: 0.75rem; text-align: center;">중~상</td>
                <td style="padding: 0.75rem; text-align: center;">-</td>
              </tr>
              <tr style="border-bottom: 1px solid #e7e5e4;">
                <td style="padding: 0.75rem; font-weight: 600;">마감</td>
                <td style="padding: 0.75rem; text-align: center;">보통</td>
                <td style="padding: 0.75rem; text-align: center; color: #16a34a;">최고</td>
              </tr>
              <tr style="border-bottom: 1px solid #e7e5e4;">
                <td style="padding: 0.75rem; font-weight: 600;">내구성</td>
                <td style="padding: 0.75rem; text-align: center;">2~3년</td>
                <td style="padding: 0.75rem; text-align: center; color: #16a34a; font-weight: 600;">10년+</td>
              </tr>
              <tr>
                <td style="padding: 0.75rem; font-weight: 600;">A/S</td>
                <td style="padding: 0.75rem; text-align: center; color: #dc2626;">없음</td>
                <td style="padding: 0.75rem; text-align: center; color: #16a34a; font-weight: 600;">5년</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 style="font-size: 1.125rem; font-weight: 700; color: #1c1917; margin: 1.5rem 0 1rem;">🎯 결론</h3>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 2rem;">
          <div style="background: #dcfce7; padding: 1.25rem; border-radius: 0.75rem;">
            <h4 style="font-weight: 700; color: #166534; margin: 0 0 0.75rem 0;">셀프 하세요:</h4>
            <ul style="margin: 0; padding-left: 1rem; color: #15803d; font-size: 0.875rem;">
              <li>현관/베란다만</li>
              <li>폴리우레아로</li>
              <li>시간 여유 있을 때</li>
            </ul>
          </div>
          <div style="background: #fef3c7; padding: 1.25rem; border-radius: 0.75rem;">
            <h4 style="font-weight: 700; color: #92400e; margin: 0 0 0.75rem 0;">업체 맡기세요:</h4>
            <ul style="margin: 0; padding-left: 1rem; color: #a16207; font-size: 0.875rem;">
              <li>화장실/거실</li>
              <li>케라폭시 원하면</li>
              <li>깔끔한 마감 원하면</li>
              <li>시간 없으면</li>
            </ul>
          </div>
        </div>

        <!-- 상담 CTA -->
        <div style="background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); padding: 2rem; border-radius: 1rem; text-align: center; margin-top: 2rem;">
          <h3 style="font-weight: 700; color: #92400e; margin: 0 0 1rem 0; font-size: 1.25rem;">📞 상담 받기</h3>
          <p style="color: #a16207; margin: 0 0 1rem 0;">셀프할지 업체 맡길지 고민되시면 상담받아보세요.<br/>상황에 맞는 솔직한 조언 드립니다.</p>
          <p style="color: #78716c; font-size: 0.875rem; margin: 0 0 1.5rem 0;">(셀프가 나으면 셀프 하라고 말씀드려요. 괜히 돈 쓸 필요 없으니까요.)</p>
          <div style="display: flex; flex-direction: column; gap: 0.75rem; align-items: center;">
            <a href="tel:010-6461-0131" style="display: inline-flex; align-items: center; gap: 0.5rem; background: #f59e0b; color: white; padding: 0.75rem 1.5rem; border-radius: 9999px; text-decoration: none; font-weight: 600;">
              📞 010-6461-0131
            </a>
            <span style="color: #78716c; font-size: 0.875rem;">💬 채널톡 상담 (24시간)</span>
          </div>
        </div>

        <p style="color: #a8a29e; font-size: 0.75rem; text-align: center; margin-top: 2rem;">최종 업데이트: 2025년 1월</p>`
}

// Find 페이지 SSG 콘텐츠
function generateFindSSGContent() {
  return `
        <!-- 인트로 -->
        <div style="background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); padding: 1.5rem; border-radius: 1rem; margin-bottom: 2rem;">
          <p style="color: #92400e; font-size: 1rem; line-height: 1.8; margin: 0;">
            줄눈업체, 어떻게 골라야 할까요?<br>
            인터넷에 업체가 너무 많아서 뭘 기준으로 선택해야 할지 모르겠다고요?<br><br>
            좋은 업체 특징, 피해야 할 업체, 가격 비교 방법까지<br>
            <strong>줄눈업체 선택의 모든 것</strong>을 알려드립니다.
          </p>
        </div>

        <!-- 목차 -->
        <div style="background: #f5f5f4; padding: 1.25rem; border-radius: 0.75rem; margin-bottom: 2rem;">
          <p style="font-weight: 700; color: #1c1917; margin: 0 0 0.75rem 0;">📑 목차</p>
          <ol style="margin: 0; padding-left: 1.25rem; color: #57534e; font-size: 0.875rem; line-height: 1.8;">
            <li>좋은 줄눈업체 체크리스트</li>
            <li>피해야 할 업체 특징</li>
            <li>가격 비교 시 주의점</li>
            <li>신축 vs 구축 전문업체</li>
            <li>업체 비교 질문 리스트</li>
            <li>지역별 업체 찾기</li>
            <li>하우스Pick 소개</li>
          </ol>
        </div>

        <!-- 1. 좋은 줄눈업체 체크리스트 -->
        <h2 style="font-size: 1.5rem; font-weight: 700; color: #1c1917; margin: 2rem 0 1rem; padding-top: 1rem; border-top: 1px solid #e7e5e4;">
          1. 좋은 줄눈업체 체크리스트
        </h2>

        <h3 style="font-size: 1.125rem; font-weight: 600; color: #1c1917; margin: 1.5rem 0 1rem;">✅ 반드시 확인해야 할 5가지</h3>

        <div style="overflow-x: auto; margin-bottom: 1.5rem;">
          <table style="width: 100%; border-collapse: collapse; font-size: 0.875rem;">
            <thead>
              <tr style="background: #1c1917; color: white;">
                <th style="padding: 0.75rem; text-align: center; border: 1px solid #e7e5e4;">#</th>
                <th style="padding: 0.75rem; text-align: left; border: 1px solid #e7e5e4;">항목</th>
                <th style="padding: 0.75rem; text-align: left; border: 1px solid #e7e5e4;">확인 방법</th>
                <th style="padding: 0.75rem; text-align: center; border: 1px solid #e7e5e4;">중요도</th>
              </tr>
            </thead>
            <tbody>
              <tr style="background: #fef3c7;">
                <td style="padding: 0.75rem; text-align: center; border: 1px solid #e7e5e4;">1</td>
                <td style="padding: 0.75rem; border: 1px solid #e7e5e4; font-weight: 600;">가격표 공개</td>
                <td style="padding: 0.75rem; border: 1px solid #e7e5e4;">홈페이지에 가격 있는지</td>
                <td style="padding: 0.75rem; text-align: center; border: 1px solid #e7e5e4;">⭐⭐⭐⭐⭐</td>
              </tr>
              <tr style="background: #fef3c7;">
                <td style="padding: 0.75rem; text-align: center; border: 1px solid #e7e5e4;">2</td>
                <td style="padding: 0.75rem; border: 1px solid #e7e5e4; font-weight: 600;">A/S 기간</td>
                <td style="padding: 0.75rem; border: 1px solid #e7e5e4;">몇 년 보장하는지</td>
                <td style="padding: 0.75rem; text-align: center; border: 1px solid #e7e5e4;">⭐⭐⭐⭐⭐</td>
              </tr>
              <tr>
                <td style="padding: 0.75rem; text-align: center; border: 1px solid #e7e5e4; background: white;">3</td>
                <td style="padding: 0.75rem; border: 1px solid #e7e5e4; font-weight: 600; background: white;">사용 자재</td>
                <td style="padding: 0.75rem; border: 1px solid #e7e5e4; background: white;">케라폭시 등 명시하는지</td>
                <td style="padding: 0.75rem; text-align: center; border: 1px solid #e7e5e4; background: white;">⭐⭐⭐⭐</td>
              </tr>
              <tr>
                <td style="padding: 0.75rem; text-align: center; border: 1px solid #e7e5e4; background: white;">4</td>
                <td style="padding: 0.75rem; border: 1px solid #e7e5e4; font-weight: 600; background: white;">실제 후기</td>
                <td style="padding: 0.75rem; border: 1px solid #e7e5e4; background: white;">사진 포함된 후기 있는지</td>
                <td style="padding: 0.75rem; text-align: center; border: 1px solid #e7e5e4; background: white;">⭐⭐⭐⭐</td>
              </tr>
              <tr>
                <td style="padding: 0.75rem; text-align: center; border: 1px solid #e7e5e4; background: white;">5</td>
                <td style="padding: 0.75rem; border: 1px solid #e7e5e4; font-weight: 600; background: white;">사업자 등록</td>
                <td style="padding: 0.75rem; border: 1px solid #e7e5e4; background: white;">정식 업체인지</td>
                <td style="padding: 0.75rem; text-align: center; border: 1px solid #e7e5e4; background: white;">⭐⭐⭐</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- 1-1. 가격표 공개 -->
        <h4 style="font-size: 1rem; font-weight: 600; color: #1c1917; margin: 1.5rem 0 0.75rem;">1. 가격표 공개 ⭐⭐⭐⭐⭐</h4>

        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem; margin-bottom: 1rem;">
          <div style="background: #dcfce7; padding: 1rem; border-radius: 0.75rem;">
            <p style="font-weight: 600; color: #166534; margin: 0 0 0.5rem 0;">✅ 좋은 업체</p>
            <ul style="margin: 0; padding-left: 1.25rem; color: #166534; font-size: 0.875rem;">
              <li>홈페이지에 가격표 공개</li>
              <li>공간별, 범위별 상세 가격</li>
              <li>"정찰제" 명시</li>
            </ul>
          </div>
          <div style="background: #fee2e2; padding: 1rem; border-radius: 0.75rem;">
            <p style="font-weight: 600; color: #991b1b; margin: 0 0 0.5rem 0;">❌ 나쁜 업체</p>
            <ul style="margin: 0; padding-left: 1.25rem; color: #991b1b; font-size: 0.875rem;">
              <li>"현장 봐야 알아요"</li>
              <li>"상담해드릴게요"</li>
              <li>가격 공개 안 함</li>
            </ul>
          </div>
        </div>

        <div style="background: #fef3c7; padding: 1rem; border-radius: 0.75rem; margin: 1rem 0;">
          <p style="margin: 0; color: #92400e; font-size: 0.875rem;">
            💡 <strong>왜 중요한가요?</strong><br>
            가격을 숨기는 업체는 현장에서 가격을 올릴 가능성이 높습니다.<br>
            "원래 30만원인데, 상태가 안 좋아서 50만원이에요" 이런 식으로요.
          </p>
        </div>

        <!-- 1-2. A/S 기간 -->
        <h4 style="font-size: 1rem; font-weight: 600; color: #1c1917; margin: 1.5rem 0 0.75rem;">2. A/S 기간 ⭐⭐⭐⭐⭐</h4>

        <div style="overflow-x: auto; margin-bottom: 1rem;">
          <table style="width: 100%; border-collapse: collapse; font-size: 0.875rem;">
            <thead>
              <tr style="background: #1c1917; color: white;">
                <th style="padding: 0.75rem; text-align: center; border: 1px solid #e7e5e4;">A/S 기간</th>
                <th style="padding: 0.75rem; text-align: center; border: 1px solid #e7e5e4;">평가</th>
              </tr>
            </thead>
            <tbody>
              <tr style="background: #dcfce7;">
                <td style="padding: 0.75rem; text-align: center; border: 1px solid #e7e5e4; font-weight: 600;">5년</td>
                <td style="padding: 0.75rem; text-align: center; border: 1px solid #e7e5e4;">⭐ 최고</td>
              </tr>
              <tr style="background: #dcfce7;">
                <td style="padding: 0.75rem; text-align: center; border: 1px solid #e7e5e4; font-weight: 600;">3년</td>
                <td style="padding: 0.75rem; text-align: center; border: 1px solid #e7e5e4;">⭐ 좋음</td>
              </tr>
              <tr style="background: white;">
                <td style="padding: 0.75rem; text-align: center; border: 1px solid #e7e5e4;">1~2년</td>
                <td style="padding: 0.75rem; text-align: center; border: 1px solid #e7e5e4;">보통</td>
              </tr>
              <tr style="background: #fee2e2;">
                <td style="padding: 0.75rem; text-align: center; border: 1px solid #e7e5e4;">없음</td>
                <td style="padding: 0.75rem; text-align: center; border: 1px solid #e7e5e4;">❌ 피하세요</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div style="background: #fef3c7; padding: 1rem; border-radius: 0.75rem; margin: 1rem 0;">
          <p style="margin: 0; color: #92400e; font-size: 0.875rem;">
            💡 <strong>왜 중요한가요?</strong><br>
            A/S 기간이 길다 = 자신 있다는 뜻입니다.<br>
            제대로 시공하면 A/S 요청이 거의 없거든요.
          </p>
        </div>

        <!-- 1-3. 사용 자재 -->
        <h4 style="font-size: 1rem; font-weight: 600; color: #1c1917; margin: 1.5rem 0 0.75rem;">3. 사용 자재 ⭐⭐⭐⭐</h4>

        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem; margin-bottom: 1rem;">
          <div style="background: #f0fdf4; padding: 1rem; border-radius: 0.75rem; border: 1px solid #bbf7d0;">
            <p style="font-weight: 600; color: #166534; margin: 0 0 0.5rem 0;">✅ 확인할 것</p>
            <ul style="margin: 0; padding-left: 1.25rem; color: #166534; font-size: 0.875rem;">
              <li>어떤 줄눈재 사용하는지</li>
              <li>브랜드 명시하는지</li>
              <li>자재 선택 가능한지</li>
            </ul>
          </div>
          <div style="background: #fef2f2; padding: 1rem; border-radius: 0.75rem; border: 1px solid #fecaca;">
            <p style="font-weight: 600; color: #991b1b; margin: 0 0 0.5rem 0;">⚠️ 주의할 것</p>
            <ul style="margin: 0; padding-left: 1.25rem; color: #991b1b; font-size: 0.875rem;">
              <li>"프리미엄 줄눈" 같은 모호한 표현</li>
              <li>자재 정보 안 알려주는 업체</li>
              <li>너무 싼 경우 → 저가 자재 의심</li>
            </ul>
          </div>
        </div>

        <!-- 1-4. 실제 후기 -->
        <h4 style="font-size: 1rem; font-weight: 600; color: #1c1917; margin: 1.5rem 0 0.75rem;">4. 실제 후기 ⭐⭐⭐⭐</h4>

        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem; margin-bottom: 1rem;">
          <div style="background: #dcfce7; padding: 1rem; border-radius: 0.75rem;">
            <p style="font-weight: 600; color: #166534; margin: 0 0 0.5rem 0;">✅ 신뢰할 수 있는 후기</p>
            <ul style="margin: 0; padding-left: 1.25rem; color: #166534; font-size: 0.875rem;">
              <li>Before/After 사진 포함</li>
              <li>지역, 공간, 비용 구체적</li>
              <li>네이버 플레이스 등 공식 후기</li>
            </ul>
          </div>
          <div style="background: #fee2e2; padding: 1rem; border-radius: 0.75rem;">
            <p style="font-weight: 600; color: #991b1b; margin: 0 0 0.5rem 0;">❌ 의심해야 할 후기</p>
            <ul style="margin: 0; padding-left: 1.25rem; color: #991b1b; font-size: 0.875rem;">
              <li>사진 없이 글만 있음</li>
              <li>너무 짧고 구체성 없음</li>
              <li>비슷한 문체의 후기 다수</li>
            </ul>
          </div>
        </div>

        <!-- 1-5. 사업자 등록 -->
        <h4 style="font-size: 1rem; font-weight: 600; color: #1c1917; margin: 1.5rem 0 0.75rem;">5. 사업자 등록 ⭐⭐⭐</h4>

        <div style="background: #f5f5f4; padding: 1rem; border-radius: 0.75rem; margin-bottom: 1rem;">
          <p style="font-weight: 600; color: #1c1917; margin: 0 0 0.5rem 0;">확인 방법</p>
          <ul style="margin: 0; padding-left: 1.25rem; color: #57534e; font-size: 0.875rem;">
            <li>홈페이지 하단 사업자번호</li>
            <li>국세청 사업자등록 조회</li>
            <li>정식 업체인지 확인</li>
          </ul>
        </div>

        <div style="background: #fef3c7; padding: 1rem; border-radius: 0.75rem; margin: 1rem 0;">
          <p style="margin: 0; color: #92400e; font-size: 0.875rem;">
            💡 <strong>왜 중요한가요?</strong><br>
            • 세금계산서/현금영수증 발행 가능<br>
            • 문제 시 법적 대응 가능<br>
            • 최소한의 신뢰 기준
          </p>
        </div>

        <!-- 2. 피해야 할 업체 특징 -->
        <h2 style="font-size: 1.5rem; font-weight: 700; color: #1c1917; margin: 2rem 0 1rem; padding-top: 1rem; border-top: 1px solid #e7e5e4;">
          2. 피해야 할 업체 특징
        </h2>

        <div style="background: #fee2e2; padding: 1.25rem; border-radius: 1rem; border: 2px solid #fca5a5; margin-bottom: 1.5rem;">
          <h3 style="font-weight: 700; color: #991b1b; margin: 0 0 1rem 0; font-size: 1.125rem;">❌ 이런 업체는 피하세요</h3>
        </div>

        <!-- 2-1. 가격이 너무 싼 업체 -->
        <h4 style="font-size: 1rem; font-weight: 600; color: #991b1b; margin: 1.5rem 0 0.75rem;">1. 가격이 너무 싼 업체</h4>

        <div style="overflow-x: auto; margin-bottom: 1rem;">
          <table style="width: 100%; border-collapse: collapse; font-size: 0.875rem;">
            <thead>
              <tr style="background: #991b1b; color: white;">
                <th style="padding: 0.75rem; text-align: left; border: 1px solid #e7e5e4;">표면 가격</th>
                <th style="padding: 0.75rem; text-align: left; border: 1px solid #e7e5e4;">실제 상황</th>
              </tr>
            </thead>
            <tbody>
              <tr style="background: #fee2e2;">
                <td style="padding: 0.75rem; border: 1px solid #e7e5e4;">"화장실 10만원"</td>
                <td style="padding: 0.75rem; border: 1px solid #e7e5e4;">일반 줄눈 (2년 후 재시공)</td>
              </tr>
              <tr style="background: #fee2e2;">
                <td style="padding: 0.75rem; border: 1px solid #e7e5e4;">"전체 50만원"</td>
                <td style="padding: 0.75rem; border: 1px solid #e7e5e4;">현장 추가금 요구</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div style="background: #fef2f2; padding: 1rem; border-radius: 0.75rem; border-left: 4px solid #ef4444; margin: 1rem 0;">
          <p style="margin: 0 0 0.5rem 0; font-weight: 600; color: #991b1b;">실제 사례</p>
          <p style="margin: 0; color: #7f1d1d; font-size: 0.875rem; font-style: italic;">
            "10만원이라고 해서 불렀더니, 곰팡이 제거 5만원, 실리콘 3만원, 결국 25만원 냈어요..."
          </p>
        </div>

        <!-- 2-2. 현장에서 가격 올리는 업체 -->
        <h4 style="font-size: 1rem; font-weight: 600; color: #991b1b; margin: 1.5rem 0 0.75rem;">2. 현장에서 가격 올리는 업체</h4>

        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem; margin-bottom: 1rem;">
          <div style="background: #fee2e2; padding: 1rem; border-radius: 0.75rem;">
            <p style="font-weight: 600; color: #991b1b; margin: 0 0 0.5rem 0;">⚠️ 주의 신호</p>
            <ul style="margin: 0; padding-left: 1.25rem; color: #991b1b; font-size: 0.875rem;">
              <li>"현장 보고 말씀드릴게요"</li>
              <li>"상태가 생각보다 안 좋네요"</li>
              <li>"이 정도면 추가 비용이..."</li>
            </ul>
          </div>
          <div style="background: #dcfce7; padding: 1rem; border-radius: 0.75rem;">
            <p style="font-weight: 600; color: #166534; margin: 0 0 0.5rem 0;">✅ 대응 방법</p>
            <ul style="margin: 0; padding-left: 1.25rem; color: #166534; font-size: 0.875rem;">
              <li>계약서에 가격 명시</li>
              <li>추가 비용 조건 사전 합의</li>
              <li>견적서 서면으로 받기</li>
            </ul>
          </div>
        </div>

        <!-- 2-3. A/S 애매한 업체 -->
        <h4 style="font-size: 1rem; font-weight: 600; color: #991b1b; margin: 1.5rem 0 0.75rem;">3. A/S 애매한 업체</h4>

        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem; margin-bottom: 1rem;">
          <div style="background: #fee2e2; padding: 1rem; border-radius: 0.75rem;">
            <p style="font-weight: 600; color: #991b1b; margin: 0 0 0.5rem 0;">⚠️ 위험 신호</p>
            <ul style="margin: 0; padding-left: 1.25rem; color: #991b1b; font-size: 0.875rem;">
              <li>"A/S 해드릴게요" (기간 명시 안 함)</li>
              <li>"상황 봐서요"</li>
              <li>구두로만 약속</li>
            </ul>
          </div>
          <div style="background: #f0fdf4; padding: 1rem; border-radius: 0.75rem;">
            <p style="font-weight: 600; color: #166534; margin: 0 0 0.5rem 0;">✅ 확인할 것</p>
            <ul style="margin: 0; padding-left: 1.25rem; color: #166534; font-size: 0.875rem;">
              <li>A/S 기간 명확히 (1년? 3년? 5년?)</li>
              <li>A/S 범위 (탈락? 변색? 전부?)</li>
              <li>서면 또는 문자로 확인</li>
            </ul>
          </div>
        </div>

        <!-- 2-4. 연락이 잘 안 되는 업체 -->
        <h4 style="font-size: 1rem; font-weight: 600; color: #991b1b; margin: 1.5rem 0 0.75rem;">4. 연락이 잘 안 되는 업체</h4>

        <div style="background: #fee2e2; padding: 1rem; border-radius: 0.75rem; margin-bottom: 1rem;">
          <p style="font-weight: 600; color: #991b1b; margin: 0 0 0.5rem 0;">⚠️ 위험 신호</p>
          <ul style="margin: 0; padding-left: 1.25rem; color: #991b1b; font-size: 0.875rem;">
            <li>전화 안 받음</li>
            <li>답장 늦음 (하루 이상)</li>
            <li>상담 중 불친절</li>
          </ul>
        </div>

        <div style="background: #fef3c7; padding: 1rem; border-radius: 0.75rem; margin: 1rem 0;">
          <p style="margin: 0; color: #92400e; font-size: 0.875rem;">
            💡 <strong>왜 문제인가요?</strong><br>
            시공 전에 연락 안 되면, A/S 때는 더 안 됩니다.
          </p>
        </div>

        <!-- 2-5. 후기가 없거나 의심스러운 업체 -->
        <h4 style="font-size: 1rem; font-weight: 600; color: #991b1b; margin: 1.5rem 0 0.75rem;">5. 후기가 없거나 의심스러운 업체</h4>

        <div style="background: #fee2e2; padding: 1rem; border-radius: 0.75rem; margin-bottom: 1rem;">
          <p style="font-weight: 600; color: #991b1b; margin: 0 0 0.5rem 0;">⚠️ 위험 신호</p>
          <ul style="margin: 0; padding-left: 1.25rem; color: #991b1b; font-size: 0.875rem;">
            <li>후기 0건</li>
            <li>사진 없는 후기만</li>
            <li>후기 내용이 비슷비슷</li>
          </ul>
        </div>

        <!-- 3. 가격 비교 시 주의점 -->
        <h2 style="font-size: 1.5rem; font-weight: 700; color: #1c1917; margin: 2rem 0 1rem; padding-top: 1rem; border-top: 1px solid #e7e5e4;">
          3. 가격 비교 시 주의점
        </h2>

        <h3 style="font-size: 1.125rem; font-weight: 600; color: #1c1917; margin: 1.5rem 0 1rem;">📊 동일 조건으로 비교하세요</h3>

        <p style="font-weight: 600; color: #1c1917; margin: 1rem 0 0.5rem;">비교해야 할 항목</p>

        <div style="overflow-x: auto; margin-bottom: 1.5rem;">
          <table style="width: 100%; border-collapse: collapse; font-size: 0.875rem;">
            <thead>
              <tr style="background: #1c1917; color: white;">
                <th style="padding: 0.75rem; text-align: left; border: 1px solid #e7e5e4;">항목</th>
                <th style="padding: 0.75rem; text-align: left; border: 1px solid #e7e5e4;">확인할 것</th>
              </tr>
            </thead>
            <tbody>
              <tr style="background: white;">
                <td style="padding: 0.75rem; border: 1px solid #e7e5e4; font-weight: 600;">자재</td>
                <td style="padding: 0.75rem; border: 1px solid #e7e5e4;">케라폭시? 일반 줄눈?</td>
              </tr>
              <tr style="background: #f5f5f4;">
                <td style="padding: 0.75rem; border: 1px solid #e7e5e4; font-weight: 600;">범위</td>
                <td style="padding: 0.75rem; border: 1px solid #e7e5e4;">바닥만? 벽 포함?</td>
              </tr>
              <tr style="background: white;">
                <td style="padding: 0.75rem; border: 1px solid #e7e5e4; font-weight: 600;">신축/구축</td>
                <td style="padding: 0.75rem; border: 1px solid #e7e5e4;">제거 작업 포함?</td>
              </tr>
              <tr style="background: #f5f5f4;">
                <td style="padding: 0.75rem; border: 1px solid #e7e5e4; font-weight: 600;">A/S</td>
                <td style="padding: 0.75rem; border: 1px solid #e7e5e4;">기간, 범위</td>
              </tr>
              <tr style="background: white;">
                <td style="padding: 0.75rem; border: 1px solid #e7e5e4; font-weight: 600;">추가 비용</td>
                <td style="padding: 0.75rem; border: 1px solid #e7e5e4;">출장비, 제거비 별도?</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 style="font-size: 1.125rem; font-weight: 600; color: #1c1917; margin: 1.5rem 0 1rem;">예시: 화장실 바닥 견적 비교</h3>

        <div style="overflow-x: auto; margin-bottom: 1rem;">
          <table style="width: 100%; border-collapse: collapse; font-size: 0.875rem;">
            <thead>
              <tr style="background: #1c1917; color: white;">
                <th style="padding: 0.75rem; text-align: left; border: 1px solid #e7e5e4;">업체</th>
                <th style="padding: 0.75rem; text-align: center; border: 1px solid #e7e5e4;">표면 가격</th>
                <th style="padding: 0.75rem; text-align: center; border: 1px solid #e7e5e4;">자재</th>
                <th style="padding: 0.75rem; text-align: center; border: 1px solid #e7e5e4;">A/S</th>
                <th style="padding: 0.75rem; text-align: left; border: 1px solid #e7e5e4;">실제 비용</th>
              </tr>
            </thead>
            <tbody>
              <tr style="background: #fee2e2;">
                <td style="padding: 0.75rem; border: 1px solid #e7e5e4;">A업체</td>
                <td style="padding: 0.75rem; text-align: center; border: 1px solid #e7e5e4;">15만원</td>
                <td style="padding: 0.75rem; text-align: center; border: 1px solid #e7e5e4;">일반</td>
                <td style="padding: 0.75rem; text-align: center; border: 1px solid #e7e5e4;">1년</td>
                <td style="padding: 0.75rem; border: 1px solid #e7e5e4;">15만원 + (3년 후 재시공 15만원) = <strong>30만원</strong></td>
              </tr>
              <tr style="background: #fef3c7;">
                <td style="padding: 0.75rem; border: 1px solid #e7e5e4;">B업체</td>
                <td style="padding: 0.75rem; text-align: center; border: 1px solid #e7e5e4;">25만원</td>
                <td style="padding: 0.75rem; text-align: center; border: 1px solid #e7e5e4;">아덱스</td>
                <td style="padding: 0.75rem; text-align: center; border: 1px solid #e7e5e4;">2년</td>
                <td style="padding: 0.75rem; border: 1px solid #e7e5e4;">25만원</td>
              </tr>
              <tr style="background: #dcfce7;">
                <td style="padding: 0.75rem; border: 1px solid #e7e5e4; font-weight: 600;">하우스Pick</td>
                <td style="padding: 0.75rem; text-align: center; border: 1px solid #e7e5e4;">30만원</td>
                <td style="padding: 0.75rem; text-align: center; border: 1px solid #e7e5e4; font-weight: 600;">케라폭시</td>
                <td style="padding: 0.75rem; text-align: center; border: 1px solid #e7e5e4; font-weight: 600;">5년</td>
                <td style="padding: 0.75rem; border: 1px solid #e7e5e4;">30만원 (10년 유지)</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div style="background: #fef3c7; padding: 1rem; border-radius: 0.75rem; margin: 1rem 0;">
          <p style="margin: 0; color: #92400e; font-size: 0.875rem;">
            💡 <strong>결론</strong><br>
            싸 보이는 게 결국 비쌉니다.<br>
            10년 기준으로 계산해보세요.
          </p>
        </div>

        <h3 style="font-size: 1.125rem; font-weight: 600; color: #1c1917; margin: 1.5rem 0 1rem;">숨은 비용 체크리스트</h3>

        <div style="overflow-x: auto; margin-bottom: 1.5rem;">
          <table style="width: 100%; border-collapse: collapse; font-size: 0.875rem;">
            <thead>
              <tr style="background: #1c1917; color: white;">
                <th style="padding: 0.75rem; text-align: left; border: 1px solid #e7e5e4;">항목</th>
                <th style="padding: 0.75rem; text-align: center; border: 1px solid #e7e5e4;">포함 여부 확인</th>
              </tr>
            </thead>
            <tbody>
              <tr style="background: white;">
                <td style="padding: 0.75rem; border: 1px solid #e7e5e4;">자재비</td>
                <td style="padding: 0.75rem; text-align: center; border: 1px solid #e7e5e4;">☐</td>
              </tr>
              <tr style="background: #f5f5f4;">
                <td style="padding: 0.75rem; border: 1px solid #e7e5e4;">인건비</td>
                <td style="padding: 0.75rem; text-align: center; border: 1px solid #e7e5e4;">☐</td>
              </tr>
              <tr style="background: white;">
                <td style="padding: 0.75rem; border: 1px solid #e7e5e4;">출장비</td>
                <td style="padding: 0.75rem; text-align: center; border: 1px solid #e7e5e4;">☐</td>
              </tr>
              <tr style="background: #f5f5f4;">
                <td style="padding: 0.75rem; border: 1px solid #e7e5e4;">기존 줄눈 제거</td>
                <td style="padding: 0.75rem; text-align: center; border: 1px solid #e7e5e4;">☐</td>
              </tr>
              <tr style="background: white;">
                <td style="padding: 0.75rem; border: 1px solid #e7e5e4;">실리콘 마감</td>
                <td style="padding: 0.75rem; text-align: center; border: 1px solid #e7e5e4;">☐</td>
              </tr>
              <tr style="background: #f5f5f4;">
                <td style="padding: 0.75rem; border: 1px solid #e7e5e4;">청소</td>
                <td style="padding: 0.75rem; text-align: center; border: 1px solid #e7e5e4;">☐</td>
              </tr>
              <tr style="background: white;">
                <td style="padding: 0.75rem; border: 1px solid #e7e5e4;">A/S</td>
                <td style="padding: 0.75rem; text-align: center; border: 1px solid #e7e5e4;">☐</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- 4. 신축 vs 구축 전문업체 -->
        <h2 style="font-size: 1.5rem; font-weight: 700; color: #1c1917; margin: 2rem 0 1rem; padding-top: 1rem; border-top: 1px solid #e7e5e4;">
          4. 신축 vs 구축 전문업체
        </h2>

        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem; margin-bottom: 1.5rem;">
          <!-- 신축 전문업체 -->
          <div style="background: #f0f9ff; padding: 1.25rem; border-radius: 0.75rem; border: 1px solid #bae6fd;">
            <h4 style="font-size: 1rem; font-weight: 600; color: #0369a1; margin: 0 0 1rem 0;">🏗️ 신축 전문업체</h4>

            <p style="font-weight: 600; color: #0c4a6e; margin: 0 0 0.5rem 0; font-size: 0.875rem;">특징</p>
            <ul style="margin: 0 0 1rem 0; padding-left: 1.25rem; color: #0369a1; font-size: 0.875rem;">
              <li>새 아파트 입주 시즌에 바쁨</li>
              <li>대량 시공 경험 많음</li>
              <li>가격 경쟁력 있음</li>
            </ul>

            <p style="font-weight: 600; color: #166534; margin: 0 0 0.25rem 0; font-size: 0.875rem;">✅ 장점</p>
            <ul style="margin: 0 0 0.75rem 0; padding-left: 1.25rem; color: #166534; font-size: 0.875rem;">
              <li>신축 특화 노하우</li>
              <li>빠른 시공</li>
            </ul>

            <p style="font-weight: 600; color: #991b1b; margin: 0 0 0.25rem 0; font-size: 0.875rem;">❌ 단점</p>
            <ul style="margin: 0; padding-left: 1.25rem; color: #991b1b; font-size: 0.875rem;">
              <li>구축 경험 부족할 수 있음</li>
              <li>기존 줄눈 제거 기술 부족</li>
            </ul>
          </div>

          <!-- 구축 전문업체 -->
          <div style="background: #fef3c7; padding: 1.25rem; border-radius: 0.75rem; border: 1px solid #fde68a;">
            <h4 style="font-size: 1rem; font-weight: 600; color: #92400e; margin: 0 0 1rem 0;">🔧 구축 전문업체</h4>

            <p style="font-weight: 600; color: #78350f; margin: 0 0 0.5rem 0; font-size: 0.875rem;">특징</p>
            <ul style="margin: 0 0 1rem 0; padding-left: 1.25rem; color: #92400e; font-size: 0.875rem;">
              <li>리모델링, 재시공 전문</li>
              <li>기계 제거 장비 보유</li>
              <li>다양한 상황 대응 가능</li>
            </ul>

            <p style="font-weight: 600; color: #166534; margin: 0 0 0.25rem 0; font-size: 0.875rem;">✅ 장점</p>
            <ul style="margin: 0 0 0.75rem 0; padding-left: 1.25rem; color: #166534; font-size: 0.875rem;">
              <li>어려운 상황도 해결</li>
              <li>기존 줄눈 완벽 제거</li>
            </ul>

            <p style="font-weight: 600; color: #991b1b; margin: 0 0 0.25rem 0; font-size: 0.875rem;">❌ 단점</p>
            <ul style="margin: 0; padding-left: 1.25rem; color: #991b1b; font-size: 0.875rem;">
              <li>가격이 다소 높을 수 있음</li>
            </ul>
          </div>
        </div>

        <h3 style="font-size: 1.125rem; font-weight: 600; color: #1c1917; margin: 1.5rem 0 1rem;">상황별 추천</h3>

        <div style="overflow-x: auto; margin-bottom: 1rem;">
          <table style="width: 100%; border-collapse: collapse; font-size: 0.875rem;">
            <thead>
              <tr style="background: #1c1917; color: white;">
                <th style="padding: 0.75rem; text-align: left; border: 1px solid #e7e5e4;">상황</th>
                <th style="padding: 0.75rem; text-align: left; border: 1px solid #e7e5e4;">추천</th>
              </tr>
            </thead>
            <tbody>
              <tr style="background: white;">
                <td style="padding: 0.75rem; border: 1px solid #e7e5e4;">신축 입주</td>
                <td style="padding: 0.75rem; border: 1px solid #e7e5e4;">신축/구축 모두 가능</td>
              </tr>
              <tr style="background: #fef3c7;">
                <td style="padding: 0.75rem; border: 1px solid #e7e5e4;">구축 재시공</td>
                <td style="padding: 0.75rem; border: 1px solid #e7e5e4; font-weight: 600;">구축 경험 있는 업체</td>
              </tr>
              <tr style="background: #fef3c7;">
                <td style="padding: 0.75rem; border: 1px solid #e7e5e4;">곰팡이 심한 경우</td>
                <td style="padding: 0.75rem; border: 1px solid #e7e5e4; font-weight: 600;">구축 전문업체</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div style="background: #dcfce7; padding: 1rem; border-radius: 0.75rem; margin: 1rem 0;">
          <p style="margin: 0; color: #166534; font-size: 0.875rem;">
            💡 <strong>하우스Pick은 신축/구축 모두 전문입니다.</strong>
          </p>
        </div>

        <!-- 5. 업체 비교 질문 리스트 -->
        <h2 style="font-size: 1.5rem; font-weight: 700; color: #1c1917; margin: 2rem 0 1rem; padding-top: 1rem; border-top: 1px solid #e7e5e4;">
          5. 업체 비교 질문 리스트
        </h2>

        <h3 style="font-size: 1.125rem; font-weight: 600; color: #1c1917; margin: 1.5rem 0 1rem;">📋 전화/상담 시 물어볼 것</h3>

        <!-- 가격 관련 -->
        <h4 style="font-size: 1rem; font-weight: 600; color: #1c1917; margin: 1.25rem 0 0.75rem; background: #f5f5f4; padding: 0.5rem 0.75rem; border-radius: 0.5rem;">💰 가격 관련</h4>
        <ol style="margin: 0 0 1rem 0; padding-left: 1.5rem; color: #57534e; font-size: 0.875rem; line-height: 2;">
          <li><strong>"화장실 바닥 얼마예요?"</strong> → 구체적 가격 확인</li>
          <li><strong>"이 가격이 최종 가격인가요?"</strong> → 추가 비용 여부</li>
          <li><strong>"견적서 보내주실 수 있나요?"</strong> → 서면 확인</li>
        </ol>

        <!-- 자재 관련 -->
        <h4 style="font-size: 1rem; font-weight: 600; color: #1c1917; margin: 1.25rem 0 0.75rem; background: #f5f5f4; padding: 0.5rem 0.75rem; border-radius: 0.5rem;">🧱 자재 관련</h4>
        <ol start="4" style="margin: 0 0 1rem 0; padding-left: 1.5rem; color: #57534e; font-size: 0.875rem; line-height: 2;">
          <li><strong>"어떤 줄눈재 사용하세요?"</strong> → 케라폭시/폴리우레아</li>
          <li><strong>"자재 선택 가능한가요?"</strong> → 옵션 확인</li>
        </ol>

        <!-- 작업 관련 -->
        <h4 style="font-size: 1rem; font-weight: 600; color: #1c1917; margin: 1.25rem 0 0.75rem; background: #f5f5f4; padding: 0.5rem 0.75rem; border-radius: 0.5rem;">🔧 작업 관련</h4>
        <ol start="6" style="margin: 0 0 1rem 0; padding-left: 1.5rem; color: #57534e; font-size: 0.875rem; line-height: 2;">
          <li><strong>"시공 시간 얼마나 걸리나요?"</strong> → 대략적 시간</li>
          <li><strong>"기존 줄눈 어떻게 제거하나요?"</strong> → 기계/손</li>
          <li><strong>"시공 후 언제부터 사용 가능해요?"</strong> → 경화 시간</li>
        </ol>

        <!-- A/S 관련 -->
        <h4 style="font-size: 1rem; font-weight: 600; color: #1c1917; margin: 1.25rem 0 0.75rem; background: #f5f5f4; padding: 0.5rem 0.75rem; border-radius: 0.5rem;">🛡️ A/S 관련</h4>
        <ol start="9" style="margin: 0 0 1rem 0; padding-left: 1.5rem; color: #57534e; font-size: 0.875rem; line-height: 2;">
          <li><strong>"A/S 기간이 어떻게 되나요?"</strong> → 정확한 기간</li>
          <li><strong>"어떤 경우에 A/S 되나요?"</strong> → 범위 확인</li>
        </ol>

        <!-- 기타 -->
        <h4 style="font-size: 1rem; font-weight: 600; color: #1c1917; margin: 1.25rem 0 0.75rem; background: #f5f5f4; padding: 0.5rem 0.75rem; border-radius: 0.5rem;">📝 기타</h4>
        <ol start="11" style="margin: 0 0 1rem 0; padding-left: 1.5rem; color: #57534e; font-size: 0.875rem; line-height: 2;">
          <li><strong>"주말 시공 가능한가요?"</strong> → 일정 유연성</li>
          <li><strong>"계약금 있나요?"</strong> → 결제 방식</li>
        </ol>

        <!-- 6. 지역별 업체 찾기 -->
        <h2 style="font-size: 1.5rem; font-weight: 700; color: #1c1917; margin: 2rem 0 1rem; padding-top: 1rem; border-top: 1px solid #e7e5e4;">
          6. 지역별 업체 찾기
        </h2>

        <!-- 서울 -->
        <h3 style="font-size: 1.125rem; font-weight: 600; color: #1c1917; margin: 1.5rem 0 1rem;">📍 서울</h3>
        <div style="overflow-x: auto; margin-bottom: 1.5rem;">
          <table style="width: 100%; border-collapse: collapse; font-size: 0.875rem;">
            <thead>
              <tr style="background: #1c1917; color: white;">
                <th style="padding: 0.75rem; text-align: left; border: 1px solid #e7e5e4;">지역</th>
                <th style="padding: 0.75rem; text-align: left; border: 1px solid #e7e5e4;">줄눈업체 찾기</th>
              </tr>
            </thead>
            <tbody>
              <tr style="background: white;">
                <td style="padding: 0.75rem; border: 1px solid #e7e5e4;">강남/서초/송파</td>
                <td style="padding: 0.75rem; border: 1px solid #e7e5e4;"><a href="/gangnam" style="color: #2563eb; text-decoration: underline;">강남 줄눈시공</a></td>
              </tr>
              <tr style="background: #f5f5f4;">
                <td style="padding: 0.75rem; border: 1px solid #e7e5e4;">강서/양천/영등포</td>
                <td style="padding: 0.75rem; border: 1px solid #e7e5e4;"><a href="/gangseo" style="color: #2563eb; text-decoration: underline;">강서 줄눈시공</a></td>
              </tr>
              <tr style="background: white;">
                <td style="padding: 0.75rem; border: 1px solid #e7e5e4;">마포/용산/중구</td>
                <td style="padding: 0.75rem; border: 1px solid #e7e5e4;"><a href="/mapo" style="color: #2563eb; text-decoration: underline;">마포 줄눈시공</a></td>
              </tr>
              <tr style="background: #f5f5f4;">
                <td style="padding: 0.75rem; border: 1px solid #e7e5e4;">성북/노원/도봉</td>
                <td style="padding: 0.75rem; border: 1px solid #e7e5e4;"><a href="/nowon" style="color: #2563eb; text-decoration: underline;">노원 줄눈시공</a></td>
              </tr>
              <tr style="background: white;">
                <td style="padding: 0.75rem; border: 1px solid #e7e5e4;">관악/동작/금천</td>
                <td style="padding: 0.75rem; border: 1px solid #e7e5e4;"><a href="/gwanak" style="color: #2563eb; text-decoration: underline;">관악 줄눈시공</a></td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- 경기 -->
        <h3 style="font-size: 1.125rem; font-weight: 600; color: #1c1917; margin: 1.5rem 0 1rem;">📍 경기</h3>
        <div style="overflow-x: auto; margin-bottom: 1.5rem;">
          <table style="width: 100%; border-collapse: collapse; font-size: 0.875rem;">
            <thead>
              <tr style="background: #1c1917; color: white;">
                <th style="padding: 0.75rem; text-align: left; border: 1px solid #e7e5e4;">지역</th>
                <th style="padding: 0.75rem; text-align: left; border: 1px solid #e7e5e4;">줄눈업체 찾기</th>
              </tr>
            </thead>
            <tbody>
              <tr style="background: white;">
                <td style="padding: 0.75rem; border: 1px solid #e7e5e4;">수원/화성/용인</td>
                <td style="padding: 0.75rem; border: 1px solid #e7e5e4;"><a href="/suwon" style="color: #2563eb; text-decoration: underline;">수원 줄눈시공</a></td>
              </tr>
              <tr style="background: #f5f5f4;">
                <td style="padding: 0.75rem; border: 1px solid #e7e5e4;">성남/분당/광주</td>
                <td style="padding: 0.75rem; border: 1px solid #e7e5e4;"><a href="/seongnam" style="color: #2563eb; text-decoration: underline;">성남 줄눈시공</a></td>
              </tr>
              <tr style="background: white;">
                <td style="padding: 0.75rem; border: 1px solid #e7e5e4;">고양/파주/김포</td>
                <td style="padding: 0.75rem; border: 1px solid #e7e5e4;"><a href="/goyang" style="color: #2563eb; text-decoration: underline;">고양 줄눈시공</a></td>
              </tr>
              <tr style="background: #f5f5f4;">
                <td style="padding: 0.75rem; border: 1px solid #e7e5e4;">안양/군포/의왕</td>
                <td style="padding: 0.75rem; border: 1px solid #e7e5e4;"><a href="/anyang" style="color: #2563eb; text-decoration: underline;">안양 줄눈시공</a></td>
              </tr>
              <tr style="background: white;">
                <td style="padding: 0.75rem; border: 1px solid #e7e5e4;">부천/광명</td>
                <td style="padding: 0.75rem; border: 1px solid #e7e5e4;"><a href="/bucheon" style="color: #2563eb; text-decoration: underline;">부천 줄눈시공</a></td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- 인천 -->
        <h3 style="font-size: 1.125rem; font-weight: 600; color: #1c1917; margin: 1.5rem 0 1rem;">📍 인천</h3>
        <div style="overflow-x: auto; margin-bottom: 1.5rem;">
          <table style="width: 100%; border-collapse: collapse; font-size: 0.875rem;">
            <thead>
              <tr style="background: #1c1917; color: white;">
                <th style="padding: 0.75rem; text-align: left; border: 1px solid #e7e5e4;">지역</th>
                <th style="padding: 0.75rem; text-align: left; border: 1px solid #e7e5e4;">줄눈업체 찾기</th>
              </tr>
            </thead>
            <tbody>
              <tr style="background: white;">
                <td style="padding: 0.75rem; border: 1px solid #e7e5e4;">서구/계양/부평</td>
                <td style="padding: 0.75rem; border: 1px solid #e7e5e4;"><a href="/incheon" style="color: #2563eb; text-decoration: underline;">인천 줄눈시공</a></td>
              </tr>
              <tr style="background: #f5f5f4;">
                <td style="padding: 0.75rem; border: 1px solid #e7e5e4;">남동/연수/송도</td>
                <td style="padding: 0.75rem; border: 1px solid #e7e5e4;"><a href="/incheon" style="color: #2563eb; text-decoration: underline;">인천 줄눈시공</a></td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- 7. 하우스Pick 소개 -->
        <h2 style="font-size: 1.5rem; font-weight: 700; color: #1c1917; margin: 2rem 0 1rem; padding-top: 1rem; border-top: 1px solid #e7e5e4;">
          7. 하우스Pick 소개
        </h2>

        <h3 style="font-size: 1.125rem; font-weight: 600; color: #1c1917; margin: 1.5rem 0 1rem;">왜 하우스Pick인가요?</h3>

        <div style="overflow-x: auto; margin-bottom: 1.5rem;">
          <table style="width: 100%; border-collapse: collapse; font-size: 0.875rem;">
            <thead>
              <tr style="background: #1c1917; color: white;">
                <th style="padding: 0.75rem; text-align: left; border: 1px solid #e7e5e4;">체크리스트</th>
                <th style="padding: 0.75rem; text-align: left; border: 1px solid #e7e5e4;">하우스Pick</th>
              </tr>
            </thead>
            <tbody>
              <tr style="background: #dcfce7;">
                <td style="padding: 0.75rem; border: 1px solid #e7e5e4;">✅ 가격표 공개</td>
                <td style="padding: 0.75rem; border: 1px solid #e7e5e4; font-weight: 600;">홈페이지 정찰제</td>
              </tr>
              <tr style="background: #dcfce7;">
                <td style="padding: 0.75rem; border: 1px solid #e7e5e4;">✅ A/S 5년</td>
                <td style="padding: 0.75rem; border: 1px solid #e7e5e4; font-weight: 600;">업계 최장</td>
              </tr>
              <tr style="background: #dcfce7;">
                <td style="padding: 0.75rem; border: 1px solid #e7e5e4;">✅ 케라폭시 사용</td>
                <td style="padding: 0.75rem; border: 1px solid #e7e5e4; font-weight: 600;">화장실 100%</td>
              </tr>
              <tr style="background: #dcfce7;">
                <td style="padding: 0.75rem; border: 1px solid #e7e5e4;">✅ 실제 후기</td>
                <td style="padding: 0.75rem; border: 1px solid #e7e5e4; font-weight: 600;">127건, 평점 4.9</td>
              </tr>
              <tr style="background: #dcfce7;">
                <td style="padding: 0.75rem; border: 1px solid #e7e5e4;">✅ 사업자 등록</td>
                <td style="padding: 0.75rem; border: 1px solid #e7e5e4; font-weight: 600;">정식 업체</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 style="font-size: 1.125rem; font-weight: 600; color: #1c1917; margin: 1.5rem 0 1rem;">하우스Pick 특징</h3>

        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem; margin-bottom: 1.5rem;">
          <div style="background: #f0fdf4; padding: 1rem; border-radius: 0.75rem; border: 1px solid #bbf7d0;">
            <h4 style="font-size: 0.875rem; font-weight: 600; color: #166534; margin: 0 0 0.5rem 0;">1. 정찰제</h4>
            <ul style="margin: 0; padding-left: 1.25rem; color: #166534; font-size: 0.813rem;">
              <li>홈페이지 가격 = 실제 가격</li>
              <li>추가 비용 없음</li>
              <li>견적 = 최종가</li>
            </ul>
          </div>
          <div style="background: #f0fdf4; padding: 1rem; border-radius: 0.75rem; border: 1px solid #bbf7d0;">
            <h4 style="font-size: 0.875rem; font-weight: 600; color: #166534; margin: 0 0 0.5rem 0;">2. 5년 무상 A/S</h4>
            <ul style="margin: 0; padding-left: 1.25rem; color: #166534; font-size: 0.813rem;">
              <li>업계 최장 보증</li>
              <li>탈락, 변색 무상 재시공</li>
              <li>카톡으로 간편 신청</li>
            </ul>
          </div>
          <div style="background: #f0fdf4; padding: 1rem; border-radius: 0.75rem; border: 1px solid #bbf7d0;">
            <h4 style="font-size: 0.875rem; font-weight: 600; color: #166534; margin: 0 0 0.5rem 0;">3. 기계 제거</h4>
            <ul style="margin: 0; padding-left: 1.25rem; color: #166534; font-size: 0.813rem;">
              <li>전용 기계로 완벽 제거</li>
              <li>대충 덧칠 ❌</li>
              <li>확실한 밑작업</li>
            </ul>
          </div>
          <div style="background: #f0fdf4; padding: 1rem; border-radius: 0.75rem; border: 1px solid #bbf7d0;">
            <h4 style="font-size: 0.875rem; font-weight: 600; color: #166534; margin: 0 0 0.5rem 0;">4. 친환경 자재</h4>
            <ul style="margin: 0; padding-left: 1.25rem; color: #166534; font-size: 0.813rem;">
              <li>유해물질 없음</li>
              <li>반려동물 안전</li>
              <li>아이 있어도 안심</li>
            </ul>
          </div>
        </div>

        <h3 style="font-size: 1.125rem; font-weight: 600; color: #1c1917; margin: 1.5rem 0 1rem;">가격표</h3>

        <div style="overflow-x: auto; margin-bottom: 1.5rem;">
          <table style="width: 100%; border-collapse: collapse; font-size: 0.875rem;">
            <thead>
              <tr style="background: #1c1917; color: white;">
                <th style="padding: 0.75rem; text-align: left; border: 1px solid #e7e5e4;">공간</th>
                <th style="padding: 0.75rem; text-align: center; border: 1px solid #e7e5e4;">신축</th>
                <th style="padding: 0.75rem; text-align: center; border: 1px solid #e7e5e4;">구축</th>
              </tr>
            </thead>
            <tbody>
              <tr style="background: white;">
                <td style="padding: 0.75rem; border: 1px solid #e7e5e4;">화장실 바닥</td>
                <td style="padding: 0.75rem; text-align: center; border: 1px solid #e7e5e4;">30만원</td>
                <td style="padding: 0.75rem; text-align: center; border: 1px solid #e7e5e4;">35만원</td>
              </tr>
              <tr style="background: #fef3c7;">
                <td style="padding: 0.75rem; border: 1px solid #e7e5e4; font-weight: 600;">화장실 전체</td>
                <td style="padding: 0.75rem; text-align: center; border: 1px solid #e7e5e4; font-weight: 600;">90만원</td>
                <td style="padding: 0.75rem; text-align: center; border: 1px solid #e7e5e4; font-weight: 600;">100만원</td>
              </tr>
              <tr style="background: white;">
                <td style="padding: 0.75rem; border: 1px solid #e7e5e4;">현관</td>
                <td style="padding: 0.75rem; text-align: center; border: 1px solid #e7e5e4;">5만원</td>
                <td style="padding: 0.75rem; text-align: center; border: 1px solid #e7e5e4;">10만원</td>
              </tr>
              <tr style="background: #f5f5f4;">
                <td style="padding: 0.75rem; border: 1px solid #e7e5e4;">베란다</td>
                <td style="padding: 0.75rem; text-align: center; border: 1px solid #e7e5e4;">15만원</td>
                <td style="padding: 0.75rem; text-align: center; border: 1px solid #e7e5e4;">15만원</td>
              </tr>
              <tr style="background: white;">
                <td style="padding: 0.75rem; border: 1px solid #e7e5e4;">세탁실</td>
                <td style="padding: 0.75rem; text-align: center; border: 1px solid #e7e5e4;">15만원</td>
                <td style="padding: 0.75rem; text-align: center; border: 1px solid #e7e5e4;">15만원</td>
              </tr>
              <tr style="background: #fef3c7;">
                <td style="padding: 0.75rem; border: 1px solid #e7e5e4; font-weight: 600;">거실</td>
                <td style="padding: 0.75rem; text-align: center; border: 1px solid #e7e5e4; font-weight: 600;">150만원</td>
                <td style="padding: 0.75rem; text-align: center; border: 1px solid #e7e5e4; font-weight: 600;">150만원</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- 결론 -->
        <h2 style="font-size: 1.5rem; font-weight: 700; color: #1c1917; margin: 2rem 0 1rem; padding-top: 1rem; border-top: 1px solid #e7e5e4;">
          결론
        </h2>

        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem; margin-bottom: 1.5rem;">
          <div style="background: #dcfce7; padding: 1.25rem; border-radius: 0.75rem;">
            <h3 style="font-size: 1rem; font-weight: 600; color: #166534; margin: 0 0 0.75rem 0;">✅ 좋은 업체 선택 요약</h3>
            <ol style="margin: 0; padding-left: 1.25rem; color: #166534; font-size: 0.875rem; line-height: 1.8;">
              <li><strong>가격표 공개</strong> 확인</li>
              <li><strong>A/S 기간</strong> 최소 3년 이상</li>
              <li><strong>케라폭시</strong> 사용하는지</li>
              <li><strong>실제 후기</strong> 사진 포함된 거</li>
              <li><strong>추가 비용</strong> 없는지 확인</li>
            </ol>
          </div>
          <div style="background: #fee2e2; padding: 1.25rem; border-radius: 0.75rem;">
            <h3 style="font-size: 1rem; font-weight: 600; color: #991b1b; margin: 0 0 0.75rem 0;">❌ 피해야 할 업체</h3>
            <ol style="margin: 0; padding-left: 1.25rem; color: #991b1b; font-size: 0.875rem; line-height: 1.8;">
              <li>가격 안 알려줌</li>
              <li>너무 쌈 (의심)</li>
              <li>A/S 애매함</li>
              <li>연락 잘 안 됨</li>
              <li>후기 없음</li>
            </ol>
          </div>
        </div>

        <!-- 상담 안내 -->
        <div style="background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); padding: 1.5rem; border-radius: 1rem; margin-top: 2rem; text-align: center;">
          <h3 style="font-size: 1.125rem; font-weight: 700; color: #92400e; margin: 0 0 0.75rem 0;">📞 상담 받기</h3>
          <p style="color: #78350f; margin: 0 0 1rem 0; font-size: 0.875rem;">
            업체 선택이 어려우시면,<br>
            일단 하우스Pick 상담받아 보세요.<br><br>
            부담 없이 비교해보시고 결정하셔도 됩니다.<br>
            <span style="font-size: 0.813rem;">(다른 업체가 더 좋으면 거기서 하셔도 돼요!)</span>
          </p>
          <p style="font-weight: 700; color: #92400e; margin: 0; font-size: 1rem;">
            ☎ 010-6461-0131<br>
            💬 채널톡 상담 (24시간)
          </p>
        </div>

        <p style="color: #a8a29e; font-size: 0.75rem; text-align: center; margin-top: 2rem;">최종 업데이트: 2025년 1월</p>`
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

    // OG 이미지 정보 (없으면 기본 이미지 사용)
    const ogImage = ogImageMap[service.slug] || { url: '/images/og/og-template.png', alt: '하우스Pick 줄눈시공' }

    // 템플릿 치환
    const html = template
      .replace(/\{\{PAGE_SLUG\}\}/g, service.slug)
      .replace(/\{\{PAGE_TITLE\}\}/g, service.title)
      .replace(/\{\{PAGE_DESCRIPTION\}\}/g, service.description)
      .replace(/\{\{PAGE_KEYWORDS\}\}/g, service.keywords)
      .replace(/\{\{PAGE_H1\}\}/g, service.h1)
      .replace(/\{\{PAGE_SUBTITLE\}\}/g, service.subtitle)
      .replace('{{OG_IMAGE}}', `${BASE_URL}${ogImage.url}`)
      .replace('{{OG_IMAGE_ALT}}', ogImage.alt)
      .replace('{{JSON_LD_SCHEMA}}', JSON.stringify(mainSchema, null, 2))
      .replace('{{BREADCRUMB_JSON_LD}}', JSON.stringify(breadcrumbSchema, null, 2))
      .replace(/\{\{SSG_CONTENT\}\}/g, ssgContent)
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
