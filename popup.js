// Popup script for settings management

const toggles = {
  verified: document.getElementById('toggleVerified'),
  publicFigures: document.getElementById('togglePublicFigures'),
  brandPages: document.getElementById('toggleBrandPages'),
  trending: document.getElementById('toggleTrending'),
  highEngagement: document.getElementById('toggleHighEngagement'),
  sharedFromPages: document.getElementById('toggleSharedFromPages'),
  sharedFromGroups: document.getElementById('toggleSharedFromGroups'),
  sharedCelebrityContent: document.getElementById('toggleSharedCelebrityContent')
};

const engagementInput = document.getElementById('engagementThreshold');
const statusDiv = document.getElementById('status');

// Load current settings
chrome.storage.sync.get('filterSettings', (result) => {
  const settings = result.filterSettings || {
    hideVerified: true,
    hidePublicFigures: true,
    hideHighEngagement: true,
    engagementThreshold: 10000,
    hideBrandPages: true,
    hideTrending: true,
    hideSharedFromPages: true,
    hideSharedFromGroups: true,
    filterSharedCelebrityContent: true
  };
  
  // Set toggle states
  setToggleState(toggles.verified, settings.hideVerified);
  setToggleState(toggles.publicFigures, settings.hidePublicFigures);
  setToggleState(toggles.brandPages, settings.hideBrandPages);
  setToggleState(toggles.trending, settings.hideTrending);
  setToggleState(toggles.highEngagement, settings.hideHighEngagement);
  setToggleState(toggles.sharedFromPages, settings.hideSharedFromPages);
  setToggleState(toggles.sharedFromGroups, settings.hideSharedFromGroups);
  setToggleState(toggles.sharedCelebrityContent, settings.filterSharedCelebrityContent);
  
  // Set engagement threshold
  engagementInput.value = settings.engagementThreshold || 10000;
});

// Toggle click handlers
toggles.verified.addEventListener('click', () => {
  toggleSetting('hideVerified', toggles.verified);
});

toggles.publicFigures.addEventListener('click', () => {
  toggleSetting('hidePublicFigures', toggles.publicFigures);
});

toggles.brandPages.addEventListener('click', () => {
  toggleSetting('hideBrandPages', toggles.brandPages);
});

toggles.trending.addEventListener('click', () => {
  toggleSetting('hideTrending', toggles.trending);
});

toggles.highEngagement.addEventListener('click', () => {
  toggleSetting('hideHighEngagement', toggles.highEngagement);
});

toggles.sharedFromPages.addEventListener('click', () => {
  toggleSetting('hideSharedFromPages', toggles.sharedFromPages);
});

toggles.sharedFromGroups.addEventListener('click', () => {
  toggleSetting('hideSharedFromGroups', toggles.sharedFromGroups);
});

toggles.sharedCelebrityContent.addEventListener('click', () => {
  toggleSetting('filterSharedCelebrityContent', toggles.sharedCelebrityContent);
});

// Engagement threshold change handler
engagementInput.addEventListener('change', () => {
  const value = parseInt(engagementInput.value, 10);
  if (!isNaN(value) && value >= 0) {
    saveSetting('engagementThreshold', value);
    showStatus('Engagement threshold updated');
  }
});

function setToggleState(toggle, isActive) {
  if (isActive) {
    toggle.classList.add('active');
  } else {
    toggle.classList.remove('active');
  }
}

function toggleSetting(settingKey, toggleElement) {
  const isActive = toggleElement.classList.contains('active');
  const newState = !isActive;
  
  setToggleState(toggleElement, newState);
  saveSetting(settingKey, newState);
  showStatus('Setting updated');
}

function saveSetting(key, value) {
  chrome.storage.sync.get('filterSettings', (result) => {
    const settings = result.filterSettings || {};
    settings[key] = value;
    
    chrome.storage.sync.set({ filterSettings: settings }, () => {
      // Settings saved
    });
  });
}

function showStatus(message) {
  statusDiv.textContent = message;
  setTimeout(() => {
    statusDiv.textContent = 'Settings saved automatically';
  }, 2000);
}

