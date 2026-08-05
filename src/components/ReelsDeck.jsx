"use client";
import React, { useMemo, useRef, useState, useCallback, useEffect } from "react";
import { useSprings, animated, to as interpolate } from "@react-spring/web";
import { useDrag } from "react-use-gesture";

/* ------------------------------------------------------------------ */
/*  Small inline icons (no extra dependency)                          */
/* ------------------------------------------------------------------ */

const IconHeart = (p) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" {...p}>
    <path d="M12 20s-7-4.35-9.5-8.8C.7 7.9 2 4.5 5.4 4c2-.3 3.6.7 4.6 2.2C11 4.7 12.6 3.7 14.6 4c3.4.5 4.7 3.9 2.9 7.2C19 15.65 12 20 12 20Z" />
  </svg>
);
const IconX = (p) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" {...p}>
    <path d="M6 6l12 12M18 6L6 18" />
  </svg>
);
const IconUndo = (p) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" {...p}>
    <path d="M9 14 4 9l5-5" />
    <path d="M4 9h10a6 6 0 0 1 6 6v1" />
  </svg>
);
const IconArrow = (p) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...p}>
    <path d="M5 12h14M12 5l7 7-7 7" />
  </svg>
);

/* ------------------------------------------------------------------ */
/*  Stack geometry — depth 0 is the front (active) card               */
/* ------------------------------------------------------------------ */

const MAX_VISIBLE_DEPTH = 3;

const restStyle = (depth) => ({
  x: 0,
  y: depth * 14,
  scale: 1 - depth * 0.055,
  rot: depth === 0 ? 0 : (depth % 2 === 0 ? 1 : -1) * (2 + depth * 1.5),
  opacity: depth < MAX_VISIBLE_DEPTH ? 1 - depth * 0.22 : 0,
  delay: 0,
});

const enterStyle = () => ({ x: 0, y: -420, scale: 0.9, rot: 0, opacity: 0 });

const trans = (r, s) =>
  `perspective(1600px) rotateX(6deg) rotateZ(${r}deg) scale(${s})`;

export default function ReelsDeck({ reels = [], onIndexChange, onSwipe }) {
  const count = reels.length;

  // order[0] = index of the card currently on top of the stack
  const [order, setOrder] = useState(() => Array.from({ length: count }, (_, i) => i));
  const historyRef = useRef([]); // for undo
  const draggingRef = useRef(false);
  const [dragX, setDragX] = useState(0);

  const [springs, api] = useSprings(count, (i) => ({
    ...restStyle(i),
    from: enterStyle(),
  }));

  const layout = useCallback(
    (ord, animateEntry) => {
      api.start((i) => {
        const depth = ord.indexOf(i);
        const s = restStyle(depth < 0 ? MAX_VISIBLE_DEPTH + 1 : depth);
        return {
          ...s,
          config: { friction: 42, tension: 340 },
          delay: animateEntry ? depth * 45 : 0,
        };
      });
    },
    [api]
  );

  useEffect(() => {
    layout(order, false);
    if (onIndexChange) onIndexChange(order[0] ?? -1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const advance = useCallback(
    (dir) => {
      setOrder((prev) => {
        if (prev.length === 0) return prev;
        const [top, ...rest] = prev;
        historyRef.current.push(top);
        const next = rest;
        layout(next, false);
        if (onSwipe) onSwipe(top, dir);
        if (onIndexChange) onIndexChange(next[0] ?? -1);
        return next;
      });
      setDragX(0);
    },
    [layout, onIndexChange, onSwipe]
  );

  const undo = useCallback(() => {
    const last = historyRef.current.pop();
    if (last === undefined) return;
    setOrder((prev) => {
      const next = [last, ...prev];
      api.start((i) => {
        if (i !== last) return undefined;
        return { from: enterStyle(), ...restStyle(0), config: { friction: 42, tension: 340 } };
      });
      layout(next, false);
      if (onIndexChange) onIndexChange(next[0] ?? -1);
      return next;
    });
  }, [api, layout, onIndexChange]);

  const restart = useCallback(() => {
    historyRef.current = [];
    const fresh = Array.from({ length: count }, (_, i) => i);
    setOrder(fresh);
    layout(fresh, true);
    if (onIndexChange) onIndexChange(fresh[0] ?? -1);
  }, [count, layout, onIndexChange]);

  const bind = useDrag(({ active, movement: [mx], direction: [xDir], velocity, first, last }) => {
    const topIndex = order[0];
    if (topIndex === undefined) return;
    if (first) draggingRef.current = true;
    if (active) setDragX(mx);

    const trigger = velocity > 0.22 && Math.abs(mx) > 60;
    const dir = xDir < 0 ? -1 : 1;

    api.start((i) => {
      if (i !== topIndex) return undefined;
      if (!active && trigger) {
        return {
          x: (window.innerWidth + 300) * dir,
          rot: dir * 16,
          opacity: 0,
          scale: 0.94,
          config: { friction: 46, tension: 260 },
        };
      }
      return {
        x: active ? mx : 0,
        rot: active ? mx / 22 : 0,
        scale: active ? 1.03 : 1,
        config: { friction: 46, tension: active ? 800 : 420 },
      };
    });

    if (last) {
      draggingRef.current = false;
      if (trigger) {
        advance(dir);
      } else {
        setDragX(0);
      }
    }
  });

  const stackedOrder = useMemo(() => order.slice(0, MAX_VISIBLE_DEPTH + 1), [order]);
  const isEmpty = order.length === 0;
  const total = count;
  const seen = total - order.length;

  const stampOpacity = Math.min(Math.abs(dragX) / 90, 1);
  const stampSide = dragX > 0 ? "save" : "skip";

  return (
    <div className="reels-wrap">
      <style>{CSS}</style>

      {/* progress */}
      {!isEmpty && (
        <div className="reels-progress">
          <span className="reels-progress-count">
            {String(seen + 1).padStart(2, "0")} <em>/ {String(total).padStart(2, "0")}</em>
          </span>
          <div className="reels-progress-track">
            <div
              className="reels-progress-fill"
              style={{ width: `${(seen / Math.max(total, 1)) * 100}%` }}
            />
          </div>
        </div>
      )}

      <div className="reels-stage">
        {isEmpty ? (
          <div className="reels-empty">
            <span className="reels-empty-rule" />
            <p className="reels-empty-eyebrow">All Caught Up</p>
            <h4 className="reels-empty-title">You've seen every reel</h4>
            <button type="button" className="reels-replay" onClick={restart}>
              <IconUndo className="reels-replay-icon" />
              Watch again
            </button>
          </div>
        ) : (
          springs.map(({ x, y, rot, scale, opacity }, i) => {
            const depth = stackedOrder.indexOf(i);
            if (depth === -1) return null;
            const isTop = depth === 0;
            return (
              <animated.div
                className="reels-card-shell"
                key={i}
                style={{ x, y, opacity, zIndex: count - depth }}
              >
                <animated.div
                  {...(isTop ? bind() : {})}
                  className={`reels-card ${isTop ? "is-top" : ""}`}
                  style={{ transform: interpolate([rot, scale], trans) }}
                >
                  {reels[i].type === "instagram" ? (
                    <iframe
                      src={reels[i].url}
                      className="reels-media"
                      scrolling="no"
                      allowTransparency={true}
                      allow="encrypted-media"
                      tabIndex={-1}
                    />
                  ) : (
                    <video
                      autoPlay={isTop}
                      loop
                      muted
                      playsInline
                      controls
                      className="reels-media reels-media--video"
                    >
                      <source src={reels[i].url} type="video/mp4" />
                    </video>
                  )}

                  <div className="reels-media-shade" />
                  <div className="reels-border" />

                  {isTop && (
                    <>
                      <div
                        className={`reels-stamp reels-stamp--save`}
                        style={{ opacity: dragX > 0 ? stampOpacity : 0 }}
                      >
                        <IconHeart className="reels-stamp-icon" /> Save
                      </div>
                      <div
                        className={`reels-stamp reels-stamp--skip`}
                        style={{ opacity: dragX < 0 ? stampOpacity : 0 }}
                      >
                        <IconX className="reels-stamp-icon" /> Skip
                      </div>
                    </>
                  )}

                  <div className="reels-top-handle" />
                  <div className="reels-bottom">
                    <div className="reels-bottom-inner">
                      <div className="reels-tag">
                        <span className="reels-tag-rule" />
                        <span className="reels-tag-label">Featured Reel</span>
                      </div>
                      <h3 className="reels-title">{reels[i].title}</h3>
                      {isTop && (
                        <div className="reels-hint">
                          <span>Swipe to explore</span>
                          <IconArrow className="reels-hint-icon" />
                        </div>
                      )}
                    </div>
                  </div>
                </animated.div>
              </animated.div>
            );
          })
        )}
      </div>

      {/* controls */}
      {!isEmpty && (
        <div className="reels-controls">
          <button
            type="button"
            className="reels-btn reels-btn--ghost"
            onClick={undo}
            disabled={historyRef.current.length === 0}
            aria-label="Undo last swipe"
          >
            <IconUndo className="reels-btn-icon" />
          </button>
          <button
            type="button"
            className="reels-btn reels-btn--skip"
            onClick={() => advance(-1)}
            aria-label="Skip"
          >
            <IconX className="reels-btn-icon" />
          </button>
          <button
            type="button"
            className="reels-btn reels-btn--save"
            onClick={() => advance(1)}
            aria-label="Save"
          >
            <IconHeart className="reels-btn-icon" />
          </button>
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Styles                                                             */
/* ------------------------------------------------------------------ */

const CSS = `
  .reels-wrap {
    position: relative;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 1.75rem;
    font-family: 'SFMono-Regular', ui-monospace, 'IBM Plex Mono', Menlo, monospace;
  }

  .reels-progress {
    width: 280px;
    max-width: 90%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
  }
  .reels-progress-count {
    color: #f5f3ee;
    font-size: 0.72rem;
    letter-spacing: 0.15em;
    white-space: nowrap;
  }
  .reels-progress-count em {
    font-style: normal;
    color: rgba(245,243,238,0.4);
  }
  .reels-progress-track {
    flex: 1;
    height: 1px;
    background: rgba(245,243,238,0.12);
    position: relative;
  }
  .reels-progress-fill {
    position: absolute;
    top: 0; left: 0; height: 100%;
    background: #c8a97a;
    box-shadow: 0 0 8px rgba(200,169,122,0.7);
    transition: width 0.5s cubic-bezier(0.16,1,0.3,1);
  }

  .reels-stage {
    position: relative;
    width: 280px;
    height: 500px;
  }
  @media (min-width: 768px) {
    .reels-stage { width: 320px; height: 570px; }
  }
  @media (min-width: 1280px) {
    .reels-stage { width: 360px; height: 640px; }
  }

  .reels-card-shell {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    touch-action: none;
    will-change: transform;
  }

  .reels-card {
    position: relative;
    width: 100%;
    height: 100%;
    background: #0c0c0b;
    border-radius: 22px;
    overflow: hidden;
    box-shadow:
      0 30px 70px -15px rgba(0,0,0,0.55),
      0 10px 24px -12px rgba(0,0,0,0.45);
    will-change: transform;
    touch-action: none;
  }
  .reels-card.is-top { cursor: grab; }
  .reels-card.is-top:active { cursor: grabbing; }

  .reels-media {
    width: 100%; height: 100%;
    border: none;
    background: #111110;
    object-fit: cover;
  }
  .reels-media--video { display: block; }

  .reels-media-shade {
    position: absolute; inset: 0;
    background: linear-gradient(to top, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.08) 38%, rgba(0,0,0,0) 60%);
    pointer-events: none;
  }
  .reels-border {
    position: absolute; inset: 0;
    border-radius: 22px;
    border: 1px solid rgba(245,243,238,0.1);
    box-shadow: inset 0 0 60px rgba(0,0,0,0.2);
    pointer-events: none;
  }

  .reels-top-handle {
    position: absolute; top: 0; left: 0; right: 0; height: 88px;
    z-index: 3;
  }

  .reels-bottom {
    position: absolute; left: 0; right: 0; bottom: 0;
    padding: 1.75rem 1.6rem;
    z-index: 4;
  }
  .reels-bottom-inner { display: flex; flex-direction: column; gap: 0.6rem; }

  .reels-tag { display: flex; align-items: center; gap: 0.65rem; opacity: 0.85; }
  .reels-tag-rule { width: 22px; height: 1px; background: #c8a97a; }
  .reels-tag-label {
    color: #c8a97a;
    font-size: 0.62rem;
    letter-spacing: 0.24em;
    text-transform: uppercase;
    font-weight: 700;
  }
  .reels-title {
    font-family: Georgia, 'Iowan Old Style', 'Palatino Linotype', serif;
    font-weight: 400;
    font-size: 1.5rem;
    line-height: 1.3;
    color: #f5f3ee;
    margin: 0;
  }
  .reels-hint {
    display: flex; align-items: center; gap: 0.5rem;
    margin-top: 0.3rem;
    color: rgba(245,243,238,0.55);
    font-size: 0.62rem;
    letter-spacing: 0.18em;
    text-transform: uppercase;
  }
  .reels-hint-icon { width: 11px; height: 11px; }

  .reels-stamp {
    position: absolute;
    top: 2rem;
    display: flex;
    align-items: center;
    gap: 0.4rem;
    padding: 0.5rem 0.9rem;
    border-radius: 999px;
    font-size: 0.68rem;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    font-weight: 700;
    z-index: 5;
    pointer-events: none;
    backdrop-filter: blur(4px);
  }
  .reels-stamp--save {
    left: 1.5rem;
    color: #e8cfa0;
    border: 1.5px solid #c8a97a;
    background: rgba(200,169,122,0.12);
    transform: rotate(-8deg);
  }
  .reels-stamp--skip {
    right: 1.5rem;
    color: #f5f3ee;
    border: 1.5px solid rgba(245,243,238,0.6);
    background: rgba(20,20,20,0.35);
    transform: rotate(8deg);
  }
  .reels-stamp-icon { width: 13px; height: 13px; }

  .reels-controls {
    display: flex;
    align-items: center;
    gap: 1.1rem;
  }
  .reels-btn {
    display: flex; align-items: center; justify-content: center;
    border-radius: 999px;
    border: 1px solid rgba(245,243,238,0.14);
    background: rgba(245,243,238,0.03);
    color: #f5f3ee;
    cursor: pointer;
    transition: transform 0.25s cubic-bezier(0.34,1.56,0.64,1), border-color 0.25s ease, background 0.25s ease, opacity 0.25s ease;
  }
  .reels-btn:hover { transform: translateY(-2px); border-color: rgba(200,169,122,0.5); }
  .reels-btn:active { transform: translateY(0) scale(0.94); }
  .reels-btn:disabled { opacity: 0.3; cursor: not-allowed; transform: none; }

  .reels-btn--ghost { width: 42px; height: 42px; }
  .reels-btn--ghost .reels-btn-icon { width: 16px; height: 16px; }

  .reels-btn--skip, .reels-btn--save { width: 58px; height: 58px; }
  .reels-btn--skip { color: #f5f3ee; }
  .reels-btn--skip:hover { background: rgba(245,243,238,0.06); }
  .reels-btn--save { color: #e8cfa0; border-color: rgba(200,169,122,0.4); }
  .reels-btn--save:hover { background: rgba(200,169,122,0.12); border-color: #c8a97a; }
  .reels-btn--skip .reels-btn-icon, .reels-btn--save .reels-btn-icon { width: 20px; height: 20px; }

  .reels-empty {
    display: flex; flex-direction: column; align-items: center;
    text-align: center;
    padding: 2rem;
  }
  .reels-empty-rule {
    width: 1px; height: 44px;
    background: linear-gradient(to bottom, rgba(200,169,122,0), rgba(200,169,122,0.7));
    margin-bottom: 1.5rem;
  }
  .reels-empty-eyebrow {
    color: #c8a97a;
    font-size: 0.65rem;
    letter-spacing: 0.28em;
    text-transform: uppercase;
    margin: 0 0 0.9rem;
  }
  .reels-empty-title {
    font-family: Georgia, serif;
    font-weight: 400;
    font-size: 1.4rem;
    color: #f5f3ee;
    margin: 0 0 1.75rem;
  }
  .reels-replay {
    display: flex; align-items: center; gap: 0.6rem;
    padding: 0.75rem 1.4rem;
    border-radius: 999px;
    border: 1px solid rgba(200,169,122,0.4);
    background: rgba(200,169,122,0.08);
    color: #e8cfa0;
    font-size: 0.68rem;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    cursor: pointer;
    transition: background 0.25s ease, transform 0.25s ease;
  }
  .reels-replay:hover { background: rgba(200,169,122,0.16); transform: translateY(-2px); }
  .reels-replay-icon { width: 13px; height: 13px; }

  @media (prefers-reduced-motion: reduce) {
    .reels-card-shell, .reels-card, .reels-btn, .reels-progress-fill { transition: none !important; }
  }
`;