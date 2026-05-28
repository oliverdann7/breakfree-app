import React from 'react';
import TestRenderer from 'react-test-renderer';
import Button from '../../components/common/Button';

describe('Button', () => {
  it('renders with title text', () => {
    const renderer = TestRenderer.create(<Button title="Giriş Yap" />);
    const root = renderer.root;
    const text = root.findByType('Text');
    expect(text.props.children).toBe('Giriş Yap');
  });

  it('fires onPress when pressed', () => {
    const onPress = jest.fn();
    const renderer = TestRenderer.create(<Button title="Giriş Yap" onPress={onPress} />);
    const touchable = renderer.root.findByType('TouchableOpacity');
    touchable.props.onPress();
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('passes disabled prop when disabled', () => {
    const onPress = jest.fn();
    const renderer = TestRenderer.create(<Button title="Giriş Yap" onPress={onPress} disabled />);
    const touchable = renderer.root.findByType('TouchableOpacity');
    expect(touchable.props.disabled).toBe(true);
  });

  it('shows ActivityIndicator when loading', () => {
    const renderer = TestRenderer.create(<Button title="Giriş Yap" loading />);
    const indicator = renderer.root.findByType('ActivityIndicator');
    expect(indicator).toBeTruthy();
  });

  it('does not render title text when loading', () => {
    const renderer = TestRenderer.create(<Button title="Giriş Yap" loading />);
    const texts = renderer.root.findAllByType('Text');
    expect(texts.length).toBe(0);
  });

  it('renders all variants without crash', () => {
    const variants = ['primary', 'secondary', 'outline', 'ghost'];
    variants.forEach((variant) => {
      const renderer = TestRenderer.create(<Button title={variant} variant={variant} />);
      const text = renderer.root.findByType('Text');
      expect(text.props.children).toBe(variant);
    });
  });
});
