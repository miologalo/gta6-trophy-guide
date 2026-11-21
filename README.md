# GTA VI Trophy Guide &amp; Tracker

![make.fun bounty](https://make.fun/badge/gta6-trophy-guide-01.svg)
![Rank](https://make.fun/badge/gta6-trophy-guide-01/miologalo/gta6-trophy-guide/rank.svg)
![Reward](https://make.fun/badge/gta6-trophy-guide-01/miologalo/gta6-trophy-guide/reward.svg)

An **offline web app** — the complete guide and tracker for the **55 official PlayStation 5 trophies** of Grand Theft Auto VI: 1 Platinum, 2 Gold, 6 Silver, 46 Bronze, 28 hidden, no online trophies. Platinum ≈ 200 hours, difficulty ≈ 4/10.

Built for the [make.fun bounty “Build the best GTA 6 trophy guide”](https://make.fun/bounty/gta6-trophy-guide-01) ($250).

## Open it

No build step, no network. Serve `app/` with any static server (or open `app/index.html` in desktop Chrome from the folder):

```sh
node serve.ts   # serves app/ at http://localhost:8080 (if present)
# or
python3 -m http.server 8080 --directory app
```

## What it does

- **Every trophy** with its official name, description, grade and Gamerscore (1,000 total), plus a guide in our own words with cited sources for each one.
- **Checklist tracker** — tick trophies off; progress is saved in the browser (localStorage) and can be **exported to a file and imported back**.
- **Progress display** — x/55, percentage, Gamerscore, and per-grade counts (Platinum/Gold/Silver/Bronze).
- **Filters** — search by name/description, filter by kind (story, missable, collectibles, activities, platinum) and by grade; hide-earned and unearned-only views.
- **Spoiler-safe mode** (on by default) — hidden story trophies stay hidden until you earn them.
- **Roadmap to the Platinum** — the order to earn trophies in, from Chapter 1 to 100% completion (“A Long Road”).
- **Missable flags** — the only missable trophy is **Positive Mental Attitude** (Lucia's balcony meditation in Chapter 1 disappears after Chapter 1; no mission replay). Keep a manual save at the start of every chapter.

## Data

`app/data/trophies.json` holds all 55 trophies (name, official description, grade, Gamerscore, hidden flag, kind, missable flag, target count, guide, sources).

## Sources

Trophy names, descriptions, grades and Gamerscore are as PlayStation publishes them, cross-checked across:

- [Output Lag — GTA 6 Trophy List](https://outputlag.com/guides/gta-6-trophy-list/)
- [EGamers — GTA 6 Trophy List: All 55 Trophies and Achievements](https://egamers.io/gta-6-trophy-list-all-55-trophies-and-achievements-plus-the-hardest-ones/)
- [Leonida Interactive Wiki — Trophies &amp; Achievements](https://leonidainteractive.com/wiki/guides/trophies-achievements/)
- [u7buy Blog — GTA 6 Trophies](https://www.u7buy.com/blog/gta-6-trophies/)

Guides are written in our own words; sources are cited beside each trophy. No Rockstar Games logo, artwork or game screenshots are used. Unofficial fan guide, not affiliated with Rockstar Games or PlayStation.

## Entry program

`main.ts` (Node 22, standard library only) copies `app/` and `screenshots/` to `/output` and writes `/output/dossier.json` with `vendor/makefun-frontend.ts` (the kit's copy, unchanged):

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

## License

MIT — see [LICENSE](LICENSE).
