# lotto-master

로또 번호 분석 앱. 번호별 특성/통계 분석을 제공하여 시중 번호 추천 앱과 차별화한다.
번호 추천 기능도 포함하지만, 고도화된 번호 통계 데이터를 유저에게 제공하는 것이 핵심 목적이다.

- **기술 기반**: Expo SDK 54 + TypeScript + React Native

## 기술 스택

- **Runtime**: Expo SDK 54, React Native 0.81, React 19
- **언어**: TypeScript (strict mode)
- **라우팅**: Expo Router 6 (파일 기반)
- **상태관리**: Zustand
- **서버 상태**: @tanstack/react-query
- **i18n**: 없음 (한국어 단일 언어)

## 아키텍처: Feature-Sliced Design + Repository Pattern

### 디렉토리 구조

```
app/                    # Expo Router 스크린 (라우팅 레이어)
├── _layout.tsx         #   Root: QueryClientProvider + SafeAreaProvider + Stack
├── index.tsx           #   엔트리: /(tabs)/home 리다이렉트
├── (tabs)/             #   탭 네비게이션
│   ├── _layout.tsx     #     탭 정의 (홈, 설정)
│   ├── home/           #     홈 탭
│   └── settings/       #     설정 탭
├── about.tsx           #   앱 정보 스크린
└── +not-found.tsx      #   404 폴백

features/               # 기능 슬라이스 (비즈니스 로직)
└── {feature-name}/
    ├── index.ts        #   public API (barrel export)
    ├── store.ts        #   Zustand 스토어
    ├── repository.ts   #   데이터 접근 (API/DB)
    ├── service.ts      #   비즈니스 로직
    ├── hooks.ts        #   React 훅
    ├── types.ts        #   타입 정의
    └── ui/             #   feature 전용 컴포넌트

shared/                 # 공유 유틸리티 (feature 간 공유)
├── types/              #   공통 타입
├── lib/                #   유틸 함수
├── api/                #   API 클라이언트, 공통 fetch 로직
└── index.ts

components/             # 공통 UI 컴포넌트
├── Themed.tsx          #   useColors 훅 (라이트/다크 모드)
└── index.ts

constants/              # 상수
└── Colors.ts           #   라이트/다크 색상 팔레트

hooks/                  # 공통 훅
└── index.ts
```

### 레이어 규칙

1. **app/**: 라우팅만 담당. 비즈니스 로직 금지. features와 components를 조합한다.
2. **features/**: 각 슬라이스는 독립적. 다른 feature를 직접 import하지 않는다. shared만 의존.
3. **shared/**: 어떤 feature에도 의존하지 않는 순수 유틸리티.
4. **components/**: feature에 속하지 않는 범용 UI 컴포넌트.

### 의존성 방향

```
app/ → features/ → shared/
app/ → components/ → constants/
```

## Path Aliases

| Alias | 경로 |
|-------|------|
| `@shared/*` | `shared/*` |
| `@features/*` | `features/*` |
| `@components/*` | `components/*` |
| `@hooks/*` | `hooks/*` |
| `@constants/*` | `constants/*` |

## 컨벤션

- 컴포넌트: PascalCase (`HomeScreen.tsx`)
- 훅: camelCase, `use` 접두사 (`useColors`)
- 스토어: camelCase, `use...Store` 패턴 (`useExampleStore`)
- barrel export: 각 디렉토리의 `index.ts`에서 public API만 노출
- 스타일: `StyleSheet.create()` 사용, 컴포넌트 파일 하단에 위치

## 새 Feature 추가 방법

```bash
mkdir -p features/{name}
# 최소: index.ts + store.ts
# 필요시: repository.ts, service.ts, hooks.ts, types.ts, ui/
```

## 새 스크린 추가 방법

- 탭 스크린: `app/(tabs)/{name}/index.tsx` + `_layout.tsx` 생성, `(tabs)/_layout.tsx`에 탭 등록
- 모달/상세: `app/{name}.tsx` 생성, `app/_layout.tsx`에 Stack.Screen 등록

## 명령어

```bash
npm start          # Expo 개발 서버
npm run ios        # iOS 시뮬레이터
npm run android    # Android 에뮬레이터
npx tsc --noEmit   # 타입 체크
```
