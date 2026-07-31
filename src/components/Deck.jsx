"use client";
import React, { useState } from 'react';
import { useSprings, animated, to as interpolate } from '@react-spring/web';
import { useDrag } from 'react-use-gesture';
import Image from 'next/image';

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

export default function Deck({ cards = [], onIndexChange }) {
  const [gone] = useState(() => new Set());
  const [props, api] = useSprings(cards.length, i => ({
    ...to(i),
    from: from(i),
  }));

  const bind = useDrag(({ args: [index], down, movement: [mx], direction: [xDir], velocity }) => {
    const trigger = velocity > 0.2;
    const dir = xDir < 0 ? -1 : 1;
    if (!down && trigger) {
      gone.add(index);
      // Calculate the new active index
      let newActiveIndex = -1;
      for (let i = cards.length - 1; i >= 0; i--) {
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
    
    if (!down && gone.size === cards.length)
      setTimeout(() => {
        gone.clear();
        api.start(i => to(i));
        if (onIndexChange) onIndexChange(cards.length - 1);
      }, 600);
  });

  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-visible">
      {props.map(({ x, y, rot, scale }, i) => (
        <animated.div className="absolute flex items-center justify-center touch-none w-[300px] h-[400px] md:w-[450px] md:h-[600px] xl:w-[500px] xl:h-[700px]" key={i} style={{ x, y }}>
          <animated.div
            {...bind(i)}
            className="w-full h-full bg-white rounded-2xl shadow-[0_20px_60px_-10px_rgba(50,50,73,0.3),0_10px_20px_-10px_rgba(50,50,73,0.2)] bg-cover bg-center bg-no-repeat will-change-transform touch-none cursor-grab active:cursor-grabbing border-8 md:border-[12px] border-white"
            style={{
              transform: interpolate([rot, scale], trans),
              backgroundImage: `url(${cards[i].image || cards[i]})`,
            }}
          />
        </animated.div>
      ))}
    </div>
  );
}
