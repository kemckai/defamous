// Packaging checks for the checked-in Safari wrapper.
// These do not invoke xcodebuild and do not touch a running Safari.
const { test } = require('node:test');
const assert = require('node:assert/strict');
const { spawnSync } = require('node:child_process');
const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.resolve(__dirname, '..', '..');
const PBX = path.join(ROOT, 'safari/Defamous/Defamous.xcodeproj/project.pbxproj');
const RESOURCES = path.join(ROOT, 'safari/Defamous/Defamous Extension/Resources');
const ALLOWED = [
  'content.js',
  'icon128.png',
  'icon16.png',
  'icon48.png',
  'manifest.json',
  'popup.html',
  'popup.js',
];

function read(rel) {
  return fs.readFileSync(path.join(ROOT, rel), 'utf8');
}

function sha(file) {
  return crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
}

test('sync copies only the canonical extension files and is idempotent', () => {
  const stray = path.join(RESOURCES, 'SHOULD_NOT_SHIP.txt');
  fs.writeFileSync(stray, 'converter junk');
  const first = spawnSync('bash', ['safari/sync-extension-resources.sh'], {
    cwd: ROOT,
    encoding: 'utf8',
  });
  assert.equal(first.status, 0, first.stderr);
  assert.equal(fs.existsSync(stray), false);
  const names = fs.readdirSync(RESOURCES).sort();
  assert.deepEqual(names, [...ALLOWED].sort());
  const hashes = Object.fromEntries(names.map((name) => [name, sha(path.join(RESOURCES, name))]));
  for (const name of ALLOWED) {
    assert.equal(hashes[name], sha(path.join(ROOT, name)), name);
  }
  const second = spawnSync('bash', ['safari/sync-extension-resources.sh'], {
    cwd: ROOT,
    encoding: 'utf8',
  });
  assert.equal(second.status, 0, second.stderr);
  for (const name of ALLOWED) {
    assert.equal(sha(path.join(RESOURCES, name)), hashes[name]);
  }
});

test('bundled manifest keeps Facebook host_permissions', () => {
  const manifest = JSON.parse(fs.readFileSync(path.join(RESOURCES, 'manifest.json'), 'utf8'));
  assert.equal(manifest.manifest_version, 3);
  assert.ok(manifest.host_permissions.some((entry) => entry.includes('facebook.com')));
  assert.deepEqual(
    manifest,
    JSON.parse(fs.readFileSync(path.join(ROOT, 'manifest.json'), 'utf8'))
  );
});

test('bundle identifiers match the parent app and are not the old lowercase id', () => {
  const pbx = read('safari/Defamous/Defamous.xcodeproj/project.pbxproj');
  const ids = [...pbx.matchAll(/PRODUCT_BUNDLE_IDENTIFIER = ([^;]+);/g)].map((m) => m[1]);
  assert.deepEqual(ids, [
    'com.kemckai.Defamous.Extension',
    'com.kemckai.Defamous.Extension',
    'com.kemckai.Defamous',
    'com.kemckai.Defamous',
  ]);
  assert.equal(pbx.includes('com.kemckai.defamous'), false);
  const swift = read('safari/Defamous/Defamous/ViewController.swift');
  assert.match(swift, /let extensionBundleIdentifier = "com\.kemckai\.Defamous\.Extension"/);
});

test('extension resource phase lists only the synced web files', () => {
  const pbx = read('safari/Defamous/Defamous.xcodeproj/project.pbxproj');
  const phase = pbx.split('04345266309E91EE00C49917 /* Resources */ = {')[1].split('runOnlyForDeploymentPostprocessing')[0];
  const files = [...phase.matchAll(/\/\* ([^*]+) in Resources \*\//g)].map((m) => m[1]).sort();
  assert.deepEqual(files, [...ALLOWED].sort());
  for (const banned of ['tests', 'package.json', 'README.md', 'store-listing.txt', 'privacy-policy.html']) {
    assert.equal(phase.includes(banned), false, banned);
  }
  assert.match(pbx, /sync-extension-resources\.sh/);
});

test('shared scheme builds the Defamous app', () => {
  const scheme = read('safari/Defamous/Defamous.xcodeproj/xcshareddata/xcschemes/Defamous.xcscheme');
  assert.match(scheme, /BuildableName = "Defamous\.app"/);
  assert.match(scheme, /BlueprintIdentifier = "0434524C309E91EA00C49917"/);
  assert.match(scheme, /BlueprintName = "Defamous"/);
});

test('signing is configurable and no team, key, or profile is committed', () => {
  const signing = read('safari/Defamous/Signing.xcconfig');
  assert.match(signing, /^DEVELOPMENT_TEAM =[ \t]*$/m);
  assert.match(signing, /#include\? "Local\.xcconfig"/);
  const example = read('safari/Defamous/Local.xcconfig.example');
  assert.match(example, /DEVELOPMENT_TEAM = YOUR_TEAM_ID/);
  assert.equal(/^\s*DEVELOPMENT_TEAM = [A-Z0-9]{10}\s*$/m.test(example), false);
  assert.equal(fs.existsSync(path.join(ROOT, 'safari/Defamous/Local.xcconfig')), false);

  const gitignore = read('.gitignore');
  for (const line of [
    'safari/Defamous/Local.xcconfig',
    'DerivedData/',
    'safari/DerivedData/',
    'safari/build/',
    '**/xcuserdata/',
    '*.xcuserstate',
    '*.app',
    '*.appex',
    '*.p12',
    '*.cer',
    '*.mobileprovision',
    '*.provisionprofile',
    '*.xcarchive',
  ]) {
    assert.ok(gitignore.includes(line), line);
  }

  const pbx = read('safari/Defamous/Defamous.xcodeproj/project.pbxproj');
  assert.equal(/DEVELOPMENT_TEAM = [A-Z0-9]{10}/.test(pbx), false);
  assert.match(pbx, /baseConfigurationReference = A1SIGN01309E91F000C49917/);

  const buildScript = read('safari/build-mac.sh');
  assert.match(buildScript, /xcodebuild/);
  assert.match(buildScript, /-scheme "\$SCHEME"/);
  assert.match(buildScript, /CODE_SIGN_IDENTITY=-/);
  assert.equal(/DEVELOPMENT_TEAM=[A-Z0-9]{10}/.test(buildScript), false);
  assert.match(buildScript, /--sync-only/);

  const offenders = [];
  const textExt = new Set(['.swift', '.plist', '.pbxproj', '.xcconfig', '.sh', '.md', '.json', '.html', '.js', '.css', '.storyboard', '.xcscheme', '.example']);
  function walkChecked(dir, rel) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      if (entry.name === 'node_modules' || entry.name === '.git' || entry.name === 'DerivedData' || entry.name === 'build') continue;
      const childRel = rel ? `${rel}/${entry.name}` : entry.name;
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        if (entry.name === 'xcuserdata') offenders.push(childRel);
        else walkChecked(full, childRel);
        continue;
      }
      if (/\.(p12|cer|mobileprovision|provisionprofile|xcuserstate)$/i.test(entry.name) || entry.name.endsWith('.xcarchive')) {
        offenders.push(childRel);
      }
      if (entry.name === 'Local.xcconfig') offenders.push(childRel);
      if (!textExt.has(path.extname(entry.name))) continue;
      const text = fs.readFileSync(full, 'utf8');
      if (text.includes('BEGIN PRIVATE KEY') || text.includes('BEGIN CERTIFICATE') || text.includes('BEGIN RSA PRIVATE KEY')) {
        offenders.push(childRel);
      }
    }
  }
  walkChecked(path.join(ROOT, 'safari'), 'safari');
  assert.deepEqual(offenders, []);
});

test('build script sync-only succeeds without xcodebuild', () => {
  const result = spawnSync('bash', ['safari/build-mac.sh', '--sync-only'], {
    cwd: ROOT,
    encoding: 'utf8',
  });
  assert.equal(result.status, 0, result.stderr);
});

test('a full build reports that xcodebuild is absent instead of succeeding', () => {
  const probe = spawnSync('bash', ['-lc', 'command -v xcodebuild'], { encoding: 'utf8' });
  if (probe.status === 0) {
    // A Mac with Xcode can compile. This cloud environment cannot, so the
    // assertion below only runs where xcodebuild is missing.
    return;
  }
  const result = spawnSync('bash', ['safari/build-mac.sh'], {
    cwd: ROOT,
    encoding: 'utf8',
  });
  assert.equal(result.status, 2);
  assert.match(result.stderr, /xcodebuild is not available/);
});
