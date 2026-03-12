let currentStep = 1;
const totalSteps = 6;

function showStep(step) {
  // 모든 단계 숨기기 및 required 속성 제거
  document.querySelectorAll('.form-step').forEach(s => {
    s.classList.remove('active');
    // 숨겨진 단계의 required 속성 제거 (HTML5 검증 오류 방지)
    if (!s.classList.contains('active')) {
      s.querySelectorAll('[required]').forEach(field => {
        field.removeAttribute('required');
      });
    }
  });
  
  // 현재 단계 표시
  const stepElement = document.querySelector(`[data-step="${step}"]`);
  if (stepElement) {
    stepElement.classList.add('active');
    // 현재 단계의 required 속성 복원
    stepElement.querySelectorAll('input[required], select[required], textarea[required]').forEach(field => {
      field.setAttribute('required', 'required');
    });
  }
  
  currentStep = step;
}

function nextStep() {
  // 현재 단계의 필수 필드 검증
  const form = document.getElementById('reservationForm');
  if (!form) return;
  
  const activeStep = form.querySelector('.form-step.active');
  if (activeStep) {
    const requiredFields = activeStep.querySelectorAll('[required]');
    let isValid = true;
    
    requiredFields.forEach(field => {
      if (field.type === 'checkbox') {
        if (!field.checked) {
          isValid = false;
          field.closest('label').style.color = 'red';
        }
      } else {
        if (!field.value || !field.value.trim()) {
          isValid = false;
          field.style.borderColor = 'red';
        }
      }
    });
    
    if (!isValid) {
      alert('필수 항목을 모두 입력해주세요.');
      return;
    }
  }
  
  if (currentStep < totalSteps) {
    showStep(currentStep + 1);
  }
}

function prevStep() {
  if (currentStep > 1) {
    showStep(currentStep - 1);
  }
}

// 견적 계산
async function calculateEstimate() {
  const form = document.getElementById('reservationForm');
  if (!form) {
    alert('폼을 찾을 수 없습니다.');
    return;
  }
  
  const formData = new FormData(form);
  const data = {
    service: formData.get('service'),
    serviceType: formData.get('serviceType'),
    area: parseInt(formData.get('area')) || 1,
    addServices: formData.getAll('addServices')
  };
  
  // 서비스 선택 확인
  if (!data.service) {
    alert('서비스를 선택해주세요.');
    return;
  }
  
  try {
    const response = await fetch('/api/reservation', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    
    const result = await response.json();
    
    if (result.success && result.estimate) {
      displayEstimate(result.estimate);
      nextStep();
    } else {
      alert('견적 계산 중 오류가 발생했습니다: ' + (result.error || '알 수 없는 오류'));
    }
  } catch (error) {
    console.error('Error:', error);
    alert('견적 계산 중 오류가 발생했습니다.');
  }
}

function displayEstimate(estimate) {
  const estimateDisplay = document.getElementById('estimateDisplay');
  
  let html = '<div class="estimate-breakdown">';
  
  estimate.breakdown.forEach(item => {
    html += `
      <div class="estimate-item">
        <span>${item.name} (${item.type})</span>
        <span>${item.price.toLocaleString()}원</span>
      </div>
    `;
  });
  
  if (estimate.discount.rate > 0) {
    html += `
      <div class="estimate-item discount">
        <span>패키지 할인 (${(estimate.discount.rate * 100).toFixed(0)}%)</span>
        <span>-${estimate.discount.amount.toLocaleString()}원</span>
      </div>
    `;
  }
  
  html += '</div>';
  html += `
    <div class="estimate-total">
      <span>최종 견적</span>
      <span class="total-price">${estimate.finalPrice.toLocaleString()}원</span>
    </div>
    <div class="estimate-note">
      <p>※ 최종 견적은 현장 방문 후 정확한 측정을 통해 확정됩니다.</p>
      <p>※ 계약금은 최종 견적의 30%입니다. (${Math.floor(estimate.finalPrice * 0.3).toLocaleString()}원)</p>
    </div>
  `;
  
  estimateDisplay.innerHTML = html;
}

// DOM 로드 후 초기화
document.addEventListener('DOMContentLoaded', function() {
  // 폼 제출
  const form = document.getElementById('reservationForm');
  if (form) {
    form.addEventListener('submit', async function(e) {
      e.preventDefault();
      
      // 현재 활성화된 단계의 필수 필드만 검증
      const activeStep = form.querySelector('.form-step.active');
      if (!activeStep) {
        alert('폼 단계를 찾을 수 없습니다.');
        return;
      }
      
      const requiredFields = activeStep.querySelectorAll('[required]');
      let isValid = true;
      const invalidFields = [];
      
      requiredFields.forEach(field => {
        // 체크박스는 checked 속성 확인
        if (field.type === 'checkbox') {
          if (!field.checked) {
            isValid = false;
            invalidFields.push(field);
          }
        } else {
          // 텍스트 입력 필드는 값 확인
          if (!field.value || !field.value.trim()) {
            isValid = false;
            invalidFields.push(field);
          }
        }
      });
      
      if (!isValid) {
        invalidFields.forEach(field => {
          field.style.borderColor = 'red';
          // 체크박스는 부모 레이블에 스타일 적용
          if (field.type === 'checkbox') {
            const label = field.closest('label');
            if (label) label.style.color = 'red';
          }
        });
        alert('필수 항목을 모두 입력해주세요.');
        // 첫 번째 오류 필드로 포커스 이동
        if (invalidFields[0]) {
          invalidFields[0].focus();
        }
        return;
      }
      
      // 모든 필드의 스타일 초기화
      form.querySelectorAll('input, select, textarea').forEach(field => {
        field.style.borderColor = '';
        const label = field.closest('label');
        if (label) label.style.color = '';
      });
      
      // 모든 단계의 데이터 수집 (숨겨진 필드도 포함)
      const formData = new FormData(form);
      
      // 필수 필드 확인
      const requiredData = {
        service: formData.get('service'),
        workDate: formData.get('workDate'),
        workTime: formData.get('workTime'),
        city: formData.get('city'),
        district: formData.get('district'),
        detailAddress: formData.get('detailAddress'),
        customerName: formData.get('customerName'),
        customerPhone: formData.get('customerPhone'),
        customerEmail: formData.get('customerEmail')
      };
      
      // 필수 필드 누락 확인
      const missingFields = [];
      if (!requiredData.service) missingFields.push('서비스');
      if (!requiredData.workDate) missingFields.push('시공 희망일');
      if (!requiredData.workTime) missingFields.push('시공 희망시간');
      if (!requiredData.city) missingFields.push('시/도');
      if (!requiredData.district) missingFields.push('구');
      if (!requiredData.detailAddress) missingFields.push('상세 주소');
      if (!requiredData.customerName) missingFields.push('이름');
      if (!requiredData.customerPhone) missingFields.push('전화번호');
      if (!requiredData.customerEmail) missingFields.push('이메일');
      
      if (missingFields.length > 0) {
        alert('다음 필수 항목을 입력해주세요:\n' + missingFields.join(', '));
        return;
      }
      
      const data = {
        service: formData.get('service'),
        serviceType: formData.get('serviceType') || 'basic',
        area: parseInt(formData.get('area')) || 1,
        addServices: formData.getAll('addServices'),
        workDate: formData.get('workDate'),
        workTime: formData.get('workTime'),
        city: formData.get('city'),
        district: formData.get('district'),
        detailAddress: formData.get('detailAddress'),
        customerName: formData.get('customerName'),
        customerPhone: formData.get('customerPhone'),
        customerEmail: formData.get('customerEmail'),
        notes: formData.get('notes') || ''
      };
      
      // 버튼 비활성화
      const submitBtn = form.querySelector('button[type="submit"]');
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = '처리 중...';
      }
      
      try {
        const response = await fetch('/api/reservation', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
        });
        
        const result = await response.json();
        
        if (result.success) {
          // 예약 ID 표시
          const reservationIdElement = document.getElementById('reservationId');
          if (reservationIdElement) {
            reservationIdElement.textContent = `예약번호: ${result.reservationId}`;
          }
          nextStep();
        } else {
          alert('예약 중 오류가 발생했습니다: ' + (result.error || '알 수 없는 오류'));
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = '예약 완료';
          }
        }
      } catch (error) {
        console.error('Error:', error);
        alert('예약 중 오류가 발생했습니다.');
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = '예약 완료';
        }
      }
    });
  }
  
  // 초기화
  showStep(1);
});

