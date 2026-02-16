---
title: "WhatsApp"
---
# WhatsApp(웹 채널)

상태: WhatsApp Web(Baileys)을 통해 프로덕션 준비가 완료되었습니다. 게이트웨이는 연결된 세션을 소유합니다.


  - [**Pairing**](/channels/pairing) - 기본 DM 정책은 알 수 없는 발신자에 대한 페어링입니다.

  - [**Channel troubleshooting**](/channels/troubleshooting) - 교차 채널 진단 및 수리 플레이북.

  - [**Gateway configuration**](/gateway/configuration) - 전체 채널 구성 패턴 및 예시


## 빠른 설정


**Step 1: Configure WhatsApp access policy**


```json5
{
  channels: {
    whatsapp: {
      dmPolicy: "pairing",
      allowFrom: ["+15551234567"],
      groupPolicy: "allowlist",
      groupAllowFrom: ["+15551234567"],
    },
  },
}
```


**Step 2: Link WhatsApp (QR)**


```bash
openclaw channels login --channel whatsapp
```


  특정 계정의 경우:


```bash
openclaw channels login --channel whatsapp --account work
```


**Step 3: Start the gateway**


```bash
openclaw gateway
```


**Step 4: Approve first pairing request (if using pairing mode)**


```bash
openclaw pairing list whatsapp
openclaw pairing approve whatsapp <CODE>
```


  페어링 요청은 1시간 후에 만료됩니다. 보류 중인 요청은 채널당 3개로 제한됩니다.


::: info
OpenClaw는 가능하다면 별도의 번호로 WhatsApp을 실행할 것을 권장합니다. (채널 메타데이터 및 온보딩 흐름은 해당 설정에 최적화되어 있지만 개인 번호 설정도 지원됩니다.)
:::


## 배포 패턴


::: details Dedicated number (recommended)
  가장 깔끔한 작동 모드는 다음과 같습니다.

  - OpenClaw에 대한 별도의 WhatsApp ID
  - 더 명확한 DM 허용 목록 및 라우팅 경계
  - 셀프 채팅 혼란 가능성 감소

  최소 정책 패턴:


```json5
{
  channels: {
    whatsapp: {
      dmPolicy: "allowlist",
      allowFrom: ["+15551234567"],
    },
  },
}

```
:::


::: details Personal-number fallback
  온보딩은 개인 번호 모드를 지원하고 셀프 채팅에 적합한 기준을 작성합니다.

  - `dmPolicy: "allowlist"`
  - `allowFrom`에는 개인번호가 포함됩니다.
  - `selfChatMode: true`

  런타임 시 자체 채팅 보호 기능은 연결된 자체 번호와 `allowFrom`를 차단합니다.
:::


::: details WhatsApp Web-only channel scope
  메시징 플랫폼 채널은 현재 OpenClaw 채널 아키텍처에서 WhatsApp 웹 기반(`Baileys`)입니다.

  내장된 채팅 채널 레지스트리에는 별도의 Twilio WhatsApp 메시징 채널이 없습니다.
:::


## 런타임 모델

- 게이트웨이는 WhatsApp 소켓과 재연결 루프를 소유합니다.
- 아웃바운드 전송에는 대상 계정에 대한 활성 WhatsApp 수신기가 필요합니다.
- 상태 및 방송 채팅은 무시됩니다(`@status`, `@broadcast`).
- 직접 채팅은 DM 세션 규칙을 사용합니다(`session.dmScope`; 기본값 `main`는 DM을 상담원 기본 세션으로 축소합니다).
- 그룹 세션은 격리됩니다(`agent:&lt;agentId&gt;:whatsapp:group:&lt;jid&gt;`).

## 접근 제어 및 활성화


#### DM policy

  `channels.whatsapp.dmPolicy`는 직접 채팅 액세스를 제어합니다.

  - `pairing` (기본값)
  - `allowlist`
  - `open` (`"*"`를 포함하려면 `allowFrom` 필요)
  - `disabled`

  `allowFrom`는 E.164 스타일 숫자를 허용합니다(내부적으로 정규화됨).

  런타임 동작 세부정보:

  - 페어링은 채널 허용 저장소에 유지되며 구성된 `allowFrom`와 병합됩니다.
  - 허용 목록이 구성되지 않은 경우 기본적으로 연결된 본인 번호가 허용됩니다.
  - 아웃바운드 `fromMe` DM은 자동 페어링되지 않습니다.


---

#### Group policy + allowlists

  그룹 액세스에는 두 가지 계층이 있습니다.

1. **그룹 멤버십 허용 목록** (`channels.whatsapp.groups`)
  - `groups`를 생략하면 모든 그룹이 대상이 됩니다.
  - `groups`가 있는 경우 그룹 허용 목록 역할을 합니다(`"*"` 허용).
  2. **그룹 발신자 정책** (`channels.whatsapp.groupPolicy` + `groupAllowFrom`)
  - `open`: 발신자 허용 목록 우회
  - `allowlist`: 발신자는 `groupAllowFrom` (또는 `*`)와 일치해야 합니다.
  - `disabled`: 모든 그룹 인바운드 차단

  발신자 허용 목록 대체:
  - `groupAllowFrom`가 설정되지 않은 경우 런타임은 사용 가능한 경우 `allowFrom`로 대체됩니다.

  참고: `channels.whatsapp` 블록이 전혀 존재하지 않는 경우 런타임 그룹 정책 대체는 사실상 `open`입니다.


---

#### Mentions + /activation

  그룹 답글에는 기본적으로 멘션이 필요합니다.

  멘션 감지에는 다음이 포함됩니다.

  - 봇 신원에 대한 명시적인 WhatsApp 언급
  - 구성된 언급 정규식 패턴(`agents.list[].groupChat.mentionPatterns`, 대체 `messages.groupChat.mentionPatterns`)
  - 암시적 봇에 대한 응답 감지(응답 보낸 사람이 봇 신원과 일치함)

  세션 수준 활성화 명령:

  - `/activation mention`
  - `/activation always`

  `activation` 세션 상태를 업데이트합니다(전역 구성 아님). 주인이 직접 운영합니다.


## 개인번호 및 셀프채팅 행동

연결된 셀프 번호가 `allowFrom`에도 있으면 WhatsApp 셀프 채팅 보호 기능이 활성화됩니다.

- 셀프 채팅 차례에 대한 읽음 확인 건너뛰기
- 자신을 핑할 수 있는 멘션-JID 자동 트리거 동작을 무시합니다.
- `messages.responsePrefix`가 설정되지 않은 경우 셀프 채팅 응답은 기본적으로 `[{identity.name}]` 또는 `[openclaw]`로 설정됩니다.

## 메시지 정규화 및 컨텍스트


::: details Inbound envelope + reply context
  수신 WhatsApp 메시지는 공유 인바운드 봉투에 래핑됩니다.

  인용된 답변이 존재하는 경우 다음 형식으로 컨텍스트가 추가됩니다.


```text
[Replying to <sender> id:<stanzaId>]
<quoted body or media placeholder>
[/Replying]

```


  응답 메타데이터 필드는 사용 가능한 경우 채워집니다(`ReplyToId`, `ReplyToBody`, `ReplyToSender`, 보낸 사람 JID/E.164).
:::


::: details Media placeholders and location/contact extraction
  미디어 전용 인바운드 메시지는 다음과 같은 자리 표시자로 정규화됩니다.

  - `&lt;media:image&gt;`
  - `&lt;media:video&gt;`
  - `&lt;media:audio&gt;`
  - `&lt;media:document&gt;`
  - `&lt;media:sticker&gt;`

  위치 및 연락처 페이로드는 라우팅 전에 텍스트 컨텍스트로 정규화됩니다.
:::


::: details Pending group history injection
  그룹의 경우 처리되지 않은 메시지를 버퍼링하고 봇이 최종적으로 트리거될 때 컨텍스트로 삽입할 수 있습니다.

  - 기본 제한: `50`
  - 구성: `channels.whatsapp.historyLimit`
  - 대체: `messages.groupChat.historyLimit`
  - `0` 비활성화

  주입 마커:

  - `[Chat messages since your last reply - for context]`
  - `[Current message - respond to this]`
:::


::: details Read receipts
  수신 확인은 수신된 인바운드 WhatsApp 메시지에 대해 기본적으로 활성화됩니다.

  전역적으로 비활성화:


```json5
{
  channels: {
    whatsapp: {
      sendReadReceipts: false,
    },
  },
}

```


  계정별 재정의:


```json5
{
  channels: {
    whatsapp: {
      accounts: {
        work: {
          sendReadReceipts: false,
        },
      },
    },
  },
}

```


  셀프 채팅은 전역적으로 활성화된 경우에도 읽음 확인을 건너뜁니다.
:::


## 전달, 청킹 및 미디어


::: details Text chunking
  - 기본 청크 제한: `channels.whatsapp.textChunkLimit = 4000`
  - `channels.whatsapp.chunkMode = "length" | "newline"`
  - `newline` 모드는 단락 경계(빈 줄)를 선호한 다음 길이가 안전한 청킹으로 대체됩니다.
:::


::: details Outbound media behavior
  - 이미지, 비디오, 오디오(PTT 음성 메모) 및 문서 페이로드 지원
  - `audio/ogg`는 음성 메모 호환성을 위해 `audio/ogg; codecs=opus`로 다시 작성되었습니다.
  - 비디오 전송 시 `gifPlayback: true`를 통해 애니메이션 GIF 재생이 지원됩니다.
  - 멀티미디어 응답 페이로드를 보낼 때 첫 번째 미디어 항목에 캡션이 적용됩니다.
  - 미디어 소스는 HTTP(S), `file://` 또는 로컬 경로일 수 있습니다.
:::


::: details Media size limits and fallback behavior
  - 인바운드 미디어 저장 한도: `channels.whatsapp.mediaMaxMb` (기본값 `50`)
  - 자동 응답을 위한 아웃바운드 미디어 한도: `agents.defaults.mediaMaxMb` (기본값 `5MB`)
  - 이미지는 한계에 맞게 자동으로 최적화됩니다(크기 조정/품질 스윕).
  - 미디어 전송 실패 시 첫 번째 항목 폴백은 응답을 자동으로 삭제하는 대신 텍스트 경고를 보냅니다.
:::


## 승인 반응

WhatsApp은 `channels.whatsapp.ackReaction`를 통해 수신 수신 시 즉각적인 응답 응답을 지원합니다.

```json5
{
  channels: {
    whatsapp: {
      ackReaction: {
        emoji: "👀",
        direct: true,
        group: "mentions", // always | mentions | never
      },
    },
  },
}
```

행동 참고사항:

- 인바운드 승인 후 즉시 발송(사전 회신)
- 실패는 기록되지만 정상적인 응답 전달을 차단하지는 않습니다.
- 그룹 모드 `mentions`는 멘션으로 트리거된 턴에 반응합니다. 그룹 활성화 `always`는 이 검사를 우회하는 역할을 합니다.
- WhatsApp은 `channels.whatsapp.ackReaction`를 사용합니다. (레거시 `messages.ackReaction`는 여기서 사용되지 않습니다.)

## 다중 계정 및 자격 증명


::: details Account selection and defaults
  - 계정 ID는 `channels.whatsapp.accounts`에서 옵니다.
  - 기본 계정 선택: `default` 존재하는 경우, 그렇지 않은 경우 처음 구성된 계정 ID(정렬)
  - 계정 ID는 조회를 위해 내부적으로 정규화됩니다.
:::


::: details Credential paths and legacy compatibility
  - 현재 인증 경로: `~/.openclaw/credentials/whatsapp/&lt;accountId&gt;/creds.json`
  - 백업 파일 : `creds.json.bak`
  - `~/.openclaw/credentials/`의 레거시 기본 인증은 기본 계정 흐름에 대해 여전히 인식/마이그레이션됩니다.
:::


::: details Logout behavior
  `openclaw channels logout --channel whatsapp [--account &lt;id&gt;]` 해당 계정의 WhatsApp 인증 상태를 지웁니다.

  레거시 인증 디렉터리에서는 Baileys 인증 파일이 제거되는 동안 `oauth.json`가 유지됩니다.
:::


## 도구, 작업 및 구성 쓰기

- 에이전트 도구 지원에는 WhatsApp 반응 작업(`react`)이 포함됩니다.
- 액션 게이트:
  - `channels.whatsapp.actions.reactions`
  - `channels.whatsapp.actions.polls`
- 채널 시작 구성 쓰기는 기본적으로 활성화됩니다(`channels.whatsapp.configWrites=false`를 통해 비활성화).

## 문제 해결


::: details Not linked (QR required)
  증상: 채널 상태 보고서가 연결되지 않았습니다.

  수정:


```bash
openclaw channels login --channel whatsapp
openclaw channels status

```
:::


::: details Linked but disconnected / reconnect loop
  증상: 연결된 계정에서 연결 끊김 또는 재연결 시도가 반복적으로 발생합니다.

  수정:


```bash
openclaw doctor
openclaw logs --follow

```


  필요한 경우 `channels login`와 다시 연결하세요.
:::


::: details No active listener when sending
  대상 계정에 대한 활성 게이트웨이 수신기가 없으면 아웃바운드 전송이 빠르게 실패합니다.

  게이트웨이가 실행 중이고 계정이 연결되어 있는지 확인하세요.
:::


::: details Group messages unexpectedly ignored
  다음 순서로 확인하세요.

  - `groupPolicy`
  - `groupAllowFrom` / `allowFrom`
  - `groups` 허용 목록 항목
  - 언급 게이팅(`requireMention` + 언급 패턴)
:::


::: details Bun runtime warning
  WhatsApp 게이트웨이 런타임은 Node.js를 사용해야 합니다. Bun은 안정적인 WhatsApp/Telegram 게이트웨이 작동과 호환되지 않는 것으로 표시됩니다.
:::


## 구성 참조 포인터

기본 참조:

- [구성 참조 - WhatsApp](/gateway/configuration-reference#whatsapp)

신호가 높은 WhatsApp 필드:

- 접속: `dmPolicy`, `allowFrom`, `groupPolicy`, `groupAllowFrom`, `groups`
- 배송: `textChunkLimit`, `chunkMode`, `mediaMaxMb`, `sendReadReceipts`, `ackReaction`
- 다중 계정: `accounts.&lt;id&gt;.enabled`, `accounts.&lt;id&gt;.authDir`, 계정 수준 재정의
- 작업: `configWrites`, `debounceMs`, `web.enabled`, `web.heartbeatSeconds`, `web.reconnect.*`
- 세션 동작: `session.dmScope`, `historyLimit`, `dmHistoryLimit`, `dms.&lt;id&gt;.historyLimit`

## 관련

- [페어링](/channels/pairing)
- [채널 라우팅](/channels/channel-routing)
- [문제 해결](/channels/troubleshooting)
