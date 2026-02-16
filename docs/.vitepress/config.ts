import { defineConfig } from 'vitepress'
import { installMintContainers } from './theme/markdown-tabs'

export default defineConfig({
  title: 'OpenClaw 한국어 문서',
  description: 'OpenClaw 비공식 한국어 문서 - AI 개인 비서 게이트웨이',
  lang: 'ko-KR',

  head: [
    ['link', { rel: 'icon', href: '/openclaw-docs-ko/assets/pixel-lobster.svg' }],
    ['meta', { name: 'theme-color', content: '#FF5A36' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:locale', content: 'ko_KR' }],
    ['meta', { property: 'og:title', content: 'OpenClaw 한국어 문서' }],
    ['meta', { property: 'og:site_name', content: 'OpenClaw 한국어 문서' }],
  ],

  themeConfig: {
    logo: '/assets/pixel-lobster.svg',

    nav: [
      { text: '시작하기', link: '/start/getting-started' },
      { text: '설치', link: '/install/' },
      { text: '채널', link: '/channels/' },
      { text: '에이전트', link: '/concepts/architecture' },
      { text: '도구', link: '/tools/' },
      { text: '모델', link: '/providers/' },
      { text: '플랫폼', link: '/platforms/' },
      { text: '게이트웨이', link: '/gateway/' },
      {
        text: '링크',
        items: [
          { text: '공식 영문 문서', link: 'https://docs.openclaw.ai' },
          { text: 'GitHub', link: 'https://github.com/openclaw/openclaw' },
          { text: 'Discord', link: 'https://discord.gg/clawd' },
        ]
      }
    ],

    sidebar: {
      '/': [
        {
          text: '홈',
          items: [
            { text: 'OpenClaw', link: '/' },
          ]
        },
        {
          text: '개요',
          items: [
            { text: '쇼케이스', link: '/start/showcase' },
          ]
        },
        {
          text: '핵심 개념',
          items: [
            { text: '기능', link: '/concepts/features' },
          ]
        },
        {
          text: '시작하기',
          items: [
            { text: '시작 가이드', link: '/start/getting-started' },
            { text: '온보딩 개요', link: '/start/onboarding-overview' },
            { text: '설정 마법사', link: '/start/wizard' },
            { text: '온보딩', link: '/start/onboarding' },
          ]
        },
        {
          text: '가이드',
          items: [
            { text: 'OpenClaw 소개', link: '/start/openclaw' },
            { text: '부트스트래핑', link: '/start/bootstrapping' },
          ]
        },
      ],

      '/start/': [
        {
          text: '홈',
          items: [
            { text: '소개', link: '/' },
          ]
        },
        {
          text: '시작하기',
          items: [
            { text: '시작 가이드', link: '/start/getting-started' },
            { text: '온보딩 개요', link: '/start/onboarding-overview' },
            { text: '설정 마법사', link: '/start/wizard' },
            { text: '온보딩', link: '/start/onboarding' },
          ]
        },
        {
          text: '개요',
          items: [
            { text: '쇼케이스', link: '/start/showcase' },
          ]
        },
        {
          text: '가이드',
          items: [
            { text: 'OpenClaw 소개', link: '/start/openclaw' },
            { text: '부트스트래핑', link: '/start/bootstrapping' },
          ]
        },
      ],

      '/install/': [
        {
          text: '설치 개요',
          items: [
            { text: '설치', link: '/install/' },
            { text: '설치 스크립트', link: '/install/installer' },
          ]
        },
        {
          text: '설치 방법',
          items: [
            { text: 'Docker', link: '/install/docker' },
            { text: 'Nix', link: '/install/nix' },
            { text: 'Ansible', link: '/install/ansible' },
            { text: 'Bun', link: '/install/bun' },
          ]
        },
        {
          text: '유지보수',
          items: [
            { text: '업데이트', link: '/install/updating' },
            { text: '마이그레이션', link: '/install/migrating' },
            { text: '삭제', link: '/install/uninstall' },
          ]
        },
        {
          text: '호스팅 및 배포',
          items: [
            { text: 'Fly.io', link: '/install/fly' },
            { text: 'Hetzner', link: '/install/hetzner' },
            { text: 'GCP', link: '/install/gcp' },
            { text: 'macOS VM', link: '/install/macos-vm' },
            { text: 'exe.dev', link: '/install/exe-dev' },
          ]
        },
        {
          text: '고급',
          items: [
            { text: '개발 채널', link: '/install/development-channels' },
          ]
        },
      ],

      '/channels/': [
        {
          text: '개요',
          items: [
            { text: '채널', link: '/channels/' },
          ]
        },
        {
          text: '메시징 플랫폼',
          items: [
            { text: 'WhatsApp', link: '/channels/whatsapp' },
            { text: 'Telegram', link: '/channels/telegram' },
            { text: 'Discord', link: '/channels/discord' },
            { text: 'IRC', link: '/channels/irc' },
            { text: 'Slack', link: '/channels/slack' },
            { text: 'Feishu', link: '/channels/feishu' },
            { text: 'Google Chat', link: '/channels/googlechat' },
            { text: 'Mattermost', link: '/channels/mattermost' },
            { text: 'Signal', link: '/channels/signal' },
            { text: 'iMessage', link: '/channels/imessage' },
            { text: 'Microsoft Teams', link: '/channels/msteams' },
            { text: 'Line', link: '/channels/line' },
            { text: 'Matrix', link: '/channels/matrix' },
            { text: 'Zalo', link: '/channels/zalo' },
            { text: 'Zalo (개인)', link: '/channels/zalouser' },
          ]
        },
        {
          text: '설정',
          items: [
            { text: '페어링', link: '/channels/pairing' },
            { text: '그룹 메시지', link: '/channels/group-messages' },
            { text: '그룹', link: '/channels/groups' },
            { text: '브로드캐스트 그룹', link: '/channels/broadcast-groups' },
            { text: '채널 라우팅', link: '/channels/channel-routing' },
            { text: '위치', link: '/channels/location' },
            { text: '문제 해결', link: '/channels/troubleshooting' },
          ]
        },
      ],

      '/concepts/': [
        {
          text: '기초',
          items: [
            { text: '아키텍처', link: '/concepts/architecture' },
            { text: '에이전트', link: '/concepts/agent' },
            { text: '에이전트 루프', link: '/concepts/agent-loop' },
            { text: '시스템 프롬프트', link: '/concepts/system-prompt' },
            { text: '컨텍스트', link: '/concepts/context' },
            { text: '에이전트 워크스페이스', link: '/concepts/agent-workspace' },
            { text: 'OAuth', link: '/concepts/oauth' },
          ]
        },
        {
          text: '세션과 메모리',
          items: [
            { text: '세션', link: '/concepts/session' },
            { text: '세션 목록', link: '/concepts/sessions' },
            { text: '세션 정리', link: '/concepts/session-pruning' },
            { text: '세션 도구', link: '/concepts/session-tool' },
            { text: '메모리', link: '/concepts/memory' },
            { text: '압축', link: '/concepts/compaction' },
          ]
        },
        {
          text: '멀티 에이전트',
          items: [
            { text: '멀티 에이전트', link: '/concepts/multi-agent' },
            { text: '프레즌스', link: '/concepts/presence' },
          ]
        },
        {
          text: '메시지와 전달',
          items: [
            { text: '메시지', link: '/concepts/messages' },
            { text: '스트리밍', link: '/concepts/streaming' },
            { text: '재시도', link: '/concepts/retry' },
            { text: '큐', link: '/concepts/queue' },
          ]
        },
        {
          text: '모델',
          items: [
            { text: '모델', link: '/concepts/models' },
            { text: '모델 프로바이더', link: '/concepts/model-providers' },
            { text: '모델 장애 조치', link: '/concepts/model-failover' },
          ]
        },
      ],

      '/tools/': [
        {
          text: '개요',
          items: [
            { text: '도구', link: '/tools/' },
          ]
        },
        {
          text: '내장 도구',
          items: [
            { text: 'Lobster', link: '/tools/lobster' },
            { text: 'LLM Task', link: '/tools/llm-task' },
            { text: '실행 (Exec)', link: '/tools/exec' },
            { text: '웹', link: '/tools/web' },
            { text: 'Apply Patch', link: '/tools/apply-patch' },
            { text: 'Elevated', link: '/tools/elevated' },
            { text: 'Thinking', link: '/tools/thinking' },
            { text: 'Reactions', link: '/tools/reactions' },
          ]
        },
        {
          text: '브라우저',
          items: [
            { text: '브라우저', link: '/tools/browser' },
            { text: '브라우저 로그인', link: '/tools/browser-login' },
            { text: 'Chrome 확장', link: '/tools/chrome-extension' },
            { text: 'Linux 문제 해결', link: '/tools/browser-linux-troubleshooting' },
          ]
        },
        {
          text: '에이전트 협업',
          items: [
            { text: '에이전트 전송', link: '/tools/agent-send' },
            { text: '서브 에이전트', link: '/tools/subagents' },
            { text: '멀티 에이전트 샌드박스', link: '/tools/multi-agent-sandbox-tools' },
          ]
        },
        {
          text: '스킬',
          items: [
            { text: '슬래시 명령어', link: '/tools/slash-commands' },
            { text: '스킬', link: '/tools/skills' },
            { text: '스킬 설정', link: '/tools/skills-config' },
            { text: 'ClawHub', link: '/tools/clawhub' },
            { text: '플러그인', link: '/tools/plugin' },
          ]
        },
        {
          text: '자동화',
          items: [
            { text: 'Hooks', link: '/automation/hooks' },
            { text: '크론 잡', link: '/automation/cron-jobs' },
            { text: '크론 vs 하트비트', link: '/automation/cron-vs-heartbeat' },
            { text: '자동화 문제 해결', link: '/automation/troubleshooting' },
            { text: '웹훅', link: '/automation/webhook' },
            { text: 'Gmail Pub/Sub', link: '/automation/gmail-pubsub' },
            { text: '폴링', link: '/automation/poll' },
            { text: '인증 모니터링', link: '/automation/auth-monitoring' },
          ]
        },
        {
          text: '미디어와 디바이스',
          items: [
            { text: '노드', link: '/nodes/' },
            { text: '노드 문제 해결', link: '/nodes/troubleshooting' },
            { text: '이미지', link: '/nodes/images' },
            { text: '오디오', link: '/nodes/audio' },
            { text: '카메라', link: '/nodes/camera' },
            { text: '통화 모드', link: '/nodes/talk' },
            { text: 'Voice Wake', link: '/nodes/voicewake' },
            { text: '위치 명령', link: '/nodes/location-command' },
          ]
        },
      ],

      '/providers/': [
        {
          text: '개요',
          items: [
            { text: '프로바이더', link: '/providers/' },
            { text: '모델 목록', link: '/providers/models' },
          ]
        },
        {
          text: '프로바이더',
          items: [
            { text: 'Anthropic', link: '/providers/anthropic' },
            { text: 'OpenAI', link: '/providers/openai' },
            { text: 'OpenRouter', link: '/providers/openrouter' },
            { text: 'LiteLLM', link: '/providers/litellm' },
            { text: 'AWS Bedrock', link: '/providers/bedrock' },
            { text: 'Vercel AI Gateway', link: '/providers/vercel-ai-gateway' },
            { text: 'Moonshot', link: '/providers/moonshot' },
            { text: 'MiniMax', link: '/providers/minimax' },
            { text: 'OpenCode', link: '/providers/opencode' },
            { text: 'GLM', link: '/providers/glm' },
            { text: 'Z.AI', link: '/providers/zai' },
            { text: 'Synthetic', link: '/providers/synthetic' },
            { text: 'Qianfan', link: '/providers/qianfan' },
          ]
        },
      ],

      '/platforms/': [
        {
          text: '플랫폼 개요',
          items: [
            { text: '플랫폼', link: '/platforms/' },
            { text: 'macOS', link: '/platforms/macos' },
            { text: 'Linux', link: '/platforms/linux' },
            { text: 'Windows', link: '/platforms/windows' },
            { text: 'Android', link: '/platforms/android' },
            { text: 'iOS', link: '/platforms/ios' },
          ]
        },
        {
          text: 'macOS 앱',
          items: [
            { text: '개발 설정', link: '/platforms/mac/dev-setup' },
            { text: '메뉴 바', link: '/platforms/mac/menu-bar' },
            { text: 'Voice Wake', link: '/platforms/mac/voicewake' },
            { text: '음성 오버레이', link: '/platforms/mac/voice-overlay' },
            { text: 'WebChat', link: '/platforms/mac/webchat' },
            { text: 'Canvas', link: '/platforms/mac/canvas' },
            { text: '자식 프로세스', link: '/platforms/mac/child-process' },
            { text: '상태', link: '/platforms/mac/health' },
            { text: '아이콘', link: '/platforms/mac/icon' },
            { text: '로깅', link: '/platforms/mac/logging' },
            { text: '권한', link: '/platforms/mac/permissions' },
            { text: '리모트', link: '/platforms/mac/remote' },
            { text: '서명', link: '/platforms/mac/signing' },
            { text: '릴리스', link: '/platforms/mac/release' },
            { text: '번들 게이트웨이', link: '/platforms/mac/bundled-gateway' },
            { text: 'XPC', link: '/platforms/mac/xpc' },
            { text: '스킬', link: '/platforms/mac/skills' },
            { text: 'Peekaboo', link: '/platforms/mac/peekaboo' },
          ]
        },
      ],

      '/gateway/': [
        {
          text: '게이트웨이',
          items: [
            { text: '개요', link: '/gateway/' },
          ]
        },
        {
          text: '설정과 운영',
          items: [
            { text: '설정', link: '/gateway/configuration' },
            { text: '설정 레퍼런스', link: '/gateway/configuration-reference' },
            { text: '설정 예시', link: '/gateway/configuration-examples' },
            { text: '인증', link: '/gateway/authentication' },
            { text: '상태 확인', link: '/gateway/health' },
            { text: '하트비트', link: '/gateway/heartbeat' },
            { text: 'Doctor', link: '/gateway/doctor' },
            { text: '로깅', link: '/gateway/logging' },
            { text: '게이트웨이 잠금', link: '/gateway/gateway-lock' },
            { text: '백그라운드 프로세스', link: '/gateway/background-process' },
            { text: '다중 게이트웨이', link: '/gateway/multiple-gateways' },
            { text: '문제 해결', link: '/gateway/troubleshooting' },
          ]
        },
        {
          text: '보안과 샌드박싱',
          items: [
            { text: '보안', link: '/gateway/security/' },
            { text: '샌드박싱', link: '/gateway/sandboxing' },
            { text: '샌드박스 vs 도구 정책', link: '/gateway/sandbox-vs-tool-policy-vs-elevated' },
          ]
        },
        {
          text: '프로토콜과 API',
          items: [
            { text: '프로토콜', link: '/gateway/protocol' },
            { text: '브릿지 프로토콜', link: '/gateway/bridge-protocol' },
            { text: 'OpenAI HTTP API', link: '/gateway/openai-http-api' },
            { text: 'Tools Invoke HTTP API', link: '/gateway/tools-invoke-http-api' },
            { text: 'CLI 백엔드', link: '/gateway/cli-backends' },
            { text: '로컬 모델', link: '/gateway/local-models' },
          ]
        },
        {
          text: '네트워킹과 디스커버리',
          items: [
            { text: '네트워크 모델', link: '/gateway/network-model' },
            { text: '페어링', link: '/gateway/pairing' },
            { text: '디스커버리', link: '/gateway/discovery' },
            { text: 'Bonjour', link: '/gateway/bonjour' },
          ]
        },
        {
          text: '원격 접속',
          items: [
            { text: '원격 접속', link: '/gateway/remote' },
            { text: '원격 게이트웨이', link: '/gateway/remote-gateway-readme' },
            { text: 'Tailscale', link: '/gateway/tailscale' },
          ]
        },
        {
          text: '웹 인터페이스',
          items: [
            { text: '웹', link: '/web/' },
            { text: 'Control UI', link: '/web/control-ui' },
            { text: '대시보드', link: '/web/dashboard' },
            { text: 'WebChat', link: '/web/webchat' },
            { text: 'TUI', link: '/web/tui' },
          ]
        },
      ],

      '/reference/': [
        {
          text: 'CLI 명령어',
          items: [
            { text: 'CLI 개요', link: '/cli/' },
          ]
        },
        {
          text: '레퍼런스',
          items: [
            { text: 'RPC', link: '/reference/rpc' },
            { text: '디바이스 모델', link: '/reference/device-models' },
          ]
        },
      ],

      '/help/': [
        {
          text: '도움말',
          items: [
            { text: '개요', link: '/help/' },
            { text: '문제 해결', link: '/help/troubleshooting' },
            { text: 'FAQ', link: '/help/faq' },
          ]
        },
      ],
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/openclaw/openclaw' },
      { icon: 'discord', link: 'https://discord.gg/clawd' },
    ],

    editLink: {
      pattern: 'https://github.com/feelsodev/openclaw-docs-ko/edit/main/docs/:path',
      text: '이 페이지 수정하기'
    },

    lastUpdated: {
      text: '마지막 업데이트',
      formatOptions: {
        dateStyle: 'short',
        timeStyle: 'short',
      }
    },

    footer: {
      message: '비공식 커뮤니티 번역 · <a href="https://docs.openclaw.ai">공식 영문 문서</a>',
      copyright: 'OpenClaw 프로젝트에 의해 MIT 라이선스로 배포됨'
    },

    search: {
      provider: 'local',
      options: {
        translations: {
          button: {
            buttonText: '검색',
            buttonAriaLabel: '검색',
          },
          modal: {
            displayDetails: '세부 목록 표시',
            resetButtonTitle: '검색 초기화',
            backButtonTitle: '검색 닫기',
            noResultsText: '결과를 찾을 수 없습니다',
            footer: {
              selectText: '선택',
              navigateText: '탐색',
              closeText: '닫기',
            },
          },
        },
      },
    },

    outline: {
      label: '이 페이지에서',
    },

    docFooter: {
      prev: '이전',
      next: '다음',
    },

    returnToTopLabel: '맨 위로',
    sidebarMenuLabel: '메뉴',
    darkModeSwitchLabel: '다크 모드',
    lightModeSwitchTitle: '라이트 모드로 전환',
    darkModeSwitchTitle: '다크 모드로 전환',
  },

  lastUpdated: true,
  cleanUrls: true,
  ignoreDeadLinks: true,

  markdown: {
    config: (md) => {
      installMintContainers(md)
    },
  },

  sitemap: {
    hostname: 'https://feelsodev.github.io/openclaw-docs-ko',
  },

  base: '/openclaw-docs-ko/',
})
