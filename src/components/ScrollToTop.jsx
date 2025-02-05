import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * A functional component that scrolls the window to the top when the
 * location changes (i.e. when the user navigates to a new page).
 *
 * This component is typically used in conjunction with React Router's
 * `Router` component to ensure that the window is scrolled to the top
 * when the user navigates from one page to another.
 */
export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Scroll to the top of the page
    if (pathname) {
      window.scrollTo({ top: 0});
    }
  }, [pathname]);

  return null;
}
