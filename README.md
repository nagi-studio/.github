# .github

Org-level defaults for [**NAGI STUDIO**](https://github.com/nagi-studio) — where [Nagi-ovo](https://github.com/Nagi-ovo) builds for fun and runs the community.

- [`profile/README.md`](./profile/README.md) renders as the org's public profile at <https://github.com/nagi-studio>.
- [`profile/assets/`](./profile/assets/) holds the profile banner and the per-project logos.
- [`assets/gen-banner.ts`](./assets/gen-banner.ts) renders the banner (1280×680) to `profile/assets/banner.png` — house style (dark + acid `#c8f031`, blueprint grid, Space Grotesk + JetBrains Mono) with the transparent Anon (爱音) cutout in [`assets/anon.png`](./assets/anon.png). Needs `puppeteer-core` + system Chrome; same recipe as `nagi-bench-site/scripts/og.ts`. The cutout is keyed from `ai-jiahao-test`'s Live2D film page — see that repo's `COVER-HANDOFF.md` to regenerate or swap the pose.

No emojis, anywhere (house rule). Anon is the community mascot.
