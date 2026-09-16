# Vendored skill: watch

Source: https://github.com/bradautomates/claude-video (MIT, Bradley Bonanno)
Upstream path: `skills/watch/`
Pinned commit: 83da59fa78c3eee9e20f515fe75c438bb5166efd (v0.2.0)

Installed as a repo-local skill so it is available in every Claude Code session
for this repository. To update, re-copy `skills/watch/` from upstream.

Runtime requirements (installed by `scripts/setup.py` on first `/watch` run):
- `yt-dlp`, `ffmpeg`
- optional Whisper API key (Groq or OpenAI) in `~/.config/watch/.env` for the
  transcript fallback when a video has no captions
