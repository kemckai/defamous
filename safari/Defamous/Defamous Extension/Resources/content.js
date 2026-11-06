// Facebook No-Celebrity Mode - Content Script
// Filters out verified accounts, public figures, and high-engagement content

class FacebookCelebrityFilter {
  constructor() {
    this.filterSettings = {
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
    this.processedPosts = new Set();
    this.observer = null;
    this.celebrityNames = null; // Cache celebrity names
    this.celebrityKeywords = null; // Cache keywords
    this.init();
  }

  async init() {
    // Load settings from storage
    await this.loadSettings();
    
    // Start filtering
    this.startFiltering();
    
    // Set up mutation observer for dynamic content
    this.setupObserver();
    
    // Listen for settings changes
    chrome.storage.onChanged.addListener((changes) => {
      if (changes.filterSettings) {
        this.filterSettings = { ...this.filterSettings, ...changes.filterSettings.newValue };
        this.processFeed();
      }
    });
  }

  async loadSettings() {
    const result = await chrome.storage.sync.get('filterSettings');
    if (result.filterSettings) {
      this.filterSettings = { ...this.filterSettings, ...result.filterSettings };
    }
  }

  setupObserver() {
    // Watch for new posts being added to the feed
    this.observer = new MutationObserver(() => {
      this.processFeed();
    });

    // Observe the main feed container
    const feedContainer = document.querySelector('[role="main"]') || document.body;
    this.observer.observe(feedContainer, {
      childList: true,
      subtree: true
    });
  }

  startFiltering() {
    // Process existing feed immediately
    this.processFeed();
    
    // Process again after a short delay to catch late-loading content
    setTimeout(() => this.processFeed(), 1000);
    setTimeout(() => this.processFeed(), 3000);
    
    // Also process on scroll (Facebook loads content dynamically)
    let scrollTimeout;
    const handleScroll = () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        this.processFeed();
      }, 300); // Faster response on scroll
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Process on any DOM changes (more aggressive)
    const quickObserver = new MutationObserver(() => {
      this.processFeed();
    });
    
    // Observe the entire document for maximum coverage
    quickObserver.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  processFeed() {
    // Find all post containers - try multiple selectors
    let posts = document.querySelectorAll('[role="article"]');
    
    // If no posts found, try alternative selectors
    if (posts.length === 0) {
      posts = document.querySelectorAll('[data-pagelet*="FeedUnit"], div[data-ad-preview="message"]');
    }
    
    // Also try Facebook's newer structure
    if (posts.length === 0) {
      posts = document.querySelectorAll('div[data-pagelet*="FeedUnit"], div[role="feed"] > div');
    }
    
    posts.forEach(post => {
      // Skip if already hidden
      if (post.style.display === 'none' || post.getAttribute('data-filtered-by')) {
        return;
      }
      
      const postId = this.getPostId(post);
      if (!postId) {
        // Generate a temporary ID based on content
        const tempId = post.textContent.substring(0, 50) + post.innerHTML.length;
        if (this.processedPosts.has(tempId)) {
          return;
        }
        this.processedPosts.add(tempId);
      } else if (this.processedPosts.has(postId)) {
        return;
      } else {
        this.processedPosts.add(postId);
      }
      
      // Quick pre-check: if post is very small or empty, skip detailed filtering
      const postText = post.textContent.trim();
      if (postText.length < 10) {
        return;
      }
      
      if (this.shouldFilterPost(post)) {
        this.hidePost(post);
      }
    });
  }

  getPostId(post) {
    // Try to get a unique identifier for the post
    const link = post.querySelector('a[href*="/posts/"], a[href*="/permalink/"]');
    if (link) {
      return link.href;
    }
    return post.getAttribute('data-pagelet') || post.id || null;
  }

  getAuthorName(post) {
    // Try multiple methods to get the author name
    // Method 1: Look for author link in the post header (most reliable)
    const authorLinks = post.querySelectorAll('a[role="link"][href*="/"], a[href*="facebook.com"]');
    for (const authorLink of authorLinks) {
      const text = authorLink.textContent.trim();
      const href = (authorLink.getAttribute('href') || '').toLowerCase();
      
      // Skip if it's clearly not an author link
      if (href.includes('/photos/') || href.includes('/videos/') || 
          href.includes('/events/') || href.includes('/groups/')) {
        continue;
      }
      
      if (text && text.length > 1 && text.length < 100) {
        // Check if it looks like a name (has capital letter, reasonable length)
        if (/^[A-Z]/.test(text) || text.split(' ').length <= 4) {
          return text;
        }
      }
    }
    
    // Method 2: Look for strong/bold text in header (often author name)
    const headers = post.querySelectorAll('[role="article"] > div > div, [data-pagelet], h2, h3');
    for (const header of headers) {
      const strong = header.querySelector('strong, b, span[dir="auto"]');
      if (strong) {
        const text = strong.textContent.trim();
        if (text && text.length > 1 && text.length < 100 && /^[A-Z]/.test(text)) {
          return text;
        }
      }
    }
    
    // Method 3: Look for span with author name (Facebook's structure)
    const spans = post.querySelectorAll('span[dir="auto"], span[role="link"]');
    for (const span of spans) {
      const text = span.textContent.trim();
      if (text && text.length > 2 && text.length < 50) {
        const parent = span.closest('a');
        if (parent && parent.href.includes('facebook.com')) {
          const href = parent.href.toLowerCase();
          // Skip non-profile links
          if (!href.includes('/photos/') && !href.includes('/videos/')) {
            return text;
          }
        }
      }
    }
    
    // Method 4: Extract from URL if it's a profile/page link
    const allLinks = post.querySelectorAll('a[href*="facebook.com"]');
    for (const link of allLinks) {
      const href = link.getAttribute('href') || '';
      const urlMatch = href.match(/facebook\.com\/([^\/\?]+)/);
      if (urlMatch) {
        const username = urlMatch[1];
        // If it's not a standard path like /posts, /photos, etc., might be a name
        if (!username.match(/^(posts|photos|videos|events|groups|pages)/i)) {
          const linkText = link.textContent.trim();
          if (linkText && linkText.length < 100) {
            return linkText;
          }
        }
      }
    }
    
    return null;
  }

  shouldFilterPost(post) {
    // Get author name early for multiple checks
    const authorName = this.getAuthorName(post);
    
    // Check for celebrity images/photos
    if (this.hasCelebrityImages(post)) {
      return true;
    }
    
    // FIRST: Check if this is a shared post from a page/group (second-hand/third-hand content)
    const sharedInfo = this.getSharedPostInfo(post);
    if (sharedInfo.isShared) {
      // Check if shared from a page
      if (this.filterSettings.hideSharedFromPages && sharedInfo.isFromPage) {
        return true;
      }
      
      // Check if shared from a group
      if (this.filterSettings.hideSharedFromGroups && sharedInfo.isFromGroup) {
        return true;
      }
      
      // Check the original source for celebrity content
      if (this.filterSettings.filterSharedCelebrityContent) {
        // Check original author name
        if (sharedInfo.originalAuthor) {
          const originalAuthorName = sharedInfo.originalAuthor.toLowerCase();
          const celebrityNames = this.getCelebrityNames();
          const normalizedName = originalAuthorName.replace(/[^a-z0-9]/g, '');
          if (celebrityNames.some(celeb => {
            const normalizedCeleb = celeb.replace(/[^a-z0-9]/g, '');
            return normalizedName.includes(normalizedCeleb) || normalizedCeleb.includes(normalizedName);
          })) {
            return true;
          }
        }
        
        // Check shared content for celebrity keywords
        if (sharedInfo.sharedContent) {
          const sharedText = sharedInfo.sharedContent.toLowerCase();
          if (this.containsCelebrityContent(sharedText)) {
            return true;
          }
        }
        
        // Check if original source URL indicates a page/group
        if (sharedInfo.originalUrl) {
          const url = sharedInfo.originalUrl.toLowerCase();
          if (url.includes('/pages/') || url.includes('/groups/') || url.includes('/pg/')) {
            // It's from a page or group, filter it
            return true;
          }
        }
      }
    }
    
    // Check for verified badge - multiple methods
    if (this.filterSettings.hideVerified) {
      // Method 1: aria-label
      const verifiedBadge = post.querySelector('[aria-label*="Verified"], [aria-label*="verified"], [aria-label*="Checkmark"]');
      if (verifiedBadge) {
        return true;
      }
      
      // Method 2: SVG checkmark icons (Facebook uses specific paths)
      const svgCheckmarks = post.querySelectorAll('svg');
      for (const svg of svgCheckmarks) {
        const paths = svg.querySelectorAll('path');
        for (const path of paths) {
          const d = path.getAttribute('d') || '';
          // Facebook's verified checkmark has distinctive path patterns
          if (d.includes('M12') && d.includes('L8') && d.includes('L6')) {
            return true;
          }
        }
      }
      
      // Method 3: Look for verified badge in author section
      const authorSection = post.querySelector('[role="article"] > div > div > div, [data-pagelet]');
      if (authorSection) {
        const authorHTML = authorSection.innerHTML.toLowerCase();
        if (authorHTML.includes('verified') || authorHTML.includes('checkmark')) {
          return true;
        }
      }
      
      // Method 4: Check for blue checkmark image/icon
      const images = post.querySelectorAll('img[alt*="Verified"], img[alt*="verified"], img[alt*="Checkmark"]');
      if (images.length > 0) {
        return true;
      }
    }

    // Check author name against known celebrities
    if (authorName) {
      const celebrityNames = this.getCelebrityNames();
      const normalizedName = authorName.toLowerCase().replace(/[^a-z0-9]/g, '');
      if (celebrityNames.some(celeb => {
        const normalizedCeleb = celeb.replace(/[^a-z0-9]/g, '');
        return normalizedName.includes(normalizedCeleb) || normalizedCeleb.includes(normalizedName);
      })) {
        return true;
      }
    }

    // Check for public figure indicators
    if (this.filterSettings.hidePublicFigures) {
      const authorLink = post.querySelector('a[href*="/"]');
      if (authorLink) {
        const authorText = authorLink.textContent.toLowerCase();
        const publicFigureKeywords = ['official', 'fan page', 'public figure', 'verified page'];
        if (publicFigureKeywords.some(keyword => authorText.includes(keyword))) {
          return true;
        }
      }
    }

    // Check for high engagement (likes, comments, shares)
    if (this.filterSettings.hideHighEngagement) {
      const engagement = this.getPostEngagement(post);
      if (engagement > this.filterSettings.engagementThreshold) {
        return true;
      }
    }

    // Check for brand pages and celebrity pages
    if (this.filterSettings.hideBrandPages) {
      const pageType = post.querySelector('[data-pagelet*="Page"]');
      if (pageType) {
        return true;
      }
      
      // Check URLs for page indicators
      const links = post.querySelectorAll('a[href*="facebook.com"]');
      for (const link of links) {
        const href = link.getAttribute('href') || '';
        if (href.includes('/pages/') || href.includes('/pg/') || 
            href.includes('/page/')) {
          return true;
        }
      }
    }

    // Check for trending/viral content indicators
    if (this.filterSettings.hideTrending) {
      const trendingIndicators = post.querySelectorAll('[aria-label*="trending"], [aria-label*="Trending"]');
      if (trendingIndicators.length > 0) {
        return true;
      }
    }

    // Check post content for celebrity-related keywords
    const postText = post.textContent.toLowerCase();
    if (this.containsCelebrityContent(postText)) {
      return true;
    }
    
    // Check all text content in the post (including hidden text)
    const allText = post.innerText || post.textContent || '';
    if (allText && this.containsCelebrityContent(allText.toLowerCase())) {
      return true;
    }
    
    // Check for celebrity names anywhere in the post HTML
    const postHTML = post.innerHTML.toLowerCase();
    const celebrityNames = this.getCelebrityNames();
    for (const celeb of celebrityNames) {
      const normalizedCeleb = celeb.toLowerCase().replace(/[^a-z0-9]/g, '');
      const normalizedHTML = postHTML.replace(/[^a-z0-9]/g, '');
      if (normalizedHTML.includes(normalizedCeleb)) {
        return true;
      }
    }

    return false;
  }

  hasCelebrityImages(post) {
    // Check all images in the post for celebrity-related content
    const images = post.querySelectorAll('img');
    
    for (const img of images) {
      // Check alt text
      const alt = (img.getAttribute('alt') || '').toLowerCase();
      const src = (img.getAttribute('src') || '').toLowerCase();
      const title = (img.getAttribute('title') || '').toLowerCase();
      
      // Combine all image text
      const imageText = `${alt} ${src} ${title}`.toLowerCase();
      
      // Check for celebrity names in image attributes
      const celebrityNames = this.getCelebrityNames();
      for (const celeb of celebrityNames) {
        const normalizedCeleb = celeb.toLowerCase().replace(/[^a-z0-9]/g, '');
        const normalizedText = imageText.replace(/[^a-z0-9]/g, '');
        if (normalizedText.includes(normalizedCeleb) || normalizedCeleb.includes(normalizedText)) {
          return true;
        }
      }
      
      // Check for celebrity-related keywords in image
      const celebrityImageKeywords = [
        'celebrity', 'star', 'famous', 'actor', 'actress', 'singer',
        'red carpet', 'premiere', 'awards', 'hollywood', 'entertainment',
        'verified', 'official page', 'fan page'
      ];
      
      if (celebrityImageKeywords.some(keyword => imageText.includes(keyword))) {
        return true;
      }
      
      // Check if image is from a celebrity page URL
      if (src.includes('/celebrity/') || src.includes('/stars/') || 
          src.includes('/entertainment/') || src.includes('/hollywood/')) {
        return true;
      }
    }
    
    // Check for profile pictures that might be celebrities
    const profilePics = post.querySelectorAll('img[src*="profile"], img[src*="avatar"]');
    for (const pic of profilePics) {
      const parent = pic.closest('a');
      if (parent) {
        const href = (parent.getAttribute('href') || '').toLowerCase();
        // If profile link suggests a page (not personal profile), might be celebrity
        if (href.includes('/pages/') || href.includes('/pg/')) {
          return true;
        }
      }
    }
    
    return false;
  }

  getCelebrityNames() {
    // Cache celebrity names for performance
    if (this.celebrityNames) {
      return this.celebrityNames;
    }
    
    this.celebrityNames = [
      // A-List Actors
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
      // Musicians & Singers
      'taylor swift', 'beyonce', 'justin bieber', 'ariana grande',
      'drake', 'ed sheeran', 'bruno mars', 'adele', 'harry styles',
      'lady gaga', 'rihanna', 'kanye west', 'the weeknd', 'billie eilish',
      'post malone', 'travis scott', 'kendrick lamar', 'j cole',
      'selena gomez', 'miley cyrus', 'dua lipa', 'olivia rodrigo',
      'the beatles', 'elvis presley', 'michael jackson', 'madonna',
      'prince', 'david bowie', 'bob dylan', 'bruce springsteen',
      // Reality TV & Influencers
      'kim kardashian', 'kanye west', 'kylie jenner', 'kendall jenner',
      'khloe kardashian', 'kourtney kardashian', 'kris jenner',
      'charli damelio', 'addison rae', 'dixie damelio',
      // Talk Show Hosts & TV Personalities
      'oprah', 'ellen degeneres', 'jimmy fallon', 'stephen colbert',
      'jimmy kimmel', 'seth meyers', 'trevor noah', 'james corden',
      'conan o\'brien', 'david letterman', 'jay leno',
      // Sports Stars
      'lebron james', 'michael jordan', 'tom brady', 'serena williams',
      'cristiano ronaldo', 'lionel messi', 'kobe bryant', 'tiger woods',
      'roger federer', 'rafael nadal', 'stephen curry', 'kevin durant',
      // Tech & Business Celebrities
      'elon musk', 'jeff bezos', 'mark zuckerberg', 'bill gates',
      'warren buffett', 'steve jobs', 'tim cook',
      // Models
      'gisele bundchen', 'kendall jenner', 'gigi hadid', 'bella hadid',
      'karlie kloss', 'adriana lima', 'cara delevingne',
      // Directors & Producers
      'steven spielberg', 'christopher nolan', 'quentin tarantino',
      'martin scorsese', 'james cameron', 'ridley scott',
      // Comedians
      'kevin hart', 'dave chappelle', 'jerry seinfeld', 'chris rock',
      'amy schumer', 'tina fey', 'amy poehler', 'seth rogen',
      // News Personalities
      'anderson cooper', 'rachel maddow', 'tucker carlson',
      'sean hannity', 'don lemon', 'chris cuomo'
    ];
    
    return this.celebrityNames;
  }

  containsCelebrityContent(text) {
    // Cache keywords for performance
    if (!this.celebrityKeywords) {
      this.celebrityKeywords = [
      // Awards & Events
      'award show', 'red carpet', 'album release', 'movie premiere',
      'grammy', 'oscar', 'emmy', 'golden globe', 'billboard',
      'premiere', 'awards', 'nomination', 'cannes', 'venice film festival',
      'met gala', 'coachella', 'vmas', 'amas', 'sag awards',
      // Entertainment Industry
      'hollywood', 'celebrity', 'star', 'famous', 'viral',
      'celebrity news', 'entertainment news', 'breaking news',
      'exclusive interview', 'entertainment industry', 'showbiz',
      'tinseltown', 'a-list', 'red carpet event', 'after party',
      // Social Media Celebrity Terms
      'influencer', 'viral video', 'trending', 'went viral',
      'million followers', 'instagram model', 'youtube star',
      'tiktok star', 'social media star',
      // Celebrity Lifestyle
      'paparazzi', 'tabloid', 'gossip', 'rumor', 'scandal',
      'celebrity couple', 'power couple', 'hollywood couple',
      // Media Terms
      'exclusive', 'breaking', 'sources say', 'insider',
      'according to sources', 'reports say'
      ];
    }
    
    // Check for celebrity name patterns in text
    const normalizedText = text.toLowerCase();
    const celebrityNames = this.getCelebrityNames();
    
    // Check if any celebrity name appears in the text
    for (const celeb of celebrityNames) {
      const normalizedCeleb = celeb.toLowerCase().replace(/[^a-z0-9]/g, '');
      const textWords = normalizedText.split(/\s+/);
      for (const word of textWords) {
        const normalizedWord = word.replace(/[^a-z0-9]/g, '');
        if (normalizedWord.length > 3 && (
          normalizedWord.includes(normalizedCeleb) || 
          normalizedCeleb.includes(normalizedWord)
        )) {
          return true;
        }
      }
    }
    
    return this.celebrityKeywords.some(keyword => text.includes(keyword));
  }

  getSharedPostInfo(post) {
    const info = {
      isShared: false,
      isFromPage: false,
      isFromGroup: false,
      originalAuthor: null,
      originalUrl: null,
      sharedContent: null
    };

    // Look for "shared" indicators in the post
    const postHTML = post.innerHTML.toLowerCase();
    const postText = post.textContent.toLowerCase();
    
    // Check for shared post indicators
    const sharedIndicators = [
      'shared a', 'shared from', 'shared by', 'shared with',
      'shared this', 'shared post', 'shared from page',
      'shared from group'
    ];
    
    const hasSharedIndicator = sharedIndicators.some(indicator => 
      postHTML.includes(indicator) || postText.includes(indicator)
    );
    
    if (!hasSharedIndicator) {
      // Also check for URL patterns that indicate sharing
      const links = post.querySelectorAll('a[href*="/posts/"], a[href*="/permalink/"]');
      for (const link of links) {
        const href = link.href.toLowerCase();
        if (href.includes('/pages/') || href.includes('/groups/') || href.includes('/pg/')) {
          info.isShared = true;
          info.originalUrl = link.href;
          if (href.includes('/pages/') || href.includes('/pg/')) {
            info.isFromPage = true;
          }
          if (href.includes('/groups/')) {
            info.isFromGroup = true;
          }
          break;
        }
      }
      return info;
    }
    
    info.isShared = true;
    
    // Try to find the original source
    // Look for links that might indicate the original source
    const allLinks = post.querySelectorAll('a[href*="facebook.com"]');
    for (const link of allLinks) {
      const href = link.href.toLowerCase();
      const linkText = link.textContent.trim();
      
      // Check if it's a page URL
      if (href.includes('/pages/') || href.includes('/pg/')) {
        info.isFromPage = true;
        info.originalUrl = link.href;
        if (linkText && linkText.length < 100) {
          info.originalAuthor = linkText;
        }
      }
      
      // Check if it's a group URL
      if (href.includes('/groups/')) {
        info.isFromGroup = true;
        info.originalUrl = link.href;
        if (linkText && linkText.length < 100) {
          info.originalAuthor = linkText;
        }
      }
      
      // Look for profile/page links that might be the original author
      if (!info.originalAuthor && linkText && linkText.length > 2 && linkText.length < 50) {
        // Could be the original author name
        const parent = link.closest('div');
        if (parent) {
          const parentText = parent.textContent.toLowerCase();
          if (parentText.includes('shared') || parentText.includes('from')) {
            info.originalAuthor = linkText;
          }
        }
      }
    }
    
    // Extract shared content (the actual post content being shared)
    // This is usually in a nested div or article
    const sharedContentElements = post.querySelectorAll('[role="article"] > div > div, [data-pagelet] > div');
    for (const elem of sharedContentElements) {
      const elemText = elem.textContent.trim();
      if (elemText.length > 50 && !info.sharedContent) {
        // Likely the shared content
        info.sharedContent = elemText;
        break;
      }
    }
    
    // If we couldn't find shared content, use the full post text
    if (!info.sharedContent) {
      info.sharedContent = post.textContent;
    }
    
    return info;
  }

  getPostEngagement(post) {
    // Try to extract engagement numbers from the post
    let totalEngagement = 0;
    
    // Look for like counts
    const likeElements = post.querySelectorAll('[aria-label*="like"], [aria-label*="Like"]');
    likeElements.forEach(el => {
      const text = el.getAttribute('aria-label') || el.textContent;
      const match = text.match(/([\d,]+)\s*(?:like|people)/i);
      if (match) {
        totalEngagement += parseInt(match[1].replace(/,/g, ''), 10);
      }
    });

    // Look for comment counts
    const commentElements = post.querySelectorAll('[aria-label*="comment"], [aria-label*="Comment"]');
    commentElements.forEach(el => {
      const text = el.getAttribute('aria-label') || el.textContent;
      const match = text.match(/([\d,]+)\s*(?:comment|people)/i);
      if (match) {
        totalEngagement += parseInt(match[1].replace(/,/g, ''), 10);
      }
    });

    // Look for share counts
    const shareElements = post.querySelectorAll('[aria-label*="share"], [aria-label*="Share"]');
    shareElements.forEach(el => {
      const text = el.getAttribute('aria-label') || el.textContent;
      const match = text.match(/([\d,]+)\s*(?:share|people)/i);
      if (match) {
        totalEngagement += parseInt(match[1].replace(/,/g, ''), 10);
      }
    });

    return totalEngagement;
  }

  hidePost(post) {
    // Immediately hide the post (no transition for faster filtering)
    post.style.display = 'none';
    post.style.visibility = 'hidden';
    post.style.height = '0';
    post.style.overflow = 'hidden';
    post.style.margin = '0';
    post.style.padding = '0';
    post.style.opacity = '0';
    
    // Hide all child elements too (limit to prevent performance issues)
    const children = post.querySelectorAll('*');
    const maxChildren = 100; // Limit to prevent performance issues
    const childrenToHide = Array.from(children).slice(0, maxChildren);
    childrenToHide.forEach(child => {
      child.style.display = 'none';
      child.style.visibility = 'hidden';
    });
    
    // Add a marker so we know it's been filtered
    post.setAttribute('data-filtered-by', 'defamous');
    post.setAttribute('aria-hidden', 'true');
    
    // Try to remove from accessibility tree
    try {
      post.removeAttribute('role');
      post.setAttribute('tabindex', '-1');
    } catch (e) {
      // Ignore errors
    }
  }
}

// Initialize the filter when the page loads
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new FacebookCelebrityFilter();
  });
} else {
  new FacebookCelebrityFilter();
}

