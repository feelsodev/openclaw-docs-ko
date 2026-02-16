---
title: "GLM Models"
---
# GLM 모델

GLM은 Z.AI 플랫폼을 통해 제공되는 **모델 패밀리**(회사 아님)입니다. OpenClaw에서는 GLM
모델은 `zai` 공급자 및 `zai/glm-5`와 같은 모델 ID를 통해 액세스됩니다.

## CLI 설정

```bash
openclaw onboard --auth-choice zai-api-key
```

## 구성 스니펫

```json5
{
  env: { ZAI_API_KEY: "sk-..." },
  agents: { defaults: { model: { primary: "zai/glm-5" } } },
}
```

## 메모

- GLM 버전 및 가용성은 변경될 수 있습니다. 최신 내용은 Z.AI의 문서를 확인하세요.
- 예시 모델 ID로는 `glm-5`, `glm-4.7`, `glm-4.6` 등이 있습니다.
- 공급자에 대한 자세한 내용은 [/providers/zai](/providers/zai)를 참조하세요.
