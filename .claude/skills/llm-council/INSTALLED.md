# Vendored skill: llm-council

Source: https://github.com/tenfoldmarc/llm-council-skill (MIT per README)
Upstream path: `SKILL.md` (repo root)
Pinned commit: 0dc03275b0ddf542545da3a9684510fff31df353

Installed as a repo-local skill so it is available in every Claude Code session
for this repository. To update, re-copy `SKILL.md` from upstream.

Prompt-only skill — no scripts, no binaries, no network calls. It works by
spawning sub-agents and writes two files into the working directory per run:
`council-report-<timestamp>.html` and `council-transcript-<timestamp>.md`
(both gitignored at the repo root).
