# 프론트엔드 연동을 위한 통합 API 명세서 (API Integration Guide)

본 문서는 `consist-sys-front` 프론트엔드 프로젝트에서 백엔드 API를 연동할 때 참고할 수 있도록 구성된 핵심 컨텍스트 문서입니다.

## 1. 프로젝트 도메인 및 구조 요약

### 주요 도메인 모델
- **Auth (인증)**: SMS 기반 본인인증, 회원가입 (대표/직원), JWT 발급 및 토큰 기반 인증
- **Users (사용자)**: 회원 정보 조회 및 수정
- **Stores (매장)**: 매장 생성, 합류, 조회 및 카카오 로컬 API를 통한 좌표 변환
- **Consultations (상담/견적)**: 유무선 단말기 리스트 조회, 선택한 단말기를 기반으로 한 견적(Quote) 생성, 통합 견적 내역(BFF) 조회
- **Electronic Contracts (전자계약)**: 서드파티(Third-party) 전자계약 상태 웹훅 수신 및 처리
- **CRM (고객 관리)**: 고객 정보 및 상담 내역 연동

### 주요 엔티티 및 핵심 구조
- **User**: 사용자 계정 정보, 역할(OWNER, STAFF) 포함
- **Store**: 매장 기본 정보(사업자 번호, 위치 등)
- **Device**: 유무선 통신 단말기 정보(출고가, 공시지원금 등)
- **Quote**: 단말기 정보를 기반으로 생성된 상담/견적 데이터 스냅샷
- **ElectronicContract**: Quote와 연동되는 전자계약 문서 상태 추적 (진행중, 서명완료 등)

## 2. 통합 API 명세 (Endpoints)

### [GET] `/api`
- **Summary**: N/A
- **Description**: N/A
- **Auth Required**: No
- **Responses**:
  - `200`: No description

### [GET] `/api/search`
- **Summary**: 출결 검색 (관리자 전용)
- **Description**: ID와 Date를 사용하여 유저의 출결 정보를 검색합니다.
- **Auth Required**: No
- **Parameters**:
  - `query`: `id` (Required) - 유저 ID
  - `query`: `date` (Required) - 검색할 날짜 (YYYY-MM-DD)
- **Responses**:
  - `200`: 검색 결과 반환

### [GET] `/api/users`
- **Summary**: 모든 유저 목록 (관리자 전용)
- **Description**: 모든 유저 목록을 조회합니다.
- **Auth Required**: Yes (access-token)
- **Responses**:
  - `200`: 모든 유저 목록 반환

### [GET] `/api/users/{user_id}`
- **Summary**: 유저 조회 (관리자 전용)
- **Description**: ID를 사용하여 학생/유저를 조회합니다.
- **Auth Required**: Yes (access-token)
- **Parameters**:
  - `path`: `user_id` (Required) - 조회할 유저의 ID
- **Responses**:
  - `200`: 유저 정보 반환

### [GET] `/api/users/me`
- **Summary**: 내 정보 조회
- **Description**: N/A
- **Auth Required**: Yes (access-token)
- **Responses**:
  - `200`: 내 정보 반환
    - Returns: `UserProfileResponseDto`

### [PATCH] `/api/users/me`
- **Summary**: 내 정보 수정 (이름, 이메일, 생년월일만)
- **Description**: N/A
- **Auth Required**: Yes (access-token)
- **Request Body** (`application/json`): `UpdateUserDto`
- **Responses**:
  - `200`: 수정 완료
    - Returns: `MessageResponseDto`

### [POST] `/api/auth/login`
- **Summary**: 로그인 (휴대폰 번호 + 비밀번호)
- **Description**: N/A
- **Auth Required**: No
- **Request Body** (`application/json`): `LoginDto`
- **Responses**:
  - `200`: JWT 액세스 토큰 반환
    - Returns: `LoginResponseDto`

### [POST] `/api/auth/register/owner`
- **Summary**: 대표 회원가입 (Authorization: Bearer <phoneVerifyToken> 필요)
- **Description**: SMS 인증 후 발급된 phoneVerifyToken을 Authorization 헤더에 Bearer 토큰으로 담아 호출하세요.
- **Auth Required**: No
- **Parameters**:
  - `header`: `authorization` (Required) - 
- **Request Body** (`application/json`): `RegisterOwnerDto`
- **Responses**:
  - `201`: userId & referralCode 반환
    - Returns: `RegisterResponseDto`

### [POST] `/api/auth/register/staff`
- **Summary**: 직원 회원가입 (Authorization: Bearer <phoneVerifyToken> 필요)
- **Description**: SMS 인증 후 발급된 phoneVerifyToken을 Authorization 헤더에 Bearer 토큰으로 담아 호출하세요.
- **Auth Required**: No
- **Parameters**:
  - `header`: `authorization` (Required) - 
- **Request Body** (`application/json`): `RegisterStaffDto`
- **Responses**:
  - `201`: userId 반환
    - Returns: `RegisterResponseDto`

### [POST] `/api/auth/sms/send`
- **Summary**: SMS 인증번호 발송 요청 (분당 3회 제한)
- **Description**: 입력한 번호로 6자리 인증번호를 발송합니다. 인증번호는 3분간 유효합니다.
- **Auth Required**: No
- **Request Body** (`application/json`): `SendSmsDto`
- **Responses**:
  - `200`: 발송 완료
    - Returns: `MessageResponseDto`
  - `429`: 너무 많은 요청 (분당 3회 초과)

### [POST] `/api/auth/sms/verify`
- **Summary**: SMS 인증번호 검증 (분당 5회 제한)
- **Description**: 인증번호 일치 시 5분 유효한 phoneVerifyToken을 반환합니다. 회원가입 시 이 토큰을 사용하세요.
- **Auth Required**: No
- **Request Body** (`application/json`): `VerifySmsDto`
- **Responses**:
  - `200`: 인증 성공 — phoneVerifyToken 반환
    - Returns: Example provided
  - `400`: 인증번호 불일치 또는 만료
  - `429`: 너무 많은 요청 (분당 5회 초과)

### [POST] `/api/auth/reset-token`
- **Summary**: 비밀번호 재설정 토큰 발급 (SMS 인증 완료 후 호출)
- **Description**: N/A
- **Auth Required**: No
- **Responses**:
  - `200`: 10분 유효한 resetToken 반환
    - Returns: `ResetTokenResponseDto`

### [POST] `/api/auth/forgot-password`
- **Summary**: 비밀번호 변경 (reset-token 필요)
- **Description**: N/A
- **Auth Required**: Yes (reset-token)
- **Request Body** (`application/json`): `ForgotPasswordDto`
- **Responses**:
  - `200`: 비밀번호 변경 완료

### [GET] `/api/stores/mine`
- **Summary**: 내 매장 조회
- **Description**: N/A
- **Auth Required**: Yes (access-token)
- **Responses**:
  - `200`: 매장 목록 반환
    - Returns: `Array<StoreItemResponseDto>`

### [POST] `/api/stores`
- **Summary**: 매장 등록 (OWNER 전용)
- **Description**: N/A
- **Auth Required**: Yes (access-token)
- **Request Body** (`application/json`): `CreateStoreDto`
- **Responses**:
  - `201`: 매장 생성 완료, storeCode 반환
    - Returns: `CreateStoreResponseDto`

### [POST] `/api/stores/join`
- **Summary**: 매장 합류 (STAFF 전용, storeCode 입력)
- **Description**: N/A
- **Auth Required**: Yes (access-token)
- **Request Body** (`application/json`): `JoinStoreDto`
- **Responses**:
  - `200`: 합류 완료
    - Returns: `JoinStoreResponseDto`

### [POST] `/api/stores/business-verify`
- **Summary**: 사업자 번호 진위 확인 (OWNER 전용)
- **Description**: N/A
- **Auth Required**: Yes (access-token)
- **Request Body** (`application/json`): `BusinessVerifyDto`
- **Responses**:
  - `200`: 유효한 사업자 번호

### [GET] `/api/stores/geocode`
- **Summary**: 주소로 위경도 좌표 변환 (카카오 로컬 API 연동)
- **Description**: N/A
- **Auth Required**: Yes (access-token)
- **Parameters**:
  - `query`: `address` (Required) - 검색할 주소
- **Responses**:
  - `200`: 변환된 좌표 데이터 반환
    - Returns: `GeocodeResponseDto`

### [POST] `/api/api/contracts/electronic/webhook`
- **Summary**: 서드파티 전자계약 웹훅 수신
- **Description**: 전자계약 상태 변경 이벤트를 비동기로 수신합니다.
- **Auth Required**: No
- **Parameters**:
  - `header`: `x-signature` (Required) - 
- **Responses**:
  - `200`: No description

### [GET] `/api/api/consultations/devices`
- **Summary**: 단말기 리스트 및 검색 API
- **Description**: 조건에 맞는 단말기 목록과 계산된 가격(출고가, 공시지원금, 할부원금)을 반환합니다.
- **Auth Required**: Yes (bearer)
- **Parameters**:
  - `query`: `networkType` (Required) - 유무선 구분
  - `query`: `carrier` (Required) - 통신사
  - `query`: `searchType` (Optional) - 검색 조건 (기종명 또는 모델명)
  - `query`: `keyword` (Optional) - 검색어
- **Responses**:
  - `200`: 성공적으로 단말기 목록을 반환했습니다.
    - Returns: `Array<DeviceResponseDto>`

### [GET] `/api/api/consultations/quotes/summary`
- **Summary**: BFF용 통합 견적 내역 조회 (CQRS Read Model)
- **Description**: N+1 문제를 방지하기 위해 견적, 계약 상태, CRM 정보를 Aggregation하여 반환합니다.
- **Auth Required**: Yes (bearer)
- **Responses**:
  - `200`: No description
    - Returns: `Array<QuoteSummaryDto>`

### [POST] `/api/api/consultations/quotes`
- **Summary**: 통합 견적 생성 API
- **Description**: 선택한 단말기 정보를 바탕으로 현재 가격 스냅샷을 포함한 견적을 생성합니다.
- **Auth Required**: Yes (bearer)
- **Request Body** (`application/json`): `CreateQuoteDto`
- **Responses**:
  - `201`: 성공적으로 견적을 생성했습니다.
    - Returns: `Quote`

## 3. 프론트엔드 연동 시 주의사항

### 인증 (Authentication)
- **JWT Access Token**: 로그인을 통해 발급받은 `accessToken`을 API 요청 시 헤더에 포함해야 합니다.
  - Header: `Authorization: Bearer <accessToken>`
- **Phone Verify Token**: 대표/직원 회원가입 시 SMS 인증을 먼저 거쳐야 하며, 인증 성공 시 발급받는 단기 토큰(`phoneVerifyToken`)을 가입 요청 시 동일하게 헤더에 포함해야 합니다.

### 공통 응답 포맷 (Common Response Format)
- 성공 시 일반적으로 200 또는 201 상태 코드와 함께 요청한 데이터를 JSON 형태로 반환합니다.
- 일부 단순 작업(수정, 삭제 등)은 `{ "message": "..." }` 형태의 `MessageResponseDto`를 반환합니다.
- 에러 발생 시 표준 HTTP 상태 코드(400 Bad Request, 401 Unauthorized, 403 Forbidden, 404 Not Found, 500 Internal Server Error)를 사용하며, NestJS 기본 에러 포맷인 `{ "statusCode": 400, "message": "error reason", "error": "Bad Request" }` 형태를 따릅니다.
