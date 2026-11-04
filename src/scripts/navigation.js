// Navigation & Seamless Page Transition Router
const pageCache = new Map();

// Speculative background prefetch for instantaneous navigation
export async function prefetchPage(url) {
  try {
    const cleanUrl = url.split('#')[0];
    if (!cleanUrl || pageCache.has(cleanUrl)) return;
    const res = await fetch(cleanUrl, { credentials: 'same-origin' });
    if (res.ok) {
      const html = await res.text();
      pageCache.set(cleanUrl, html);
    }
  } catch (e) {
    // Silent fallback
  }
}

export function initNavigation() {
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenuDrawer = document.getElementById('mobile-menu-drawer');
  const mobileMenuBackdrop = document.getElementById('mobile-menu-backdrop');
  const closeMobileMenuBtn = document.getElementById('close-mobile-menu-btn');

  if (!mobileMenuDrawer || !mobileMenuBackdrop) return;

  // Initialize closed state
  mobileMenuDrawer.classList.add('invisible', 'pointer-events-none', 'translate-x-full');
  mobileMenuDrawer.classList.remove('translate-x-0');
  mobileMenuDrawer.style.visibility = 'hidden';
  mobileMenuDrawer.style.pointerEvents = 'none';
  mobileMenuDrawer.style.transform = 'translateX(100%)';

  mobileMenuBackdrop.classList.add('hidden', 'opacity-0');
  mobileMenuBackdrop.style.display = 'none';
  mobileMenuBackdrop.style.opacity = '0';

  function openMenu() {
    // Make backdrop visible
    mobileMenuBackdrop.classList.remove('hidden');
    mobileMenuBackdrop.style.display = 'block';

    // Make drawer visible in DOM
    mobileMenuDrawer.classList.remove('invisible', 'pointer-events-none');
    mobileMenuDrawer.style.visibility = 'visible';
    mobileMenuDrawer.style.pointerEvents = 'auto';

    // Animate in on next animation frame
    requestAnimationFrame(() => {
      mobileMenuBackdrop.classList.remove('opacity-0');
      mobileMenuBackdrop.classList.add('opacity-100');
      
      mobileMenuDrawer.classList.remove('translate-x-full');
      mobileMenuDrawer.classList.add('translate-x-0');
      mobileMenuDrawer.style.transform = 'translateX(0)';
    });

    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    mobileMenuBackdrop.classList.remove('opacity-100');
    mobileMenuBackdrop.classList.add('opacity-0');

    mobileMenuDrawer.classList.remove('translate-x-0');
    mobileMenuDrawer.classList.add('translate-x-full');
    mobileMenuDrawer.style.transform = 'translateX(100%)';

    setTimeout(() => {
      mobileMenuDrawer.classList.add('invisible', 'pointer-events-none');
      mobileMenuDrawer.style.visibility = 'hidden';
      mobileMenuDrawer.style.pointerEvents = 'none';

      mobileMenuBackdrop.classList.add('hidden');
      mobileMenuBackdrop.style.display = 'none';
      document.body.style.overflow = '';
    }, 280);
  }

  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      openMenu();
    });
  }

  if (closeMobileMenuBtn) {
    closeMobileMenuBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      closeMenu();
    });
  }

  if (mobileMenuBackdrop) {
    mobileMenuBackdrop.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      closeMenu();
    });
  }

  // Close when clicking any link inside the mobile drawer
  const drawerLinks = mobileMenuDrawer.querySelectorAll('a');
  drawerLinks.forEach(link => {
    link.addEventListener('click', () => {
      closeMenu();
    });
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileMenuDrawer.style.visibility === 'visible') {
      closeMenu();
    }
  });

  // Seamless Page Navigation function
  async function navigateTo(targetUrl, pushState = true) {
    const urlObj = new URL(targetUrl, window.location.href);
    const targetPath = urlObj.pathname;
    const currentPath = window.location.pathname;
    const targetHash = urlObj.hash;

    // Same-page hash navigation
    if (targetPath === currentPath && targetHash) {
      const el = document.querySelector(targetHash);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
        if (pushState) history.pushState(null, '', targetUrl);
        updateActiveLinks();
        return;
      }
    }

    // Fetch new page HTML or use preloaded cache
    let html = pageCache.get(targetPath) || pageCache.get(urlObj.href.split('#')[0]);
    if (!html) {
      try {
        const res = await fetch(urlObj.href, { credentials: 'same-origin' });
        if (!res.ok) throw new Error('Fetch failed');
        html = await res.text();
        pageCache.set(targetPath, html);
      } catch (err) {
        window.location.href = targetUrl;
        return;
      }
    }

    const parser = new DOMParser();
    const newDoc = parser.parseFromString(html, 'text/html');
    const newMain = newDoc.querySelector('main');
    const currentMain = document.querySelector('main');

    if (!newMain || !currentMain) {
      window.location.href = targetUrl;
      return;
    }

    const updateDOM = () => {
      document.title = newDoc.title;
      currentMain.replaceWith(newMain);

      if (pushState) {
        history.pushState(null, '', targetUrl);
      }

      // Scroll position
      if (targetHash) {
        const targetEl = document.querySelector(targetHash);
        if (targetEl) {
          targetEl.scrollIntoView({ behavior: 'smooth' });
        } else {
          window.scrollTo({ top: 0, behavior: 'instant' });
        }
      } else {
        window.scrollTo({ top: 0, behavior: 'instant' });
      }

      // Re-initialize all interactive widgets on the new page
      if (typeof window._initPageScripts === 'function') {
        window._initPageScripts();
      }
      updateActiveLinks();
    };

    // Use native View Transitions if supported, or smooth cross-fade
    if (document.startViewTransition) {
      document.startViewTransition(() => updateDOM());
    } else {
      currentMain.style.transition = 'opacity 60ms ease-out';
      currentMain.style.opacity = '0';
      setTimeout(() => {
        updateDOM();
        const updatedMain = document.querySelector('main');
        if (updatedMain) {
          updatedMain.style.opacity = '0';
          updatedMain.style.transition = 'opacity 120ms ease-in';
          requestAnimationFrame(() => {
            updatedMain.style.opacity = '1';
          });
        }
      }, 60);
    }
  }

  // Intercept all internal navigation link clicks for zero-distortion transitions
  document.addEventListener('click', (e) => {
    const link = e.target.closest('a');
    if (!link) return;

    const href = link.getAttribute('href') || '';
    if (!href) return;

    // Ignore external URLs, protocols, and modified clicks
    if (
      href.startsWith('http://') ||
      href.startsWith('https://') ||
      href.startsWith('tel:') ||
      href.startsWith('mailto:') ||
      href.startsWith('javascript:') ||
      link.target === '_blank' ||
      e.metaKey ||
      e.ctrlKey ||
      e.shiftKey ||
      e.altKey ||
      e.button !== 0
    ) {
      return;
    }

    // Only handle internal HTML documents and hash anchors
    const isInternal = href.includes('.html') || href === '/' || href.startsWith('./') || href.startsWith('#');
    if (!isInternal) return;

    e.preventDefault();

    // Close mobile drawer if open
    if (!mobileMenuDrawer.classList.contains('invisible')) {
      closeMenu();
    }

    navigateTo(link.href, true);
  });

  // Speculative hover/touch prefetching
  document.addEventListener('pointerover', (e) => {
    const link = e.target.closest('a');
    if (!link) return;
    const href = link.getAttribute('href');
    if (href && (href.includes('.html') || href === '/')) {
      prefetchPage(link.href);
    }
  }, { passive: true });

  // Handle browser back and forward buttons
  window.addEventListener('popstate', () => {
    navigateTo(window.location.href, false);
  });

  // Highlight active link precisely based on current path and hash
  updateActiveLinks();
  window.addEventListener('hashchange', updateActiveLinks);

  function updateActiveLinks() {
    const rawPath = window.location.pathname.toLowerCase();
    const currentHash = window.location.hash.toLowerCase();
    
    // Normalize path to page name
    let activePage = 'home';
    if (rawPath.includes('about')) {
      activePage = 'about';
    } else if (rawPath.includes('services')) {
      activePage = 'services';
    } else if (rawPath.includes('contact')) {
      activePage = 'contact';
    }

    // Update desktop links
    const desktopLinks = document.querySelectorAll('header nav a.nav-link');
    desktopLinks.forEach(link => {
      const href = link.getAttribute('href')?.toLowerCase() || '';
      let isCurrent = false;

      if (currentHash && href.includes(currentHash)) {
        isCurrent = true;
      } else if (!currentHash) {
        if (activePage === 'home' && (href === 'index.html' || href === './index.html' || href === '/')) {
          isCurrent = true;
        } else if (activePage === 'about' && href === 'about.html') {
          isCurrent = true;
        } else if (activePage === 'services' && href === 'services.html') {
          isCurrent = true;
        } else if (activePage === 'contact' && href === 'contact.html') {
          isCurrent = true;
        }
      }

      if (isCurrent) {
        link.classList.add('text-primary', 'font-semibold');
        link.classList.remove('text-on-surface-variant');
        link.setAttribute('aria-current', 'page');
      } else {
        link.classList.remove('text-primary', 'font-semibold');
        link.classList.add('text-on-surface-variant');
        link.removeAttribute('aria-current');
      }
    });

    // Update mobile links
    const mobileLinks = document.querySelectorAll('.mobile-nav-link');
    mobileLinks.forEach(link => {
      const href = link.getAttribute('href')?.toLowerCase() || '';
      let isCurrent = false;

      if (currentHash && href.includes(currentHash)) {
        isCurrent = true;
      } else if (!currentHash) {
        if (activePage === 'home' && (href === 'index.html' || href === './index.html' || href === '/')) {
          isCurrent = true;
        } else if (activePage === 'about' && href === 'about.html') {
          isCurrent = true;
        } else if (activePage === 'services' && href === 'services.html') {
          isCurrent = true;
        } else if (activePage === 'contact' && href === 'contact.html') {
          isCurrent = true;
        }
      }

      const activeBadge = link.querySelector('.mobile-active-dot');
      if (isCurrent) {
        link.classList.add('bg-primary/10', 'text-primary', 'font-semibold');
        link.classList.remove('text-on-surface');
        if (activeBadge) activeBadge.classList.remove('hidden');
      } else {
        link.classList.remove('bg-primary/10', 'text-primary', 'font-semibold');
        link.classList.add('text-on-surface');
        if (activeBadge) activeBadge.classList.add('hidden');
      }
    });
  }
}
