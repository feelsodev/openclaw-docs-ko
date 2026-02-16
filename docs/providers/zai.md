---
title: "Z.AI"
---
# Z.AI

Z.AI는 **GLM** 모델을 위한 API 플랫폼입니다. GLM용 REST API를 제공하고 API 키를 사용합니다.
인증을 위해. Z.AI 콘솔에서 API 키를 생성하세요. OpenClaw는 `zai` 공급자를 사용합니다.
Z.AI API 키를 사용합니다.

## CLI 설정

```bash
openclaw onboard --auth-choice zai-api-key
# or non-interactive
openclaw onboard --zai-api-key "$ZAI_API_KEY"
```

## 구성 스니펫

```json5
{
  env: { ZAI_API_KEY: "sk-..." },
  agents: { defaults: { model: { primary: "zai/glm-5" } } },
}
```

## 메모

- GLM 모델은 `zai/&lt;model&gt;`(예: `zai/glm-5`)로 제공됩니다.
- 모델 계열 개요는 [/providers/glm](/providers/glm)를 참조하세요.
- Z.AI는 API 키와 함께 Bearer 인증을 사용합니다.
