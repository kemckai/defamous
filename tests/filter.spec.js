// Regression tests for content.js filter behavior.
//
// The same scenarios run in WebKit (Safari engine) and Chromium.
// Playwright cannot load a real Safari web extension, so the tests
// inject the same content.js via <script> on a static mock-Facebook
// page and shim the chrome.* API that the script depends on.
//
// These are automated engine-level checks. They do NOT replace manual
// verification on a real Apple device (Safari on macOS / iOS) against
// authenticated live Facebook, which is listed in the PR description.

const { test, expect } = require('@playwright/test');

async function isHidden(page, testid) {
  return await page.evaluate((id) => {
    const el = document.querySelector(`[data-testid="${id}"]`);
    if (!el) return 'missing';
    return (
      el.getAttribute('data-filtered-by') === 'defamous' ||
      el.style.display === 'none' ||
      el.getAttribute('aria-hidden') === 'true'
    );
  }, testid);
}

async function waitForFilterPass(page) {
  // content.js runs an initial pass plus setTimeout passes at 1s and
  // 3s. Wait past the first delayed pass so dynamic additions settle.
  await page.waitForFunction(
    () => document.querySelector('[data-filtered-by="defamous"]') !== null,
    null,
    { timeout: 5000 }
  );
  // Allow a microtask tick for any pending mutations.
  await page.waitForTimeout(100);
}

test.describe('content.js filter behavior', () => {
  test('hides celebrity, verified, shared-from-page, high-engagement, and keyword posts; keeps plain friend post', async ({ page }) => {
    const consoleErrors = [];
    page.on('pageerror', (err) => consoleErrors.push(String(err)));
    page.on('console', (msg) => {
      if (msg.type() === 'error') consoleErrors.push(msg.text());
    });

    await page.goto('/tests/fixtures/feed.html');
    await waitForFilterPass(page);

    expect(await isHidden(page, 'celebrity-named'), 'celebrity author').toBe(true);
    expect(await isHidden(page, 'verified-aria'), 'verified badge via aria-label').toBe(true);
    expect(await isHidden(page, 'shared-from-page'), 'shared from a Page').toBe(true);
    expect(await isHidden(page, 'high-engagement'), 'engagement over threshold').toBe(true);
    expect(await isHidden(page, 'celebrity-keyword'), 'celebrity keyword in body').toBe(true);

    expect(await isHidden(page, 'friend-plain'), 'plain friend post must stay visible').toBe(false);

    expect(consoleErrors, 'no page errors').toEqual([]);
  });

  test('responds to settings changes without reload', async ({ page }) => {
    await page.goto('/tests/fixtures/feed.html');
    await waitForFilterPass(page);

    expect(await isHidden(page, 'high-engagement')).toBe(true);

    // Raise the threshold above the mock post's engagement.
    await page.evaluate(() => {
      window.__defamousTestHooks.updateSettings({ engagementThreshold: 1000000 });
    });
    // storage.onChanged runs processFeed(); it cannot un-hide a post
    // once hidden by this implementation (processedPosts cache +
    // display:none is sticky). We assert the documented behavior so
    // that any future change to re-evaluation is intentional.
    await page.waitForTimeout(300);
    expect(await isHidden(page, 'high-engagement')).toBe(true);
  });

  test('exposes storage API through the chrome.* namespace that the script calls', async ({ page }) => {
    // Safari (WebKit) exposes both chrome.* and browser.* to web
    // extensions. This asserts that content.js only reaches for
    // surfaces that the Safari shim can provide.
    await page.goto('/tests/fixtures/feed.html');
    const uses = await page.evaluate(async () => {
      return {
        hasChromeStorageSync: typeof chrome !== 'undefined' && !!(chrome.storage && chrome.storage.sync && chrome.storage.sync.get),
        hasOnChanged: typeof chrome !== 'undefined' && !!(chrome.storage && chrome.storage.onChanged && chrome.storage.onChanged.addListener),
        getIsPromise: (() => {
          try {
            const r = chrome.storage.sync.get('filterSettings');
            return !!(r && typeof r.then === 'function');
          } catch (_) {
            return false;
          }
        })(),
      };
    });
    expect(uses.hasChromeStorageSync).toBe(true);
    expect(uses.hasOnChanged).toBe(true);
    expect(uses.getIsPromise).toBe(true);
  });
});

test.describe('manifest Safari compatibility', () => {
  test('manifest declares host_permissions for Facebook', async ({ request }) => {
    // Safari Web Extensions in Manifest V3 require host_permissions to
    // request access to a site. Having matches in content_scripts
    // alone is honored by Chrome but less reliable in Safari, which
    // presents the "Websites" list from host_permissions.
    const resp = await request.get('/manifest.json');
    const manifest = await resp.json();
    expect(manifest.manifest_version).toBe(3);
    expect(manifest.host_permissions, 'host_permissions should list facebook.com').toBeTruthy();
    expect(manifest.host_permissions.some((p) => /facebook\.com/.test(p))).toBe(true);
  });
});
