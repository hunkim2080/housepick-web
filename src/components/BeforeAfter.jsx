/**
 * Before/After 비교 이미지 컴포넌트
 * - 2열 그리드 (모바일에서 1열)
 * - Before: 빨간 라벨, After: 초록 라벨
 */
function BeforeAfter({ beforeSrc, afterSrc, beforeAlt, afterAlt, className = '' }) {
  const handleError = (e) => {
    e.target.src = '/images/placeholder.svg'
  }

  return (
    <div className={`before-after-container ${className}`}>
      <div className="before">
        <span className="ba-label">Before</span>
        <img
          src={beforeSrc}
          alt={beforeAlt}
          loading="lazy"
          onError={handleError}
        />
      </div>
      <div className="after">
        <span className="ba-label">After</span>
        <img
          src={afterSrc}
          alt={afterAlt}
          loading="lazy"
          onError={handleError}
        />
      </div>
    </div>
  )
}

export default BeforeAfter
