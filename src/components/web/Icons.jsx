import React from 'react';
import { ICONS, ICON_NAMES } from '../icons/paths';

export { ICON_NAMES };

/**
 * BreakFree web icon component — renders the shared registry
 * (src/components/icons/paths.js) as inline stroke SVG.
 *
 * Icons inherit `currentColor`, so color them by setting `color` on the
 * icon itself or on any ancestor. Usage:
 *
 *   <Icon name="headphones" size={18} />
 *   <Icon name="heart" size={16} filled color="#C9961A" />
 */
export default function Icon({
  name,
  size = 18,
  color = 'currentColor',
  strokeWidth = 2,
  filled = false,
  style,
  ...rest
}) {
  const shapes = ICONS[name];
  if (!shapes) return null;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill={filled ? color : 'none'}
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      style={{ display: 'block', flexShrink: 0, ...style }}
      {...rest}
    >
      {shapes.map((s, i) => {
        if (s.d) return <path key={i} d={s.d} />;
        if (s.circle) return <circle key={i} cx={s.circle[0]} cy={s.circle[1]} r={s.circle[2]} />;
        if (s.rect)
          return (
            <rect
              key={i}
              x={s.rect[0]}
              y={s.rect[1]}
              width={s.rect[2]}
              height={s.rect[3]}
              rx={s.rect[4] || 0}
            />
          );
        return null;
      })}
    </svg>
  );
}
