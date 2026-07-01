// src/components/ui/ThemeAudioEngine.tsx

import { useEffect, useRef } from 'react';
import { useThemeStore } from '../../store/themeStore';
import { usePortfolioStore } from '../../store/portfolioStore'; // 🚀 HOOK INTO LIVE BACKEND CONTEXT

export function ThemeAudioEngine() {
  const { currentDimension, isAudioMuted } = useThemeStore();
  
  // 🚀 SENIOR INJECTION: Pull dynamic hot-swappable track records straight out of live production data
  const data = usePortfolioStore((state) => state.data);
  const audioTracks = data?.settings?.audioTracks;
  
  const audioRefs = useRef<{ [key: string]: HTMLAudioElement }>({});
  const fadeIntervals = useRef<{ [key: string]: number }>({});
  
  // Store previous track URLs to detect changes and swap files on the fly
  const prevTracksRef = useRef<{ [key: string]: string }>({});

  /* ==========================================================================
     🚀 DYNAMIC SOUND ENGINE SOURCE RE-CALIBRATION
     ========================================================================== */
  useEffect(() => {
    // Standard baseline fallbacks if data.json doesn't contain custom tracking paths yet
    const fallbackTracks = {
      cosmic: '/audio/cosmic-ambient.mp3',
      arctic: '/audio/arctic-glitch.mp3',
      creamy: '/audio/creamy-piano.mp3'
    };

    const activeTracks = {
      cosmic: audioTracks?.cosmic || fallbackTracks.cosmic,
      arctic: audioTracks?.arctic || fallbackTracks.arctic,
      creamy: audioTracks?.creamy || fallbackTracks.creamy,
    };

    Object.entries(activeTracks).forEach(([key, src]) => {
      // If a track's URL has changed, or hasn't been initialized yet, build a clean node instance
      if (prevTracksRef.current[key] !== src) {
        // Safe tear down: Stop and unmount the old track if it exists
        if (audioRefs.current[key]) {
          audioRefs.current[key].pause();
          audioRefs.current[key].src = '';
        }

        const audio = new Audio(src);
        audio.loop = true;
        audio.volume = 0; // Maintain smooth silent crossfading targets
        audioRefs.current[key] = audio;
        prevTracksRef.current[key] = src; // Lock track identity into reference pointer caches

        // If we hot-swapped the song that is CURRENTLY supposed to be active, trigger playback instantly
        if (key === currentDimension && !isAudioMuted) {
          audio.play().catch(() => console.log("Hot-swap initialization waiting for user interaction."));
        }
      }
    });

    return () => {
      // Cleanup on full site tear down
      Object.values(audioRefs.current).forEach(audio => {
        audio.pause();
      });
    };
  }, [audioTracks, currentDimension, isAudioMuted]);

  // High-Fidelity Crossfading Physics Logic Loop
  useEffect(() => {
    const fadeVolume = (targetKey: string, targetVolume: number) => {
      const audio = audioRefs.current[targetKey];
      if (!audio) return;

      window.clearInterval(fadeIntervals.current[targetKey]);

      if (targetVolume > 0 && audio.paused && !isAudioMuted) {
        audio.play().catch(() => {});
      }

      fadeIntervals.current[targetKey] = window.setInterval(() => {
        const step = 0.05;
        if (audio.volume < targetVolume) {
          audio.volume = Math.min(audio.volume + step, targetVolume);
        } else if (audio.volume > targetVolume) {
          audio.volume = Math.max(audio.volume - step, targetVolume);
        }

        if (audio.volume === targetVolume) {
          window.clearInterval(fadeIntervals.current[targetKey]);
          if (targetVolume === 0) audio.pause();
        }
      }, 50);
    };

    Object.keys(audioRefs.current).forEach(key => {
      if (isAudioMuted) {
        fadeVolume(key, 0);
      } else {
        fadeVolume(key, key === currentDimension ? 0.35 : 0);
      }
    });

  }, [currentDimension, isAudioMuted]);

  return null;
}
