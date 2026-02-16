---
title: "Onboarding (macOS App)"
sidebarTitle: "Onboarding: macOS App"
---
# 온보딩(macOS 앱)

이 문서에서는 **현재** 첫 실행 온보딩 흐름을 설명합니다. 목표는
원활한 "0일차" 경험: 게이트웨이가 실행되는 위치를 선택하고, 인증을 연결하고,
마법사를 실행하고 에이전트가 자체적으로 부트스트랩하도록 합니다.
온보딩 경로에 대한 일반적인 개요는 [온보딩 개요](/start/onboarding-overview)를 참조하세요.


**Step 1: Approve macOS warning**

<img src="https://docs.openclaw.ai/assets/macos-onboarding/01-macos-warning.jpeg" alt="" />


**Step 2: Approve find local networks**

<img src="https://docs.openclaw.ai/assets/macos-onboarding/02-local-networks.jpeg" alt="" />


**Step 3: Welcome and security notice**

<img src="https://docs.openclaw.ai/assets/macos-onboarding/03-security-notice.png" alt="" />

_Read the security notice displayed and decide accordingly_


**Step 4: Local vs Remote**

<img src="https://docs.openclaw.ai/assets/macos-onboarding/04-choose-gateway.png" alt="" />


**게이트웨이**는 어디에서 실행되나요?

  - **이 Mac(로컬 전용):** 온보딩에서 OAuth 흐름을 실행하고 자격 증명을 쓸 수 있습니다.
  로컬로.
  - **원격(SSH/Tailnet을 통해):** 온보딩은 OAuth를 로컬로 실행하지 **않습니다**.
  게이트웨이 호스트에 자격 증명이 있어야 합니다.
  - **나중에 구성:** 설정을 건너뛰고 앱을 구성되지 않은 상태로 둡니다.


::: tip
**게이트웨이 인증 팁:**

  - 마법사는 이제 루프백에도 **토큰**을 생성하므로 로컬 WS 클라이언트는 인증해야 합니다.
  - 인증을 비활성화하면 모든 로컬 프로세스가 연결될 수 있습니다. 완전히 신뢰할 수 있는 컴퓨터에서만 사용하세요.
  - 다중 시스템 액세스 또는 비루프백 바인딩에는 **토큰**을 사용합니다.
:::


**Step 5: Permissions**

<img src="https://docs.openclaw.ai/assets/macos-onboarding/05-permissions.png" alt="" />

_Choose what permissions do you want to give OpenClaw_


온보딩에서는 다음에 필요한 TCC 권한을 요청합니다.

  - 자동화(AppleScript)
  - 알림
  - 접근성
  - 화면 녹화
  - 마이크
  - 음성 인식
  - 카메라
  - 위치


**Step 6: CLI**


::: info
이 단계는 선택사항입니다.
:::

  앱은 npm/pnpm을 통해 전역 `openclaw` CLI를 설치할 수 있으므로 터미널
  워크플로우와 시작된 작업은 즉시 작동됩니다.


**Step 7: Onboarding Chat (dedicated session)**

  설정 후 앱은 상담원이 다음을 수행할 수 있도록 전용 온보딩 채팅 세션을 엽니다.
  자신을 소개하고 다음 단계를 안내합니다. 이렇게 하면 첫 실행 지침이 별도로 유지됩니다.
  당신의 일상적인 대화에서. 자세한 내용은 [부트스트래핑](/start/bootstrapping)을 참조하세요.
  첫 번째 에이전트가 실행되는 동안 게이트웨이 호스트에서 어떤 일이 발생합니까?

