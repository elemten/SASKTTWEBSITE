import { useEffect, useRef } from 'react';
import { useLocation, useNavigationType } from 'react-router-dom';

// Store for scroll positions with session storage backup
const scrollPositions = new Map<string, number>();

// Save to session storage as backup
const saveScrollPosition = (path: string, position: number) => {
  scrollPositions.set(path, position);
  try {
    sessionStorage.setItem(`scroll_${path}`, position.toString());
  } catch (e) {
    // Ignore storage errors
  }
};

// Get from memory or session storage
const getScrollPosition = (path: string): number | undefined => {
  let position = scrollPositions.get(path);
  if (position === undefined) {
    try {
      const stored = sessionStorage.getItem(`scroll_${path}`);
      if (stored) {
        position = parseInt(stored, 10);
        if (!isNaN(position)) {
          scrollPositions.set(path, position);
        }
      }
    } catch (e) {
      // Ignore storage errors
    }
  }
  return position;
};

export function useScrollRestoration() {
  const location = useLocation();
  const navigationType = useNavigationType();
  const isFirstRender = useRef(true);
  const lastPathname = useRef(location.pathname);

  // Track scroll position continuously
  useEffect(() => {
    let ticking = false;
    
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          saveScrollPosition(location.pathname, window.scrollY);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      // Save final scroll position when component unmounts
      saveScrollPosition(location.pathname, window.scrollY);
    };
  }, [location.pathname]);

  // Handle page navigation and scroll restoration
  useEffect(() => {
    // Save scroll position of previous page before navigating
    if (!isFirstRender.current && lastPathname.current !== location.pathname) {
      saveScrollPosition(lastPathname.current, window.scrollY);
    }

    const restoreScroll = () => {
      // For back/forward navigation, restore scroll position
      if (navigationType === 'POP') {
        const savedPosition = getScrollPosition(location.pathname);
        if (savedPosition !== undefined) {
          // Use a longer delay for back navigation to ensure page is ready
          setTimeout(() => {
            window.scrollTo({
              top: savedPosition,
              behavior: 'auto' // Use auto for instant scroll
            });
          }, 150);
          return;
        }
      }
      
      // For push navigation or no saved position, scroll to top
      setTimeout(() => {
        window.scrollTo({
          top: 0,
          behavior: 'auto'
        });
      }, 0);
    };

    if (isFirstRender.current) {
      isFirstRender.current = false;
      // On first render, check if we need to restore position
      const savedPosition = getScrollPosition(location.pathname);
      if (savedPosition !== undefined) {
        setTimeout(() => {
          window.scrollTo({
            top: savedPosition,
            behavior: 'auto'
          });
        }, 100);
      }
    } else {
      restoreScroll();
    }

    lastPathname.current = location.pathname;
  }, [location.pathname, navigationType]);

  // Handle page unload
  useEffect(() => {
    const handleBeforeUnload = () => {
      saveScrollPosition(location.pathname, window.scrollY);
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [location.pathname]);
}
