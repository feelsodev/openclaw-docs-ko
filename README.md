# OpenClaw 한국어 문서 🦞🇰🇷

[OpenClaw](https://github.com/openclaw/openclaw) 공식 문서의 **비공식 한국어 번역**입니다.

📖 **문서 사이트**: https://feelsodev.github.io/openclaw-docs-ko/

📖 **공식 영문 문서**: https://docs.openclaw.ai

## 구조

```
docs/                    # VitePress 문서 소스
├── .vitepress/
│   ├── config.ts        # VitePress 설정 (사이드바, 네비게이션)
│   └── theme/           # 커스텀 테마 + Mintlify 호환 컴포넌트
├── start/               # 시작하기
├── install/             # 설치
├── channels/            # 채널
├── concepts/            # 개념
├── tools/               # 도구
├── providers/           # 모델 프로바이더
├── platforms/           # 플랫폼
├── gateway/             # 게이트웨이
└── ...
.github/workflows/
├── deploy.yml           # main push → GitHub Pages 배포
└── sync-upstream.yml    # 12시간마다 upstream 변경 감지 → Issue 생성
```

## 개발

```bash
npm install
npm run dev       # 로컬 개발 서버
npm run build     # 프로덕션 빌드
npm run preview   # 빌드 결과 미리보기
```

## 번역 워크플로우

1. **자동 감지**: GitHub Actions가 12시간마다 [upstream docs](https://github.com/openclaw/openclaw/tree/main/docs) 변경을 체크합니다
2. **Issue 생성**: 변경이 감지되면 자동으로 Issue가 생성됩니다 (`upstream-sync` 라벨)
3. **번역**: Issue에 나열된 파일을 번역합니다
4. **PR & 배포**: PR을 만들고 merge하면 자동으로 GitHub Pages에 배포됩니다

## 기여하기

번역 기여를 환영합니다!

1. 이 레포를 fork합니다
2. 번역할 파일을 수정합니다
3. PR을 올립니다

### 번역 가이드라인

- 기술 용어(API, CLI, Gateway 등)는 영문 그대로 유지
- 코드 블록 내용은 번역하지 않음
- 링크 경로는 변경하지 않음 (상대 경로 유지)
- 자연스러운 한국어 표현 사용

## 라이선스

원본 OpenClaw 프로젝트는 [MIT 라이선스](https://github.com/openclaw/openclaw/blob/main/LICENSE)로 배포됩니다.
