import { readFile } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import path from 'node:path'

const repoRoot = process.cwd()
const homepagePath = path.join(repoRoot, 'docs', 'index.md')
const logoPath = path.join(repoRoot, 'docs', 'public', 'assets', 'openclaw-logo-text-dark.png')

const content = await readFile(homepagePath, 'utf8')

const checks = [
  {
    ok: content.includes('# 오픈클로 🦞'),
    message: 'missing homepage heading "# 오픈클로 🦞"',
  },
  {
    ok: content.includes('<img src="/assets/openclaw-logo-text-dark.png" alt="OpenClaw" width="500" />'),
    message: 'missing canonical homepage lobster logo image block',
  },
  {
    ok: content.includes('탈출! 각질 제거!'),
    message: 'missing homepage lobster quote line',
  },
  {
    ok: existsSync(logoPath),
    message: 'missing logo asset docs/public/assets/openclaw-logo-text-dark.png',
  },
]

const failures = checks.filter((c) => !c.ok)

if (failures.length > 0) {
  console.error('[homepage-check] failed')
  for (const failure of failures) {
    console.error(`- ${failure.message}`)
  }
  process.exit(1)
}

console.log('[homepage-check] passed')
