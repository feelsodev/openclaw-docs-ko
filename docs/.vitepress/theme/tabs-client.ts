function activateTab(tabsRoot: HTMLElement, nextIndex: number): void {
  const buttons = Array.from(tabsRoot.querySelectorAll<HTMLElement>('.mint-tab-btn'))
  const panels = Array.from(tabsRoot.querySelectorAll<HTMLElement>('.mint-tab-panel'))

  for (const button of buttons) {
    const isActive = Number(button.dataset.tab) === nextIndex
    button.classList.toggle('active', isActive)
    button.setAttribute('aria-selected', isActive ? 'true' : 'false')
  }

  for (const panel of panels) {
    const isActive = Number(panel.dataset.tab) === nextIndex
    panel.classList.toggle('active', isActive)
  }
}

function bindTabs(tabsRoot: HTMLElement): void {
  if (tabsRoot.dataset.tabsBound === 'true') {
    return
  }

  const buttons = Array.from(tabsRoot.querySelectorAll<HTMLElement>('.mint-tab-btn'))
  if (buttons.length === 0) {
    return
  }

  tabsRoot.dataset.tabsBound = 'true'

  for (const button of buttons) {
    button.addEventListener('click', () => {
      const nextIndex = Number(button.dataset.tab ?? '0')
      activateTab(tabsRoot, Number.isNaN(nextIndex) ? 0 : nextIndex)
    })
  }

  activateTab(tabsRoot, 0)
}

export function initializeMintTabs(): void {
  if (typeof document === 'undefined') {
    return
  }

  const tabsRoots = Array.from(document.querySelectorAll<HTMLElement>('[data-mint-tabs]'))
  for (const tabsRoot of tabsRoots) {
    bindTabs(tabsRoot)
  }
}
