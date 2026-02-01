import { getBreadcrumbItems } from '../data/navigation'

export default function Breadcrumb({ slug, regionName = null }) {
  const items = getBreadcrumbItems(slug, regionName)

  // JSON-LD BreadcrumbList 스키마
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url
    }))
  }

  return (
    <>
      {/* JSON-LD 스키마 */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* 브레드크럼 UI */}
      <nav className="bg-stone-100 py-3 px-6" aria-label="Breadcrumb">
        <div className="max-w-5xl mx-auto">
          <ol className="flex items-center flex-wrap gap-1 text-sm">
            {items.map((item, index) => (
              <li key={index} className="flex items-center">
                {index > 0 && (
                  <svg
                    className="w-4 h-4 mx-2 text-stone-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                )}
                {index === items.length - 1 ? (
                  // 현재 페이지 (링크 없음)
                  <span className="text-stone-800 font-medium">
                    {item.name}
                  </span>
                ) : (
                  // 링크
                  <a
                    href={item.url.replace('https://housepick-web.vercel.app', '')}
                    className="text-stone-600 hover:text-amber-600 transition-colors"
                  >
                    {item.name}
                  </a>
                )}
              </li>
            ))}
          </ol>
        </div>
      </nav>
    </>
  )
}
