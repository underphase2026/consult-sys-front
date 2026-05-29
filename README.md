# 요정 — 상담 시스템 프론트엔드

휴대폰 판매 매장을 위한 상담·영업 관리 시스템의 프론트엔드입니다.

---

## 기술 스택

| 항목 | 버전 |
|------|------|
| React | 18 |
| TypeScript | 6 |
| Vite | 5 |
| React Router DOM | 7 |
| Tailwind CSS | 3 |

---

## 시작하기

### 사전 준비

- Node.js 18 이상

### 설치 및 실행

```bash
# 패키지 설치
npm install

# 개발 서버 실행
npm run dev
```

브라우저에서 `http://localhost:5173` 으로 접속합니다.

```bash
# 프로덕션 빌드
npm run build

# 빌드 결과 미리보기
npm run preview
```

---

## 화면 구성

```
/sign-in                  로그인
/sign-up                  회원가입
/find-password            비밀번호 찾기
/main                     홈 (대시보드)
/my-market                내 매장 관리
/register-market          매장 등록
/consulting               상담 시스템 (탭 기반 다중 상담)
  └─ 유형 선택 → 통신사 선택 → 기종/상품 선택
/customer                 고객 관리
/partner                  거래처 관리
/inventory                재고 관리
/org                      조직 관리
/settings                 환경설정
/payment                  결제
```

---

## 주요 기능

### 사이드바
- 마우스를 올리면 80px → 256px 으로 펼쳐지는 확장형 사이드바
- 각 메뉴는 피그마 디자인 기준 SVG 아이콘 사용

### 상담 시스템 (탭 관리)
- 여러 상담을 동시에 탭으로 관리
- 각 탭은 독립적인 상태(무선/유선, 통신사, 기종 선택)를 유지
- 탭 상태 배지: `미정` / `완료`
- 탭을 닫거나 다른 페이지로 이동해도 상담 내용 유지

---

## 프로젝트 구조

```
src/
├── components/
│   ├── Sidebar.tsx               # 사이드바 (확장형)
│   ├── ConsultingLayout.tsx      # 상담 탭 레이아웃
│   ├── ConsultingStepContent.tsx # 상담 단계별 컨텐츠
│   ├── PrivateHeader.tsx         # 로그인 후 상단 헤더
│   └── Footer.tsx
├── contexts/
│   └── ConsultingTabsContext.tsx # 상담 탭 전역 상태
├── pages/
│   ├── sign-in.tsx
│   ├── sign-up.tsx
│   ├── main-page.tsx
│   ├── my-market.tsx
│   ├── consulting-page.tsx
│   └── ...
├── images/                       # SVG 아이콘 및 이미지
└── App.tsx                       # 라우팅 설정
```