import React from 'react';
import TestRenderer, { act } from 'react-test-renderer';
import { ToastHost, showToast } from '../../components/common/Toast';

const textsOf = (renderer) =>
  renderer.root
    .findAllByType('Text')
    .map((n) => (Array.isArray(n.props.children) ? n.props.children.join('') : n.props.children));

describe('Toast', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('renders nothing until a toast is shown', () => {
    const renderer = TestRenderer.create(<ToastHost />);
    expect(renderer.toJSON()).toBeNull();
  });

  it('shows the message and auto-hides', () => {
    const renderer = TestRenderer.create(<ToastHost />);
    act(() => {
      showToast('Kaydedilemedi');
    });
    expect(textsOf(renderer)).toContain('Kaydedilemedi');

    // The auto-hide timeout clears the toast directly (there is no fade-out
    // animation to wait for).
    act(() => {
      jest.advanceTimersByTime(10000);
    });
    expect(renderer.toJSON()).toBeNull();
  });

  it('renders the action button and invokes onAction once tapped', () => {
    const onAction = jest.fn();
    const renderer = TestRenderer.create(<ToastHost />);
    act(() => {
      showToast('Kaydedilemedi', { actionLabel: 'Tekrar Dene', onAction });
    });
    expect(textsOf(renderer)).toContain('Tekrar Dene');

    const button = renderer.root
      .findAllByType('TouchableOpacity')
      .find((btn) => btn.findAllByType('Text').some((n) => n.props.children === 'Tekrar Dene'));
    act(() => {
      button.props.onPress();
    });
    expect(onAction).toHaveBeenCalledTimes(1);
    expect(renderer.toJSON()).toBeNull();
  });

  it('replaces the current toast when a new one arrives', () => {
    const renderer = TestRenderer.create(<ToastHost />);
    act(() => {
      showToast('İlk mesaj');
    });
    act(() => {
      showToast('İkinci mesaj');
    });
    const texts = textsOf(renderer);
    expect(texts).toContain('İkinci mesaj');
    expect(texts).not.toContain('İlk mesaj');
  });
});
