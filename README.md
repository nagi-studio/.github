# .github

Org-level defaults for [**NAGI STUDIO**](https://github.com/nagi-studio) — where [Nagi-ovo](https://github.com/Nagi-ovo) builds for fun and runs the community.

- [`profile/README.md`](./profile/README.md) renders as the org's public profile at <https://github.com/nagi-studio>.
- [`profile/assets/`](./profile/assets/) holds the profile banner and the per-project logos.
- [`assets/gen-banner.ts`](./assets/gen-banner.ts) renders the banner (1280×720) to `profile/assets/banner.png` — house style (dark + acid `#c8f031`, blueprint grid, Space Grotesk + JetBrains Mono) with the studio mascot in [`assets/mascot.png`](./assets/mascot.png). Needs `puppeteer-core` + system Chrome; same recipe as `nagi-bench-site/scripts/og.ts`.
- The mascot is an original character (pink hair, grey eyes) generated with `image2-gen-cli`, rendered on a flat blue chroma screen ([`assets/mascot-src.png`](./assets/mascot-src.png)) and keyed to transparent.

No emojis, anywhere (house rule).
