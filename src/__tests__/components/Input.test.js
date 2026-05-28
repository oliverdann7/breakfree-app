import React from 'react';
import TestRenderer from 'react-test-renderer';
import Input from '../../components/common/Input';

describe('Input', () => {
  it('renders with label', () => {
    const renderer = TestRenderer.create(<Input label="E-posta" />);
    const text = renderer.root.findByType('Text');
    expect(text.props.children).toBe('E-posta');
  });

  it('renders placeholder text', () => {
    const renderer = TestRenderer.create(<Input placeholder="ornek@email.com" />);
    const textInput = renderer.root.findByType('TextInput');
    expect(textInput.props.placeholder).toBe('ornek@email.com');
  });

  it('calls onChangeText when text changes', () => {
    const onChangeText = jest.fn();
    const renderer = TestRenderer.create(
      <Input placeholder="E-posta" onChangeText={onChangeText} />
    );
    const textInput = renderer.root.findByType('TextInput');
    textInput.props.onChangeText('test@test.com');
    expect(onChangeText).toHaveBeenCalledWith('test@test.com');
  });

  it('displays error text', () => {
    const renderer = TestRenderer.create(<Input label="E-posta" error="Geçersiz e-posta" />);
    const texts = renderer.root.findAllByType('Text');
    const errorText = texts.find((t) => t.props.children === 'Geçersiz e-posta');
    expect(errorText).toBeTruthy();
  });

  it('renders without label', () => {
    const renderer = TestRenderer.create(<Input placeholder="placeholder" />);
    const textInput = renderer.root.findByType('TextInput');
    expect(textInput.props.placeholder).toBe('placeholder');
  });

  it('accepts keyboardType prop', () => {
    const renderer = TestRenderer.create(
      <Input placeholder="E-posta" keyboardType="email-address" />
    );
    const textInput = renderer.root.findByType('TextInput');
    expect(textInput.props.keyboardType).toBe('email-address');
  });

  it('accepts secureTextEntry prop', () => {
    const renderer = TestRenderer.create(<Input placeholder="Şifre" secureTextEntry />);
    const textInput = renderer.root.findByType('TextInput');
    expect(textInput.props.secureTextEntry).toBe(true);
  });
});
