# Vendored skill: watch-video

Source: https://github.com/bradautomates/claude-video (MIT, Bradley Bonanno)
Upstream path: `skills/watch/`
Pinned commit: 83da59fa78c3eee9e20f515fe75c438bb5166efd (v0.2.0)

Installed as a repo-local skill so it is available in every Claude Code session
for this repository.

## Local divergence from upstream

Renamed from `watch` to `watch-video`. Only SKILL.md changed: the frontmatter
`name`, the heading, the `SKILL_DIR` install-layout examples, and the
user-facing `/watch` command references.

The bundled scripts are untouched, so these keep upstream naming and must not
be renamed:

- `scripts/watch.py` and its siblings (the SKILL.md commands invoke them by path)
- `~/.config/watch/.env` (the config file the scripts read and write)

A few strings printed by `scripts/setup.py` still say `/watch`. Cosmetic only.

To update: re-copy `skills/watch/` from upstream, then re-apply the rename above.

## Runtime requirements

Installed by `scripts/setup.py` on the first `/watch-video` run:

- `yt-dlp`, `ffmpeg`
- optional Whisper API key (Groq or OpenAI) in `~/.config/watch/.env` for the
  transcript fallback when a video has no captions
