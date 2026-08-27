// Jest mock for react-native-svg: render plain host components so
// react-test-renderer trees stay inspectable without native bindings.
const React = require('react');

const host = (name) => {
  const C = (props) => React.createElement(name, props, props.children);
  C.displayName = name;
  return C;
};

const Svg = host('Svg');

module.exports = {
  __esModule: true,
  default: Svg,
  Svg,
  Path: host('Path'),
  Circle: host('Circle'),
  Rect: host('Rect'),
  G: host('G'),
  Line: host('Line'),
  Polygon: host('Polygon'),
  Polyline: host('Polyline'),
  Defs: host('Defs'),
  LinearGradient: host('LinearGradient'),
  Stop: host('Stop'),
  Text: host('SvgText'),
};
