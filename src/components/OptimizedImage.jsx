/**
 * 최적화된 이미지 컴포넌트
 * - lazy loading
 * - error fallback
 * - decoding async
 */
function OptimizedImage({ src, alt, width, height, className = '' }) {
  const handleError = (e) => {
    e.target.src = '/images/placeholder.svg'
    e.target.alt = '이미지 준비 중'
  }

  return (
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      loading="lazy"
      decoding="async"
      className={className}
      onError={handleError}
    />
  )
}

export default OptimizedImage
