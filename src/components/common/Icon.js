import React from 'react';
import Svg, { Path, Circle, Rect } from 'react-native-svg';
import { ICONS, ICON_NAMES } from '../icons/paths';

export { ICON_NAMES };

/**
 * BreakFree native icon component — renders the shared registry
 * (src/components/icons/paths.js) via react-native-svg. Same API as the web
 * Icon (src/components/web/Icons.jsx):
 *
 *   <Icon name="headphones" size={18} color={colors.cyan} />
 *   <Icon name="heart" size={16} filled color={colors.gold} />
 */
export default function Icon({
  name,
  size = 18,
  color = '#FFFFFF',
  strokeWidth = 2,
  filled = false,
  style,
}) {
  const shapes = ICONS[name];
  if (!shapes) return null;
  return (
    <Svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill={filled ? color : 'none'}
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      style={style}
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
    >
      {shapes.map((s, i) => {
        if (s.d) return <Path key={i} d={s.d} />;
        if (s.circle) return <Circle key={i} cx={s.circle[0]} cy={s.circle[1]} r={s.circle[2]} />;
        if (s.rect)
          return (
            <Rect
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
    </Svg>
  );
}
