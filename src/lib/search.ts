// Advanced search and discovery system for medical content

export interface SearchQuery {
  query: string;
  filters: SearchFilters;
  sort: SortOption;
  page: number;
  limit: number;
}

export interface SearchFilters {
  contentType?: ContentType[];
  accessType?: AccessType[];
  specialties?: string[];
  cmeCredits?: { min?: number; max?: number };
  priceRange?: { min?: number; max?: number };
  dateRange?: { start?: Date; end?: Date };
  authors?: string[];
  tags?: string[];
  difficulty?: DifficultyLevel[];
  duration?: { min?: number; max?: number }; // in minutes
  rating?: { min?: number; max?: number };
}

export type ContentType = 'ARTICLE' | 'VIDEO' | 'CASE_STUDY' | 'CONFERENCE';
export type AccessType = 'FREE' | 'PAID' | 'CME';
export type DifficultyLevel = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT';
export type SortOption = 'RELEVANCE' | 'DATE' | 'POPULARITY' | 'RATING' | 'CME_CREDITS' | 'PRICE';

export interface SearchResult {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  author: {
    id: string;
    name: string;
    specialty: string[];
    credentials: string;
  };
  type: ContentType;
  accessType: AccessType;
  price?: number;
  cmeCredits?: number;
  tags: string[];
  specialties: string[];
  difficulty: DifficultyLevel;
  publishedAt: Date;
  updatedAt: Date;
  metrics: {
    views: number;
    likes: number;
    shares: number;
    comments: number;
    rating: number;
    engagementScore: number;
  };
  highlighted: {
    title?: string;
    content?: string;
    tags?: string[];
  };
}

export interface SearchResponse {
  results: SearchResult[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
  aggregations: SearchAggregations;
  suggestions: string[];
  relatedQueries: string[];
}

export interface SearchAggregations {
  contentTypes: Array<{ value: ContentType; count: number }>;
  accessTypes: Array<{ value: AccessType; count: number }>;
  specialties: Array<{ value: string; count: number }>;
  authors: Array<{ value: string; name: string; count: number }>;
  tags: Array<{ value: string; count: number }>;
  priceRanges: Array<{ range: string; count: number }>;
  cmeCredits: Array<{ range: string; count: number }>;
}

export interface RecommendationRequest {
  userId?: string;
  contentId?: string;
  specialties?: string[];
  interactionHistory?: string[];
  limit?: number;
  type: 'SIMILAR' | 'PERSONALIZED' | 'TRENDING' | 'SPECIALTY_BASED';
}

export interface RecommendationResponse {
  recommendations: SearchResult[];
  reason: string;
  confidence: number;
}

export interface TrendingTopic {
  term: string;
  category: string;
  searchCount: number;
  growthRate: number;
  relatedTerms: string[];
}

// Medical terminology search utilities
export class MedicalSearchEngine {
  private static medicalSynonyms: Record<string, string[]> = {
    'heart attack': ['myocardial infarction', 'MI', 'acute coronary syndrome'],
    'stroke': ['cerebrovascular accident', 'CVA', 'brain attack'],
    'diabetes': ['diabetes mellitus', 'DM', 'hyperglycemia'],
    'hypertension': ['high blood pressure', 'HTN', 'elevated BP'],
    'pneumonia': ['lung infection', 'pulmonary infection'],
    'asthma': ['reactive airway disease', 'bronchial asthma'],
    'copd': ['chronic obstructive pulmonary disease', 'emphysema', 'chronic bronchitis'],
    'covid': ['coronavirus', 'sars-cov-2', 'covid-19', 'corona virus'],
    'cancer': ['neoplasm', 'malignancy', 'tumor', 'carcinoma'],
    'fracture': ['broken bone', 'bone break', 'fx'],
  };

  private static medicalAbbreviations: Record<string, string> = {
    'MI': 'myocardial infarction',
    'CVA': 'cerebrovascular accident',
    'HTN': 'hypertension',
    'DM': 'diabetes mellitus',
    'COPD': 'chronic obstructive pulmonary disease',
    'CHF': 'congestive heart failure',
    'CAD': 'coronary artery disease',
    'GERD': 'gastroesophageal reflux disease',
    'UTI': 'urinary tract infection',
    'DVT': 'deep vein thrombosis',
    'PE': 'pulmonary embolism',
    'PTSD': 'post-traumatic stress disorder',
    'ADHD': 'attention deficit hyperactivity disorder',
    'IBS': 'irritable bowel syndrome',
    'IBD': 'inflammatory bowel disease',
  };

  public static expandMedicalQuery(query: string): string[] {
    const expandedTerms = [query.toLowerCase()];
    const words = query.toLowerCase().split(/\s+/);

    // Add synonyms
    for (const [term, synonyms] of Object.entries(this.medicalSynonyms)) {
      if (query.toLowerCase().includes(term)) {
        expandedTerms.push(...synonyms);
      }
    }

    // Expand abbreviations
    for (const word of words) {
      const upperWord = word.toUpperCase();
      if (this.medicalAbbreviations[upperWord]) {
        expandedTerms.push(this.medicalAbbreviations[upperWord]);
      }
    }

    // Add partial matches for drug names and conditions
    if (words.length === 1 && words[0].length > 3) {
      expandedTerms.push(`${words[0]}*`); // Wildcard for partial matching
    }

    return [...new Set(expandedTerms)];
  }

  public static buildSearchVector(content: string, title: string, tags: string[]): string {
    // Create search vector with weighted content
    const titleWeight = 3;
    const tagWeight = 2;
    const contentWeight = 1;

    const searchTokens = [
      ...Array(titleWeight).fill(title),
      ...Array(tagWeight).fill(tags.join(' ')),
      ...Array(contentWeight).fill(content.substring(0, 1000)), // Limit content length
    ];

    return searchTokens.join(' ').toLowerCase();
  }

  public static calculateRelevanceScore(
    query: string,
    result: SearchResult,
    userSpecialties: string[] = []
  ): number {
    let score = 0;
    const queryLower = query.toLowerCase();
    const expandedTerms = this.expandMedicalQuery(query);

    // Title matching (highest weight)
    if (result.title.toLowerCase().includes(queryLower)) {
      score += 100;
    }

    // Exact phrase matching in title
    expandedTerms.forEach(term => {
      if (result.title.toLowerCase().includes(term)) {
        score += 80;
      }
    });

    // Tag matching
    result.tags.forEach(tag => {
      if (expandedTerms.some(term => tag.toLowerCase().includes(term))) {
        score += 50;
      }
    });

    // Content matching (lower weight due to length)
    const contentMatches = expandedTerms.filter(term => 
      result.content.toLowerCase().includes(term)
    ).length;
    score += contentMatches * 10;

    // Specialty relevance boost
    if (userSpecialties.length > 0) {
      const specialtyMatch = result.specialties.some(specialty =>
        userSpecialties.includes(specialty)
      );
      if (specialtyMatch) {
        score += 30;
      }
    }

    // Quality indicators
    score += Math.min(result.metrics.rating * 10, 50);
    score += Math.min(result.metrics.engagementScore * 0.5, 25);

    // Recency boost (content within last 30 days)
    const daysSincePublished = Math.floor(
      (Date.now() - new Date(result.publishedAt).getTime()) / (1000 * 60 * 60 * 24)
    );
    if (daysSincePublished <= 30) {
      score += 20 - (daysSincePublished * 0.67); // Diminishing boost
    }

    return Math.round(score);
  }

  public static generateSearchSuggestions(query: string, recentSearches: string[]): string[] {
    const suggestions: string[] = [];
    const queryLower = query.toLowerCase();

    // Medical abbreviation suggestions
    for (const [abbr, fullForm] of Object.entries(this.medicalAbbreviations)) {
      if (abbr.toLowerCase().startsWith(queryLower) || 
          fullForm.toLowerCase().includes(queryLower)) {
        suggestions.push(fullForm);
        if (abbr.toLowerCase() !== queryLower) {
          suggestions.push(abbr);
        }
      }
    }

    // Synonym suggestions
    for (const [term, synonyms] of Object.entries(this.medicalSynonyms)) {
      if (term.includes(queryLower)) {
        suggestions.push(term);
        suggestions.push(...synonyms.filter(s => s !== queryLower));
      }
    }

    // Recent search suggestions
    const relevantRecent = recentSearches.filter(search =>
      search.toLowerCase().includes(queryLower) && search.toLowerCase() !== queryLower
    );
    suggestions.push(...relevantRecent.slice(0, 3));

    // Common medical query patterns
    const medicalPatterns = [
      `${query} symptoms`,
      `${query} treatment`,
      `${query} diagnosis`,
      `${query} guidelines`,
      `${query} case study`,
      `${query} research`,
    ];

    if (query.length > 2) {
      suggestions.push(...medicalPatterns.slice(0, 2));
    }

    // Remove duplicates and return top 8
    return [...new Set(suggestions)].slice(0, 8);
  }
}

// Content recommendation algorithms
export class ContentRecommendationEngine {
  public static calculateContentSimilarity(content1: SearchResult, content2: SearchResult): number {
    let similarity = 0;

    // Tag similarity (Jaccard coefficient)
    const tags1 = new Set(content1.tags.map(t => t.toLowerCase()));
    const tags2 = new Set(content2.tags.map(t => t.toLowerCase()));
    const tagIntersection = new Set([...tags1].filter(x => tags2.has(x)));
    const tagUnion = new Set([...tags1, ...tags2]);
    
    if (tagUnion.size > 0) {
      similarity += (tagIntersection.size / tagUnion.size) * 40;
    }

    // Specialty similarity
    const specialties1 = new Set(content1.specialties);
    const specialties2 = new Set(content2.specialties);
    const specialtyIntersection = new Set([...specialties1].filter(x => specialties2.has(x)));
    
    if (specialties1.size > 0 || specialties2.size > 0) {
      similarity += (specialtyIntersection.size / Math.max(specialties1.size, specialties2.size)) * 30;
    }

    // Content type similarity
    if (content1.type === content2.type) {
      similarity += 15;
    }

    // Author similarity (same specialty)
    const authorSpecialty1 = new Set(content1.author.specialty);
    const authorSpecialty2 = new Set(content2.author.specialty);
    const authorIntersection = new Set([...authorSpecialty1].filter(x => authorSpecialty2.has(x)));
    
    if (authorIntersection.size > 0) {
      similarity += 10;
    }

    // Difficulty level similarity
    if (content1.difficulty === content2.difficulty) {
      similarity += 5;
    }

    return Math.min(similarity, 100);
  }

  public static generatePersonalizedRecommendations(
    userProfile: {
      specialties: string[];
      interactionHistory: string[];
      readingLevel: DifficultyLevel;
      preferredContentTypes: ContentType[];
    },
    availableContent: SearchResult[],
    limit: number = 10
  ): RecommendationResponse {
    const scoredContent = availableContent.map(content => {
      let score = 0;

      // Specialty match
      const specialtyMatch = content.specialties.some(s => 
        userProfile.specialties.includes(s)
      );
      if (specialtyMatch) score += 50;

      // Content type preference
      if (userProfile.preferredContentTypes.includes(content.type)) {
        score += 30;
      }

      // Reading level match
      if (content.difficulty === userProfile.readingLevel) {
        score += 20;
      }

      // Quality indicators
      score += Math.min(content.metrics.engagementScore * 0.3, 15);
      score += Math.min(content.metrics.rating * 3, 15);

      // Avoid already interacted content
      if (userProfile.interactionHistory.includes(content.id)) {
        score -= 25;
      }

      // Boost recent, high-engagement content
      const daysSincePublished = Math.floor(
        (Date.now() - new Date(content.publishedAt).getTime()) / (1000 * 60 * 60 * 24)
      );
      if (daysSincePublished <= 7 && content.metrics.engagementScore > 50) {
        score += 10;
      }

      return { content, score };
    });

    const recommendations = scoredContent
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map(item => item.content);

    return {
      recommendations,
      reason: 'Based on your specialties and reading preferences',
      confidence: recommendations.length > 0 ? 0.85 : 0.0,
    };
  }

  public static generateTrendingContent(
    searchAnalytics: Array<{ query: string; count: number; date: Date }>,
    recentContent: SearchResult[],
    limit: number = 10
  ): SearchResult[] {
    // Calculate trending score based on search frequency and engagement
    const trendingScores = recentContent.map(content => {
      let trendScore = 0;

      // Base engagement score
      trendScore += content.metrics.engagementScore;

      // Search volume boost
      const relatedSearches = searchAnalytics.filter(search =>
        content.tags.some(tag => search.query.toLowerCase().includes(tag.toLowerCase())) ||
        content.title.toLowerCase().includes(search.query.toLowerCase())
      );

      const searchVolume = relatedSearches.reduce((sum, search) => sum + search.count, 0);
      trendScore += Math.min(searchVolume * 2, 50);

      // Recency boost
      const hoursOld = Math.floor(
        (Date.now() - new Date(content.publishedAt).getTime()) / (1000 * 60 * 60)
      );
      if (hoursOld <= 24) {
        trendScore += 30 - (hoursOld * 1.25);
      }

      // Velocity boost (high engagement in short time)
      const engagementVelocity = content.metrics.engagementScore / Math.max(hoursOld, 1);
      trendScore += Math.min(engagementVelocity * 5, 25);

      return { content, trendScore };
    });

    return trendingScores
      .sort((a, b) => b.trendScore - a.trendScore)
      .slice(0, limit)
      .map(item => item.content);
  }
}

// Search analytics and insights
export class SearchAnalytics {
  public static identifyTrendingTopics(
    searchData: Array<{ query: string; timestamp: Date; resultsCount: number }>,
    timeWindow: number = 7 // days
  ): TrendingTopic[] {
    const cutoffDate = new Date(Date.now() - timeWindow * 24 * 60 * 60 * 1000);
    const recentSearches = searchData.filter(search => search.timestamp >= cutoffDate);

    // Group searches by normalized query
    const queryGroups = recentSearches.reduce((groups, search) => {
      const normalizedQuery = search.query.toLowerCase().trim();
      if (!groups[normalizedQuery]) {
        groups[normalizedQuery] = [];
      }
      groups[normalizedQuery].push(search);
      return groups;
    }, {} as Record<string, typeof recentSearches>);

    // Calculate trending metrics
    const trendingTopics: TrendingTopic[] = Object.entries(queryGroups)
      .map(([query, searches]) => {
        const searchCount = searches.length;
        const avgResults = searches.reduce((sum, s) => sum + s.resultsCount, 0) / searches.length;

        // Calculate growth rate (simplified)
        const midpoint = new Date(cutoffDate.getTime() + (timeWindow * 24 * 60 * 60 * 1000) / 2);
        const recentCount = searches.filter(s => s.timestamp >= midpoint).length;
        const earlierCount = searches.filter(s => s.timestamp < midpoint).length;
        const growthRate = earlierCount > 0 ? (recentCount / earlierCount - 1) * 100 : 100;

        // Categorize by medical specialty
        const category = this.categorizeQuery(query);

        return {
          term: query,
          category,
          searchCount,
          growthRate,
          relatedTerms: this.findRelatedTerms(query, Object.keys(queryGroups)),
        };
      })
      .filter(topic => topic.searchCount >= 3) // Minimum threshold
      .sort((a, b) => b.searchCount - a.searchCount);

    return trendingTopics.slice(0, 20);
  }

  private static categorizeQuery(query: string): string {
    const categories = {
      cardiology: ['heart', 'cardiac', 'cardio', 'arrhythmia', 'hypertension', 'mi', 'chest pain'],
      neurology: ['brain', 'neuro', 'stroke', 'seizure', 'headache', 'migraine', 'cva'],
      pulmonology: ['lung', 'respiratory', 'asthma', 'copd', 'pneumonia', 'breathing'],
      endocrinology: ['diabetes', 'thyroid', 'hormone', 'insulin', 'glucose'],
      oncology: ['cancer', 'tumor', 'malignancy', 'chemotherapy', 'radiation'],
      infectious: ['infection', 'bacteria', 'virus', 'antibiotic', 'covid', 'flu'],
      emergency: ['trauma', 'emergency', 'critical', 'shock', 'resuscitation'],
      pediatrics: ['child', 'pediatric', 'infant', 'newborn', 'adolescent'],
      surgery: ['surgical', 'operation', 'procedure', 'incision', 'laparoscopic'],
      psychiatry: ['mental', 'depression', 'anxiety', 'psychiatric', 'therapy'],
    };

    for (const [category, keywords] of Object.entries(categories)) {
      if (keywords.some(keyword => query.toLowerCase().includes(keyword))) {
        return category;
      }
    }

    return 'general';
  }

  private static findRelatedTerms(query: string, allQueries: string[]): string[] {
    const queryWords = query.toLowerCase().split(/\s+/);
    
    return allQueries
      .filter(q => q !== query)
      .filter(q => {
        const qWords = q.toLowerCase().split(/\s+/);
        return queryWords.some(word => qWords.some(qWord => 
          qWord.includes(word) || word.includes(qWord)
        ));
      })
      .slice(0, 5);
  }
}