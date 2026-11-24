import { useState, useCallback, type ReactNode } from 'react';
import { IntroOverlay } from './IntroOverlay';

interface IntroGateProps {
  children: ReactNode;
}

/**
 * Checks if the initial cold load entry point is the home page.
 * Intro animation plays before the home page loading on cold site load.
 */
export function isColdHomePage(): boolean {
  if (typeof window === 'undefined') return false;
  const path = window.location.pathname;
  return path === '/' || path === '';
}

/**
 * IntroGate wraps the top-level application. On cold home page loads, it overlays
 * the full-screen 3D intro animation. The underlying application mounts and
 * hydrates simultaneously in the background so there is zero perceived delay
 * once the animation completes or is skipped.
 */
export function IntroGate({ children }: IntroGateProps) {
  const [showIntro, setShowIntro] = useState(() => isColdHomePage());

  const handleIntroComplete = useCallback(() => {
    setShowIntro(false);
  }, []);

  return (
    <>
      {children}
      {showIntro && <IntroOverlay onComplete={handleIntroComplete} />}
    </>
  );
}
