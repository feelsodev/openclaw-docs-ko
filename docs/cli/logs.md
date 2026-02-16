---
title: "logs"
---
# `openclaw logs`

RPC를 통한 Tail 게이트웨이 파일 로그(원격 모드에서 작동)

관련 항목:

- 로깅 개요: [로깅](/logging)

## 예

```bash
openclaw logs
openclaw logs --follow
openclaw logs --json
openclaw logs --limit 500
openclaw logs --local-time
openclaw logs --follow --local-time
```

현지 시간대로 타임스탬프를 렌더링하려면 `--local-time`를 사용하세요.
