global.__DEV__ = true;

// React 19: act() must be enabled explicitly in test environments, and the
// test renderer no longer commits renders scheduled outside act(). The shim
// below wraps create/update/unmount in act() once, so the existing suites
// keep their pre-19 synchronous style.
global.IS_REACT_ACT_ENVIRONMENT = true;

const TestRenderer = require('react-test-renderer');
const { act } = TestRenderer;
const originalCreate = TestRenderer.create;

TestRenderer.create = (...args) => {
  let renderer;
  act(() => {
    renderer = originalCreate(...args);
  });

  const originalUpdate = renderer.update.bind(renderer);
  renderer.update = (element) =>
    act(() => {
      originalUpdate(element);
    });

  const originalUnmount = renderer.unmount.bind(renderer);
  renderer.unmount = () =>
    act(() => {
      originalUnmount();
    });

  return renderer;
};
