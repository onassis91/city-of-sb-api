# Vendored skill: council

Source: https://github.com/tenfoldmarc/llm-council-skill (MIT per README;
the repo ships no LICENSE file)
Upstream path: `SKILL.md` (repo root)
Pinned commit: 0dc03275b0ddf542545da3a9684510fff31df353

Installed as a repo-local skill so it is available in every Claude Code session
for this repository.

## Local divergence from upstream

Renamed from `llm-council` to `council` (frontmatter `name` and heading only).
The trigger phrases in the description are unchanged.

To update: re-copy `SKILL.md` from upstream, then re-apply the rename above.

## Notes

Prompt-only skill — no scripts, no binaries, no network calls. It works by
spawning sub-agents, and writes two files into the working directory per run:
`council-report-<timestamp>.html` and `council-transcript-<timestamp>.md`
(both gitignored at the repo root).

One run costs 11 sub-agent calls: 5 advisors, 5 peer reviews, 1 chairman.
