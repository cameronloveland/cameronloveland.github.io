import { useEffect } from 'react';

export function useSlowScroll<T extends HTMLElement>(
  ref: React.RefObject<T | null>,
  duration: number = 15000
) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const distance = el.scrollHeight - el.clientHeight;
    if (distance <= 0) return;

    el.style.setProperty('--scroll-distance', `${distance}px`);
    el.style.setProperty('--scroll-duration', `${duration}ms`);

    return () => {
      el.style.removeProperty('--scroll-distance');
      el.style.removeProperty('--scroll-duration');
    };
  }, [ref, duration]);
}
