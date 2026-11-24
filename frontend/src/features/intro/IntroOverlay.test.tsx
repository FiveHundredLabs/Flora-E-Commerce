import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { IntroOverlay, supportsWebGL, prefersReducedMotion } from './IntroOverlay';
import { IntroGate, isColdHomePage } from './IntroGate';

describe('Intro feature', () => {
  const originalMatchMedia = window.matchMedia;
  const originalLocation = window.location;

  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    if (originalMatchMedia) {
      window.matchMedia = originalMatchMedia;
    } else {
      delete (window as unknown as { matchMedia?: unknown }).matchMedia;
    }
  });

  describe('WebGL and Media Query helpers', () => {
    it('detects WebGL support correctly', () => {
      expect(typeof supportsWebGL()).toBe('boolean');
    });

    it('detects reduced motion correctly', () => {
      window.matchMedia = vi.fn().mockImplementation((query: string) => ({
        matches: query === '(prefers-reduced-motion: reduce)',
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      }));

      expect(prefersReducedMotion()).toBe(true);
    });

    it('identifies cold home page route correctly', () => {
      expect(isColdHomePage()).toBe(true);

      // Test with non-home pathname
      Object.defineProperty(window, 'location', {
        configurable: true,
        value: { ...originalLocation, pathname: '/admin/suppliers' },
      });
      expect(isColdHomePage()).toBe(false);

      Object.defineProperty(window, 'location', {
        configurable: true,
        value: { ...originalLocation, pathname: '/cart' },
      });
      expect(isColdHomePage()).toBe(false);

      // Restore
      Object.defineProperty(window, 'location', {
        configurable: true,
        value: originalLocation,
      });
    });
  });

  describe('IntroOverlay Lifecycle', () => {
    it('renders overlay on mount with accessibility region and brand', () => {
      const onComplete = vi.fn();
      const { container } = render(<IntroOverlay onComplete={onComplete} />);

      expect(
        screen.getByRole('region', {
          name: /Site introduction animation/i,
        }),
      ).toBeInTheDocument();
      expect(container.querySelector('.intro-copy h1')).toHaveTextContent('Flower & Flora');
      expect(screen.getByRole('button', { name: /Skip intro/i })).toBeInTheDocument();
    });

    it('renders the original botanical mark without image frames', () => {
      const onComplete = vi.fn();
      const { container } = render(<IntroOverlay onComplete={onComplete} />);

      expect(container.querySelectorAll('.intro-leaf')).toHaveLength(4);
      expect(container.querySelectorAll('.intro-scene__frame')).toHaveLength(0);
    });

    it('automatically transitions and calls onComplete after fallback timer', async () => {
      const onComplete = vi.fn();
      render(<IntroOverlay onComplete={onComplete} />);

      expect(onComplete).not.toHaveBeenCalled();

      // Botanical reveal completes after 3400ms
      await act(async () => {
        vi.advanceTimersByTime(3450);
      });
      // Exit fade-out is 500ms
      await act(async () => {
        vi.advanceTimersByTime(600);
      });

      expect(onComplete).toHaveBeenCalled();
    });

    it('triggers early skip when clicking the overlay', async () => {
      const onComplete = vi.fn();
      render(<IntroOverlay onComplete={onComplete} />);

      const overlay = screen.getByRole('region', {
        name: /Site introduction animation/i,
      });

      await act(async () => {
        fireEvent.click(overlay);
      });
      await act(async () => {
        vi.advanceTimersByTime(600);
      });

      expect(onComplete).toHaveBeenCalledTimes(1);
    });

    it('triggers early skip when clicking the skip button', async () => {
      const onComplete = vi.fn();
      render(<IntroOverlay onComplete={onComplete} />);

      const skipButton = screen.getByRole('button', { name: /Skip intro/i });

      await act(async () => {
        fireEvent.click(skipButton);
      });
      await act(async () => {
        vi.advanceTimersByTime(600);
      });

      expect(onComplete).toHaveBeenCalledTimes(1);
    });

    it('triggers skip when pressing Escape key on the overlay element', async () => {
      const onComplete = vi.fn();
      render(<IntroOverlay onComplete={onComplete} />);

      const overlay = screen.getByRole('region', {
        name: /Site introduction animation/i,
      });

      await act(async () => {
        fireEvent.keyDown(overlay, { key: 'Escape' });
      });
      await act(async () => {
        vi.advanceTimersByTime(600);
      });

      expect(onComplete).toHaveBeenCalledTimes(1);
    });

    it('triggers skip when pressing Escape key globally on window', async () => {
      const onComplete = vi.fn();
      render(<IntroOverlay onComplete={onComplete} />);

      await act(async () => {
        fireEvent.keyDown(window, { key: 'Escape' });
      });
      await act(async () => {
        vi.advanceTimersByTime(600);
      });

      expect(onComplete).toHaveBeenCalledTimes(1);
    });

    it('skips 3D and completes quickly under prefers-reduced-motion', async () => {
      window.matchMedia = vi.fn().mockImplementation((query: string) => ({
        matches: query === '(prefers-reduced-motion: reduce)',
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      }));

      const onComplete = vi.fn();
      const { container } = render(<IntroOverlay onComplete={onComplete} />);

      // Under reduced motion, no petal animations are rendered
      expect(container.querySelectorAll('.intro-css-petal').length).toBe(0);
      expect(screen.getByText(/Flower & Flora/i)).toBeInTheDocument();

      // Reduced motion brief flash timer is 750ms
      await act(async () => {
        vi.advanceTimersByTime(800);
      });
      // Reduced motion exit duration is 50ms
      await act(async () => {
        vi.advanceTimersByTime(100);
      });

      expect(onComplete).toHaveBeenCalledTimes(1);
    });
  });

  describe('IntroGate Integration', () => {
    it('renders children immediately behind intro overlay on home page and unmounts overlay when done', async () => {
      const { container } = render(
        <IntroGate>
          <div data-testid="app-content">Main Application Content</div>
        </IntroGate>,
      );

      // App content is rendered immediately (no delayed hydration)
      expect(screen.getByTestId('app-content')).toBeInTheDocument();
      // Overlay is present on cold home page load
      expect(screen.getByRole('region', { name: /Site introduction animation/i })).toBeInTheDocument();

      // Click to skip
      const skipButton = screen.getByRole('button', { name: /Skip intro/i });
      await act(async () => {
        fireEvent.click(skipButton);
      });
      await act(async () => {
        vi.advanceTimersByTime(600);
      });

      // Overlay unmounted
      expect(container.querySelector('.intro-overlay')).not.toBeInTheDocument();
      // App content remains
      expect(screen.getByTestId('app-content')).toBeInTheDocument();
    });

    it('does NOT render intro overlay when initial entry is a non-home route', () => {
      Object.defineProperty(window, 'location', {
        configurable: true,
        value: { ...originalLocation, pathname: '/admin/suppliers' },
      });

      const { container } = render(
        <IntroGate>
          <div data-testid="admin-content">Admin Dashboard</div>
        </IntroGate>,
      );

      expect(screen.getByTestId('admin-content')).toBeInTheDocument();
      expect(container.querySelector('.intro-overlay')).not.toBeInTheDocument();

      // Restore
      Object.defineProperty(window, 'location', {
        configurable: true,
        value: originalLocation,
      });
    });
  });
});
