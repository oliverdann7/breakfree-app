import React from 'react';
import TestRenderer from 'react-test-renderer';
import Icon, { ICON_NAMES } from '../../components/common/Icon';

describe('native Icon (react-native-svg)', () => {
  it('renders an Svg for every registered icon name', () => {
    expect(ICON_NAMES.length).toBeGreaterThan(50);
    for (const name of ICON_NAMES) {
      const tree = TestRenderer.create(<Icon name={name} />).toJSON();
      expect(tree.type).toBe('Svg');
      expect(tree.children.length).toBeGreaterThan(0);
    }
  });

  it('renders nothing for an unknown name', () => {
    expect(TestRenderer.create(<Icon name="nope" />).toJSON()).toBeNull();
  });

  it('applies size, color and fill', () => {
    const tree = TestRenderer.create(
      <Icon name="heart" size={32} color="#C9961A" filled />
    ).toJSON();
    expect(tree.props.width).toBe(32);
    expect(tree.props.height).toBe(32);
    expect(tree.props.stroke).toBe('#C9961A');
    expect(tree.props.fill).toBe('#C9961A');
  });
});
