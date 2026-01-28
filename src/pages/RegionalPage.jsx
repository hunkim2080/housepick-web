import React, { useState, useEffect, useRef } from 'react';
import * as ChannelService from '@channel.io/channel-web-sdk-loader';

// 카운트업 애니메이션 컴포넌트
function CountUp({ end, suffix = '', decimal = 0, duration = 2000 }) {
  const [count, setCount] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasStarted) {
          setHasStarted(true);
        }
      },
      { threshold: 0.3 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [hasStarted]);

  useEffect(() => {
    if (!hasStarted) return;

    let startTime;
    const animate = (currentTime) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 4);
      const currentCount = easeOut * end;
      setCount(currentCount);
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [hasStarted, end, duration]);

  const formatNumber = (num) => {
    if (decimal > 0) {
      return num.toFixed(decimal);
    }
    return Math.floor(num).toLocaleString();
  };

  return (
    <span ref={ref}>
      {formatNumber(count)}{suffix}
    </span>
  );
}

// 지역 페이지 메인 컴포넌트
export default function RegionalPage({ region }) {
  const [isVisible, setIsVisible] = useState(false);
  const [showQuoteForm, setShowQuoteForm] = useState(false);
  const [showChatBubble, setShowChatBubble] = useState(false);
  const [chatBubbleClosed, setChatBubbleClosed] = useState(false);

  useEffect(() => {
    setIsVisible(true);

    // 채널톡 초기화
    ChannelService.loadScript();
    ChannelService.boot({
      pluginKey: "b59d5b7c-82c0-4e3a-a984-7ec0e37ee354",
      hideChannelButtonOnBoot: true
    });

    // 스크롤 시 채팅 팝업 표시/숨김
    const handleScroll = () => {
      if (window.scrollY > 400) {
        setShowChatBubble(true);
      } else {
        setShowChatBubble(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const fadeIn = (delay) => ({
    opacity: isVisible ? 1 : 0,
    transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
    transition: `all 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s`
  });

  return (
    <div className="min-h-screen bg-stone-50 font-sans">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;700;900&display=swap');
        * { font-family: 'Noto Sans KR', sans-serif; }
        .btn-primary {
          background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
          transition: all 0.3s ease;
        }
        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 40px rgba(245, 158, 11, 0.4);
        }
      `}</style>

      {/* 상단 고정 헤더 */}
      <header className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm shadow-sm z-40">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <a href="/" className="font-black text-xl text-amber-600">HousePick</a>
          <a
            href="tel:010-6461-0131"
            className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white font-bold px-4 py-2 rounded-full transition-all"
          >
            <span className="animate-pulse">📞</span>
            <span className="hidden sm:inline">010-6461-0131</span>
            <span className="sm:hidden">전화상담</span>
          </a>
        </div>
      </header>

      {/* 플로팅 CTA 버튼 */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
        {showChatBubble && !chatBubbleClosed && (
          <div className="flex items-center gap-2 bg-white rounded-2xl shadow-lg px-4 py-3 mb-1 animate-fade-in">
            <div className="flex -space-x-2 mr-2">
              <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-sm">👤</div>
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-sm">👤</div>
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-stone-800">궁금한 건 채팅으로 문의하세요</p>
              <p className="text-xs text-green-600 flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                몇 분 내 답변 받으실 수 있어요
              </p>
            </div>
            <button
              onClick={() => setChatBubbleClosed(true)}
              className="text-stone-400 hover:text-stone-600 ml-2"
            >
              ✕
            </button>
          </div>
        )}
        <button
          onClick={() => ChannelService.showMessenger()}
          className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 hover:from-green-400 hover:to-green-500 rounded-full shadow-lg flex items-center justify-center text-2xl transition-all hover:scale-110"
          title="채널톡 상담"
        >
          💬
        </button>
      </div>

      {/* Hero Section - 지역명 포함 */}
      <section className="relative text-white pt-28 pb-24 px-6 lg:pt-36 lg:pb-32 overflow-hidden bg-gradient-to-br from-stone-900 via-stone-800 to-stone-900">
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div style={fadeIn(0)}>
            <div className="inline-flex items-center gap-2 bg-amber-500/20 border border-amber-500/30 rounded-full px-5 py-2 mb-10">
              <span className="w-2 h-2 bg-amber-400 rounded-full animate-pulse"></span>
              <span className="text-amber-300 text-sm font-medium tracking-wide">{region.fullName} 줄눈시공 전문</span>
            </div>
          </div>

          {/* SEO 최적화: h1 태그에 지역명 + 핵심 키워드 */}
          <h1 style={fadeIn(0.1)} className="text-3xl lg:text-5xl font-bold leading-tight mb-6">
            <span className="text-amber-400">{region.name}</span> 줄눈시공 전문업체
          </h1>

          <h2 style={fadeIn(0.2)} className="text-xl lg:text-2xl font-medium text-stone-300 mb-12">
            가격도 <span className="text-white font-bold">정찰제</span>, 품질도 <span className="text-amber-400 font-bold">5년 무상보장</span>
          </h2>

          <div style={fadeIn(0.3)} className="flex flex-col sm:flex-row gap-5 justify-center mb-12">
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl px-6 py-5">
              <div className="text-amber-400 font-bold text-lg">💰 홈페이지 가격 = 실제 가격</div>
              <div className="text-stone-300 text-sm mt-1">추가 비용 없는 정찰제</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl px-6 py-5">
              <div className="text-amber-400 font-bold text-lg">🛡️ 5년 무상 A/S 보장</div>
              <div className="text-stone-300 text-sm mt-1">자신 있으니까 보장합니다</div>
            </div>
          </div>

          <div style={fadeIn(0.4)} className="space-y-4">
            <a href="tel:010-6461-0131" className="inline-block">
              <div className="bg-white/10 backdrop-blur-sm border-2 border-amber-400 rounded-2xl px-8 py-4 mb-4 hover:bg-white/20 transition-all">
                <p className="text-amber-300 text-sm mb-1">지금 바로 전화하세요</p>
                <p className="text-3xl lg:text-4xl font-black text-white tracking-wide">010-6461-0131</p>
              </div>
            </a>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => ChannelService.showMessenger()}
                className="btn-primary text-white font-bold text-lg px-10 py-4 rounded-full shadow-lg"
              >
                📅 {region.name} 시공 상담받기 →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 지역 소개 섹션 - 고유 콘텐츠 */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-amber-600 font-semibold text-sm tracking-widest uppercase">SERVICE AREA</span>
            <h2 className="text-3xl lg:text-4xl font-bold text-stone-800 mt-2">{region.fullName} 줄눈시공</h2>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-8">
            {/* 지역 설명 */}
            <p className="text-stone-700 text-lg leading-relaxed mb-6">
              <strong className="text-amber-600">{region.fullName}</strong> 지역 줄눈시공을 전문으로 하는 하우스Pick입니다.
              {region.description && ` ${region.description}`}
            </p>

            {/* 주요 랜드마크 */}
            {region.landmarks && region.landmarks.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-bold text-stone-800 mb-3">📍 {region.name} 주요 지역</h3>
                <p className="text-stone-600 leading-relaxed">
                  {region.name} 지역에는 <span className="text-amber-600 font-medium">{region.landmarks.join(', ')}</span> 등
                  다양한 시설이 위치해 있습니다. 하우스Pick은 이러한 {region.fullName} 전 지역에서 줄눈시공 서비스를 제공합니다.
                </p>
              </div>
            )}

            {/* 주요 아파트 단지 */}
            {region.apartments && region.apartments.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-bold text-stone-800 mb-3">🏢 {region.name} 주요 아파트 시공 지역</h3>
                <p className="text-stone-600 leading-relaxed">
                  {region.fullName}의 대표적인 아파트 단지로는 <span className="text-amber-600 font-medium">{region.apartments.join(', ')}</span> 등이 있습니다.
                  이 지역 아파트들은 대부분 10~25년 정도 된 건물들이 많아 줄눈 리뉴얼 수요가 높습니다.
                  하우스Pick은 각 아파트 단지의 타일 특성에 맞는 최적의 줄눈시공을 제공합니다.
                </p>
              </div>
            )}

            {/* 서비스 특징 */}
            <div className="bg-white rounded-xl p-6 mt-6">
              <h3 className="text-lg font-bold text-stone-800 mb-3">✨ {region.name}에서 하우스Pick을 선택해야 하는 이유</h3>
              <ul className="space-y-2 text-stone-600">
                <li className="flex items-start gap-2">
                  <span className="text-amber-500 mt-1">✓</span>
                  <span><strong>업계 최초 정찰제</strong> - {region.fullName} 어디서나 동일한 투명한 가격</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-500 mt-1">✓</span>
                  <span><strong>5년 무상 A/S 보장</strong> - 시공 후에도 책임지는 서비스</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-500 mt-1">✓</span>
                  <span><strong>당일 시공 가능</strong> - {region.name} 지역 빠른 방문 상담 및 시공</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-500 mt-1">✓</span>
                  <span><strong>프리미엄 재료 사용</strong> - 케라폭시 줄눈재로 방수 성능 UP</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 서비스 범위 */}
      <section className="py-20 px-6 bg-stone-100">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-amber-600 font-semibold text-sm tracking-widest uppercase">OUR SERVICES</span>
            <h2 className="text-3xl lg:text-4xl font-bold text-stone-800 mt-2">{region.name} 시공 서비스</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: '🚿', title: '화장실 줄눈', desc: `${region.name} 지역 화장실 줄눈시공` },
              { icon: '🛋️', title: '거실 줄눈', desc: `${region.name} 지역 거실 줄눈시공` },
              { icon: '🚪', title: '현관 줄눈', desc: `${region.name} 지역 현관 줄눈시공` },
            ].map((service, idx) => (
              <div key={idx} className="bg-white rounded-2xl p-8 text-center shadow-sm hover:shadow-lg transition-all">
                <div className="text-5xl mb-4">{service.icon}</div>
                <h3 className="text-xl font-bold text-stone-800 mb-2">{service.title}</h3>
                <p className="text-stone-600">{service.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 시공 사례 갤러리 */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-amber-600 font-semibold text-sm tracking-widest uppercase">PORTFOLIO</span>
            <h2 className="text-3xl lg:text-4xl font-bold text-stone-800 mt-2">{region.name} 시공 사례</h2>
            <p className="text-stone-600 mt-4">{region.fullName} 지역 실제 시공 사례입니다.</p>
          </div>

          {region.projects && region.projects.length > 0 ? (
            <div className="grid md:grid-cols-2 gap-8">
              {region.projects.map((project) => (
                <div key={project.id} className="bg-stone-50 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all">
                  {/* Before/After 이미지 */}
                  <div className="relative">
                    <div className="grid grid-cols-2 gap-1">
                      <div className="relative">
                        <img
                          src={project.images.before}
                          alt={`${project.title} 시공 전`}
                          className="w-full h-48 object-cover bg-stone-200"
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'flex';
                          }}
                        />
                        <div className="hidden w-full h-48 bg-stone-200 items-center justify-center text-stone-400 text-sm">
                          이미지 준비중
                        </div>
                        <span className="absolute top-2 left-2 bg-stone-800/80 text-white text-xs px-2 py-1 rounded">BEFORE</span>
                      </div>
                      <div className="relative">
                        <img
                          src={project.images.after}
                          alt={`${project.title} 시공 후`}
                          className="w-full h-48 object-cover bg-stone-200"
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'flex';
                          }}
                        />
                        <div className="hidden w-full h-48 bg-stone-200 items-center justify-center text-stone-400 text-sm">
                          이미지 준비중
                        </div>
                        <span className="absolute top-2 left-2 bg-amber-500 text-white text-xs px-2 py-1 rounded">AFTER</span>
                      </div>
                    </div>
                  </div>

                  {/* 프로젝트 정보 */}
                  <div className="p-6">
                    <h3 className="font-bold text-lg text-stone-800 mb-2">{project.title}</h3>
                    <div className="flex flex-wrap gap-2 mb-3">
                      <span className="text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded">{project.date}</span>
                      <span className="text-xs bg-stone-200 text-stone-600 px-2 py-1 rounded">{project.scope}</span>
                    </div>
                    <p className="text-stone-600 text-sm">{project.description}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-stone-100 border border-dashed border-stone-300 rounded-2xl p-12 text-center">
              <p className="text-stone-500 mb-4">
                {region.name} 지역 시공 사례가 곧 업데이트됩니다.
              </p>
              <p className="text-sm text-stone-400 mb-6">
                더 많은 시공 사례는 채팅 상담을 통해 확인하실 수 있습니다.
              </p>
              <button
                onClick={() => ChannelService.showMessenger()}
                className="btn-primary text-white font-bold px-6 py-3 rounded-full inline-flex items-center gap-2"
              >
                <span>💬</span> 실시간 견적 문의하기
              </button>
            </div>
          )}
        </div>
      </section>

      {/* 실적 통계 */}
      <section className="py-20 px-6 bg-gradient-to-br from-stone-900 via-stone-800 to-stone-900 text-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-amber-400 font-semibold text-sm tracking-widest uppercase">OUR RECORD</span>
            <h2 className="text-3xl lg:text-4xl font-bold mt-2">하우스Pick 누적 실적</h2>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { value: 1821, suffix: '+', label: '누적 시공건수' },
              { value: 98.7, suffix: '%', decimal: 1, label: '고객만족도' },
              { value: 0.3, suffix: '%', decimal: 1, label: '재시공 요청률' },
              { value: 5, suffix: '년', label: '무상 A/S' },
            ].map((stat, idx) => (
              <div key={idx} className="text-center">
                <div className="text-4xl lg:text-5xl font-black text-amber-400 mb-2">
                  <CountUp end={stat.value} suffix={stat.suffix} decimal={stat.decimal || 0} />
                </div>
                <p className="text-stone-400">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA 섹션 */}
      <section className="py-20 px-6 bg-gradient-to-r from-amber-500 to-orange-500 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">{region.name} 줄눈시공, 지금 상담받으세요</h2>
          <p className="text-white/80 text-lg mb-8">가격도 정찰제, 품질도 5년 보장</p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="tel:010-6461-0131"
              className="bg-white text-amber-600 font-bold text-lg px-8 py-4 rounded-full inline-flex items-center justify-center gap-2 hover:bg-stone-100 transition-all"
            >
              <span>📞</span> 010-6461-0131
            </a>
            <button
              onClick={() => ChannelService.showMessenger()}
              className="bg-white/20 backdrop-blur-sm border-2 border-white text-white font-bold text-lg px-8 py-4 rounded-full inline-flex items-center justify-center gap-2 hover:bg-white/30 transition-all"
            >
              <span>💬</span> 채팅 상담
            </button>
          </div>
        </div>
      </section>

      {/* 인접 지역 링크 섹션 - SEO 내부 링크 빌딩 */}
      {region.nearbyAreas && region.nearbyAreas.length > 0 && (
        <section className="py-16 px-6 bg-stone-100">
          <div className="max-w-5xl mx-auto">
            <h3 className="text-xl font-bold text-stone-800 mb-6">
              📍 {region.name} 인근 지역 줄눈시공
            </h3>
            <div className="flex flex-wrap gap-3">
              {region.nearbyAreas.map((area, idx) => {
                // 지역명을 slug로 변환 (간단한 매핑)
                const areaSlugMap = {
                  '서초': 'seocho', '송파': 'songpa', '강동': 'gangdong', '강남': 'gangnam',
                  '성남': 'seongnam', '용인': 'yongin', '수원': 'suwon', '화성': 'hwaseong',
                  '안양': 'anyang', '부천': 'bucheon', '인천': 'incheon', '하남': 'hanam',
                  '도봉': 'dobong', '노원': 'nowon', '성북': 'seongbuk', '양천': 'yangcheon',
                  '영등포': 'yeongdeungpo', '마포': 'mapo', '구로': 'guro', '금천': 'geumcheon',
                  '관악': 'gwanak', '동작': 'dongjak', '성동': 'seongdong', '광진': 'gwangjin',
                  '중랑': 'jungnang', '동대문': 'dongdaemun', '은평': 'eunpyeong', '서대문': 'seodaemun',
                  '종로': 'jongno', '중구': 'junggu-seoul', '용산': 'yongsan', '강서': 'gangseo',
                  '강북': 'gangbuk', '고양': 'goyang', '파주': 'paju', '김포': 'gimpo',
                  '광명': 'gwangmyeong', '시흥': 'siheung', '안산': 'ansan', '군포': 'gunpo',
                  '의왕': 'uiwang', '과천': 'gwacheon', '광주': 'gwangju-gg', '남양주': 'namyangju',
                  '구리': 'guri', '양주': 'yangju', '의정부': 'uijeongbu', '포천': 'pocheon',
                  '평택': 'pyeongtaek', '오산': 'osan', '이천': 'icheon', '안성': 'anseong'
                };
                const slug = areaSlugMap[area.replace('서울 ', '')] || area.toLowerCase();
                return (
                  <a
                    key={idx}
                    href={`/${slug}`}
                    className="bg-white border border-stone-200 hover:border-amber-400 hover:bg-amber-50 rounded-xl px-5 py-3 transition-all text-stone-700 hover:text-amber-600 font-medium"
                  >
                    {area} 줄눈시공 →
                  </a>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* 세부 서비스 지역 - subAreas가 있는 경우만 표시 */}
      {region.subAreas && region.subAreas.length > 0 && (
        <section className="py-12 px-6 bg-white border-t border-stone-200">
          <div className="max-w-5xl mx-auto">
            <h3 className="text-lg font-bold text-stone-800 mb-4">
              📍 {region.name} 내 세부 서비스 지역
            </h3>
            <div className="flex flex-wrap gap-2">
              {region.subAreas.map((area, idx) => (
                <span
                  key={idx}
                  className="text-stone-600 hover:text-amber-600 text-sm transition-colors cursor-default"
                >
                  {area} 줄눈시공{idx < region.subAreas.length - 1 ? ',' : ''}
                </span>
              ))}
            </div>
            <p className="text-sm text-stone-500 mt-4">
              {region.fullName} 전 지역 출장 시공 가능합니다.
            </p>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="bg-stone-900 text-stone-400 py-12 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div>
              <a href="/" className="font-black text-2xl text-amber-500">HousePick</a>
              <p className="mt-2">업계 최초 정찰제 줄눈 브랜드</p>
            </div>
            <div className="text-center md:text-right">
              <p>대표전화: <a href="tel:010-6461-0131" className="text-white hover:text-amber-400">010-6461-0131</a></p>
              <p className="mt-1">© 2024 HousePick. All rights reserved.</p>
            </div>
          </div>

          {/* 서비스 지역 링크 (내부 링크 빌딩) */}
          <div className="mt-8 pt-8 border-t border-stone-800">
            <p className="text-sm text-stone-500 mb-4">서비스 가능 지역</p>
            <div className="flex flex-wrap gap-2 text-xs">
              {['gangnam', 'songpa', 'seocho', 'gangdong', 'seongnam', 'yongin', 'suwon', 'hwaseong', 'anyang', 'bucheon'].map((slug, idx) => {
                const nameMap = {
                  gangnam: '강남', songpa: '송파', seocho: '서초', gangdong: '강동',
                  seongnam: '성남', yongin: '용인', suwon: '수원', hwaseong: '화성',
                  anyang: '안양', bucheon: '부천'
                };
                return (
                  <a key={idx} href={`/${slug}`} className="text-stone-500 hover:text-amber-400 transition-colors">
                    {nameMap[slug]}
                  </a>
                );
              })}
              <a href="/" className="text-amber-400 hover:text-amber-300">전체 지역 보기 →</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
