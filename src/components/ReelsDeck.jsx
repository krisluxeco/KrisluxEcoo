"use client";
import React, { useState } from 'react';
import { useSprings, animated, to as interpolate } from '@react-spring/web';
import { useDrag } from 'react-use-gesture';

const to = (i) => ({
  x: 0,
  y: i * -4,
  scale: 1,
  rot: -10 + Math.random() * 20,
  delay: i * 100,
});
const from = (_i) => ({ x: 0, rot: 0, scale: 1.5, y: -1000 });
const trans = (r, s) =>
  `perspective(1500px) rotateX(30deg) rotateY(${r / 10}deg) rotateZ(${r}deg) scale(${s})`;

export default function ReelsDeck({ reels = [], onIndexChange }) {
  const [gone] = useState(() => new Set());
  const [swipedKeys, setSwipedKeys] = useState(new Set());
  const [props, api] = useSprings(reels.length, i => ({
    ...to(i),
    from: from(i),
  }));

  const bind = useDrag(({ args: [index], down, movement: [mx], direction: [xDir], velocity }) => {
    const trigger = velocity > 0.2;
    const dir = xDir < 0 ? -1 : 1;
    if (!down && trigger) {
      gone.add(index);
      setSwipedKeys(new Set(gone));
      let newActiveIndex = -1;
      for (let i = reels.length - 1; i >= 0; i--) {
        if (!gone.has(i)) {
          newActiveIndex = i;
          break;
        }
      }
      if (onIndexChange) onIndexChange(newActiveIndex);
    }
    
    api.start(i => {
      if (index !== i) return;
      const isGone = gone.has(index);
      const x = isGone ? (200 + window.innerWidth) * dir : down ? mx : 0;
      const rot = mx / 100 + (isGone ? dir * 10 * velocity : 0);
      const scale = down ? 1.1 : 1;
      return {
        x,
        rot,
        scale,
        delay: undefined,
        config: { friction: 50, tension: down ? 800 : isGone ? 200 : 500 },
      };
    });
    
    if (!down && gone.size === reels.length)
      setTimeout(() => {
        gone.clear();
        setSwipedKeys(new Set());
        api.start(i => to(i));
        if (onIndexChange) onIndexChange(reels.length - 1);
      }, 600);
  });

  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-visible">
      {props.map(({ x, y, rot, scale }, i) => (
        <animated.div className="absolute flex items-center justify-center touch-none w-[280px] h-[500px] md:w-[320px] md:h-[570px] xl:w-[360px] xl:h-[640px]" key={i} style={{ x, y }}>
          <animated.div
            {...bind(i)}
            className="relative w-full h-full bg-white rounded-3xl shadow-[0_20px_60px_-10px_rgba(50,50,73,0.3),0_10px_20px_-10px_rgba(50,50,73,0.2)] overflow-hidden will-change-transform touch-none cursor-grab active:cursor-grabbing"
            style={{
              transform: interpolate([rot, scale], trans),
            }}
          >
            {reels[i].type === "instagram" ? (
              <>
                <iframe
                  key={swipedKeys.has(i) ? "gone" : "active"}
                  src={reels[i].url}
                  className="w-full h-full border-none bg-[#FAF7F2]"
                  scrolling="no"
                  allowTransparency={true}
                  allow="encrypted-media"
                ></iframe>
              </>
            ) : (
              <div className="w-full h-full relative bg-[#FAF7F2]">
                <video key={swipedKeys.has(i) ? "gone" : "active"} autoPlay loop muted playsInline controls className="w-full h-full object-cover">
                  <source src={reels[i].url} type="video/mp4" />
                </video>
              </div>
            )}
            
            {/* Top Drag Handle */}
            <div className="absolute top-0 left-0 right-0 h-24 z-10 bg-transparent cursor-grab active:cursor-grabbing" />
            
            {/* Elegant Inner Shadow & Border Overlay */}
            <div className="absolute inset-0 pointer-events-none border border-white/10 rounded-3xl shadow-[inset_0_0_60px_rgba(0,0,0,0.15)] z-10" />

            {/* Bottom Drag Handle & Elegant Title Area */}
            <div className="absolute bottom-0 left-0 right-0 h-40 z-20 cursor-grab active:cursor-grabbing flex flex-col justify-end p-8 bg-gradient-to-t from-black/90 via-black/40 to-transparent">
              <div className="pointer-events-none flex flex-col gap-2">
                <div className="flex items-center gap-3 opacity-80">
                  <span className="w-6 h-[1px] bg-[#C8A97A]" />
                  <span className="text-[#C8A97A] text-[9px] tracking-[0.2em] uppercase font-bold">Featured Reel</span>
                </div>
                <h3 className="text-white text-2xl md:text-3xl font-light leading-snug" style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}>
                  {reels[i].title}
                </h3>
                <div className="flex items-center gap-2 mt-2 opacity-60">
                  <span className="text-white text-[10px] tracking-widest uppercase">Swipe to explore</span>
                  <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                </div>
              </div>
            </div>
          </animated.div>
        </animated.div>
      ))}
    </div>
  );
}
