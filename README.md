# Run Pikachu! (달려라 피카츄!)

## 프로젝트 개요

**Run Pikachu!**는 모두가 사랑하는 포켓몬 피카츄가 장애물을 피하며 달려 나가는 횡스크롤 러닝 액션 게임입니다.

플레이어는 점프(스페이스바)와 빠른 하강(↓) 기능을 활용해 다양한 장애물을 피하고, 오래 달릴수록 점수가 높아지는 기록 경쟁을 즐길 수 있습니다.
Supabase를 연동하여 실시간 랭킹 시스템을 구축하였으며,
별도의 게임 엔진 없이 React와 TypeScript 만으로 부드러운 게임 플레이 경험을 제공하기 위해 최적화된 렌더링 로직을 설계해 적용했습니다.

## 기술 스택

- **Framework**: React, Vite
- **Language**: TypeScript
- **Styling**: CSS Modules
- **State Management**: Zustand
- **Database**: Supabase (Ranking System)
- **Animation**: requestAnimationFrame (Physics-based movement)

## 주요 기능

- **피카츄 액션 (Jump & Fast Fall)**:
  - **점프 & 더블 점프**: 스페이스바를 누를 시, 또는 모바일 환경에서 점프 버튼 터치 시 피카츄가 점프합니다. 공중에서 한 번 더 점프할 수 있는 **더블 점프** 기능을 지원하여 높은 장애물을 피하거나 체공 시간을 늘릴 수 있습니다. 적절한 중력 가속도 값을 적용해 피카츄가 자연스러운 포물선 운동을 하도록 구현했습니다.

  - **빠른 하강**: 공중에서 아래 방향키를 누르면 중력이 강하게 적용되어 빠르게 착지할 수 있습니다. 이를 통해 급박한 장애물 패턴에 전략적으로 대응할 수 있습니다.

  - **구현**: `usePikachuJump` 커스텀훅에서 `requestAnimationFrame`을 사용하여 프레임 단위로 위치를 계산하며, 게임 진행 시간에 따라 중력 값이 동적으로 변화하여 난이도를 조절합니다. 또한 `jumpCountRef`를 통해 점프 횟수를 제어하여 최대 2단 점프까지 허용합니다.

- **장애물 생성 및 이동 (Obstacle System)**:
  - **가중치 기반 랜덤 생성**: 디그다, 나시, 야돈 등 다양한 회피 난이도를 갖춘 포켓몬 장애물이 등장하며, 각 장애물마다 등장 확률(가중치)이 다르게 설정되어 적절한 게임 난이도를 어느정도 보장합니다.

  - **동적 속도 조절**: 게임이 진행될수록 장애물의 이동 속도가 빨라지고 생성 주기가 짧아져 점진적으로 게임 난이도와 긴장감을 더해지도록 설계했습니다.

  - **구현**: `useGameLoop`에서 장애물의 위치를 관리하며, React의 리렌더링 부하를 줄이기 위해 DOM 요소의 `transform` 속성을 직접 제어하여 부드러운 움직임을 구현했습니다.

- **충돌 감지 및 처리 (Collision Detection)**:
  - 피카츄와 장애물의 스프라이트 이미지보다 작은 **정밀 히트박스(Hitbox)**를 따로 설정하고 관리해 플레이어가 시각적으로 납득할 수 있으면서 과하게 빡빡하지 않은 유연한 판정을 제공합니다.

  - **구현**: `collisionDetectionLogic`에서 피카츄와 장애물의 실시간 위치 좌표를 기반으로 교차 여부를 판단합니다. 특히 장애물의 위치는 `Map` 객체(`obstaclePositions`)를 통해 컴포넌트 간 교환되도록 하여, React 상태 업데이트의 지연을 방지하고 실시간성을 추가적으로 보장합니다.

- **점수 DB 저장 및 실시간 랭킹 시스템 (Supabase)**:
  - 게임 종료 시 플레이어의 점수를 Supabase 데이터베이스의 테이블(`TB_RECORD_MASTER`)에 저장하고, 해당 테이블 내 상위 랭커들의 기록 데이터를 실시간으로 조회하여 보여줍니다.

  - **구현**: `supabaseLogics` 모듈을 통해 데이터베이스와 통신하며, `GameOverScoreInfos` 컴포넌트에서 랭킹 리스트를 렌더링합니다.

- **필수 에셋 프리 로딩 (Asset Pre-loading)**:
  - 게임 시작 전 로딩 화면에서 게임에 필요한 이미지와 사운드 리소스를 미리 메모리에 로드하여, 게임 플레이 도중 리소스 로딩으로 인한 프레임 드랍이나 끊김, 장애물이 보이지 않는 등 버그성 현상들을 방지했습니다.

  - **구현**: `useLoadImages` 훅에서 `Image` 객체를 생성하여 주요 에셋들을 미리 캐싱하고, 모든 리소스가 준비되면 게임 시작 버튼이 활성화되도록 처리했습니다.

- **반응형 디자인**:
  - 데스크탑과 모바일 환경 모두에서 쾌적하게 플레이할 수 있도록 화면 크기에 따라 게임 요소들의 크기와 위치가 자동으로 조절됩니다. `getResponsiveSizeParams` 유틸리티를 통해 다양한 해상도에 대응합니다.

## 프로젝트 구조 (Project Structure)

```
src/
├── components/                 # UI 및 게임 오브젝트 컴포넌트
│   ├── Board/                  # 게임 메인 보드 및 UI 컨테이너
│   ├── GameOverInfos/          # 게임 오버 시 점수 및 랭킹 표시
│   ├── LoadingScreen/          # 초기 로딩 화면
│   ├── Obstacle/               # 장애물 컴포넌트
│   ├── Pikachu/                # 피카츄 캐릭터 컴포넌트
│   └── ...
├── hooks/                      # 게임 로직을 담당하는 커스텀 훅
│   ├── useGameLoop.ts          # 메인 게임 루프 (장애물 이동, 상태 업데이트)
│   ├── usePikachuJump.ts       # 피카츄 점프 물리 연산
│   ├── useHandleCollision.ts   # 충돌 감지 핸들러
│   ├── useLoadImages.ts        # 이미지 프리로딩
│   ├── useLoadScores.ts        # 랭킹 데이터 로딩
│   └── ...
├── logic/                      # 순수 비즈니스 로직
│   ├── collisionDetectionLogic.ts # 충돌 판정 알고리즘
│   ├── obstacleLogic.ts        # 장애물 생성 로직
│   ├── scoreLogic.ts           # 점수 계산 로직
│   └── supabaseLogics.ts       # Supabase API 호출
├── store/                      # 전역 상태 관리 (Zustand)
│   └── gameStore.ts            # 게임 상태, 설정, 물리 상수 등
└── types/                      # TypeScript 타입 정의
    ├── ObstacleType.ts
    └── PikachuType.ts
```
