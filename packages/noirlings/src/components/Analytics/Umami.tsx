import { useEffect } from 'react';

/**
 * Umami Analytics Component
 *
 * Add this component to your app to enable Umami analytics tracking.
 * Make sure to set the following environment variables:
 * - VITE_UMAMI_WEBSITE_ID: Your Umami website ID
 * - VITE_UMAMI_URL: Your Umami server URL (e.g., https://analytics.yourdomain.com)
 */
export const Umami = () => {
  useEffect(() => {
    const websiteId = import.meta.env.VITE_UMAMI_WEBSITE_ID;
    const umamiUrl = import.meta.env.VITE_UMAMI_URL;

    // Only load Umami if both environment variables are set
    if (!websiteId || !umamiUrl) {
      console.warn('Umami analytics not configured. Set VITE_UMAMI_WEBSITE_ID and VITE_UMAMI_URL environment variables.');
      return;
    }

    // Check if script is already loaded
    if (document.querySelector(`script[data-website-id="${websiteId}"]`)) {
      return;
    }

    // Create and append the Umami script
    const script = document.createElement('script');
    script.async = true;
    script.defer = true;
    script.src = `${umamiUrl}/script.js`;
    script.setAttribute('data-website-id', websiteId);

    document.head.appendChild(script);

    // Cleanup function
    return () => {
      const existingScript = document.querySelector(`script[data-website-id="${websiteId}"]`);
      if (existingScript) {
        existingScript.remove();
      }
    };
  }, []);

  return null;
};
