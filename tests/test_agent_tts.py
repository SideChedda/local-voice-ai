"""Tests for ``local_voice_ai.agent._build_tts`` (GRIM-25).

TTS_PROVIDER selects Kokoro (default, offline) or ElevenLabs (cloud, real
Grimlock voice). ElevenLabs requires ELEVENLABS_API_KEY and GRIMLOCK_VOICE_ID —
no live ElevenLabs call is made here, only that the plugin is constructed
with the right credentials or fails loudly without them.
"""

from __future__ import annotations

import pytest

from livekit.plugins import elevenlabs, openai

from local_voice_ai.agent import _build_tts


class TestKokoroDefault:
    def test_defaults_to_kokoro_via_openai_plugin(self, monkeypatch: pytest.MonkeyPatch) -> None:
        monkeypatch.delenv("TTS_BASE_URL", raising=False)
        monkeypatch.delenv("TTS_VOICE", raising=False)

        tts = _build_tts("kokoro")

        assert isinstance(tts, openai.TTS)

    def test_kokoro_uses_tts_1_model_for_protocol_selection(self, monkeypatch: pytest.MonkeyPatch) -> None:
        # tts-1 is the protocol selector for the raw-audio-bytes stream Kokoro
        # speaks — any other model name breaks audio parsing (see agent.py comment).
        tts = _build_tts("kokoro")

        assert tts._opts.model == "tts-1"

    def test_kokoro_respects_tts_voice_env_override(self, monkeypatch: pytest.MonkeyPatch) -> None:
        monkeypatch.setenv("TTS_VOICE", "am_michael")

        tts = _build_tts("kokoro")

        assert tts._opts.voice == "am_michael"


class TestElevenLabs:
    def test_raises_without_api_key(self, monkeypatch: pytest.MonkeyPatch) -> None:
        monkeypatch.delenv("ELEVENLABS_API_KEY", raising=False)
        monkeypatch.setenv("GRIMLOCK_VOICE_ID", "voice-123")

        with pytest.raises(RuntimeError, match="ELEVENLABS_API_KEY"):
            _build_tts("elevenlabs")

    def test_raises_without_voice_id(self, monkeypatch: pytest.MonkeyPatch) -> None:
        monkeypatch.setenv("ELEVENLABS_API_KEY", "sk_fake")
        monkeypatch.delenv("GRIMLOCK_VOICE_ID", raising=False)

        with pytest.raises(RuntimeError, match="GRIMLOCK_VOICE_ID"):
            _build_tts("elevenlabs")

    def test_builds_elevenlabs_tts_with_configured_voice(self, monkeypatch: pytest.MonkeyPatch) -> None:
        monkeypatch.setenv("ELEVENLABS_API_KEY", "sk_fake")
        monkeypatch.setenv("GRIMLOCK_VOICE_ID", "grimlock-voice-abc")

        tts = _build_tts("elevenlabs")

        assert isinstance(tts, elevenlabs.TTS)
        assert tts._opts.voice_id == "grimlock-voice-abc"
