import React from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen flex flex-col bg-stone-50">
      <Header />
      <main className="flex-1 py-20 px-6 mt-16">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold text-stone-800 mb-8">개인정보처리방침</h1>

          <div className="prose prose-stone max-w-none space-y-8">
            <section>
              <p className="text-stone-600 mb-6">
                하우스Pick(이하 "회사")은 「개인정보 보호법」 제30조에 따라 정보주체의 개인정보를 보호하고
                이와 관련한 고충을 신속하고 원활하게 처리할 수 있도록 하기 위하여 다음과 같이 개인정보 처리방침을 수립·공개합니다.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-stone-800 mb-4">1. 개인정보의 처리 목적</h2>
              <p className="text-stone-600 mb-4">
                회사는 다음의 목적을 위하여 개인정보를 처리합니다. 처리하고 있는 개인정보는 다음의 목적 이외의 용도로는 이용되지 않으며,
                이용 목적이 변경되는 경우에는 「개인정보 보호법」 제18조에 따라 별도의 동의를 받는 등 필요한 조치를 이행할 예정입니다.
              </p>
              <ul className="list-disc list-inside text-stone-600 space-y-2">
                <li>견적 상담 및 서비스 제공</li>
                <li>시공 예약 및 일정 관리</li>
                <li>고객 문의 응대 및 상담</li>
                <li>서비스 개선 및 품질 향상</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-stone-800 mb-4">2. 수집하는 개인정보 항목</h2>
              <p className="text-stone-600 mb-4">회사는 서비스 제공을 위해 다음과 같은 개인정보를 수집합니다.</p>
              <ul className="list-disc list-inside text-stone-600 space-y-2">
                <li><strong>필수 항목:</strong> 성함, 연락처(전화번호), 시공 희망 지역</li>
                <li><strong>선택 항목:</strong> 이메일, 상세 주소, 시공 희망 일정, 기타 요청사항</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-stone-800 mb-4">3. 개인정보의 보유 및 이용 기간</h2>
              <p className="text-stone-600 mb-4">
                회사는 법령에 따른 개인정보 보유·이용기간 또는 정보주체로부터 개인정보를 수집 시에 동의받은 개인정보 보유·이용기간 내에서
                개인정보를 처리·보유합니다.
              </p>
              <ul className="list-disc list-inside text-stone-600 space-y-2">
                <li>견적 상담 관련 정보: 상담 완료 후 1년</li>
                <li>시공 계약 관련 정보: 시공 완료 후 5년 (보증 기간)</li>
                <li>전자상거래법에 따른 보존: 계약 또는 청약철회 등에 관한 기록 5년</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-stone-800 mb-4">4. 개인정보의 제3자 제공</h2>
              <p className="text-stone-600">
                회사는 정보주체의 개인정보를 제1조에서 명시한 범위 내에서만 처리하며, 정보주체의 동의, 법률의 특별한 규정 등
                「개인정보 보호법」 제17조 및 제18조에 해당하는 경우에만 개인정보를 제3자에게 제공합니다.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-stone-800 mb-4">5. 정보주체의 권리·의무 및 행사방법</h2>
              <p className="text-stone-600 mb-4">정보주체는 회사에 대해 언제든지 다음 각 호의 개인정보 보호 관련 권리를 행사할 수 있습니다.</p>
              <ul className="list-disc list-inside text-stone-600 space-y-2">
                <li>개인정보 열람 요구</li>
                <li>오류 등이 있을 경우 정정 요구</li>
                <li>삭제 요구</li>
                <li>처리정지 요구</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-stone-800 mb-4">6. 개인정보의 안전성 확보조치</h2>
              <p className="text-stone-600 mb-4">회사는 개인정보의 안전성 확보를 위해 다음과 같은 조치를 취하고 있습니다.</p>
              <ul className="list-disc list-inside text-stone-600 space-y-2">
                <li>관리적 조치: 내부관리계획 수립·시행, 직원 교육</li>
                <li>기술적 조치: 개인정보처리시스템 접근 제한, 보안프로그램 설치</li>
                <li>물리적 조치: 전산실 및 자료보관실 접근 통제</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-stone-800 mb-4">7. 개인정보 보호책임자</h2>
              <p className="text-stone-600 mb-4">
                회사는 개인정보 처리에 관한 업무를 총괄해서 책임지고, 개인정보 처리와 관련한 정보주체의 불만처리 및 피해구제 등을 위하여
                아래와 같이 개인정보 보호책임자를 지정하고 있습니다.
              </p>
              <div className="bg-stone-100 rounded-lg p-4">
                <p className="text-stone-700">
                  <strong>개인정보 보호책임자</strong><br />
                  담당: 하우스Pick 고객센터<br />
                  연락처: 010-6461-0131<br />
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-bold text-stone-800 mb-4">8. 개인정보처리방침의 변경</h2>
              <p className="text-stone-600">
                이 개인정보처리방침은 2024년 1월 1일부터 적용됩니다.
                법령 및 방침에 따른 변경내용의 추가, 삭제 및 정정이 있는 경우에는 변경사항의 시행 7일 전부터
                공지사항을 통하여 고지할 것입니다.
              </p>
            </section>

            <section className="pt-8 border-t border-stone-200">
              <p className="text-stone-500 text-sm">
                시행일자: 2024년 1월 1일
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
