import { useState, useRef, useEffect } from 'react'
import { mainNav } from '../data/navigation'

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState(null)
  const dropdownRef = useRef(null)

  // 외부 클릭 시 드롭다운 닫기
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setActiveDropdown(null)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // 모바일 메뉴 열릴 때 스크롤 방지
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [mobileMenuOpen])

  return (
    <header className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm shadow-sm z-40">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* 로고 */}
        <a href="/" className="font-black text-xl text-amber-600 hover:text-amber-700 transition-colors">
          HousePick
        </a>

        {/* 데스크톱 네비게이션 */}
        <nav className="hidden md:flex items-center gap-1" ref={dropdownRef}>
          {mainNav.map((item, index) => (
            item.children ? (
              // 드롭다운 메뉴
              <div key={index} className="relative">
                <button
                  className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    activeDropdown === index
                      ? 'text-amber-600 bg-amber-50'
                      : 'text-stone-700 hover:text-amber-600 hover:bg-stone-50'
                  }`}
                  onClick={() => setActiveDropdown(activeDropdown === index ? null : index)}
                  onMouseEnter={() => setActiveDropdown(index)}
                >
                  {item.name}
                  <svg className="w-4 h-4 ml-1 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* 드롭다운 패널 */}
                {activeDropdown === index && (
                  <div
                    className="absolute top-full left-0 mt-1 w-64 bg-white rounded-xl shadow-lg border border-stone-100 py-2 z-50"
                    onMouseLeave={() => setActiveDropdown(null)}
                  >
                    {item.children.map((child, childIndex) => (
                      <a
                        key={childIndex}
                        href={child.url}
                        className="block px-4 py-3 hover:bg-amber-50 transition-colors"
                      >
                        <span className="block text-sm font-medium text-stone-800">{child.name}</span>
                        {child.description && (
                          <span className="block text-xs text-stone-500 mt-0.5">{child.description}</span>
                        )}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              // 단일 링크
              <a
                key={index}
                href={item.url}
                className="px-3 py-2 text-sm font-medium text-stone-700 hover:text-amber-600 hover:bg-stone-50 rounded-lg transition-colors"
              >
                {item.name}
              </a>
            )
          ))}
        </nav>

        {/* 전화 버튼 + 모바일 햄버거 */}
        <div className="flex items-center gap-2">
          <a
            href="tel:010-6461-0131"
            className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white font-bold px-4 py-2 rounded-full transition-all text-sm"
          >
            <span className="animate-pulse">📞</span>
            <span className="hidden sm:inline">010-6461-0131</span>
            <span className="sm:hidden">전화</span>
          </a>

          {/* 모바일 햄버거 버튼 */}
          <button
            className="md:hidden p-2 text-stone-700 hover:text-amber-600 transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="메뉴 열기"
          >
            {mobileMenuOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* 모바일 메뉴 */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 top-[60px] bg-white z-50 overflow-y-auto">
          <nav className="p-4">
            {mainNav.map((item, index) => (
              item.children ? (
                // 모바일 드롭다운
                <div key={index} className="mb-2">
                  <div className="px-4 py-3 text-sm font-bold text-stone-500 uppercase tracking-wider">
                    {item.name}
                  </div>
                  {item.children.map((child, childIndex) => (
                    <a
                      key={childIndex}
                      href={child.url}
                      className="block px-4 py-3 text-stone-700 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <span className="font-medium">{child.name}</span>
                      {child.description && (
                        <span className="block text-xs text-stone-500 mt-0.5">{child.description}</span>
                      )}
                    </a>
                  ))}
                </div>
              ) : (
                // 단일 링크
                <a
                  key={index}
                  href={item.url}
                  className="block px-4 py-3 text-stone-700 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </a>
              )
            ))}

            {/* 모바일 CTA */}
            <div className="mt-6 pt-6 border-t border-stone-200">
              <a
                href="tel:010-6461-0131"
                className="flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-600 text-white font-bold px-6 py-4 rounded-xl transition-all text-lg"
              >
                📞 전화 상담하기
              </a>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
