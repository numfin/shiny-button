export function createRAFLoop(fn: () => void) {
  let stopped = false;
  const delayedFn = () => {
    if (stopped) return;
    fn();
    window.requestAnimationFrame(delayedFn);
  };
  window.requestAnimationFrame(delayedFn);
  return () => {
    stopped = true;
  };
}
