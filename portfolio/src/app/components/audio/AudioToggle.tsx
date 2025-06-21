"use client";
import { useEffect, useRef, useState } from "react";
import { HiSpeakerWave, HiSpeakerXMark } from "react-icons/hi2";
import HoverSoundGlobal from "./HoverSoundGlobal";

export default function AudioToggle() {
  const [enabled, setEnabled] = useState(false);
  const ambientRef = useRef<HTMLAudioElement>(null);
  const voiceRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (!ambientRef.current || !voiceRef.current) return;

    ambientRef.current.volume = 0.3;
    ambientRef.current.loop = true;

    if (enabled) {
      ambientRef.current.play().catch(() => { });
      voiceRef.current.play().catch(() => { });
    } else {
      ambientRef.current.pause();
    }
  }, [enabled]);

  return (
    <>
      <button
        onClick={() => setEnabled((e) => !e)}
        title="Toggle audio"
        className={`text-neutral-500 hover:text-cyan-300 text-lg ${enabled ? "text-cyan-300" : ""}`}
      >
        {enabled ? <HiSpeakerWave /> : <HiSpeakerXMark />}
      </button>
      <audio ref={ambientRef} src="/sfx/spaceship-ambience.mp3" />
      <audio ref={voiceRef} src="/sfx/voice-welcome.mp3" />
      <HoverSoundGlobal enabled={enabled} />
    </>
  );
}
