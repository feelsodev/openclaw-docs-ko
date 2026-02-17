# OpenClaw Korean Docs 🦞🇰🇷

This repository is an **unofficial Korean translation** of the [OpenClaw](https://github.com/openclaw/openclaw) official documentation.

📖 **Docs site**: https://feelsodev.github.io/openclaw-docs-ko/

📖 **Official English docs**: https://docs.openclaw.ai

## Structure

```
docs/                    # VitePress documentation source
├── .vitepress/
│   ├── config.ts        # VitePress config (sidebar, navigation)
│   └── theme/           # Custom theme + Mintlify-compatible components
├── start/               # Getting started
├── install/             # Installation
├── channels/            # Channels
├── concepts/            # Concepts
├── tools/               # Tools
├── providers/           # Model providers
├── platforms/           # Platforms
├── gateway/             # Gateway
└── ...
.github/workflows/
├── deploy.yml           # main push -> GitHub Pages deploy
└── sync-upstream.yml    # Detect upstream changes every 12h -> create issue
```

## Development

```bash
npm install
npm run dev       # local dev server
npm run build     # production build
npm run preview   # preview built output
```

## Translation Workflow

1. **Auto-detect**: GitHub Actions checks [upstream docs](https://github.com/openclaw/openclaw/tree/main/docs) changes every 12 hours.
2. **Issue creation**: If changes are detected, an issue is created automatically (`upstream-sync` label).
3. **Translation**: Translate the files listed in the issue.
4. **PR & deploy**: Open and merge a PR, then GitHub Pages deployment runs automatically.

## Contributing

Translation contributions are welcome.

1. Fork this repository.
2. Edit the files you want to translate.
3. Open a PR.

### Translation Guidelines

- Keep technical terms (API, CLI, Gateway, etc.) in English.
- Do not translate code block contents.
- Do not change link paths (keep relative paths).
- Use natural Korean phrasing.

## License

The original OpenClaw project is distributed under the [MIT License](https://github.com/openclaw/openclaw/blob/main/LICENSE).
