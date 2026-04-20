# ClothCast 구현 가이드

## 1. 목적

이 문서는 현재 ClothCast 프로젝트를 기준으로 다음 코드 작업을 이어가기 위한 개발 참고 문서이다.

새 기능을 추가하거나 기존 코드를 수정할 때는 이 문서를 진입점으로 삼고, 상세 요구사항은 아래 문서를 함께 확인한다.

- `docs/Function_Specification.md`: 서비스 기능 요구사항
- `docs/API_Specification.md`: API endpoint, 응답 형식, 에러 코드
- `docs/DESIGN.md`: UI 디자인 시스템
- `docs/Git_Commit_Convention.md`: 커밋 메시지 규칙
- `docs/PR_Template.md`: PR 본문 작성 규칙

Next.js 관련 코드를 수정하기 전에는 `node_modules/next/dist/docs/`의 관련 문서를 확인한다. 현재 프로젝트는 Next.js 16 계열이므로 기존 지식과 다른 API 또는 파일 규칙이 있을 수 있다.

## 2. 현재 기술 스택

| 영역 | 사용 기술 |
| --- | --- |
| Framework | Next.js `16.2.3`, App Router |
| UI | React `19.2.4`, Tailwind CSS `4` |
| Language | TypeScript |
| DB | PostgreSQL |
| ORM | Prisma `7.7.0`, `@prisma/adapter-pg` |
| Auth | 자체 세션 토큰, `HttpOnly` 쿠키 기반 |
| Password | `bcryptjs` |
| JWT/JWS | `jose` |
| AI | Gemini API |
| Storage | AWS S3 |

## 3. 프로젝트 구조 기준

현재 코드는 `src` 기준으로 역할이 분리되어 있다.

```text
src/
  app/
    (app)/                  # 화면 route group, URL에는 포함되지 않음
    api/v1/                 # Route Handler 기반 API
    globals.css             # 디자인 토큰과 공통 theme class
    layout.tsx              # root layout
  components/               # 화면/도메인별 React 컴포넌트
  generated/prisma/         # Prisma generated client
  lib/                      # 서버/클라이언트 공통 로직과 도메인 로직
prisma/
  schema.prisma             # DB schema
  migrations/               # DB migration
public/images/              # 정적 이미지 asset
docs/                       # 요구사항과 개발 문서
```

새 화면은 `src/app/(app)` 아래에 route를 추가한다. Route group `(app)`은 URL에 포함되지 않는다.

새 API는 `src/app/api/v1/{domain}/route.ts` 또는 `src/app/api/v1/{domain}/[id]/route.ts` 형태로 추가한다.

도메인별 검증, 타입, service 로직은 `src/lib/{domain}` 아래에 둔다. Route Handler에 비즈니스 로직을 길게 넣지 말고, 요청/응답 처리와 인증 확인 중심으로 유지한다.

## 4. Next.js 16 작업 메모

현재 확인한 로컬 Next 문서 기준으로 다음 규칙을 지킨다.

- `app` 디렉터리의 폴더가 URL segment를 만든다.
- `page.tsx`가 있어야 화면 route가 공개된다.
- `route.ts`가 있어야 API route가 공개된다.
- 같은 route segment에 `page.tsx`와 `route.ts`를 함께 둘 수 없다.
- page와 layout은 기본적으로 Server Component이다.
- `useState`, event handler, `useEffect`, `window`, `navigator.geolocation` 등이 필요하면 해당 컴포넌트 파일 상단에 `"use client"`를 선언한다.
- Client Component로 넘어가는 props는 직렬화 가능한 값만 전달한다.
- Route Handler는 Web `Request`/`Response` 기반으로 작성하고, 이 프로젝트에서는 공통 응답 helper를 사용한다.
- 인증, DB, 환경 변수, 외부 API key를 사용하는 코드는 서버 전용으로 유지한다.

서버 전용 모듈에는 기존 패턴처럼 `import "server-only";`를 사용한다.

## 5. API 구현 규칙

API 응답은 `src/lib/api/response.ts`의 helper를 사용한다.

성공 응답:

```ts
return apiSuccess("메시지", data, { status: 200 });
```

실패 응답:

```ts
return apiError("에러 메시지", "ERROR_CODE", { status: 400 });
```

응답 body는 `docs/API_Specification.md`의 공통 형식을 따른다.

```json
{
  "status": "success",
  "message": "요청이 성공했습니다.",
  "data": {}
}
```

```json
{
  "status": "error",
  "message": "에러 메시지",
  "data": {
    "code": "ERROR_CODE"
  }
}
```

Route Handler 구현 순서는 다음을 기본으로 한다.

1. `export const runtime = "nodejs";`가 필요한지 확인한다.
2. 인증이 필요한 API는 `getCurrentSessionUserId()`로 사용자 ID를 가져온다.
3. 인증 실패 시 `UNAUTHORIZED`, status `401`을 반환한다.
4. JSON body가 필요한 경우 `request.json()`을 `try/catch`로 파싱한다.
5. 입력값은 `src/lib/{domain}`의 validation 함수로 검증한다.
6. DB 접근은 `src/lib/prisma.ts`의 `prisma` 인스턴스를 사용한다.
7. 본인 소유 데이터만 조회/수정/삭제되도록 `userId` 조건을 반드시 포함한다.
8. 도메인 에러는 명세의 에러 코드에 맞춰 반환한다.
9. 예상하지 못한 에러는 구체 정보를 노출하지 않고 `SERVER_ERROR` 또는 도메인별 실패 코드로 반환한다.

## 6. 인증과 권한

현재 인증은 세션 쿠키 기반이다.

관련 파일:

- `src/lib/auth/session.ts`
- `src/lib/auth/current-user.ts`
- `src/app/api/v1/auth/login/route.ts`
- `src/app/api/v1/auth/logout/route.ts`
- `src/app/api/v1/auth/me/route.ts`

서버에서 현재 사용자 ID가 필요하면 `getCurrentSessionUserId()`를 사용한다.

페이지 보호는 Server Component에서 사용자 ID를 확인한 뒤 `redirect("/login")`을 호출하는 패턴을 사용한다.

```ts
const userId = await getCurrentSessionUserId();

if (!userId) {
  redirect("/login");
}
```

사용자별 데이터는 반드시 `userId`로 제한한다. 단건 조회, 수정, 삭제에서는 `findFirst`, `updateMany`, `deleteMany` 등으로 `id`와 `userId`를 함께 조건에 넣는 기존 패턴을 유지한다.

## 7. DB와 Prisma

DB schema는 `prisma/schema.prisma`에 정의되어 있다.

현재 주요 모델:

- `User`
- `Clothes`
- `Recommendation`

현재 enum:

- `ClothingCategory`: `TOP`, `BOTTOM`, `OUTER`, `SHOES`
- `ClothingFit`: `oversized`, `regular`, `slim`

Prisma client는 `src/generated/prisma`로 생성된다. 직접 수정하지 않는다.

DB 접근은 `src/lib/prisma.ts`의 `prisma`를 사용한다. 이 파일은 `DATABASE_URL`을 필수 환경 변수로 사용하고, 개발 환경에서 Prisma client를 재사용한다.

schema를 변경할 때는 다음을 함께 고려한다.

- `prisma/schema.prisma`
- migration 추가
- `src/generated/prisma` 재생성
- 관련 validation 타입
- API 응답 select 필드
- 프론트 read model 또는 client-side type guard

## 8. 도메인별 현재 구현 위치

| 도메인 | 주요 파일 |
| --- | --- |
| 인증 | `src/lib/auth/*`, `src/app/api/v1/auth/*` |
| 사용자 | `src/app/api/v1/users/me/route.ts` |
| 옷장 | `src/lib/clothes/*`, `src/app/api/v1/clothes/*`, `src/components/wardrobe/*` |
| 이미지 업로드 | `src/lib/uploads/*`, `src/lib/storage/s3.ts`, `src/app/api/v1/uploads/clothes-image/route.ts` |
| 날씨 | `src/lib/weather/*`, `src/app/api/v1/weather/current/route.ts` |
| 추천 | `src/lib/recommendations/*`, `src/app/api/v1/recommendations/*`, `src/components/recommendations/*` |
| 프로필 | `src/app/(app)/profile/page.tsx`, `src/components/profile/*` |

## 9. 클라이언트 API 호출 규칙

Client Component에서 JSON API를 호출할 때는 `src/lib/api/client.ts`의 helper를 사용한다.

- `fetchApiJson`: JSON body를 보내는 API에 사용
- `fetchApiData`: body 직렬화가 필요 없는 요청에 사용
- `ApiClientError`: API 실패를 UI에서 다룰 때 사용 가능

도메인별 사용자 메시지는 API error code에 맞춰 `errorMessages`로 매핑한다.

응답 data 구조가 중요한 경우 `validateData` type guard를 넘겨 런타임 검증을 한다. 추천 기능의 `isRecommendationData` 패턴을 참고한다.

## 10. UI와 디자인 시스템

디자인 요구사항은 `docs/DESIGN.md`를 따른다.

현재 디자인 토큰과 공통 class는 `src/app/globals.css`에 있다.

주요 class:

- `theme-display`
- `theme-heading`
- `theme-title`
- `theme-label`
- `theme-muted`
- `theme-section`
- `theme-card`
- `theme-glass`
- `theme-button-primary`
- `theme-button-secondary`
- `theme-input`

새 UI를 만들 때는 다음을 지킨다.

- 표면 색상은 CSS 변수 기반으로 사용한다.
- 구분선보다 여백과 surface 차이를 우선한다.
- 버튼과 입력은 기존 `theme-*` class 또는 같은 토큰을 사용한다.
- 상호작용이 필요한 컴포넌트만 Client Component로 만든다.
- 서버에서 가져올 수 있는 데이터는 page Server Component에서 가져오고, Client Component에는 필요한 초기값만 props로 넘긴다.

## 11. 환경 변수

현재 구현에서 사용하는 주요 환경 변수는 `.env.example`을 기준으로 확인한다.

대표 변수:

- `DATABASE_URL`
- `SESSION_SECRET`
- `OPENWEATHER_API_KEY`
- `GEMINI_API_KEY`
- `GEMINI_MODEL`
- S3 관련 변수

API key와 secret은 Client Component 또는 브라우저 번들로 전달하지 않는다. 브라우저에 노출해야 하는 값만 `NEXT_PUBLIC_` prefix를 사용한다.

## 12. 새 기능 추가 흐름

새 기능을 추가할 때는 다음 순서를 권장한다.

1. `docs/Function_Specification.md`에서 기능 요구사항을 확인한다.
2. API가 필요하면 `docs/API_Specification.md`의 endpoint와 응답 형식을 확인한다.
3. Next.js route, Server/Client Component, Route Handler 규칙이 관련되면 `node_modules/next/dist/docs/`에서 해당 문서를 확인한다.
4. DB 변경이 필요하면 Prisma schema와 migration 범위를 먼저 정한다.
5. `src/lib/{domain}`에 validation, type, service 로직을 추가한다.
6. `src/app/api/v1/{domain}`에 Route Handler를 추가한다.
7. 화면이 필요하면 `src/app/(app)`에 page를 만들고 `src/components/{domain}`에 UI 컴포넌트를 둔다.
8. Client Component에서는 `fetchApiJson` 또는 `fetchApiData`를 사용한다.
9. `npm run lint`와 필요한 경우 `npm run build`로 확인한다.

## 13. 검증 명령

일반 확인:

```bash
npm run lint
```

빌드 확인:

```bash
npm run build
```

개발 서버:

```bash
npm run dev
```

Prisma 관련 명령은 schema 또는 migration을 수정한 경우에만 실행한다. 실행 전 현재 프로젝트의 Prisma 7 설정과 package script를 확인한다.

## 14. 구현 전 체크리스트

- 관련 `docs/*.md` 문서를 읽었는가
- Next.js 관련 변경이면 `node_modules/next/dist/docs/`를 확인했는가
- API 응답 형식이 `apiSuccess`/`apiError`와 일치하는가
- 인증이 필요한 route에서 `getCurrentSessionUserId()`를 사용했는가
- 사용자 소유 데이터 접근에 `userId` 조건이 포함되었는가
- 입력값 검증이 Route Handler 밖의 도메인 validation 함수로 분리되었는가
- 서버 전용 코드가 Client Component로 import되지 않는가
- UI가 `docs/DESIGN.md`와 `globals.css`의 토큰을 따르는가
- 새 환경 변수가 필요하면 `.env.example`도 갱신했는가
- lint/build 또는 해당 변경에 맞는 검증을 수행했는가
