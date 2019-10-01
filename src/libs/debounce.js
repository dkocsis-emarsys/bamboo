const debounce = fn => {
  let timeout;

  return function() {
    const context = this;
    const args = arguments;

    if (timeout) {
      window.cancelAnimationFrame(timeout);
    }

    timeout = window.requestAnimationFrame(() => {
      fn.apply(context, args);
    });
  }
};

export default debounce;
