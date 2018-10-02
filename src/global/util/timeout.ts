export interface ResetableTimeout {
  destroy: () => void;
  reset: () => void;
}

export const resetableTimeout = (
  callback: () => void,
  time: number,
): ResetableTimeout => {
  let destroyed = false;

  const timeoutTriggered = () => {
    destroyed = true;
    callback();
  };

  let timeout = setTimeout(timeoutTriggered, time);

  const destroy = () => {
    if (!destroyed) {
      destroyed = true;
      clearTimeout(timeout);
    }
  };

  const reset = () => {
    if (!destroyed) {
      clearTimeout(timeout);
    }
    destroyed = false;
    timeout = setTimeout(timeoutTriggered, time);
  };

  return {
    destroy,
    reset,
  };
};
