import { Exercise } from './exerciseLoader';

export interface SEOData {
  title: string;
  description: string;
  keywords: string[];
  image: string;
  url: string;
  type: string;
}

// Base SEO data for the application
export const baseSEO: SEOData = {
  title: 'Noirlings.app - Learn Noir Programming Language',
  description: 'Interactive learning platform for the Noir programming language. Master zero-knowledge proofs, privacy programming, and cryptographic concepts through hands-on exercises and tutorials.',
  keywords: [
    'noir programming language',
    'zero knowledge proofs',
    'zkp',
    'privacy programming',
    'cryptography',
    'blockchain development',
    'interactive learning',
    'coding tutorials',
    'noir lang',
    'zk programming'
  ],
  image: 'https://opengraph.b-cdn.net/production/images/62488971-bd71-48ba-ad5c-bebc490cce57.png?token=t2C8imb5PNGz_PlWYzd9bMJ5hGzqv_VLyjCAIw90wmw&height=630&width=1200&expires=33282143125',
  url: 'https://noirlings.app',
  type: 'website'
};

// Advanced exercises page SEO
export const advancedSEO: SEOData = {
  title: 'Advanced Noir Programming - Privacy, Cryptography & ZK Proofs | Noirlings.app',
  description: 'Master advanced Noir programming concepts including merkle trees, hash functions, ECDSA signatures, privacy systems, and Ethereum integration. Interactive tutorials and exercises.',
  keywords: [
    'advanced noir programming',
    'merkle trees noir',
    'noir hash functions',
    'ecdsa signatures noir',
    'privacy systems noir',
    'ethereum noir integration',
    'advanced cryptography',
    'zk proof development',
    'blockchain privacy',
    'noir advanced tutorials'
  ],
  image: 'https://opengraph.b-cdn.net/production/images/62488971-bd71-48ba-ad5c-bebc490cce57.png?token=t2C8imb5PNGz_PlWYzd9bMJ5hGzqv_VLyjCAIw90wmw&height=630&width=1200&expires=33282143125',
  url: 'https://noirlings.app/advanced',
  type: 'website'
};

// Category-specific keywords mapping
export const categoryKeywords: Record<string, string[]> = {
  // Basic categories
  intro: ['noir introduction', 'getting started noir', 'noir basics'],
  variables: ['noir variables', 'noir data types', 'variable declaration noir'],
  'control-flow': ['noir control flow', 'if statements noir', 'loops noir'],
  arrays: ['noir arrays', 'array manipulation noir', 'data structures noir'],
  structs: ['noir structs', 'custom types noir', 'structured data noir'],
  references: ['noir references', 'memory management noir', 'pointers noir'],
  slices: ['noir slices', 'array slicing noir', 'dynamic arrays noir'],
  tuples: ['noir tuples', 'multiple values noir', 'tuple destructuring noir'],
  strings: ['noir strings', 'string manipulation noir', 'text processing noir'],
  integers: ['noir integers', 'integer types noir', 'numeric operations noir'],
  traits: ['noir traits', 'interfaces noir', 'polymorphism noir'],
  fields: ['noir field elements', 'finite fields noir', 'field arithmetic noir'],
  quizs: ['noir quiz', 'noir practice', 'noir assessment'],
  
  // Advanced categories
  hashes: ['noir hash functions', 'cryptographic hashing noir', 'blake2s noir', 'keccak noir', 'pedersen hash noir'],
  embedded_curves: ['noir elliptic curves', 'curve operations noir', 'scalar multiplication noir'],
  merkle_trees: ['noir merkle trees', 'merkle proof noir', 'tree structures noir', 'cryptographic trees'],
  signatures: ['noir signatures', 'ecdsa noir', 'digital signatures noir', 'cryptographic signatures'],
  optimization: ['noir optimization', 'performance noir', 'efficient circuits noir'],
  ethereum: ['noir ethereum', 'blockchain integration noir', 'ethereum proofs noir', 'trie structures noir'],
  privacy: ['noir privacy', 'private computations noir', 'confidential transactions noir', 'privacy preserving noir'],
  recursive_proofs: ['noir recursive proofs', 'proof composition noir', 'recursive zkp noir']
};

// Category descriptions for SEO
export const categoryDescriptions: Record<string, string> = {
  // Basic categories
  intro: 'Introduction to Noir programming language fundamentals and zero-knowledge proof concepts',
  variables: 'Learn Noir variable declarations, data types, and memory management basics',
  'control-flow': 'Master Noir control flow structures including conditionals and loops',
  arrays: 'Understand Noir array operations, indexing, and dynamic data structures',
  structs: 'Create and manipulate custom data structures using Noir structs',
  references: 'Work with Noir references and understand memory safety concepts',
  slices: 'Learn dynamic array manipulation and slicing operations in Noir',
  tuples: 'Handle multiple values efficiently using Noir tuple structures',
  strings: 'Process and manipulate text data using Noir string operations',
  integers: 'Master numeric computations and integer type systems in Noir',
  traits: 'Implement interfaces and polymorphism using Noir trait system',
  fields: 'Understand finite field arithmetic and cryptographic field operations',
  quizs: 'Test your Noir programming knowledge with interactive assessments',
  
  // Advanced categories
  hashes: 'Implement cryptographic hash functions including Blake2s, Keccak, and Pedersen hashes',
  embedded_curves: 'Work with elliptic curve operations and scalar multiplication in zero-knowledge circuits',
  merkle_trees: 'Build and verify Merkle tree structures for efficient data integrity proofs',
  signatures: 'Implement and verify digital signatures including ECDSA in Noir circuits',
  optimization: 'Optimize Noir circuits for better performance and reduced constraint counts',
  ethereum: 'Integrate Noir with Ethereum blockchain including state proofs and trie operations',
  privacy: 'Build privacy-preserving systems with confidential transactions and zero-knowledge proofs',
  recursive_proofs: 'Compose and verify recursive zero-knowledge proofs for scalable systems'
};

// Generate SEO data for a specific exercise (without dynamic titles)
export function generateExerciseSEO(exercise: Exercise, category: string, isAdvanced: boolean = false): SEOData {
  const categoryKeywordList = categoryKeywords[category] || [];
  const categoryDesc = categoryDescriptions[category] || '';
  
  const baseTitle = isAdvanced ? advancedSEO.title : baseSEO.title;
  
  let description = `${categoryDesc}. `;
  if (exercise.locales?.en?.description) {
    const cleanDesc = exercise.locales.en.description
      .replace(/\n/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
      .substring(0, 120);
    description += `${cleanDesc}. `;
  }
  const difficulty = exercise.difficulty || 'intermediate';
  description += `Difficulty: ${difficulty}. Interactive Noir programming tutorial.`;
  
  const keywords = [
    `noir ${category.replace('-', ' ')}`,
    `noir ${difficulty} tutorial`,
    ...categoryKeywordList,
    'noir programming',
    'zero knowledge proofs',
    'interactive coding'
  ];
  
  const baseUrl = isAdvanced ? 'https://noirlings.app/advanced' : 'https://noirlings.app';
  
  return {
    title: baseTitle, // Use static title instead of dynamic
    description,
    keywords,
    image: baseSEO.image,
    url: baseUrl,
    type: 'article'
  };
}

// Generate structured data for educational content
export function generateStructuredData(seoData: SEOData, exercise?: Exercise) {
  const baseStructuredData = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    "name": "Noirlings.app",
    "description": "Interactive learning platform for the Noir programming language",
    "url": "https://noirlings.app",
    "logo": "https://noirlings.app/noirlingsapp.ico",
    "sameAs": [
      "https://github.com/0xandee/noirlings-app"
    ]
  };

  if (exercise) {
    return {
      ...baseStructuredData,
      "@type": ["EducationalOrganization", "Course"],
      "courseCode": exercise.id,
      "name": seoData.title,
      "description": seoData.description,
      "educationalLevel": exercise.difficulty || "intermediate",
      "teaches": exercise.category || "programming",
      "learningResourceType": "Interactive Exercise",
      "inLanguage": "en-US",
      "provider": {
        "@type": "Organization",
        "name": "Noirlings.app",
        "url": "https://noirlings.app"
      }
    };
  }

  return baseStructuredData;
}

// Get current route SEO data
export function getRouteSEO(pathname: string, currentExercise?: Exercise, currentCategory?: string): SEOData {
  if (pathname === '/advanced') {
    if (currentExercise && currentCategory) {
      return generateExerciseSEO(currentExercise, currentCategory, true);
    }
    return advancedSEO;
  }
  
  if (pathname === '/' || pathname === '') {
    if (currentExercise && currentCategory) {
      return generateExerciseSEO(currentExercise, currentCategory, false);
    }
    return baseSEO;
  }
  
  return baseSEO;
}