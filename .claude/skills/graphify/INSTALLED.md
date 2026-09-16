# Installed skill: graphify

Source: https://github.com/Graphify-Labs/graphify (Apache-2.0)
Requested via the mirror https://github.com/safishamsi/graphify, whose
`graphify/` package is byte-identical to the PyPI 0.9.62 sdist (the mirror
carries one extra doc file, `extractors/MIGRATION.md`, that the sdist omits).
Installed from PyPI rather than the mirror, since that is the upstream-
documented install path.

Version: 0.9.62

## This skill is NOT self-contained

Unlike the other vendored skills here, graphify is a thin wrapper over a
Python CLI. It does nothing without that CLI on PATH:

    uv tool install graphifyy      # or: pipx install graphifyy

Everyone who works in this repo needs it — see the hooks warning below.

## What `graphify install --project --platform claude` wrote

    .claude/skills/graphify/     this skill + references/
    .claude/settings.json        PreToolUse hooks (see below)
    .claude/CLAUDE.md            skill registration line
    CLAUDE.md                    graphify usage rules (repo had no CLAUDE.md before)

`--strict` was deliberately NOT used. It blocks the first raw file read each
session until a `graphify query` runs.

## The hooks are intrusive — read this before keeping them

`.claude/settings.json` registers PreToolUse hooks on `Bash|Grep` and
`Read|Glob`, so `graphify hook-guard` runs on essentially every tool call.

- With the CLI present and a graph built, it injects a "MANDATORY: run
  graphify query first" instruction into each of those calls.
- With the CLI present and no graph, it exits 0 silently.
- **Without the CLI it exits 127 (`graphify: not found`) on every Bash, Grep,
  Read and Glob call.** Non-blocking, but noisy for anyone who clones this
  repo and has not run `uv tool install graphifyy`.

To drop the hooks but keep the skill, delete the `hooks` block from
`.claude/settings.json`. To remove everything: `graphify uninstall --purge`.

## Notes

- `graphify-out/` is generated output and is gitignored.
- Code extraction is local tree-sitter (no LLM, nothing leaves the machine).
  The semantic pass over docs/PDFs/images/video uses the assistant's model or
  a configured API key (`GEMINI_API_KEY` / `GOOGLE_API_KEY`).
