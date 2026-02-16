---
title: "agent"
---
# `openclaw agent`

게이트웨이를 통해 에이전트 차례를 실행합니다(내장된 경우 `--local` 사용).
구성된 에이전트를 직접 대상으로 지정하려면 `--agent &lt;id&gt;`를 사용하세요.

관련 항목:

- 에이전트 보내기 도구: [에이전트 보내기](/tools/agent-send)

## 예

```bash
openclaw agent --to +15555550123 --message "status update" --deliver
openclaw agent --agent ops --message "Summarize logs"
openclaw agent --session-id 1234 --message "Summarize inbox" --thinking medium
openclaw agent --agent ops --message "Generate report" --deliver --reply-channel slack --reply-to "#reports"
```
