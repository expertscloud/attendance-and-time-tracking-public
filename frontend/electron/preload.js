import { contextBridge, ipcRenderer } from 'electron';

// We wrap each renderer listener so the `event` arg from electron is hidden.
// To make `off(channel, listener)` actually remove the registration, we track
// the wrapper created for each (channel, listener) pair.
const wrappers = new Map();
const keyFor = (channel, listener) => `${channel}::${listener}`;

contextBridge.exposeInMainWorld('ipcRenderer', {
  on(channel, listener) {
    const wrapper = (event, ...rest) => listener(event, ...rest);
    wrappers.set(keyFor(channel, listener), wrapper);
    return ipcRenderer.on(channel, wrapper);
  },
  once(channel, listener) {
    return ipcRenderer.once(channel, (event, ...rest) => listener(event, ...rest));
  },
  off(channel, listener) {
    if (!listener) return ipcRenderer.removeAllListeners(channel);
    const key = keyFor(channel, listener);
    const wrapper = wrappers.get(key);
    if (wrapper) {
      ipcRenderer.off(channel, wrapper);
      wrappers.delete(key);
    }
  },
  send(channel, ...args) {
    return ipcRenderer.send(channel, ...args);
  },
  invoke(channel, ...args) {
    return ipcRenderer.invoke(channel, ...args);
  },
});
