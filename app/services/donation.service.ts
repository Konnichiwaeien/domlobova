import qs from 'qs';
import { ApiError } from './landing.service';

export interface DonationRecord {
  id: number;
  documentId?: string;
  amount: number;
  currency: string;
  status: string;
  donorName?: string;
  isAnonymous: boolean;
  isRecurring: boolean;
  createdAt: string;
}

export interface StrapiDonationsResponse {
  data: DonationRecord[];
}

export async function getRecentDonations(limit: number = 20): Promise<DonationRecord[]> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const apiKey = process.env.REST_API_KEY;

  if (!apiUrl || !apiKey) {
    console.warn('[getRecentDonations] Configuration Error: NEXT_PUBLIC_API_URL or REST_API_KEY environment variable is missing.');
    return [];
  }

  try {
    const query = qs.stringify({
      filters: {
        status: {
          $eq: 'completed'
        }
      },
      sort: ['createdAt:desc'],
      pagination: {
        limit: limit
      },
      fields: ['amount', 'currency', 'status', 'donorName', 'isAnonymous', 'isRecurring', 'createdAt']
    }, {
      encodeValuesOnly: true
    });

    const url = `${apiUrl}/donations?${query}`;

    const response = await fetch(url, {
      next: {
        revalidate: 60,
        tags: ['donations']
      },
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
    });

    if (!response.ok) {
      throw new ApiError(
        response.status,
        `Failed to fetch recent donations: ${response.statusText}`
      );
    }

    const { data }: StrapiDonationsResponse = await response.json();

    return data || [];
  } catch (error) {
    if (error instanceof ApiError) {
      console.error(`[API Error] ${error.status}: ${error.message}`);
    } else {
      console.error(`[Fetch Error] Failed to retrieve recent donations:`, error);
    }
    return [];
  }
}

/**
 * Fetches recent completed donations for a specific campaign by its document ID.
 *
 * @param campaignId - The unique document identifier for the campaign.
 * @param limit - The maximum number of donations to retrieve.
 * @returns A promise resolving to an array of DonationRecord objects.
 */
export async function getRecentDonationsForCampaign(campaignId: string, limit: number = 20): Promise<DonationRecord[]> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const apiKey = process.env.REST_API_KEY;

  if (!apiUrl || !apiKey) {
    console.warn('[getRecentDonationsForCampaign] Configuration Error: NEXT_PUBLIC_API_URL or REST_API_KEY environment variable is missing.');
    return [];
  }

  try {
    const query = qs.stringify({
      filters: {
        status: {
          $eq: 'completed'
        },
        campaign: {
          documentId: {
            $eq: campaignId
          }
        }
      },
      sort: ['createdAt:desc'],
      pagination: {
        limit: limit
      },
      fields: ['amount', 'currency', 'status', 'donorName', 'isAnonymous', 'isRecurring', 'createdAt']
    }, {
      encodeValuesOnly: true
    });

    const url = `${apiUrl}/donations?${query}`;

    const response = await fetch(url, {
      next: {
        revalidate: 30, // Revalidate every 30s for real-time donations
        tags: [`donations-campaign-${campaignId}`]
      },
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
    });

    if (!response.ok) {
      throw new ApiError(
        response.status,
        `Failed to fetch campaign donations: ${response.statusText}`
      );
    }

    const { data }: StrapiDonationsResponse = await response.json();
    return data || [];
  } catch (error) {
    if (error instanceof ApiError) {
      console.error(`[API Error] ${error.status}: ${error.message}`);
    } else {
      console.error(`[Fetch Error] Failed to retrieve campaign donations:`, error);
    }
    return [];
  }
}

