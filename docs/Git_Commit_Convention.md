# Git Commit Convention

이 프로젝트에서 커밋 메시지를 작성할 때는 아래 Conventional Commits 형식을 기본 규칙으로 사용한다.

## Prefix

`gitm`

## Template

```text
${type}(${scope}): ${subject}

${body - what and why (optional)}

${Refs: #issue-number (optional)}
```

## Allowed Types

- `feat`
- `fix`
- `refactor`
- `docs`
- `style`
- `test`
- `chore`
- `build`
- `ci`
- `perf`

## Writing Rules

- 첫 줄은 반드시 `type(scope): subject` 형식을 따른다.
- `type`은 허용된 타입 중 하나를 사용한다.
- `scope`는 변경 범위를 짧게 표현한다.
- `subject`는 현재형으로 간결하게 작성한다.
- 커밋 메시지는 기본적으로 한글 위주로 작성한다.
- 기술 용어, 라이브러리명, API명, 파일명처럼 번역이 부자연스러운 표현만 영어를 유지한다.
- 본문은 선택 사항이며, 무엇을 왜 바꿨는지 한글로 설명한다.
- 이슈 참조가 있으면 마지막 줄에 `Refs: #issue-number` 형식으로 적는다.

## Examples

```text
feat(auth): 세션 기반 로그인 흐름 추가

HttpOnly 쿠키 세션으로 로그인하도록 구현하고 앱 시작 시 인증 상태를 유지하도록 정리했다.

Refs: #12
```

```text
fix(wardrobe): 추천 페이지에서 빈 옷장 상태 처리
```

## Instruction For Codex

사용자가 커밋 메시지를 요청하면 이 문서를 기준으로 작성한다.
별도 형식을 지정하지 않으면 위 템플릿을 그대로 따른다.
별도 언어 지시가 없으면 커밋 메시지는 한글 위주로 작성한다.
