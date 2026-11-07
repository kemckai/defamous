// Defamous content script.
// Hides Facebook feed posts by or about public figures, including shares.
// Runs only on the page. Nothing is sent off the device.

class FacebookCelebrityFilter {
  constructor() {
    this.filterSettings = {
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
    this.generation = 0;
    this.decisions = new WeakMap();
    this.timer = null;
    this.observer = null;
    this.knownNames = null;
    this.coveragePhrases = null;
    this.init();
  }

  async init() {
    await this.loadSettings();
    this.observe();
    this.processFeed();
    window.addEventListener('scroll', () => this.schedule(), { passive: true });
    setTimeout(() => this.schedule(), 1000);
    setTimeout(() => this.schedule(), 3000);
  }

  async loadSettings() {
    try {
      const result = await chrome.storage.sync.get('filterSettings');
      this.applySettings(result && result.filterSettings);
    } catch (e) {
      this.applySettings(null);
    }
    if (chrome.storage && chrome.storage.onChanged) {
      chrome.storage.onChanged.addListener((changes) => {
        if (changes.filterSettings) {
          this.applySettings(changes.filterSettings.newValue);
          this.processFeed();
        }
      });
    }
  }

  applySettings(saved) {
    const next = Object.assign({}, this.filterSettings, saved || {});
    if (saved && saved.hidePublicFigures !== undefined && saved.hideKnownPublicFigures === undefined) {
      next.hideKnownPublicFigures = saved.hidePublicFigures;
    }
    if (saved && saved.filterSharedCelebrityContent !== undefined && saved.hideAboutPublicFigures === undefined) {
      next.hideAboutPublicFigures = saved.filterSharedCelebrityContent;
    }
    next.engagementThreshold = this.parseCount(next.engagementThreshold);
    if (!Number.isFinite(next.engagementThreshold) || next.engagementThreshold < 0) {
      next.engagementThreshold = 10000;
    }
    this.filterSettings = next;
    this.generation += 1;
  }

  observe() {
    this.observer = new MutationObserver(() => this.schedule());
    this.observer.observe(document.documentElement, {
      childList: true,
      subtree: true,
      characterData: true
    });
  }

  schedule() {
    if (this.timer) return;
    this.timer = setTimeout(() => {
      this.timer = null;
      this.processFeed();
    }, 50);
  }

  processFeed() {
    const posts = this.feedUnits();
    for (let i = 0; i < posts.length; i++) {
      const post = posts[i];
      if (!post || post.nodeType !== 1) continue;
      const sig = this.signature(post);
      const prev = this.decisions.get(post);
      if (prev && prev.sig === sig && prev.generation === this.generation) continue;
      const hide = this.shouldFilterPost(post);
      this.decisions.set(post, { sig: sig, generation: this.generation, hide: hide });
      if (hide) this.hidePost(post);
      else this.showPost(post);
    }
    document.documentElement.dataset.defamousReady = String(this.generation);
  }

  feedUnits() {
    const feed = document.querySelector('[role="feed"]');
    if (feed) {
      const units = [];
      for (let i = 0; i < feed.children.length; i++) {
        const child = feed.children[i];
        if (!child || child.nodeType !== 1) continue;
        if (child.getAttribute('role') === 'article') {
          units.push(child);
          continue;
        }
        const nested = child.querySelector('[role="article"]');
        units.push(nested || child);
      }
      if (units.length) return units;
    }
    const articles = document.querySelectorAll('[role="article"]');
    const top = [];
    for (let i = 0; i < articles.length; i++) {
      const article = articles[i];
      const parentArticle = article.parentElement && article.parentElement.closest('[role="article"]');
      if (!parentArticle) top.push(article);
    }
    if (top.length) return top;
    return Array.prototype.slice.call(document.querySelectorAll('[data-pagelet*="FeedUnit"]'));
  }

  signature(post) {
    const evidence = this.collectEvidence(post);
    return [
      evidence.names.join('\n'),
      evidence.texts.join('\n'),
      evidence.labels.join('\n'),
      evidence.verified ? 'v' : '',
      evidence.trending ? 't' : '',
      evidence.pageShare ? 'p' : '',
      evidence.groupShare ? 'g' : '',
      String(evidence.engagement)
    ].join('\u0001');
  }

  shouldFilterPost(post) {
    const evidence = this.collectEvidence(post);
    const names = this.matchNames();
    const settings = this.filterSettings;

    if (settings.hideKnownPublicFigures && this.namesHit(evidence.names, names)) return true;
    if (settings.hideAboutPublicFigures) {
      if (this.namesHit(evidence.texts, names)) return true;
      if (this.phrasesHit(evidence.texts, this.coveragePhrasesList())) return true;
    }
    if (settings.hidePublicFigureLabels && evidence.labels.length > 0) return true;
    if (settings.hideVerified && evidence.verified) return true;
    if (settings.hideHighEngagement && evidence.engagement > settings.engagementThreshold) return true;
    if (settings.hideTrending && evidence.trending) return true;
    if (settings.hideSharedFromPages && evidence.pageShare) return true;
    if (settings.hideSharedFromGroups && evidence.groupShare) return true;
    return false;
  }

  matchNames() {
    const names = this.knownNameList().concat(this.blockedNameList());
    const seen = Object.create(null);
    const out = [];
    for (let i = 0; i < names.length; i++) {
      const variants = this.nameVariants(names[i]);
      for (let j = 0; j < variants.length; j++) {
        const variant = variants[j];
        if (variant.length < 3 || seen[variant]) continue;
        seen[variant] = true;
        out.push(variant);
      }
    }
    return out;
  }

  knownNameList() {
    if (this.knownNames) return this.knownNames;
    // Existing built-in list. Not expanded: a short name list cannot
    // recognize every famous person, and substring matches were hiding
    // ordinary posts ("smith", "cook", "james").
    this.knownNames = [
      'ethan hawke', 'brad pitt', 'leonardo dicaprio', 'tom cruise', 'will smith',
      'jennifer aniston', 'angelina jolie', 'scarlett johansson', 'margot robbie',
      'dwayne johnson', 'chris hemsworth', 'robert downey', 'chris evans',
      'emma watson', 'ryan reynolds', 'meryl streep', 'denzel washington',
      'julia roberts', 'george clooney', 'matt damon', 'ben affleck',
      'jennifer lawrence', 'emma stone', 'natalie portman', 'anne hathaway',
      'chris pratt', 'tom hanks', 'johnny depp', 'robert de niro',
      'al pacino', 'morgan freeman', 'samuel l jackson', 'keanu reeves',
      'gal gadot', 'zendaya', 'timothée chalamet', 'tom holland',
      'chris pine', 'henry cavill', 'jason momoa', 'idris elba',
      'taylor swift', 'beyonce', 'justin bieber', 'ariana grande',
      'drake', 'ed sheeran', 'bruno mars', 'adele', 'harry styles',
      'lady gaga', 'rihanna', 'kanye west', 'the weeknd', 'billie eilish',
      'post malone', 'travis scott', 'kendrick lamar', 'j cole',
      'selena gomez', 'miley cyrus', 'dua lipa', 'olivia rodrigo',
      'the beatles', 'elvis presley', 'michael jackson', 'madonna',
      'prince', 'david bowie', 'bob dylan', 'bruce springsteen',
      'kim kardashian', 'kylie jenner', 'kendall jenner',
      'khloe kardashian', 'kourtney kardashian', 'kris jenner',
      'charli damelio', 'addison rae', 'dixie damelio',
      'oprah', 'ellen degeneres', 'jimmy fallon', 'stephen colbert',
      'jimmy kimmel', 'seth meyers', 'trevor noah', 'james corden',
      'conan o\'brien', 'david letterman', 'jay leno',
      'lebron james', 'michael jordan', 'tom brady', 'serena williams',
      'cristiano ronaldo', 'lionel messi', 'kobe bryant', 'tiger woods',
      'roger federer', 'rafael nadal', 'stephen curry', 'kevin durant',
      'elon musk', 'jeff bezos', 'mark zuckerberg', 'bill gates',
      'warren buffett', 'steve jobs', 'tim cook',
      'gisele bundchen', 'gigi hadid', 'bella hadid',
      'karlie kloss', 'adriana lima', 'cara delevingne',
      'steven spielberg', 'christopher nolan', 'quentin tarantino',
      'martin scorsese', 'james cameron', 'ridley scott',
      'kevin hart', 'dave chappelle', 'jerry seinfeld', 'chris rock',
      'amy schumer', 'tina fey', 'amy poehler', 'seth rogen',
      'anderson cooper', 'rachel maddow', 'tucker carlson',
      'sean hannity', 'don lemon', 'chris cuomo'
    ];
    return this.knownNames;
  }

  coveragePhrasesList() {
    if (this.coveragePhrases) return this.coveragePhrases;
    // Phrases that specifically describe celebrity coverage. Generic words
    // ("famous", "star", "viral", "exclusive", "awards") are not used.
    this.coveragePhrases = [
      'red carpet',
      'paparazzi',
      'met gala',
      'golden globe',
      'golden globes',
      'academy awards',
      'the oscars',
      'grammy awards',
      'grammys',
      'emmy awards',
      'celebrity gossip',
      'celebrity news',
      'celebrity',
      'celebrities'
    ];
    return this.coveragePhrases;
  }

  blockedNameList() {
    const raw = this.filterSettings.blockedNames;
    const parts = Array.isArray(raw) ? raw : String(raw || '').split(/[\n,]/);
    const out = [];
    for (let i = 0; i < parts.length; i++) {
      const name = String(parts[i] || '').trim();
      if (name.length >= 2 && name.length <= 80) out.push(name);
    }
    return out;
  }

  nameVariants(name) {
    const folded = this.fold(name).replace(/\s+/g, ' ').trim();
    const variants = [folded];
    const withoutApostrophe = folded.replace(/['’]/g, '');
    if (withoutApostrophe !== folded) variants.push(withoutApostrophe);
    return variants;
  }

  namesHit(blobs, names) {
    for (let i = 0; i < blobs.length; i++) {
      const text = this.fold(blobs[i]);
      for (let j = 0; j < names.length; j++) {
        if (this.hasBoundedPhrase(text, names[j])) return true;
      }
    }
    return false;
  }

  phrasesHit(blobs, phrases) {
    for (let i = 0; i < blobs.length; i++) {
      const text = this.fold(blobs[i]);
      for (let j = 0; j < phrases.length; j++) {
        if (this.hasBoundedPhrase(text, this.fold(phrases[j]))) return true;
      }
    }
    return false;
  }

  hasBoundedPhrase(haystack, needle) {
    if (!needle || needle.length < 3) return false;
    let from = 0;
    while (from <= haystack.length - needle.length) {
      const at = haystack.indexOf(needle, from);
      if (at === -1) return false;
      const before = at === 0 ? '' : haystack.charAt(at - 1);
      const after = haystack.charAt(at + needle.length);
      if (this.isBoundary(before) && this.isBoundary(after)) return true;
      from = at + 1;
    }
    return false;
  }

  isBoundary(ch) {
    if (!ch) return true;
    return !/[a-z0-9]/i.test(ch);
  }

  fold(value) {
    return String(value || '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase();
  }

  collectEvidence(post) {
    const evidence = {
      names: [],
      texts: [],
      labels: [],
      verified: false,
      trending: false,
      pageShare: false,
      groupShare: false,
      engagement: 0
    };
    const labelSet = this.publicFigureLabels();
    const regions = [post];
    const nested = post.querySelectorAll('[role="article"]');
    for (let i = 0; i < nested.length; i++) regions.push(nested[i]);

    for (let r = 0; r < regions.length; r++) {
      const region = regions[r];
      const messages = [];
      const messageNodes = region.querySelectorAll('[data-ad-preview="message"]');
      for (let i = 0; i < messageNodes.length; i++) {
        const message = messageNodes[i];
        if (message === region || this.inComment(message, post)) continue;
        if (message.closest('[role="article"]') !== region && region !== post) continue;
        messages.push(message);
      }
      if (messages.length) {
        for (let i = 0; i < messages.length; i++) {
          const text = this.cleanText(messages[i]);
          if (text) evidence.texts.push(text);
        }
      } else {
        const text = this.regionText(region);
        if (text) evidence.texts.push(text);
      }
    }

    const nodes = post.querySelectorAll('a, span, h1, h2, h3, h4, img, [aria-label], [role="img"]');
    for (let i = 0; i < nodes.length; i++) {
      const el = nodes[i];
      if (el === post || this.inComment(el, post)) continue;
      if (el.tagName === 'A') {
        const text = this.cleanText(el);
        const href = (el.getAttribute('href') || '').toLowerCase();
        if (text && text.length <= 80 && !this.inMessage(el, post)) evidence.names.push(text);
        if (text && text.length > 80 && !this.inMessage(el, post)) evidence.texts.push(text);
        if (this.isPageHref(href) && !this.inMessage(el, post)) evidence.pageShare = true;
        if (this.isGroupHref(href) && !this.inMessage(el, post)) evidence.groupShare = true;
      }
      if (el.tagName === 'IMG') {
        const alt = el.getAttribute('alt');
        const title = el.getAttribute('title');
        if (alt) evidence.texts.push(alt);
        if (title) evidence.texts.push(title);
      }
      const aria = el.getAttribute && el.getAttribute('aria-label');
      if (aria && aria.length <= 240) {
        evidence.texts.push(aria);
        const short = aria.trim().toLowerCase();
        if (short.length <= 80 && /\bverified\b/.test(short) && /\b(account|page|profile|badge|checkmark)\b/.test(short)) {
          evidence.verified = true;
        }
        if (short.length <= 40 && /\btrending\b/.test(short)) evidence.trending = true;
      }
      if (el.childElementCount === 0 && !this.inMessage(el, post) && !(el.closest && el.closest('button, [role="button"]'))) {
        const leaf = this.cleanText(el).toLowerCase();
        if (leaf && leaf.length <= 40 && labelSet[leaf]) evidence.labels.push(leaf);
      }
    }

    evidence.engagement = this.engagementTotal(post);
    return evidence;
  }

  regionText(region) {
    const clone = region.cloneNode(true);
    const nested = clone.querySelectorAll('[role="article"]');
    for (let i = 0; i < nested.length; i++) {
      if (nested[i] !== clone) nested[i].parentNode.removeChild(nested[i]);
    }
    const skipped = clone.querySelectorAll('[data-comment-region], [contenteditable="true"]');
    for (let i = 0; i < skipped.length; i++) {
      if (skipped[i].parentNode) skipped[i].parentNode.removeChild(skipped[i]);
    }
    return this.cleanText(clone);
  }

  publicFigureLabels() {
    return {
      'public figure': true,
      'politician': true,
      'government official': true,
      'actor': true,
      'actress': true,
      'musician': true,
      'musician/band': true,
      'athlete': true,
      'comedian': true,
      'model': true,
      'tv personality': true,
      'television personality': true,
      'news personality': true,
      'journalist': true
    };
  }

  inComment(el, post) {
    let node = el;
    while (node && node !== post) {
      if (node.getAttribute) {
        const label = node.getAttribute('aria-label') || '';
        if (/^comments?(\b| by)/i.test(label)) return true;
        if (node.hasAttribute('data-comment-region')) return true;
        if (node.getAttribute('contenteditable') === 'true') return true;
      }
      node = node.parentElement;
    }
    return false;
  }

  inMessage(el, post) {
    const message = el.closest && el.closest('[data-ad-preview="message"]');
    return !!(message && message !== post);
  }

  cleanText(el) {
    return (el.innerText || el.textContent || '').replace(/\s+/g, ' ').trim();
  }

  isPageHref(href) {
    return href.indexOf('/pages/') !== -1 || href.indexOf('/pg/') !== -1 || href.indexOf('/page/') !== -1;
  }

  isGroupHref(href) {
    return href.indexOf('/groups/') !== -1;
  }

  engagementTotal(post) {
    let total = 0;
    const nodes = post.querySelectorAll('[aria-label]');
    for (let i = 0; i < nodes.length; i++) {
      if (this.inComment(nodes[i], post)) continue;
      const label = nodes[i].getAttribute('aria-label') || '';
      const match = label.match(/([\d,]+)\s*(?:like|comment|share|people)/i);
      if (match) total += this.parseCount(match[1]);
    }
    return total;
  }

  parseCount(value) {
    if (typeof value === 'number') return value;
    const digits = String(value || '').replace(/[^\d]/g, '');
    if (!digits) return 0;
    return parseInt(digits, 10);
  }

  hidePost(post) {
    if (post.getAttribute('data-filtered-by') === 'defamous') return;
    post.setAttribute('data-defamous-display', post.style.display || '');
    post.style.display = 'none';
    post.setAttribute('data-filtered-by', 'defamous');
    post.setAttribute('aria-hidden', 'true');
  }

  showPost(post) {
    if (post.getAttribute('data-filtered-by') !== 'defamous') return;
    post.style.display = post.getAttribute('data-defamous-display') || '';
    post.removeAttribute('data-defamous-display');
    post.removeAttribute('data-filtered-by');
    post.removeAttribute('aria-hidden');
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new FacebookCelebrityFilter();
  });
} else {
  new FacebookCelebrityFilter();
}
