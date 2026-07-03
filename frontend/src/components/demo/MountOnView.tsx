"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

export function MountOnView({
  children,
  enabled,
  minHeight = 260,
}: {
  children: ReactNode;
  enabled: boolean;
  minHeight?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(!enabled);

  useEffect(() => {
    if (!enabled) return;
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setMounted(true);
          io.disconnect();
        }
      },
      { threshold: 0.35 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [enabled]);

  if (!enabled) return <>{children}</>;

  return (
    <div ref={ref} style={{ minHeight: mounted ? undefined : minHeight }}>
      {mounted ? <div className="hero-enter">{children}</div> : null}
    </div>
  );
}
