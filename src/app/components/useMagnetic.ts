import { useRef, useEffect } from 'react';
import { useMotionValue, useSpring } from 'motion/react';

interface MagneticOptions {
  strength?: number;  // how far the element moves (px multiplier, 0–1)
  radius?: number;    // activation distance in px
  stiffness?: number;
  damping?: number;
}

export function useMagnetic({
  strength = 0.38,
  radius = 80,
  stiffness = 180,
  damping = 14,
}: MagneticOptions = {}) {
  const ref = useRef<HTMLElement>(null);
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const x = useSpring(rawX, { stiffness, damping });
  const y = useSpring(rawY, { stiffness, damping });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < radius) {
        // Ease off at the edge of the radius so it doesn't snap
        const factor = (1 - dist / radius) * strength;
        rawX.set(dx * factor);
        rawY.set(dy * factor);
      } else {
        rawX.set(0);
        rawY.set(0);
      }
    };

    const onLeave = () => {
      rawX.set(0);
      rawY.set(0);
    };

    window.addEventListener('mousemove', onMove);
    el.addEventListener('mouseleave', onLeave);
    return () => {
      window.removeEventListener('mousemove', onMove);
      el.removeEventListener('mouseleave', onLeave);
    };
  }, [strength, radius, rawX, rawY]);

  return { ref, x, y };
}
