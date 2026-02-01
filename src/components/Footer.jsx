import { footerServices, footerRegions } from '../data/navigation'

export default function Footer() {
  return (
    <footer className="bg-stone-900 text-stone-400 pt-12 pb-8 px-6">
      <div className="max-w-5xl mx-auto">
        {/* 상단 섹션: 서비스 / 지역 / 고객지원 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
          {/* 서비스 안내 */}
          <div>
            <h4 className="text-white font-bold mb-4 text-sm">서비스 안내</h4>
            <ul className="space-y-2">
              {footerServices.map((service, index) => (
                <li key={index}>
                  <a
                    href={service.url}
                    className="text-sm hover:text-amber-400 transition-colors"
                  >
                    {service.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* 지역별 서비스 */}
          <div>
            <h4 className="text-white font-bold mb-4 text-sm">지역별 서비스</h4>
            <ul className="space-y-2">
              {footerRegions.slice(0, 5).map((region, index) => (
                <li key={index}>
                  <a
                    href={`/${region.slug}`}
                    className="text-sm hover:text-amber-400 transition-colors"
                  >
                    {region.name} 줄눈시공
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* 지역별 서비스 (계속) */}
          <div>
            <h4 className="text-white font-bold mb-4 text-sm md:invisible">&nbsp;</h4>
            <ul className="space-y-2">
              {footerRegions.slice(5, 10).map((region, index) => (
                <li key={index}>
                  <a
                    href={`/${region.slug}`}
                    className="text-sm hover:text-amber-400 transition-colors"
                  >
                    {region.name} 줄눈시공
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* 고객지원 */}
          <div>
            <h4 className="text-white font-bold mb-4 text-sm">고객지원</h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="tel:010-6461-0131"
                  className="text-sm hover:text-amber-400 transition-colors flex items-center gap-2"
                >
                  📞 전화 상담
                </a>
              </li>
              <li>
                <span className="text-sm text-stone-500">
                  운영시간: 09:00 - 18:00
                </span>
              </li>
              <li className="pt-2">
                <a
                  href="tel:010-6461-0131"
                  className="inline-block bg-amber-500 hover:bg-amber-600 text-white text-sm font-bold px-4 py-2 rounded-full transition-colors"
                >
                  무료 견적 요청
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* 구분선 */}
        <div className="border-t border-stone-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            {/* 로고 및 슬로건 */}
            <div className="text-center md:text-left">
              <a href="/" className="font-black text-2xl text-amber-500 hover:text-amber-400 transition-colors">
                HousePick
              </a>
              <p className="text-stone-500 text-sm mt-1">
                업계 최초 정찰제 줄눈 브랜드
              </p>
            </div>

            {/* 사업자 정보 */}
            <div className="text-center md:text-right text-xs text-stone-600">
              <p>상호: 디테일라인 | 대표: 이정우</p>
              <p className="mt-1">© 2024 HousePick. All rights reserved.</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
