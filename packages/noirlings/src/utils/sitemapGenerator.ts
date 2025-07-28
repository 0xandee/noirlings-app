import { getOrderedExercises, getAdvancedExercises } from './exerciseLoader';

interface SitemapUrl {
  loc: string;
  lastmod: string;
  changefreq: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority: string;
}

// Generate sitemap data that can be used client-side or server-side
export async function generateSitemapData(): Promise<SitemapUrl[]> {
  const currentDate = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
  const baseUrl = 'https://noirlings.app';
  
  const urls: SitemapUrl[] = [];

  // Homepage
  urls.push({
    loc: baseUrl,
    lastmod: currentDate,
    changefreq: 'daily',
    priority: '1.0'
  });

  // Advanced page
  urls.push({
    loc: `${baseUrl}/advanced`,
    lastmod: currentDate,
    changefreq: 'weekly',
    priority: '0.9'
  });

  try {
    // Basic exercises
    const basicExercises = await getOrderedExercises();
    
    // Group exercises by category
    const basicCategories = new Set<string>();
    for (const exercise of basicExercises) {
      basicCategories.add(exercise.category);
    }

    // Add basic category pages
    for (const category of basicCategories) {
      urls.push({
        loc: `${baseUrl}?category=${category}`,
        lastmod: currentDate,
        changefreq: 'monthly',
        priority: '0.8'
      });
    }

    // Add individual basic exercises
    for (const exercise of basicExercises) {
      urls.push({
        loc: `${baseUrl}?exercise=${exercise.category}/${exercise.id}`,
        lastmod: currentDate,
        changefreq: 'monthly',
        priority: '0.7'
      });
    }

    // Advanced exercises
    const advancedExercises = await getAdvancedExercises();
    
    // Group advanced exercises by category
    const advancedCategories = new Set<string>();
    for (const exercise of advancedExercises) {
      advancedCategories.add(exercise.category);
    }

    // Add advanced category pages
    for (const category of advancedCategories) {
      urls.push({
        loc: `${baseUrl}/advanced?category=${category}`,
        lastmod: currentDate,
        changefreq: 'monthly',
        priority: '0.8'
      });
    }

    // Add individual advanced exercises
    for (const exercise of advancedExercises) {
      urls.push({
        loc: `${baseUrl}/advanced?exercise=${exercise.category}/${exercise.id}`,
        lastmod: currentDate,
        changefreq: 'monthly',
        priority: '0.7'
      });
    }

  } catch (error) {
    console.error('Error generating sitemap data:', error);
  }

  return urls;
}

// Generate XML sitemap string
export function generateSitemapXML(urls: SitemapUrl[]): string {
  const xmlHeader = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">`;

  const xmlFooter = `</urlset>`;

  const xmlUrls = urls.map(url => `
  <url>
    <loc>${url.loc}</loc>
    <lastmod>${url.lastmod}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`).join('');

  return xmlHeader + xmlUrls + '\n' + xmlFooter;
}

// Generate JSON sitemap (useful for debugging or API endpoints)
export function generateSitemapJSON(urls: SitemapUrl[]): string {
  return JSON.stringify({
    generated: new Date().toISOString(),
    urls: urls
  }, null, 2);
}

// Utility function to download sitemap (for development/debugging)
export async function downloadSitemap(format: 'xml' | 'json' = 'xml') {
  try {
    const urls = await generateSitemapData();
    let content: string;
    let filename: string;
    let mimeType: string;

    if (format === 'xml') {
      content = generateSitemapXML(urls);
      filename = 'sitemap.xml';
      mimeType = 'application/xml';
    } else {
      content = generateSitemapJSON(urls);
      filename = 'sitemap.json';
      mimeType = 'application/json';
    }

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    console.log(`Generated sitemap with ${urls.length} URLs`);
  } catch (error) {
    console.error('Error downloading sitemap:', error);
  }
}

// Function to validate sitemap URLs (useful for testing)
export function validateSitemapUrls(urls: SitemapUrl[]): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  for (const url of urls) {
    // Check URL format
    try {
      new URL(url.loc);
    } catch {
      errors.push(`Invalid URL: ${url.loc}`);
    }

    // Check priority range
    const priority = parseFloat(url.priority);
    if (priority < 0 || priority > 1) {
      errors.push(`Priority out of range (0-1): ${url.priority} for ${url.loc}`);
    }

    // Check date format
    if (!/^\d{4}-\d{2}-\d{2}$/.test(url.lastmod)) {
      errors.push(`Invalid date format: ${url.lastmod} for ${url.loc}`);
    }

    // Check changefreq values
    const validFreq = ['always', 'hourly', 'daily', 'weekly', 'monthly', 'yearly', 'never'];
    if (!validFreq.includes(url.changefreq)) {
      errors.push(`Invalid changefreq: ${url.changefreq} for ${url.loc}`);
    }
  }

  return {
    valid: errors.length === 0,
    errors
  };
}