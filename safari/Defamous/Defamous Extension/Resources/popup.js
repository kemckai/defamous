// Popup script for settings management. Preferences stay in chrome.storage.

const DEFAULTS = {
  hideKnownPublicFigures: true,
  hideAboutPublicFigures: true,
  hidePublicFigureLabels: true,
  blockedNames: '',
  hideVerified: false,
  hideHighEngagement: false,
  engagementThreshold: 10000,
  hideTrending: false,
  hideSharedFromPages: false,
  hideSharedFromGroups: false
};

const toggles = {
  known: document.getElementById('toggleKnown'),
  about: document.getElementById('toggleAbout'),
  labels: document.getElementById('toggleLabels'),
  verified: document.getElementById('toggleVerified'),
  highEngagement: document.getElementById('toggleHighEngagement'),
  sharedFromPages: document.getElementById('toggleSharedFromPages'),
  sharedFromGroups: document.getElementById('toggleSharedFromGroups'),
  trending: document.getElementById('toggleTrending')
};

const engagementInput = document.getElementById('engagementThreshold');
const blockedInput = document.getElementById('blockedNames');
const statusDiv = document.getElementById('status');

chrome.storage.sync.get('filterSettings', (result) => {
  const saved = result.filterSettings || {};
  const settings = Object.assign({}, DEFAULTS, saved);
  if (saved.hideKnownPublicFigures === undefined && saved.hidePublicFigures !== undefined) {
    settings.hideKnownPublicFigures = saved.hidePublicFigures;
  }
  if (saved.hideAboutPublicFigures === undefined && saved.filterSharedCelebrityContent !== undefined) {
    settings.hideAboutPublicFigures = saved.filterSharedCelebrityContent;
  }
  if (Array.isArray(settings.blockedNames)) settings.blockedNames = settings.blockedNames.join('\n');

  setToggleState(toggles.known, settings.hideKnownPublicFigures);
  setToggleState(toggles.about, settings.hideAboutPublicFigures);
  setToggleState(toggles.labels, settings.hidePublicFigureLabels);
  setToggleState(toggles.verified, settings.hideVerified);
  setToggleState(toggles.highEngagement, settings.hideHighEngagement);
  setToggleState(toggles.sharedFromPages, settings.hideSharedFromPages);
  setToggleState(toggles.sharedFromGroups, settings.hideSharedFromGroups);
  setToggleState(toggles.trending, settings.hideTrending);
  engagementInput.value = settings.engagementThreshold;
  blockedInput.value = settings.blockedNames || '';
});

toggles.known.addEventListener('click', () => toggleSetting('hideKnownPublicFigures', toggles.known));
toggles.about.addEventListener('click', () => toggleSetting('hideAboutPublicFigures', toggles.about));
toggles.labels.addEventListener('click', () => toggleSetting('hidePublicFigureLabels', toggles.labels));
toggles.verified.addEventListener('click', () => toggleSetting('hideVerified', toggles.verified));
toggles.highEngagement.addEventListener('click', () => toggleSetting('hideHighEngagement', toggles.highEngagement));
toggles.sharedFromPages.addEventListener('click', () => toggleSetting('hideSharedFromPages', toggles.sharedFromPages));
toggles.sharedFromGroups.addEventListener('click', () => toggleSetting('hideSharedFromGroups', toggles.sharedFromGroups));
toggles.trending.addEventListener('click', () => toggleSetting('hideTrending', toggles.trending));

engagementInput.addEventListener('change', () => {
  const value = parseInt(engagementInput.value, 10);
  if (!isNaN(value) && value >= 0) {
    saveSetting('engagementThreshold', value);
    showStatus('Engagement threshold updated');
  }
});

blockedInput.addEventListener('change', () => {
  saveSetting('blockedNames', blockedInput.value);
  showStatus('Blocked names updated');
});

function setToggleState(toggle, isActive) {
  if (isActive) toggle.classList.add('active');
  else toggle.classList.remove('active');
}

function toggleSetting(settingKey, toggleElement) {
  const newState = !toggleElement.classList.contains('active');
  setToggleState(toggleElement, newState);
  saveSetting(settingKey, newState);
  showStatus('Setting updated');
}

function saveSetting(key, value) {
  chrome.storage.sync.get('filterSettings', (result) => {
    const settings = Object.assign({}, DEFAULTS, result.filterSettings || {});
    settings[key] = value;
    if (key === 'hideKnownPublicFigures') settings.hidePublicFigures = value;
    if (key === 'hideAboutPublicFigures') settings.filterSharedCelebrityContent = value;
    chrome.storage.sync.set({ filterSettings: settings });
  });
}

function showStatus(message) {
  statusDiv.textContent = message;
  setTimeout(() => {
    statusDiv.textContent = 'Settings saved automatically';
  }, 2000);
}
