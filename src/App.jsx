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

      // easeOutQuart 효과
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

// 가격표 모달 컴포넌트
function PriceModal({ onClose }) {
  const [activeTab, setActiveTab] = useState('bathroom');

  // 모달 열릴 때 배경 스크롤 방지
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const priceData = {
    bathroom: {
      icon: '🚿',
      title: '화장실 1곳',
      note: '단위: 만원 | 자재: 케라폭시',
      headers: ['구분', '바닥', '샤워부스/욕조 3면', '바닥+벽 전체'],
      subHeaders: ['', '(300각 기준)', '(300×600각 기준)', ''],
      rows: [
        { type: '신축', values: ['30', '35', '90'] },
        { type: '구축', values: ['35', '35', '100'] }
      ]
    },
    living: {
      icon: '🛋️',
      title: '거실',
      note: '단위: 만원 | 자재: 케라폭시',
      headers: ['구분', '바닥'],
      subHeaders: ['', '(600각 기준)'],
      rows: [
        { type: '신축', values: ['150'] },
        { type: '구축', values: ['150'] }
      ]
    },
    entrance: {
      icon: '🚪',
      title: '현관',
      note: '단위: 만원 | 자재: 폴리우레아',
      headers: ['구분', '바닥'],
      subHeaders: ['', '(300각 기준)'],
      rows: [
        { type: '신축', values: ['5'] },
        { type: '구축', values: ['10'] }
      ]
    },
    laundry: {
      icon: '👕',
      title: '세탁실',
      note: '단위: 만원 | 자재: 폴리우레아',
      headers: ['구분', '바닥'],
      subHeaders: ['', '(300각 기준)'],
      rows: [
        { type: '신축', values: ['15'] },
        { type: '구축', values: ['15'] }
      ]
    },
    balcony: {
      icon: '🌿',
      title: '베란다',
      note: '단위: 만원 | 자재: 폴리우레아',
      headers: ['구분', '바닥'],
      subHeaders: ['', '(300각 기준)'],
      rows: [
        { type: '신축', values: ['15'] },
        { type: '구축', values: ['15'] }
      ]
    }
  };

  const tabs = [
    { id: 'bathroom', label: '화장실', icon: '🚿' },
    { id: 'living', label: '거실', icon: '🛋️' },
    { id: 'entrance', label: '현관', icon: '🚪' },
    { id: 'laundry', label: '세탁실', icon: '👕' },
    { id: 'balcony', label: '베란다', icon: '🌿' }
  ];

  const current = priceData[activeTab];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-500 to-orange-500 p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-2xl font-bold">💰 시공 가격표</h2>
            <button onClick={onClose} className="text-white/80 hover:text-white text-3xl leading-none">&times;</button>
          </div>
          <p className="text-white/80 text-sm">투명한 정찰제 · 추가 비용 없음</p>
        </div>

        {/* Tabs */}
        <div className="flex overflow-x-auto bg-stone-100 p-2 gap-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-all
                ${activeTab === tab.id 
                  ? 'bg-white text-amber-600 shadow-sm' 
                  : 'text-stone-500 hover:text-stone-700'}`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-3xl">{current.icon}</span>
            <div>
              <h3 className="text-xl font-bold text-stone-800">{current.title}</h3>
              <p className="text-sm text-stone-500">{current.note}</p>
            </div>
          </div>

          {/* Price Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-stone-800 text-white">
                  {current.headers.map((header, i) => (
                    <th key={i} className="px-4 py-3 text-center font-medium first:rounded-tl-xl last:rounded-tr-xl">
                      {header}
                      {current.subHeaders[i] && (
                        <div className="text-xs font-normal text-stone-300">{current.subHeaders[i]}</div>
                      )}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {current.rows.map((row, i) => (
                  <tr key={i} className={i % 2 === 0 ? 'bg-stone-50' : 'bg-white'}>
                    <td className="px-4 py-4 text-center font-medium text-stone-700 border-b">
                      <span className={`inline-block px-3 py-1 rounded-full text-sm ${
                        row.type === '신축' ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-700'
                      }`}>
                        {row.type}
                      </span>
                    </td>
                    {row.values.map((value, j) => (
                      <td key={j} className="px-4 py-4 text-center border-b">
                        <span className="text-2xl font-bold text-stone-800">{value}</span>
                        <span className="text-sm text-stone-500 ml-1">만원</span>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Notice */}
          <div className="mt-6 bg-amber-50 rounded-xl p-4">
            <p className="text-sm text-amber-800">
              <strong>💡 안내사항</strong>
            </p>
            <ul className="text-sm text-amber-700 mt-2 space-y-1">
              <li>• 위 가격은 기본 시공 기준이며, 구축은 오염도에 따라 달라질 수 있습니다.</li>
              <li>• 정확한 견적은 무료 상담을 통해 안내받으세요.</li>
              <li>• 신축: 첫 입주는 위 견적과 동일 / 구축: 기존 거주 중인 주택인경우 +5만원</li>
            </ul>
          </div>

          {/* CTA */}
          <div className="mt-6 flex gap-3">
            <button
              onClick={() => { onClose(); ChannelService.showMessenger(); }}
              className="flex-1 bg-amber-500 hover:bg-amber-600 text-white font-bold py-4 rounded-xl text-center transition-colors flex items-center justify-center gap-2"
            >
              <span>💬</span> 채팅 상담
            </button>
            <button
              onClick={onClose}
              className="flex-1 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold py-4 rounded-xl transition-colors"
            >
              닫기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// 다단계 견적 폼 컴포넌트
function QuoteForm({ onClose }) {
  const [step, setStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    spaces: [],
    spaceDetails: {},
    isNewBuilding: '',
    area: '',
    environment: '',
    preferredDate: '',
    customDate: '',
    region: '',
    phone: ''
  });

  // 모달 열릴 때 배경 스크롤 방지
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const totalSteps = 7;
  const progress = (step / totalSteps) * 100;

  const spaces = [
    { id: 'entrance', label: '현관', hasDetail: false },
    { id: 'kitchen', label: '주방', hasDetail: false },
    { id: 'bathroom_partial', label: '욕실 (일부)', subLabel: '일부 부위 시공', hasDetail: true },
    { id: 'bathroom_full', label: '욕실 (전체)', subLabel: '벽 + 바닥 전체 시공', hasDetail: true },
    { id: 'living', label: '거실', hasDetail: false }
  ];

  const regions = [
    '서울', '경기', '인천', '세종', '강원',
    '충북', '충남', '대전', '경북', '대구',
    '전북', '경남', '울산', '광주', '부산',
    '전남', '제주'
  ];

  const handleSpaceToggle = (spaceId) => {
    setFormData(prev => {
      const newSpaces = prev.spaces.includes(spaceId)
        ? prev.spaces.filter(s => s !== spaceId)
        : [...prev.spaces, spaceId];
      return { ...prev, spaces: newSpaces };
    });
  };

  const handleSpaceDetail = (spaceId, detail) => {
    setFormData(prev => ({
      ...prev,
      spaceDetails: { ...prev.spaceDetails, [spaceId]: detail }
    }));
  };

  const handleNext = () => {
    if (step < totalSteps) setStep(step + 1);
  };

  const handlePrev = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = () => {
    // 슬랙으로 견적 요청 알림 전송 (비동기, 기다리지 않음)
    const webhookUrl = import.meta.env.VITE_SLACK_WEBHOOK_URL;

    if (webhookUrl) {
      const message = {
        text: `🔔 새로운 견적 요청\n\n시공 공간: ${getSelectedSummary().join(', ')}\n신축 여부: ${formData.isNewBuilding}\n실평수: ${formData.area}\n시공 환경: ${formData.environment}\n희망일: ${formData.preferredDate}${formData.customDate ? ` (${formData.customDate})` : ''}\n지역: ${formData.region}\n연락처: ${formData.phone}`
      };

      fetch(webhookUrl, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(message)
      }).catch(error => console.error('슬랙 알림 전송 실패:', error));
    }

    setIsSubmitted(true);
  };

  const canProceed = () => {
    switch (step) {
      case 1: return formData.spaces.length > 0;
      case 2: return formData.isNewBuilding !== '';
      case 3: return formData.area !== '';
      case 4: return formData.environment !== '';
      case 5: return formData.preferredDate !== '';
      case 6: return formData.region !== '';
      case 7: return formData.phone.length >= 10;
      default: return false;
    }
  };

  const getSpaceLabel = (spaceId) => {
    const space = spaces.find(s => s.id === spaceId);
    return space ? space.label : spaceId;
  };

  const getSelectedSummary = () => {
    const items = [];
    formData.spaces.forEach(spaceId => {
      const label = getSpaceLabel(spaceId);
      const detail = formData.spaceDetails[spaceId];
      items.push(detail ? `${label}: ${detail}` : label);
    });
    return items;
  };

  if (isSubmitted) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
          <div className="p-8 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-stone-800 mb-2">견적 요청이 완료되었습니다!</h3>
            <p className="text-stone-500 mb-8">전문 상담사가 곧 연락드리겠습니다.</p>
            
            <div className="bg-stone-50 rounded-2xl p-6 text-left mb-6">
              <h4 className="font-bold text-stone-700 mb-4 pb-2 border-b">📋 요청 내용 요약</h4>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-stone-500">시공 공간</span>
                  <span className="font-medium text-stone-800">{getSelectedSummary().join(', ')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">신축 여부</span>
                  <span className="font-medium text-stone-800">{formData.isNewBuilding}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">실평수</span>
                  <span className="font-medium text-stone-800">{formData.area}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">시공 환경</span>
                  <span className="font-medium text-stone-800">{formData.environment}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">희망일</span>
                  <span className="font-medium text-stone-800">
                    {formData.preferredDate}
                    {formData.customDate && ` (${formData.customDate})`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">지역</span>
                  <span className="font-medium text-stone-800">{formData.region}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">연락처</span>
                  <span className="font-medium text-stone-800">{formData.phone}</span>
                </div>
              </div>
            </div>
            
            <button
              onClick={onClose}
              className="w-full bg-violet-600 text-white font-bold py-4 rounded-xl hover:bg-violet-700 transition-colors"
            >
              확인
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white p-6 border-b rounded-t-3xl">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-stone-800">줄눈시공 ℹ️</h2>
            <button onClick={onClose} className="text-stone-400 hover:text-stone-600 text-2xl">×</button>
          </div>
          {/* Progress Bar */}
          <div className="relative">
            <div className="h-1 bg-stone-200 rounded-full">
              <div 
                className="h-1 bg-violet-500 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="absolute right-0 -top-5 text-sm text-violet-500 font-medium">{Math.round(progress)}%</span>
          </div>
        </div>

        {/* Body */}
        <div className="p-6">
          {/* Info Box */}
          <div className="bg-violet-50 rounded-2xl p-4 mb-6">
            <p className="text-stone-600 text-sm">몇 가지 정보만 알려주시면</p>
            <p className="text-stone-800 font-bold">
              <span className="text-violet-600">신속하게</span> 일정을 잡을 수 있어요.
            </p>
          </div>

          {/* Selected Items Display */}
          {step > 1 && formData.spaces.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4 justify-end">
              {getSelectedSummary().map((item, idx) => (
                <div key={idx} className="bg-stone-700 text-white text-sm px-4 py-2 rounded-full">
                  · {item}
                </div>
              ))}
            </div>
          )}

          {/* Step 1: 공간 선택 */}
          {step === 1 && (
            <div>
              <h3 className="text-lg font-bold text-stone-800 mb-4">시공할 곳을 선택해주세요.</h3>
              <div className="space-y-3">
                {spaces.map((space) => (
                  <div key={space.id}>
                    <label className="flex items-start gap-3 p-4 border rounded-xl cursor-pointer hover:border-violet-300 transition-colors">
                      <input
                        type="checkbox"
                        checked={formData.spaces.includes(space.id)}
                        onChange={() => handleSpaceToggle(space.id)}
                        className="w-5 h-5 rounded border-stone-300 text-violet-600 focus:ring-violet-500 mt-0.5"
                      />
                      <div>
                        <span className="font-medium text-stone-800">{space.label}</span>
                        {space.subLabel && (
                          <p className="text-sm text-stone-500">{space.subLabel}</p>
                        )}
                      </div>
                    </label>
                    {/* Detail Input */}
                    {space.hasDetail && formData.spaces.includes(space.id) && (
                      <div className="mt-2 ml-8">
                        <textarea
                          placeholder="세부 사항을 입력해주세요 (예: 화장실 1개)"
                          value={formData.spaceDetails[space.id] || ''}
                          onChange={(e) => handleSpaceDetail(space.id, e.target.value)}
                          className="w-full p-3 border rounded-xl text-sm resize-none focus:outline-none focus:ring-2 focus:ring-violet-500"
                          rows={2}
                          maxLength={255}
                        />
                        <p className="text-right text-xs text-stone-400 mt-1">
                          {(formData.spaceDetails[space.id] || '').length}/255자
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: 신축 여부 */}
          {step === 2 && (
            <div>
              <h3 className="text-lg font-bold text-stone-800 mb-4">첫 입주하는 신축 건물인가요?</h3>
              <div className="space-y-3">
                {['네.', '아니요.'].map((option) => (
                  <label key={option} className="flex items-center gap-3 p-4 border rounded-xl cursor-pointer hover:border-violet-300 transition-colors">
                    <input
                      type="radio"
                      name="newBuilding"
                      checked={formData.isNewBuilding === option}
                      onChange={() => setFormData(prev => ({ ...prev, isNewBuilding: option }))}
                      className="w-5 h-5 text-violet-600 focus:ring-violet-500"
                    />
                    <span className="font-medium text-stone-800">{option}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: 평수 선택 */}
          {step === 3 && (
            <div>
              <h3 className="text-lg font-bold text-stone-800 mb-4">실평수를 선택해주세요.</h3>
              <div className="space-y-3">
                {['10평대', '20평대', '30평대', '40평대', '50평대', '기타'].map((option) => (
                  <label key={option} className="flex items-center gap-3 p-4 border rounded-xl cursor-pointer hover:border-violet-300 transition-colors">
                    <input
                      type="radio"
                      name="area"
                      checked={formData.area === option}
                      onChange={() => setFormData(prev => ({ ...prev, area: option }))}
                      className="w-5 h-5 text-violet-600 focus:ring-violet-500"
                    />
                    <span className="font-medium text-stone-800">{option}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Step 4: 시공 환경 */}
          {step === 4 && (
            <div>
              <h3 className="text-lg font-bold text-stone-800 mb-4">시공 환경을 선택해주세요.</h3>
              <div className="space-y-3">
                {['공실 (비어있음)', '짐 있음'].map((option) => (
                  <label key={option} className="flex items-center gap-3 p-4 border rounded-xl cursor-pointer hover:border-violet-300 transition-colors">
                    <input
                      type="radio"
                      name="environment"
                      checked={formData.environment === option}
                      onChange={() => setFormData(prev => ({ ...prev, environment: option }))}
                      className="w-5 h-5 text-violet-600 focus:ring-violet-500"
                    />
                    <span className="font-medium text-stone-800">{option}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Step 5: 희망일 */}
          {step === 5 && (
            <div>
              <h3 className="text-lg font-bold text-stone-800 mb-4">서비스 희망일을 선택해주세요.</h3>
              <div className="space-y-3">
                {[
                  '협의 가능해요',
                  '가능한 빨리 진행하고 싶어요',
                  '일주일 이내로 진행하고 싶어요',
                  '원하는 날짜가 있어요',
                  '기타'
                ].map((option) => (
                  <div key={option}>
                    <label className="flex items-center gap-3 p-4 border rounded-xl cursor-pointer hover:border-violet-300 transition-colors">
                      <input
                        type="radio"
                        name="preferredDate"
                        checked={formData.preferredDate === option}
                        onChange={() => setFormData(prev => ({ ...prev, preferredDate: option }))}
                        className="w-5 h-5 text-violet-600 focus:ring-violet-500"
                      />
                      <span className="font-medium text-stone-800">{option}</span>
                    </label>
                    {formData.preferredDate === '원하는 날짜가 있어요' && option === '원하는 날짜가 있어요' && (
                      <input
                        type="date"
                        value={formData.customDate}
                        onChange={(e) => setFormData(prev => ({ ...prev, customDate: e.target.value }))}
                        className="w-full mt-2 p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500"
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 6: 지역 선택 */}
          {step === 6 && (
            <div>
              <h3 className="text-lg font-bold text-stone-800 mb-4">지역을 선택해주세요.</h3>
              <div className="grid grid-cols-3 gap-2">
                {regions.map((region) => (
                  <label
                    key={region}
                    className={`flex items-center justify-center p-3 border rounded-xl cursor-pointer transition-colors
                      ${formData.region === region 
                        ? 'bg-violet-600 text-white border-violet-600' 
                        : 'hover:border-violet-300 text-stone-800'}`}
                  >
                    <input
                      type="radio"
                      name="region"
                      checked={formData.region === region}
                      onChange={() => setFormData(prev => ({ ...prev, region: region }))}
                      className="sr-only"
                    />
                    <span className="font-medium">{region}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Step 7: 연락처 */}
          {step === 7 && (
            <div>
              <h3 className="text-lg font-bold text-stone-800 mb-4">연락받으실 연락처를 입력해주세요.</h3>
              <div className="space-y-4">
                <input
                  type="tel"
                  placeholder="010-0000-0000"
                  value={formData.phone}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^0-9-]/g, '');
                    setFormData(prev => ({ ...prev, phone: value }));
                  }}
                  className="w-full p-4 border rounded-xl text-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
                  maxLength={13}
                />
                <p className="text-sm text-stone-500">
                  * 입력하신 번호로 전문 상담사가 연락드립니다.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white p-6 border-t rounded-b-3xl">
          <div className="flex gap-3">
            {step > 1 && (
              <button
                onClick={handlePrev}
                className="flex-1 py-4 border border-stone-300 rounded-xl font-bold text-stone-600 hover:bg-stone-50 transition-colors"
              >
                이전
              </button>
            )}
            <button
              onClick={step === totalSteps ? handleSubmit : handleNext}
              disabled={!canProceed()}
              className={`flex-1 py-4 rounded-xl font-bold transition-colors
                ${canProceed() 
                  ? 'bg-violet-600 text-white hover:bg-violet-700' 
                  : 'bg-stone-200 text-stone-400 cursor-not-allowed'}`}
            >
              {step === totalSteps ? '견적 요청하기' : '다음'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// 메인 전단지 컴포넌트
export default function HousePickFlyer() {
  const [isVisible, setIsVisible] = useState(false);
  const [showQuoteForm, setShowQuoteForm] = useState(false);
  const [showPriceModal, setShowPriceModal] = useState(false);
  const [showBusinessInfo, setShowBusinessInfo] = useState(false);
  const [showChatBubble, setShowChatBubble] = useState(true);
  
  useEffect(() => {
    setIsVisible(true);

    // 채널톡 초기화
    ChannelService.loadScript();
    ChannelService.boot({
      pluginKey: "b59d5b7c-82c0-4e3a-a984-7ec0e37ee354",
      hideChannelButtonOnBoot: true
    });
  }, []);

  const fadeIn = (delay) => ({
    opacity: isVisible ? 1 : 0,
    transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
    transition: `all 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s`
  });

  return (
    <div className="min-h-screen bg-stone-50" style={{ fontFamily: "'Noto Sans KR', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;700;900&display=swap');
        
        .gradient-text {
          background: linear-gradient(135deg, #d97706 0%, #ea580c 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        
        .hero-bg {
          background: linear-gradient(135deg, #1c1917 0%, #292524 50%, #44403c 100%);
          position: relative;
          overflow: hidden;
        }
        
        .hero-bg::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
          opacity: 0.03;
        }
        
        .card-hover {
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }
        
        .card-hover:hover {
          transform: translateY(-8px);
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.15);
        }
        
        .btn-primary {
          background: linear-gradient(135deg, #ea580c 0%, #d97706 100%);
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }
        
        .btn-primary::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
          transition: left 0.5s ease;
        }
        
        .btn-primary:hover::before {
          left: 100%;
        }
        
        .btn-primary:hover {
          transform: scale(1.02);
          box-shadow: 0 10px 40px rgba(234, 88, 12, 0.3);
        }
        
        .pattern-grid {
          background-image: 
            linear-gradient(rgba(217, 119, 6, 0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(217, 119, 6, 0.03) 1px, transparent 1px);
          background-size: 40px 40px;
        }
        
        .badge-shine {
          position: relative;
          overflow: hidden;
        }
        
        .badge-shine::after {
          content: '';
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: linear-gradient(
            45deg,
            transparent 30%,
            rgba(255,255,255,0.3) 50%,
            transparent 70%
          );
          animation: shine 3s infinite;
        }
        
        @keyframes shine {
          0% { transform: translateX(-100%) rotate(45deg); }
          100% { transform: translateX(100%) rotate(45deg); }
        }
        
        .number-highlight {
          font-size: 4rem;
          font-weight: 900;
          line-height: 1;
        }
        
        .service-card {
          border: 1px solid rgba(217, 119, 6, 0.1);
          background: linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%);
        }
      `}</style>

      {/* Quote Form Modal */}
      {showQuoteForm && <QuoteForm onClose={() => setShowQuoteForm(false)} />}
      
      {/* Price Modal */}
      {showPriceModal && <PriceModal onClose={() => setShowPriceModal(false)} />}

      {/* 상단 고정 헤더 */}
      <header className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm shadow-sm z-40">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="font-black text-xl text-amber-600">HousePick</div>
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
        {/* 채팅 유도 말풍선 */}
        {showChatBubble && (
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
              onClick={() => setShowChatBubble(false)}
              className="text-stone-400 hover:text-stone-600 ml-2"
            >
              ✕
            </button>
          </div>
        )}

        <div className="flex flex-col gap-3">
          <button
            onClick={() => setShowPriceModal(true)}
            className="w-14 h-14 bg-stone-700 hover:bg-stone-600 rounded-full shadow-lg flex items-center justify-center text-2xl transition-all hover:scale-110"
            title="가격표 보기"
          >
            💰
          </button>
          <button
            onClick={() => ChannelService.showMessenger()}
            className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 hover:from-green-400 hover:to-green-500 rounded-full shadow-lg flex items-center justify-center text-2xl transition-all hover:scale-110"
            title="채널톡 상담"
          >
            💬
          </button>
        </div>
      </div>

      {/* Hero Section */}
      <section className="hero-bg text-white pt-28 pb-20 px-6 lg:pt-36 lg:pb-28">
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div style={fadeIn(0)}>
            <div className="inline-flex items-center gap-2 bg-amber-500/20 border border-amber-500/30 rounded-full px-5 py-2 mb-8 badge-shine">
              <span className="w-2 h-2 bg-amber-400 rounded-full animate-pulse"></span>
              <span className="text-amber-300 text-sm font-medium tracking-wide">업계 최초 정찰제 줄눈 브랜드</span>
            </div>
          </div>
          
          <h1 style={fadeIn(0.1)} className="text-3xl lg:text-5xl font-bold leading-tight mb-4">
            줄눈 가격, <span className="text-amber-400">이제 검색하지 마세요</span>
          </h1>
          
          <h2 style={fadeIn(0.2)} className="text-xl lg:text-2xl font-medium text-stone-300 mb-10">
            가격도 <span className="text-white font-bold">정찰제</span>, 품질도 <span className="text-amber-400 font-bold">5년 무상보장</span>
          </h2>
          
          <div style={fadeIn(0.3)} className="flex flex-col sm:flex-row gap-4 justify-center mb-10">
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl px-6 py-4">
              <div className="text-amber-400 font-bold text-lg">✓ 홈페이지 가격 = 실제 가격</div>
              <div className="text-stone-300 text-sm">추가 비용 없는 정찰제</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl px-6 py-4">
              <div className="text-amber-400 font-bold text-lg">✓ 5년 무상 A/S</div>
              <div className="text-stone-300 text-sm">자신 있으니까 보장합니다</div>
            </div>
          </div>
          
          <div style={fadeIn(0.4)} className="space-y-4">
            <a 
              href="tel:010-6461-0131"
              className="inline-block"
            >
              <div className="bg-white/10 backdrop-blur-sm border-2 border-amber-400 rounded-2xl px-8 py-4 mb-4 hover:bg-white/20 transition-all">
                <p className="text-amber-300 text-sm mb-1">지금 바로 전화하세요</p>
                <p className="text-3xl lg:text-4xl font-black text-white tracking-wide">010-6461-0131</p>
              </div>
            </a>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button 
                onClick={() => setShowQuoteForm(true)}
                className="btn-primary text-white font-bold text-lg px-10 py-4 rounded-full shadow-lg"
              >
                📅 시공 일정 잡기 →
              </button>
              <button 
                onClick={() => setShowPriceModal(true)}
                className="bg-white text-stone-800 font-bold text-lg px-10 py-4 rounded-full shadow-lg hover:bg-stone-100 transition-all flex items-center justify-center gap-2"
              >
                <span>💰</span> 가격표 보기
              </button>
            </div>
            <a 
              href="tel:010-6461-0131"
              className="inline-flex items-center gap-2 text-amber-300 hover:text-amber-200 transition-colors mt-2"
            >
              <span>📞</span> 전화 상담도 가능합니다
            </a>
          </div>
        </div>
      </section>

      {/* 3대 강점 */}
      <section className="py-20 px-6 pattern-grid">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-amber-600 font-semibold text-sm tracking-widest uppercase">Why HousePick</span>
            <h3 className="text-3xl lg:text-4xl font-bold text-stone-800 mt-2">하우스Pick 3대 강점</h3>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: '👨‍🔧',
                title: '5년 경력 직영 팀장',
                desc: '처음부터 끝까지 베테랑이 책임집니다',
                highlight: '직접 시공'
              },
              {
                icon: '⚙️',
                title: '정밀 기계 밑작업',
                desc: '수작업 한계를 넘어 탈락 현상 원천 차단',
                highlight: '기계 시공'
              },
              {
                icon: '💰',
                title: '투명한 정찰제',
                desc: '현장에서 바뀌는 견적? 하우스Pick은 없습니다',
                highlight: '고정 가격'
              }
            ].map((item, i) => (
              <div key={i} className="bg-white rounded-3xl p-8 shadow-lg shadow-stone-200/50 card-hover">
                <div className="text-5xl mb-4">{item.icon}</div>
                <span className="inline-block bg-amber-100 text-amber-700 text-xs font-bold px-3 py-1 rounded-full mb-3">
                  {item.highlight}
                </span>
                <h4 className="text-xl font-bold text-stone-800 mb-2">{item.title}</h4>
                <p className="text-stone-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 시공 범위 */}
      <section className="py-20 px-6 bg-stone-100">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-amber-600 font-semibold text-sm tracking-widest uppercase">Service Coverage</span>
            <h3 className="text-3xl lg:text-4xl font-bold text-stone-800 mt-2">시공 범위</h3>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {/* 주거공간 */}
            <div className="service-card rounded-3xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-amber-500 rounded-2xl flex items-center justify-center text-white text-2xl">🏠</div>
                <h4 className="text-xl font-bold text-stone-800">주거공간</h4>
              </div>
              <div className="space-y-3">
                {['화장실 바닥·벽면', '현관', '세탁실', '다용도실', '베란다'].map((item, i) => (
                  <div key={i} className="flex items-center gap-2 text-stone-700">
                    <span className="w-1.5 h-1.5 bg-amber-500 rounded-full"></span>
                    {item}
                  </div>
                ))}
              </div>
            </div>
            
            {/* 상업공간 */}
            <div className="service-card rounded-3xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-blue-500 rounded-2xl flex items-center justify-center text-white text-2xl">🏢</div>
                <h4 className="text-xl font-bold text-stone-800">상업공간</h4>
              </div>
              <div className="space-y-3">
                {['호텔', '병원', '피트니스', '종교시설', '백화점'].map((item, i) => (
                  <div key={i} className="flex items-center gap-2 text-stone-700">
                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                    {item}
                  </div>
                ))}
              </div>
            </div>
            
            {/* 특수시공 */}
            <div className="service-card rounded-3xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-orange-500 rounded-2xl flex items-center justify-center text-white text-2xl">✨</div>
                <h4 className="text-xl font-bold text-stone-800">특수시공</h4>
              </div>
              <div className="space-y-3">
                {['욕조·세면대·젠다이 실리콘 오염 방지', '포세린타일 코팅시공', '상판 연마 코팅'].map((item, i) => (
                  <div key={i} className="flex items-center gap-2 text-stone-700">
                    <span className="w-1.5 h-1.5 bg-orange-500 rounded-full"></span>
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* 가격표 버튼 */}
          <div className="text-center mt-10">
            <button 
              onClick={() => setShowPriceModal(true)}
              className="inline-flex items-center gap-3 bg-stone-800 hover:bg-stone-700 text-white font-bold text-lg px-8 py-4 rounded-full shadow-lg transition-all hover:scale-105"
            >
              <span className="text-2xl">💰</span>
              <span>시공 가격표 확인하기</span>
              <span className="text-amber-400">→</span>
            </button>
            <p className="text-stone-500 text-sm mt-3">투명한 정찰제 · 추가 비용 없음</p>
          </div>
        </div>
      </section>

      {/* 왜 하우스Pick인가 */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-amber-600 font-semibold text-sm tracking-widest uppercase">Our Difference</span>
            <h3 className="text-3xl lg:text-4xl font-bold text-stone-800 mt-2">하우스Pick이 특별한 이유</h3>
          </div>
          
          <div className="space-y-6">
            {[
              {
                num: '01',
                title: '기계 작업의 차이',
                desc: '기존 백시멘트를 깊고 정교하게 파내어 줄눈제가 완벽하게 밀착됩니다. 수작업으로는 불가능한 정밀도를 자랑합니다.'
              },
              {
                num: '02',
                title: '친환경 프리미엄 안료',
                desc: '중금속 없는 안전한 소재만 사용합니다. 아이와 반려동물이 있는 집도 안심하고 맡기세요.'
              },
              {
                num: '03',
                title: '철저한 사후관리',
                desc: '시공 후 연락 두절되는 업체와 비교하지 마세요. 하우스Pick은 5년간 끝까지 책임집니다.'
              }
            ].map((item, i) => (
              <div key={i} className="flex gap-6 items-start bg-gradient-to-r from-stone-50 to-transparent p-6 rounded-2xl border-l-4 border-amber-500 card-hover">
                <div className="number-highlight gradient-text">{item.num}</div>
                <div>
                  <h4 className="text-xl font-bold text-stone-800 mb-2">{item.title}</h4>
                  <p className="text-stone-600 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 1. Before/After 시공 사진 */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-amber-600 font-semibold text-sm tracking-widest uppercase">Real Results</span>
            <h3 className="text-3xl lg:text-4xl font-bold text-stone-800 mt-2">시공 전후 비교</h3>
            <p className="text-stone-500 mt-3">직접 확인하세요. 하우스Pick의 퀄리티</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { id: 1, before: '/images/before-1.jpg.jpg', after: '/images/after-1.jpg.jpg', title: '화장실 전체 시공', location: '서울 · 30평대' },
              { id: 2, before: '/images/before-2.jpg.jpg', after: '/images/after-2.jpg.jpg', title: '화장실 전체 시공', location: '서울 · 30평대' },
              { id: 3, before: '/images/before-3.jpg.jpg', after: '/images/after-3.jpg.jpg', title: '화장실 전체 시공', location: '서울 · 30평대' }
            ].map((item) => (
              <div key={item.id} className="bg-stone-100 rounded-2xl overflow-hidden card-hover">
                <div className="relative">
                  {/* Before */}
                  <img
                    src={item.before}
                    alt={`${item.title} 시공 전`}
                    className="aspect-[4/3] w-full object-cover"
                  />
                  <div className="absolute top-3 left-3 bg-stone-800 text-white text-xs font-bold px-3 py-1 rounded-full">BEFORE</div>
                </div>
                <div className="relative">
                  {/* After */}
                  <img
                    src={item.after}
                    alt={`${item.title} 시공 후`}
                    className="aspect-[4/3] w-full object-cover"
                  />
                  <div className="absolute top-3 left-3 bg-amber-500 text-white text-xs font-bold px-3 py-1 rounded-full">AFTER</div>
                </div>
                <div className="p-4 bg-white">
                  <p className="font-medium text-stone-800">{item.title}</p>
                  <p className="text-sm text-stone-500">{item.location}</p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-8">
            <button className="text-amber-600 font-semibold hover:text-amber-700 transition-colors">
              시공 사례 더보기 →
            </button>
          </div>
        </div>
      </section>

      {/* 2. 고객 후기 */}
      <section className="py-20 px-6 bg-stone-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-amber-600 font-semibold text-sm tracking-widest uppercase">Reviews</span>
            <h3 className="text-3xl lg:text-4xl font-bold text-stone-800 mt-2">고객 후기</h3>
            <div className="flex items-center justify-center gap-2 mt-4">
              <div className="flex text-amber-400 text-xl">★★★★★</div>
              <span className="font-bold text-stone-800">4.9</span>
              <span className="text-stone-500">/ 리뷰 127개</span>
            </div>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { name: '김**', location: '서울 송파구', space: '화장실 2개', date: '2024.01', review: '시간 약속도 잘 지켜주시고 일 처리도 꼼꼼히 잘 해주셔서 최종 결과물이 아주 만족스러웠습니다. 지인 소개 적극 추천 예정입니다!' },
              { name: '이**', location: '경기 성남시', space: '현관 + 베란다', date: '2024.01', review: '견적 받았을 때 타업체보다 저렴해서 반신반의였는데, 줄눈하고 나니 새집이 더 새집같아졌습니다! 주변에 추천해주려구요 ㅎㅎ' },
              { name: '박**', location: '서울 강서구', space: '욕실 전체', date: '2023.12', review: '견적제시 업체 중 가장 정확하게 견적을 제시했어요. 색상 제안도 예쁘고 작업도 꼼꼼하고 완벽해서 가족들에게 추천하고 싶어요!' }
            ].map((review, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 shadow-sm card-hover">
                <div className="flex text-amber-400 text-sm mb-3">★★★★★</div>
                <div className="bg-stone-100 rounded-xl p-4 mb-4 min-h-[120px] flex items-center">
                  <p className="text-stone-700 text-sm leading-relaxed">
                    "{review.review}"
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-stone-200 rounded-full flex items-center justify-center text-stone-500">
                    👤
                  </div>
                  <div>
                    <p className="font-medium text-stone-800">{review.name}</p>
                    <p className="text-xs text-stone-500">{review.location} · {review.space} · {review.date}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. 시공 실적 숫자 */}
      <section className="py-16 px-6 bg-stone-800 text-white">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { end: 1821, suffix: '+', decimal: 0, label: '누적 시공 건수', icon: '🏠' },
              { end: 98.7, suffix: '%', decimal: 1, label: '고객 만족도', icon: '😊' },
              { end: 0.3, suffix: '%', decimal: 1, label: '재시공 요청률', icon: '🔧' },
              { end: 5, suffix: '년', decimal: 0, label: '무상 A/S 보장', icon: '🛡️' }
            ].map((stat, i) => (
              <div key={i}>
                <div className="text-3xl mb-2">{stat.icon}</div>
                <div className="text-3xl lg:text-4xl font-black text-amber-400 mb-1">
                  <CountUp end={stat.end} suffix={stat.suffix} decimal={stat.decimal} />
                </div>
                <div className="text-stone-400 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. 팀장 소개 */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-amber-600 font-semibold text-sm tracking-widest uppercase">Our Team</span>
            <h3 className="text-3xl lg:text-4xl font-bold text-stone-800 mt-2">직영 팀장 소개</h3>
          </div>
          
          <div className="bg-gradient-to-br from-stone-50 to-amber-50 rounded-3xl p-8 md:p-12">
            <div className="flex flex-col md:flex-row items-center gap-8">
              {/* 프로필 이미지 영역 */}
              <div className="flex-shrink-0">
                <div className="w-44 h-44 rounded-full border-4 border-white shadow-xl overflow-hidden bg-stone-200">
                  <img 
                    src="/images/profile-kimdongahn.png" 
                    alt="김동안 팀장"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                  <div className="w-full h-full items-center justify-center text-stone-400 hidden">
                    <div className="text-center">
                      <div className="text-5xl mb-1">👨‍🔧</div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* 텍스트 영역 */}
              <div className="text-center md:text-left">
                <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-700 text-sm font-medium px-4 py-1 rounded-full mb-3">
                  <span>⭐</span> 정찰제 줄눈의 시작
                </div>
                <h4 className="text-2xl font-bold text-stone-800 mb-2">김동안 팀장</h4>
                <p className="text-stone-600 mb-4 leading-relaxed">
                  "견적 받고 당황하신 적 있으시죠?<br/>
                  저도 그런 업계가 싫어서 정찰제를 시작했습니다.<br/>
                  <strong>가격표 그대로, 추가 비용 없이</strong> 시공해드립니다."
                </p>
                <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                  <span className="bg-stone-100 text-stone-600 text-xs px-3 py-1 rounded-full">기계 시공 전문</span>
                  <span className="bg-stone-100 text-stone-600 text-xs px-3 py-1 rounded-full">5년 경력</span>
                  <span className="bg-stone-100 text-stone-600 text-xs px-3 py-1 rounded-full">친환경 자재</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. FAQ */}
      <section className="py-20 px-6 bg-stone-50">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-amber-600 font-semibold text-sm tracking-widest uppercase">FAQ</span>
            <h3 className="text-3xl lg:text-4xl font-bold text-stone-800 mt-2">자주 묻는 질문</h3>
          </div>
          
          <div className="space-y-4">
            {[
              {
                q: '시공 시간은 얼마나 걸리나요?',
                a: '화장실 1개 기준 약 2~3시간 소요됩니다. 공간 크기와 상태에 따라 달라질 수 있습니다.'
              },
              {
                q: '시공 후 바로 사용할 수 있나요?',
                a: '줄눈제 완전 경화까지 24시간이 필요합니다. 가벼운 사용은 6시간 후 가능합니다.'
              },
              {
                q: '5년 A/S는 어떻게 진행되나요?',
                a: '시공 후 탈락, 변색 등 문제 발생 시 무상으로 재시공해드립니다. 카카오톡으로 사진만 보내주세요.'
              },
              {
                q: '기존 줄눈 위에 덧칠하는 건가요?',
                a: '아닙니다. 기계로 기존 백시멘트를 완전히 파낸 후 새로 시공합니다. 이것이 5년 보장의 비결입니다.'
              }
            ].map((faq, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 shadow-sm">
                <h4 className="font-bold text-stone-800 mb-2 flex items-start gap-2">
                  <span className="text-amber-500">Q.</span>
                  {faq.q}
                </h4>
                <p className="text-stone-600 pl-6">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. 사업자 정보 & 인증 */}
      <section className="py-12 px-6 bg-white border-t border-stone-200">
        <div className="max-w-5xl mx-auto">
          {/* 인증&보험, 상담시간 - 항상 표시 */}
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            {/* 인증 & 보험 */}
            <div>
              <h4 className="font-bold text-stone-800 mb-4 flex items-center gap-2">
                <span className="text-amber-500">🛡️</span> 인증 & 보험
              </h4>
              <div className="flex flex-wrap gap-2">
                <span className="bg-green-100 text-green-700 text-xs font-medium px-3 py-2 rounded-lg">✓ 영업배상책임보험</span>
                <span className="bg-blue-100 text-blue-700 text-xs font-medium px-3 py-2 rounded-lg">✓ 친환경 자재 인증</span>
                <span className="bg-amber-100 text-amber-700 text-xs font-medium px-3 py-2 rounded-lg">✓ 정식 사업자 등록</span>
              </div>
            </div>

            {/* 상담 시간 */}
            <div>
              <h4 className="font-bold text-stone-800 mb-4 flex items-center gap-2">
                <span className="text-amber-500">⏰</span> 상담 시간
              </h4>
              <div className="space-y-2 text-sm text-stone-600">
                <p><span className="font-medium text-stone-800">평일</span> 09:00 - 18:00</p>
                <p><span className="font-medium text-stone-800">토요일</span> 09:00 - 15:00</p>
                <p><span className="font-medium text-stone-800">일/공휴일</span> 휴무</p>
                <p className="text-amber-600 font-medium mt-2">💬 채팅 문의는 24시간 가능</p>
              </div>
            </div>
          </div>

          {/* 사업자 정보 아코디언 - 전체 주석 처리
          <div className="border-t border-stone-200 pt-4">
            <button
              onClick={() => setShowBusinessInfo(!showBusinessInfo)}
              className="w-full flex items-center justify-between py-3 text-left hover:bg-stone-50 rounded-lg px-4 transition-colors"
            >
              <span className="font-bold text-stone-800 flex items-center gap-2">
                <span className="text-amber-500">📋</span> 사업자 정보
              </span>
              <span className={`text-stone-400 transition-transform duration-300 ${showBusinessInfo ? 'rotate-180' : ''}`}>
                ▼
              </span>
            </button>

            <div
              className={`overflow-hidden transition-all duration-300 ease-in-out ${showBusinessInfo ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
            >
              <div className="pt-4 pb-4 px-4">
                <div className="space-y-2 text-sm text-stone-600">
                  <p><span className="text-stone-400">상호명:</span> 디테일라인</p>
                  <p><span className="text-stone-400">대표자:</span> 김상훈</p>
                  <p><span className="text-stone-400">사업자번호:</span> 609-33-19473</p>
                  <p><span className="text-stone-400">주소:</span> 서울시 서초구 본마을 4길 11, 104호</p>
                </div>
              </div>
            </div>
          </div>
          */}
        </div>
      </section>

      {/* 정찰제 + 5년 보장 강조 섹션 */}
      <section className="py-16 px-6 bg-gradient-to-r from-amber-500 to-orange-500 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="w-16 h-0.5 bg-white/30"></div>
            <span className="text-white/80 font-medium">OUR PROMISE</span>
            <div className="w-16 h-0.5 bg-white/30"></div>
          </div>
          <div className="text-2xl lg:text-3xl font-bold mb-2">가격도 정찰제</div>
          <div className="text-7xl lg:text-9xl font-black mb-2">5년 보장</div>
          <p className="text-white/80 text-lg">검색 그만하세요. 우리가 먼저 다 공개했습니다.</p>
        </div>
      </section>

      {/* CTA 섹션 */}
      <section className="py-20 px-6 hero-bg text-white">
        <div className="max-w-3xl mx-auto text-center relative z-10">
          <h3 className="text-3xl lg:text-4xl font-bold mb-4">지금 바로 무료 상담 신청하세요</h3>
          <p className="text-stone-300 text-lg mb-10">1분 만에 끝나는 간편 접수, 전문 상담사가 즉시 연락드립니다</p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <button 
              onClick={() => setShowQuoteForm(true)}
              className="btn-primary text-white font-bold text-lg px-8 py-4 rounded-full inline-flex items-center justify-center gap-3"
            >
              <span className="text-2xl">📅</span>
              <span>시공 일정 잡기</span>
            </button>
            <a href="tel:010-6461-0131" className="bg-white/10 backdrop-blur-sm border border-white/20 text-white font-bold text-lg px-8 py-4 rounded-full inline-flex items-center justify-center gap-3 hover:bg-white/20 transition-all">
              <span className="text-2xl">📞</span>
              <span>전화 상담</span>
            </a>
          </div>
          
          <div className="pt-8 border-t border-white/10">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-stone-400">
              <div className="flex items-center gap-2">
                <span>📍</span>
                <span>네이버 검색: <strong className="text-white">하우스Pick</strong></span>
              </div>
              <div className="hidden sm:block w-1 h-1 bg-stone-600 rounded-full"></div>
              <div className="flex items-center gap-2">
                <span>💬</span>
                <span>카카오톡: <strong className="text-white">하우스Pick 줄눈시공</strong></span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 bg-stone-900 text-center">
        <div className="text-2xl font-black text-amber-500 mb-1">HousePick</div>
        <p className="text-stone-400 text-sm mb-2">줄눈 가격, 이제 검색하지 마세요</p>
        <p className="text-stone-500 text-xs">© 2024 디테일라인. 줄눈 시공 전문</p>
      </footer>
    </div>
  );
}
