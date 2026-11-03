# .github

Org-level defaults for [**NAGI STUDIO**](https://github.com/nagi-studio) — where [Nagi-ovo](https://github.com/Nagi-ovo) builds for fun and runs the community.

- [`profile/README.md`](./profile/README.md) renders as the org's public profile at <https://github.com/nagi-studio>.
- [`profile/assets/`](./profile/assets/) holds the profile banner and the per-project logos.
- [`assets/gen-banner.ts`](./assets/gen-banner.ts) renders the banner (1280×720) to `profile/assets/banner.png` — notebook house style (cream grid paper, indigo `#4b4fb0` vs Claude orange `#d97757`, Noto Serif SC + Fraunces for the name, LXGW WenKai + Caveat + JetBrains Mono for the rest). Needs `puppeteer-core` + system Chrome; same recipe as `nagi-bench-site/scripts/og.ts`.
- [`scripts/update-videos.ts`](./scripts/update-videos.ts) regenerates the profile's videos block (Season 1 recap views, newest three episodes of 【Re:从零开始的AI学习】 with covers and companion skills) from Bilibili. [`update-videos.yml`](./.github/workflows/update-videos.yml) runs it daily and commits only when something changed; `profile/videos.json` caches per-video details, since Bilibili sometimes refuses GitHub's IPs.
- [`assets/avatar.png`](./assets/avatar.png) is the 卡普迪姆 avatar (purchased, cut out to transparent); [`assets/icons/`](./assets/icons/) holds the platform marks from [simple-icons](https://simpleicons.org) (CC0).

No emojis, anywhere (house rule).
