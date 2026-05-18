import React from 'react';
import { View, Image, StyleSheet } from 'react-native';

export default function BreakFreeLogo({ variant = 'full', size = 'medium', style }) {
  const isWeb = typeof document !== 'undefined';

  const sizes = {
    small: 80,
    medium: 120,
    large: 180,
    xlarge: 240,
  };

  const logoHeight = sizes[size];
  const logoWidth = logoHeight * 2.88; // 759.6 / 263.7 aspect ratio

  if (isWeb && variant === 'full') {
    return (
      <svg
        width={logoWidth}
        height={logoHeight}
        viewBox="0 0 759.6 263.7"
        style={{ ...styles.svg, ...style }}
      >
        <defs>
          <style>{`
            .logo-gold { fill: #C9961A; }
            .logo-blue { fill: #0072B0; }
            .logo-text { font-family: 'BaskervilleDisplayPT-Regular', serif; font-size: 93.8px; }
          `}</style>
        </defs>

        {/* "BREAK" text in blue */}
        <text x="65.9" y="176.2" className="logo-blue logo-text">
          BREAK
        </text>

        {/* Symbol */}
        <g>
          {/* Blue paths */}
          <path
            className="logo-blue"
            d="M467.1,112.6c-23.8-35.8-85.4,9.4-61.6-82.3c-10.1,20.2-16.7,42.2-19,65.5c3.5,13.7,10.8,27,19.3,37.7 c1.4,1.8,2.9,3.6,4.6,5.4c8.5,9.3,18,16.3,26.6,20.1c2.4,1,4.7,1.8,6.8,2.2c-12.1-10.7-33.8-39.8-20.2-52.7 C432,100.5,450.4,101.5,467.1,112.6L467.1,112.6z M393.2,166.6c6.1,20.7,15.7,40.1,28.3,57.5c-5.4-13.7-9.2-28.1-11.2-43 c-4.2-3.2-8.5-6.6-12.7-10.3C396.1,169.4,394.6,168,393.2,166.6L393.2,166.6z"
          />
          <path
            className="logo-blue"
            d="M419.6,53.6c6.6,0,12,5.4,12,12c0,6.7-5.4,12.1-12,12.1c-6.7,0-12.1-5.4-12.1-12.1 C407.5,59,412.9,53.6,419.6,53.6L419.6,53.6z"
          />
        </g>

        {/* Gold paths */}
        <g>
          <path
            className="logo-gold"
            d="M440.6,108.9c1.3,1.2,2.4,2.5,3.7,3.8c21,23.1,28.2,49.6,16.1,59.2c-34,26.8-128.1-85.4-64.1-128.8 c-33.7,26.7-14.9,74.5,9,100.8c17.8,19.7,40.1,29.3,49.8,21.7c9.7-7.7,3.2-29.8-14.7-49.4c-2.5-2.7-5.1-5.2-7.7-7.6 c2.2-0.3,4.4-0.3,6.9,0.1C439.9,108.8,440.2,108.8,440.6,108.9L440.6,108.9z"
          />
          <path
            className="logo-gold"
            d="M370.3,81.6c-1.3,0.8-2.6,1.7-3.7,2.8c-15.6,15-1.4,51.3,31.7,81c46.8,42.1,98,45.1,87.3,5.1 c1,6.7-1.5,12.7-5.2,16.3c-12,11.9-45.6-0.6-75.1-27.7c-27.4-25.3-41.6-54.5-33.9-67.9C370.7,88,370.4,84.8,370.3,81.6L370.3,81.6z "
          />
        </g>
        <path
          className="logo-gold"
          d="M474.6,232.2c-22.7-9.1-92-5.5-113.7,6C393.9,216.7,439.5,214.3,474.6,232.2L474.6,232.2z"
        />

        {/* "FREE" text in gold */}
        <text x="360.3" y="176.0" className="logo-gold logo-text">
          {' '}
          FREE
        </text>
      </svg>
    );
  }

  if (isWeb && variant === 'symbol') {
    return (
      <svg
        width={logoHeight}
        height={logoHeight}
        viewBox="0 0 178.9 263.7"
        style={{ ...styles.svg, ...style }}
      >
        <defs>
          <style>{`
            .symbol-blue { fill: #0072B0; }
            .symbol-gold { fill: #C9961A; }
          `}</style>
        </defs>
        <g>
          <path
            className="symbol-blue"
            d="M136.7,112.6c-23.8-35.8-85.4,9.4-61.6-82.3C65,50.5,58.4,72.5,56.1,95.8c3.5,13.7,10.8,27,19.3,37.7 c1.4,1.8,2.9,3.6,4.6,5.4c8.5,9.3,18,16.3,26.6,20.1c2.4,1,4.7,1.8,6.8,2.2c-12.1-10.7-33.8-39.8-20.2-52.7 C101.6,100.5,120,101.5,136.7,112.6L136.7,112.6z M62.8,166.6c6.1,20.7,15.7,40.1,28.3,57.5c-5.4-13.7-9.2-28.1-11.2-43 c-4.2-3.2-8.5-6.6-12.7-10.3C65.7,169.4,64.2,168,62.8,166.6L62.8,166.6z"
          />
          <path
            className="symbol-blue"
            d="M89.2,53.6c6.6,0,12,5.4,12,12c0,6.7-5.4,12.1-12,12.1c-6.7,0-12.1-5.4-12.1-12.1C77.1,59,82.5,53.6,89.2,53.6 L89.2,53.6z"
          />
        </g>
        <g>
          <path
            className="symbol-gold"
            d="M110.1,108.9c1.3,1.2,2.4,2.5,3.7,3.8c21,23.1,28.2,49.6,16.1,59.2C95.9,198.7,1.8,86.6,65.8,43.1 c-33.7,26.7-14.9,74.5,9,100.8c17.8,19.7,40.1,29.3,49.8,21.7c9.7-7.7,3.2-29.8-14.7-49.4c-2.5-2.7-5.1-5.2-7.7-7.6 c2.2-0.3,4.4-0.3,6.9,0.1C109.5,108.8,109.8,108.8,110.1,108.9L110.1,108.9z"
          />
          <path
            className="symbol-gold"
            d="M39.8,81.6c-1.3,0.8-2.6,1.7-3.7,2.8c-15.6,15-1.4,51.3,31.7,81c46.8,42.1,98,45.1,87.3,5.1 c1,6.7-1.5,12.7-5.2,16.3c-12,11.9-45.6-0.6-75.1-27.7c-27.4-25.3-41.6-54.5-33.9-67.9C40.3,88,40,84.8,39.8,81.6L39.8,81.6z"
          />
        </g>
        <path
          className="symbol-gold"
          d="M144.1,232.2c-22.7-9.1-92-5.5-113.7,6C63.5,216.7,109.1,214.3,144.1,232.2L144.1,232.2z"
        />
      </svg>
    );
  }

  // Native fallback with PNG
  return (
    <View style={[styles.container, style]}>
      <Image
        source={require('../../assets/breakfree-logo.png')}
        style={{
          width: logoWidth,
          height: logoHeight,
          resizeMode: 'contain',
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  svg: {
    display: 'block',
  },
});
