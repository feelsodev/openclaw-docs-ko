---
title: "CLI Reference"
---
# CLI 참조

이 페이지에서는 현재 CLI 동작을 설명합니다. 명령이 변경되면 이 문서를 업데이트하세요.

## 명령 페이지

- [`setup`](/cli/setup)
- [`onboard`](/cli/onboard)
- [`configure`](/cli/configure)
- [`config`](/cli/config)
- [`doctor`](/cli/doctor)
- [`dashboard`](/cli/dashboard)
- [`reset`](/cli/reset)
- [`uninstall`](/cli/uninstall)
- [`update`](/cli/update)
- [`message`](/cli/message)
- [`agent`](/cli/agent)
- [`agents`](/cli/agents)
- [`acp`](/cli/acp)
- [`status`](/cli/status)
- [`health`](/cli/health)
- [`sessions`](/cli/sessions)
- [`gateway`](/cli/gateway)
- [`logs`](/cli/logs)
- [`system`](/cli/system)
- [`models`](/cli/models)
- [`memory`](/cli/memory)
- [`nodes`](/cli/nodes)
- [`devices`](/cli/devices)
- [`node`](/cli/node)
- [`approvals`](/cli/approvals)
- [`sandbox`](/cli/sandbox)
- [`tui`](/cli/tui)
- [`browser`](/cli/browser)
- [`cron`](/cli/cron)
- [`dns`](/cli/dns)
- [`docs`](/cli/docs)
- [`hooks`](/cli/hooks)
- [`webhooks`](/cli/webhooks)
- [`pairing`](/cli/pairing)
- [`plugins`](/cli/plugins) (플러그인 명령)
- [`channels`](/cli/channels)
- [`security`](/cli/security)
- [`skills`](/cli/skills)
- [`voicecall`](/cli/voicecall) (플러그인, 설치된 경우)

## 글로벌 플래그

- `--dev`: `~/.openclaw-dev` 아래 상태를 격리하고 기본 포트를 이동합니다.
- `--profile &lt;name&gt;`: `~/.openclaw-&lt;name&gt;` 아래 상태를 격리합니다.
- `--no-color`: ANSI 색상을 비활성화합니다.
- `--update`: `openclaw update`의 약어입니다(소스 설치에만 해당).
- `-V`, `--version`, `-v`: 버전을 인쇄하고 종료합니다.

## 출력 스타일

- ANSI 색상 및 진행률 표시기는 TTY 세션에서만 렌더링됩니다.
- OSC-8 하이퍼링크는 지원되는 터미널에서 클릭 가능한 링크로 렌더링됩니다. 그렇지 않으면 일반 URL로 대체됩니다.
- `--json` (및 지원되는 경우 `--plain`)는 깔끔한 출력을 위해 스타일을 비활성화합니다.
- `--no-color`는 ANSI 스타일을 비활성화합니다. `NO_COLOR=1`도 존중됩니다.
- 장기 실행 명령에는 진행률 표시기가 표시됩니다(지원되는 경우 OSC 9;4).

## 색상 팔레트

OpenClaw는 CLI 출력을 위해 랍스터 팔레트를 사용합니다.

- `accent` (#FF5A2D): 제목, 레이블, 주요 강조 표시.
- `accentBright` (#FF7A3D): 명령 이름, 강조.
- `accentDim` (#D14A22): 보조 강조 텍스트입니다.
- `info` (#FF8A5B): 정보용 값입니다.
- `success` (#2FBF71): 성공 상태입니다.
- `warn` (#FFB020): 경고, 대체, 주의.
- `error` (#E23D2D): 오류, 실패.
- `muted` (#8B7F77): 강조 해제, 메타데이터.

팔레트 정보 출처: `src/terminal/palette.ts` (일명 "랍스터 솔기").

## 명령 트리

```
openclaw [--dev] [--profile <name>] <command>
  setup
  onboard
  configure
  config
    get
    set
    unset
  doctor
  security
    audit
  reset
  uninstall
  update
  channels
    list
    status
    logs
    add
    remove
    login
    logout
  skills
    list
    info
    check
  plugins
    list
    info
    install
    enable
    disable
    doctor
  memory
    status
    index
    search
  message
  agent
  agents
    list
    add
    delete
  acp
  status
  health
  sessions
  gateway
    call
    health
    status
    probe
    discover
    install
    uninstall
    start
    stop
    restart
    run
  logs
  system
    event
    heartbeat last|enable|disable
    presence
  models
    list
    status
    set
    set-image
    aliases list|add|remove
    fallbacks list|add|remove|clear
    image-fallbacks list|add|remove|clear
    scan
    auth add|setup-token|paste-token
    auth order get|set|clear
  sandbox
    list
    recreate
    explain
  cron
    status
    list
    add
    edit
    rm
    enable
    disable
    runs
    run
  nodes
  devices
  node
    run
    status
    install
    uninstall
    start
    stop
    restart
  approvals
    get
    set
    allowlist add|remove
  browser
    status
    start
    stop
    reset-profile
    tabs
    open
    focus
    close
    profiles
    create-profile
    delete-profile
    screenshot
    snapshot
    navigate
    resize
    click
    type
    press
    hover
    drag
    select
    upload
    fill
    dialog
    wait
    evaluate
    console
    pdf
  hooks
    list
    info
    check
    enable
    disable
    install
    update
  webhooks
    gmail setup|run
  pairing
    list
    approve
  docs
  dns
    setup
  tui
```

참고: 플러그인은 추가적인 최상위 명령을 추가할 수 있습니다(예: `openclaw voicecall`).

## 보안

- `openclaw security audit` — 일반적인 보안 풋건에 대한 감사 구성 + 로컬 상태.
- `openclaw security audit --deep` — 최선의 라이브 게이트웨이 프로브입니다.
- `openclaw security audit --fix` — 안전한 기본값과 chmod 상태/구성을 강화합니다.

## 플러그인

확장 프로그램 및 해당 구성을 관리합니다.

- `openclaw plugins list` — 플러그인을 검색합니다(머신 출력에는 `--json` 사용).
- `openclaw plugins info &lt;id&gt;` — 플러그인에 대한 세부 정보를 표시합니다.
- `openclaw plugins install &lt;path|.tgz|npm-spec&gt;` — 플러그인을 설치합니다(또는 `plugins.load.paths`에 플러그인 경로를 추가합니다).
- `openclaw plugins enable &lt;id&gt;` / `disable &lt;id&gt;` — `plugins.entries.&lt;id&gt;.enabled`를 전환합니다.
- `openclaw plugins doctor` — 플러그인 로드 오류를 보고합니다.

대부분의 플러그인 변경에는 게이트웨이를 다시 시작해야 합니다. [/plugin](/tools/plugin)를 참조하세요.

## 메모리

`MEMORY.md` + `memory/*.md`에 대한 벡터 검색:

- `openclaw memory status` — 인덱스 통계를 표시합니다.
- `openclaw memory index` — 메모리 파일을 다시 색인화합니다.
- `openclaw memory search "&lt;query&gt;"` — 메모리에 대한 의미 검색.

## 채팅 슬래시 명령

채팅 메시지는 `/...` 명령(텍스트 및 기본)을 지원합니다. [/tools/slash-commands](/tools/slash-commands)를 참조하세요.

하이라이트:

- `/status` 빠른 진단을 위한 것입니다.
- 지속적인 구성 변경의 경우 `/config`.
- 런타임 전용 구성 재정의를 위한 `/debug`(디스크가 아닌 메모리, `commands.debug: true` 필요).

## 설정 + 온보딩

### `setup`

구성 + 작업공간을 초기화합니다.

옵션:

- `--workspace &lt;dir&gt;`: 에이전트 작업공간 경로(기본값 `~/.openclaw/workspace`).
- `--wizard`: 온보딩 마법사를 실행합니다.
- `--non-interactive`: 프롬프트 없이 마법사를 실행합니다.
- `--mode &lt;local|remote&gt;`: 마법사 모드.
- `--remote-url &lt;url&gt;` : 원격 게이트웨이 URL.
- `--remote-token &lt;token&gt;`: 원격 게이트웨이 토큰.

마법사 플래그(`--non-interactive`, `--mode`, `--remote-url`, `--remote-token`)가 있으면 마법사가 자동 실행됩니다.

### `onboard`

게이트웨이, 작업 영역 및 기술을 설정하는 대화형 마법사입니다.

옵션:

- `--workspace &lt;dir&gt;`
- `--reset` (마법사 전에 구성 + 자격 증명 + 세션 + 작업 공간 재설정)
- `--non-interactive`
- `--mode &lt;local|remote&gt;`
- `--flow &lt;quickstart|advanced|manual&gt;` (설명서는 고급의 별칭입니다)
- `--auth-choice &lt;setup-token|token|chutes|openai-codex|openai-api-key|openrouter-api-key|ai-gateway-api-key|moonshot-api-key|moonshot-api-key-cn|kimi-code-api-key|synthetic-api-key|venice-api-key|gemini-api-key|zai-api-key|apiKey|minimax-api|minimax-api-lightning|opencode-zen|custom-api-key|skip&gt;`
- `--token-provider &lt;id&gt;` (비대화형, `--auth-choice token`와 함께 사용됨)
- `--token &lt;token&gt;` (비대화형, `--auth-choice token`와 함께 사용됨)
- `--token-profile-id &lt;id&gt;` (비대화형, 기본값: `&lt;provider&gt;:manual`)
- `--token-expires-in &lt;duration&gt;` (비대화형, 예: `365d`, `12h`)
- `--anthropic-api-key &lt;key&gt;`
- `--openai-api-key &lt;key&gt;`
- `--openrouter-api-key &lt;key&gt;`
- `--ai-gateway-api-key &lt;key&gt;`
- `--moonshot-api-key &lt;key&gt;`
- `--kimi-code-api-key &lt;key&gt;`
- `--gemini-api-key &lt;key&gt;`
- `--zai-api-key &lt;key&gt;`
- `--minimax-api-key &lt;key&gt;`
- `--opencode-zen-api-key &lt;key&gt;`
- `--custom-base-url &lt;url&gt;` (비대화형, `--auth-choice custom-api-key`와 함께 사용됨)
- `--custom-model-id &lt;id&gt;` (비대화형, `--auth-choice custom-api-key`와 함께 사용됨)
- `--custom-api-key &lt;key&gt;` (비대화형, 선택 사항, `--auth-choice custom-api-key`와 함께 사용, 생략 시 `CUSTOM_API_KEY`로 대체)
- `--custom-provider-id &lt;id&gt;` (비대화형, 선택적 사용자 정의 공급자 ID)
- `--custom-compatibility &lt;openai|anthropic&gt;` (비대화형, 선택 사항, 기본값 `openai`)
- `--gateway-port &lt;port&gt;`
- `--gateway-bind &lt;loopback|lan|tailnet|auto|custom&gt;`
- `--gateway-auth &lt;token|password&gt;`
- `--gateway-token &lt;token&gt;`
- `--gateway-password &lt;password&gt;`
- `--remote-url &lt;url&gt;`
- `--remote-token &lt;token&gt;`
- `--tailscale &lt;off|serve|funnel&gt;`
- `--tailscale-reset-on-exit`
- `--install-daemon`
- `--no-install-daemon` (별칭: `--skip-daemon`)
- `--daemon-runtime &lt;node|bun&gt;`
- `--skip-channels`
- `--skip-skills`
- `--skip-health`
- `--skip-ui`
- `--node-manager &lt;npm|pnpm|bun&gt;` (pnpm 권장, 게이트웨이 런타임에는 Bun이 권장되지 않음)
- `--json`

### `configure`

대화형 구성 마법사(모델, 채널, 기술, 게이트웨이)

### `config`

비대화형 구성 도우미(가져오기/설정/설정 해제). 없이 `openclaw config` 실행
하위 명령은 마법사를 시작합니다.

하위 명령:

- `config get &lt;path&gt;`: 구성 값(점/괄호 경로)을 인쇄합니다.
- `config set &lt;path&gt; &lt;value&gt;`: 값을 설정합니다(JSON5 또는 원시 문자열).
- `config unset &lt;path&gt;`: 값을 제거합니다.

### `doctor`

상태 확인 + 빠른 수정(구성 + 게이트웨이 + 레거시 서비스)

옵션:

- `--no-workspace-suggestions`: 작업 공간 메모리 힌트를 비활성화합니다.
- `--yes`: 프롬프트 없이 기본값을 수락합니다(헤드리스).
- `--non-interactive`: 프롬프트를 건너뜁니다. 안전한 마이그레이션만 적용하세요.
- `--deep`: 추가 게이트웨이 설치를 위해 시스템 서비스를 검색합니다.

## 채널 도우미

### `channels`

채팅 채널 계정(WhatsApp/Telegram/Discord/Google Chat/Slack/Mattermost(플러그인)/Signal/iMessage/MS Teams)을 관리합니다.

하위 명령:

- `channels list`: 구성된 채널 및 인증 프로필을 표시합니다.
- `channels status`: 게이트웨이 연결 가능성 및 채널 상태를 확인합니다(`--probe`는 추가 검사를 실행합니다. 게이트웨이 상태 프로브에는 `openclaw health` 또는 `openclaw status --deep`를 사용합니다).
- 팁: `channels status`는 일반적인 잘못된 구성을 감지할 수 있는 경우 제안된 수정 사항과 함께 경고를 인쇄합니다(그런 다음 `openclaw doctor`를 가리킵니다).
- `channels logs` : 게이트웨이 로그 파일 중 최근 채널 로그를 보여줍니다.
- `channels add`: 플래그가 전달되지 않은 경우 마법사 스타일 설정; 플래그는 비대화형 모드로 전환됩니다.
- `channels remove`: 기본적으로 비활성화됩니다. 프롬프트 없이 구성 항목을 제거하려면 `--delete`를 전달합니다.
- `channels login`: 대화형 채널 로그인(WhatsApp 웹에만 해당).
- `channels logout`: 채널 세션에서 로그아웃합니다(지원되는 경우).

일반적인 옵션:

- `--channel &lt;name&gt;`: `whatsapp|telegram|discord|googlechat|slack|mattermost|signal|imessage|msteams`
- `--account &lt;id&gt;`: 채널 계정 ID (기본값 `default`)
- `--name &lt;label&gt;` : 계정의 표시 이름

`channels login` 옵션:

- `--channel &lt;channel&gt;` (기본값 `whatsapp`; `whatsapp`/`web` 지원)
- `--account &lt;id&gt;`
- `--verbose`

`channels logout` 옵션:

- `--channel &lt;channel&gt;` (기본값 `whatsapp`)
- `--account &lt;id&gt;`

`channels list` 옵션:

- `--no-usage`: 모델 공급자 사용량/할당량 스냅샷을 건너뜁니다(OAuth/API 지원만 해당).
- `--json`: JSON을 출력합니다(`--no-usage`가 설정되지 않은 경우 사용법 포함).

`channels logs` 옵션:

- `--channel &lt;name|all&gt;` (기본값 `all`)
- `--lines &lt;n&gt;` (기본값 `200`)
- `--json`

자세한 내용: [/concepts/oauth](/concepts/oauth)

예:

```bash
openclaw channels add --channel telegram --account alerts --name "Alerts Bot" --token $TELEGRAM_BOT_TOKEN
openclaw channels add --channel discord --account work --name "Work Bot" --token $DISCORD_BOT_TOKEN
openclaw channels remove --channel discord --account work --delete
openclaw channels status --probe
openclaw status --deep
```

### `skills`

사용 가능한 기술과 준비 상태 정보를 나열하고 검사합니다.

하위 명령:

- `skills list`: 스킬 목록(하위 명령이 없을 경우 기본값).
- `skills info &lt;name&gt;` : 하나의 스킬에 대한 세부정보를 보여줍니다.
- `skills check`: 준비 요구사항과 누락된 요구사항의 요약입니다.

옵션:

- `--eligible` : 준비된 스킬만 보여줍니다.
- `--json`: JSON을 출력합니다(스타일링 없음).
- `-v`, `--verbose`: 누락된 요구사항 세부정보를 포함합니다.

팁: 스킬을 검색, 설치, 동기화하려면 `npx clawhub`를 사용하세요.

### `pairing`

채널 전반에 걸쳐 DM 페어링 요청을 승인합니다.

하위 명령:

- `pairing list &lt;channel&gt; [--json]`
- `pairing approve &lt;channel&gt; &lt;code&gt; [--notify]`

### `webhooks gmail`

Gmail Pub/Sub 후크 설정 + 실행기. [/automation/gmail-pubsub](/automation/gmail-pubsub)를 참조하세요.

하위 명령:

- `webhooks gmail setup` (`--account &lt;email&gt;` 필요; `--project`, `--topic`, `--subscription`, `--label`, `--hook-url` 지원, `--hook-token`, `--push-token`, `--bind`, `--port`, `--path`, `--include-body`, `--max-bytes`, `--renew-minutes`, `--tailscale`, `--tailscale-path`, `--tailscale-target`, `--push-endpoint`, `--json`)
- `webhooks gmail run` (동일한 플래그에 대한 런타임 재정의)

### `dns setup`

광역 검색 DNS 도우미(CoreDNS + Tailscale). [/gateway/discovery](/gateway/discovery)를 참조하세요.

옵션:

- `--apply`: CoreDNS 구성을 설치/업데이트합니다(sudo 필요, macOS에만 해당).

## 메시징 + 상담원

### `message`

통합 아웃바운드 메시징 + 채널 작업.

참조: [/cli/message](/cli/message)

하위 명령:

- `message send|poll|react|reactions|read|edit|delete|pin|unpin|pins|permissions|search|timeout|kick|ban`
- `message thread &lt;create|list|reply&gt;`
- `message emoji &lt;list|upload&gt;`
- `message sticker &lt;send|upload&gt;`
- `message role &lt;info|add|remove&gt;`
- `message channel &lt;info|list&gt;`
- `message member info`
- `message voice status`
- `message event &lt;list|create&gt;`

예:

- `openclaw message send --target +15555550123 --message "Hi"`
- `openclaw message poll --channel discord --target channel:123 --poll-question "Snack?" --poll-option Pizza --poll-option Sushi`

### `agent`

게이트웨이(또는 `--local` 내장)를 통해 하나의 에이전트 턴을 실행합니다.

필수:

- `--message &lt;text&gt;`

옵션:

- `--to &lt;dest&gt;` (세션 키 및 선택적 전달용)
- `--session-id &lt;id&gt;`
- `--thinking &lt;off|minimal|low|medium|high|xhigh&gt;` (GPT-5.2 + Codex 모델에만 해당)
- `--verbose &lt;on|full|off&gt;`
- `--channel &lt;whatsapp|telegram|discord|slack|mattermost|signal|imessage|msteams&gt;`
- `--local`
- `--deliver`
- `--json`
- `--timeout &lt;seconds&gt;`

### `agents`

격리된 에이전트를 관리합니다(작업 공간 + 인증 + 라우팅).

#### `agents list`

구성된 에이전트를 나열합니다.

옵션:

- `--json`
- `--bindings`

#### `agents add [name]`

격리된 새 에이전트를 추가합니다. 플래그(또는 `--non-interactive`)가 전달되지 않는 한 안내 마법사를 실행합니다. `--workspace`는 비대화형 모드에서 필요합니다.

옵션:

- `--workspace &lt;dir&gt;`
- `--model &lt;id&gt;`
- `--agent-dir &lt;dir&gt;`
- `--bind &lt;channel[:accountId]&gt;` (반복 가능)
- `--non-interactive`
- `--json`

바인딩 사양은 `channel[:accountId]`을 사용합니다. WhatsApp에서 `accountId`를 생략하면 기본 계정 ID가 사용됩니다.

#### `agents delete &lt;id&gt;`

에이전트를 삭제하고 해당 작업공간 + 상태를 정리합니다.

옵션:

- `--force`
- `--json`

### `acp`

IDE를 게이트웨이에 연결하는 ACP 브리지를 실행합니다.

전체 옵션과 예시는 [`acp`](/cli/acp)를 참조하세요.

### `status`

연결된 세션 상태와 최근 수신자를 표시합니다.

옵션:

- `--json`
- `--all` (전체 진단, 읽기 전용, 붙여넣기 가능)
- `--deep` (프로브 채널)
- `--usage` (모델 공급자 사용량/할당량 표시)
- `--timeout &lt;ms&gt;`
- `--verbose`
- `--debug` (`--verbose`의 별칭)

참고:

- 개요에는 가능한 경우 게이트웨이 + 노드 호스트 서비스 상태가 포함됩니다.

### 사용 추적

OpenClaw는 OAuth/API 자격 증명을 사용할 수 있는 경우 공급자 사용량/할당량을 표시할 수 있습니다.

표면:

- `/status` (사용 가능한 경우 짧은 공급자 사용 줄을 추가합니다)
- `openclaw status --usage` (전체 공급자 분석을 인쇄합니다)
- macOS 메뉴 표시줄(컨텍스트 아래의 사용 섹션)

참고:

- 데이터는 공급자 사용 끝점에서 직접 가져옵니다(추정 없음).
- 공급자: Anthropic, GitHub Copilot, OpenAI Codex OAuth, Gemini CLI/Antigravity(해당 공급자 플러그인이 활성화된 경우).
- 일치하는 자격 증명이 없으면 사용이 숨겨집니다.
- 자세한 내용은 [사용 추적](/concepts/usage-tracking)을 참조하세요.

### `health`

실행 중인 게이트웨이에서 상태를 가져옵니다.

옵션:

- `--json`
- `--timeout &lt;ms&gt;`
- `--verbose`

### `sessions`

저장된 대화 세션을 나열합니다.

옵션:

- `--json`
- `--verbose`
- `--store &lt;path&gt;`
- `--active &lt;minutes&gt;`

## 재설정 / 제거

### `reset`

로컬 구성/상태를 재설정합니다(CLI 설치 유지).

옵션:

- `--scope &lt;config|config+creds+sessions|full&gt;`
- `--yes`
- `--non-interactive`
- `--dry-run`

참고:

- `--non-interactive`에는 `--scope` 및 `--yes`가 필요합니다.

### `uninstall`

게이트웨이 서비스 + 로컬 데이터를 제거합니다(CLI는 유지됨).

옵션:

- `--service`
- `--state`
- `--workspace`
- `--app`
- `--all`
- `--yes`
- `--non-interactive`
- `--dry-run`

참고:

- `--non-interactive`에는 `--yes` 및 명시적 범위(또는 `--all`)가 필요합니다.

## 게이트웨이

### `gateway`

WebSocket 게이트웨이를 실행합니다.

옵션:

- `--port &lt;port&gt;`
- `--bind &lt;loopback|tailnet|lan|auto|custom&gt;`
- `--token &lt;token&gt;`
- `--auth &lt;token|password&gt;`
- `--password &lt;password&gt;`
- `--tailscale &lt;off|serve|funnel&gt;`
- `--tailscale-reset-on-exit`
- `--allow-unconfigured`
- `--dev`
- `--reset` (개발 구성 + 자격 증명 + 세션 + 작업 공간 재설정)
- `--force` (포트의 기존 리스너 종료)
- `--verbose`
- `--claude-cli-logs`
- `--ws-log &lt;auto|full|compact&gt;`
- `--compact` (`--ws-log compact`의 별칭)
- `--raw-stream`
- `--raw-stream-path &lt;path&gt;`

### `gateway service`

게이트웨이 서비스(launchd/systemd/schtasks)를 관리합니다.

하위 명령:

- `gateway status` (기본적으로 게이트웨이 RPC를 조사합니다)
- `gateway install` (서비스 설치)
- `gateway uninstall`
- `gateway start`
- `gateway stop`
- `gateway restart`

참고:

- `gateway status`는 기본적으로 서비스의 확인된 포트/구성을 사용하여 게이트웨이 RPC를 검색합니다(`--url/--token/--password`로 재정의).
- `gateway status`는 스크립팅을 위해 `--no-probe`, `--deep` 및 `--json`를 지원합니다.
- `gateway status`는 레거시 또는 추가 게이트웨이 서비스를 감지할 수 있는 경우에도 표시합니다(`--deep`는 시스템 수준 검색을 추가합니다). 프로필 이름이 지정된 OpenClaw 서비스는 최고 수준으로 처리되며 "추가"로 표시되지 않습니다.
- `gateway status` CLI가 사용하는 구성 경로와 서비스가 사용할 가능성이 있는 구성(서비스 환경) 및 확인된 프로브 대상 URL을 인쇄합니다.
- `gateway install|uninstall|start|stop|restart` 스크립팅을 위해 `--json`를 지원합니다(기본 출력은 인간 친화적으로 유지됩니다).
- `gateway install` 기본값은 노드 런타임입니다. bun은 **권장하지 않습니다**(WhatsApp/Telegram 버그).
- `gateway install` 옵션: `--port`, `--runtime`, `--token`, `--force`, `--json`.

### `logs`

RPC를 통한 Tail Gateway 파일 로그.

참고:

- TTY 세션은 색상화되고 구조화된 보기를 렌더링합니다. TTY가 아닌 경우 일반 텍스트로 대체됩니다.
- `--json`는 줄로 구분된 JSON(줄당 하나의 로그 이벤트)을 내보냅니다.

예:

```bash
openclaw logs --follow
openclaw logs --limit 200
openclaw logs --plain
openclaw logs --json
openclaw logs --no-color
```

### `gateway &lt;subcommand&gt;`

게이트웨이 CLI 도우미(RPC 하위 명령의 경우 `--url`, `--token`, `--password`, `--timeout`, `--expect-final` 사용)
`--url`를 전달하면 CLI가 구성 또는 환경 자격 증명을 자동 적용하지 않습니다.
`--token` 또는 `--password`를 명시적으로 포함합니다. 명시적 자격 증명이 누락되면 오류가 발생합니다.

하위 명령:

- `gateway call &lt;method&gt; [--params &lt;json&gt;]`
- `gateway health`
- `gateway status`
- `gateway probe`
- `gateway discover`
- `gateway install|uninstall|start|stop|restart`
- `gateway run`

일반 RPC:

- `config.apply` (검증 + 구성 쓰기 + 다시 시작 + 깨우기)
- `config.patch` (부분 업데이트 병합 + 다시 시작 + 깨우기)
- `update.run` (업데이트 실행 + 다시 시작 + 깨우기)

팁: `config.set`/`config.apply`/`config.patch`를 직접 호출할 때 `baseHash`를 다음에서 전달하세요.
`config.get` 구성이 이미 존재하는 경우.

## 모델

대체 동작 및 검색 전략은 [/concepts/models](/concepts/models)를 참조하세요.

선호하는 인류학적 인증(설정 토큰):

```bash
claude setup-token
openclaw models auth setup-token --provider anthropic
openclaw models status
```

### `models` (루트)

`openclaw models`는 `models status`의 별칭입니다.

루트 옵션:

- `--status-json` (`models status --json`의 별칭)
- `--status-plain` (`models status --plain`의 별칭)

### `models list`

옵션:

- `--all`
- `--local`
- `--provider &lt;name&gt;`
- `--json`
- `--plain`

### `models status`

옵션:

- `--json`
- `--plain`
- `--check` (출구 1=만료됨/없음, 2=만료됨)
- `--probe` (구성된 인증 프로필의 실시간 프로브)
- `--probe-provider &lt;name&gt;`
- `--probe-profile &lt;id&gt;` (반복 또는 쉼표로 구분)
- `--probe-timeout &lt;ms&gt;`
- `--probe-concurrency &lt;n&gt;`
- `--probe-max-tokens &lt;n&gt;`

인증 저장소의 프로필에 대한 인증 개요 및 OAuth 만료 상태가 항상 포함됩니다.
`--probe` 라이브 요청을 실행합니다(토큰을 소비하고 속도 제한을 트리거할 수 있음).

### `models set &lt;model&gt;`

`agents.defaults.model.primary`를 설정합니다.

### `models set-image &lt;model&gt;`

`agents.defaults.imageModel.primary`를 설정합니다.

### `models aliases list|add|remove`

옵션:

- `list`: `--json`, `--plain`
- `add &lt;alias&gt; &lt;model&gt;`
- `remove &lt;alias&gt;`

### `models fallbacks list|add|remove|clear`

옵션:

- `list`: `--json`, `--plain`
- `add &lt;model&gt;`
- `remove &lt;model&gt;`
- `clear`

### `models image-fallbacks list|add|remove|clear`

옵션:

- `list`: `--json`, `--plain`
- `add &lt;model&gt;`
- `remove &lt;model&gt;`
- `clear`

### `models scan`

옵션:

- `--min-params &lt;b&gt;`
- `--max-age-days &lt;days&gt;`
- `--provider &lt;name&gt;`
- `--max-candidates &lt;n&gt;`
- `--timeout &lt;ms&gt;`
- `--concurrency &lt;n&gt;`
- `--no-probe`
- `--yes`
- `--no-input`
- `--set-default`
- `--set-image`
- `--json`

### `models auth add|setup-token|paste-token`

옵션:

- `add`: 대화형 인증 도우미
- `setup-token`: `--provider &lt;name&gt;` (기본값 `anthropic`), `--yes`
- `paste-token`: `--provider &lt;name&gt;`, `--profile-id &lt;id&gt;`, `--expires-in &lt;duration&gt;`

### `models auth order get|set|clear`

옵션:

- `get`: `--provider &lt;name&gt;`, `--agent &lt;id&gt;`, `--json`
- `set`: `--provider &lt;name&gt;`, `--agent &lt;id&gt;`, `&lt;profileIds...&gt;`
- `clear`: `--provider &lt;name&gt;`, `--agent &lt;id&gt;`

## 시스템

### `system event`

시스템 이벤트를 대기열에 추가하고 선택적으로 하트비트(게이트웨이 RPC)를 트리거합니다.

필수:

- `--text &lt;text&gt;`

옵션:

- `--mode &lt;now|next-heartbeat&gt;`
- `--json`
- `--url`, `--token`, `--timeout`, `--expect-final`

### `system heartbeat last|enable|disable`

하트비트 제어(게이트웨이 RPC).

옵션:

- `--json`
- `--url`, `--token`, `--timeout`, `--expect-final`

### `system presence`

시스템 존재 항목을 나열합니다(게이트웨이 RPC).

옵션:

- `--json`
- `--url`, `--token`, `--timeout`, `--expect-final`

## 크론

예약된 작업을 관리합니다(게이트웨이 RPC). [/automation/cron-jobs](/automation/cron-jobs)를 참조하세요.

하위 명령:

- `cron status [--json]`
- `cron list [--all] [--json]` (기본적으로 테이블 출력; 원시에는 `--json` 사용)
- `cron add` (별칭: `create`; `--name`와 정확히 `--at` | `--every` | `--cron` 중 하나와 정확히 하나의 페이로드가 필요합니다. `--system-event` `--message`)
- `cron edit &lt;id&gt;` (패치 필드)
- `cron rm &lt;id&gt;` (별칭: `remove`, `delete`)
- `cron enable &lt;id&gt;`
- `cron disable &lt;id&gt;`
- `cron runs --id &lt;id&gt; [--limit &lt;n&gt;]`
- `cron run &lt;id&gt; [--force]`

모든 `cron` 명령은 `--url`, `--token`, `--timeout`, `--expect-final`를 허용합니다.

## 노드 호스트

`node` **헤드리스 노드 호스트**를 실행하거나 이를 백그라운드 서비스로 관리합니다. 참조
[`openclaw node`](/cli/node).

하위 명령:

- `node run --host &lt;gateway-host&gt; --port 18789`
- `node status`
- `node install [--host &lt;gateway-host&gt;] [--port &lt;port&gt;] [--tls] [--tls-fingerprint &lt;sha256&gt;] [--node-id &lt;id&gt;] [--display-name &lt;name&gt;] [--runtime &lt;node|bun&gt;] [--force]`
- `node uninstall`
- `node stop`
- `node restart`

## 노드

`nodes`는 게이트웨이와 통신하고 쌍을 이루는 노드를 대상으로 합니다. [/nodes/](/nodes/)를 참조하세요.

일반적인 옵션:

- `--url`, `--token`, `--timeout`, `--json`

하위 명령:

- `nodes status [--connected] [--last-connected &lt;duration&gt;]`
- `nodes describe --node &lt;id|name|ip&gt;`
- `nodes list [--connected] [--last-connected &lt;duration&gt;]`
- `nodes pending`
- `nodes approve &lt;requestId&gt;`
- `nodes reject &lt;requestId&gt;`
- `nodes rename --node &lt;id|name|ip&gt; --name &lt;displayName&gt;`
- `nodes invoke --node &lt;id|name|ip&gt; --command &lt;command&gt; [--params &lt;json&gt;] [--invoke-timeout &lt;ms&gt;] [--idempotency-key &lt;key&gt;]`
- `nodes run --node &lt;id|name|ip&gt; [--cwd &lt;path&gt;] [--env KEY=VAL] [--command-timeout &lt;ms&gt;] [--needs-screen-recording] [--invoke-timeout &lt;ms&gt;] &lt;command...&gt;` (mac 노드 또는 헤드리스 노드 호스트)
- `nodes notify --node &lt;id|name|ip&gt; [--title &lt;text&gt;] [--body &lt;text&gt;] [--sound &lt;name&gt;] [--priority &lt;passive|active|timeSensitive&gt;] [--delivery &lt;system|overlay|auto&gt;] [--invoke-timeout &lt;ms&gt;]` (맥 전용)

카메라:

- `nodes camera list --node &lt;id|name|ip&gt;`
- `nodes camera snap --node &lt;id|name|ip&gt; [--facing front|back|both] [--device-id &lt;id&gt;] [--max-width &lt;px&gt;] [--quality &lt;0-1&gt;] [--delay-ms &lt;ms&gt;] [--invoke-timeout &lt;ms&gt;]`
- `nodes camera clip --node &lt;id|name|ip&gt; [--facing front|back] [--device-id &lt;id&gt;] [--duration &lt;ms|10s|1m&gt;] [--no-audio] [--invoke-timeout &lt;ms&gt;]`

캔버스 + 화면:

- `nodes canvas snapshot --node &lt;id|name|ip&gt; [--format png|jpg|jpeg] [--max-width &lt;px&gt;] [--quality &lt;0-1&gt;] [--invoke-timeout &lt;ms&gt;]`
- `nodes canvas present --node &lt;id|name|ip&gt; [--target &lt;urlOrPath&gt;] [--x &lt;px&gt;] [--y &lt;px&gt;] [--width &lt;px&gt;] [--height &lt;px&gt;] [--invoke-timeout &lt;ms&gt;]`
- `nodes canvas hide --node &lt;id|name|ip&gt; [--invoke-timeout &lt;ms&gt;]`
- `nodes canvas navigate &lt;url&gt; --node &lt;id|name|ip&gt; [--invoke-timeout &lt;ms&gt;]`
- `nodes canvas eval [&lt;js&gt;] --node &lt;id|name|ip&gt; [--js &lt;code&gt;] [--invoke-timeout &lt;ms&gt;]`
- `nodes canvas a2ui push --node &lt;id|name|ip&gt; (--jsonl &lt;path&gt; | --text &lt;text&gt;) [--invoke-timeout &lt;ms&gt;]`
- `nodes canvas a2ui reset --node &lt;id|name|ip&gt; [--invoke-timeout &lt;ms&gt;]`
- `nodes screen record --node &lt;id|name|ip&gt; [--screen &lt;index&gt;] [--duration &lt;ms|10s&gt;] [--fps &lt;n&gt;] [--no-audio] [--out &lt;path&gt;] [--invoke-timeout &lt;ms&gt;]`

위치:

- `nodes location get --node &lt;id|name|ip&gt; [--max-age &lt;ms&gt;] [--accuracy &lt;coarse|balanced|precise&gt;] [--location-timeout &lt;ms&gt;] [--invoke-timeout &lt;ms&gt;]`

## 브라우저

브라우저 제어 CLI(전용 Chrome/Brave/Edge/Chromium). [`openclaw browser`](/cli/browser) 및 [브라우저 도구](/tools/browser)를 참조하세요.

일반적인 옵션:

- `--url`, `--token`, `--timeout`, `--json`
- `--browser-profile &lt;name&gt;`

관리:

- `browser status`
- `browser start`
- `browser stop`
- `browser reset-profile`
- `browser tabs`
- `browser open &lt;url&gt;`
- `browser focus &lt;targetId&gt;`
- `browser close [targetId]`
- `browser profiles`
- `browser create-profile --name &lt;name&gt; [--color &lt;hex&gt;] [--cdp-url &lt;url&gt;]`
- `browser delete-profile --name &lt;name&gt;`

검사:

- `browser screenshot [targetId] [--full-page] [--ref &lt;ref&gt;] [--element &lt;selector&gt;] [--type png|jpeg]`
- `browser snapshot [--format aria|ai] [--target-id &lt;id&gt;] [--limit &lt;n&gt;] [--interactive] [--compact] [--depth &lt;n&gt;] [--selector &lt;sel&gt;] [--out &lt;path&gt;]`

작업:

- `browser navigate &lt;url&gt; [--target-id &lt;id&gt;]`
- `browser resize &lt;width&gt; &lt;height&gt; [--target-id &lt;id&gt;]`
- `browser click &lt;ref&gt; [--double] [--button &lt;left|right|middle&gt;] [--modifiers &lt;csv&gt;] [--target-id &lt;id&gt;]`
- `browser type &lt;ref&gt; &lt;text&gt; [--submit] [--slowly] [--target-id &lt;id&gt;]`
- `browser press &lt;key&gt; [--target-id &lt;id&gt;]`
- `browser hover &lt;ref&gt; [--target-id &lt;id&gt;]`
- `browser drag &lt;startRef&gt; &lt;endRef&gt; [--target-id &lt;id&gt;]`
- `browser select &lt;ref&gt; &lt;values...&gt; [--target-id &lt;id&gt;]`
- `browser upload &lt;paths...&gt; [--ref &lt;ref&gt;] [--input-ref &lt;ref&gt;] [--element &lt;selector&gt;] [--target-id &lt;id&gt;] [--timeout-ms &lt;ms&gt;]`
- `browser fill [--fields &lt;json&gt;] [--fields-file &lt;path&gt;] [--target-id &lt;id&gt;]`
- `browser dialog --accept|--dismiss [--prompt &lt;text&gt;] [--target-id &lt;id&gt;] [--timeout-ms &lt;ms&gt;]`
- `browser wait [--time &lt;ms&gt;] [--text &lt;value&gt;] [--text-gone &lt;value&gt;] [--target-id &lt;id&gt;]`
- `browser evaluate --fn &lt;code&gt; [--ref &lt;ref&gt;] [--target-id &lt;id&gt;]`
- `browser console [--level &lt;error|warn|info&gt;] [--target-id &lt;id&gt;]`
- `browser pdf [--target-id &lt;id&gt;]`

## 문서 검색

### `docs [query...]`

라이브 문서 색인을 검색하세요.

## TUI

### `tui`

게이트웨이에 연결된 터미널 UI를 엽니다.

옵션:

- `--url &lt;url&gt;`
- `--token &lt;token&gt;`
- `--password &lt;password&gt;`
- `--session &lt;key&gt;`
- `--deliver`
- `--thinking &lt;level&gt;`
- `--message &lt;text&gt;`
- `--timeout-ms &lt;ms&gt;` (기본값은 `agents.defaults.timeoutSeconds`)
- `--history-limit &lt;n&gt;`
