import React from 'react';
import { Helmet } from 'react-helmet-async';
import { SEOData, generateStructuredData } from '../utils/seo';
import { Exercise } from '../utils/exerciseLoader';

interface SEOHeadProps {
  seoData: SEOData;
  exercise?: Exercise;
}

export const SEOHead: React.FC<SEOHeadProps> = ({ seoData, exercise }) => {
  const structuredData = generateStructuredData(seoData, exercise);
  
  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{seoData.title}</title>
      <meta name="description" content={seoData.description} />
      <meta name="keywords" content={seoData.keywords.join(', ')} />
      
      {/* Canonical URL */}
      <link rel="canonical" href={seoData.url} />
      
      {/* Language */}
      <html lang="en" />
      <meta name="language" content="en-US" />
      
      {/* Open Graph Meta Tags */}
      <meta property="og:url" content={seoData.url} />
      <meta property="og:type" content={seoData.type} />
      <meta property="og:title" content={seoData.title} />
      <meta property="og:description" content={seoData.description} />
      <meta property="og:image" content={seoData.image} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:site_name" content="Noirlings.app" />
      <meta property="og:locale" content="en_US" />
      
      {/* Twitter Card Meta Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta property="twitter:domain" content="noirlings.app" />
      <meta property="twitter:url" content={seoData.url} />
      <meta name="twitter:title" content={seoData.title} />
      <meta name="twitter:description" content={seoData.description} />
      <meta name="twitter:image" content={seoData.image} />
      <meta name="twitter:creator" content="@andeebtceth" />
      <meta name="twitter:site" content="@andeebtceth" />
      
      {/* Additional SEO Meta Tags */}
      <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      <meta name="author" content="andeebtceth" />
      <meta name="publisher" content="Noirlings.app" />
      <meta name="rating" content="General" />
      <meta name="revisit-after" content="7 days" />
      
      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(structuredData)}
      </script>
      
      {/* Additional Educational Structured Data for exercises */}
      {exercise && (
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "LearningResource",
            "name": seoData.title,
            "description": seoData.description,
            "learningResourceType": "Exercise",
            "educationalLevel": exercise.difficulty || "intermediate",
            "teaches": exercise.category || "programming",
            "inLanguage": "en-US",
            "isAccessibleForFree": true,
            "provider": {
              "@type": "Organization",
              "name": "Noirlings.app",
              "url": "https://noirlings.app"
            },
            "about": {
              "@type": "Thing",
              "name": "Noir Programming Language",
              "description": "Domain-specific language for zero-knowledge proofs"
            }
          })}
        </script>
      )}
      
      {/* Favicon and App Icons */}
      <link rel="icon" type="image/x-icon" href="/noirlingsapp.ico" />
      <link rel="apple-touch-icon" sizes="180x180" href="/noirlingsapp.ico" />
      <link rel="icon" type="image/png" sizes="32x32" href="/noirlingsapp.ico" />
      <link rel="icon" type="image/png" sizes="16x16" href="/noirlingsapp.ico" />
      
      {/* Web App Manifest */}
      <meta name="theme-color" content="#8B5CF6" />
      <meta name="msapplication-TileColor" content="#8B5CF6" />
      
      {/* Performance and Loading Hints */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
    </Helmet>
  );
};