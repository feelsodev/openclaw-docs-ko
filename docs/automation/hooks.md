---
title: "Hooks"
---
# 후크

후크는 에이전트 명령 및 이벤트에 대한 응답으로 작업을 자동화하기 위한 확장 가능한 이벤트 기반 시스템을 제공합니다. 후크는 디렉터리에서 자동으로 검색되며 OpenClaw에서 기술이 작동하는 방식과 유사하게 CLI 명령을 통해 관리할 수 있습니다.

## 방향 잡기

후크는 어떤 일이 발생할 때 실행되는 작은 스크립트입니다. 두 가지 종류가 있습니다:

- **후크**(이 페이지): `/new`, `/reset`, `/stop` 또는 수명 주기 이벤트와 같은 에이전트 이벤트가 실행될 때 게이트웨이 내부에서 실행됩니다.
- **웹훅**: 다른 시스템이 OpenClaw에서 작업을 트리거할 수 있게 해주는 외부 HTTP 웹훅입니다. Gmail 도우미 명령에 대해서는 [웹훅 후크](/automation/webhook)를 참조하거나 `openclaw webhooks`를 사용하세요.

후크는 플러그인 내에 번들로 묶일 수도 있습니다. [플러그인](/tools/plugin#plugin-hooks)을 참조하세요.

일반적인 용도:

- 세션을 재설정할 때 메모리 스냅샷을 저장하세요.
- 문제 해결 또는 규정 준수를 위해 명령에 대한 감사 추적을 유지합니다.
- 세션이 시작되거나 종료될 때 후속 조치 자동화 실행
- 이벤트가 발생하면 에이전트 작업 영역에 파일을 쓰거나 외부 API를 호출합니다.

작은 TypeScript 함수를 작성할 수 있다면 후크를 작성할 수 있습니다. 후크는 자동으로 검색되며 CLI를 통해 활성화하거나 비활성화합니다.

## 개요

후크 시스템을 사용하면 다음을 수행할 수 있습니다.

- `/new`가 실행될 때 세션 컨텍스트를 메모리에 저장합니다.
- 감사를 위해 모든 명령을 기록합니다.
- 에이전트 수명주기 이벤트에 대한 사용자 정의 자동화를 트리거합니다.
- 핵심 코드 수정 없이 OpenClaw의 동작 확장

## 시작하기

### 번들 후크

OpenClaw에는 자동으로 검색되는 세 가지 번들 후크가 함께 제공됩니다.

- **💾 session-memory**: `/new`를 발행할 때 에이전트 작업공간(기본값 `~/.openclaw/workspace/memory/`)에 세션 컨텍스트를 저장합니다.
- **📝 command-logger**: 모든 명령 이벤트를 `~/.openclaw/logs/commands.log`에 기록합니다.
- **🚀 boot-md**: 게이트웨이가 시작될 때 `BOOT.md`를 실행합니다(내부 후크 활성화 필요).

사용 가능한 후크를 나열합니다.

```bash
openclaw hooks list
```

후크를 활성화합니다.

```bash
openclaw hooks enable session-memory
```

후크 상태를 확인하세요.

```bash
openclaw hooks check
```

자세한 정보를 얻으세요:

```bash
openclaw hooks info session-memory
```

### 온보딩

온보딩(`openclaw onboard`) 중에 권장 후크를 활성화하라는 메시지가 표시됩니다. 마법사는 적합한 후크를 자동으로 검색하고 선택할 수 있도록 표시합니다.

## 후크 발견

후크는 세 개의 디렉터리(우선순위에 따라)에서 자동으로 검색됩니다.

1. **작업 공간 후크**: `&lt;workspace&gt;/hooks/` (에이전트별, 가장 높은 우선 순위)
2. **관리형 후크**: `~/.openclaw/hooks/` (사용자 설치, 작업공간 전체에서 공유)
3. **번들 후크**: `&lt;openclaw&gt;/dist/hooks/bundled/` (OpenClaw와 함께 제공)

관리되는 후크 디렉토리는 **단일 후크** 또는 **후크 팩**(패키지 디렉토리)일 수 있습니다.

각 후크는 다음을 포함하는 디렉터리입니다.

```
my-hook/
├── HOOK.md          # Metadata + documentation
└── handler.ts       # Handler implementation
```

## 후크 팩(npm/archives)

후크 팩은 `openclaw.hooks`를 통해 하나 이상의 후크를 내보내는 표준 npm 패키지입니다.
`package.json`. 다음을 사용하여 설치하십시오.

```bash
openclaw hooks install <path-or-spec>
```

예시 `package.json`:

```json
{
  "name": "@acme/my-hooks",
  "version": "0.1.0",
  "openclaw": {
    "hooks": ["./hooks/my-hook", "./hooks/other-hook"]
  }
}
```

각 항목은 `HOOK.md` 및 `handler.ts`(또는 `index.ts`)를 포함하는 후크 디렉터리를 가리킵니다.
후크 팩은 종속성을 전달할 수 있습니다. `~/.openclaw/hooks/&lt;id&gt;` 아래에 설치됩니다.

## 후크 구조

### HOOK.md 형식

`HOOK.md` 파일에는 YAML 머리말과 Markdown 문서의 메타데이터가 포함되어 있습니다.

```markdown
---
name: my-hook
description: "Short description of what this hook does"
homepage: https://docs.openclaw.ai/hooks#my-hook
metadata:
  { "openclaw": { "emoji": "🔗", "events": ["command:new"], "requires": { "bins": ["node"] } } }
---

# My Hook

Detailed documentation goes here...

## What It Does

- Listens for `/new` commands
- Performs some action
- Logs the result

## Requirements

- Node.js must be installed

## Configuration

No configuration needed.
```

### 메타데이터 필드

`metadata.openclaw` 개체는 다음을 지원합니다.

- **`emoji`**: CLI용 이모티콘 표시(예: `"💾"`)
- **`events`**: 수신할 이벤트 배열(예: `["command:new", "command:reset"]`)
- **`export`**: 사용할 명명된 내보내기(기본값은 `"default"`)
- **`homepage`**: 문서 URL
- **`requires`**: 선택 요구사항
  - **`bins`**: PATH에 필요한 바이너리(예: `["git", "node"]`)
  - **`anyBins`**: 이 바이너리 중 하나 이상이 있어야 합니다.
  - **`env`**: 필수 환경변수
  - **`config`**: 필수 구성 경로(예: `["workspace.dir"]`)
  - **`os`**: 필수 플랫폼(예: `["darwin", "linux"]`)
- **`always`**: 적격성 확인 우회(부울)
- **`install`**: 설치 방법 (번들 후크의 경우: `[{"id":"bundled","kind":"bundled"}]`)

### 핸들러 구현

`handler.ts` 파일은 `HookHandler` 함수를 내보냅니다.

```typescript
import type { HookHandler } from "../../src/hooks/hooks.js";

const myHandler: HookHandler = async (event) => {
  // Only trigger on 'new' command
  if (event.type !== "command" || event.action !== "new") {
    return;
  }

  console.log(`[my-hook] New command triggered`);
  console.log(`  Session: ${event.sessionKey}`);
  console.log(`  Timestamp: ${event.timestamp.toISOString()}`);

  // Your custom logic here

  // Optionally send message to user
  event.messages.push("✨ My hook executed!");
};

export default myHandler;
```

#### 이벤트 컨텍스트

각 이벤트에는 다음이 포함됩니다.

```typescript
{
  type: 'command' | 'session' | 'agent' | 'gateway',
  action: string,              // e.g., 'new', 'reset', 'stop'
  sessionKey: string,          // Session identifier
  timestamp: Date,             // When the event occurred
  messages: string[],          // Push messages here to send to user
  context: {
    sessionEntry?: SessionEntry,
    sessionId?: string,
    sessionFile?: string,
    commandSource?: string,    // e.g., 'whatsapp', 'telegram'
    senderId?: string,
    workspaceDir?: string,
    bootstrapFiles?: WorkspaceBootstrapFile[],
    cfg?: OpenClawConfig
  }
}
```

## 이벤트 유형

### 명령 이벤트

에이전트 명령이 실행되면 트리거됩니다.

- **`command`**: 모든 명령 이벤트(일반 리스너)
- **`command:new`**: `/new` 명령이 실행될 때
- **`command:reset`** : `/reset` 명령이 내려졌을 때
- **`command:stop`** : `/stop` 명령이 내려졌을 때

### 에이전트 이벤트

- **`agent:bootstrap`**: 작업 공간 부트스트랩 파일이 삽입되기 전(후크가 `context.bootstrapFiles`를 변경할 수 있음)

### 게이트웨이 이벤트

게이트웨이가 시작될 때 트리거됩니다.

- **`gateway:startup`**: 채널이 시작되고 Hook이 로드된 후

### 도구 결과 후크(플러그인 API)

이러한 후크는 이벤트 스트림 리스너가 아닙니다. OpenClaw가 도구 결과를 유지하기 전에 플러그인이 도구 결과를 동기식으로 조정할 수 있습니다.

- **`tool_result_persist`**: 세션 기록에 기록되기 전에 도구 결과를 변환합니다. 동기식이어야 합니다. 업데이트된 도구 결과 페이로드를 반환하거나 `undefined`를 그대로 유지합니다. [에이전트 루프](/concepts/agent-loop)를 참조하세요.

### 향후 이벤트

계획된 이벤트 유형:

- **`session:start`**: 새로운 세션이 시작될 때
- **`session:end`** : 세션 종료 시
- **`agent:error`** : 에이전트에 오류가 발생한 경우
- **`message:sent`** : 메시지를 보낼 때
- **`message:received`** : 메시지 수신 시

## 사용자 정의 후크 만들기

### 1. 위치를 선택하세요

- **작업 공간 후크** (`&lt;workspace&gt;/hooks/`): 에이전트별, 가장 높은 우선 순위
- **관리형 후크** (`~/.openclaw/hooks/`): 작업 공간 전체에서 공유됩니다.

### 2. 디렉터리 구조 생성

```bash
mkdir -p ~/.openclaw/hooks/my-hook
cd ~/.openclaw/hooks/my-hook
```

### 3. HOOK.md 생성

```markdown
---
name: my-hook
description: "Does something useful"
metadata: { "openclaw": { "emoji": "🎯", "events": ["command:new"] } }
---

# My Custom Hook

This hook does something useful when you issue `/new`.
```

### 4. handler.ts 생성

```typescript
import type { HookHandler } from "../../src/hooks/hooks.js";

const handler: HookHandler = async (event) => {
  if (event.type !== "command" || event.action !== "new") {
    return;
  }

  console.log("[my-hook] Running!");
  // Your logic here
};

export default handler;
```

### 5. 활성화 및 테스트

```bash
# Verify hook is discovered
openclaw hooks list

# Enable it
openclaw hooks enable my-hook

# Restart your gateway process (menu bar app restart on macOS, or restart your dev process)

# Trigger the event
# Send /new via your messaging channel
```

## 구성

### 새로운 구성 형식(권장)

```json
{
  "hooks": {
    "internal": {
      "enabled": true,
      "entries": {
        "session-memory": { "enabled": true },
        "command-logger": { "enabled": false }
      }
    }
  }
}
```

### 후크별 구성

후크는 사용자 정의 구성을 가질 수 있습니다.

```json
{
  "hooks": {
    "internal": {
      "enabled": true,
      "entries": {
        "my-hook": {
          "enabled": true,
          "env": {
            "MY_CUSTOM_VAR": "value"
          }
        }
      }
    }
  }
}
```

### 추가 디렉터리

추가 디렉터리에서 후크를 로드합니다.

```json
{
  "hooks": {
    "internal": {
      "enabled": true,
      "load": {
        "extraDirs": ["/path/to/more/hooks"]
      }
    }
  }
}
```

### 레거시 구성 형식(여전히 지원됨)

이전 구성 형식은 이전 버전과의 호환성을 위해 계속 작동합니다.

```json
{
  "hooks": {
    "internal": {
      "enabled": true,
      "handlers": [
        {
          "event": "command:new",
          "module": "./hooks/handlers/my-handler.ts",
          "export": "default"
        }
      ]
    }
  }
}
```

**마이그레이션**: 새로운 후크에 새로운 검색 기반 시스템을 사용합니다. 레거시 핸들러는 디렉터리 기반 후크 후에 로드됩니다.

## CLI 명령

### 목록 후크

```bash
# List all hooks
openclaw hooks list

# Show only eligible hooks
openclaw hooks list --eligible

# Verbose output (show missing requirements)
openclaw hooks list --verbose

# JSON output
openclaw hooks list --json
```

### 후크 정보

```bash
# Show detailed info about a hook
openclaw hooks info session-memory

# JSON output
openclaw hooks info session-memory --json
```

### 자격 확인

```bash
# Show eligibility summary
openclaw hooks check

# JSON output
openclaw hooks check --json
```

### 활성화/비활성화

```bash
# Enable a hook
openclaw hooks enable session-memory

# Disable a hook
openclaw hooks disable command-logger
```

## 번들 후크 참조

### 세션 메모리

`/new`를 실행할 때 세션 컨텍스트를 메모리에 저장합니다.

**이벤트**: `command:new`

**요구사항**: `workspace.dir`을 구성해야 합니다.

**출력**: `&lt;workspace&gt;/memory/YYYY-MM-DD-slug.md` (기본값은 `~/.openclaw/workspace`)

**기능**:

1. 사전 재설정 세션 항목을 사용하여 올바른 기록을 찾습니다.
2. 마지막 15줄의 대화 추출
3. LLM을 사용하여 설명적인 파일 이름 슬러그를 생성합니다.
4. 세션 메타데이터를 날짜가 지정된 메모리 파일에 저장합니다.

**출력 예**:

```markdown
# Session: 2026-01-16 14:30:00 UTC

- **Session Key**: agent:main:main
- **Session ID**: abc123def456
- **Source**: telegram
```

**파일 이름 예**:

- `2026-01-16-vendor-pitch.md`
- `2026-01-16-api-design.md`
- `2026-01-16-1430.md` (슬러그 생성 실패 시 대체 타임스탬프)

**활성화**:

```bash
openclaw hooks enable session-memory
```

### 명령 로거

모든 명령 이벤트를 중앙 감사 파일에 기록합니다.

**이벤트**: `command`

**요구사항**: 없음

**출력**: `~/.openclaw/logs/commands.log`

**기능**:

1. 이벤트 세부 정보(명령 작업, 타임스탬프, 세션 키, 보낸 사람 ID, 소스)를 캡처합니다.
2. JSONL 형식으로 로그 파일에 추가합니다.
3. 백그라운드에서 자동으로 실행됩니다.

**예시 로그 항목**:

```jsonl
{"timestamp":"2026-01-16T14:30:00.000Z","action":"new","sessionKey":"agent:main:main","senderId":"+1234567890","source":"telegram"}
{"timestamp":"2026-01-16T15:45:22.000Z","action":"stop","sessionKey":"agent:main:main","senderId":"user@example.com","source":"whatsapp"}
```

**로그 보기**:

```bash
# View recent commands
tail -n 20 ~/.openclaw/logs/commands.log

# Pretty-print with jq
cat ~/.openclaw/logs/commands.log | jq .

# Filter by action
grep '"action":"new"' ~/.openclaw/logs/commands.log | jq .
```

**활성화**:

```bash
openclaw hooks enable command-logger
```

### 부팅-MD

게이트웨이가 시작될 때(채널 시작 후) `BOOT.md`를 실행합니다.
이를 실행하려면 내부 후크를 활성화해야 합니다.

**이벤트**: `gateway:startup`

**요구사항**: `workspace.dir`을 구성해야 합니다.

**기능**:

1. 작업공간에서 `BOOT.md`를 읽습니다.
2. 에이전트 러너를 통해 명령을 실행합니다.
3. 메시지 도구를 통해 요청된 아웃바운드 메시지를 보냅니다.

**활성화**:

```bash
openclaw hooks enable boot-md
```

## 모범 사례

### 핸들러를 빠르게 유지

명령 처리 중에 후크가 실행됩니다. 가볍게 유지하세요.

```typescript
// ✓ Good - async work, returns immediately
const handler: HookHandler = async (event) => {
  void processInBackground(event); // Fire and forget
};

// ✗ Bad - blocks command processing
const handler: HookHandler = async (event) => {
  await slowDatabaseQuery(event);
  await evenSlowerAPICall(event);
};
```

### 오류를 적절하게 처리

항상 위험한 작업을 래핑합니다.

```typescript
const handler: HookHandler = async (event) => {
  try {
    await riskyOperation(event);
  } catch (err) {
    console.error("[my-handler] Failed:", err instanceof Error ? err.message : String(err));
    // Don't throw - let other handlers run
  }
};
```

### 이벤트를 조기에 필터링

이벤트와 관련이 없는 경우 일찍 돌아오세요.

```typescript
const handler: HookHandler = async (event) => {
  // Only handle 'new' commands
  if (event.type !== "command" || event.action !== "new") {
    return;
  }

  // Your logic here
};
```

### 특정 이벤트 키 사용

가능한 경우 메타데이터에 정확한 이벤트를 지정하세요.

```yaml
metadata: { "openclaw": { "events": ["command:new"] } } # Specific
```

대신:

```yaml
metadata: { "openclaw": { "events": ["command"] } } # General - more overhead
```

## 디버깅

### 후크 로깅 활성화

게이트웨이는 시작 시 후크 로딩을 기록합니다.

```
Registered hook: session-memory -> command:new
Registered hook: command-logger -> command
Registered hook: boot-md -> gateway:startup
```

### 검색 확인

발견된 모든 후크를 나열합니다.

```bash
openclaw hooks list --verbose
```

### 등록 확인

핸들러에서 호출될 때 기록하십시오.

```typescript
const handler: HookHandler = async (event) => {
  console.log("[my-handler] Triggered:", event.type, event.action);
  // Your logic
};
```

### 자격 확인

후크가 적합하지 않은 이유를 확인하세요.

```bash
openclaw hooks info my-hook
```

출력에서 누락된 요구 사항을 찾습니다.

## 테스트

### 게이트웨이 로그

후크 실행을 확인하려면 게이트웨이 로그를 모니터링하세요.

```bash
# macOS
./scripts/clawlog.sh -f

# Other platforms
tail -f ~/.openclaw/gateway.log
```

### Hook을 직접 테스트하기

핸들러를 별도로 테스트하세요.

```typescript
import { test } from "vitest";
import { createHookEvent } from "./src/hooks/hooks.js";
import myHandler from "./hooks/my-hook/handler.js";

test("my handler works", async () => {
  const event = createHookEvent("command", "new", "test-session", {
    foo: "bar",
  });

  await myHandler(event);

  // Assert side effects
});
```

## 아키텍처

### 핵심 구성 요소

- **`src/hooks/types.ts`**: 유형 정의
- **`src/hooks/workspace.ts`**: 디렉토리 스캐닝 및 로딩
- **`src/hooks/frontmatter.ts`**: HOOK.md 메타데이터 구문 분석
- **`src/hooks/config.ts`**: 자격 확인
- **`src/hooks/hooks-status.ts`**: 상태 보고
- **`src/hooks/loader.ts`**: 동적 모듈 로더
- **`src/cli/hooks-cli.ts`**: CLI 명령
- **`src/gateway/server-startup.ts`**: 게이트웨이 시작 시 후크를 로드합니다.
- **`src/auto-reply/reply/commands-core.ts`**: 명령 이벤트를 트리거합니다.

### 검색 흐름

```
Gateway startup
    ↓
Scan directories (workspace → managed → bundled)
    ↓
Parse HOOK.md files
    ↓
Check eligibility (bins, env, config, os)
    ↓
Load handlers from eligible hooks
    ↓
Register handlers for events
```

### 이벤트 흐름

```
User sends /new
    ↓
Command validation
    ↓
Create hook event
    ↓
Trigger hook (all registered handlers)
    ↓
Command processing continues
    ↓
Session reset
```

## 문제 해결

### 후크가 발견되지 않았습니다.

1. 디렉토리 구조를 확인하십시오.

   ```bash
   ls -la ~/.openclaw/hooks/my-hook/
   # Should show: HOOK.md, handler.ts
   ```

2. HOOK.md 형식을 확인합니다.

   ```bash
   cat ~/.openclaw/hooks/my-hook/HOOK.md
   # Should have YAML frontmatter with name and metadata
   ```

3. 발견된 모든 후크를 나열합니다.

   ```bash
   openclaw hooks list
   ```

### 후크가 적합하지 않음

요구사항을 확인하세요.

```bash
openclaw hooks info my-hook
```

누락된 항목을 찾으세요.

- 바이너리(PATH 확인)
- 환경변수
- 구성 값
- OS 호환성

### 후크가 실행되지 않음

1. 후크가 활성화되었는지 확인합니다.

   ```bash
   openclaw hooks list
   # Should show ✓ next to enabled hooks
   ```

2. 후크가 다시 로드되도록 게이트웨이 프로세스를 다시 시작합니다.

3. 게이트웨이 로그에 오류가 있는지 확인하세요.

   ```bash
   ./scripts/clawlog.sh | grep hook
   ```

### 핸들러 오류

TypeScript/가져오기 오류를 확인하세요.

```bash
# Test import directly
node -e "import('./path/to/handler.ts').then(console.log)"
```

## 마이그레이션 가이드

### 레거시 구성에서 검색까지

**이전**:

```json
{
  "hooks": {
    "internal": {
      "enabled": true,
      "handlers": [
        {
          "event": "command:new",
          "module": "./hooks/handlers/my-handler.ts"
        }
      ]
    }
  }
}
```

**이후**:

1. 후크 디렉터리를 생성합니다:

   ```bash
   mkdir -p ~/.openclaw/hooks/my-hook
   mv ./hooks/handlers/my-handler.ts ~/.openclaw/hooks/my-hook/handler.ts
   ```

2. HOOK.md를 생성합니다:

   ```markdown
   ---
   name: my-hook
   description: "My custom hook"
   metadata: { "openclaw": { "emoji": "🎯", "events": ["command:new"] } }
   ---

   # My Hook

   Does something useful.
   ```

3. 구성 업데이트:

   ```json
   {
     "hooks": {
       "internal": {
         "enabled": true,
         "entries": {
           "my-hook": { "enabled": true }
         }
       }
     }
   }
   ```

4. 게이트웨이 프로세스를 확인하고 다시 시작합니다.

   ```bash
   openclaw hooks list
   # Should show: 🎯 my-hook ✓
   ```

**이전의 이점**:

- 자동 검색
- CLI 관리
- 자격심사
- 더 나은 문서화
- 일관된 구조

## 참고 항목

- [CLI 참조: 후크](/cli/hooks)
- [번들 후크 README](https://github.com/openclaw/openclaw/tree/main/src/hooks/bundled)
- [웹훅 후크](/automation/webhook)
- [구성](/gateway/configuration#hooks)
