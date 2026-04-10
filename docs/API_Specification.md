# ClothCast API 명세서

## 1. 개요

ClothCast API는 아래 기능을 제공한다.

- 사용자 인증
- 사용자 정보 조회
- 옷장 관리
- 이미지 업로드
- 날씨 조회
- AI 코디 추천
- 추천 히스토리 조회/저장(Optional)

기본 prefix 예시:

```text
/api
```

권장 버전 prefix:

```text
/api/v1
```

이 문서는 `/api/v1` 기준으로 작성한다.

## 2. 공통 규칙

### 2.1 Base URL

```text
/api/v1
```

### 2.2 응답 형식

성공 응답:

```json
{
  "status": "success",
  "message": "요청이 성공했습니다.",
  "data": {}
}
```

실패 응답:

```json
{
  "status": "error",
  "message": "에러 메시지",
  "data": {
    "code": "ERROR_CODE"
  }
}
```

### 2.3 인증 방식

MVP에서는 아래 둘 중 하나를 사용하면 된다.

방식 1. 세션/쿠키 기반

- 로그인 성공 시 서버가 세션 또는 `HttpOnly` 쿠키 발급
- 이후 인증이 필요한 요청에서 자동 포함

방식 2. JWT 기반

- 로그인 성공 시 `accessToken` 반환
- 클라이언트가 `Authorization` 헤더에 포함

예시:

```text
Authorization: Bearer {accessToken}
```

포트폴리오와 Next.js App Router 조합까지 생각하면 `HttpOnly` 쿠키 기반이 더 자연스럽다.

### 2.4 공통 에러 코드 예시

| 코드 | 설명 |
| --- | --- |
| `INVALID_REQUEST` | 잘못된 요청 |
| `UNAUTHORIZED` | 인증되지 않은 사용자 |
| `FORBIDDEN` | 권한 없음 |
| `USER_NOT_FOUND` | 사용자를 찾을 수 없음 |
| `EMAIL_ALREADY_EXISTS` | 이미 가입된 이메일 |
| `INVALID_CREDENTIALS` | 이메일 또는 비밀번호 불일치 |
| `CLOTH_NOT_FOUND` | 의류 데이터를 찾을 수 없음 |
| `IMAGE_UPLOAD_FAILED` | 이미지 업로드 실패 |
| `WEATHER_FETCH_FAILED` | 날씨 조회 실패 |
| `AI_RECOMMENDATION_FAILED` | AI 추천 실패 |
| `EMPTY_WARDROBE` | 옷장 데이터 없음 |

## 3. 인증 API

### 3.1 회원가입

Endpoint:

```text
POST /api/v1/auth/signup
```

설명:

이메일, 닉네임, 비밀번호를 받아 회원가입한다.

Request Body:

```json
{
  "email": "test@example.com",
  "nickname": "yunho",
  "password": "12345678"
}
```

Response:

```json
{
  "status": "success",
  "message": "회원가입이 완료되었습니다.",
  "data": {
    "userId": 1,
    "email": "test@example.com",
    "nickname": "yunho"
  }
}
```

예외:

- 이메일 중복
- 비밀번호 조건 불충족
- 잘못된 이메일 형식

### 3.2 로그인

Endpoint:

```text
POST /api/v1/auth/login
```

설명:

이메일과 비밀번호로 로그인한다.

Request Body:

```json
{
  "email": "test@example.com",
  "password": "12345678"
}
```

쿠키 기반이면 body는 단순하게 가도 된다.

Response:

```json
{
  "status": "success",
  "message": "로그인에 성공했습니다.",
  "data": {
    "userId": 1,
    "email": "test@example.com",
    "nickname": "yunho"
  }
}
```

예외:

- 존재하지 않는 이메일
- 비밀번호 불일치

### 3.3 로그아웃

Endpoint:

```text
POST /api/v1/auth/logout
```

설명:

현재 로그인된 사용자를 로그아웃 처리한다.

Request Body:

없음

Response:

```json
{
  "status": "success",
  "message": "로그아웃되었습니다.",
  "data": null
}
```

### 3.4 내 정보 조회

Endpoint:

```text
GET /api/v1/auth/me
```

설명:

현재 로그인한 사용자 정보를 조회한다.

Response:

```json
{
  "status": "success",
  "message": "사용자 정보를 조회했습니다.",
  "data": {
    "userId": 1,
    "email": "test@example.com",
    "nickname": "yunho"
  }
}
```

예외:

- 로그인 안 된 상태

## 4. 사용자 API

### 4.1 사용자 프로필 조회

Endpoint:

```text
GET /api/v1/users/me
```

설명:

현재 사용자의 프로필 상세 정보를 조회한다.

Response:

```json
{
  "status": "success",
  "message": "프로필을 조회했습니다.",
  "data": {
    "userId": 1,
    "email": "test@example.com",
    "nickname": "yunho",
    "createdAt": "2026-04-01T10:00:00Z"
  }
}
```

## 5. 의류(옷장) API

### 5.1 옷 등록

Endpoint:

```text
POST /api/v1/clothes
```

설명:

사용자의 옷장에 새 의류를 등록한다.

Request Body:

```json
{
  "name": "네이비 블레이저",
  "category": "OUTER",
  "color": "NAVY",
  "season": "SPRING_FALL",
  "styleTags": ["FORMAL", "INTERVIEW"],
  "imageUrl": "https://example.com/blazer.jpg"
}
```

필드 설명:

| 필드 | 타입 | 설명 |
| --- | --- | --- |
| `name` | `string` | 옷 이름 |
| `category` | `string` | 상의/하의/아우터/신발 |
| `color` | `string` | 색상 |
| `season` | `string` | 계절감 |
| `styleTags` | `string[]` | 스타일 태그 |
| `imageUrl` | `string` | 업로드된 이미지 URL |

Response:

```json
{
  "status": "success",
  "message": "의류가 등록되었습니다.",
  "data": {
    "clothId": 101,
    "name": "네이비 블레이저",
    "category": "OUTER",
    "color": "NAVY",
    "season": "SPRING_FALL",
    "styleTags": ["FORMAL", "INTERVIEW"],
    "imageUrl": "https://example.com/blazer.jpg",
    "createdAt": "2026-04-01T10:10:00Z"
  }
}
```

예외:

- 인증 안 됨
- 필수값 누락
- 잘못된 카테고리 값

### 5.2 옷 목록 조회

Endpoint:

```text
GET /api/v1/clothes
```

설명:

현재 로그인한 사용자의 옷장 목록을 조회한다.

Query Parameters(Optional):

```text
category=OUTER
styleTag=FORMAL
```

Response:

```json
{
  "status": "success",
  "message": "의류 목록을 조회했습니다.",
  "data": [
    {
      "clothId": 101,
      "name": "네이비 블레이저",
      "category": "OUTER",
      "color": "NAVY",
      "season": "SPRING_FALL",
      "styleTags": ["FORMAL", "INTERVIEW"],
      "imageUrl": "https://example.com/blazer.jpg"
    },
    {
      "clothId": 102,
      "name": "화이트 셔츠",
      "category": "TOP",
      "color": "WHITE",
      "season": "ALL",
      "styleTags": ["FORMAL"],
      "imageUrl": "https://example.com/shirt.jpg"
    }
  ]
}
```

### 5.3 옷 상세 조회

Endpoint:

```text
GET /api/v1/clothes/{clothId}
```

설명:

특정 의류의 상세 정보를 조회한다.

Response:

```json
{
  "status": "success",
  "message": "의류 상세 정보를 조회했습니다.",
  "data": {
    "clothId": 101,
    "name": "네이비 블레이저",
    "category": "OUTER",
    "color": "NAVY",
    "season": "SPRING_FALL",
    "styleTags": ["FORMAL", "INTERVIEW"],
    "imageUrl": "https://example.com/blazer.jpg",
    "createdAt": "2026-04-01T10:10:00Z"
  }
}
```

예외:

- 존재하지 않는 `clothId`
- 본인 소유가 아닌 데이터 접근

### 5.4 옷 수정

Endpoint:

```text
PATCH /api/v1/clothes/{clothId}
```

설명:

등록된 의류 정보를 수정한다.

Request Body:

```json
{
  "name": "다크 네이비 블레이저",
  "styleTags": ["FORMAL", "INTERVIEW", "OFFICE"]
}
```

Response:

```json
{
  "status": "success",
  "message": "의류 정보가 수정되었습니다.",
  "data": {
    "clothId": 101,
    "name": "다크 네이비 블레이저",
    "category": "OUTER",
    "color": "NAVY",
    "season": "SPRING_FALL",
    "styleTags": ["FORMAL", "INTERVIEW", "OFFICE"],
    "imageUrl": "https://example.com/blazer.jpg"
  }
}
```

### 5.5 옷 삭제

Endpoint:

```text
DELETE /api/v1/clothes/{clothId}
```

설명:

등록된 의류를 삭제한다.

Response:

```json
{
  "status": "success",
  "message": "의류가 삭제되었습니다.",
  "data": {
    "clothId": 101
  }
}
```

예외:

- 존재하지 않는 데이터
- 본인 소유 아님

## 6. 이미지 업로드 API

이미지 업로드는 보통 두 가지 방식이 있다.

- 서버를 거쳐 업로드
- 클라우드 스토리지로 직접 업로드

MVP에서는 단순하게 서버 API 하나로 시작하면 된다.

### 6.1 의류 이미지 업로드

Endpoint:

```text
POST /api/v1/uploads/clothes-image
```

설명:

의류 등록 전에 이미지 파일을 업로드한다.

Content-Type:

```text
multipart/form-data
```

Request Form Data:

| 필드 | 타입 | 설명 |
| --- | --- | --- |
| `file` | `File` | 업로드할 이미지 파일 |

Response:

```json
{
  "status": "success",
  "message": "이미지 업로드에 성공했습니다.",
  "data": {
    "imageUrl": "https://example.com/uploads/cloth-101.jpg"
  }
}
```

예외:

- 파일 형식 오류
- 용량 초과
- 업로드 실패

## 7. 날씨 API

날씨는 외부 API를 내부 서버가 감싸서 제공하는 형태가 깔끔하다. 그러면 프론트에서 외부 API 키를 직접 다룰 필요가 없다.

### 7.1 현재 날씨 조회

Endpoint:

```text
GET /api/v1/weather/current?lat=37.5665&lon=126.9780
```

설명:

위도/경도를 기준으로 현재 날씨를 조회한다.

Query Parameters:

| 파라미터 | 타입 | 설명 |
| --- | --- | --- |
| `lat` | `number` | 위도 |
| `lon` | `number` | 경도 |

Response:

```json
{
  "status": "success",
  "message": "현재 날씨를 조회했습니다.",
  "data": {
    "temperature": 17,
    "feelsLike": 16,
    "weather": "Cloudy",
    "humidity": 62,
    "windSpeed": 3.2,
    "location": "Seoul"
  }
}
```

예외:

- 좌표 누락
- 외부 날씨 API 실패

### 7.2 지역명 기반 날씨 조회(Optional)

Endpoint:

```text
GET /api/v1/weather/current-by-city?city=Seoul
```

설명:

도시 이름으로 현재 날씨를 조회한다.

Response:

```json
{
  "status": "success",
  "message": "현재 날씨를 조회했습니다.",
  "data": {
    "temperature": 17,
    "feelsLike": 16,
    "weather": "Cloudy",
    "humidity": 62,
    "windSpeed": 3.2,
    "location": "Seoul"
  }
}
```

## 8. AI 추천 API

이 프로젝트의 핵심 API다.

### 8.1 코디 추천 생성

Endpoint:

```text
POST /api/v1/recommendations
```

설명:

현재 날씨, 사용자 프롬프트, 사용자 옷장 데이터를 조합해 AI 코디 추천을 생성한다.

Request Body:

```json
{
  "prompt": "나 면접 가",
  "weather": {
    "temperature": 17,
    "feelsLike": 16,
    "weather": "Cloudy",
    "humidity": 62,
    "windSpeed": 3.2,
    "location": "Seoul"
  }
}
```

처리 방식:

서버는 아래 순서로 동작한다.

1. 현재 로그인 사용자 확인
2. 사용자 옷장 목록 조회
3. 옷장 데이터와 날씨 데이터, `prompt`를 묶어 LLM 호출
4. 추천 결과 반환
5. 선택적으로 추천 기록 저장

Response:

```json
{
  "status": "success",
  "message": "코디 추천이 생성되었습니다.",
  "data": {
    "recommendationId": 501,
    "prompt": "나 면접 가",
    "weatherSummary": {
      "temperature": 17,
      "feelsLike": 16,
      "weather": "Cloudy",
      "location": "Seoul"
    },
    "recommendedItems": [
      {
        "clothId": 101,
        "name": "네이비 블레이저",
        "category": "OUTER",
        "imageUrl": "https://example.com/blazer.jpg"
      },
      {
        "clothId": 102,
        "name": "화이트 셔츠",
        "category": "TOP",
        "imageUrl": "https://example.com/shirt.jpg"
      },
      {
        "clothId": 103,
        "name": "블랙 슬랙스",
        "category": "BOTTOM",
        "imageUrl": "https://example.com/slacks.jpg"
      }
    ],
    "reason": "17도 내외의 선선한 날씨와 면접 상황에 맞게 단정하고 포멀한 조합으로 추천했습니다."
  }
}
```

예외:

- `prompt` 누락
- 로그인 안 됨
- 옷장 비어 있음
- AI 응답 실패

### 8.2 추천 히스토리 조회(Optional)

Endpoint:

```text
GET /api/v1/recommendations
```

설명:

이전에 생성된 추천 결과 목록을 조회한다.

Response:

```json
{
  "status": "success",
  "message": "추천 기록을 조회했습니다.",
  "data": [
    {
      "recommendationId": 501,
      "prompt": "나 면접 가",
      "reason": "17도 내외의 선선한 날씨와 면접 상황에 맞는 조합입니다.",
      "createdAt": "2026-04-01T11:00:00Z"
    },
    {
      "recommendationId": 502,
      "prompt": "친구 만나러 가",
      "reason": "가볍고 편안한 캐주얼 조합입니다.",
      "createdAt": "2026-04-01T12:00:00Z"
    }
  ]
}
```

### 8.3 추천 상세 조회(Optional)

Endpoint:

```text
GET /api/v1/recommendations/{recommendationId}
```

설명:

특정 추천 결과의 상세 정보를 조회한다.

Response:

```json
{
  "status": "success",
  "message": "추천 상세 정보를 조회했습니다.",
  "data": {
    "recommendationId": 501,
    "prompt": "나 면접 가",
    "weatherSummary": {
      "temperature": 17,
      "feelsLike": 16,
      "weather": "Cloudy",
      "location": "Seoul"
    },
    "recommendedItems": [
      {
        "clothId": 101,
        "name": "네이비 블레이저",
        "category": "OUTER",
        "imageUrl": "https://example.com/blazer.jpg"
      }
    ],
    "reason": "17도 내외의 선선한 날씨와 면접 상황에 맞게 단정한 조합입니다.",
    "createdAt": "2026-04-01T11:00:00Z"
  }
}
```

## 9. Enum 제안

프론트/백 통일을 위해 enum 값은 미리 정하는 게 좋다.

### 9.1 ClothingCategory

- `TOP`
- `BOTTOM`
- `OUTER`
- `SHOES`

### 9.2 ClothingSeason

- `SPRING`
- `SUMMER`
- `FALL`
- `WINTER`
- `SPRING_FALL`
- `ALL`

### 9.3 StyleTag

- `FORMAL`
- `CASUAL`
- `STREET`
- `DAILY`
- `SPORTY`
- `INTERVIEW`
- `OFFICE`
- `DATE`

### 9.4 Color

- `BLACK`
- `WHITE`
- `GRAY`
- `NAVY`
- `BEIGE`
- `BROWN`
- `BLUE`
- `RED`
- `GREEN`
- `YELLOW`
- `PINK`
- `OTHER`

## 10. API 흐름 예시

### 10.1 옷 등록 흐름

1. 사용자가 이미지 선택
2. `POST /uploads/clothes-image` 호출
3. `imageUrl` 반환
4. `POST /clothes` 호출
5. 최종 옷 데이터 저장

### 10.2 추천 생성 흐름

1. 프론트에서 위치 획득
2. `GET /weather/current` 호출
3. 사용자가 `prompt` 입력
4. `POST /recommendations` 호출
5. 서버가 사용자 옷장 + 날씨 + `prompt` 조합
6. AI 응답 생성
7. 추천 결과 반환

## 11. 권장 HTTP Status

| 상황 | Status Code |
| --- | --- |
| 조회 성공 | `200` |
| 생성 성공 | `201` |
| 삭제 성공 | `200` 또는 `204` |
| 잘못된 요청 | `400` |
| 인증 실패 | `401` |
| 권한 없음 | `403` |
| 데이터 없음 | `404` |
| 중복 데이터 | `409` |
| 서버 오류 | `500` |

## 12. MVP 기준 최종 API 목록

Auth:

- `POST /api/v1/auth/signup`
- `POST /api/v1/auth/login`
- `POST /api/v1/auth/logout`
- `GET /api/v1/auth/me`

User:

- `GET /api/v1/users/me`

Clothes:

- `POST /api/v1/clothes`
- `GET /api/v1/clothes`
- `GET /api/v1/clothes/{clothId}`
- `PATCH /api/v1/clothes/{clothId}`
- `DELETE /api/v1/clothes/{clothId}`

Upload:

- `POST /api/v1/uploads/clothes-image`

Weather:

- `GET /api/v1/weather/current`
- `GET /api/v1/weather/current-by-city` Optional

Recommendation:

- `POST /api/v1/recommendations`
- `GET /api/v1/recommendations` Optional
- `GET /api/v1/recommendations/{recommendationId}` Optional

## 13. 구현 우선순위 추천

1. 인증
2. 옷장 CRUD
3. 이미지 업로드
4. 날씨 조회
5. 추천 API
6. 히스토리

이 순서가 제일 안정적이다. 추천 기능은 결국 인증 + 옷장 데이터 + 날씨 데이터가 먼저 있어야 붙일 수 있기 때문이다.

다음으로 이어서 하면 제일 좋은 건 ERD 설계 아니면 폴더 구조 + API route 구조다.
