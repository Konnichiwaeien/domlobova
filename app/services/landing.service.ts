import qs from 'qs';

/**
 * Types and interfaces for the Strapi Landing API data structures
 */
export interface MarqueePhoto {
  id: number;
  documentId?: string;
  url: string;
}

export interface LandingData {
  id?: number;
  documentId?: string;
  hero?: {
    id: number;
    titleTop?: string;
    titleBottom?: string;
    descr?: string;
    video?: {
      url: string;
      mime?: string;
    };
    photos?: MarqueePhoto[];
  };
  welcome?: {
    id: number;
    title?: string;
    descr?: string;
    photos?: MarqueePhoto[];
  };
  about?: {
    id: number;
    title?: string;
    descr?: string;
    photos?: MarqueePhoto[];
    stats?: {
      id: number;
      value?: number;
      suffix?: string;
      label?: string;
    }[];
    features?: any[];
    promo?: {
      id: number;
      title?: string;
      images?: MarqueePhoto[];
    };
  };
  campaigns?: {
    id: number;
    title?: string;
    descr?: string;
    campaigns?: any[]; // For active collectives, if needed
  };
  partners?: {
    id: number;
    documentId?: string;
    name?: string;
    city?: string;
    url?: string;
  }[];
  marqueePhotos?: MarqueePhoto[]; // Keeping default for backwards compatibility if needed
  stories?: any[];
  needs?: any;
  volunteers_needs?: any;
  // SEO Metadata
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string;
}

export interface StrapiResponse<T> {
  data: T[];
  meta: {
    pagination?: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

/**
 * Custom error class for API failures
 */
export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

/**
 * Fetches landing page data by generating the appropriate Strapi v5 query.
 *
 * @param slug - The unique slug identifier for the landing page.
 * @returns A promise resolving to the LandingData object, or null if it cannot be retrieved.
 */
export async function getLandingData(slug: string): Promise<LandingData | null> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  if (!apiUrl) {
    throw new Error('Configuration Error: NEXT_PUBLIC_API_URL environment variable is missing.');
  }

  try {
    const query = qs.stringify({
      filters: {
        slug: {
          $eq: slug
        }
      },
      populate: [
        'marqueePhotos',
        'hero',
        'hero.video',
        'hero.photos',
        'welcome.photos',
        'about.photos',
        'about.stats',
        'about.features',
        'about.features.image',
        'about.promo',
        'about.promo.images',
        'campaigns.campaigns',
        'campaigns.campaigns.image',
        'fundraisings',
        'stories',
        'stories.image',
        'needs',
        'needs.needs',
        'needs.needs.image',
        'volunteers_needs',
        'volunteers_needs.volunteers_needs',
        'volunteers_needs.volunteers_needs.image'
      ]
    }, {
      encodeValuesOnly: true
    });

    const url = `${apiUrl}/landings?${query}`;

    const response = await fetch(url, {
      next: {
        revalidate: 3600, // Revalidate every hour
        tags: [`landing-${slug}`]
      },
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new ApiError(
        response.status,
        `Failed to fetch landing data for slug "${slug}": ${response.statusText}`
      );
    }

    const { data }: StrapiResponse<LandingData> = await response.json();

    if (!data || data.length === 0) {
      console.warn(`[getLandingData] No landing page found for slug: ${slug}`);
      return null;
    }

    return data[0];
  } catch (error) {
    if (error instanceof ApiError) {
      console.error(`[API Error] ${error.status}: ${error.message}`);
    } else {
      console.error(`[Fetch Error] Failed to retrieve landing data:`, error);
    }
    // Return null to allow graceful UI fallback instead of fully crashing the page
    return null;
  }
}

/**
 * Fetches data for a single campaign by its document ID.
 *
 * @param documentId - The unique document identifier for the campaign.
 * @returns A promise resolving to the campaign data object, or null if it cannot be retrieved.
 */
export async function getCampaignData(idOrSlug: string): Promise<any | null> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  if (!apiUrl) {
    throw new Error('Configuration Error: NEXT_PUBLIC_API_URL environment variable is missing.');
  }

  try {
    const query = qs.stringify({
      filters: {
        $or: [
          { slug: { $eq: idOrSlug } },
          { documentId: { $eq: idOrSlug } }
        ]
      },
      populate: ['image']
    }, {
      encodeValuesOnly: true
    });

    const url = `${apiUrl}/campaigns?${query}`;

    const response = await fetch(url, {
      next: {
        revalidate: 60,
        tags: [`campaign-${idOrSlug}`]
      },
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new ApiError(
        response.status,
        `Failed to fetch campaign data for identifier "${idOrSlug}": ${response.statusText}`
      );
    }

    const { data } = await response.json();
    return (data && data.length > 0) ? data[0] : null;
  } catch (error) {
    if (error instanceof ApiError) {
      console.error(`[API Error] ${error.status}: ${error.message}`);
    } else {
      console.error(`[Fetch Error] Failed to retrieve campaign data:`, error);
    }
    return null;
  }
}

/**
 * Fetches all campaigns.
 *
 * @returns A promise resolving to an array of all campaigns.
 */
export async function getAllCampaigns(): Promise<any[]> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  if (!apiUrl) {
    throw new Error('Configuration Error: NEXT_PUBLIC_API_URL environment variable is missing.');
  }

  try {
    const query = qs.stringify({
      populate: ['image'],
      sort: ['createdAt:desc'],
      pagination: {
        limit: 100
      }
    }, {
      encodeValuesOnly: true
    });

    const url = `${apiUrl}/campaigns?${query}`;

    const response = await fetch(url, {
      next: {
        revalidate: 60,
        tags: ['campaigns-all']
      },
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new ApiError(
        response.status,
        `Failed to fetch all campaigns: ${response.statusText}`
      );
    }

    const { data } = await response.json();
    return data || [];
  } catch (error) {
    if (error instanceof ApiError) {
      console.error(`[API Error] ${error.status}: ${error.message}`);
    } else {
      console.error(`[Fetch Error] Failed to retrieve all campaigns:`, error);
    }
    return [];
  }
}


