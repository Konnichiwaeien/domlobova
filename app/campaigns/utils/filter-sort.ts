export interface CampaignImage {
  id?: number;
  url: string;
  mime?: string;
}

export interface Campaign {
  id: number;
  documentId?: string;
  slug?: string;
  name?: string;
  descr?: string;
  goal?: number;
  current?: number;
  active?: boolean;
  primary?: boolean;
  closed?: boolean;
  createdAt?: string;
  updatedAt?: string;
  image?: CampaignImage;
}

/**
 * Filter campaigns list based on text query and category tabs.
 *
 * @param campaigns - The raw campaigns array from the API
 * @param search - The search input text query
 * @param filterTab - The filter category tab ('all' | 'active' | 'primary' | 'closed')
 * @returns A new filtered campaigns array
 */
export function filterCampaigns(
  campaigns: Campaign[],
  search: string,
  filterTab: string
): Campaign[] {
  let filtered = [...campaigns];

  // 1. Text Search matching
  if (search.trim()) {
    const q = search.toLowerCase().trim();
    filtered = filtered.filter(
      (c) =>
        (c.name && c.name.toLowerCase().includes(q)) ||
        (c.descr && c.descr.toLowerCase().includes(q))
    );
  }

  // 2. Category filtering
  if (filterTab === "active") {
    filtered = filtered.filter((c) => !c.closed);
  } else if (filterTab === "primary") {
    filtered = filtered.filter((c) => c.primary);
  } else if (filterTab === "closed") {
    filtered = filtered.filter((c) => c.closed);
  }

  return filtered;
}

/**
 * Sort campaigns list based on selected ordering criteria.
 *
 * @param campaigns - The campaigns array to sort
 * @param sortBy - The sorting criteria string
 * @returns A new sorted campaigns array
 */
export function sortCampaigns(campaigns: Campaign[], sortBy: string): Campaign[] {
  const sorted = [...campaigns];

  sorted.sort((a, b) => {
    const aGoal = a.goal || 0;
    const aCurrent = a.current || 0;
    const aPercent = aGoal > 0 ? (aCurrent / aGoal) * 100 : 0;

    const bGoal = b.goal || 0;
    const bCurrent = b.current || 0;
    const bPercent = bGoal > 0 ? (bCurrent / bGoal) * 100 : 0;

    const aDate = a.createdAt ? new Date(a.createdAt).getTime() : 0;
    const bDate = b.createdAt ? new Date(b.createdAt).getTime() : 0;

    switch (sortBy) {
      case "newest":
        return bDate - aDate;
      case "oldest":
        return aDate - bDate;
      case "progress_desc":
        return bPercent - aPercent;
      case "progress_asc":
        return aPercent - bPercent;
      case "urgency":
        // Active first, then closed
        if (!!a.closed !== !!b.closed) {
          return a.closed ? 1 : -1;
        }
        // Active closest to completion first (highest percentage)
        return bPercent - aPercent;
      case "goal_desc":
        return bGoal - aGoal;
      case "goal_asc":
        return aGoal - bGoal;
      default:
        return 0;
    }
  });

  return sorted;
}
