// Filter behavior in WebKit (Safari's engine) and Chromium.
// The page is a mock Facebook DOM. It is not a logged-in Facebook session,
// and Playwright is not Safari on a Mac.

const { test, expect } = require('@playwright/test');

async function isHidden(page, testid) {
  return await page.evaluate((id) => {
    const el = document.querySelector(`[data-testid="${id}"]`);
    if (!el) return 'missing';
    return el.getAttribute('data-filtered-by') === 'defamous';
  }, testid);
}

async function waitReady(page) {
  await page.waitForFunction(() => document.documentElement.dataset.defamousReady);
}

async function waitHidden(page, testid, hidden) {
  await page.waitForFunction(({ id, want }) => {
    const el = document.querySelector(`[data-testid="${id}"]`);
    if (!el) return false;
    return (el.getAttribute('data-filtered-by') === 'defamous') === want;
  }, { id: testid, want: hidden });
}

test.describe('public-figure filter', () => {
  test('hides authors, subjects, shares, photos, and labels; keeps ordinary posts', async ({ page }) => {
    const errors = [];
    page.on('pageerror', (err) => errors.push(String(err)));

    await page.goto('/tests/fixtures/feed.html');
    await waitReady(page);

    const hidden = [
      'celebrity-author',
      'about-celebrity',
      'friend-named-adele',
      'shared-celebrity',
      'nested-share',
      'photo-of-celebrity',
      'public-figure-label',
      'coverage-phrase',
      'swap-target'
    ];
    for (const id of hidden) {
      expect(await isHidden(page, id), id).toBe(true);
    }

    const visible = [
      'friend-plain',
      'friend-high-engagement',
      'friend-verified',
      'friend-ordinary-words',
      'friend-famous-recipe',
      'comment-mention',
      'bakery-page',
      'neighborhood-group',
      'block-target'
    ];
    for (const id of visible) {
      expect(await isHidden(page, id), id).toBe(false);
    }
    expect(errors).toEqual([]);
  });

  test('defaults do not treat a badge or a like count as fame', async ({ page }) => {
    await page.goto('/tests/fixtures/feed-defaults.html');
    await waitHidden(page, 'default-celebrity', true);
    expect(await isHidden(page, 'default-verified-friend')).toBe(false);
    expect(await isHidden(page, 'default-popular-friend')).toBe(false);
  });

  test('filters a post inserted into a virtualized feed', async ({ page }) => {
    await page.goto('/tests/fixtures/feed.html');
    await waitReady(page);
    await page.evaluate(() => {
      const article = document.createElement('div');
      article.setAttribute('role', 'article');
      article.dataset.testid = 'inserted-celebrity';
      article.innerHTML = '<a role="link" href="https://www.facebook.com/drake"><span>Drake</span></a><div data-ad-preview="message">New single tonight.</div>';
      document.getElementById('feed').appendChild(article);
    });
    await waitHidden(page, 'inserted-celebrity', true);
  });

  test('rechecks a cell when virtualized content is replaced', async ({ page }) => {
    await page.goto('/tests/fixtures/feed.html');
    await waitHidden(page, 'swap-target', true);
    await page.evaluate(() => {
      const article = document.querySelector('[data-testid="swap-target"]');
      article.innerHTML = '<a role="link" href="https://www.facebook.com/alex.doe"><span>Alex Doe</span></a><div data-ad-preview="message">Back from the hardware store with paint.</div>';
    });
    await waitHidden(page, 'swap-target', false);
  });

  test('hides a post when its message later names a public figure', async ({ page }) => {
    await page.goto('/tests/fixtures/feed.html');
    await waitHidden(page, 'friend-plain', false);
    await page.evaluate(() => {
      const message = document.querySelector('[data-testid="friend-plain"] [data-ad-preview="message"]');
      message.textContent = 'Ran into Taylor Swift at the bookstore.';
    });
    await waitHidden(page, 'friend-plain', true);
  });

  test('applies rule changes to posts already on screen', async ({ page }) => {
    await page.goto('/tests/fixtures/feed.html');
    await waitHidden(page, 'about-celebrity', true);
    await waitHidden(page, 'celebrity-author', true);

    await page.evaluate(() => {
      window.__defamousTestHooks.updateSettings({ hideAboutPublicFigures: false });
    });
    await waitHidden(page, 'about-celebrity', false);
    expect(await isHidden(page, 'celebrity-author')).toBe(true);

    await page.evaluate(() => {
      window.__defamousTestHooks.updateSettings({ hideKnownPublicFigures: false });
    });
    await waitHidden(page, 'celebrity-author', false);

    await page.evaluate(() => {
      window.__defamousTestHooks.updateSettings({
        hideKnownPublicFigures: true,
        hideAboutPublicFigures: true
      });
    });
    await waitHidden(page, 'celebrity-author', true);
    await waitHidden(page, 'about-celebrity', true);
  });

  test('uses the local extra-name list and removes the block when cleared', async ({ page }) => {
    await page.goto('/tests/fixtures/feed.html');
    await waitHidden(page, 'block-target', false);
    await page.evaluate(() => {
      window.__defamousTestHooks.updateSettings({ blockedNames: 'Riley Quinn' });
    });
    await waitHidden(page, 'block-target', true);
    await page.evaluate(() => {
      window.__defamousTestHooks.updateSettings({ blockedNames: '' });
    });
    await waitHidden(page, 'block-target', false);
  });

  test('optional page and engagement switches are reversible', async ({ page }) => {
    await page.goto('/tests/fixtures/feed.html');
    await waitHidden(page, 'bakery-page', false);
    await waitHidden(page, 'friend-high-engagement', false);
    await waitHidden(page, 'friend-verified', false);

    await page.evaluate(() => {
      window.__defamousTestHooks.updateSettings({
        hideSharedFromPages: true,
        hideHighEngagement: true,
        hideVerified: true,
        engagementThreshold: 10000
      });
    });
    await waitHidden(page, 'bakery-page', true);
    await waitHidden(page, 'friend-high-engagement', true);
    await waitHidden(page, 'friend-verified', true);

    await page.evaluate(() => {
      window.__defamousTestHooks.updateSettings({
        hideSharedFromPages: false,
        hideHighEngagement: false,
        hideVerified: false
      });
    });
    await waitHidden(page, 'bakery-page', false);
    await waitHidden(page, 'friend-high-engagement', false);
    await waitHidden(page, 'friend-verified', false);
  });

  test('chrome.storage.sync.get returns a Promise', async ({ page }) => {
    await page.goto('/tests/fixtures/feed.html');
    const uses = await page.evaluate(() => {
      const result = chrome.storage.sync.get('filterSettings');
      return {
        hasGet: !!(chrome.storage && chrome.storage.sync && chrome.storage.sync.get),
        hasOnChanged: !!(chrome.storage.onChanged && chrome.storage.onChanged.addListener),
        getIsPromise: !!(result && typeof result.then === 'function')
      };
    });
    expect(uses).toEqual({ hasGet: true, hasOnChanged: true, getIsPromise: true });
  });
});

test.describe('manifest Safari compatibility', () => {
  test('manifest declares host_permissions for Facebook', async ({ request }) => {
    const manifest = await (await request.get('/manifest.json')).json();
    expect(manifest.manifest_version).toBe(3);
    expect(manifest.host_permissions.some((entry) => /facebook\.com/.test(entry))).toBe(true);
  });
});
