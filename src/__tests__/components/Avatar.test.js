import React from 'react';
import TestRenderer from 'react-test-renderer';
import { Text } from 'react-native';
import Avatar from '../../components/common/Avatar';

describe('Avatar', () => {
  it('renders the provided emoji', () => {
    const renderer = TestRenderer.create(<Avatar emoji="🏃" />);
    const text = renderer.root.findByType(Text);
    expect(text.props.children).toBe('🏃');
  });

  it('falls back to the default emoji', () => {
    const renderer = TestRenderer.create(<Avatar />);
    const text = renderer.root.findByType(Text);
    expect(text.props.children).toBe('🧘');
  });

  it('scales the glyph and container to the given size', () => {
    const renderer = TestRenderer.create(<Avatar size={50} />);
    const text = renderer.root.findByType(Text);
    expect(text.props.style.fontSize).toBe(22);
    const view = renderer.root.findAllByType('View')[0];
    const flat = view.props.style.flat ? view.props.style.flat() : [].concat(...view.props.style);
    expect(flat).toEqual(expect.arrayContaining([expect.objectContaining({ borderRadius: 25 })]));
  });

  it('uses the label as the accessibility label, with a fallback', () => {
    const named = TestRenderer.create(<Avatar label="Ayşe" />);
    expect(named.root.findAllByType('View')[0].props.accessibilityLabel).toBe('Ayşe');

    const fallback = TestRenderer.create(<Avatar />);
    expect(fallback.root.findAllByType('View')[0].props.accessibilityLabel).toBe(
      'Kullanıcı avatarı'
    );
  });
});
