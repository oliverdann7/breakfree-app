import React from 'react';
import TestRenderer from 'react-test-renderer';
import { Text } from 'react-native';
import Card from '../../components/common/Card';

describe('Card', () => {
  it('renders children', () => {
    const renderer = TestRenderer.create(
      <Card>
        <Text>Wellness içeriği</Text>
      </Card>
    );
    const text = renderer.root.findByType('Text');
    expect(text.props.children).toBe('Wellness içeriği');
  });

  it('renders all variants without crash', () => {
    const variants = ['default', 'elevated', 'glass', 'cyanAccent', 'goldAccent', 'greenAccent'];
    variants.forEach((variant) => {
      const renderer = TestRenderer.create(
        <Card variant={variant}>
          <Text>{variant}</Text>
        </Card>
      );
      const text = renderer.root.findByType('Text');
      expect(text.props.children).toBe(variant);
    });
  });

  it('applies custom style', () => {
    const renderer = TestRenderer.create(
      <Card style={{ marginTop: 20 }}>
        <Text>Styled</Text>
      </Card>
    );
    const text = renderer.root.findByType('Text');
    expect(text.props.children).toBe('Styled');
  });
});
