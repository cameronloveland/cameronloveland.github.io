"use client";
import { useEffect, useRef, useState } from "react";
import { HiSpeakerWave, HiSpeakerXMark } from "react-icons/hi2";
import HoverSoundGlobal from "./EnableHoverSound";

export default function AudioToggle() {
  const [enabled, setEnabled] = useState(true);
  const ambientRef = useRef<HTMLAudioElement>(null);
  const voiceRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (!ambientRef.current || !voiceRef.current) return;

    ambientRef.current.volume = 0.2;
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
        className={`hover-sound button-style cursor-pointer`}
      >
        {enabled ? <HiSpeakerWave /> : <HiSpeakerXMark />}
      </button>
      <audio ref={ambientRef} src="/sfx/spaceship-ambience.mp3" />
      <audio ref={voiceRef} src="/sfx/voice-welcome.mp3" />
      <HoverSoundGlobal enabled={enabled} />
    </>
  );
}
