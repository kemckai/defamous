// In-page shim for the subset of the chrome.* extension API that
// content.js and popup.js use. This lets us exercise the same source
// file that ships to real browsers without loading it as a signed
// extension. Install BEFORE content.js runs.
(function installMockChrome() {
  if (window.chrome && window.chrome.storage) return;

  const store = { sync: {}, local: {} };
  const listeners = [];

  function clone(value) {
    return value === undefined ? undefined : JSON.parse(JSON.stringify(value));
  }

  function normalizeKeys(keys) {
    if (keys == null) return null;
    if (typeof keys === 'string') return [keys];
    if (Array.isArray(keys)) return keys.slice();
    if (typeof keys === 'object') return Object.keys(keys);
    return null;
  }

  function makeArea(areaName) {
    return {
      get(keys, callback) {
        const result = {};
        const area = store[areaName];
        const keyList = normalizeKeys(keys);
        if (keyList === null) {
          for (const k of Object.keys(area)) result[k] = clone(area[k]);
        } else {
          for (const k of keyList) {
            if (Object.prototype.hasOwnProperty.call(area, k)) {
              result[k] = clone(area[k]);
            } else if (keys && typeof keys === 'object' && !Array.isArray(keys)) {
              result[k] = clone(keys[k]);
            }
          }
        }
        if (typeof callback === 'function') {
          Promise.resolve().then(() => callback(result));
          return undefined;
        }
        return Promise.resolve(result);
      },
      set(items, callback) {
        const area = store[areaName];
        const changes = {};
        for (const k of Object.keys(items)) {
          changes[k] = { oldValue: clone(area[k]), newValue: clone(items[k]) };
          area[k] = clone(items[k]);
        }
        const run = () => {
          for (const l of listeners) {
            try { l(changes, areaName); } catch (_) {}
          }
          if (typeof callback === 'function') callback();
        };
        Promise.resolve().then(run);
        return typeof callback === 'function' ? undefined : Promise.resolve();
      },
      remove(keys, callback) {
        const area = store[areaName];
        const keyList = Array.isArray(keys) ? keys : [keys];
        const changes = {};
        for (const k of keyList) {
          if (Object.prototype.hasOwnProperty.call(area, k)) {
            changes[k] = { oldValue: clone(area[k]), newValue: undefined };
            delete area[k];
          }
        }
        Promise.resolve().then(() => {
          for (const l of listeners) {
            try { l(changes, areaName); } catch (_) {}
          }
          if (typeof callback === 'function') callback();
        });
        return typeof callback === 'function' ? undefined : Promise.resolve();
      },
    };
  }

  window.chrome = {
    storage: {
      sync: makeArea('sync'),
      local: makeArea('local'),
      onChanged: {
        addListener(fn) {
          if (typeof fn === 'function') listeners.push(fn);
        },
        removeListener(fn) {
          const i = listeners.indexOf(fn);
          if (i >= 0) listeners.splice(i, 1);
        },
      },
    },
    runtime: {
      id: 'defamous-test',
      lastError: null,
    },
  };

  window.__defamousTestHooks = {
    seedSettings(settings) {
      store.sync.filterSettings = clone(settings);
    },
    updateSettings(partial) {
      const prev = clone(store.sync.filterSettings) || {};
      const next = Object.assign({}, prev, partial);
      store.sync.filterSettings = next;
      const changes = { filterSettings: { oldValue: prev, newValue: next } };
      for (const l of listeners) {
        try { l(changes, 'sync'); } catch (_) {}
      }
    },
    getSettings() {
      return clone(store.sync.filterSettings);
    },
  };
})();
