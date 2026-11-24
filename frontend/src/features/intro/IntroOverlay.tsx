import { useState, useCallback, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import IntroScene3D from './IntroScene3D';
import './intro.css';
import './intro-opening.css';

/** Checks if WebGL is supported in the current environment */
export function supportsWebGL(): boolean {
  if (typeof window === 'undefined' || typeof document === 'undefined') return false;
  try {
    const canvas = document.createElement('canvas');
    return Boolean(
      window.WebGLRenderingContext &&
        (canvas.getContext('webgl2') ||
          canvas.getContext('webgl') ||
          canvas.getContext('experimental-webgl')),
    );
  } catch {
    return false;
  }
}

/** Checks prefers-reduced-motion media query */
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

interface IntroOverlayProps {
  onComplete: () => void;
}

/** 2D CSS fallback when WebGL is unavailable or while 3D bundle lazy-loads */
export function CSSFallback({ onEnd }: { onEnd: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onEnd, 2500);
    return () => clearTimeout(timer);
  }, [onEnd]);

  return (
    <div className="intro-fallback">
      <div className="intro-css-petals" aria-hidden="true">
        {Array.from({ length: 8 }).map((_, i) => (
          <span
            key={i}
            className="intro-css-petal"
            style={{ '--i': i } as React.CSSProperties}
          />
        ))}
      </div>
      <h1 className="intro-brand intro-brand--animate">Flower &amp; Flora</h1>
      <p className="intro-kicker">Botanical Marketplace</p>
    </div>
  );
}

export function IntroOverlay({ onComplete }: IntroOverlayProps) {
  const [phase, setPhase] = useState<'playing' | 'exiting' | 'done'>('playing');
  const [isReducedMotion] = useState(() => prefersReducedMotion());
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  const handleSkip = useCallback(() => {
    setPhase((prev) => (prev === 'playing' ? 'exiting' : prev));
  }, []);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleSkip();
      }
    },
    [handleSkip],
  );

  // Global Escape key listener for immediate accessible skip
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        handleSkip();
      }
    };
    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [handleSkip]);

  // Transition from exiting to done after 500ms fade-out
  useEffect(() => {
    if (phase === 'exiting') {
      const exitDuration = isReducedMotion ? 50 : 500;
      const timer = setTimeout(() => {
        setPhase('done');
        onCompleteRef.current();
      }, exitDuration);
      return () => clearTimeout(timer);
    }
  }, [phase, isReducedMotion]);

  // When prefers-reduced-motion is active, display brief static brand mark then complete
  useEffect(() => {
    if (isReducedMotion) {
      const timer = setTimeout(() => {
        setPhase('exiting');
      }, 750);
      return () => clearTimeout(timer);
    }
  }, [isReducedMotion]);

  if (phase === 'done') return null;

  return (
    <motion.div
      className="intro-overlay"
      onClick={handleSkip}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="region"
      aria-label="Site introduction animation. Press Escape or click anywhere to skip."
      initial={{ opacity: 1 }}
      animate={{ opacity: phase === 'exiting' ? 0 : 1 }}
      transition={{ duration: isReducedMotion ? 0.05 : 0.5, ease: 'easeInOut' }}
    >
      {/* Accessible skip button */}
      <button
        type="button"
        className="intro-skip-btn"
        onClick={(e) => {
          e.stopPropagation();
          handleSkip();
        }}
        aria-label="Skip intro animation"
      >
        Skip intro
      </button>

      {isReducedMotion ? (
        <div className="intro-fallback">
          <h1 className="intro-brand">Flower &amp; Flora</h1>
          <p className="intro-kicker">Botanical Marketplace</p>
        </div>
      ) : (
        <IntroScene3D onComplete={handleSkip} />
      )}
    </motion.div>
  );
}
