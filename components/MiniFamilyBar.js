"use client";

import { useEffect, useMemo, useRef, useState } from "react";

export function MiniFamilyBar({
  scrollRef,
  familyStarts,
  familyCount = 11,
  height = 12,
  familyColors = [],
}) {
  const barRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const starts = useMemo(() => {
    const arr = Array.isArray(familyStarts) ? familyStarts.slice(0, familyCount) : [];
    while (arr.length < familyCount) arr.push(arr[arr.length - 1] ?? 0);
    return arr;
  }, [familyStarts, familyCount]);

  const nearestIndex = (scrollLeft) => {
    let best = 0;
    let bestDist = Infinity;
    for (let i = 0; i < starts.length; i++) {
      const d = Math.abs((scrollLeft ?? 0) - starts[i]);
      if (d < bestDist) {
        bestDist = d;
        best = i;
      }
    }
    return best;
  };

  useEffect(() => {
    const el = scrollRef?.current;
    if (!el) return;

    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        setActiveIndex(nearestIndex(el.scrollLeft));
      });
    };

    el.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener("scroll", onScroll);
    };
  }, [scrollRef, starts.join("|")]);

  const jumpTo = (idx) => {
    const el = scrollRef?.current;
    if (!el) return;
    el.scrollTo({ left: starts[idx] ?? 0, behavior: "smooth" });
    setActiveIndex(idx);
  };

  const [lensRect, setLensRect] = useState({ left: 0, width: 0 });

useEffect(() => {
  const el = barRef.current;
  if (!el) return;

  const measure = () => {
    const cell = el.querySelector(`[data-cell="${activeIndex}"]`);
    if (!cell) return; // 找不到就保留上一次的 rect，避免“框消失”
    setLensRect({
      left: cell.offsetLeft,
      width: cell.offsetWidth,
    });
  };

  // 立即测一次 + 下一帧再测一次（确保 DOM 已布局）
  measure();
  requestAnimationFrame(measure);

  // resize 时也要重测（你宽度是 90%/1/3 屏幕会变）
  const ro = new ResizeObserver(() => measure());
  ro.observe(el);

  return () => ro.disconnect();
}, [activeIndex]);



return (
  <div className="w-full flex justify-center">
    <div
      ref={barRef}
      className="relative"
      style={{height,
      width: "90%",
      minWidth: "240px",   // 防止太窄（重要）
      maxWidth: "420px",}}
      aria-label="Family quick navigation"
    >
      {/* 11 个独立胶囊色块（有间隔） */}
      <div data-track="1"className="absolute inset-0 flex gap-1">
        {Array.from({ length: familyCount }).map((_, i) => (
          <button
            key={i}
            data-cell={i}
            type="button"
            onClick={() => jumpTo(i)}
            className="h-full flex-1 rounded-full cursor-pointer select-none"
            style={{ background: familyColors[i] ?? "#666" }}
            aria-label={`Jump to family ${i + 1}`}
          />
        ))}
      </div>
      
      <div
       className="pointer-events-none absolute top-0 h-full rounded-full border-2 border-white"
       style={{
       left: `${lensRect.left}px`,
       width: `${lensRect.width}px`,
 }}
      />
    </div>
  </div>
);
}