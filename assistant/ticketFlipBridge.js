let flipHandler = null;

export function registerTicketFlipHandler(handler) {
  flipHandler = handler;
}

export function unregisterTicketFlipHandler(handler) {
  if (!handler || flipHandler === handler) {
    flipHandler = null;
  }
}

export function triggerTicketFlip() {
  if (typeof flipHandler === 'function') {
    flipHandler();
    return true;
  }
  return false;
}
